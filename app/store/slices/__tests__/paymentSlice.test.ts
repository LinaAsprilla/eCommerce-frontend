import paymentReducer, {
  setCardData,
  setDeliveryData,
  setInstallments,
  setQuantity,
  resetPaymentData,
  initializePaymentData,
} from '../paymentSlice';
import type { PaymentState, CardData, DeliveryData } from '../paymentSlice';

describe('paymentSlice', () => {
  const initialState: PaymentState = {
    cardData: {
      cardNumber: '',
      cardholderName: '',
      expiryDate: '',
      cvv: '',
      cardType: 'unknown',
    },
    deliveryData: {
      fullName: '',
      email: '',
      phone: '',
      address: '',
      city: '',
      postalCode: '',
      country: '',
    },
    installments: 1,
    quantity: 1,
  };

  it('should return the initial state', () => {
    const state = paymentReducer(undefined, { type: 'unknown' });
    expect(state).toEqual(initialState);
  });

  it('should handle setCardData', () => {
    const cardData: CardData = {
      cardNumber: '4242424242424242',
      cardholderName: 'John Doe',
      expiryDate: '12/25',
      cvv: '123',
      cardType: 'visa',
    };

    const state = paymentReducer(initialState, setCardData(cardData));
    expect(state.cardData).toEqual(cardData);
  });

  it('should handle setDeliveryData', () => {
    const deliveryData: DeliveryData = {
      fullName: 'John Doe',
      email: 'john@example.com',
      phone: '1234567890',
      address: '123 Main St',
      city: 'Bogotá',
      postalCode: '110111',
      country: 'Colombia',
    };

    const state = paymentReducer(initialState, setDeliveryData(deliveryData));
    expect(state.deliveryData).toEqual(deliveryData);
  });

  it('should handle setInstallments', () => {
    const state = paymentReducer(initialState, setInstallments(12));
    expect(state.installments).toBe(12);
  });

  it('should handle setQuantity', () => {
    const state = paymentReducer(initialState, setQuantity(5));
    expect(state.quantity).toBe(5);
  });

  it('should handle resetPaymentData', () => {
    const modifiedState: PaymentState = {
      ...initialState,
      cardData: {
        cardNumber: '4242424242424242',
        cardholderName: 'John Doe',
        expiryDate: '12/25',
        cvv: '123',
        cardType: 'visa',
      },
      installments: 12,
      quantity: 3,
    };

    const state = paymentReducer(modifiedState, resetPaymentData());
    expect(state).toEqual(initialState);
  });

  it('should handle initializePaymentData', () => {
    const payloadData = {
      cardData: {
        cardNumber: '4242424242424242',
        cardholderName: 'John Doe',
        expiryDate: '12/25',
        cvv: '123',
        cardType: 'visa' as const,
      },
      deliveryData: {
        fullName: 'John Doe',
        email: 'john@example.com',
        phone: '1234567890',
        address: '123 Main St',
        city: 'Bogotá',
        postalCode: '110111',
        country: 'Colombia',
      },
      installments: 6,
      quantity: 2,
    };

    const state = paymentReducer(initialState, initializePaymentData(payloadData));
    expect(state).toEqual(payloadData);
  });

  it('should maintain immutability when updating state', () => {
    const originalState = { ...initialState };
    const cardData: CardData = {
      cardNumber: '5555555555554444',
      cardholderName: 'Jane Doe',
      expiryDate: '11/26',
      cvv: '456',
      cardType: 'mastercard',
    };

    paymentReducer(initialState, setCardData(cardData));
    expect(initialState).toEqual(originalState);
  });
});
