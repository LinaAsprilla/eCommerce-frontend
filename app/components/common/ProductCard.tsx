'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Heart, CreditCard } from 'lucide-react';

interface CardProps {
  readonly image: string;
  readonly title: string;
  readonly brand: string;
  readonly price: number;
  readonly rating: number;
  readonly reviews: number;
  readonly stock: number;
  readonly isNew?: boolean;
  readonly colors?: string[];
}

export default function CardProduct({
  image,
  title,
  brand,
  price,
  rating,
  reviews,
  stock,
  isNew = false,
  colors = [],
}: CardProps) {
  const [isFavorite, setIsFavorite] = useState(false);

  const handlePayment = () => {
    alert(`Procesando pago de $${price.toFixed(2)} para ${title}`);
  };

  return (
    <div className="w-full max-w-sm rounded-3xl bg-gray-100 p-4 shadow-sm hover:shadow-md transition-shadow">
      {/* Header con badge y corazón */}
      <div className="flex items-center justify-between mb-4">
        {isNew && (
          <div className="flex items-center gap-1 text-gray-600 text-sm">
            <span className="text-lg">✨</span>
            <span>New in</span>
          </div>
        )}
        <div className="flex-1" />
        <button
          onClick={() => setIsFavorite(!isFavorite)}
          className="p-2 hover:bg-gray-200 rounded-full transition-colors"
        >
          <Heart
            size={24}
            className={`${isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-400'}`}
          />
        </button>
      </div>

      {/* Imagen del producto */}
      <div className="relative w-full h-64 bg-white rounded-2xl overflow-hidden mb-4">
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover"
        />
      </div>

      {/* Colores disponibles */}
      {colors.length > 0 && (
        <div className="flex gap-3 mb-4">
          {colors.map((color) => (
            <button
              key={color}
              className={`w-6 h-6 rounded-full border-2 border-gray-300 transition-all hover:border-gray-500`}
              style={{ backgroundColor: color }}
              title={color}
            />
          ))}
        </div>
      )}

      {/* Información del producto */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-1">
          {title}
        </h3>
        <p className="text-sm text-gray-600 mb-1">
          {brand}
        </p>
        <p className="text-xs text-gray-500 mb-3">
          Stock: <span className="font-semibold text-gray-700">{stock} disponibles</span>
        </p>

        {/* Precio y rating */}
        <div className="flex items-center justify-between mb-4">
          <div className="px-3 py-2 border-2 border-green-500 rounded-full">
            <span className="text-green-600 font-bold">
              ${price.toFixed(2)}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-yellow-400 text-lg">⭐</span>
            <span className="text-sm font-medium text-gray-700">
              {rating}
            </span>
            <span className="text-xs text-gray-500">
              ({reviews} reviews)
            </span>
          </div>
        </div>

        {/* Botón de pago */}
        <button
          onClick={() => handlePayment()}
          className="w-full flex items-center justify-center gap-2 bg-blue-800 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl transition-colors cursor-pointer"
        >
          <CreditCard size={20} />
          <span>Pagar con tarjeta de crédito</span>
        </button>
      </div>
    </div>
  );
}
