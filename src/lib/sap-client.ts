import { SAPProduct, SAPSalesOrder, SAPSalesOrderWithStatus, SAPOutboundDelivery, SAPBillingDocument, SAPStockResult, SalesOrderCreatePayload } from './sap-types';

const SAP_BASE_URL = process.env.SAP_BASE_URL || '';
const SAP_CLIENT = process.env.SAP_CLIENT || '100';
const SAP_LANGUAGE = process.env.SAP_LANGUAGE || 'EN';
const SAP_USER = process.env.SAP_USER || '';
const SAP_PASSWORD = process.env.SAP_PASSWORD || '';

function getBasicAuthHeader(): string {
  return 'Basic ' + Buffer.from(`${SAP_USER}:${SAP_PASSWORD}`).toString('base64');
}

function getDefaultHeaders(): Record<string, string> {
  return {
    'Authorization': getBasicAuthHeader(),
    'sap-client': SAP_CLIENT,
    'sap-language': SAP_LANGUAGE,
    'Accept': 'application/json',
  };
}

interface ODataResponse<T> {
  d: {
    results?: T[];
    [key: string]: unknown;
  };
}

/**
 * Fetch a list of products from SAP Material Master
 */
export async function fetchProducts(): Promise<SAPProduct[]> {
  const path = `/sap/opu/odata/sap/API_PRODUCT_SRV/A_Product`;
  const params = new URLSearchParams({
    $filter: "ProductType eq 'FERT'",
    $top: '50',
    $expand: 'to_Description',
    $select: 'Product,ProductType,BaseUnit,ProductGroup',
    $format: 'json',
  });

  const url = `${SAP_BASE_URL}${path}?${params}`;
  const response = await fetch(url, {
    headers: getDefaultHeaders(),
    cache: 'no-store',
  });

  if (!response.ok) {
    throw new Error(`SAP API error: ${response.status} ${response.statusText}`);
  }

  const data: ODataResponse<SAPProduct> = await response.json();
  return data.d.results || [];
}

/**
 * Fetch a single product by ID
 */
export async function fetchProduct(productId: string): Promise<SAPProduct | null> {
  const path = `/sap/opu/odata/sap/API_PRODUCT_SRV/A_Product('${encodeURIComponent(productId)}')`;
  const params = new URLSearchParams({
    $expand: 'to_Description',
    $format: 'json',
  });

  const url = `${SAP_BASE_URL}${path}?${params}`;
  const response = await fetch(url, {
    headers: getDefaultHeaders(),
    cache: 'no-store',
  });

  if (!response.ok) {
    if (response.status === 404) return null;
    throw new Error(`SAP API error: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();
  return data.d as SAPProduct;
}

/**
 * Fetch CSRF token required for POST/PUT/DELETE operations
 * Returns the token and cookies that must be forwarded with the write request
 */
async function fetchCsrfToken(): Promise<{ token: string; cookies: string }> {
  const path = `/sap/opu/odata/sap/API_SALES_ORDER_SRV/`;
  const url = `${SAP_BASE_URL}${path}`;

  const response = await fetch(url, {
    headers: {
      ...getDefaultHeaders(),
      'x-csrf-token': 'Fetch',
    },
    cache: 'no-store',
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch CSRF token: ${response.status} ${response.statusText}`);
  }

  const token = response.headers.get('x-csrf-token');
  if (!token) {
    throw new Error('No CSRF token returned from SAP');
  }

  // Collect cookies from the response
  // Try getSetCookie() first (Node 19.7+), fall back to raw header parsing
  let cookies = '';
  if (typeof response.headers.getSetCookie === 'function') {
    const setCookieHeaders = response.headers.getSetCookie();
    cookies = setCookieHeaders
      .map((cookie: string) => cookie.split(';')[0])
      .join('; ');
  }

  // Fallback: parse 'set-cookie' header directly
  if (!cookies) {
    const rawSetCookie = response.headers.get('set-cookie');
    if (rawSetCookie) {
      cookies = rawSetCookie
        .split(/,(?=\s*[a-zA-Z_-]+=)/)
        .map((cookie: string) => cookie.trim().split(';')[0])
        .join('; ');
    }
  }

  console.log('[SAP] CSRF token fetched, cookies present:', !!cookies, 'cookie length:', cookies.length);

  return { token, cookies };
}

/**
 * Create a Sales Order in SAP via deep insert
 */
export async function createSalesOrder(
  payload: SalesOrderCreatePayload
): Promise<SAPSalesOrder> {
  // Step 1: Fetch CSRF token
  const { token, cookies } = await fetchCsrfToken();

  // Step 2: POST the Sales Order
  const path = `/sap/opu/odata/sap/API_SALES_ORDER_SRV/A_SalesOrder`;
  const url = `${SAP_BASE_URL}${path}`;

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      ...getDefaultHeaders(),
      'Content-Type': 'application/json',
      'x-csrf-token': token,
      ...(cookies ? { 'Cookie': cookies } : {}),
    },
    body: JSON.stringify(payload),
    cache: 'no-store',
  });

  if (!response.ok) {
    const errorBody = await response.text();
    console.error('[SAP] Sales Order creation failed:', response.status, response.statusText);
    console.error('[SAP] Error body:', errorBody.substring(0, 500));
    throw new Error(
      `Failed to create Sales Order: ${response.status} ${response.statusText}\n${errorBody}`
    );
  }

  const data = await response.json();
  console.log('[SAP] Sales Order created successfully:', data.d?.SalesOrder);
  return data.d as SAPSalesOrder;
}

