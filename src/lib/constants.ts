// SAP Organizational defaults
export const SAP_CONFIG = {
  salesOrg: process.env.SAP_SALES_ORG || '1710',
  distributionChannel: process.env.SAP_DISTRIBUTION_CHANNEL || '10',
  division: process.env.SAP_DIVISION || '00',
  defaultSoldToParty: '17100003',
  defaultOrderType: 'OR',
  // SAP demo system date context (Fully-Activated Appliance)
  requestedDeliveryDate: process.env.SAP_REQUESTED_DELIVERY_DATE || '2024-11-01',
  pricingDate: process.env.SAP_PRICING_DATE || '2024-11-01',
};

// Actual SAP CAL product prices (USD for demo)
export const PRODUCT_PRICES: Record<string, { price: number; currency: string }> = {
  'MZ-FG-C900': { price: 1299.00, currency: 'USD' },
  'MZ-FG-C950': { price: 1499.00, currency: 'USD' },
  'MZ-FG-C990': { price: 1799.00, currency: 'USD' },
  'MZ-FG-M500': { price: 1899.00, currency: 'USD' },
  'MZ-FG-M525': { price: 2199.00, currency: 'USD' },
  'MZ-FG-M550': { price: 2499.00, currency: 'USD' },
  'MZ-FG-R100': { price: 2299.00, currency: 'USD' },
  'MZ-FG-R200': { price: 2799.00, currency: 'USD' },
  'MZ-FG-R300': { price: 3299.00, currency: 'USD' },
  'MZ-TG-Y120': { price: 499.00, currency: 'USD' },
  'MZ-TG-Y200': { price: 599.00, currency: 'USD' },
  'MZ-TG-Y240': { price: 699.00, currency: 'USD' },
  'TG11': { price: 149.99, currency: 'USD' },
  'TG12': { price: 129.99, currency: 'USD' },
  'TG21': { price: 139.99, currency: 'USD' },
};

// Display names - English
export const PRODUCT_DISPLAY_NAMES: Record<string, string> = {
  'MZ-FG-C900': 'City Bike C900',
  'MZ-FG-C950': 'City Bike C950',
  'MZ-FG-C990': 'City Bike C990',
  'MZ-FG-M500': 'Mountain Bike M500',
  'MZ-FG-M525': 'Mountain Bike M525',
  'MZ-FG-M550': 'Mountain Bike M550',
  'MZ-FG-R100': 'Road Bike R100',
  'MZ-FG-R200': 'Road Bike R200',
  'MZ-FG-R300': 'Road Bike R300',
  'MZ-TG-Y120': 'Youth Bike Y120',
  'MZ-TG-Y200': 'Youth Bike Y200',
  'MZ-TG-Y240': 'Youth Bike Y240',
  'TG11': 'Trading Goods 11',
  'TG12': 'Trading Goods 12',
  'TG21': 'Trading Goods 21',
};

// Display names - Korean
export const PRODUCT_DISPLAY_NAMES_KO: Record<string, string> = {
  'MZ-FG-C900': '\uc2dc\ud2f0 \ubc14\uc774\ud06c C900',
  'MZ-FG-C950': '\uc2dc\ud2f0 \ubc14\uc774\ud06c C950',
  'MZ-FG-C990': '\uc2dc\ud2f0 \ubc14\uc774\ud06c C990',
  'MZ-FG-M500': '\ub9c8\uc6b4\ud2f4 \ubc14\uc774\ud06c M500',
  'MZ-FG-M525': '\ub9c8\uc6b4\ud2f4 \ubc14\uc774\ud06c M525',
  'MZ-FG-M550': '\ub9c8\uc6b4\ud2f4 \ubc14\uc774\ud06c M550',
  'MZ-FG-R100': '\ub85c\ub4dc \ubc14\uc774\ud06c R100',
  'MZ-FG-R200': '\ub85c\ub4dc \ubc14\uc774\ud06c R200',
  'MZ-FG-R300': '\ub85c\ub4dc \ubc14\uc774\ud06c R300',
  'MZ-TG-Y120': '\uc720\uc2a4 \ubc14\uc774\ud06c Y120',
  'MZ-TG-Y200': '\uc720\uc2a4 \ubc14\uc774\ud06c Y200',
  'MZ-TG-Y240': '\uc720\uc2a4 \ubc14\uc774\ud06c Y240',
  'TG11': '\uc0c1\ud488 11',
  'TG12': '\uc0c1\ud488 12',
  'TG21': '\uc0c1\ud488 21',
};

