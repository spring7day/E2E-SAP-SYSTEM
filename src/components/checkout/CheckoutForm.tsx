'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/hooks/useCart';
import { useLocale } from '@/hooks/useLocale';

export default function CheckoutForm() {
  const router = useRouter();
  const { items, totalPrice, clearCart } = useCart();
  const { locale, t } = useLocale();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [stockMap, setStockMap] = useState<Record<string, number>>({});
  const [stockLoaded, setStockLoaded] = useState(false);

  const [formData, setFormData] = useState({
    customerName: '',
    customerEmail: '',
    customerPhone: '',
  });

  // Fetch stock data for all cart items
  useEffect(() => {
    if (items.length === 0) return;
    async function checkStock() {
      try {
        const res = await fetch(`/api/sap/products?locale=${locale}`);
        if (res.ok) {
          const data = await res.json();
          const map: Record<string, number> = {};
          for (const p of data.products) {
            if (p.stockQuantity !== undefined) {
              map[p.id] = p.stockQuantity;
            }
          }
          setStockMap(map);
        }
      } catch { /* ignore */ }
      setStockLoaded(true);
    }
    checkStock();
  }, [items, locale]);

  const insufficientItems = stockLoaded
    ? items.filter((item) => {
        const available = stockMap[item.productId];
        return available !== undefined && item.quantity > available;
      })
    : [];
  const hasStockIssue = insufficientItems.length > 0;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch('/api/sap/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName: formData.customerName,
          customerEmail: formData.customerEmail,
          customerPhone: formData.customerPhone,
          soldToParty: '',
          items: items.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            unit: item.unit,
          })),
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || t('common.error'));
      }

      const data = await response.json();
      clearCart();
      router.push(`/confirmation/${data.order.salesOrderNumber}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : t('common.error'));
    } finally {
      setIsSubmitting(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="text-center py-12" data-testid="checkout-empty">
        <p className="text-gray-500">{t('checkout.emptyCart')}</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8" data-testid="checkout-form">
      <section aria-labelledby="customer-info-heading">
        <h2 id="customer-info-heading" className="text-xl font-semibold text-gray-900">
          {t('checkout.customerInfo')}
        </h2>
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label htmlFor="customerName" className="block text-sm font-medium text-gray-700">
              {t('checkout.fullName')}
            </label>
            <input
              type="text"
              id="customerName"
              name="customerName"
              value={formData.customerName}
              onChange={handleChange}
              required
              autoComplete="name"
              className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none"
              data-testid="input-customer-name"
            />
          </div>
          <div>
            <label htmlFor="customerEmail" className="block text-sm font-medium text-gray-700">
              {t('checkout.email')}
            </label>
            <input
              type="email"
              id="customerEmail"
              name="customerEmail"
              value={formData.customerEmail}
              onChange={handleChange}
              required
              autoComplete="email"
              className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none"
              data-testid="input-customer-email"
            />
          </div>
          <div>
            <label htmlFor="customerPhone" className="block text-sm font-medium text-gray-700">
              {t('checkout.phone')}
            </label>
            <input
              type="tel"
              id="customerPhone"
              name="customerPhone"
              value={formData.customerPhone}
              onChange={handleChange}
              required
              autoComplete="tel"
              className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none"
              data-testid="input-customer-phone"
            />
          </div>
        </div>
      </section>

      <section aria-labelledby="order-summary-heading">
        <h2 id="order-summary-heading" className="text-xl font-semibold text-gray-900">
          {t('checkout.orderSummary')}
        </h2>
        <div className="mt-4 rounded-lg border border-gray-200 overflow-hidden">
          <table className="min-w-full" data-testid="checkout-order-table">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">{t('cart.product')}</th>
                <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">{t('checkout.qty')}</th>
                <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">{t('cart.price')}</th>
                <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">{t('cart.subtotal')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {items.map((item) => (
                <tr key={item.productId} data-testid={`checkout-item-${item.productId}`}>
                  <td className="px-4 py-3 text-sm text-gray-900">{item.productName}</td>
                  <td className="px-4 py-3 text-sm text-gray-600 text-right">{item.quantity}</td>
                  <td className="px-4 py-3 text-sm text-gray-600 text-right">${item.price.toFixed(2)}</td>
                  <td className="px-4 py-3 text-sm font-medium text-gray-900 text-right">${(item.price * item.quantity).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="bg-gray-50">
                <td colSpan={3} className="px-4 py-3 text-sm font-semibold text-gray-900 text-right">{t('cart.total')}</td>
                <td className="px-4 py-3 text-base font-bold text-gray-900 text-right" data-testid="checkout-total">
                  ${totalPrice.toFixed(2)}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </section>

      {hasStockIssue && (
        <div className="rounded-lg bg-amber-50 border border-amber-200 p-4" role="alert" data-testid="checkout-stock-warning">
          {insufficientItems.map((item) => (
            <p key={item.productId} className="text-sm text-amber-800">
              {t('product.insufficientStock', { available: Math.floor(stockMap[item.productId] ?? 0) })} ({item.productName})
            </p>
          ))}
        </div>
      )}

      {error && (
        <div className="rounded-lg bg-red-50 border border-red-200 p-4" role="alert" data-testid="checkout-error">
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}

      <button
        type="submit"
        disabled={isSubmitting || hasStockIssue}
        className={`w-full rounded-lg px-6 py-3.5 text-base font-semibold text-white transition-colors ${
          isSubmitting || hasStockIssue
            ? 'bg-gray-400 cursor-not-allowed'
            : 'bg-blue-600 hover:bg-blue-700'
        }`}
        data-testid="place-order-button"
      >
        {isSubmitting ? t('checkout.processing') : t('checkout.placeOrder')}
      </button>
    </form>
  );
}
