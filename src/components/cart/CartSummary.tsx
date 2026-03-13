'use client';

import Link from 'next/link';
import { useCart } from '@/hooks/useCart';
import { useLocale } from '@/hooks/useLocale';

export default function CartSummary() {
  const { totalItems, totalPrice } = useCart();
  const { t } = useLocale();

  return (
    <div className="rounded-xl border border-gray-200 bg-gray-50 p-6" data-testid="cart-summary">
      <h2 className="text-lg font-semibold text-gray-900">{t('cart.summary')}</h2>
      <dl className="mt-4 space-y-3">
        <div className="flex justify-between text-sm">
          <dt className="text-gray-600">{t('cart.items')}</dt>
          <dd className="font-medium text-gray-900" data-testid="cart-total-items">{totalItems}</dd>
        </div>
        <div className="flex justify-between text-sm">
          <dt className="text-gray-600">{t('cart.subtotal')}</dt>
          <dd className="font-medium text-gray-900" data-testid="cart-subtotal">${totalPrice.toFixed(2)}</dd>
        </div>
        <div className="border-t border-gray-200 pt-3 flex justify-between">
          <dt className="text-base font-semibold text-gray-900">{t('cart.total')}</dt>
          <dd className="text-base font-bold text-gray-900" data-testid="cart-total">${totalPrice.toFixed(2)}</dd>
        </div>
      </dl>
      <Link
        href="/checkout"
        className={`mt-6 block w-full rounded-lg px-6 py-3 text-center text-sm font-semibold text-white transition-colors ${
          totalItems > 0
            ? 'bg-blue-600 hover:bg-blue-700'
            : 'bg-gray-300 pointer-events-none'
        }`}
        data-testid="checkout-button"
        aria-disabled={totalItems === 0}
      >
        {t('cart.checkout')}
      </Link>
    </div>
  );
}
