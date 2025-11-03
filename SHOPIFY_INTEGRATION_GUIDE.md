# Shopify Integration Guide for Lowther Loudspeakers

This guide walks you through integrating your Shopify store with the Lowther Loudspeakers website to sell Drive Units (excluding Grand Opera), PX4 Amplifier, Reference Cables, and Lowther Badges.

## Table of Contents
1. [Overview](#overview)
2. [Prerequisites](#prerequisites)
3. [Phase 1: Setup Shopify Store](#phase-1-setup-shopify-store)
4. [Phase 2: Configure Shopify Storefront API](#phase-2-configure-shopify-storefront-api)
5. [Phase 3: Multi-Currency Setup](#phase-3-multi-currency-setup)
6. [Phase 4: Create Products in Shopify](#phase-4-create-products-in-shopify)
7. [Phase 5: Implement on Website](#phase-5-implement-on-website)
8. [Phase 6: Testing](#phase-6-testing)

---

## Overview

The integration will:
- **Use Shopify Storefront API** for product data and cart functionality
- **Support multi-currency** pricing (GBP, USD, EUR, JPY, AUD, CAD)
- **Sell specific products**: Drive Units (Concert, Sinfonia, Philharmonic collections), PX4 Amplifier, Reference Cables, Lowther Badges
- **Exclude Grand Opera Collection** (commission-only)

---

## Prerequisites

✅ **You need:**
1. A Shopify account (Basic Shopify or higher)
2. Access to your Shopify admin panel
3. Your domain: `shop.lowtherloudspeakers.com` or similar
4. Multi-currency enabled on Shopify (available on Shopify Plus or with Shopify Payments)

---

## Phase 1: Setup Shopify Store

### 1.1 Create/Access Your Shopify Store

1. Go to [Shopify Admin](https://www.shopify.com/admin)
2. If you don't have a store yet, create one at `shop.lowtherloudspeakers.com`

### 1.2 Enable Shopify Payments (Required for Multi-Currency)

1. In Shopify Admin, go to **Settings → Payments**
2. Click **Complete account setup** under Shopify Payments
3. Fill in your business details
4. Enable **Multi-currency** under Shopify Payments settings

### 1.3 Configure Markets and Currencies

1. Go to **Settings → Markets**
2. Add markets for:
   - **United Kingdom** (GBP)
   - **United States** (USD)
   - **European Union** (EUR)
   - **Japan** (JPY)
   - **Australia** (AUD)
   - **Canada** (CAD)
3. Enable **Shopify Payments** for each market
4. Set up currency conversion rates (automatic or manual)

---

## Phase 2: Configure Shopify Storefront API

### 2.1 Create a Custom App

1. In Shopify Admin, go to **Settings → Apps and sales channels**
2. Click **Develop apps**
3. Click **Create an app**
4. Name it: `Lowther Website Integration`
5. Click **Configure Storefront API scopes**

### 2.2 Set Required API Permissions

Enable the following scopes:
- ✅ `unauthenticated_read_product_listings`
- ✅ `unauthenticated_read_product_inventory`
- ✅ `unauthenticated_read_product_tags`
- ✅ `unauthenticated_read_product_pickup_locations`
- ✅ `unauthenticated_write_checkouts`
- ✅ `unauthenticated_read_checkouts`

### 2.3 Generate API Credentials

1. Click **Install app**
2. Copy the **Storefront API access token**
3. Copy your **Shop domain** (e.g., `shop.lowtherloudspeakers.com`)

### 2.4 Add Environment Variables

Add these to your Vercel environment variables (or `.env.local` for local development):

```bash
NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN=shop.lowtherloudspeakers.com
NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN=your_storefront_access_token_here
NEXT_PUBLIC_SHOPIFY_API_VERSION=2024-10
```

---

## Phase 3: Multi-Currency Setup

### 3.1 Configure Currency Conversion

In Shopify Admin:
1. Go to **Settings → Markets → Preferences**
2. Under **Currency conversion**, choose:
   - **Automatic** (recommended): Shopify uses live exchange rates
   - **Manual**: You set custom rates per market

### 3.2 Set Base Prices in GBP

All product prices should be set in **GBP** (your base currency). Shopify will automatically convert to other currencies based on the selected market.

Example:
- **DX3 Drive Unit**: £3,750.00 GBP
  - Converts to: ~$4,800 USD, ~€4,350 EUR, ~¥650,000 JPY

### 3.3 Test Currency Switching

1. Visit your Shopify storefront
2. Use the country/currency selector
3. Verify prices update correctly

---

## Phase 4: Create Products in Shopify

### 4.1 Product Collections

Create the following collections in Shopify Admin (**Products → Collections**):

1. **Concert Collection**
2. **Sinfonia Collection**
3. **Philharmonic Collection**
4. **Lowther Ensemble** (for PX4, Cables, Badges)

### 4.2 Add Drive Unit Products

For each drive unit (excluding Grand Opera):

#### Example: DX3 Drive Unit

1. Go to **Products → Add product**
2. Fill in details:
   - **Title**: `DX3 Concert Drive Unit`
   - **Description**: [Your product description]
   - **Price**: `3750.00` (GBP)
   - **SKU**: `DX3-CONCERT`
   - **Barcode**: [If applicable]
   - **Inventory**: Set stock levels or mark as "Continue selling when out of stock"
   - **Shipping**: Configure weight and dimensions
3. Add product images (use high-quality images from `/public/images/drive-units/`)
4. Add to **Concert Collection**
5. Add product tags: `drive-unit`, `concert-collection`, `full-range`

#### Products to Add:

**Concert Collection:**
- DX3, DX4, DX5, DX6

**Sinfonia Collection:**
- DX2, EX2

**Philharmonic Collection:**
- PM4A, PM6A, PM6C, PM7A, Field Coil

### 4.3 Add Lowther Ensemble Products

1. **PX4 Amplifier**
   - Price: Set in GBP
   - Collection: `Lowther Ensemble`
   - Tags: `amplifier`, `px4`

2. **Reference Cables**
   - Variants: Different lengths (1m, 2m, 3m, 5m)
   - Price per variant
   - Collection: `Lowther Ensemble`
   - Tags: `cables`, `accessories`

3. **Lowther Badges**
   - Variants: Gold, Silver, Black
   - Price: Set in GBP
   - Collection: `Lowther Ensemble`
   - Tags: `badge`, `accessories`

### 4.4 Set Product Availability

- Mark **Grand Opera Collection** products as **Draft** or don't create them
- All other products should be **Active**

---

## Phase 5: Implement on Website

### 5.1 Update Shopify Utilities

The file `/src/lib/shopify.ts` needs to be updated with real Shopify Storefront API calls.

Create `/src/lib/shopify-client.ts`:

```typescript
import { 
  createStorefrontApiClient, 
  type ClientResponse 
} from '@shopify/storefront-api-client';

const client = createStorefrontApiClient({
  storeDomain: process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN!,
  apiVersion: process.env.NEXT_PUBLIC_SHOPIFY_API_VERSION || '2024-10',
  publicAccessToken: process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN!,
});

// GraphQL query to fetch products by collection
const COLLECTION_PRODUCTS_QUERY = `
  query getCollectionProducts($handle: String!, $country: CountryCode, $language: LanguageCode) @inContext(country: $country, language: $language) {
    collection(handle: $handle) {
      title
      products(first: 50) {
        edges {
          node {
            id
            title
            handle
            description
            priceRange {
              minVariantPrice {
                amount
                currencyCode
              }
            }
            images(first: 1) {
              edges {
                node {
                  url
                  altText
                }
              }
            }
            variants(first: 1) {
              edges {
                node {
                  id
                  availableForSale
                }
              }
            }
          }
        }
      }
    }
  }
`;

export interface ShopifyProduct {
  id: string;
  title: string;
  handle: string;
  description: string;
  price: {
    amount: string;
    currencyCode: string;
  };
  image: {
    url: string;
    altText: string;
  } | null;
  availableForSale: boolean;
}

export async function getCollectionProducts(
  collectionHandle: string,
  currency: string = 'GBP',
  language: string = 'EN'
): Promise<ShopifyProduct[]> {
  try {
    const response = await client.request(COLLECTION_PRODUCTS_QUERY, {
      variables: {
        handle: collectionHandle,
        country: currencyToCountry(currency),
        language: language.toUpperCase(),
      },
    });

    const collection = response.data?.collection;
    if (!collection) return [];

    return collection.products.edges.map((edge: any) => ({
      id: edge.node.id,
      title: edge.node.title,
      handle: edge.node.handle,
      description: edge.node.description,
      price: {
        amount: edge.node.priceRange.minVariantPrice.amount,
        currencyCode: edge.node.priceRange.minVariantPrice.currencyCode,
      },
      image: edge.node.images.edges[0]?.node || null,
      availableForSale: edge.node.variants.edges[0]?.node.availableForSale || false,
    }));
  } catch (error) {
    console.error('Error fetching collection products:', error);
    return [];
  }
}

// Helper to convert currency code to country code
function currencyToCountry(currency: string): string {
  const mapping: Record<string, string> = {
    'GBP': 'GB',
    'USD': 'US',
    'EUR': 'DE', // Or any EU country
    'JPY': 'JP',
    'AUD': 'AU',
    'CAD': 'CA',
  };
  return mapping[currency] || 'GB';
}

export { client };
```

### 5.2 Create a "Buy Now" Component

Create `/src/components/shopify-buy-button.tsx`:

```typescript
"use client";

import { Button } from "@/components/ui/button";
import { useCurrency } from "@/contexts/currency-context";

interface ShopifyBuyButtonProps {
  productHandle: string;
  className?: string;
}

export function ShopifyBuyButton({ productHandle, className }: ShopifyBuyButtonProps) {
  const { currency } = useCurrency();

  const handleBuyNow = () => {
    // Redirect to Shopify product page with currency parameter
    const shopUrl = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN;
    window.location.href = `https://${shopUrl}/products/${productHandle}?currency=${currency}`;
  };

  return (
    <Button 
      onClick={handleBuyNow}
      variant="black"
      size="lowther"
      className={className}
    >
      Buy Now
    </Button>
  );
}
```

### 5.3 Update Collection Pages

Update `/src/app/collection/[slug]/page.tsx` to fetch real Shopify data:

```typescript
import { getCollectionProducts } from '@/lib/shopify-client';
import { useCurrency } from '@/contexts/currency-context';

// In your component:
const { currency } = useCurrency();
const products = await getCollectionProducts('concert-collection', currency);
```

### 5.4 Add "Shop Now" Links

On drive unit pages, add the `ShopifyBuyButton` component:

```tsx
import { ShopifyBuyButton } from '@/components/shopify-buy-button';

// In your component:
<ShopifyBuyButton 
  productHandle="dx3-concert-drive-unit"
  className="w-full"
/>
```

---

## Phase 6: Testing

### 6.1 Test Multi-Currency

1. Visit your website
2. Change language/currency using the selector
3. Navigate to a drive unit product page
4. Click "Buy Now"
5. Verify you're redirected to Shopify with the correct currency

### 6.2 Test Checkout Flow

1. Add a product to cart in Shopify
2. Complete checkout
3. Verify currency is correct throughout
4. Test with different markets (GB, US, EU, JP, AU, CA)

### 6.3 Test Inventory Sync

1. Update stock levels in Shopify Admin
2. Verify "Out of Stock" displays correctly on the website

---

## Additional Features (Optional)

### 7.1 Embedded Shopify Checkout

Instead of redirecting to Shopify, you can embed the checkout on your website using Shopify's Buy Button SDK.

### 7.2 Product Availability Indicators

Show real-time stock levels on product pages.

### 7.3 Add to Cart from Website

Implement a cart system that adds products without leaving your website.

---

## Troubleshooting

### Issue: Products Not Showing

- Verify products are **Active** in Shopify
- Check API scopes are correct
- Ensure collection handles match your GraphQL queries

### Issue: Wrong Currency Displayed

- Verify `@inContext(country: $country)` is included in GraphQL queries
- Check Shopify Markets configuration
- Ensure currency selector updates the `useCurrency` context

### Issue: Checkout Redirects to Wrong Store

- Verify `NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN` is correct
- Check Shopify domain settings

---

## Support

For Shopify-specific issues:
- [Shopify Help Center](https://help.shopify.com)
- [Shopify Storefront API Docs](https://shopify.dev/docs/api/storefront)

For implementation questions:
- Check `/src/lib/shopify.ts` and `/src/lib/shopify-client.ts`
- Review this guide

---

## Next Steps

1. ✅ Complete Shopify setup (Phases 1-4)
2. ✅ Add all products to Shopify
3. ✅ Test checkout in different currencies
4. ✅ Implement website integration (Phase 5)
5. ✅ Test end-to-end (Phase 6)
6. 🚀 Launch!

---

**Created**: November 2025  
**Last Updated**: November 2025  
**Version**: 1.0

