// Shopify integration utilities
// This is a lightweight integration using Buy Button SDK or simple outbound links

interface ShopifyProduct {
  handle: string;
  title: string;
  price: string;
  currency: string;
  available: boolean;
  image?: string;
}

interface ShopifyConfig {
  shopUrl: string;
  shopDomain: string;
  apiVersion: string;
}

const config: ShopifyConfig = {
  shopUrl: process.env.NEXT_PUBLIC_SHOP_URL || "https://shop.lowtherloudspeakers.com",
  shopDomain: process.env.NEXT_PUBLIC_SHOP_DOMAIN || "shop.lowtherloudspeakers.com",
  apiVersion: "2024-01",
};

export function getShopifyProductUrl(productHandle: string): string {
  return `${config.shopUrl}/products/${productHandle}`;
}

export function getShopifyCollectionUrl(collectionHandle: string): string {
  return `${config.shopUrl}/collections/${collectionHandle}`;
}

export function getShopifyCartUrl(): string {
  return `${config.shopUrl}/cart`;
}

// Simple product link component props
export interface ShopifyBuyButtonProps {
  productHandle: string;
  variant?: string;
  quantity?: number;
  className?: string;
  children: React.ReactNode;
}

// Mock product data for development
export const mockShopifyProducts: Record<string, ShopifyProduct> = {
  "philharmonic-iii": {
    handle: "philharmonic-iii",
    title: "Philharmonic III",
    price: "15995.00",
    currency: "GBP",
    available: true,
    image: "/images/philharmonic-iii-1.jpg",
  },
  "grand-opera": {
    handle: "grand-opera",
    title: "Grand Opera",
    price: "12995.00",
    currency: "GBP",
    available: true,
    image: "/images/grand-opera-1.jpg",
  },
  "cottage": {
    handle: "cottage",
    title: "Cottage",
    price: "8995.00",
    currency: "GBP",
    available: true,
    image: "/images/cottage-1.jpg",
  },
  "quarter-wave": {
    handle: "quarter-wave",
    title: "Quarter Wave Kit",
    price: "4595.00",
    currency: "GBP",
    available: true,
    image: "/images/quarter-wave-1.jpg",
  },
};

export function getMockProduct(handle: string): ShopifyProduct | null {
  return mockShopifyProducts[handle] || null;
}

// Future: Replace with actual Shopify Storefront GraphQL API
export async function fetchShopifyProduct(handle: string): Promise<ShopifyProduct | null> {
  // For now, return mock data
  // In the future, this would make a GraphQL request to Shopify Storefront API
  return getMockProduct(handle);
}

// Future: Replace with Buy Button SDK
export function initializeShopifyBuyButton() {
  // This would initialize the Shopify Buy Button SDK
  // For now, we'll use simple links
  console.log("Shopify Buy Button SDK would be initialized here");
}
