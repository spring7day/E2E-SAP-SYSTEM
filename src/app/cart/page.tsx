'use client';

import Link from 'next/link';
import { useCart } from '@/hooks/useCart';
import { useLocale } from '@/hooks/useLocale';
import CartItemComponent from '@/components/cart/CartItem';
import CartSummary from '@/components/cart/CartSummary';

export default function CartPage() {
  const { items } = useCart();
  const { t } = useLocale();

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8" data-testid="cart-title">
        {t('cart.title')}
      </h1>

      {items.length === 0 ? (
        <div className="text-center py-16" data-testid="cart-empty">
          <div className="text-6xl text-gray-300 mb-4">{'\ud83d\uded2'}</div>
          <p className="text-lg text-gray-500 mb-6">{t('cart.empty')}</p>
          <Link
            href="/"
            className="inline-block rounded-lg bg-blue-600 px-6 py-3 text-sm font-semibold text-white hover:bg-blue-700 transition-colors"
            data-testid="continue-shopping"
          >
            {t('cart.continueShopping')}
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="overflow-x-auto">
              <table className="w-full" data-testid="cart-table">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th scope="col" className="pb-3 text-left text-sm font-medium text-gray-500">{t('cart.product')}</th>
                    <th scope="col" className="pb-3 text-right text-sm font-medium text-gray-500 px-4">{t('cart.price')}</th>
                    <th scope="col" className="pb-3 text-center text-sm font-medium text-gray-500 px-4">{t('cart.quantity')}</th>
                    <th scope="col" className="pb-3 text-right text-sm font-medium text-gray-500 px-4">{t('cart.subtotal')}</th>
                    <th scope="col" className="pb-3 text-right text-sm font-medium text-gray-500 pl-4">
                      <span className="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item) => (
                    <CartItemComponent key={item.productId} item={item} />
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div>
            <CartSummary />
          </div>
        </div>
      )}
    </div>
  );
}
