import axios from 'axios';
import { transactionService } from '../transactionService';

jest.mock('axios');

describe('transactionService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createTransaction', () => {
    it('should successfully create a transaction', async () => {
      const mockResponse = {
        status: 'APPROVED',
        status_message: 'Transacción aprobada',
      };

      (axios.post as jest.Mock).mockResolvedValue({
        data: mockResponse,
      });

      const transactionData = {
        infoCard: {
          card_number: '4242424242424242',
          cvc: '123',
          exp_month: '12',
          exp_year: '25',
          card_holder: 'Test User',
        },
        paymentMethod: {
          type: 'CARD' as const,
          installments: 1,
        },
        amount: 10000,
        reference: 'Test Product',
        product_id: 'prod-123',
        quantity: 1,
      };

      const result = await transactionService.createTransaction(transactionData);

      expect(result).toEqual(mockResponse);
      expect(axios.post).toHaveBeenCalledWith(
        expect.stringContaining('/transactions'),
        transactionData
      );
    });

    it('should handle Axios error with custom message', async () => {
      const errorMessage = 'Card declined';
      (axios.post as jest.Mock).mockRejectedValue(
        new Error('Network error')
      );

      (axios.isAxiosError as jest.Mock).mockReturnValue(false);

      const transactionData = {
        infoCard: {
          card_number: '4242424242424242',
          cvc: '123',
          exp_month: '12',
          exp_year: '25',
          card_holder: 'Test User',
        },
        paymentMethod: {
          type: 'CARD' as const,
          installments: 1,
        },
        amount: 10000,
        reference: 'Test Product',
        product_id: 'prod-123',
        quantity: 1,
      };

      await expect(transactionService.createTransaction(transactionData)).rejects.toThrow();
    });

    it('should handle Axios error response', async () => {
      const axiosError = {
        response: {
          data: {
            message: 'Card declined',
          },
        },
      };

      (axios.post as jest.Mock).mockRejectedValue(axiosError);
      (axios.isAxiosError as jest.Mock).mockReturnValue(true);

      const transactionData = {
        infoCard: {
          card_number: '4242424242424242',
          cvc: '123',
          exp_month: '12',
          exp_year: '25',
          card_holder: 'Test User',
        },
        paymentMethod: {
          type: 'CARD' as const,
          installments: 1,
        },
        amount: 10000,
        reference: 'Test Product',
        product_id: 'prod-123',
        quantity: 1,
      };

      await expect(
        transactionService.createTransaction(transactionData)
      ).rejects.toThrow('Card declined');
    });

    it('should use default error message when response has no message', async () => {
      const axiosError = {
        response: {
          data: {},
        },
      };

      (axios.post as jest.Mock).mockRejectedValue(axiosError);
      (axios.isAxiosError as jest.Mock).mockReturnValue(true);

      const transactionData = {
        infoCard: {
          card_number: '4242424242424242',
          cvc: '123',
          exp_month: '12',
          exp_year: '25',
          card_holder: 'Test User',
        },
        paymentMethod: {
          type: 'CARD' as const,
          installments: 1,
        },
        amount: 10000,
        reference: 'Test Product',
        product_id: 'prod-123',
        quantity: 1,
      };

      await expect(
        transactionService.createTransaction(transactionData)
      ).rejects.toThrow('Error al procesar el pago');
    });
  });
});