// Product descriptions - English
export const PRODUCT_DESCRIPTIONS: Record<string, string> = {
  'MZ-FG-C900': 'Lightweight city bike perfect for daily commuting. Comfortable upright riding position and integrated lights.',
  'MZ-FG-C950': 'Premium city bike with internal gear hub and belt drive. Maintenance-free and whisper-quiet.',
  'MZ-FG-C990': 'Top-of-the-line city bike with electronic shifting and hydraulic disc brakes.',
  'MZ-FG-M500': 'Entry-level mountain bike built for trail adventures. Durable aluminum frame with front suspension.',
  'MZ-FG-M525': 'Mid-range mountain bike with full suspension system. Tackles rough terrain with confidence.',
  'MZ-FG-M550': 'High-performance mountain bike with carbon fiber frame. Competition-ready for serious riders.',
  'MZ-FG-R100': 'Endurance road bike designed for long-distance comfort. Lightweight alloy frame.',
  'MZ-FG-R200': 'Performance road bike with carbon frame. Race-ready geometry and precision shifting.',
  'MZ-FG-R300': 'Professional road bike with full carbon construction. Aerodynamic design for maximum speed.',
  'MZ-TG-Y120': 'Kids bike for young riders aged 5-7. Stable design with training wheel compatibility.',
  'MZ-TG-Y200': 'Youth bike for riders aged 8-11. Lightweight frame with easy-to-use gears.',
  'MZ-TG-Y240': 'Youth bike for riders aged 10-13. Adult-like features in a youth-friendly size.',
  'TG11': 'General trading goods with standard procurement and regular trading process.',
  'TG12': 'General trading goods with reorder point planning and regular trading.',
  'TG21': 'General trading goods with standard logistics and regular trading process.',
};

// Product descriptions - Korean
export const PRODUCT_DESCRIPTIONS_KO: Record<string, string> = {
  'MZ-FG-C900': '\uc77c\uc0c1 \ud1b5\uadfc\uc5d0 \uc644\ubcbd\ud55c \uacbd\ub7c9 \uc2dc\ud2f0 \ubc14\uc774\ud06c. \ud3b8\uc548\ud55c \uc9c1\ub9bd \uc8fc\ud589 \uc790\uc138\uc640 \ub0b4\uc7a5 \ub77c\uc774\ud2b8.',
  'MZ-FG-C950': '\ub0b4\uc7a5 \uae30\uc5b4 \ud5c8\ube0c\uc640 \ubca8\ud2b8 \ub4dc\ub77c\uc774\ube0c\ub97c \uac16\ucd98 \ud504\ub9ac\ubbf8\uc5c4 \uc2dc\ud2f0 \ubc14\uc774\ud06c. \uc720\uc9c0\ubcf4\uc218 \ubd88\ud544\uc694.',
  'MZ-FG-C990': '\uc804\uc790 \ubcc0\uc18d\uae30\uc640 \uc720\uc555 \ub514\uc2a4\ud06c \ube0c\ub808\uc774\ud06c\ub97c \uac16\ucd98 \ucd5c\uace0\uae09 \uc2dc\ud2f0 \ubc14\uc774\ud06c.',
  'MZ-FG-M500': '\ud2b8\ub808\uc77c \ubaa8\ud5d8\uc744 \uc704\ud55c \uc785\ubb38\uc6a9 \ub9c8\uc6b4\ud2f4 \ubc14\uc774\ud06c. \ub0b4\uad6c\uc131 \uc54c\ub8e8\ubbf8\ub284 \ud504\ub808\uc784\uacfc \uc804\ubc29 \uc11c\uc2a4\ud39c\uc158.',
  'MZ-FG-M525': '\ud480 \uc11c\uc2a4\ud39c\uc158 \uc2dc\uc2a4\ud15c\uc758 \uc911\uae09 \ub9c8\uc6b4\ud2f4 \ubc14\uc774\ud06c. \uac70\uce5c \uc9c0\ud615\ub3c4 \uc790\uc2e0 \uc788\uac8c \uc8fc\ud30c.',
  'MZ-FG-M550': '\uce74\ubd04 \ud30c\uc774\ubc84 \ud504\ub808\uc784\uc758 \uace0\uc131\ub2a5 \ub9c8\uc6b4\ud2f4 \ubc14\uc774\ud06c. \ub300\ud68c \uc900\ube44 \ubaa8\ub378.',
  'MZ-FG-R100': '\uc7a5\uac70\ub9ac \uc8fc\ud589 \ud3b8\uc548\ud568\uc744 \uc704\ud55c \uc778\ub4c0\uc5b4\ub7f0\uc2a4 \ub85c\ub4dc \ubc14\uc774\ud06c. \uacbd\ub7c9 \ud569\uae08 \ud504\ub808\uc784.',
  'MZ-FG-R200': '\uce74\ubd04 \ud504\ub808\uc784\uc758 \ud37c\ud3ec\uba3c\uc2a4 \ub85c\ub4dc \ubc14\uc774\ud06c. \ub808\uc774\uc2a4 \uc900\ube44 \uc9c0\uc624\uba54\ud2b8\ub9ac\uc640 \uc815\ubc00 \ubcc0\uc18d.',
  'MZ-FG-R300': '\ud480 \uce74\ubd04 \uad6c\uc131\uc758 \ud504\ub85c\ud398\uc154\ub110 \ub85c\ub4dc \ubc14\uc774\ud06c. \ucd5c\ub300 \uc18d\ub3c4\ub97c \uc704\ud55c \uacf5\uae30\uc5ed\ud559\uc801 \ub514\uc790\uc778.',
  'MZ-TG-Y120': '5~7\uc138 \uc5b4\ub9b0\uc774\ub97c \uc704\ud55c \uc720\uc2a4 \ubc14\uc774\ud06c. \ubcf4\uc870 \ubc14\ud034 \ud638\ud658 \uc548\uc815\uc801 \uc124\uacc4.',
  'MZ-TG-Y200': '8~11\uc138 \uc5b4\ub9b0\uc774\ub97c \uc704\ud55c \uc720\uc2a4 \ubc14\uc774\ud06c. \uacbd\ub7c9 \ud504\ub808\uc784\uacfc \uc27d\uac8c \uc0ac\uc6a9\ud560 \uc218 \uc788\ub294 \uae30\uc5b4.',
  'MZ-TG-Y240': '10~13\uc138 \uc5b4\ub9b0\uc774\ub97c \uc704\ud55c \uc720\uc2a4 \ubc14\uc774\ud06c. \uccad\uc18c\ub144\uc5d0 \ub9de\ub294 \uc0ac\uc774\uc988\uc758 \uc131\uc778\uc6a9 \uae30\ub2a5.',
  'TG11': '\ud45c\uc900 \uc870\ub2ec \ubc0f \uc815\uaddc \uac70\ub798 \ud504\ub85c\uc138\uc2a4\uc758 \uc77c\ubc18 \uc0c1\ud488.',
  'TG12': '\uc7ac\uc8fc\ubb38\uc810 \uacc4\ud68d \ubc0f \uc815\uaddc \uac70\ub798 \ud504\ub85c\uc138\uc2a4\uc758 \uc77c\ubc18 \uc0c1\ud488.',
  'TG21': '\ud45c\uc900 \ubb3c\ub958 \ubc0f \uc815\uaddc \uac70\ub798 \ud504\ub85c\uc138\uc2a4\uc758 \uc77c\ubc18 \uc0c1\ud488.',
};

