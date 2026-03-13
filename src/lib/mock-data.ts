import { PortalProduct } from './sap-types';
import {
  PRODUCT_PRICES,
  PRODUCT_DISPLAY_NAMES,
  PRODUCT_DESCRIPTIONS,
  PRODUCT_CATEGORIES,
  DEFAULT_PRICE,
  DEFAULT_IMAGE,
} from './constants';

const MATERIAL_IDS = [
  'MZ-FG-C900', 'MZ-FG-C950', 'MZ-FG-C990',
  'MZ-FG-M500', 'MZ-FG-M525', 'MZ-FG-M550',
  'MZ-FG-R100', 'MZ-FG-R200', 'MZ-FG-R300',
  'MZ-TG-Y120', 'MZ-TG-Y200', 'MZ-TG-Y240',
  'TG11', 'TG12',
];

export const MOCK_PRODUCTS: PortalProduct[] = MATERIAL_IDS.map((id) => {
  const priceInfo = PRODUCT_PRICES[id] || DEFAULT_PRICE;
  return {
    id,
    name: PRODUCT_DISPLAY_NAMES[id] || id,
    description: PRODUCT_DESCRIPTIONS[id] || '',
    price: priceInfo.price,
    currency: priceInfo.currency,
    unit: 'PC',
    category: PRODUCT_CATEGORIES[id] || 'General',
    image: DEFAULT_IMAGE,
  };
});
