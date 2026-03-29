import { NextRequest, NextResponse } from 'next/server';
import { createSalesOrder, fetchStock } from '@/lib/sap-client';
import { SAP_CONFIG } from '@/lib/constants';
import { OrderRequest, OrderResult, SalesOrderCreatePayload } from '@/lib/sap-types';

export async function POST(request: NextRequest) {
  const useMock = process.env.USE_MOCK_DATA === 'true';
  console.log('[Orders] USE_MOCK_DATA:', process.env.USE_MOCK_DATA, '→ useMock:', useMock);

  let body: OrderRequest;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }

  if (!body.items || body.items.length === 0) {
    return NextResponse.json({ error: 'No items in order' }, { status: 400 });
  }

  if (useMock) {
    // Return a mock sales order number
    const mockOrderNumber = `00000${Math.floor(10000 + Math.random() * 90000)}`;
    const result: OrderResult = {
      salesOrderNumber: mockOrderNumber,
      createdAt: new Date().toISOString(),
      items: body.items.map((item) => ({
        material: item.productId,
        quantity: String(item.quantity),
        unit: item.unit,
      })),
    };
    return NextResponse.json({ order: result });
  }

  try {
    // Check stock availability before creating order
    try {
      const productIds = body.items.map((item) => item.productId);
      const stockMap = await fetchStock(productIds);
      const insufficientItems = body.items.filter((item) => {
        const available = stockMap[item.productId] ?? 0;
        return item.quantity > available;
      });
      if (insufficientItems.length > 0) {
        const details = insufficientItems.map((item) => {
          const available = Math.floor(stockMap[item.productId] ?? 0);
          return `${item.productId}: requested ${item.quantity}, available ${available}`;
        });
        return NextResponse.json(
          { error: `Insufficient stock: ${details.join('; ')}` },
          { status: 400 }
        );
      }
    } catch (stockError) {
      console.error('Stock check failed, proceeding with order:', stockError);
    }

    // Build SAP Sales Order payload with deep insert
    const now = new Date();
    const poReference = `WEBPORTAL-${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}-${String(now.getHours()).padStart(2, '0')}${String(now.getMinutes()).padStart(2, '0')}${String(now.getSeconds()).padStart(2, '0')}`;

    // Helper: YYYY-MM-DD string → OData V2 /Date(ms)/ format (UTC midnight)
    const toODataDate = (dateStr: string) => {
      const [y, m, d] = dateStr.split('-').map(Number);
      return `/Date(${Date.UTC(y, m - 1, d)})/`;
    };
    const requestedDeliveryDate = toODataDate(SAP_CONFIG.requestedDeliveryDate);
    const pricingDate = toODataDate(SAP_CONFIG.pricingDate);

    const payload: SalesOrderCreatePayload = {
      SalesOrderType: SAP_CONFIG.defaultOrderType,
      SalesOrganization: SAP_CONFIG.salesOrg,
      DistributionChannel: SAP_CONFIG.distributionChannel,
      OrganizationDivision: SAP_CONFIG.division,
      SoldToParty: body.soldToParty || SAP_CONFIG.defaultSoldToParty,
      PurchaseOrderByCustomer: poReference,
      RequestedDeliveryDate: requestedDeliveryDate,
      PricingDate: pricingDate,
      to_Item: {
        results: body.items.map((item, index) => ({
          SalesOrderItem: String((index + 1) * 10),
          Material: item.productId,
          RequestedQuantity: String(item.quantity),
          RequestedQuantityUnit: item.unit || 'EA',
          Plant: '1710',
          to_ScheduleLine: {
            results: [{
              ScheduleLine: '1',
              RequestedDeliveryDate: requestedDeliveryDate,
              ScheduleLineOrderQuantity: String(item.quantity),
              OrderQuantityUnit: item.unit || 'EA',
            }],
          },
        })),
      },
    };

    const sapOrder = await createSalesOrder(payload);

    const result: OrderResult = {
      salesOrderNumber: sapOrder.SalesOrder,
      createdAt: sapOrder.CreationDate || new Date().toISOString(),
      items: body.items.map((item) => ({
        material: item.productId,
        quantity: String(item.quantity),
        unit: item.unit || 'EA',
      })),
    };

    return NextResponse.json({ order: result });
  } catch (error) {
    console.error('Failed to create Sales Order in SAP:', error);
    return NextResponse.json(
      { error: 'Failed to create order. Please try again.' },
      { status: 500 }
    );
  }
}