// Product category mapping
export const PRODUCT_CATEGORIES: Record<string, string> = {
  'MZ-FG-C900': 'City Bikes',
  'MZ-FG-C950': 'City Bikes',
  'MZ-FG-C990': 'City Bikes',
  'MZ-FG-M500': 'Mountain Bikes',
  'MZ-FG-M525': 'Mountain Bikes',
  'MZ-FG-M550': 'Mountain Bikes',
  'MZ-FG-R100': 'Road Bikes',
  'MZ-FG-R200': 'Road Bikes',
  'MZ-FG-R300': 'Road Bikes',
  'MZ-TG-Y120': 'Youth Bikes',
  'MZ-TG-Y200': 'Youth Bikes',
  'MZ-TG-Y240': 'Youth Bikes',
  'TG11': 'Accessories',
  'TG12': 'Accessories',
  'TG21': 'Accessories',
};

// Korean category names
export const PRODUCT_CATEGORIES_KO: Record<string, string> = {
  'City Bikes': '\uc2dc\ud2f0 \ubc14\uc774\ud06c',
  'Mountain Bikes': '\ub9c8\uc6b4\ud2f4 \ubc14\uc774\ud06c',
  'Road Bikes': '\ub85c\ub4dc \ubc14\uc774\ud06c',
  'Youth Bikes': '\uc720\uc2a4 \ubc14\uc774\ud06c',
  'Accessories': '\uc561\uc138\uc11c\ub9ac',
};

// Default price for products not in the price map
export const DEFAULT_PRICE = { price: 999.00, currency: 'USD' };

// Product images
export const PRODUCT_IMAGES: Record<string, string> = {};

export const DEFAULT_IMAGE = '/images/products/placeholder.svg';
