'use client';

import { OrderTrackingStep, OrderProcessStep } from '@/lib/sap-types';
import { Locale, t } from '@/lib/i18n';

const STEP_LABEL_KEYS: Record<OrderProcessStep, string> = {
  ORDER_CREATED: 'tracking.step.orderCreated',
  DELIVERY_CREATED: 'tracking.step.deliveryCreated',
  GOODS_ISSUED: 'tracking.step.goodsIssued',
  DELIVERY_CONFIRMED: 'tracking.step.deliveryConfirmed',
  BILLED: 'tracking.step.billed',
};

const STEP_DESC_KEYS: Record<OrderProcessStep, string> = {
  ORDER_CREATED: 'tracking.step.desc.orderCreated',
  DELIVERY_CREATED: 'tracking.step.desc.deliveryCreated',
  GOODS_ISSUED: 'tracking.step.desc.goodsIssued',
  DELIVERY_CONFIRMED: 'tracking.step.desc.deliveryConfirmed',
  BILLED: 'tracking.step.desc.billed',
};

interface Props {
  steps: OrderTrackingStep[];
  locale: Locale;
}

export default function OrderStatusStepper({ steps, locale }: Props) {
  return (
    <div data-testid="order-stepper" className="relative">
      {steps.map((step, idx) => {
        const isLast = idx === steps.length - 1;
        const isCompleted = step.status === 'completed';
        const isCurrent = step.status === 'current';
        const isPending = step.status === 'pending';

        return (
          <div
            key={step.id}
            className="relative flex gap-4"
            data-testid={`step-${step.id}`}
          >
            {/* 왼쪽: 원형 아이콘 + 연결선 */}
            <div className="flex flex-col items-center">
              {/* 원형 아이콘 */}
              <div
                className={`relative z-10 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2 ${
                  isCompleted
                    ? 'bg-blue-600 border-blue-600'
                    : isCurrent
                    ? 'bg-blue-600 border-blue-600'
                    : 'bg-white border-gray-300'
                }`}
              >
                {isCompleted && (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2.5}
                    className="h-4 w-4 text-white"
                    aria-hidden="true"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                  </svg>
                )}
                {isCurrent && (
                  <span className="relative flex h-3 w-3">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white opacity-75" />
                    <span className="relative inline-flex h-3 w-3 rounded-full bg-white" />
                  </span>
                )}
                {isPending && (
                  <span className="h-2.5 w-2.5 rounded-full bg-gray-300" />
                )}
              </div>
              {/* 연결선 */}
              {!isLast && (
                <div
                  className={`mt-1 w-0.5 grow ${
                    isCompleted ? 'bg-blue-600' : 'bg-gray-200'
                  }`}
                  style={{ minHeight: '2rem' }}
                />
              )}
            </div>

            {/* 오른쪽: 내용 */}
            <div className={`pb-8 ${isLast ? 'pb-0' : ''} min-w-0`}>
              <p
                className={`text-sm font-semibold ${
                  isPending ? 'text-gray-400' : isCurrent ? 'text-blue-700' : 'text-gray-900'
                }`}
              >
                {t(locale, STEP_LABEL_KEYS[step.id] as Parameters<typeof t>[1])}
              </p>
              <p className={`mt-0.5 text-xs ${isPending ? 'text-gray-400' : 'text-gray-500'}`}>
                {t(locale, STEP_DESC_KEYS[step.id] as Parameters<typeof t>[1])}
              </p>
              {step.date && (
                <p className="mt-1 text-xs text-gray-400">{step.date}</p>
              )}
              {step.documentNumber && (
                <p className="mt-0.5 text-xs font-mono text-blue-500">
                  {t(locale, 'tracking.documentNumber')}: {step.documentNumber}
                </p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
