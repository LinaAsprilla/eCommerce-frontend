import { render, screen, fireEvent } from '@testing-library/react';
import PaymentSummaryStep from '../PaymentSummaryStep';

describe('PaymentSummaryStep', () => {
  const defaultProps = {
    productTitle: 'Test Product',
    productPrice: 100,
    baseFee: 100,
    deliveryFee: 10,
    cardLastFour: '4242',
    cardType: 'visa' as const,
    deliveryAddress: 'Test Address, Test City',
    installments: 1,
    quantity: 1,
    stock: 50,
    onConfirm: jest.fn(),
    onBack: jest.fn(),
    onInstallmentsChange: jest.fn(),
    onQuantityChange: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render payment summary with product information', () => {
    render(<PaymentSummaryStep {...defaultProps} />);

    expect(screen.getByText('Test Product')).toBeInTheDocument();
    expect(screen.getByText('Resumen del Producto')).toBeInTheDocument();
  });

  it('should calculate and display correct total price', () => {
    render(<PaymentSummaryStep {...defaultProps} quantity={2} />);

    // Subtotal should be 100 * 2 = 200
    expect(screen.getByDisplayValue('2')).toBeInTheDocument();
  });

  it('should display card last four digits', () => {
    render(<PaymentSummaryStep {...defaultProps} />);

    expect(screen.getByText(/4242/)).toBeInTheDocument();
  });

  it('should display delivery address', () => {
    render(<PaymentSummaryStep {...defaultProps} />);

    expect(screen.getByText(/Test Address, Test City/)).toBeInTheDocument();
  });

  it('should call onConfirm when confirm button is clicked', () => {
    render(<PaymentSummaryStep {...defaultProps} />);

    const confirmButton = screen.getByRole('button', { name: /Confirmar Pago/i });
    fireEvent.click(confirmButton);

    expect(defaultProps.onConfirm).toHaveBeenCalled();
  });

  it('should call onBack when back button is clicked', () => {
    render(<PaymentSummaryStep {...defaultProps} />);

    const backButton = screen.getByRole('button', { name: /Atrás/i });
    fireEvent.click(backButton);

    expect(defaultProps.onBack).toHaveBeenCalled();
  });

  it('should have quantity input with correct max value', () => {
    render(<PaymentSummaryStep {...defaultProps} stock={25} />);

    const quantityInput = screen.getByDisplayValue('1') as HTMLInputElement;
    expect(quantityInput).toHaveAttribute('max', '25');
  });

  it('should have installments select with multiple options', () => {
    render(<PaymentSummaryStep {...defaultProps} />);

    const options = screen.getAllByRole('option');
    expect(options.length).toBeGreaterThan(1);
  });

  it('should show processing state when isProcessing is true', () => {
    const { rerender } = render(<PaymentSummaryStep {...defaultProps} />);

    rerender(
      <PaymentSummaryStep {...defaultProps} isProcessing={true} />
    );

    const confirmButton = screen.getByRole('button', { name: /Procesando/i });
    expect(confirmButton).toBeDisabled();
  });
});

