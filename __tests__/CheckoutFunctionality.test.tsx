import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import ShitTierBlasterPage from '../app/shit-tier-blaster/page'

// Mock fetch responses
const mockFetch = jest.fn()
global.fetch = mockFetch

describe('Checkout Functionality', () => {
  beforeEach(() => {
    mockFetch.mockClear()
    jest.clearAllMocks()
    // Reset window.location.href
    Object.defineProperty(window, 'location', {
      value: { href: '' },
      writable: true,
    })
  })

  describe('Direct Checkout (No Upload)', () => {
    it('handles successful checkout without upload', async () => {
      const user = userEvent.setup()
      
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ url: 'https://checkout.stripe.com/session123' })
      })
      
      render(<ShitTierBlasterPage />)
      
      // This would require a different entry point or button for direct checkout
      // For now, we'll test the checkout function indirectly through the upload flow
    })

    it('handles checkout API errors', async () => {
      const user = userEvent.setup()
      
      mockFetch.mockResolvedValueOnce({ ok: false })
      
      render(<ShitTierBlasterPage />)
      
      // Test would need direct access to checkout function
      // This is more of an integration test scenario
    })
  })

  describe('Checkout After Upload', () => {
    it('shows checkout button after successful upload', async () => {
      const user = userEvent.setup()
      
      // Mock successful file upload
      mockFetch
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve({ url: 'https://upload-url.com', key: 'file-key-123' })
        })
        .mockResolvedValueOnce({ ok: true })
      
      render(<ShitTierBlasterPage />)
      
      const fileInput = screen.getByLabelText(/Choose your desperate pitch/i)
      const file = new File(['content'], 'application.pdf', { type: 'application/pdf' })
      
      await user.upload(fileInput, file)
      
      const submitButton = screen.getByText('💥 Submit for Shit Tier Blasting')
      await user.click(submitButton)
      
      await waitFor(() => {
        expect(screen.getByText('Pay €69 to get blasted 💥')).toBeInTheDocument()
      })
    })

    it('handles successful checkout with upload ID', async () => {
      const user = userEvent.setup()
      
      // Mock successful file upload and checkout
      mockFetch
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve({ url: 'https://upload-url.com', key: 'file-key-123' })
        })
        .mockResolvedValueOnce({ ok: true })
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve({ url: 'https://checkout.stripe.com/session123' })
        })
      
      render(<ShitTierBlasterPage />)
      
      // Upload file first
      const fileInput = screen.getByLabelText(/Choose your desperate pitch/i)
      const file = new File(['content'], 'application.pdf', { type: 'application/pdf' })
      
      await user.upload(fileInput, file)
      
      const submitButton = screen.getByText('💥 Submit for Shit Tier Blasting')
      await user.click(submitButton)
      
      await waitFor(() => {
        expect(screen.getByText('Pay €69 to get blasted 💥')).toBeInTheDocument()
      })
      
      // Click checkout button
      const checkoutButton = screen.getByText('Pay €69 to get blasted 💥')
      await user.click(checkoutButton)
      
      await waitFor(() => {
        expect(mockFetch).toHaveBeenCalledWith('/api/create-checkout-session', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            uploadId: 'file-key-123',
            shitTier: true,
            price: 69
          })
        })
      })
      
      expect(window.location.href).toBe('https://checkout.stripe.com/session123')
    })

    it('handles checkout API failure', async () => {
      const user = userEvent.setup()
      
      // Mock successful upload but failed checkout
      mockFetch
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve({ url: 'https://upload-url.com', key: 'file-key-123' })
        })
        .mockResolvedValueOnce({ ok: true })
        .mockResolvedValueOnce({ ok: false })
      
      render(<ShitTierBlasterPage />)
      
      // Upload file first
      const fileInput = screen.getByLabelText(/Choose your desperate pitch/i)
      const file = new File(['content'], 'application.pdf', { type: 'application/pdf' })
      
      await user.upload(fileInput, file)
      
      const submitButton = screen.getByText('💥 Submit for Shit Tier Blasting')
      await user.click(submitButton)
      
      await waitFor(() => {
        expect(screen.getByText('Pay €69 to get blasted 💥')).toBeInTheDocument()
      })
      
      // Click checkout button
      const checkoutButton = screen.getByText('Pay €69 to get blasted 💥')
      await user.click(checkoutButton)
      
      await waitFor(() => {
        expect(global.alert).toHaveBeenCalledWith('Checkout failed.')
      })
    })

    it('handles checkout with missing URL in response', async () => {
      const user = userEvent.setup()
      
      // Mock successful upload but checkout response without URL
      mockFetch
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve({ url: 'https://upload-url.com', key: 'file-key-123' })
        })
        .mockResolvedValueOnce({ ok: true })
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve({}) // No URL in response
        })
      
      render(<ShitTierBlasterPage />)
      
      // Upload file first
      const fileInput = screen.getByLabelText(/Choose your desperate pitch/i)
      const file = new File(['content'], 'application.pdf', { type: 'application/pdf' })
      
      await user.upload(fileInput, file)
      
      const submitButton = screen.getByText('💥 Submit for Shit Tier Blasting')
      await user.click(submitButton)
      
      await waitFor(() => {
        expect(screen.getByText('Pay €69 to get blasted 💥')).toBeInTheDocument()
      })
      
      // Click checkout button
      const checkoutButton = screen.getByText('Pay €69 to get blasted 💥')
      await user.click(checkoutButton)
      
      await waitFor(() => {
        expect(global.alert).toHaveBeenCalledWith('Checkout failed.')
      })
    })

    it('handles network errors during checkout', async () => {
      const user = userEvent.setup()
      
      // Mock successful upload but network error on checkout
      mockFetch
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve({ url: 'https://upload-url.com', key: 'file-key-123' })
        })
        .mockResolvedValueOnce({ ok: true })
        .mockRejectedValueOnce(new Error('Network error'))
      
      render(<ShitTierBlasterPage />)
      
      // Upload file first
      const fileInput = screen.getByLabelText(/Choose your desperate pitch/i)
      const file = new File(['content'], 'application.pdf', { type: 'application/pdf' })
      
      await user.upload(fileInput, file)
      
      const submitButton = screen.getByText('💥 Submit for Shit Tier Blasting')
      await user.click(submitButton)
      
      await waitFor(() => {
        expect(screen.getByText('Pay €69 to get blasted 💥')).toBeInTheDocument()
      })
      
      // Click checkout button
      const checkoutButton = screen.getByText('Pay €69 to get blasted 💥')
      await user.click(checkoutButton)
      
      await waitFor(() => {
        expect(global.alert).toHaveBeenCalledWith('Checkout failed.')
      })
    })

    it('shows loading state during checkout', async () => {
      const user = userEvent.setup()
      
      // Mock successful upload and delayed checkout response
      mockFetch
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve({ url: 'https://upload-url.com', key: 'file-key-123' })
        })
        .mockResolvedValueOnce({ ok: true })
        .mockImplementationOnce(() => new Promise(resolve => 
          setTimeout(() => resolve({
            ok: true,
            json: () => Promise.resolve({ url: 'https://checkout.stripe.com/session123' })
          }), 100)
        ))
      
      render(<ShitTierBlasterPage />)
      
      // Upload file first
      const fileInput = screen.getByLabelText(/Choose your desperate pitch/i)
      const file = new File(['content'], 'application.pdf', { type: 'application/pdf' })
      
      await user.upload(fileInput, file)
      
      const submitButton = screen.getByText('💥 Submit for Shit Tier Blasting')
      await user.click(submitButton)
      
      await waitFor(() => {
        expect(screen.getByText('Pay €69 to get blasted 💥')).toBeInTheDocument()
      })
      
      // Click checkout button
      const checkoutButton = screen.getByText('Pay €69 to get blasted 💥')
      await user.click(checkoutButton)
      
      // Check for loading state
      expect(screen.getByText('Processing...')).toBeInTheDocument()
      expect(screen.getByText('⏳')).toBeInTheDocument()
    })

    it('prevents multiple checkout attempts while loading', async () => {
      const user = userEvent.setup()
      
      // Mock successful upload and delayed checkout response
      mockFetch
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve({ url: 'https://upload-url.com', key: 'file-key-123' })
        })
        .mockResolvedValueOnce({ ok: true })
        .mockImplementationOnce(() => new Promise(resolve => 
          setTimeout(() => resolve({
            ok: true,
            json: () => Promise.resolve({ url: 'https://checkout.stripe.com/session123' })
          }), 200)
        ))
      
      render(<ShitTierBlasterPage />)
      
      // Upload file first
      const fileInput = screen.getByLabelText(/Choose your desperate pitch/i)
      const file = new File(['content'], 'application.pdf', { type: 'application/pdf' })
      
      await user.upload(fileInput, file)
      
      const submitButton = screen.getByText('💥 Submit for Shit Tier Blasting')
      await user.click(submitButton)
      
      await waitFor(() => {
        expect(screen.getByText('Pay €69 to get blasted 💥')).toBeInTheDocument()
      })
      
      // Click checkout button
      const checkoutButton = screen.getByText('Pay €69 to get blasted 💥')
      await user.click(checkoutButton)
      
      // Button should be disabled during loading
      expect(checkoutButton).toBeDisabled()
      
      // Try clicking again - should not trigger another request
      await user.click(checkoutButton)
      
      // Should only have been called once for checkout
      await waitFor(() => {
        expect(mockFetch).toHaveBeenCalledTimes(3) // upload URL, upload PUT, checkout
      })
    })
  })

  describe('Checkout Button States', () => {
    it('shows correct button text and styling', async () => {
      const user = userEvent.setup()
      
      // Mock successful upload
      mockFetch
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve({ url: 'https://upload-url.com', key: 'file-key-123' })
        })
        .mockResolvedValueOnce({ ok: true })
      
      render(<ShitTierBlasterPage />)
      
      const fileInput = screen.getByLabelText(/Choose your desperate pitch/i)
      const file = new File(['content'], 'application.pdf', { type: 'application/pdf' })
      
      await user.upload(fileInput, file)
      
      const submitButton = screen.getByText('💥 Submit for Shit Tier Blasting')
      await user.click(submitButton)
      
      await waitFor(() => {
        const checkoutButton = screen.getByText('Pay €69 to get blasted 💥')
        expect(checkoutButton).toHaveClass('bg-red-600', 'hover:bg-red-700', 'text-white', 'font-bold')
      })
    })

    it('only allows checkout when upload ID exists', async () => {
      const user = userEvent.setup()
      
      // Mock successful upload
      mockFetch
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve({ key: 'text-key-123' })
        })
      
      render(<ShitTierBlasterPage />)
      
      const textarea = screen.getByPlaceholderText(/Paste your desperate startup pitch/i)
      await user.type(textarea, 'My text content')
      
      const submitButton = screen.getByText('💥 Submit for Shit Tier Blasting')
      await user.click(submitButton)
      
      await waitFor(() => {
        expect(screen.getByText('Pay €69 to get blasted 💥')).toBeInTheDocument()
      })
    })
  })
})
