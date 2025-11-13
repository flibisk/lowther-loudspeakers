"use client";

import { useEffect, useMemo, useState } from 'react';

import { useCurrency } from '@/contexts/currency-context';
import { getCollectionProducts, type ShopifyProduct } from '@/lib/shopify-storefront';

export function useShopifyCollection(collectionHandle?: string | null) {
  const { currency, region } = useCurrency();
  const [products, setProducts] = useState<ShopifyProduct[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<unknown>(null);

  useEffect(() => {
    if (!collectionHandle) return;

    let cancelled = false;

    const fetchProducts = async () => {
      setLoading(true);
      try {
        const data = await getCollectionProducts(collectionHandle, currency, region);
        if (!cancelled) {
          setProducts(data);
          setError(null);
        }
      } catch (err) {
        if (!cancelled) {
          console.error(`Failed to load Shopify collection: ${collectionHandle}`, err);
          setProducts([]);
          setError(err);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    fetchProducts();

    return () => {
      cancelled = true;
    };
  }, [collectionHandle, currency, region]);

  const productMap = useMemo(() => {
    const map = new Map<string, ShopifyProduct>();
    for (const product of products) {
      map.set(product.handle, product);
    }
    return map;
  }, [products]);

  return {
    products,
    productMap,
    loading,
    error,
  };
}
