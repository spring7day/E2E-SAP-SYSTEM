'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import ProductDetail from '@/components/products/ProductDetail';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { useLocale } from '@/hooks/useLocale';
import { PortalProduct } from '@/lib/sap-types';

export default function ProductPage() {
  const params = useParams();
  const productId = params.productId as string;
  const [product, setProduct] = useState<PortalProduct | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { locale, t } = useLocale();

  useEffect(() => {
    async function loadProduct() {
      setLoading(true);
      try {
        const res = await fetch(`/api/sap/products/${encodeURIComponent(productId)}?locale=${locale}`);
        if (!res.ok) {
          if (res.status === 404) throw new Error('Product not found');
          throw new Error('Failed to load product');
        }
        const data = await res.json();
        setProduct(data.product);
      } catch (err) {
        setError(err instanceof Error ? err.message : t('common.error'));
      } finally {
        setLoading(false);
      }
    }
    loadProduct();
  }, [productId, locale, t]);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <nav aria-label="Breadcrumb" className="mb-8" data-testid="breadcrumb">
        <ol className="flex items-center gap-2 text-sm text-gray-500">
          <li>
            <Link href="/" className="hover:text-blue-600">{t('common.breadcrumb.products')}</Link>
          </li>
          <li aria-hidden="true">/</li>
          <li className="text-gray-900 font-medium">
            {product?.name || productId}
          </li>
        </ol>
      </nav>

      {loading && <LoadingSpinner />}

      {error && (
        <div className="text-center py-12" data-testid="product-error">
          <p className="text-red-600 mb-4">{error}</p>
          <Link href="/" className="text-blue-600 hover:underline">{t('common.breadcrumb.products')}</Link>
        </div>
      )}

      {!loading && !error && product && <ProductDetail product={product} />}
    </div>
  );
}
