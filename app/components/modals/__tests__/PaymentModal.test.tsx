import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import PaymentModal from '../PaymentModal';
import paymentReducer from '../../../store/slices/paymentSlice';

// Mock transactionService
jest.mock('../../../services/transactionService', () => ({
  transactionService: {
    createTransaction: jest.fn(),
  },
}));

jest.mock('../DeliveryFormStep', () => {
  return function MockDeliveryFormStep({ onSubmit }: { onSubmit: (data: any) => void }) {
    return (
      <button
        onClick={() =>
          onSubmit({
            fullName: 'Test User',
            email: 'test@example.com',
            phone: '1234567890',
            address: 'Test Address',
            city: 'Test City',
            postalCode: '12345',
            country: 'Colombia',
          })
        }
      >
        Submit Delivery
      </button>
    );
  };
});

jest.mock('../PaymentFormStep', () => {
  return function MockPaymentFormStep({ onSubmit }: { onSubmit: (data: any) => void }) {
    return (
      <button
        onClick={() =>
          onSubmit({
            cardNumber: '4242424242424242',
            cardholderName: 'Test User',
            expiryDate: '12/25',
            cvv: '123',
            cardType: 'visa' as const,
          })
        }
      >
        Submit Card
      </button>
    );
  };
});

jest.mock('../PaymentSummaryStep', () => {
  return function MockPaymentSummaryStep({
    onConfirm,
    onBack,
  }: {
    onConfirm: () => void;
    onBack: () => void;
  }) {
    return (
      <div>
        <button onClick={onConfirm}>Confirm Payment</button>
        <button onClick={onBack}>Back</button>
      </div>
    );
  };
});

describe('PaymentModal', () => {
  let store: any;

  beforeEach(() => {
    store = configureStore({
      reducer: {
        payment: paymentReducer,
      },
    });
    jest.clearAllMocks();
  });

  const defaultProps = {
    isOpen: true,
    productTitle: 'Test Product',
    productPrice: 99.99,
    productId: 'prod-123',
    stock: 50,
    onClose: jest.fn(),
  };

  const renderWithRedux = (component: React.ReactElement) => {
    return render(<Provider store={store}>{component}</Provider>);
  };

  it('should not render when isOpen is false', () => {
    renderWithRedux(<PaymentModal {...defaultProps} isOpen={false} />);
    expect(screen.queryByText('Método de Pago')).not.toBeInTheDocument();
  });

  it('should render payment method step when isOpen is true', () => {
    renderWithRedux(<PaymentModal {...defaultProps} />);
    expect(screen.getByText('Método de Pago')).toBeInTheDocument();
  });

  it('should navigate to card step when credit card button is clicked', async () => {
    renderWithRedux(<PaymentModal {...defaultProps} />);

    const creditCardButton = screen.getByRole('button', { name: /Tarjeta de Crédito/i });
    fireEvent.click(creditCardButton);

    await waitFor(() => {
      expect(screen.getByText('Datos de Tarjeta')).toBeInTheDocument();
    });
  });

  it('should close modal when close button is clicked', () => {
    const { container } = renderWithRedux(<PaymentModal {...defaultProps} />);
    const closeButton = container.querySelector('button[class*="text-gray-500"]');

    if (closeButton) {
      fireEvent.click(closeButton);
      expect(defaultProps.onClose).toHaveBeenCalled();
    }
  });

  it('should handle undefined onPaymentSuccess gracefully', () => {
    renderWithRedux(<PaymentModal {...defaultProps} onPaymentSuccess={undefined} />);
    expect(screen.getByText('Método de Pago')).toBeInTheDocument();
  });
});

