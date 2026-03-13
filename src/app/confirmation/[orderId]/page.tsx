'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useLocale } from '@/hooks/useLocale';

export default function ConfirmationPage() {
  const params = useParams();
  const orderId = params.orderId as string;
  const { t } = useLocale();

  const displayOrderId = orderId.replace(/^0+/, '') || orderId;

  return (
    <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8 py-16">
      <section className="text-center" data-testid="confirmation-section">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-green-100 mb-6">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="h-10 w-10 text-green-600"
            aria-hidden="true"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
          </svg>
        </div>

        <h1 className="text-3xl font-bold text-gray-900" data-testid="confirmation-title">
          {t('confirmation.title')}
        </h1>
        <p className="mt-2 text-gray-600">
          {t('confirmation.thanks')}
        </p>

        <div className="mt-8 rounded-xl border border-gray-200 bg-gray-50 p-6" data-testid="order-details">
          <p className="text-sm text-gray-500">{t('confirmation.sapOrderNumber')}</p>
          <p className="mt-1 text-2xl font-bold text-blue-600" data-testid="sap-order-number">
            {displayOrderId}
          </p>
          <p className="mt-2 text-xs text-gray-400">
            {t('confirmation.fullRef')}: {orderId}
          </p>
        </div>

        <div className="mt-8 rounded-lg bg-blue-50 border border-blue-100 p-4">
          <p className="text-sm text-blue-800">
            {t('confirmation.processing')}
          </p>
        </div>

        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/"
            className="rounded-lg bg-blue-600 px-8 py-3 text-sm font-semibold text-white hover:bg-blue-700 transition-colors"
            data-testid="back-to-shopping"
          >
            {t('confirmation.backToShopping')}
          </Link>
        </div>
      </section>
    </div>
  );
}
