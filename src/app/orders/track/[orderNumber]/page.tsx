'use client';

import { useEffect, useState, useCallback } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useLocale } from '@/hooks/useLocale';
import { OrderTrackingResponse, OrderProcessStep } from '@/lib/sap-types';
import OrderStatusStepper from '@/components/orders/OrderStatusStepper';
import OrderItemsTable from '@/components/orders/OrderItemsTable';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

const DATA_SOURCE_KEY: Record<OrderTrackingResponse['dataSource'], string> = {
  full: 'tracking.dataSource.full',
  'sales-order-only': 'tracking.dataSource.salesOrderOnly',
  mock: 'tracking.dataSource.mock',
};

const STEP_I18N_KEY: Record<OrderProcessStep, string> = {
  ORDER_CREATED: 'tracking.step.orderCreated',
  DELIVERY_CREATED: 'tracking.step.deliveryCreated',
  GOODS_ISSUED: 'tracking.step.goodsIssued',
  DELIVERY_CONFIRMED: 'tracking.step.deliveryConfirmed',
  BILLED: 'tracking.step.billed',
};

const STEP_COLOR: Record<OrderProcessStep, string> = {
  ORDER_CREATED: 'bg-blue-100 text-blue-700',
  DELIVERY_CREATED: 'bg-indigo-100 text-indigo-700',
  GOODS_ISSUED: 'bg-amber-100 text-amber-700',
  DELIVERY_CONFIRMED: 'bg-teal-100 text-teal-700',
  BILLED: 'bg-green-100 text-green-700',
};

