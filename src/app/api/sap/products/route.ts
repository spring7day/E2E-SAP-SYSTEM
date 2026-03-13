import { NextRequest, NextResponse } from 'next/server';
import { fetchProducts, fetchStock } from '@/lib/sap-client';
import { MOCK_PRODUCTS } from '@/lib/mock-data';
import {
  PRODUCT_PRICES,
  PRODUCT_DISPLAY_NAMES,
  PRODUCT_DISPLAY_NAMES_KO,
  PRODUCT_DESCRIPTIONS,
  PRODUCT_DESCRIPTIONS_KO,
  PRODUCT_CATEGORIES,
  PRODUCT_CATEGORIES_KO,
  DEFAULT_PRICE,
  DEFAULT_IMAGE,
} from '@/lib/constants';
import { PortalProduct } from '@/lib/sap-types';
import { Locale } from '@/lib/i18n';

function localizeProducts(products: PortalProduct[], locale: Locale): PortalProduct[] {
  if (locale !== 'ko') return products;
  return products.map((p) => ({
    ...p,
    name: PRODUCT_DISPLAY_NAMES_KO[p.id] || p.name,
    description: PRODUCT_DESCRIPTIONS_KO[p.id] || p.description,
    category: PRODUCT_CATEGORIES_KO[p.category] || p.category,
  }));
}

async function enrichWithStock(products: PortalProduct[]): Promise<void> {
  try {
    const productIds = products.map((p) => p.id);
    const stockMap = await fetchStock(productIds);
    for (const product of products) {
      product.stockQuantity = stockMap[product.id] ?? 0;
    }
  } catch (stockError) {
    console.error('Failed to fetch stock data:', stockError);
  }
}

export async function GET(request: NextRequest) {
  const locale = (request.nextUrl.searchParams.get('locale') || 'en') as Locale;
  const useMock = process.env.USE_MOCK_DATA === 'true';

  if (useMock) {
    const products = [...MOCK_PRODUCTS];
    await enrichWithStock(products);
    return NextResponse.json({ products: localizeProducts(products, locale) });
  }

  try {
    const sapProducts = await fetchProducts();

    const products: PortalProduct[] = sapProducts.map((p) => {
      const sapDescription =
        p.to_Description?.results?.find((d) => d.Language === 'EN')
          ?.ProductDescription || p.Product;

      const priceInfo = PRODUCT_PRICES[p.Product] || DEFAULT_PRICE;

      return {
        id: p.Product,
        name: PRODUCT_DISPLAY_NAMES[p.Product] || sapDescription,
        description: PRODUCT_DESCRIPTIONS[p.Product] || sapDescription,
        price: priceInfo.price,
        currency: priceInfo.currency,
        unit: p.BaseUnit || 'PC',
        category: PRODUCT_CATEGORIES[p.Product] || p.ProductGroup || 'General',
        image: DEFAULT_IMAGE,
      };
    });

    await enrichWithStock(products);

    return NextResponse.json({ products: localizeProducts(products, locale) });
  } catch (error) {
    console.error('Failed to fetch products from SAP:', error);
    const products = [...MOCK_PRODUCTS];
    await enrichWithStock(products);
    return NextResponse.json(
      { products: localizeProducts(products, locale), source: 'mock' },
      { status: 200 }
    );
  }
}
