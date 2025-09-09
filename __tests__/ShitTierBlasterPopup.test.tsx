import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useRouter } from 'next/navigation'
import ShitTierBlasterPopup from '../app/components/ShitTierBlasterPopup'

// Mock the useRouter hook
const mockPush = jest.fn()
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}))

describe('ShitTierBlasterPopup', () => {
  const mockOnClose = jest.fn()

  beforeEach(() => {
    mockPush.mockClear()
    mockOnClose.mockClear()
  })

  it('renders nothing when isOpen is false', () => {
    render(<ShitTierBlasterPopup isOpen={false} onClose={mockOnClose} />)
    
    expect(screen.queryByText('💥 NEW: Shit Tier Blaster 💥')).not.toBeInTheDocument()
  })

  it('renders popup content when isOpen is true', () => {
    render(<ShitTierBlasterPopup isOpen={true} onClose={mockOnClose} />)
    
    expect(screen.getByText('💥 NEW: Shit Tier Blaster 💥')).toBeInTheDocument()
    expect(screen.getByText(/Too broke for YC/)).toBeInTheDocument()
    expect(screen.getByText('🔥 Blast Me Now')).toBeInTheDocument()
    expect(screen.getByText('Nah, Bootstrap me to the bed')).toBeInTheDocument()
  })

  it('calls onClose when close button is clicked', async () => {
    const user = userEvent.setup()
    render(<ShitTierBlasterPopup isOpen={true} onClose={mockOnClose} />)
    
    const closeButton = screen.getByText('×')
    await user.click(closeButton)
    
    expect(mockOnClose).toHaveBeenCalledTimes(1)
  })

  it('calls onClose when backdrop is clicked', async () => {
    const user = userEvent.setup()
    render(<ShitTierBlasterPopup isOpen={true} onClose={mockOnClose} />)
    
    const backdrop = screen.getByRole('dialog').previousSibling
    await user.click(backdrop as Element)
    
    expect(mockOnClose).toHaveBeenCalledTimes(1)
  })

  it('navigates to shit-tier-blaster page when "Blast Me Now" is clicked', async () => {
    const user = userEvent.setup()
    render(<ShitTierBlasterPopup isOpen={true} onClose={mockOnClose} />)
    
    const blastButton = screen.getByText('🔥 Blast Me Now')
    await user.click(blastButton)
    
    expect(mockPush).toHaveBeenCalledWith('/shit-tier-blaster')
    expect(mockOnClose).toHaveBeenCalledTimes(1)
  })

  it('calls onClose when "Nah, Bootstrap me to the bed" is clicked', async () => {
    const user = userEvent.setup()
    render(<ShitTierBlasterPopup isOpen={true} onClose={mockOnClose} />)
    
    const bootstrapButton = screen.getByText('Nah, Bootstrap me to the bed')
    await user.click(bootstrapButton)
    
    expect(mockOnClose).toHaveBeenCalledTimes(1)
    expect(mockPush).not.toHaveBeenCalled()
  })

  it('has proper accessibility attributes', () => {
    render(<ShitTierBlasterPopup isOpen={true} onClose={mockOnClose} />)
    
    const popup = screen.getByRole('dialog')
    expect(popup).toBeInTheDocument()
  })

  it('displays the correct promotional text', () => {
    render(<ShitTierBlasterPopup isOpen={true} onClose={mockOnClose} />)
    
    expect(screen.getByText(/Too broke for YC\? Too weird for Techstars\?/)).toBeInTheDocument()
    expect(screen.getByText(/shotgun your app to 100\+ survival-mode accelerators/)).toBeInTheDocument()
    expect(screen.getByText(/all it takes is one yes to keep you alive another 6 months/)).toBeInTheDocument()
  })
})
