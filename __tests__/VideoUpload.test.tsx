import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import ShitTierBlasterPage from '../app/shit-tier-blaster/page'

// Mock fetch responses
const mockFetch = jest.fn()
global.fetch = mockFetch

describe('Video Upload Functionality', () => {
  beforeEach(() => {
    mockFetch.mockClear()
    jest.clearAllMocks()
  })

  describe('Demo Video Upload', () => {
    it('accepts valid video file types', async () => {
      const user = userEvent.setup()
      
      mockFetch
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve({ url: 'https://upload-url.com', key: 'demo-key-123' })
        })
        .mockResolvedValueOnce({ ok: true })
      
      render(<ShitTierBlasterPage />)
      
      const videoTypes = [
        { file: 'demo.mp4', type: 'video/mp4' },
        { file: 'demo.mov', type: 'video/mov' },
        { file: 'demo.avi', type: 'video/avi' },
        { file: 'demo.wmv', type: 'video/wmv' },
        { file: 'demo.flv', type: 'video/flv' },
        { file: 'demo.webm', type: 'video/webm' }
      ]
      
      for (const videoType of videoTypes) {
        mockFetch.mockClear()
        mockFetch
          .mockResolvedValueOnce({
            ok: true,
            json: () => Promise.resolve({ url: 'https://upload-url.com', key: 'demo-key-123' })
          })
          .mockResolvedValueOnce({ ok: true })
        
        const demoVideoInput = screen.getByLabelText(/Demo Video/i)
        const validVideoFile = new File(['video content'], videoType.file, { type: videoType.type })
        
        await user.upload(demoVideoInput, validVideoFile)
        
        const submitButton = screen.getByText('💥 Submit for Shit Tier Blasting')
        await user.click(submitButton)
        
        await waitFor(() => {
          expect(mockFetch).toHaveBeenCalledWith('/api/upload-url', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              filename: `demo_${videoType.file}`,
              mime: videoType.type,
              prePayment: true,
              shitTier: true
            })
          })
        })
        
        // Reset for next iteration
        render(<ShitTierBlasterPage />)
      }
    })

    it('rejects invalid video file types', async () => {
      const user = userEvent.setup()
      render(<ShitTierBlasterPage />)
      
      const demoVideoInput = screen.getByLabelText(/Demo Video/i)
      const invalidVideoFile = new File(['content'], 'demo.txt', { type: 'text/plain' })
      
      await user.upload(demoVideoInput, invalidVideoFile)
      
      const submitButton = screen.getByText('💥 Submit for Shit Tier Blasting')
      await user.click(submitButton)
      
      expect(global.alert).toHaveBeenCalledWith('Only MP4, MOV, AVI, WMV, FLV, or WebM are allowed for videos.')
    })

    it('validates video file size limit', async () => {
      const user = userEvent.setup()
      render(<ShitTierBlasterPage />)
      
      const demoVideoInput = screen.getByLabelText(/Demo Video/i)
      // Create a file larger than 100MB
      const largeVideoFile = new File(['x'.repeat(101 * 1024 * 1024)], 'large-demo.mp4', { type: 'video/mp4' })
      
      await user.upload(demoVideoInput, largeVideoFile)
      
      const submitButton = screen.getByText('💥 Submit for Shit Tier Blasting')
      await user.click(submitButton)
      
      expect(global.alert).toHaveBeenCalledWith('Max size is 100 MB for videos.')
    })

    it('displays uploaded demo video file name and size', async () => {
      const user = userEvent.setup()
      render(<ShitTierBlasterPage />)
      
      const demoVideoInput = screen.getByLabelText(/Demo Video/i)
      const videoFile = new File(['x'.repeat(1024 * 1024)], 'my-demo.mp4', { type: 'video/mp4' })
      
      await user.upload(demoVideoInput, videoFile)
      
      expect(screen.getByText('my-demo.mp4')).toBeInTheDocument()
      expect(screen.getByText('1.0 MB')).toBeInTheDocument()
    })
  })

  describe('Presentation Video Upload', () => {
    it('accepts valid presentation video file types', async () => {
      const user = userEvent.setup()
      
      mockFetch
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve({ url: 'https://upload-url.com', key: 'presentation-key-123' })
        })
        .mockResolvedValueOnce({ ok: true })
      
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

    it('rejects invalid presentation video file types', async () => {
      const user = userEvent.setup()
      render(<ShitTierBlasterPage />)
      
      const presentationVideoInput = screen.getByLabelText(/Presentation Video/i)
      const invalidVideoFile = new File(['content'], 'presentation.pdf', { type: 'application/pdf' })
      
      await user.upload(presentationVideoInput, invalidVideoFile)
      
      const submitButton = screen.getByText('💥 Submit for Shit Tier Blasting')
      await user.click(submitButton)
      
      expect(global.alert).toHaveBeenCalledWith('Only MP4, MOV, AVI, WMV, FLV, or WebM are allowed for videos.')
    })

    it('validates presentation video file size limit', async () => {
      const user = userEvent.setup()
      render(<ShitTierBlasterPage />)
      
      const presentationVideoInput = screen.getByLabelText(/Presentation Video/i)
      // Create a file larger than 100MB
      const largeVideoFile = new File(['x'.repeat(101 * 1024 * 1024)], 'large-presentation.mp4', { type: 'video/mp4' })
      
      await user.upload(presentationVideoInput, largeVideoFile)
      
      const submitButton = screen.getByText('💥 Submit for Shit Tier Blasting')
      await user.click(submitButton)
      
      expect(global.alert).toHaveBeenCalledWith('Max size is 100 MB for videos.')
    })

    it('displays uploaded presentation video file name and size', async () => {
      const user = userEvent.setup()
      render(<ShitTierBlasterPage />)
      
      const presentationVideoInput = screen.getByLabelText(/Presentation Video/i)
      const videoFile = new File(['x'.repeat(2 * 1024 * 1024)], 'my-presentation.mp4', { type: 'video/mp4' })
      
      await user.upload(presentationVideoInput, videoFile)
      
      expect(screen.getByText('my-presentation.mp4')).toBeInTheDocument()
      expect(screen.getByText('2.0 MB')).toBeInTheDocument()
    })
  })

  describe('Multiple Video Upload', () => {
    it('handles both demo and presentation video uploads simultaneously', async () => {
      const user = userEvent.setup()
      
      mockFetch
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve({ url: 'https://upload-url.com', key: 'demo-key-123' })
        })
        .mockResolvedValueOnce({ ok: true })
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve({ url: 'https://upload-url.com', key: 'presentation-key-123' })
        })
        .mockResolvedValueOnce({ ok: true })
      
      render(<ShitTierBlasterPage />)
      
      const demoVideoInput = screen.getByLabelText(/Demo Video/i)
      const presentationVideoInput = screen.getByLabelText(/Presentation Video/i)
      
      const demoFile = new File(['demo content'], 'demo.mp4', { type: 'video/mp4' })
      const presentationFile = new File(['presentation content'], 'presentation.mp4', { type: 'video/mp4' })
      
      await user.upload(demoVideoInput, demoFile)
      await user.upload(presentationVideoInput, presentationFile)
      
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

    it('allows video-only submission without application file', async () => {
      const user = userEvent.setup()
      
      mockFetch
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve({ url: 'https://upload-url.com', key: 'demo-key-123' })
        })
        .mockResolvedValueOnce({ ok: true })
      
      render(<ShitTierBlasterPage />)
      
      const demoVideoInput = screen.getByLabelText(/Demo Video/i)
      const demoFile = new File(['demo content'], 'demo.mp4', { type: 'video/mp4' })
      
      await user.upload(demoVideoInput, demoFile)
      
      const submitButton = screen.getByText('💥 Submit for Shit Tier Blasting')
      await user.click(submitButton)
      
      await waitFor(() => {
        expect(screen.getByText('Ready to Get Blasted!')).toBeInTheDocument()
      })
    })
  })

  describe('Video Upload Error Handling', () => {
    it('handles demo video upload API errors', async () => {
      const user = userEvent.setup()
      
      mockFetch.mockResolvedValueOnce({ ok: false })
      
      render(<ShitTierBlasterPage />)
      
      const demoVideoInput = screen.getByLabelText(/Demo Video/i)
      const videoFile = new File(['video content'], 'demo.mp4', { type: 'video/mp4' })
      
      await user.upload(demoVideoInput, videoFile)
      
      const submitButton = screen.getByText('💥 Submit for Shit Tier Blasting')
      await user.click(submitButton)
      
      await waitFor(() => {
        expect(screen.getByText('Upload failed.')).toBeInTheDocument()
      })
    })

    it('handles presentation video upload API errors', async () => {
      const user = userEvent.setup()
      
      mockFetch.mockResolvedValueOnce({ ok: false })
      
      render(<ShitTierBlasterPage />)
      
      const presentationVideoInput = screen.getByLabelText(/Presentation Video/i)
      const videoFile = new File(['video content'], 'presentation.mp4', { type: 'video/mp4' })
      
      await user.upload(presentationVideoInput, videoFile)
      
      const submitButton = screen.getByText('💥 Submit for Shit Tier Blasting')
      await user.click(submitButton)
      
      await waitFor(() => {
        expect(screen.getByText('Upload failed.')).toBeInTheDocument()
      })
    })

    it('handles video file upload to S3 errors', async () => {
      const user = userEvent.setup()
      
      mockFetch
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve({ url: 'https://upload-url.com', key: 'demo-key-123' })
        })
        .mockResolvedValueOnce({ ok: false })
      
      render(<ShitTierBlasterPage />)
      
      const demoVideoInput = screen.getByLabelText(/Demo Video/i)
      const videoFile = new File(['video content'], 'demo.mp4', { type: 'video/mp4' })
      
      await user.upload(demoVideoInput, videoFile)
      
      const submitButton = screen.getByText('💥 Submit for Shit Tier Blasting')
      await user.click(submitButton)
      
      await waitFor(() => {
        expect(screen.getByText('Upload failed.')).toBeInTheDocument()
      })
    })
  })

  describe('Video Upload Status Messages', () => {
    it('shows uploading status for demo video', async () => {
      const user = userEvent.setup()
      
      // Mock a delayed response to see the status message
      mockFetch
        .mockImplementationOnce(() => new Promise(resolve => 
          setTimeout(() => resolve({
            ok: true,
            json: () => Promise.resolve({ url: 'https://upload-url.com', key: 'demo-key-123' })
          }), 100)
        ))
        .mockResolvedValueOnce({ ok: true })
      
      render(<ShitTierBlasterPage />)
      
      const demoVideoInput = screen.getByLabelText(/Demo Video/i)
      const videoFile = new File(['video content'], 'demo.mp4', { type: 'video/mp4' })
      
      await user.upload(demoVideoInput, videoFile)
      
      const submitButton = screen.getByText('💥 Submit for Shit Tier Blasting')
      await user.click(submitButton)
      
      expect(screen.getByText('Uploading demo video…')).toBeInTheDocument()
    })

    it('shows uploading status for presentation video', async () => {
      const user = userEvent.setup()
      
      // Mock a delayed response to see the status message
      mockFetch
        .mockImplementationOnce(() => new Promise(resolve => 
          setTimeout(() => resolve({
            ok: true,
            json: () => Promise.resolve({ url: 'https://upload-url.com', key: 'presentation-key-123' })
          }), 100)
        ))
        .mockResolvedValueOnce({ ok: true })
      
      render(<ShitTierBlasterPage />)
      
      const presentationVideoInput = screen.getByLabelText(/Presentation Video/i)
      const videoFile = new File(['video content'], 'presentation.mp4', { type: 'video/mp4' })
      
      await user.upload(presentationVideoInput, videoFile)
      
      const submitButton = screen.getByText('💥 Submit for Shit Tier Blasting')
      await user.click(submitButton)
      
      expect(screen.getByText('Uploading presentation video…')).toBeInTheDocument()
    })
  })
})
