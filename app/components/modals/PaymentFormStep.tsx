'use client';

import { useState, useEffect } from 'react';
import { usePaymentPersistence } from '@/app/hooks/usePaymentPersistence';
import { CardData } from './PaymentModal';

interface PaymentFormStepProps {
  readonly onSubmit: (data: CardData) => void;
  readonly onBack: () => void;
  readonly initialData: CardData;
}

const detectCardType = (cardNumber: string): 'visa' | 'mastercard' | 'unknown' => {
  const number = cardNumber.replaceAll(/\s/g, '');
  if (/^4\d{12}(?:\d{3})?$/.test(number)) return 'visa';
  if (/^5[1-5]\d{14}$/.test(number)) return 'mastercard';
  return 'unknown';
};

const validateCardNumber = (cardNumber: string): boolean => {
  const number = cardNumber.replaceAll(/\s/g, '');
  if (!/^\d{13,19}$/.test(number)) return false;

  let sum = 0;
  let isEven = false;
  for (let i = number.length - 1; i >= 0; i--) {
    let digit = Number.parseInt(number[i], 10);
    if (isEven) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }
    sum += digit;
    isEven = !isEven;
  }
  return sum % 10 === 0;
};

const formatCardNumber = (value: string): string => {
  const numbers = value.replaceAll(/\D/g, '').substring(0, 19);
  const parts = numbers.match(/.{1,4}/g) || [];
  return parts.join(' ');
};

const validateExpiryDate = (expiryDate: string): boolean => {
  if (!/^\d{2}\/\d{2}$/.test(expiryDate)) {
    return false;
  }

  const [monthStr, yearStr] = expiryDate.split('/');
  const month = Number.parseInt(monthStr, 10);
  const year = Number.parseInt(yearStr, 10);

  // Validar que el mes esté entre 01 y 12
  if (month < 1 || month > 12) {
    return false;
  }

  // Validar que el año no esté en el pasado
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear() % 100; // Últimos 2 dígitos
  const currentMonth = currentDate.getMonth() + 1;

  // Si el año es menor al actual, es inválido
  if (year < currentYear) {
    return false;
  }

  // Si el año es igual al actual, el mes debe ser >= al mes actual
  if (year === currentYear && month < currentMonth) {
    return false;
  }

  return true;
};

const formatExpiry = (value: string): string => {
  const numbers = value.replaceAll(/\D/g, '').substring(0, 4);
  if (numbers.length >= 2) {
    return `${numbers.substring(0, 2)}/${numbers.substring(2, 4)}`;
  }
  return numbers;
};

export default function PaymentFormStep({ onSubmit, onBack, initialData }: PaymentFormStepProps) {
  const { updateCardData } = usePaymentPersistence();
  const [formData, setFormData] = useState<CardData>(initialData);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const cardType = detectCardType(formData.cardNumber);

  useEffect(() => {
    setFormData(initialData);
  }, [initialData]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    let finalValue = value;

    if (name === 'cardNumber') {
      finalValue = formatCardNumber(value);
    } else if (name === 'expiryDate') {
      finalValue = formatExpiry(value);
    } else if (name === 'cvv') {
      finalValue = value.replaceAll(/\D/g, '').substring(0, 4);
    } else if (name === 'cardholderName') {
      finalValue = value.toUpperCase().replaceAll(/[^A-Z\s]/g, '');
    }

    const updatedData = { ...formData, [name]: finalValue };
    setFormData(updatedData);
    updateCardData(updatedData);
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.cardNumber.trim()) {
      newErrors.cardNumber = 'Número de tarjeta requerido';
    } else if (!validateCardNumber(formData.cardNumber)) {
      newErrors.cardNumber = 'Número de tarjeta inválido';
    }

    if (!formData.cardholderName.trim()) {
      newErrors.cardholderName = 'Nombre del titular requerido';
    }

    if (!formData.expiryDate.trim()) {
      newErrors.expiryDate = 'Fecha de vencimiento requerida';
    } else if (!validateExpiryDate(formData.expiryDate)) {
      newErrors.expiryDate = 'Fecha inválida. Mes (01-12) o año vencido';
    }

    if (!formData.cvv.trim()) {
      newErrors.cvv = 'CVV requerido';
    } else if (!/^\d{3,4}$/.test(formData.cvv)) {
      newErrors.cvv = 'CVV inválido';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onSubmit({
        ...formData,
        cardType,
      });
    }
  };

  const getCardNumberBorderClass = (): string => {
    if (errors.cardNumber) {
      return 'border-red-500';
    }
    if (formData.cardNumber && cardType !== 'unknown') {
      return 'border-green-500';
    }
    return 'border-gray-300 dark:border-gray-600';
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Card Number */}
      <div>
        <label htmlFor="cardNumber" className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
          Número de Tarjeta
        </label>
        <div className="relative">
          <input
            id="cardNumber"
            type="text"
            name="cardNumber"
            value={formData.cardNumber}
            onChange={handleInputChange}
            placeholder="1234 5678 9012 3456"
            className={`w-full px-4 py-2 rounded-lg border-2 ${getCardNumberBorderClass()} dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500`}
          />
          {cardType === 'visa' && (
            <div className="absolute right-3 top-2.5 text-blue-600 font-bold">VISA</div>
          )}
          {cardType === 'mastercard' && (
            <div className="absolute right-3 top-2.5">
              <div className="flex gap-1">
                <div className="w-4 h-4 bg-red-500 rounded-full"></div>
                <div className="w-4 h-4 bg-orange-500 rounded-full"></div>
              </div>
            </div>
          )}
        </div>
        {errors.cardNumber && (
          <p className="text-red-500 text-xs mt-1">{errors.cardNumber}</p>
        )}
      </div>

      {/* Cardholder Name */}
      <div>
        <label htmlFor="cardholderName" className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
          Nombre del Titular
        </label>
        <input
          id="cardholderName"
          type="text"
          name="cardholderName"
          value={formData.cardholderName}
          onChange={handleInputChange}
          placeholder="JUAN PEREZ"
          className={`w-full px-4 py-2 rounded-lg border-2 ${errors.cardholderName ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
            } dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500`}
        />
        {errors.cardholderName && (
          <p className="text-red-500 text-xs mt-1">{errors.cardholderName}</p>
        )}
      </div>

      {/* Expiry and CVV */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="expiryDate" className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
            Vencimiento
          </label>
          <input
            id="expiryDate"
            type="text"
            name="expiryDate"
            value={formData.expiryDate}
            onChange={handleInputChange}
            placeholder="MM/YY"
            className={`w-full px-4 py-2 rounded-lg border-2 ${errors.expiryDate ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
              } dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500`}
          />
          {errors.expiryDate && (
            <p className="text-red-500 text-xs mt-1">{errors.expiryDate}</p>
          )}
        </div>

        <div>
          <label htmlFor="cvv" className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
            CVV
          </label>
          <input
            id="cvv"
            type="text"
            name="cvv"
            value={formData.cvv}
            onChange={handleInputChange}
            placeholder="123"
            className={`w-full px-4 py-2 rounded-lg border-2 ${errors.cvv ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
              } dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500`}
          />
          {errors.cvv && (
            <p className="text-red-500 text-xs mt-1">{errors.cvv}</p>
          )}
        </div>
      </div>

      {/* Buttons */}
      <div className="flex gap-3 pt-4">
        <button
          type="button"
          onClick={onBack}
          className="flex-1 px-4 py-2 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-white rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors font-semibold"
        >
          Atrás
        </button>
        <button
          type="submit"
          className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-semibold"
        >
          Continuar
        </button>
      </div>
    </form>
  );
}
