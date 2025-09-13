import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import ShitTierBlasterPage from '../app/shit-tier-blaster/page'

// Mock fetch responses
const mockFetch = jest.fn()
global.fetch = mockFetch

describe('ShitTierBlasterPage', () => {
  beforeEach(() => {
    mockFetch.mockClear()
    jest.clearAllMocks()
  })

  it('renders the main page elements', () => {
    render(<ShitTierBlasterPage />)
    
    expect(screen.getByText('Got Rejected? We Got You.')).toBeInTheDocument()
    expect(screen.getByText('Upload your desperate application')).toBeInTheDocument()
    expect(screen.getByText('💥 Submit for Shit Tier Blasting')).toBeInTheDocument()
  })

  it('shows file upload sections', () => {
    render(<ShitTierBlasterPage />)
    
    expect(screen.getByText('Upload your application file')).toBeInTheDocument()
    expect(screen.getByText('Upload videos (optional but recommended)')).toBeInTheDocument()
    expect(screen.getByText('Paste your desperate plea')).toBeInTheDocument()
  })

  it('validates file types for application files', async () => {
    const user = userEvent.setup()
    render(<ShitTierBlasterPage />)
    
    const fileInput = screen.getByLabelText(/Choose your desperate pitch/i)
    const invalidFile = new File(['test'], 'test.txt', { type: 'text/plain' })
    
    await user.upload(fileInput, invalidFile)
    
    const submitButton = screen.getByText('💥 Submit for Shit Tier Blasting')
    await user.click(submitButton)
    
    expect(global.alert).toHaveBeenCalledWith('Only PDF or DOC/DOCX are allowed for application files.')
  })

  it('validates file size for application files', async () => {
    const user = userEvent.setup()
    render(<ShitTierBlasterPage />)
    
    const fileInput = screen.getByLabelText(/Choose your desperate pitch/i)
    // Create a file larger than 15MB
    const largeFile = new File(['x'.repeat(16 * 1024 * 1024)], 'large.pdf', { type: 'application/pdf' })
    
    await user.upload(fileInput, largeFile)
    
    const submitButton = screen.getByText('💥 Submit for Shit Tier Blasting')
    await user.click(submitButton)
    
    expect(global.alert).toHaveBeenCalledWith('Max size is 15 MB for application files.')
  })

  it('validates video file types', async () => {
    const user = userEvent.setup()
    render(<ShitTierBlasterPage />)
    
    const demoVideoInput = screen.getByLabelText(/Demo Video/i)
    const invalidVideoFile = new File(['test'], 'test.txt', { type: 'text/plain' })
    
    await user.upload(demoVideoInput, invalidVideoFile)
    
    const submitButton = screen.getByText('💥 Submit for Shit Tier Blasting')
    await user.click(submitButton)
    
    expect(global.alert).toHaveBeenCalledWith('Only MP4, MOV, AVI, WMV, FLV, or WebM are allowed for videos.')
  })

  it('validates video file size', async () => {
    const user = userEvent.setup()
    render(<ShitTierBlasterPage />)
    
    const demoVideoInput = screen.getByLabelText(/Demo Video/i)
    // Create a video file larger than 100MB
    const largeVideoFile = new File(['x'.repeat(101 * 1024 * 1024)], 'large.mp4', { type: 'video/mp4' })
    
    await user.upload(demoVideoInput, largeVideoFile)
    
    const submitButton = screen.getByText('💥 Submit for Shit Tier Blasting')
    await user.click(submitButton)
    
    expect(global.alert).toHaveBeenCalledWith('Max size is 100 MB for videos.')
  })

  it('requires at least one input method', async () => {
    const user = userEvent.setup()
    render(<ShitTierBlasterPage />)
    
    const submitButton = screen.getByText('💥 Submit for Shit Tier Blasting')
    await user.click(submitButton)
    
    expect(global.alert).toHaveBeenCalledWith('Please upload a file, paste your application content, or upload videos.')
  })

  it('handles successful file upload', async () => {
    const user = userEvent.setup()
    
    // Mock successful upload responses
    mockFetch
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ url: 'https://upload-url.com', key: 'file-key-123' })
      })
      .mockResolvedValueOnce({
        ok: true
      })
    
    render(<ShitTierBlasterPage />)
    
    const fileInput = screen.getByLabelText(/Choose your desperate pitch/i)
    const validFile = new File(['test content'], 'test.pdf', { type: 'application/pdf' })
    
    await user.upload(fileInput, validFile)
    
    const submitButton = screen.getByText('💥 Submit for Shit Tier Blasting')
    await user.click(submitButton)
    
    await waitFor(() => {
      expect(screen.getByText('Ready to Get Blasted!')).toBeInTheDocument()
    })
  })

  it('handles successful video upload', async () => {
    const user = userEvent.setup()
    
    // Mock successful upload responses for demo video
    mockFetch
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ url: 'https://upload-url.com', key: 'demo-video-key-123' })
      })
      .mockResolvedValueOnce({
        ok: true
      })
    
    render(<ShitTierBlasterPage />)
    
    const demoVideoInput = screen.getByLabelText(/Demo Video/i)
    const validVideoFile = new File(['video content'], 'demo.mp4', { type: 'video/mp4' })
    
    await user.upload(demoVideoInput, validVideoFile)
    
    const submitButton = screen.getByText('💥 Submit for Shit Tier Blasting')
    await user.click(submitButton)
    
    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith('/api/upload-url', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          filename: 'demo_demo.mp4',
          mime: 'video/mp4',
          prePayment: true,
          shitTier: true
        })
      })
    })
  })

  it('handles successful presentation video upload', async () => {
    const user = userEvent.setup()
    
    // Mock successful upload responses for presentation video
    mockFetch
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ url: 'https://upload-url.com', key: 'presentation-video-key-123' })
      })
      .mockResolvedValueOnce({
        ok: true
      })
    
    render(<ShitTierBlasterPage />)
    
    const presentationVideoInput = screen.getByLabelText(/Presentation Video/i)
    const validVideoFile = new File(['video content'], 'presentation.mp4', { type: 'video/mp4' })
    
    await user.upload(presentationVideoInput, validVideoFile)
    
    const submitButton = screen.getByText('💥 Submit for Shit Tier Blasting')
    await user.click(submitButton)
    
    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith('/api/upload-url', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          filename: 'presentation_presentation.mp4',
          mime: 'video/mp4',
          prePayment: true,
          shitTier: true
        })
      })
    })
  })

  it('handles pasted content submission', async () => {
    const user = userEvent.setup()
    
    // Mock successful upload response for text content
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ key: 'text-content-key-123' })
    })
    
    render(<ShitTierBlasterPage />)
    
    const textarea = screen.getByPlaceholderText(/Paste your desperate startup pitch/i)
    await user.type(textarea, 'My desperate startup pitch content')
    
    const submitButton = screen.getByText('💥 Submit for Shit Tier Blasting')
    await user.click(submitButton)
    
    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith('/api/upload-url', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          filename: 'application.txt',
          mime: 'text/plain',
          content: 'My desperate startup pitch content',
          prePayment: true,
          shitTier: true
        })
      })
    })
  })

  it('handles upload errors gracefully', async () => {
    const user = userEvent.setup()
    
    // Mock failed upload response
    mockFetch.mockResolvedValueOnce({
      ok: false
    })
    
    render(<ShitTierBlasterPage />)
    
    const fileInput = screen.getByLabelText(/Choose your desperate pitch/i)
    const validFile = new File(['test content'], 'test.pdf', { type: 'application/pdf' })
    
    await user.upload(fileInput, validFile)
    
    const submitButton = screen.getByText('💥 Submit for Shit Tier Blasting')
    await user.click(submitButton)
    
    await waitFor(() => {
      expect(screen.getByText('Upload failed.')).toBeInTheDocument()
    })
  })

  it('shows checkout button after successful upload', async () => {
    const user = userEvent.setup()
    
    // Mock successful upload responses
    mockFetch
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ url: 'https://upload-url.com', key: 'file-key-123' })
      })
      .mockResolvedValueOnce({
        ok: true
      })
    
    render(<ShitTierBlasterPage />)
    
    const fileInput = screen.getByLabelText(/Choose your desperate pitch/i)
    const validFile = new File(['test content'], 'test.pdf', { type: 'application/pdf' })
    
    await user.upload(fileInput, validFile)
    
    const submitButton = screen.getByText('💥 Submit for Shit Tier Blasting')
    await user.click(submitButton)
    
    await waitFor(() => {
      expect(screen.getByText('Pay €69 to get blasted 💥')).toBeInTheDocument()
    })
  })

  it('handles checkout process', async () => {
    const user = userEvent.setup()
    
    // Mock successful upload and checkout responses
    mockFetch
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ url: 'https://upload-url.com', key: 'file-key-123' })
      })
      .mockResolvedValueOnce({
        ok: true
      })
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ url: 'https://checkout-url.com' })
      })
    
    render(<ShitTierBlasterPage />)
    
    // Upload file first
    const fileInput = screen.getByLabelText(/Choose your desperate pitch/i)
    const validFile = new File(['test content'], 'test.pdf', { type: 'application/pdf' })
    
    await user.upload(fileInput, validFile)
    
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
  })
})
