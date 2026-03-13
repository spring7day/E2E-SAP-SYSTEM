'use client';

import { useState } from 'react';
import { useCart } from '@/hooks/useCart';
import { useLocale } from '@/hooks/useLocale';
import { PortalProduct } from '@/lib/sap-types';

interface ProductDetailProps {
  product: PortalProduct;
}

export default function ProductDetail({ product }: ProductDetailProps) {
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const { addItem } = useCart();
  const { t } = useLocale();

  const stock = product.stockQuantity;
  const hasStock = stock !== undefined;
  const isOutOfStock = hasStock && stock <= 0;
  const isLowStock = hasStock && stock > 0 && stock <= 10;
  const maxQuantity = hasStock ? Math.min(99, Math.floor(stock)) : 99;

  const handleAddToCart = () => {
    if (isOutOfStock) return;
    addItem({
      productId: product.id,
      productName: product.name,
      quantity,
      unit: product.unit,
      price: product.price,
      currency: product.currency,
      image: product.image,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <article className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12" data-testid="product-detail">
      <div className="aspect-square bg-gray-100 rounded-xl flex items-center justify-center">
        <div className="text-9xl text-gray-300">
          {getCategoryIcon(product.category)}
        </div>
      </div>

      <div className="flex flex-col">
        <span className="text-sm font-medium text-blue-600 uppercase tracking-wide" data-testid="product-detail-category">
          {product.category}
        </span>
        <h1 className="mt-2 text-3xl font-bold text-gray-900" data-testid="product-detail-name">
          {product.name}
        </h1>
        <p className="mt-2 text-sm text-gray-500" data-testid="product-detail-id">
          {t('product.id')}: {product.id}
        </p>
        <p className="mt-4 text-gray-600 leading-relaxed" data-testid="product-detail-description">
          {product.description}
        </p>

        <div className="mt-6">
          <span className="text-3xl font-bold text-gray-900" data-testid="product-detail-price">
            ${product.price.toFixed(2)}
          </span>
          <span className="ml-2 text-sm text-gray-500">{t('product.per')} {product.unit}</span>
        </div>

        {hasStock && (
          <div className="mt-4" data-testid="product-detail-stock">
            {isOutOfStock ? (
              <span className="inline-flex items-center rounded-full bg-red-100 px-3 py-1 text-sm font-medium text-red-700">
                {t('product.outOfStock')}
              </span>
            ) : isLowStock ? (
              <span className="inline-flex items-center rounded-full bg-amber-100 px-3 py-1 text-sm font-medium text-amber-700">
                {t('product.lowStock')} - {t('product.stockUnit', { quantity: Math.floor(stock), unit: product.unit })}
              </span>
            ) : (
              <span className="inline-flex items-center rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-700">
                {t('product.inStock')} - {t('product.stockUnit', { quantity: Math.floor(stock), unit: product.unit })}
              </span>
            )}
          </div>
        )}

        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleAddToCart();
          }}
          className="mt-8 flex flex-col gap-4"
          data-testid="add-to-cart-form"
        >
          <div className="flex items-center gap-4">
            <label htmlFor="quantity" className="text-sm font-medium text-gray-700">
              {t('product.quantity')}
            </label>
            <input
              type="number"
              id="quantity"
              name="quantity"
              min={1}
              max={maxQuantity}
              value={quantity}
              onChange={(e) => setQuantity(Math.max(1, Math.min(maxQuantity, parseInt(e.target.value) || 1)))}
              disabled={isOutOfStock}
              className="w-20 rounded-lg border border-gray-300 px-3 py-2 text-center text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none disabled:bg-gray-100 disabled:text-gray-400"
              data-testid="quantity-input"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isOutOfStock}
            className={`w-full rounded-lg px-6 py-3 text-sm font-semibold text-white transition-colors ${
              isOutOfStock
                ? 'bg-gray-400 cursor-not-allowed'
                : added
                  ? 'bg-green-600 hover:bg-green-700'
                  : 'bg-blue-600 hover:bg-blue-700'
            }`}
            data-testid="add-to-cart-button"
          >
            {isOutOfStock ? t('product.outOfStock') : added ? t('product.added') : t('product.addToCart')}
          </button>
        </form>
      </div>
    </article>
  );
}

function getCategoryIcon(category: string): string {
  const lower = category.toLowerCase();
  if (lower.includes('city') || lower.includes('\uc2dc\ud2f0')) return '\ud83d\udeb2';
  if (lower.includes('mountain') || lower.includes('\ub9c8\uc6b4\ud2f4')) return '\u26f0\ufe0f';
  if (lower.includes('road') || lower.includes('\ub85c\ub4dc')) return '\ud83c\udfce\ufe0f';
  if (lower.includes('youth') || lower.includes('\uc720\uc2a4')) return '\ud83d\udc66';
  return '\ud83d\udeb2';
}
