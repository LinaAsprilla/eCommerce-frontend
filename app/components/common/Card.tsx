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
    <div className="w-full h-full rounded-2xl sm:rounded-3xl bg-gray-100 dark:bg-gray-800 p-3 sm:p-4 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col">
      {/* Header con badge y corazón */}
      <div className="flex items-center justify-between mb-3 sm:mb-4">
        {isNew && (
          <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400 text-xs sm:text-sm bg-yellow-100 dark:bg-yellow-900 px-2 py-1 rounded-full">
            <span className="text-sm sm:text-base">✨</span>
            <span>New</span>
          </div>
        )}
        <div className="flex-1" />
        <button
          onClick={() => setIsFavorite(!isFavorite)}
          className="p-1.5 sm:p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full transition-colors"
        >
          <Heart
            size={20}
            className={`sm:w-6 sm:h-6 ${isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-400'}`}
          />
        </button>
      </div>

      {/* Imagen del producto */}
      <div className="relative w-full aspect-square bg-white dark:bg-gray-700 rounded-xl sm:rounded-2xl overflow-hidden mb-3 sm:mb-4">
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          priority={false}
        />
      </div>

      {/* Colores disponibles */}
      {colors.length > 0 && (
        <div className="flex gap-2 mb-3 sm:mb-4">
          {colors.map((color) => (
            <button
              key={color}
              className="w-5 h-5 sm:w-6 sm:h-6 rounded-full border-2 border-gray-300 dark:border-gray-600 transition-all hover:scale-110"
              style={{ backgroundColor: color }}
              title={color}
            />
          ))}
        </div>
      )}

      {/* Información del producto */}
      <div className="flex-1 flex flex-col">
        <h3 className="text-sm sm:text-base font-semibold text-gray-900 dark:text-white mb-1 line-clamp-2">
          {title}
        </h3>
        <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-2 line-clamp-1">
          {brand}
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-500 mb-2 sm:mb-3">
          Stock: <span className="font-semibold text-gray-700 dark:text-gray-300">{stock}</span>
        </p>

        {/* Precio y rating */}
        <div className="flex items-center justify-between gap-2 mb-3 sm:mb-4 flex-wrap">
          <div className="px-2 sm:px-3 py-1 sm:py-2 border-2 border-green-500 dark:border-green-600 rounded-full bg-green-50 dark:bg-green-900/30">
            <span className="text-green-600 dark:text-green-400 font-bold text-xs sm:text-sm">
              ${price.toFixed(2)}
            </span>
          </div>
          <div className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm">
            <span className="text-yellow-400">⭐</span>
            <span className="font-medium text-gray-700 dark:text-gray-300">
              {rating}
            </span>
            <span className="text-gray-500 dark:text-gray-400 hidden sm:inline">
              ({reviews})
            </span>
          </div>
        </div>

        {/* Botón de pago */}
        <button
          onClick={() => handlePayment()}
          className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 text-white font-semibold py-2 sm:py-3 rounded-lg sm:rounded-xl transition-colors text-xs sm:text-sm mt-auto"
        >
          <CreditCard size={16} className="sm:w-5 sm:h-5" />
          <span>Pagar</span>
        </button>
      </div>
    </div>
  );
}
