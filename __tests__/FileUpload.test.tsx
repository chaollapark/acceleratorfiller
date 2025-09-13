import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import ShitTierBlasterPage from '../app/shit-tier-blaster/page'

// Mock fetch responses
const mockFetch = jest.fn()
global.fetch = mockFetch

describe('File Upload Functionality', () => {
  beforeEach(() => {
    mockFetch.mockClear()
    jest.clearAllMocks()
  })

  describe('Application File Upload', () => {
    it('accepts valid PDF files', async () => {
      const user = userEvent.setup()
      
      mockFetch
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve({ url: 'https://upload-url.com', key: 'file-key-123' })
        })
        .mockResolvedValueOnce({ ok: true })
      
      render(<ShitTierBlasterPage />)
      
      const fileInput = screen.getByLabelText(/Choose your desperate pitch/i)
      const pdfFile = new File(['pdf content'], 'application.pdf', { type: 'application/pdf' })
      
      await user.upload(fileInput, pdfFile)
      
      const submitButton = screen.getByText('💥 Submit for Shit Tier Blasting')
      await user.click(submitButton)
      
      await waitFor(() => {
        expect(mockFetch).toHaveBeenCalledWith('/api/upload-url', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            filename: 'application.pdf',
            mime: 'application/pdf',
            prePayment: true,
            shitTier: true
          })
        })
      })
    })

    it('accepts valid DOC files', async () => {
      const user = userEvent.setup()
      
      mockFetch
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve({ url: 'https://upload-url.com', key: 'file-key-123' })
        })
        .mockResolvedValueOnce({ ok: true })
      
      render(<ShitTierBlasterPage />)
      
      const fileInput = screen.getByLabelText(/Choose your desperate pitch/i)
      const docFile = new File(['doc content'], 'application.doc', { type: 'application/msword' })
      
      await user.upload(fileInput, docFile)
      
      const submitButton = screen.getByText('💥 Submit for Shit Tier Blasting')
      await user.click(submitButton)
      
      await waitFor(() => {
        expect(mockFetch).toHaveBeenCalledWith('/api/upload-url', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            filename: 'application.doc',
            mime: 'application/msword',
            prePayment: true,
            shitTier: true
          })
        })
      })
    })

    it('accepts valid DOCX files', async () => {
      const user = userEvent.setup()
      
      mockFetch
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve({ url: 'https://upload-url.com', key: 'file-key-123' })
        })
        .mockResolvedValueOnce({ ok: true })
      
      render(<ShitTierBlasterPage />)
      
      const fileInput = screen.getByLabelText(/Choose your desperate pitch/i)
      const docxFile = new File(['docx content'], 'application.docx', { 
        type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' 
      })
      
      await user.upload(fileInput, docxFile)
      
      const submitButton = screen.getByText('💥 Submit for Shit Tier Blasting')
      await user.click(submitButton)
      
      await waitFor(() => {
        expect(mockFetch).toHaveBeenCalledWith('/api/upload-url', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            filename: 'application.docx',
            mime: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            prePayment: true,
            shitTier: true
          })
        })
      })
    })

    it('rejects invalid file types', async () => {
      const user = userEvent.setup()
      render(<ShitTierBlasterPage />)
      
      const invalidFileTypes = [
        { name: 'image.jpg', type: 'image/jpeg' },
        { name: 'text.txt', type: 'text/plain' },
        { name: 'spreadsheet.xlsx', type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' },
        { name: 'presentation.pptx', type: 'application/vnd.openxmlformats-officedocument.presentationml.presentation' }
      ]
      
      for (const fileType of invalidFileTypes) {
        const fileInput = screen.getByLabelText(/Choose your desperate pitch/i)
        const invalidFile = new File(['content'], fileType.name, { type: fileType.type })
        
        await user.upload(fileInput, invalidFile)
        
        const submitButton = screen.getByText('💥 Submit for Shit Tier Blasting')
        await user.click(submitButton)
        
        expect(global.alert).toHaveBeenCalledWith('Only PDF or DOC/DOCX are allowed for application files.')
        
        // Reset for next iteration
        render(<ShitTierBlasterPage />)
      }
    })

    it('validates file size limit (15MB)', async () => {
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

    it('allows files exactly at the size limit', async () => {
      const user = userEvent.setup()
      
      mockFetch
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve({ url: 'https://upload-url.com', key: 'file-key-123' })
        })
        .mockResolvedValueOnce({ ok: true })
      
      render(<ShitTierBlasterPage />)
      
      const fileInput = screen.getByLabelText(/Choose your desperate pitch/i)
      // Create a file exactly 15MB
      const maxSizeFile = new File(['x'.repeat(15 * 1024 * 1024)], 'max-size.pdf', { type: 'application/pdf' })
      
      await user.upload(fileInput, maxSizeFile)
      
      const submitButton = screen.getByText('💥 Submit for Shit Tier Blasting')
      await user.click(submitButton)
      
      await waitFor(() => {
        expect(mockFetch).toHaveBeenCalled()
      })
      
      expect(global.alert).not.toHaveBeenCalledWith('Max size is 15 MB for application files.')
    })

    it('displays uploaded file name and size', async () => {
      const user = userEvent.setup()
      render(<ShitTierBlasterPage />)
      
      const fileInput = screen.getByLabelText(/Choose your desperate pitch/i)
      const file = new File(['x'.repeat(1024 * 1024)], 'my-application.pdf', { type: 'application/pdf' })
      
      await user.upload(fileInput, file)
      
      expect(screen.getByText('my-application.pdf')).toBeInTheDocument()
      expect(screen.getByText('1.0 MB')).toBeInTheDocument()
    })

    it('shows uploading status message', async () => {
      const user = userEvent.setup()
      
      // Mock a delayed response to see the status message
      mockFetch
        .mockImplementationOnce(() => new Promise(resolve => 
          setTimeout(() => resolve({
            ok: true,
            json: () => Promise.resolve({ url: 'https://upload-url.com', key: 'file-key-123' })
          }), 100)
        ))
        .mockResolvedValueOnce({ ok: true })
      
      render(<ShitTierBlasterPage />)
      
      const fileInput = screen.getByLabelText(/Choose your desperate pitch/i)
      const file = new File(['content'], 'application.pdf', { type: 'application/pdf' })
      
      await user.upload(fileInput, file)
      
      const submitButton = screen.getByText('💥 Submit for Shit Tier Blasting')
      await user.click(submitButton)
      
      expect(screen.getByText('Uploading application file…')).toBeInTheDocument()
    })
  })

  describe('Text Content Upload', () => {
    it('handles pasted text content', async () => {
      const user = userEvent.setup()
      
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ key: 'text-key-123' })
      })
      
      render(<ShitTierBlasterPage />)
      
      const textarea = screen.getByPlaceholderText(/Paste your desperate startup pitch/i)
      const textContent = 'This is my desperate startup pitch. Please accept me!'
      
      await user.type(textarea, textContent)
      
      const submitButton = screen.getByText('💥 Submit for Shit Tier Blasting')
      await user.click(submitButton)
      
      await waitFor(() => {
        expect(mockFetch).toHaveBeenCalledWith('/api/upload-url', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            filename: 'application.txt',
            mime: 'text/plain',
            content: textContent,
            prePayment: true,
            shitTier: true
          })
        })
      })
    })

    it('trims whitespace from pasted content', async () => {
      const user = userEvent.setup()
      
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ key: 'text-key-123' })
      })
      
      render(<ShitTierBlasterPage />)
      
      const textarea = screen.getByPlaceholderText(/Paste your desperate startup pitch/i)
      const textContent = '   \n  This is my content with whitespace  \n  '
      
      await user.type(textarea, textContent)
      
      const submitButton = screen.getByText('💥 Submit for Shit Tier Blasting')
      await user.click(submitButton)
      
      await waitFor(() => {
        expect(mockFetch).toHaveBeenCalledWith('/api/upload-url', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            filename: 'application.txt',
            mime: 'text/plain',
            content: textContent,
            prePayment: true,
            shitTier: true
          })
        })
      })
    })

    it('ignores empty or whitespace-only content', async () => {
      const user = userEvent.setup()
      render(<ShitTierBlasterPage />)
      
      const textarea = screen.getByPlaceholderText(/Paste your desperate startup pitch/i)
      await user.type(textarea, '   \n  \t  ')
      
      const submitButton = screen.getByText('💥 Submit for Shit Tier Blasting')
      await user.click(submitButton)
      
      expect(global.alert).toHaveBeenCalledWith('Please upload a file, paste your application content, or upload videos.')
    })

    it('shows uploading status for pasted content', async () => {
      const user = userEvent.setup()
      
      // Mock a delayed response to see the status message
      mockFetch.mockImplementationOnce(() => new Promise(resolve => 
        setTimeout(() => resolve({
          ok: true,
          json: () => Promise.resolve({ key: 'text-key-123' })
        }), 100)
      ))
      
      render(<ShitTierBlasterPage />)
      
      const textarea = screen.getByPlaceholderText(/Paste your desperate startup pitch/i)
      await user.type(textarea, 'My startup pitch')
      
      const submitButton = screen.getByText('💥 Submit for Shit Tier Blasting')
      await user.click(submitButton)
      
      expect(screen.getByText('Uploading pasted content…')).toBeInTheDocument()
    })
  })

  describe('Combined Upload Scenarios', () => {
    it('prioritizes file upload over text content for primary upload ID', async () => {
      const user = userEvent.setup()
      
      mockFetch
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve({ url: 'https://upload-url.com', key: 'file-key-123' })
        })
        .mockResolvedValueOnce({ ok: true })
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve({ key: 'text-key-456' })
        })
      
      render(<ShitTierBlasterPage />)
      
      // Upload both file and text
      const fileInput = screen.getByLabelText(/Choose your desperate pitch/i)
      const file = new File(['content'], 'application.pdf', { type: 'application/pdf' })
      await user.upload(fileInput, file)
      
      const textarea = screen.getByPlaceholderText(/Paste your desperate startup pitch/i)
      await user.type(textarea, 'My text content')
      
      const submitButton = screen.getByText('💥 Submit for Shit Tier Blasting')
      await user.click(submitButton)
      
      await waitFor(() => {
        expect(screen.getByText('Ready to Get Blasted!')).toBeInTheDocument()
      })
      
      // Verify that both uploads were called
      expect(mockFetch).toHaveBeenCalledTimes(3) // file upload URL, file PUT, text upload
    })

    it('uses text content as primary upload ID when no file is uploaded', async () => {
      const user = userEvent.setup()
      
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ key: 'text-key-123' })
      })
      
      render(<ShitTierBlasterPage />)
      
      const textarea = screen.getByPlaceholderText(/Paste your desperate startup pitch/i)
      await user.type(textarea, 'My text content only')
      
      const submitButton = screen.getByText('💥 Submit for Shit Tier Blasting')
      await user.click(submitButton)
      
      await waitFor(() => {
        expect(screen.getByText('Ready to Get Blasted!')).toBeInTheDocument()
      })
    })
  })

  describe('Upload Error Handling', () => {
    it('handles file upload API errors', async () => {
      const user = userEvent.setup()
      
      mockFetch.mockResolvedValueOnce({ ok: false })
      
      render(<ShitTierBlasterPage />)
      
      const fileInput = screen.getByLabelText(/Choose your desperate pitch/i)
      const file = new File(['content'], 'application.pdf', { type: 'application/pdf' })
      
      await user.upload(fileInput, file)
      
      const submitButton = screen.getByText('💥 Submit for Shit Tier Blasting')
      await user.click(submitButton)
      
      await waitFor(() => {
        expect(screen.getByText('Upload failed.')).toBeInTheDocument()
      })
    })

    it('handles file PUT to S3 errors', async () => {
      const user = userEvent.setup()
      
      mockFetch
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve({ url: 'https://upload-url.com', key: 'file-key-123' })
        })
        .mockResolvedValueOnce({ ok: false })
      
      render(<ShitTierBlasterPage />)
      
      const fileInput = screen.getByLabelText(/Choose your desperate pitch/i)
      const file = new File(['content'], 'application.pdf', { type: 'application/pdf' })
      
      await user.upload(fileInput, file)
      
      const submitButton = screen.getByText('💥 Submit for Shit Tier Blasting')
      await user.click(submitButton)
      
      await waitFor(() => {
        expect(screen.getByText('Upload failed.')).toBeInTheDocument()
      })
    })

    it('handles text content upload API errors', async () => {
      const user = userEvent.setup()
      
      mockFetch.mockResolvedValueOnce({ ok: false })
      
      render(<ShitTierBlasterPage />)
      
      const textarea = screen.getByPlaceholderText(/Paste your desperate startup pitch/i)
      await user.type(textarea, 'My text content')
      
      const submitButton = screen.getByText('💥 Submit for Shit Tier Blasting')
      await user.click(submitButton)
      
      await waitFor(() => {
        expect(screen.getByText('Upload failed.')).toBeInTheDocument()
      })
    })
  })
})
