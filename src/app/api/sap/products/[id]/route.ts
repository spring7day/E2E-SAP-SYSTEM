import { NextRequest, NextResponse } from 'next/server';
import { fetchProduct, fetchStock } from '@/lib/sap-client';
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

function localizeProduct(product: PortalProduct, locale: Locale): PortalProduct {
  if (locale !== 'ko') return product;
  return {
    ...product,
    name: PRODUCT_DISPLAY_NAMES_KO[product.id] || product.name,
    description: PRODUCT_DESCRIPTIONS_KO[product.id] || product.description,
    category: PRODUCT_CATEGORIES_KO[product.category] || product.category,
  };
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const locale = (request.nextUrl.searchParams.get('locale') || 'en') as Locale;
  const useMock = process.env.USE_MOCK_DATA === 'true';

  if (useMock) {
    const found = MOCK_PRODUCTS.find((p) => p.id === id);
    if (!found) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }
    const product = { ...found };
    try {
      const stockMap = await fetchStock([product.id]);
      product.stockQuantity = stockMap[product.id] ?? 0;
    } catch { /* stock fetch optional */ }
    return NextResponse.json({ product: localizeProduct(product, locale) });
  }

  try {
    const sapProduct = await fetchProduct(id);
    if (!sapProduct) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    const sapDescription =
      sapProduct.to_Description?.results?.find((d) => d.Language === 'EN')
        ?.ProductDescription || sapProduct.Product;

    const priceInfo = PRODUCT_PRICES[sapProduct.Product] || DEFAULT_PRICE;

    const product: PortalProduct = {
      id: sapProduct.Product,
      name: PRODUCT_DISPLAY_NAMES[sapProduct.Product] || sapDescription,
      description: PRODUCT_DESCRIPTIONS[sapProduct.Product] || sapDescription,
      price: priceInfo.price,
      currency: priceInfo.currency,
      unit: sapProduct.BaseUnit || 'PC',
      category: PRODUCT_CATEGORIES[sapProduct.Product] || sapProduct.ProductGroup || 'General',
      image: DEFAULT_IMAGE,
    };

    // Fetch stock data for this product
    try {
      const stockMap = await fetchStock([product.id]);
      product.stockQuantity = stockMap[product.id] ?? 0;
    } catch (stockError) {
      console.error('Failed to fetch stock data:', stockError);
    }

    return NextResponse.json({ product: localizeProduct(product, locale) });
  } catch (error) {
    console.error('Failed to fetch product from SAP:', error);
    const fallback = MOCK_PRODUCTS.find((p) => p.id === id);
    if (fallback) {
      const product = { ...fallback };
      try {
        const stockMap = await fetchStock([product.id]);
        product.stockQuantity = stockMap[product.id] ?? 0;
      } catch { /* stock fetch optional */ }
      return NextResponse.json({ product: localizeProduct(product, locale), source: 'mock' });
    }
    return NextResponse.json({ error: 'Product not found' }, { status: 404 });
  }
}