/**
 * Fetch stock quantities from SAP CDS View C_STOCKQTYCURRENTVALUE_3
 * Returns stock data for specified products in the given plant
 */
export async function fetchStock(
  productIds: string[],
  plant: string = '1710'
): Promise<Record<string, number>> {
  const filterParts = productIds.map((id) => `Product eq '${id}'`);
  const productFilter = filterParts.join(' or ');
  const filter = `(${productFilter}) and Plant eq '${plant}'`;

  const path = `/sap/opu/odata/sap/C_STOCKQTYCURRENTVALUE_3_CDS/C_STOCKQTYCURRENTVALUE_3(P_DisplayCurrency='USD')/Results`;
  const params = new URLSearchParams({
    $filter: filter,
    $select: 'Product,Plant,MatlWrhsStkQtyInMatlBaseUnit,MaterialBaseUnit',
    $format: 'json',
  });

  const url = `${SAP_BASE_URL}${path}?${params}`;
  const response = await fetch(url, {
    headers: getDefaultHeaders(),
    cache: 'no-store',
  });

  if (!response.ok) {
    throw new Error(`SAP Stock API error: ${response.status} ${response.statusText}`);
  }

  const data: ODataResponse<SAPStockResult> = await response.json();
  const results = data.d.results || [];

  const stockMap: Record<string, number> = {};
  for (const item of results) {
    stockMap[item.Product] = parseFloat(item.MatlWrhsStkQtyInMatlBaseUnit) || 0;
  }

  return stockMap;
}

/**
 * Fetch a Sales Order with status fields for order tracking
 */
export async function fetchSalesOrderStatus(orderNumber: string): Promise<SAPSalesOrderWithStatus | null> {
  const path = `/sap/opu/odata/sap/API_SALES_ORDER_SRV/A_SalesOrder('${encodeURIComponent(orderNumber)}')`;
  const params = new URLSearchParams({
    $expand: 'to_Item/to_SubsequentProcFlowDocItem',
    $format: 'json',
  });

  const url = `${SAP_BASE_URL}${path}?${params}`;
  console.log('[Tracking] Fetching Sales Order:', url);
  const response = await fetch(url, {
    headers: getDefaultHeaders(),
    cache: 'no-store',
  });

  if (!response.ok) {
    if (response.status === 404) return null;
    const errorBody = await response.text();
    console.error('[Tracking] SAP Sales Order API error:', response.status, errorBody.substring(0, 500));
    throw new Error(`SAP API error: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();
  const d = data.d;
  return {
    ...d,
    OverallSDProcessStatus: d.OverallSDProcessStatus || '',
    OverallDeliveryStatus: d.OverallDeliveryStatus || '',
    OverallOrdReltdBillgStatus: d.OverallOrdReltdBillgStatus || '',
  } as SAPSalesOrderWithStatus;
}

/**
 * Fetch Outbound Delivery documents for a given Sales Order
 */
export async function fetchOutboundDeliveries(orderNumber: string): Promise<SAPOutboundDelivery[]> {
  const path = `/sap/opu/odata/sap/API_OUTBOUND_DELIVERY_SRV;v=0002/A_OutboundDeliveryHeader`;
  const params = new URLSearchParams({
    $filter: `ReferenceSDDocument eq '${orderNumber}'`,
    $select: 'DeliveryDocument,ReferenceSDDocument,ActualGoodsMovementDate,OverallGoodsMovementStatus,OverallPickingStatus,OverallSDProcessStatus',
    $format: 'json',
  });

  const url = `${SAP_BASE_URL}${path}?${params}`;
  const response = await fetch(url, {
    headers: getDefaultHeaders(),
    cache: 'no-store',
  });

  if (!response.ok) {
    throw new Error(`SAP Delivery API error: ${response.status} ${response.statusText}`);
  }

  const data: ODataResponse<SAPOutboundDelivery> = await response.json();
  return data.d.results || [];
}

/**
 * Fetch Billing Documents for a given Sales Order
 */
export async function fetchBillingDocuments(orderNumber: string): Promise<SAPBillingDocument[]> {
  const path = `/sap/opu/odata/sap/API_BILLING_DOCUMENT_SRV/A_BillingDocument`;
  const params = new URLSearchParams({
    $filter: `SalesDocument eq '${orderNumber}'`,
    $select: 'BillingDocument,SalesDocument,BillingDocumentDate,TransactionCurrency,TotalNetAmount',
    $format: 'json',
  });

  const url = `${SAP_BASE_URL}${path}?${params}`;
  const response = await fetch(url, {
    headers: getDefaultHeaders(),
    cache: 'no-store',
  });

  if (!response.ok) {
    throw new Error(`SAP Billing API error: ${response.status} ${response.statusText}`);
  }

  const data: ODataResponse<SAPBillingDocument> = await response.json();
  return data.d.results || [];
}
