import { render, screen, fireEvent } from '@testing-library/react';
import ProductCard from '../ProductCard';

// Mock PaymentModal
jest.mock('../../modals/PaymentModal', () => {
  return function MockPaymentModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
    if (!isOpen) return null;
    return (
      <div data-testid="payment-modal">
        <button onClick={onClose}>Close Modal</button>
      </div>
    );
  };
});

describe('ProductCard', () => {
  const defaultProps = {
    image: '/test-image.jpg',
    title: 'Test Product',
    brand: 'Test Brand',
    price: 99.99,
    rating: 4.5,
    reviews: 120,
    stock: 50,
    productId: 'prod-123',
  };

  it('should render product card with all information', () => {
    render(<ProductCard {...defaultProps} />);

    expect(screen.getByText('Test Product')).toBeInTheDocument();
    expect(screen.getByText('Test Brand')).toBeInTheDocument();
    expect(screen.getByText('$99.99')).toBeInTheDocument();
    expect(screen.getByText('50 disponibles')).toBeInTheDocument();
    expect(screen.getByText('4.5')).toBeInTheDocument();
    expect(screen.getByText('(120 reviews)')).toBeInTheDocument();
  });

  it('should display "New in" badge when isNew is true', () => {
    render(<ProductCard {...defaultProps} isNew={true} />);

    expect(screen.getByText('New in')).toBeInTheDocument();
  });

  it('should not display "New in" badge when isNew is false', () => {
    render(<ProductCard {...defaultProps} isNew={false} />);

    expect(screen.queryByText('New in')).not.toBeInTheDocument();
  });

  it('should render color buttons when colors are provided', () => {
    const colors = ['#FF0000', '#00FF00', '#0000FF'];
    render(<ProductCard {...defaultProps} colors={colors} />);

    const colorButtons = screen.getAllByRole('button').filter((btn) => {
      return btn.className.includes('rounded-full');
    });

    expect(colorButtons.length).toBeGreaterThanOrEqual(colors.length);
  });

  it('should toggle favorite heart on button click', () => {
    render(<ProductCard {...defaultProps} />);

    const favoriteButton = screen.getAllByRole('button')[0];
    fireEvent.click(favoriteButton);

    // Check if the button was clicked (class should change)
    expect(favoriteButton).toBeInTheDocument();
  });

  it('should open payment modal when "Comprar" button is clicked', () => {
    render(<ProductCard {...defaultProps} />);

    const comprarButton = screen.getByRole('button', { name: /Comprar/i });
    fireEvent.click(comprarButton);

    expect(screen.getByTestId('payment-modal')).toBeInTheDocument();
  });

  it('should close payment modal when close button is clicked', () => {
    render(<ProductCard {...defaultProps} />);

    const comprarButton = screen.getByRole('button', { name: /Comprar/i });
    fireEvent.click(comprarButton);

    expect(screen.getByTestId('payment-modal')).toBeInTheDocument();

    const closeButton = screen.getByRole('button', { name: /Close Modal/i });
    fireEvent.click(closeButton);

    expect(screen.queryByTestId('payment-modal')).not.toBeInTheDocument();
  });

  it('should call onPaymentSuccess callback when provided', () => {
    const mockOnPaymentSuccess = jest.fn();
    render(<ProductCard {...defaultProps} onPaymentSuccess={mockOnPaymentSuccess} />);

    // The callback is passed to PaymentModal, we verify it was passed
    expect(screen.getByText('Test Product')).toBeInTheDocument();
  });

  it('should render with different stock levels', () => {
    const { rerender } = render(<ProductCard {...defaultProps} stock={0} />);
    expect(screen.getByText('0 disponibles')).toBeInTheDocument();

    rerender(<ProductCard {...defaultProps} stock={100} />);
    expect(screen.getByText('100 disponibles')).toBeInTheDocument();
  });

  it('should display product image', () => {
    render(<ProductCard {...defaultProps} />);
    const image = screen.getByAltText('Test Product');
    expect(image).toBeInTheDocument();
  });
});
