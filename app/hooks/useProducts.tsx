'use client';

import { useEffect } from 'react';
import { useDispatch, useSelector, TypedUseSelectorHook } from 'react-redux';
import { fetchProducts, resetProducts } from '@/app/store/slices/productsSlice';
import { RootState, AppDispatch } from '@/app/store/store';

export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export const useAppDispatch = () => useDispatch<AppDispatch>();

export const useProducts = () => {
  const dispatch = useAppDispatch();
  const { items, loading, error } = useAppSelector(
    (state) => state.products
  );

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  return {
    products: items,
    loading,
    error,
    refetch: () => dispatch(fetchProducts()),
    reset: () => dispatch(resetProducts()),
  };
};


