'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useWishlist } from '@/contexts/wishlist-context';
import { useCart } from '@/contexts/cart-context';
import { CartOverlay } from '@/components/cart-overlay';
import { getProductUrl } from '@/lib/wishlist-utils';
import { useShopifyCollection } from '@/hooks/use-shopify-collection';

export default function WishlistPage() {
  const { items, itemCount, removeItem, clearWishlist } = useWishlist();
  const { addItem: addToCart, isLoading: cartLoading } = useCart();
  const [cartOpen, setCartOpen] = useState(false);
  const [loadingItemId, setLoadingItemId] = useState<string | null>(null);

  // Get Shopify collections for cart operations
  const { productMap: sinfoniaMap } = useShopifyCollection('the-sinfonia-collection');
  const { productMap: philharmonicMap } = useShopifyCollection('the-philharmonic-collection');
  const { productMap: concertMap } = useShopifyCollection('the-concert-collection');
  const { productMap: superTweeterMap } = useShopifyCollection('super-tweeter');
  const { productMap: ensembleMap } = useShopifyCollection('accessories');

  const handleAddToBag = async (item: typeof items[0]) => {
    setLoadingItemId(item.id);
    try {
      // Try to find product in Shopify collections
      let shopifyProduct = null;
      
      if (item.shopifyHandle) {
        // Try different collections
        shopifyProduct = sinfoniaMap.get(item.shopifyHandle) ||
                        philharmonicMap.get(item.shopifyHandle) ||
                        concertMap.get(item.shopifyHandle) ||
                        superTweeterMap.get(item.shopifyHandle) ||
                        ensembleMap.get(item.shopifyHandle) ||
                        sinfoniaMap.get(item.handle) ||
                        philharmonicMap.get(item.handle) ||
                        concertMap.get(item.handle) ||
                        superTweeterMap.get(item.handle) ||
                        ensembleMap.get(item.handle);
      } else {
        // Fallback: try with handle
        shopifyProduct = sinfoniaMap.get(item.handle) ||
                        philharmonicMap.get(item.handle) ||
                        concertMap.get(item.handle) ||
                        superTweeterMap.get(item.handle) ||
                        ensembleMap.get(item.handle);
      }

      if (shopifyProduct && shopifyProduct.variants && shopifyProduct.variants.length > 0) {
        const variant = shopifyProduct.variants[0];
        if (variant.availableForSale) {
          await addToCart(variant.id, 1);
          setTimeout(() => {
            setCartOpen(true);
          }, 100);
        } else {
          alert('This product is currently out of stock');
        }
      } else {
        // If not found in Shopify, redirect to product page
        const productUrl = item.url || getProductUrl(item.handle, item.id);
        window.location.href = productUrl;
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
      alert('Unable to add item to cart. Please try again.');
    } finally {
      setLoadingItemId(null);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Sentinel for Nav */}
      <div id="hero-sentinel" className="absolute top-0 left-0 w-full h-16" />

      {/* Hero Banner */}
      <section data-surface="dark" className="relative min-h-[100vh] overflow-hidden">
        <Image
          src="/images/wishlist/Mrs-Bird.JPG"
          alt="Your Wishlist"
          fill
          className="absolute inset-0 h-full w-full object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>
        
        <div className="absolute bottom-20 930:bottom-20 left-6 930:left-16 z-10 text-white max-w-xs sm:max-w-md 930:max-w-2xl">
          <div className="flex items-center mb-2">
            <div className="w-8 h-px bg-white mr-3"></div>
            <span className="text-sm tracking-wider uppercase text-white/80">SAVED ITEMS</span>
          </div>
          
          <h1 className="font-display text-4xl md:text-6xl font-bold leading-tight mb-4" style={{ color: '#c59862' }}>
            Your Wishlist
          </h1>
          
          <p className="hidden 930:block text-xl leading-relaxed">
            {itemCount === 0 
              ? 'Save your favorite products to easily find them later' 
              : `${itemCount} ${itemCount === 1 ? 'item' : 'items'} saved for later`}
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-16">
        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center justify-between">
            <p className="text-lg text-gray-600">
              {itemCount === 0 ? 'Your wishlist is empty' : `${itemCount} ${itemCount === 1 ? 'item' : 'items'} saved`}
            </p>
            {itemCount > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={clearWishlist}
                className="text-red-600 border-red-600 hover:bg-red-50"
              >
                Clear All
              </Button>
            )}
          </div>
        </div>

        {/* Breadcrumbs */}
        <div className="mb-8">
          <nav className="flex items-center space-x-2 text-sm text-gray-600">
            <Link href="/" className="hover:text-[#c59862] transition-colors">Home</Link>
            <span>/</span>
            <span className="text-gray-900">Your Wishlist</span>
          </nav>
        </div>
        </div>

        {/* Empty State */}
        {itemCount === 0 ? (
          <div className="text-center py-16">
            <svg
              className="mx-auto h-24 w-24 text-gray-300 mb-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              />
            </svg>
            <h2 className="text-2xl font-display text-gray-900 mb-4">
              Your wishlist is empty
            </h2>
            <p className="text-gray-600 mb-8">
              Save your favorite products to easily find them later
            </p>
            <Link href="/collection/sinfonia">
              <Button
                size="lg"
                className="bg-black hover:bg-[#c59862] text-white font-sarabun text-xs tracking-[3px] transition-all duration-300 uppercase"
              >
                Explore Products
              </Button>
            </Link>
          </div>
        ) : (
          /* Wishlist Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {items.map((item) => (
              <div
                key={item.id}
                className="group relative bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-300"
              >
                {/* Remove Button */}
                <button
                  onClick={() => removeItem(item.id)}
                  className="absolute top-4 right-4 z-10 bg-white rounded-full p-2 shadow-md hover:bg-red-50 hover:text-red-600 transition-colors"
                  aria-label="Remove from wishlist"
                >
                  <X className="w-5 h-5" />
                </button>

                {/* Product Image */}
                <Link href={item.url || getProductUrl(item.handle, item.id)}>
                  <div className="relative w-full h-64 bg-gray-100">
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-contain p-4 group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                </Link>

                {/* Product Info */}
                <div className="p-6">
                  <Link href={item.url || getProductUrl(item.handle, item.id)}>
                    <h3 className="text-xl font-display text-gray-900 mb-2 group-hover:text-[#c59862] transition-colors">
                      {item.title}
                    </h3>
                  </Link>
                  <p className="text-lg text-gray-600 mb-4">
                    From {item.price}*
                  </p>
                  <div className="flex flex-col gap-2">
                    <Button
                      size="lg"
                      className="w-full bg-black hover:bg-[#c59862] text-white font-sarabun text-xs tracking-[3px] transition-all duration-300 uppercase"
                      onClick={() => handleAddToBag(item)}
                      disabled={cartLoading && loadingItemId === item.id}
                    >
                      {cartLoading && loadingItemId === item.id ? 'ADDING...' : 'ADD TO BAG'}
                    </Button>
                    <Link href={item.url || getProductUrl(item.handle, item.id)}>
                      <Button
                        size="lg"
                        variant="outline"
                        className="w-full bg-white hover:bg-black text-black hover:text-white border border-black font-sarabun text-xs tracking-[3px] transition-all duration-300 uppercase"
                      >
                        View Details
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Additional Info */}
        {itemCount > 0 && (
          <div className="mt-16 text-center">
            <p className="text-sm text-gray-500">
              * Prices exclude VAT. Final price will be calculated at checkout based on your location.
            </p>
          </div>
        )}
      </div>

      {/* Cart Overlay */}
      <CartOverlay isOpen={cartOpen} onClose={() => setCartOpen(false)} />
    </div>
  );
}

