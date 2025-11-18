import { renderHook, act } from '@testing-library/react';
import { usePaymentPersistence } from '../usePaymentPersistence';
import { useDispatch, useSelector } from 'react-redux';

jest.mock('react-redux');

describe('usePaymentPersistence', () => {
  const mockDispatch = jest.fn();
  const mockCardData = {
    cardNumber: '4242424242424242',
    cardholderName: 'Test User',
    expiryDate: '12/25',
    cvv: '123',
    cardType: 'visa' as const,
  };

  const mockDeliveryData = {
    fullName: 'Test User',
    email: 'test@example.com',
    phone: '1234567890',
    address: 'Test Address',
    city: 'Test City',
    postalCode: '12345',
    country: 'Test Country',
  };

  const mockPaymentState = {
    cardData: mockCardData,
    deliveryData: mockDeliveryData,
    installments: 1,
    quantity: 1,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (useDispatch as jest.Mock).mockReturnValue(mockDispatch);
    (useSelector as jest.Mock).mockImplementation((selector) => {
      const rootState = {
        payment: mockPaymentState,
      };
      return selector(rootState);
    });
  });

  it('should return initial state', () => {
    const { result } = renderHook(() => usePaymentPersistence());

    expect(result.current.cardData).toEqual(mockCardData);
    expect(result.current.deliveryData).toEqual(mockDeliveryData);
    expect(result.current.installments).toBe(1);
    expect(result.current.quantity).toBe(1);
  });

  it('should update card data', () => {
    const { result } = renderHook(() => usePaymentPersistence());

    const newCardData = { ...mockCardData, cardNumber: '5555555555554444' };

    act(() => {
      result.current.updateCardData(newCardData);
    });

    expect(mockDispatch).toHaveBeenCalled();
  });

  it('should update delivery data', () => {
    const { result } = renderHook(() => usePaymentPersistence());

    const newDeliveryData = { ...mockDeliveryData, city: 'New City' };

    act(() => {
      result.current.updateDeliveryData(newDeliveryData);
    });

    expect(mockDispatch).toHaveBeenCalled();
  });

  it('should update installments', () => {
    const { result } = renderHook(() => usePaymentPersistence());

    act(() => {
      result.current.updateInstallments(12);
    });

    expect(mockDispatch).toHaveBeenCalled();
  });

  it('should update quantity', () => {
    const { result } = renderHook(() => usePaymentPersistence());

    act(() => {
      result.current.updateQuantity(5);
    });

    expect(mockDispatch).toHaveBeenCalled();
  });
});
