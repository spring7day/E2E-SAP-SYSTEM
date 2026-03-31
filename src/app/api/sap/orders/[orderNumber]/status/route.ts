import { NextRequest, NextResponse } from 'next/server';
import { fetchSalesOrderStatus } from '@/lib/sap-client';
import { getMockOrderTracking } from '@/lib/mock-data';
import {
  SAPSalesOrderWithStatus,
  SAPSubsequentProcFlowDoc,
  OrderTrackingResponse,
  OrderTrackingStep,
  OrderProcessStep,
} from '@/lib/sap-types';

function parseODataDate(dateStr: string | undefined): string | undefined {
  if (!dateStr) return undefined;
  const match = dateStr.match(/\/Date\((\d+)\)\//);
  return match ? new Date(parseInt(match[1])).toISOString().split('T')[0] : undefined;
}

function deriveStepsFromDocumentFlow(
  salesOrder: SAPSalesOrderWithStatus
): OrderTrackingStep[] {
  const allSteps: OrderProcessStep[] = [
    'ORDER_CREATED',
    'DELIVERY_CREATED',
    'GOODS_ISSUED',
    'DELIVERY_CONFIRMED',
    'BILLED',
  ];

  // 모든 아이템의 후속 문서 흐름 수집
  const items = salesOrder.to_Item?.results || [];
  const allFlowDocs: SAPSubsequentProcFlowDoc[] = items.flatMap(
    (item) => item.to_SubsequentProcFlowDocItem?.results || []
  );

  // SAP Document Category:
  // J = Delivery (VL01N)
  // R = Goods Movement / Material Document (VL02N Post GI)
  // M = Billing Document (VF01)
  const hasDelivery = allFlowDocs.some((d) => d.SubsequentDocumentCategory === 'J');
  const hasGoodsIssue = allFlowDocs.some((d) => d.SubsequentDocumentCategory === 'R');
  const hasBilling = allFlowDocs.some((d) => d.SubsequentDocumentCategory === 'M');

  // DELIVERY_CONFIRMED(VLPOD)는 문서 흐름에서 직접 판별 불가
  // GI 완료 + 납품 완료(OverallDeliveryStatus=C) 조건으로 간주
  const hasDeliveryConfirmed = hasGoodsIssue && salesOrder.OverallDeliveryStatus === 'C';

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

    if (stepId === 'ORDER_CREATED' && step.status !== 'pending') {
      step.date = parseODataDate(salesOrder.CreationDate);
    }
    if (stepId === 'DELIVERY_CREATED' && step.status !== 'pending') {
      const doc = allFlowDocs.find((d) => d.SubsequentDocumentCategory === 'J');
      if (doc) {
        step.documentNumber = doc.SubsequentDocument;
        step.date = parseODataDate(doc.CreationDate);
      }
    }
    if ((stepId === 'GOODS_ISSUED' || stepId === 'DELIVERY_CONFIRMED') && step.status !== 'pending') {
      const doc = allFlowDocs.find((d) => d.SubsequentDocumentCategory === 'R');
      if (doc) {
        step.documentNumber = doc.SubsequentDocument;
        step.date = parseODataDate(doc.CreationDate);
      }
    }
    if (stepId === 'BILLED' && step.status !== 'pending') {
      const doc = allFlowDocs.find((d) => d.SubsequentDocumentCategory === 'M');
      if (doc) {
        step.documentNumber = doc.SubsequentDocument;
        step.date = parseODataDate(doc.CreationDate);
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

    const items = salesOrder.to_Item?.results || [];
    const allFlowDocs: SAPSubsequentProcFlowDoc[] = items.flatMap(
      (item) => item.to_SubsequentProcFlowDocItem?.results || []
    );

    const steps = deriveStepsFromDocumentFlow(salesOrder);

    const deliveryDocs = allFlowDocs.filter((d) => d.SubsequentDocumentCategory === 'J');
    const billingDocs = allFlowDocs.filter((d) => d.SubsequentDocumentCategory === 'M');

    console.log('[Tracking] Document flow:', {
      SalesOrder: salesOrder.SalesOrder,
      flowDocCategories: allFlowDocs.map((d) => `${d.SubsequentDocumentCategory}:${d.SubsequentDocument}`),
      currentStep: steps.find((s) => s.status === 'current')?.id,
    });

    const tracking: OrderTrackingResponse = {
      salesOrder: salesOrder.SalesOrder,
      customerPO: salesOrder.PurchaseOrderByCustomer || '',
      creationDate: parseODataDate(salesOrder.CreationDate) || salesOrder.CreationDate,
      soldToParty: salesOrder.SoldToParty,
      overallStatus: salesOrder.OverallSDProcessStatus,
      steps,
      items: items.map((item) => ({
        itemNumber: item.SalesOrderItem,
        material: item.Material,
        quantity: item.RequestedQuantity,
        unit: item.RequestedQuantityUnit,
      })),
      ...(deliveryDocs.length > 0 && {
        deliveryDocuments: deliveryDocs.map((d) => ({
          deliveryDocument: d.SubsequentDocument,
          goodsMovementDate: parseODataDate(d.CreationDate),
          goodsMovementStatus: d.SDProcessStatus,
          pickingStatus: '',
        })),
      }),
      ...(billingDocs.length > 0 && {
        billingDocuments: billingDocs.map((d) => ({
          billingDocument: d.SubsequentDocument,
          billingDate: parseODataDate(d.CreationDate) || '',
          currency: '',
          totalAmount: '',
        })),
      }),
      dataSource: 'full',
    };

    return NextResponse.json({ tracking });
  } catch (error) {
    console.error('[Tracking] SAP error, falling back to mock:', error);
    return NextResponse.json({
      tracking: getMockOrderTracking(paddedOrderNumber),
      warning: 'SAP connection failed. Showing demo data.',
    });
  }
}
