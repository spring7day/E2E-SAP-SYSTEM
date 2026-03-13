'use client';

import Link from 'next/link';
import { useLocale } from '@/hooks/useLocale';
import CheckoutForm from '@/components/checkout/CheckoutForm';

export default function CheckoutPage() {
  const { t } = useLocale();

  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-8">
      <nav aria-label="Breadcrumb" className="mb-8" data-testid="checkout-breadcrumb">
        <ol className="flex items-center gap-2 text-sm text-gray-500">
          <li>
            <Link href="/" className="hover:text-blue-600">{t('common.breadcrumb.products')}</Link>
          </li>
          <li aria-hidden="true">/</li>
          <li>
            <Link href="/cart" className="hover:text-blue-600">{t('common.breadcrumb.cart')}</Link>
          </li>
          <li aria-hidden="true">/</li>
          <li className="text-gray-900 font-medium">{t('common.breadcrumb.checkout')}</li>
        </ol>
      </nav>

      <h1 className="text-3xl font-bold text-gray-900 mb-8" data-testid="checkout-title">
        {t('checkout.title')}
      </h1>

      <CheckoutForm />
    </div>
  );
}
