'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { useLocale } from '@/hooks/useLocale';

export default function OrderTrackPage() {
  const { t } = useLocale();
  const router = useRouter();
  const [orderNumber, setOrderNumber] = useState('');

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const trimmed = orderNumber.trim();
    if (!trimmed) return;
    router.push(`/orders/track/${encodeURIComponent(trimmed)}`);
  }

  return (
    <div className="mx-auto max-w-xl px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center mb-10">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 mb-5">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="h-8 w-8 text-blue-600"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 15.803a7.5 7.5 0 0 0 10.607 0Z"
            />
          </svg>
        </div>
        <h1 className="text-3xl font-bold text-gray-900">{t('tracking.title')}</h1>
        <p className="mt-2 text-gray-500">{t('tracking.subtitle')}</p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="rounded-xl border border-gray-200 bg-white p-8 shadow-sm"
        data-testid="order-track-form"
      >
        <label
          htmlFor="order-number-input"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          {t('tracking.inputLabel')}
        </label>
        <input
          id="order-number-input"
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          value={orderNumber}
          onChange={(e) => setOrderNumber(e.target.value.replace(/\D/g, ''))}
          placeholder={t('tracking.inputPlaceholder')}
          className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
          data-testid="order-number-input"
          autoComplete="off"
        />
        <button
          type="submit"
          disabled={!orderNumber.trim()}
          className="mt-4 w-full rounded-lg bg-blue-600 px-6 py-3 text-sm font-semibold text-white hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          data-testid="track-submit"
        >
          {t('tracking.submit')}
        </button>
      </form>
    </div>
  );
}
