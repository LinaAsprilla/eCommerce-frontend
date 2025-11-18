'use client';

import { usePaymentPersistence } from '@/app/hooks/usePaymentPersistence';

/**
 * Componente que se encarga de inicializar la persistencia de datos de pago
 * Se monta al cargar la aplicación para cargar los datos de localStorage
 */
export function PaymentPersistenceInitializer() {
  usePaymentPersistence();

  return null;
}
