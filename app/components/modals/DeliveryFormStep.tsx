'use client';

import { useState, useEffect } from 'react';
import { usePaymentPersistence } from '@/app/hooks/usePaymentPersistence';
import { DeliveryData } from './PaymentModal';

interface DeliveryFormStepProps {
  readonly onSubmit: (data: DeliveryData) => void;
  readonly onBack: () => void;
  readonly initialData: DeliveryData;
}

export default function DeliveryFormStep({
  onSubmit,
  onBack,
  initialData,
}: DeliveryFormStepProps) {
  const { updateDeliveryData } = usePaymentPersistence();
  const [formData, setFormData] = useState<DeliveryData>(initialData);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    setFormData(initialData);
  }, [initialData]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const updatedData = { ...formData, [name]: value };
    setFormData(updatedData);
    updateDeliveryData(updatedData);
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Nombre completo requerido';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email requerido';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email inválido';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Teléfono requerido';
    } else if (!/^\d{10,}$/.test(formData.phone.replaceAll(/\D/g, ''))) {
      newErrors.phone = 'Teléfono inválido';
    }

    if (!formData.address.trim()) {
      newErrors.address = 'Dirección requerida';
    }

    if (!formData.city.trim()) {
      newErrors.city = 'Ciudad requerida';
    }

    if (!formData.postalCode.trim()) {
      newErrors.postalCode = 'Código postal requerido';
    }

    if (!formData.country.trim()) {
      newErrors.country = 'País requerido';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onSubmit(formData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Full Name */}
      <div>
        <label htmlFor="fullName" className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
          Nombre Completo
        </label>
        <input
          id="fullName"
          type="text"
          name="fullName"
          value={formData.fullName}
          onChange={handleInputChange}
          placeholder="Juan Pérez García"
          className={`w-full px-4 py-2 rounded-lg border-2 ${errors.fullName ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
            } dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500`}
        />
        {errors.fullName && (
          <p className="text-red-500 text-xs mt-1">{errors.fullName}</p>
        )}
      </div>

      {/* Email */}
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
          Email
        </label>
        <input
          id="email"
          type="email"
          name="email"
          value={formData.email}
          onChange={handleInputChange}
          placeholder="correo@ejemplo.com"
          className={`w-full px-4 py-2 rounded-lg border-2 ${errors.email ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
            } dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500`}
        />
        {errors.email && (
          <p className="text-red-500 text-xs mt-1">{errors.email}</p>
        )}
      </div>

      {/* Phone */}
      <div>
        <label htmlFor="phone" className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
          Teléfono
        </label>
        <input
          id="phone"
          type="tel"
          name="phone"
          value={formData.phone}
          onChange={handleInputChange}
          placeholder="+57 123 456 789"
          className={`w-full px-4 py-2 rounded-lg border-2 ${errors.phone ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
            } dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500`}
        />
        {errors.phone && (
          <p className="text-red-500 text-xs mt-1">{errors.phone}</p>
        )}
      </div>

      {/* Address */}
      <div>
        <label htmlFor="address" className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
          Dirección
        </label>
        <input
          id="address"
          type="text"
          name="address"
          value={formData.address}
          onChange={handleInputChange}
          placeholder="Calle Principal 123, Apt 4B"
          className={`w-full px-4 py-2 rounded-lg border-2 ${errors.address ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
            } dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500`}
        />
        {errors.address && (
          <p className="text-red-500 text-xs mt-1">{errors.address}</p>
        )}
      </div>

      {/* City and Postal Code */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="city" className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
            Ciudad
          </label>
          <input
            id="city"
            type="text"
            name="city"
            value={formData.city}
            onChange={handleInputChange}
            placeholder="Cali"
            className={`w-full px-4 py-2 rounded-lg border-2 ${errors.city ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
              } dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500`}
          />
          {errors.city && (
            <p className="text-red-500 text-xs mt-1">{errors.city}</p>
          )}
        </div>

        <div>
          <label htmlFor="postalCode" className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
            Código Postal
          </label>
          <input
            id="postalCode"
            type="text"
            name="postalCode"
            value={formData.postalCode}
            onChange={handleInputChange}
            placeholder="76001"
            className={`w-full px-4 py-2 rounded-lg border-2 ${errors.postalCode ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
              } dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500`}
          />
          {errors.postalCode && (
            <p className="text-red-500 text-xs mt-1">{errors.postalCode}</p>
          )}
        </div>
      </div>

      {/* Country */}
      <div>
        <label htmlFor="country" className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
          País
        </label>
        <input
          id="country"
          type="text"
          name="country"
          value={formData.country}
          onChange={handleInputChange}
          placeholder="Colombia"
          className={`w-full px-4 py-2 rounded-lg border-2 ${errors.country ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
            } dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500`}
        />
        {errors.country && (
          <p className="text-red-500 text-xs mt-1">{errors.country}</p>
        )}
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
          Revisar Resumen
        </button>
      </div>
    </form>
  );
}
