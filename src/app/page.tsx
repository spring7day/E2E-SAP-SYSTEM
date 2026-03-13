'use client';

import { useEffect, useState } from 'react';
import ProductCard from '@/components/products/ProductCard';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { useLocale } from '@/hooks/useLocale';
import { PortalProduct } from '@/lib/sap-types';

export default function HomePage() {
  const [products, setProducts] = useState<PortalProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const { locale, t } = useLocale();

  useEffect(() => {
    async function loadProducts() {
      setLoading(true);
      try {
        const res = await fetch(`/api/sap/products?locale=${locale}`);
        if (!res.ok) throw new Error('Failed to load products');
        const data = await res.json();
        setProducts(data.products);
      } catch (err) {
        setError(err instanceof Error ? err.message : t('common.error'));
      } finally {
        setLoading(false);
      }
    }
    loadProducts();
  }, [locale, t]);

  const allLabel = t('home.categoryAll');
  const categories = [allLabel, ...Array.from(new Set(products.map((p) => p.category)))];

  const filteredProducts =
    selectedCategory === allLabel
      ? products
      : products.filter((p) => p.category === selectedCategory);

  // Reset category filter when locale changes
  useEffect(() => {
    setSelectedCategory(allLabel);
  }, [allLabel]);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <section className="mb-10" data-testid="hero-section">
        <h1 className="text-4xl font-bold text-gray-900" data-testid="page-title">
          {t('home.title')}
        </h1>
        <p className="mt-2 text-lg text-gray-600">
          {t('home.subtitle')}
        </p>
      </section>

      {!loading && !error && products.length > 0 && (
        <section className="mb-8" aria-label="Category filter">
          <div className="flex flex-wrap gap-2" data-testid="category-filter">
            {categories.map((category) => (
              <button
                key={category}
                type="button"
                onClick={() => setSelectedCategory(category)}
                className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                  selectedCategory === category
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
                data-testid={`category-${category.toLowerCase().replace(/\s+/g, '-')}`}
              >
                {category}
              </button>
            ))}
          </div>
        </section>
      )}

      {loading && <LoadingSpinner message={t('home.loading')} />}

      {error && (
        <div className="rounded-lg bg-red-50 border border-red-200 p-6 text-center" role="alert" data-testid="error-message">
          <p className="text-red-800">{error}</p>
        </div>
      )}

      {!loading && !error && (
        <section aria-label="Product listing">
          <div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            data-testid="product-grid"
          >
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          {filteredProducts.length === 0 && (
            <p className="text-center text-gray-500 py-12">{t('home.noProducts')}</p>
          )}
        </section>
      )}
    </div>
  );
}
