import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export interface InfoCard {
  card_number: string;
  cvc: string;
  exp_month: string;
  exp_year: string;
  card_holder: string;
}

export interface PaymentMethod {
  type: 'CARD';
  installments: number;
}

export interface TransactionRequest {
  infoCard: InfoCard;
  paymentMethod: PaymentMethod;
  amount: number;
  reference: string;
  product_id: string;
  quantity: number;
}

export interface TransactionResponse {
  status: string;
  status_message: string;
}

export const transactionService = {
  createTransaction: async (
    data: TransactionRequest
  ): Promise<TransactionResponse> => {
    try {
      const response = await axios.post<TransactionResponse>(
        `${API_URL}/transactions`,
        data
      );
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(
          error.response?.data?.message || 'Error al procesar el pago'
        );
      }
      throw error;
    }
  },
};