export default function OrderTrackResultPage() {
  const params = useParams();
  const orderNumber = params.orderNumber as string;
  const { locale, t } = useLocale();

  const [tracking, setTracking] = useState<OrderTrackingResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [error, setError] = useState(false);
  const [warning, setWarning] = useState<string | null>(null);

  const fetchTracking = useCallback(async () => {
    setLoading(true);
    setNotFound(false);
    setError(false);
    setWarning(null);
    try {
      const res = await fetch(`/api/sap/orders/${encodeURIComponent(orderNumber)}/status`);
      if (res.status === 404) {
        setNotFound(true);
        return;
      }
      if (!res.ok) {
        setError(true);
        return;
      }
      const data = await res.json();
      setTracking(data.tracking);
      if (data.warning) setWarning(data.warning);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, [orderNumber]);

  useEffect(() => {
    fetchTracking();
  }, [fetchTracking]);

  const displayOrderNumber = orderNumber.replace(/^0+/, '') || orderNumber;

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-8" data-testid="order-tracking-page">
      {/* 브레드크럼 */}
      <nav className="mb-6 flex items-center gap-2 text-sm text-gray-500" aria-label="Breadcrumb">
        <Link href="/" className="hover:text-blue-600 transition-colors">
          {t('common.breadcrumb.products')}
        </Link>
        <span>/</span>
        <Link href="/orders/track" className="hover:text-blue-600 transition-colors">
          {t('tracking.title')}
        </Link>
        <span>/</span>
        <span className="font-mono text-gray-700">{displayOrderNumber}</span>
      </nav>

      <h1 className="text-2xl font-bold text-gray-900 mb-6">
        {t('tracking.title')} — <span className="font-mono text-blue-600">{displayOrderNumber}</span>
      </h1>

      {/* 로딩 */}
      {loading && (
        <div className="flex justify-center py-24">
          <LoadingSpinner />
        </div>
      )}

      {/* 주문 없음 */}
      {!loading && notFound && (
        <div className="rounded-lg bg-red-50 border border-red-200 p-6 text-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="mx-auto h-10 w-10 text-red-400 mb-3"
            aria-hidden="true"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
          </svg>
          <p className="text-red-800 font-medium">{t('tracking.notFound')}</p>
          <Link
            href="/orders/track"
            className="mt-4 inline-block text-sm text-blue-600 hover:underline"
          >
            {t('tracking.trackAnother')}
          </Link>
        </div>
      )}

      {/* 에러 */}
      {!loading && error && (
        <div className="rounded-lg bg-red-50 border border-red-200 p-6 text-center">
          <p className="text-red-800 font-medium">{t('tracking.error')}</p>
          <button
            onClick={fetchTracking}
            className="mt-4 inline-block text-sm text-blue-600 hover:underline"
          >
            {t('tracking.refresh')}
          </button>
        </div>
      )}

      {/* 결과 */}
      {!loading && tracking && (
        <div className="grid gap-6 lg:grid-cols-[1fr_2fr]">
          {/* SAP 연결 실패 / Mock 데이터 경고 배너 */}
          {(warning || tracking.dataSource === 'mock') && (
            <div className="col-span-full rounded-lg bg-amber-50 border border-amber-200 p-3 text-sm text-amber-800">
              {warning || t('tracking.dataSource.mock')}
            </div>
          )}
          {/* 왼쪽: 주문 정보 + Stepper */}
          <div className="space-y-6">
            {/* 주문 정보 카드 */}
            <div
              className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm"
              data-testid="order-info-card"
            >
              <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-500 mb-4">
                {t('tracking.orderInfo')}
              </h2>
              <dl className="space-y-2">
                <div className="flex justify-between text-sm">
                  <dt className="text-gray-500">{t('tracking.sapOrderNumber')}</dt>
                  <dd className="font-mono font-semibold text-blue-600">{tracking.salesOrder.replace(/^0+/, '')}</dd>
                </div>
                {tracking.customerPO && (
                  <div className="flex justify-between text-sm">
                    <dt className="text-gray-500">PO</dt>
                    <dd className="font-medium text-gray-900">{tracking.customerPO}</dd>
                  </div>
                )}
                <div className="flex justify-between text-sm">
                  <dt className="text-gray-500">{t('tracking.creationDate')}</dt>
                  <dd className="text-gray-900">{tracking.creationDate}</dd>
                </div>
                <div className="flex justify-between text-sm">
                  <dt className="text-gray-500">{t('tracking.soldToParty')}</dt>
                  <dd className="font-mono text-gray-900">{tracking.soldToParty}</dd>
                </div>
                {(() => {
                  const currentStep = tracking.steps.find(s => s.status === 'current');
                  if (!currentStep) return null;
                  return (
                    <div className="flex justify-between items-center text-sm pt-2 mt-2 border-t border-gray-100">
                      <dt className="text-gray-500">{t('tracking.currentStatus')}</dt>
                      <dd>
                        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${STEP_COLOR[currentStep.id]}`}>
                          {t(STEP_I18N_KEY[currentStep.id])}
                        </span>
                      </dd>
                    </div>
                  );
                })()}
              </dl>
            </div>

            {/* Stepper */}
            <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
              <OrderStatusStepper steps={tracking.steps} locale={locale} />
            </div>
          </div>

          {/* 오른쪽: 품목 + 문서 */}
          <div className="space-y-6">
            {/* 품목 테이블 */}
            <div>
              <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-500 mb-3">
                {t('tracking.orderItems')}
              </h2>
              <OrderItemsTable items={tracking.items} locale={locale} />
            </div>

            {/* 배송 문서 */}
            {tracking.deliveryDocuments && tracking.deliveryDocuments.length > 0 && (
              <div>
                <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-500 mb-3">
                  {t('tracking.deliveryDocs')}
                </h2>
                <div className="space-y-3">
                  {tracking.deliveryDocuments.map((doc) => (
                    <div
                      key={doc.deliveryDocument}
                      className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-sm font-semibold text-gray-900">
                          {doc.deliveryDocument}
                        </span>
                        <span
                          className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                            doc.goodsMovementStatus === 'C'
                              ? 'bg-green-100 text-green-700'
                              : doc.goodsMovementStatus === 'B'
                              ? 'bg-yellow-100 text-yellow-700'
                              : 'bg-gray-100 text-gray-600'
                          }`}
                        >
                          GI: {doc.goodsMovementStatus || '-'}
                        </span>
                      </div>
                      {doc.goodsMovementDate && (
                        <p className="mt-1 text-xs text-gray-500">
                          Goods Issue: {doc.goodsMovementDate}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 청구 문서 */}
            {tracking.billingDocuments && tracking.billingDocuments.length > 0 && (
              <div>
                <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-500 mb-3">
                  {t('tracking.billingDocs')}
                </h2>
                <div className="space-y-3">
                  {tracking.billingDocuments.map((doc) => (
                    <div
                      key={doc.billingDocument}
                      className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-sm font-semibold text-gray-900">
                          {doc.billingDocument}
                        </span>
                        <span className="text-sm font-semibold text-gray-900">
                          {doc.currency} {parseFloat(doc.totalAmount).toLocaleString()}
                        </span>
                      </div>
                      <p className="mt-1 text-xs text-gray-500">{doc.billingDate}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 하단 액션 */}
      {!loading && (
        <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-gray-100 pt-6">
          <div className="flex items-center gap-3">
            {tracking && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-gray-100 px-3 py-1 text-xs text-gray-500">
                <span className="h-1.5 w-1.5 rounded-full bg-gray-400" />
                {t(DATA_SOURCE_KEY[tracking.dataSource])}
              </span>
            )}
          </div>
          <div className="flex items-center gap-3">
            {tracking && (
              <button
                onClick={fetchTracking}
                className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                {t('tracking.refresh')}
              </button>
            )}
            <Link
              href="/orders/track"
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 transition-colors"
            >
              {t('tracking.trackAnother')}
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
