'use client';

import { Check } from 'lucide-react';

interface PaymentSummaryStepProps {
  readonly productTitle: string;
  readonly productPrice: number;
  readonly baseFee: number;
  readonly deliveryFee: number;
  readonly cardLastFour: string;
  readonly cardType: 'visa' | 'mastercard' | 'unknown';
  readonly deliveryAddress: string;
  readonly installments: number;
  readonly quantity: number;
  readonly stock: number;
  readonly onConfirm: () => void;
  readonly onBack: () => void;
  readonly isProcessing?: boolean;
  readonly onInstallmentsChange: (installments: number) => void;
  readonly onQuantityChange: (quantity: number) => void;
}

export default function PaymentSummaryStep({
  productTitle,
  productPrice,
  baseFee,
  deliveryFee,
  cardLastFour,
  cardType,
  deliveryAddress,
  installments,
  quantity,
  stock,
  onConfirm,
  onBack,
  isProcessing = false,
  onInstallmentsChange,
  onQuantityChange,
}: PaymentSummaryStepProps) {
  const subtotal = productPrice * quantity;
  const total = subtotal + baseFee + deliveryFee;

  return (
    <div className="space-y-6">
      {/* Product Summary */}
      <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
        <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Resumen del Producto</h3>
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-gray-700 dark:text-gray-300 text-sm">{productTitle}</span>
            <span className="font-semibold text-gray-900 dark:text-white">
              ${productPrice.toFixed(2)}
            </span>
          </div>
          <div className="flex justify-between items-center pt-2 border-t border-gray-300 dark:border-gray-600">
            <span className="text-gray-700 dark:text-gray-300 text-sm">Subtotal ({quantity}x)</span>
            <span className="font-semibold text-gray-900 dark:text-white">
              ${subtotal.toFixed(2)}
            </span>
          </div>
        </div>
      </div>

      {/* Quantity and Installments */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="quantity" className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
            Cantidad
          </label>
          <input
            id="quantity"
            type="number"
            min="1"
            max={stock}
            value={quantity}
            onChange={(e) => {
              const value = Number.parseInt(e.target.value) || 1;
              const validQuantity = Math.max(1, Math.min(value, stock));
              onQuantityChange(validQuantity);
            }}
            className="w-full px-3 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label htmlFor="installments" className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
            Cuotas
          </label>
          <select
            id="installments"
            value={installments}
            onChange={(e) => onInstallmentsChange(Number.parseInt(e.target.value))}
            className="w-full px-3 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="1">1 cuota</option>
            <option value="2">2 cuotas</option>
            <option value="3">3 cuotas</option>
            <option value="6">6 cuotas</option>
            <option value="12">12 cuotas</option>
          </select>
        </div>
      </div>

      {/* Fees Breakdown */}
      <div className="bg-blue-50 dark:bg-blue-900/30 rounded-lg p-4 space-y-3">
        <h3 className="font-semibold text-gray-900 dark:text-white">Desglose de Cargos</h3>

        <div className="flex justify-between items-center">
          <span className="text-gray-700 dark:text-gray-300 text-sm">Tarifa Base</span>
          <span className="text-gray-900 dark:text-white">${baseFee.toFixed(2)}</span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-gray-700 dark:text-gray-300 text-sm">Tarifa de Envío</span>
          <span className="text-gray-900 dark:text-white">${deliveryFee.toFixed(2)}</span>
        </div>

        <div className="border-t border-blue-200 dark:border-blue-800 pt-3 flex justify-between items-center">
          <span className="font-semibold text-gray-900 dark:text-white">Total</span>
          <span className="text-xl font-bold text-blue-600 dark:text-blue-400">
            ${total.toFixed(2)}
          </span>
        </div>
      </div>

      {/* Payment Method */}
      <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
        <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Método de Pago</h3>
        <div className="flex items-center gap-3">
          {cardType === 'visa' && (
            <div className="text-blue-600 font-bold text-lg">VISA</div>
          )}
          {cardType === 'mastercard' && (
            <div className="flex gap-1">
              <div className="w-5 h-5 bg-red-500 rounded-full"></div>
              <div className="w-5 h-5 bg-orange-500 rounded-full"></div>
            </div>
          )}
          <span className="text-gray-700 dark:text-gray-300">****  ****  ****  {cardLastFour}</span>
        </div>
      </div>

      {/* Delivery Address */}
      <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
        <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Dirección de Envío</h3>
        <p className="text-gray-700 dark:text-gray-300 text-sm">{deliveryAddress}</p>
      </div>

      {/* Confirmation */}
      <div className="bg-green-50 dark:bg-green-900/30 border-2 border-green-200 dark:border-green-800 rounded-lg p-4">
        <div className="flex gap-3 items-center">
          <Check className="text-green-600 dark:text-green-400" size={20} />
          <p className="text-sm text-green-800 dark:text-green-200">
            Verifica que todos los datos sean correctos antes de confirmar el pago.
          </p>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex gap-3 pt-4">
        <button
          onClick={onBack}
          disabled={isProcessing}
          className="flex-1 px-4 py-2 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-white rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Atrás
        </button>
        <button
          onClick={onConfirm}
          disabled={isProcessing}
          className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors font-semibold flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isProcessing ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              Procesando...
            </>
          ) : (
            <>
              <Check size={20} />
              Confirmar Pago
            </>
          )}
        </button>
      </div>
    </div>
  );
}
