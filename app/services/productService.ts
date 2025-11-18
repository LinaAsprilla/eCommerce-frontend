import apiClient from '@/app/config/apiClient';

// Interfaces de ejemplo
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  image: string;
  brand: string;
  rating: number;
  reviews: number;
  colors?: string[];
}

export interface ProductResponse {
  data: Product[];
}

export const productService = {
  async getAllProducts() {
    try {
      const response = await apiClient.get<Product[]>('/products');
      return response.data;
    } catch (error) {
      console.error('Error al obtener productos:', error);
      throw error;
    }
  },
};
