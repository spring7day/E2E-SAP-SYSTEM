// SAP OData entity types

export interface SAPProduct {
  Product: string;
  ProductType: string;
  BaseUnit: string;
  ProductGroup: string;
  to_Description?: {
    results: SAPProductDescription[];
  };
}

export interface SAPProductDescription {
  Product: string;
  Language: string;
  ProductDescription: string;
}

export interface SAPBusinessPartner {
  BusinessPartner: string;
  BusinessPartnerFullName: string;
  BusinessPartnerCategory: string;
}

export interface SAPSalesOrder {
  SalesOrder: string;
  SalesOrderType: string;
  SalesOrganization: string;
  DistributionChannel: string;
  OrganizationDivision: string;
  SoldToParty: string;
  PurchaseOrderByCustomer: string;
  CreationDate: string;
  to_Item?: {
    results: SAPSalesOrderItem[];
  };
}

export interface SAPSalesOrderItem {
  SalesOrderItem: string;
  Material: string;
  RequestedQuantity: string;
  RequestedQuantityUnit: string;
}

export interface SalesOrderCreatePayload {
  SalesOrderType: string;
  SalesOrganization: string;
  DistributionChannel: string;
  OrganizationDivision: string;
  SoldToParty: string;
  PurchaseOrderByCustomer: string;
  RequestedDeliveryDate: string;
  PricingDate?: string;
  to_Item: {
    results: SalesOrderItemPayload[];
  };
}

export interface SalesOrderItemPayload {
  SalesOrderItem: string;
  Material: string;
  RequestedQuantity: string;
  RequestedQuantityUnit: string;
}

// Sales Order with status fields (for order tracking)
export interface SAPSalesOrderWithStatus extends SAPSalesOrder {
  OverallSDProcessStatus: string;  // A=미처리, B=부분처리, C=완료
  TotalDeliveryStatus: string;     // ''=해당없음, A=미처리, B=부분배송, C=완배송
  OverallBillingStatus: string;    // ''=해당없음, A=미청구, B=부분청구, C=완청구
}

export interface SAPOutboundDelivery {
  DeliveryDocument: string;
  ReferenceSDDocument: string;
  ActualGoodsMovementDate: string;
  OverallGoodsMovementStatus: string;
  OverallPickingStatus: string;
  OverallSDProcessStatus: string;
}

export interface SAPBillingDocument {
  BillingDocument: string;
  SalesDocument: string;
  BillingDocumentDate: string;
  TransactionCurrency: string;
  TotalNetAmount: string;
}

export type OrderProcessStep = 'ORDER_CREATED' | 'DELIVERY_CREATED' | 'GOODS_ISSUED' | 'DELIVERY_CONFIRMED' | 'BILLED';

export interface OrderTrackingStep {
  id: OrderProcessStep;
  status: 'completed' | 'current' | 'pending';
  date?: string;
  documentNumber?: string;
}

export interface OrderTrackingResponse {
  salesOrder: string;
  customerPO: string;
  creationDate: string;
  soldToParty: string;
  overallStatus: string;
  steps: OrderTrackingStep[];
  items: Array<{
    itemNumber: string;
    material: string;
    quantity: string;
    unit: string;
  }>;
  deliveryDocuments?: Array<{
    deliveryDocument: string;
    goodsMovementDate?: string;
    goodsMovementStatus: string;
    pickingStatus: string;
  }>;
  billingDocuments?: Array<{
    billingDocument: string;
    billingDate: string;
    currency: string;
    totalAmount: string;
  }>;
  dataSource: 'full' | 'sales-order-only' | 'mock';
}

// Portal-side types

export interface SAPStockResult {
  Product: string;
  Plant: string;
  MatlWrhsStkQtyInMatlBaseUnit: string;
  MaterialBaseUnit: string;
}

export interface PortalProduct {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  unit: string;
  category: string;
  image: string;
  stockQuantity?: number;
}

export interface CartItem {
  productId: string;
  productName: string;
  quantity: number;
  unit: string;
  price: number;
  currency: string;
  image: string;
}

export interface OrderRequest {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  soldToParty: string;
  items: {
    productId: string;
    quantity: number;
    unit: string;
  }[];
}

export interface OrderResult {
  salesOrderNumber: string;
  createdAt: string;
  items: {
    material: string;
    quantity: string;
    unit: string;
  }[];
}
