import { NextRequest, NextResponse } from 'next/server';
import {
  fetchSalesOrderStatus,
  fetchOutboundDeliveries,
  fetchBillingDocuments,
} from '@/lib/sap-client';
import { getMockOrderTracking } from '@/lib/mock-data';
import {
  SAPSalesOrderWithStatus,
  SAPOutboundDelivery,
  SAPBillingDocument,
  OrderTrackingResponse,
  OrderTrackingStep,
  OrderProcessStep,
} from '@/lib/sap-types';

function parseODataDate(dateStr: string | undefined): string | undefined {
  if (!dateStr) return undefined;
  const match = dateStr.match(/\/Date\((\d+)\)\//);
  return match ? new Date(parseInt(match[1])).toISOString().split('T')[0] : undefined;
}

function deriveStepsFromSalesOrder(
  overallSDProcessStatus: string,
  totalDeliveryStatus: string,
  overallBillingStatus: string
): OrderTrackingStep[] {
  const allSteps: OrderProcessStep[] = ['ORDER_CREATED', 'DELIVERY_CREATED', 'GOODS_ISSUED', 'DELIVERY_CONFIRMED', 'BILLED'];

  let currentStep: OrderProcessStep;
  if (overallBillingStatus === 'C') {
    currentStep = 'BILLED';
  } else if (overallBillingStatus === 'B') {
    currentStep = 'BILLED';
  } else if (totalDeliveryStatus === 'C') {
    currentStep = 'DELIVERY_CONFIRMED';
  } else if (totalDeliveryStatus === 'B') {
    currentStep = 'GOODS_ISSUED';
  } else if (overallSDProcessStatus === 'B' && totalDeliveryStatus === 'A') {
    currentStep = 'DELIVERY_CREATED';
  } else {
    currentStep = 'ORDER_CREATED';
  }

  const currentIdx = allSteps.indexOf(currentStep);
  return allSteps.map((stepId, idx) => {
    const step: OrderTrackingStep = { id: stepId, status: 'pending' };
    if (idx < currentIdx) step.status = 'completed';
    else if (idx === currentIdx) step.status = 'current';
    return step;
  });
}

function deriveStepsFromDocuments(
  salesOrder: SAPSalesOrderWithStatus,
  deliveries: SAPOutboundDelivery[],
  billings: SAPBillingDocument[]
): OrderTrackingStep[] {
  const allSteps: OrderProcessStep[] = ['ORDER_CREATED', 'DELIVERY_CREATED', 'GOODS_ISSUED', 'DELIVERY_CONFIRMED', 'BILLED'];

  const hasBilling = billings.length > 0;
  const hasDelivery = deliveries.length > 0;
  const hasGoodsIssue = deliveries.some(
    (d) => d.OverallGoodsMovementStatus === 'C' || !!d.ActualGoodsMovementDate
  );
  const hasDeliveryConfirmed = salesOrder.TotalDeliveryStatus === 'C';

  let currentStep: OrderProcessStep;
  if (hasBilling) currentStep = 'BILLED';
  else if (hasDeliveryConfirmed) currentStep = 'DELIVERY_CONFIRMED';
  else if (hasGoodsIssue) currentStep = 'GOODS_ISSUED';
  else if (hasDelivery) currentStep = 'DELIVERY_CREATED';
  else currentStep = 'ORDER_CREATED';

  const currentIdx = allSteps.indexOf(currentStep);

  return allSteps.map((stepId, idx) => {
    const step: OrderTrackingStep = { id: stepId, status: 'pending' };
    if (idx < currentIdx) step.status = 'completed';
    else if (idx === currentIdx) step.status = 'current';

    // 문서번호/날짜 추가
    if (stepId === 'ORDER_CREATED' && step.status !== 'pending') {
      step.date = parseODataDate(salesOrder.CreationDate);
    }
    if ((stepId === 'DELIVERY_CREATED' || stepId === 'GOODS_ISSUED' || stepId === 'DELIVERY_CONFIRMED') && step.status !== 'pending') {
      const delivery = deliveries[0];
      if (delivery) {
        step.documentNumber = delivery.DeliveryDocument;
        if (stepId === 'GOODS_ISSUED' && delivery.ActualGoodsMovementDate) {
          step.date = parseODataDate(delivery.ActualGoodsMovementDate);
        }
      }
    }
    if (stepId === 'BILLED' && step.status !== 'pending') {
      const billing = billings[0];
      if (billing) {
        step.documentNumber = billing.BillingDocument;
        step.date = parseODataDate(billing.BillingDocumentDate);
      }
    }

    return step;
  });
}

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ orderNumber: string }> }
) {
  const { orderNumber } = await params;
  const paddedOrderNumber = orderNumber.padStart(10, '0');

  if (process.env.USE_MOCK_DATA === 'true') {
    return NextResponse.json({ tracking: getMockOrderTracking(paddedOrderNumber) });
  }

  try {
    const salesOrder = await fetchSalesOrderStatus(paddedOrderNumber);

    if (!salesOrder) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    let deliveries: SAPOutboundDelivery[] = [];
    try {
      deliveries = await fetchOutboundDeliveries(paddedOrderNumber);
    } catch (e) {
      console.warn('[Tracking] Delivery API unavailable:', e instanceof Error ? e.message : e);
    }

    let billings: SAPBillingDocument[] = [];
    try {
      billings = await fetchBillingDocuments(paddedOrderNumber);
    } catch (e) {
      console.warn('[Tracking] Billing API unavailable:', e instanceof Error ? e.message : e);
    }

    const dataSource = (deliveries.length > 0 || billings.length > 0) ? 'full' : 'sales-order-only';
    const steps =
      dataSource === 'full'
        ? deriveStepsFromDocuments(salesOrder, deliveries, billings)
        : deriveStepsFromSalesOrder(
            salesOrder.OverallSDProcessStatus,
            salesOrder.TotalDeliveryStatus,
            salesOrder.OverallBillingStatus
          );

    const tracking: OrderTrackingResponse = {
      salesOrder: salesOrder.SalesOrder,
      customerPO: salesOrder.PurchaseOrderByCustomer || '',
      creationDate: parseODataDate(salesOrder.CreationDate) || salesOrder.CreationDate,
      soldToParty: salesOrder.SoldToParty,
      overallStatus: salesOrder.OverallSDProcessStatus,
      steps,
      items: (salesOrder.to_Item?.results || []).map((item) => ({
        itemNumber: item.SalesOrderItem,
        material: item.Material,
        quantity: item.RequestedQuantity,
        unit: item.RequestedQuantityUnit,
      })),
      ...(deliveries.length > 0 && {
        deliveryDocuments: deliveries.map((d) => ({
          deliveryDocument: d.DeliveryDocument,
          goodsMovementDate: parseODataDate(d.ActualGoodsMovementDate),
          goodsMovementStatus: d.OverallGoodsMovementStatus,
          pickingStatus: d.OverallPickingStatus,
        })),
      }),
      ...(billings.length > 0 && {
        billingDocuments: billings.map((b) => ({
          billingDocument: b.BillingDocument,
          billingDate: parseODataDate(b.BillingDocumentDate) || b.BillingDocumentDate,
          currency: b.TransactionCurrency,
          totalAmount: b.TotalNetAmount,
        })),
      }),
      dataSource,
    };

    return NextResponse.json({ tracking });
  } catch (error) {
    console.error('[Tracking] SAP error, falling back to mock:', error);
    return NextResponse.json({ tracking: getMockOrderTracking(paddedOrderNumber) });
  }
}
