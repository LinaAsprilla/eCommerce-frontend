'use client';

import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface CardData {
  cardNumber: string;
  cardholderName: string;
  expiryDate: string;
  cvv: string;
  cardType: 'visa' | 'mastercard' | 'unknown';
}

export interface DeliveryData {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
}

export interface PaymentState {
  cardData: CardData;
  deliveryData: DeliveryData;
  installments: number;
  quantity: number;
}

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

const paymentSlice = createSlice({
  name: 'payment',
  initialState,
  reducers: {
    setCardData: (state, action: PayloadAction<CardData>) => {
      state.cardData = action.payload;
    },
    setDeliveryData: (state, action: PayloadAction<DeliveryData>) => {
      state.deliveryData = action.payload;
    },
    setInstallments: (state, action: PayloadAction<number>) => {
      state.installments = action.payload;
    },
    setQuantity: (state, action: PayloadAction<number>) => {
      state.quantity = action.payload;
    },
    resetPaymentData: (state) => {
      state.cardData = initialState.cardData;
      state.deliveryData = initialState.deliveryData;
      state.installments = initialState.installments;
      state.quantity = initialState.quantity;
    },
    initializePaymentData: (state, action: PayloadAction<PaymentState>) => {
      state.cardData = action.payload.cardData;
      state.deliveryData = action.payload.deliveryData;
      state.installments = action.payload.installments;
      state.quantity = action.payload.quantity;
    },
  },
});

export const {
  setCardData,
  setDeliveryData,
  setInstallments,
  setQuantity,
  resetPaymentData,
  initializePaymentData,
} = paymentSlice.actions;
export default paymentSlice.reducer;
