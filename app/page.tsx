'use client'

import ProductCard from "./components/common/ProductCard";
import { useProducts } from "./hooks/useProducts";
import { getRandomImage, getRandomRating, getRandomReviews, getRandomColors, getRandomIsNew } from "./utils/productUtils";

export default function Home() {
  const { products, loading, error, refetch } = useProducts();

  if (loading) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center bg-linear-to-b from-gray-50 to-white dark:from-gray-900 dark:to-black">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Cargando productos...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center bg-linear-to-b from-gray-50 to-white dark:from-gray-900 dark:to-black p-4">
        <div className="text-center">
          <p className="text-red-600 dark:text-red-400 mb-4">Error: {error}</p>
          <button
            onClick={refetch}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-linear-to-b from-gray-50 to-white dark:from-gray-900 dark:to-black">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4 sm:p-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Nuestros Productos
        </h1>
        <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
          {products.length} productos disponibles
        </p>
      </div>

      {/* Main Content */}
      <div className="w-full px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6">
        {products.length === 0 ? (
          <div className="w-full min-h-96 flex flex-col items-center justify-center text-center">
            <div className="text-6xl mb-4">📦</div>
            <p className="text-gray-600 dark:text-gray-400 mb-4 text-sm sm:text-base">
              No hay productos disponibles.
            </p>
            <button
              onClick={refetch}
              className="px-6 py-2 bg-blue-800 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors cursor-pointer"
            >
              Reintentar
            </button>
          </div>
        ) : (
          <div className="w-full">
            {/* Grid responsive - mobile first */}
            <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4 md:gap-5 lg:gap-6">
              {products.map((product) => (
                <div key={product.id} className="w-full h-full">
                  <ProductCard
                    image={getRandomImage()}
                    title={product.name}
                    brand={product.description}
                    price={product.price}
                    rating={getRandomRating()}
                    reviews={getRandomReviews()}
                    isNew={getRandomIsNew()}
                    colors={getRandomColors()}
                    stock={product.stock}
                  />
                </div>
              ))}
            </div>

            {/* Load more button */}
            <div className="w-full flex justify-center mt-8 sm:mt-12">
              <button
                onClick={refetch}
                className="px-6 sm:px-8 py-2 sm:py-3 bg-blue-800 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors text-sm sm:text-base cursor-pointer"
              >
                Cargar más productos
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
