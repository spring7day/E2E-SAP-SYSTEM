'use client';

import { CartItem as CartItemType } from '@/lib/sap-types';
import { useCart } from '@/hooks/useCart';
import { useLocale } from '@/hooks/useLocale';

interface CartItemProps {
  item: CartItemType;
}

export default function CartItem({ item }: CartItemProps) {
  const { updateQuantity, removeItem } = useCart();
  const { t } = useLocale();

  return (
    <tr className="border-b border-gray-100" data-testid={`cart-item-${item.productId}`}>
      <td className="py-4 pr-4">
        <div className="flex items-center gap-4">
          <div className="h-16 w-16 flex-shrink-0 rounded-lg bg-gray-100 flex items-center justify-center">
            <span className="text-2xl">{'\ud83d\udeb2'}</span>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-900" data-testid={`cart-item-name-${item.productId}`}>
              {item.productName}
            </h3>
            <p className="text-xs text-gray-500">ID: {item.productId}</p>
          </div>
        </div>
      </td>
      <td className="py-4 px-4 text-right" data-testid={`cart-item-price-${item.productId}`}>
        <span className="text-sm font-medium text-gray-900">${item.price.toFixed(2)}</span>
      </td>
      <td className="py-4 px-4">
        <div className="flex items-center justify-center gap-2">
          <button
            type="button"
            onClick={() => updateQuantity(item.productId, item.quantity - 1)}
            className="h-8 w-8 rounded-md border border-gray-300 text-gray-600 hover:bg-gray-50 flex items-center justify-center"
            aria-label={`Decrease quantity of ${item.productName}`}
            data-testid={`cart-decrease-${item.productId}`}
          >
            &minus;
          </button>
          <input
            type="number"
            id={`qty-${item.productId}`}
            name={`quantity-${item.productId}`}
            min={1}
            max={99}
            value={item.quantity}
            onChange={(e) => updateQuantity(item.productId, parseInt(e.target.value) || 1)}
            className="w-14 rounded-md border border-gray-300 px-2 py-1 text-center text-sm"
            aria-label={`Quantity of ${item.productName}`}
            data-testid={`cart-quantity-${item.productId}`}
          />
          <button
            type="button"
            onClick={() => updateQuantity(item.productId, item.quantity + 1)}
            className="h-8 w-8 rounded-md border border-gray-300 text-gray-600 hover:bg-gray-50 flex items-center justify-center"
            aria-label={`Increase quantity of ${item.productName}`}
            data-testid={`cart-increase-${item.productId}`}
          >
            +
          </button>
        </div>
      </td>
      <td className="py-4 px-4 text-right" data-testid={`cart-item-subtotal-${item.productId}`}>
        <span className="text-sm font-semibold text-gray-900">
          ${(item.price * item.quantity).toFixed(2)}
        </span>
      </td>
      <td className="py-4 pl-4 text-right">
        <button
          type="button"
          onClick={() => removeItem(item.productId)}
          className="text-sm text-red-600 hover:text-red-800 font-medium"
          aria-label={`Remove ${item.productName} from cart`}
          data-testid={`cart-remove-${item.productId}`}
        >
          {t('common.remove')}
        </button>
      </td>
    </tr>
  );
}
