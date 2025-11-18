'use client';

import { useEffect, useCallback, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '@/app/store/store';
import {
  setCardData,
  setDeliveryData,
  setInstallments,
  setQuantity,
  initializePaymentData,
  type CardData,
  type DeliveryData,
  type PaymentState,
} from '@/app/store/slices/paymentSlice';

const PAYMENT_STORAGE_KEY = 'payment_form_data';

export const usePaymentPersistence = () => {
  const dispatch = useDispatch<AppDispatch>();
  const payment = useSelector((state: RootState) => state.payment);
  const isInitialized = useRef(false);
  const lastSavedRef = useRef<PaymentState>(payment);

  useEffect(() => {
    if (isInitialized.current) return;
    isInitialized.current = true;

    if (globalThis.window === undefined) return;

    try {
      const savedPaymentData = globalThis.window.localStorage.getItem(PAYMENT_STORAGE_KEY);
      if (savedPaymentData) {
        const parsedData = JSON.parse(savedPaymentData) as PaymentState;
        dispatch(initializePaymentData(parsedData));
        lastSavedRef.current = parsedData;
      }
    } catch (error) {
      console.error('Error al cargar datos de pago:', error);
    }
  }, [dispatch]);

  useEffect(() => {
    if (!isInitialized.current || globalThis.window === undefined) return;

    const hasChanges =
      JSON.stringify(payment) !== JSON.stringify(lastSavedRef.current);

    if (hasChanges) {
      try {
        globalThis.window.localStorage.setItem(
          PAYMENT_STORAGE_KEY,
          JSON.stringify(payment)
        );
        lastSavedRef.current = payment;
      } catch (error) {
        console.error('Error al guardar datos de pago:', error);
      }
    }
  }, [payment]);

  const updateCardData = useCallback((cardData: CardData) => {
    dispatch(setCardData(cardData));
  }, [dispatch]);

  const updateDeliveryData = useCallback((deliveryData: DeliveryData) => {
    dispatch(setDeliveryData(deliveryData));
  }, [dispatch]);

  const updateInstallments = useCallback((installments: number) => {
    dispatch(setInstallments(installments));
  }, [dispatch]);

  const updateQuantity = useCallback((quantity: number) => {
    dispatch(setQuantity(quantity));
  }, [dispatch]);

  return {
    cardData: payment.cardData,
    deliveryData: payment.deliveryData,
    installments: payment.installments,
    quantity: payment.quantity,
    updateCardData,
    updateDeliveryData,
    updateInstallments,
    updateQuantity,
  };
};
