import { NextResponse } from 'next/server';
import { getAvailableCountries } from '@/lib/shopify-storefront';

export async function GET() {
  try {
    const countries = await getAvailableCountries();
    return NextResponse.json({ countries });
  } catch (error) {
    console.error('Failed to load Shopify available countries:', error);
    return NextResponse.json({ error: 'Failed to load Shopify available countries' }, { status: 500 });
  }
}
