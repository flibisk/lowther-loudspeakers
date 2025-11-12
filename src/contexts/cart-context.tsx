'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  createCart,
  addToCart as addToCartAPI,
  updateCartLine,
  removeFromCart as removeFromCartAPI,
  getCart,
  updateCartBuyerIdentity,
  type ShopifyCart,
} from '@/lib/shopify-storefront';
import { useCurrency } from '@/contexts/currency-context';

interface CartContextType {
  cart: ShopifyCart | null;
  isLoading: boolean;
  itemCount: number;
  addItem: (variantId: string, quantity: number) => Promise<void>;
  updateItem: (lineId: string, quantity: number) => Promise<void>;
  removeItem: (lineId: string) => Promise<void>;
  refreshCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_ID_KEY = 'lowther_cart_id';

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<ShopifyCart | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { currency, region } = useCurrency();

  // Calculate total item count
  const itemCount = cart?.lines.reduce((total, line) => total + line.quantity, 0) ?? 0;

  // Initialize cart from localStorage and reload when currency changes
  useEffect(() => {
    const initCart = async () => {
      const storedCartId = localStorage.getItem(CART_ID_KEY);
      
      if (storedCartId) {
        // Only show loading if we have a cart to reload
        setIsLoading(true);
        // Try to fetch existing cart with current currency
        const existingCart = await getCart(storedCartId, currency, region);
        if (existingCart) {
          let cartToUse = existingCart;

          if (existingCart.cost?.totalAmount?.currencyCode !== currency) {
            const alignedCart = await updateCartBuyerIdentity(storedCartId, currency, region);
            if (alignedCart) {
              cartToUse = alignedCart;
            }
          }

          setCart(cartToUse);
          setIsLoading(false);
          return;
        }
        // If cart doesn't exist, clear the stored ID
        localStorage.removeItem(CART_ID_KEY);
        setIsLoading(false);
      } else {
        // No cart exists, just set loading to false
        setIsLoading(false);
      }
    };

    initCart();
  }, [currency, region]);

  // Refresh cart data
  const refreshCart = useCallback(async () => {
    const cartId = cart?.id || localStorage.getItem(CART_ID_KEY);
    if (!cartId) return;

    const updatedCart = await getCart(cartId, currency, region);
    if (updatedCart) {
      if (updatedCart.cost?.totalAmount?.currencyCode !== currency) {
        const alignedCart = await updateCartBuyerIdentity(cartId, currency, region);
        if (alignedCart) {
          setCart(alignedCart);
          return;
        }
      }

      setCart(updatedCart);
    }
  }, [cart?.id, currency, region]);

  // Add item to cart
  const addItem = useCallback(async (variantId: string, quantity: number) => {
    setIsLoading(true);
    try {
      let currentCartId = cart?.id || localStorage.getItem(CART_ID_KEY);

      // Create cart if it doesn't exist
      if (!currentCartId) {
        const newCart = await createCart(currency, region);
        if (!newCart) {
          throw new Error('Failed to create cart');
        }
        currentCartId = newCart.id;
        localStorage.setItem(CART_ID_KEY, currentCartId);
        setCart(newCart);
      }

      // Add item to cart
      const updatedCart = await addToCartAPI(currentCartId, variantId, quantity, currency, region);
      if (updatedCart) {
        setCart(updatedCart);
        localStorage.setItem(CART_ID_KEY, updatedCart.id);
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
    } finally {
      setIsLoading(false);
    }
  }, [cart?.id, currency, region]);

  // Update item quantity
  const updateItem = useCallback(async (lineId: string, quantity: number) => {
    const cartId = cart?.id;
    if (!cartId) return;

    setIsLoading(true);
    try {
      const updatedCart = await updateCartLine(cartId, lineId, quantity, currency, region);
      if (updatedCart) {
        setCart(updatedCart);
      }
    } catch (error) {
      console.error('Error updating cart:', error);
    } finally {
      setIsLoading(false);
    }
  }, [cart?.id, currency, region]);

  // Remove item from cart
  const removeItem = useCallback(async (lineId: string) => {
    const cartId = cart?.id;
    if (!cartId) return;

    setIsLoading(true);
    try {
      const updatedCart = await removeFromCartAPI(cartId, lineId, currency, region);
      if (updatedCart) {
        setCart(updatedCart);
      }
    } catch (error) {
      console.error('Error removing from cart:', error);
    } finally {
      setIsLoading(false);
    }
  }, [cart?.id, currency, region]);

  return (
    <CartContext.Provider
      value={{
        cart,
        isLoading,
        itemCount,
        addItem,
        updateItem,
        removeItem,
        refreshCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}

