'use client';

import Link from 'next/link';
import { PortalProduct } from '@/lib/sap-types';
import { useLocale } from '@/hooks/useLocale';

interface ProductCardProps {
  product: PortalProduct;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { t } = useLocale();
  const stock = product.stockQuantity;
  const hasStock = stock !== undefined;
  const isOutOfStock = hasStock && stock <= 0;
  const isLowStock = hasStock && stock > 0 && stock <= 10;

  return (
    <article
      className={`group rounded-xl border bg-white overflow-hidden shadow-sm hover:shadow-md transition-shadow ${
        isOutOfStock ? 'border-gray-300 opacity-75' : 'border-gray-200'
      }`}
      data-testid={`product-card-${product.id}`}
    >
      <Link href={`/products/${product.id}`} data-testid={`product-link-${product.id}`}>
        <div className="relative aspect-[4/3] bg-gray-100 flex items-center justify-center p-4">
          <div className="text-5xl group-hover:scale-110 transition-transform">
            {getCategoryIcon(product.category)}
          </div>
          {isOutOfStock && (
            <div className="absolute inset-0 bg-gray-900/40 flex items-center justify-center">
              <span className="rounded-full bg-red-600 px-3 py-1 text-sm font-semibold text-white" data-testid={`product-out-of-stock-${product.id}`}>
                {t('product.outOfStock')}
              </span>
            </div>
          )}
        </div>
        <div className="p-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-blue-600 uppercase tracking-wide" data-testid={`product-category-${product.id}`}>
              {product.category}
            </span>
            {hasStock && !isOutOfStock && (
              <span
                className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                  isLowStock
                    ? 'bg-amber-100 text-amber-700'
                    : 'bg-green-100 text-green-700'
                }`}
                data-testid={`product-stock-${product.id}`}
              >
                {isLowStock ? t('product.lowStock') : t('product.inStock')} ({Math.floor(stock)})
              </span>
            )}
          </div>
          <h3 className="mt-1 text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors" data-testid={`product-name-${product.id}`}>
            {product.name}
          </h3>
          <p className="mt-1 text-sm text-gray-500 line-clamp-2">
            {product.description}
          </p>
          <div className="mt-3 flex items-center justify-between">
            <span className="text-lg font-bold text-gray-900" data-testid={`product-price-${product.id}`}>
              ${product.price.toFixed(2)}
            </span>
            <span className="text-xs text-gray-400">
              / {product.unit}
            </span>
          </div>
        </div>
      </Link>
    </article>
  );
}

function getCategoryIcon(category: string): string {
  const lower = category.toLowerCase();
  if (lower.includes('city') || lower.includes('\uc2dc\ud2f0')) return '\ud83d\udeb2';
  if (lower.includes('mountain') || lower.includes('\ub9c8\uc6b4\ud2f4')) return '\u26f0\ufe0f';
  if (lower.includes('road') || lower.includes('\ub85c\ub4dc')) return '\ud83c\udfce\ufe0f';
  if (lower.includes('youth') || lower.includes('\uc720\uc2a4')) return '\ud83d\udc66';
  return '\ud83d\udce6';
}
