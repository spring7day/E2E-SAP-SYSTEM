'use client';

import { OrderTrackingResponse } from '@/lib/sap-types';
import { Locale, t } from '@/lib/i18n';

interface Props {
  items: OrderTrackingResponse['items'];
  locale: Locale;
}

export default function OrderItemsTable({ items, locale }: Props) {
  if (!items || items.length === 0) return null;

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200" data-testid="order-items-table">
      <table className="w-full text-sm">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
              #
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
              {t(locale, 'tracking.material')}
            </th>
            <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-gray-500">
              {t(locale, 'tracking.quantity')}
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100 bg-white">
          {items.map((item) => (
            <tr key={item.itemNumber}>
              <td className="px-4 py-3 text-gray-400 tabular-nums">{item.itemNumber}</td>
              <td className="px-4 py-3 font-mono font-medium text-gray-900">{item.material}</td>
              <td className="px-4 py-3 text-right text-gray-700 tabular-nums">
                {item.quantity} <span className="text-gray-400">{item.unit}</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
