import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api/v1';

// Crear instancia de axios
export const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 50000,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// Interceptor para agregar token en headers
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    if (typeof globalThis !== 'undefined' && globalThis.window) {
      const token = globalThis.window.localStorage.getItem('authToken');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// Interceptor para manejo de respuestas y errores
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      if (typeof globalThis !== 'undefined' && globalThis.window) {
        globalThis.window.localStorage.removeItem('authToken');
        globalThis.window.location.href = '/login';
      }
    }

    if (error.response?.status === 403) {
      console.error('Acceso denegado:', error.response.data);
    }

    if (error.response?.status === 404) {
      console.error('Recurso no encontrado:', error.response.data);
    }

    if (error.response?.status === 500) {
      console.error('Error del servidor:', error.response.data);
    }

    return Promise.reject(error);
  }
);

export default apiClient;
