'use client';

import { useState } from 'react';
import { X, CheckCircle, XCircle, Clock, AlertCircle } from 'lucide-react';
import { usePaymentPersistence } from '@/app/hooks/usePaymentPersistence';
import { transactionService } from '@/app/services/transactionService';
import DeliveryFormStep from './DeliveryFormStep';
import PaymentFormStep from './PaymentFormStep';
import PaymentSummaryStep from './PaymentSummaryStep';

export type PaymentStep = 'method' | 'card' | 'delivery' | 'summary' | 'result';
export type TransactionStatus = 'APPROVED' | 'DECLINED' | 'VOIDED' | 'ERROR' | 'PENDING';

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

interface PaymentModalProps {
  readonly isOpen: boolean;
  readonly productTitle: string;
  readonly productPrice: number;
  readonly productId: string;
  readonly stock: number;
  readonly onClose: () => void;
  readonly onPaymentSuccess?: () => void;
}

export default function PaymentModal({
  isOpen,
  productTitle,
  productPrice,
  productId,
  stock,
  onClose,
  onPaymentSuccess,
}: PaymentModalProps) {
  const {
    cardData,
    deliveryData,
    installments,
    quantity,
    updateCardData,
    updateDeliveryData,
    updateInstallments,
    updateQuantity,
  } = usePaymentPersistence();
  const baseFee = productPrice;
  const deliveryFee = productPrice * 0.1;
  const [currentStep, setCurrentStep] = useState<PaymentStep>('method');
  const [isProcessing, setIsProcessing] = useState(false);
  const [transactionResult, setTransactionResult] = useState<{
    status: TransactionStatus;
    message: string;
  } | null>(null);

  const handlePaymentMethodClick = () => {
    setCurrentStep('card');
  };

  const handleCardSubmit = (data: CardData) => {
    updateCardData(data);
    setCurrentStep('delivery');
  };

  const handleDeliverySubmit = (data: DeliveryData) => {
    updateDeliveryData(data);
    setCurrentStep('summary');
  };

  const handleConfirmPayment = async () => {
    setIsProcessing(true);
    try {
      const [expMonth, expYear] = cardData.expiryDate.split('/');

      const transactionData = {
        infoCard: {
          card_number: cardData.cardNumber.replaceAll(/\s/g, ''),
          cvc: cardData.cvv,
          exp_month: expMonth,
          exp_year: expYear,
          card_holder: cardData.cardholderName,
        },
        paymentMethod: {
          type: 'CARD' as const,
          installments,
        },
        amount: Math.round(((productPrice * quantity) + baseFee + deliveryFee) * 100),
        reference: productTitle,
        product_id: productId,
        quantity,
      };

      const response = await transactionService.createTransaction(transactionData);
      setTransactionResult({
        status: response.status as TransactionStatus,
        message: response.status_message,
      });
      setCurrentStep('result');
    } catch (error) {
      setTransactionResult({
        status: 'ERROR' as TransactionStatus,
        message: error instanceof Error ? error.message : 'Error al procesar el pago',
      });
      setCurrentStep('result');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleBackStep = () => {
    if (currentStep === 'card') setCurrentStep('method');
    else if (currentStep === 'delivery') setCurrentStep('card');
    else if (currentStep === 'summary') setCurrentStep('delivery');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 sm:p-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200 dark:border-gray-700 sticky top-0 bg-white dark:bg-gray-800">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
            {currentStep === 'method' && 'Método de Pago'}
            {currentStep === 'card' && 'Datos de Tarjeta'}
            {currentStep === 'delivery' && 'Dirección de Entrega'}
            {currentStep === 'summary' && 'Resumen de Pago'}
            {currentStep === 'result' && 'Resultado de la Transacción'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6">
          {currentStep === 'method' && (
            <div className="space-y-4">
              <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">
                Selecciona un método de pago para continuar
              </p>
              <button
                onClick={handlePaymentMethodClick}
                className="w-full flex items-center gap-3 p-4 border-2 border-blue-600 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors"
              >
                <div className="w-10 h-8 bg-blue-600 rounded flex items-center justify-center text-white font-bold text-sm">
                  💳
                </div>
                <div className="text-left">
                  <p className="font-semibold text-gray-900 dark:text-white">Tarjeta de Crédito</p>
                  <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Visa o MasterCard</p>
                </div>
              </button>
            </div>
          )}

          {currentStep === 'card' && (
            <PaymentFormStep onSubmit={handleCardSubmit} onBack={handleBackStep} initialData={cardData} />
          )}

          {currentStep === 'delivery' && (
            <DeliveryFormStep
              onSubmit={handleDeliverySubmit}
              onBack={handleBackStep}
              initialData={deliveryData}
            />
          )}

          {currentStep === 'summary' && (
            <PaymentSummaryStep
              productTitle={productTitle}
              productPrice={productPrice}
              baseFee={baseFee}
              deliveryFee={deliveryFee}
              cardLastFour={cardData.cardNumber.slice(-4)}
              cardType={cardData.cardType}
              deliveryAddress={`${deliveryData.address}, ${deliveryData.city}`}
              installments={installments}
              quantity={quantity}
              stock={stock}
              onConfirm={handleConfirmPayment}
              onBack={handleBackStep}
              isProcessing={isProcessing}
              onInstallmentsChange={updateInstallments}
              onQuantityChange={updateQuantity}
            />
          )}

          {currentStep === 'result' && transactionResult && (
            <div className="space-y-6 flex flex-col items-center justify-center py-8">
              {/* Icono según el estado */}
              <div className="flex justify-center">
                {transactionResult.status === 'APPROVED' && (
                  <div className="w-20 h-20 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                    <CheckCircle size={40} className="text-green-600 dark:text-green-400" />
                  </div>
                )}
                {transactionResult.status === 'DECLINED' && (
                  <div className="w-20 h-20 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                    <XCircle size={40} className="text-red-600 dark:text-red-400" />
                  </div>
                )}
                {transactionResult.status === 'PENDING' && (
                  <div className="w-20 h-20 rounded-full bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center">
                    <Clock size={40} className="text-yellow-600 dark:text-yellow-400" />
                  </div>
                )}
                {transactionResult.status === 'VOIDED' && (
                  <div className="w-20 h-20 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                    <AlertCircle size={40} className="text-gray-600 dark:text-gray-400" />
                  </div>
                )}
                {transactionResult.status === 'ERROR' && (
                  <div className="w-20 h-20 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                    <AlertCircle size={40} className="text-red-600 dark:text-red-400" />
                  </div>
                )}
              </div>

              {/* Mensaje */}
              <div className="text-center space-y-2">
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">
                  {transactionResult.status === 'APPROVED' && '¡Transacción Aprobada!'}
                  {transactionResult.status === 'DECLINED' && 'Transacción Rechazada'}
                  {transactionResult.status === 'PENDING' && 'Transacción Pendiente'}
                  {transactionResult.status === 'VOIDED' && 'Transacción Anulada'}
                  {transactionResult.status === 'ERROR' && 'Error en la Transacción'}
                </h3>
                <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300">
                  {transactionResult.message}
                </p>
              </div>

              {/* Botones */}
              <div className="w-full space-y-2">
                {transactionResult.status === 'APPROVED' && (
                  <button
                    onClick={() => {
                      onPaymentSuccess?.();
                      onClose();
                    }}
                    className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-lg transition-colors"
                  >
                    Finalizar
                  </button>
                )}
                {transactionResult.status !== 'APPROVED' && (
                  <>
                    <button
                      onClick={() => setCurrentStep('summary')}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-colors"
                    >
                      Intentar de Nuevo
                    </button>
                    <button
                      onClick={onClose}
                      className="w-full bg-gray-400 hover:bg-gray-500 text-white font-semibold py-3 rounded-lg transition-colors"
                    >
                      Cancelar
                    </button>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
