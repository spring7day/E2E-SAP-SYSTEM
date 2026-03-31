import { PortalProduct, OrderTrackingResponse, OrderTrackingStep, OrderProcessStep } from './sap-types';
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
  'TG11', 'TG12', 'TG21',
];

// Order tracking mock data - 주문번호 끝자리로 단계 결정 (데모용)
function buildSteps(currentStep: OrderProcessStep): OrderTrackingStep[] {
  const allSteps: OrderProcessStep[] = ['ORDER_CREATED', 'DELIVERY_CREATED', 'GOODS_ISSUED', 'DELIVERY_CONFIRMED', 'BILLED'];
  const currentIdx = allSteps.indexOf(currentStep);

  const docNumbers: Partial<Record<OrderProcessStep, string>> = {
    DELIVERY_CREATED: '8000012001',
    GOODS_ISSUED: '8000012001',
    DELIVERY_CONFIRMED: '8000012001',
    BILLED: '9000008001',
  };
  const dates: Partial<Record<OrderProcessStep, string>> = {
    ORDER_CREATED: '2026-03-28',
    DELIVERY_CREATED: '2026-03-29',
    GOODS_ISSUED: '2026-03-30',
    DELIVERY_CONFIRMED: '2026-03-31',
    BILLED: '2026-03-31',
  };

  return allSteps.map((stepId, idx) => {
    const step: OrderTrackingStep = { id: stepId, status: 'pending' };
    if (idx < currentIdx) {
      step.status = 'completed';
      step.date = dates[stepId];
      if (docNumbers[stepId]) step.documentNumber = docNumbers[stepId];
    } else if (idx === currentIdx) {
      step.status = 'current';
      step.date = dates[stepId];
      if (docNumbers[stepId]) step.documentNumber = docNumbers[stepId];
    }
    return step;
  });
}

export function getMockOrderTracking(orderNumber: string): OrderTrackingResponse {
  const lastDigit = parseInt(orderNumber.slice(-1)) || 0;
  let currentStep: OrderProcessStep;
  if (lastDigit === 1 || lastDigit === 2) currentStep = 'ORDER_CREATED';
  else if (lastDigit === 3 || lastDigit === 4) currentStep = 'DELIVERY_CREATED';
  else if (lastDigit === 5 || lastDigit === 6) currentStep = 'GOODS_ISSUED';
  else if (lastDigit === 7 || lastDigit === 8) currentStep = 'DELIVERY_CONFIRMED';
  else currentStep = 'BILLED';

  return {
    salesOrder: orderNumber,
    customerPO: `PO-DEMO-${orderNumber.slice(-5)}`,
    creationDate: '2026-03-28',
    soldToParty: '17100003',
    overallStatus: currentStep === 'BILLED' ? 'C' : 'B',
    steps: buildSteps(currentStep),
    items: [
      { itemNumber: '000010', material: 'TG11', quantity: '2', unit: 'PC' },
      { itemNumber: '000020', material: 'TG12', quantity: '1', unit: 'PC' },
    ],
    ...(currentStep !== 'ORDER_CREATED' && {
      deliveryDocuments: [{
        deliveryDocument: '8000012001',
        goodsMovementDate: currentStep === 'GOODS_ISSUED' || currentStep === 'DELIVERY_CONFIRMED' || currentStep === 'BILLED' ? '2026-03-30' : undefined,
        goodsMovementStatus: currentStep === 'GOODS_ISSUED' || currentStep === 'DELIVERY_CONFIRMED' || currentStep === 'BILLED' ? 'C' : 'A',
        pickingStatus: 'C',
      }],
    }),
    ...(currentStep === 'BILLED' && {
      billingDocuments: [{
        billingDocument: '9000008001',
        billingDate: '2026-03-31',
        currency: 'USD',
        totalAmount: '3500.00',
      }],
    }),
    dataSource: 'mock',
  };
}

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
