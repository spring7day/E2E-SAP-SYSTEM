'use client';

import { useContext } from 'react';
import { CartContext } from '@/components/cart/CartProvider';

export function useCart() {
  return useContext(CartContext);
}
