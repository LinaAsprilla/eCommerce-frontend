'use client';

import { configureStore } from '@reduxjs/toolkit';
import productsReducer from './slices/productsSlice';
import paymentReducer from './slices/paymentSlice';

export const store = configureStore({
  reducer: {
    products: productsReducer,
    payment: paymentReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
