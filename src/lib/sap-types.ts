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
  Plant?: string;
  to_ScheduleLine?: {
    results: SalesOrderScheduleLinePayload[];
  };
}

export interface SalesOrderScheduleLinePayload {
  ScheduleLine: string;
  RequestedDeliveryDate: string;
  ScheduleLineOrderQuantity: string;
  OrderQuantityUnit: string;
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
