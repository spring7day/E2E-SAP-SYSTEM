'use client';

import Link from 'next/link';
import { useCart } from '@/hooks/useCart';
import { useLocale } from '@/hooks/useLocale';
import { Locale } from '@/lib/i18n';

export default function Header() {
  const { totalItems } = useCart();
  const { locale, setLocale, t } = useLocale();

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm" data-testid="header">
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8" aria-label="Main navigation">
        <div className="flex h-16 items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2 text-xl font-bold text-gray-900"
            data-testid="header-logo"
          >
            <span className="text-blue-600">{t('header.brand')}</span>
            <span className="text-sm font-normal text-gray-500">{t('header.brandSub')}</span>
          </Link>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-1 border border-gray-200 rounded-full p-0.5" data-testid="language-switcher">
              <button
                type="button"
                onClick={() => setLocale('en' as Locale)}
                className={`px-2.5 py-1 text-xs font-medium rounded-full transition-colors ${
                  locale === 'en' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-100'
                }`}
                data-testid="lang-en"
                aria-label="Switch to English"
              >
                EN
              </button>
              <button
                type="button"
                onClick={() => setLocale('ko' as Locale)}
                className={`px-2.5 py-1 text-xs font-medium rounded-full transition-colors ${
                  locale === 'ko' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-100'
                }`}
                data-testid="lang-ko"
                aria-label="Switch to Korean"
              >
                KO
              </button>
            </div>

            <Link
              href="/"
              className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors"
              data-testid="nav-products"
            >
              {t('header.products')}
            </Link>
            <Link
              href="/cart"
              className="relative flex items-center text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors"
              data-testid="nav-cart"
              aria-label={t('header.cartAriaLabel', { count: totalItems })}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="h-6 w-6"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z"
                />
              </svg>
              <span className="ml-1">{t('header.cart')}</span>
              {totalItems > 0 && (
                <span
                  className="absolute -top-2 -right-3 flex h-5 w-5 items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-white"
                  data-testid="cart-badge"
                >
                  {totalItems}
                </span>
              )}
            </Link>
          </div>
        </div>
      </nav>
    </header>
  );
}
