'use client';

import { useState, useEffect, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCart } from '@/contexts/cart-context';
import { useWishlist } from '@/contexts/wishlist-context';
import { useShopifyCollection } from '@/hooks/use-shopify-collection';
import { parseDriveUnitString, getCollectionHandle, type ParsedDriveUnit } from '@/lib/utils/parse-drive-unit';
import { formatPrice } from '@/lib/shopify-storefront';
import type { ShopifyProduct } from '@/lib/shopify-storefront';

interface DriveUnitCardProps {
  driveUnitString: string;
  label: 'Recommended' | 'Standard' | 'Sealed';
  description?: string;
}

export function DriveUnitCard({ driveUnitString, label, description }: DriveUnitCardProps) {
  const [product, setProduct] = useState<ShopifyProduct | null>(null);
  const [loading, setLoading] = useState(true);
  const { addItem: addToCart, isLoading: cartLoading } = useCart();
  const { addItem: addToWishlist, removeItem: removeFromWishlist, isInWishlist } = useWishlist();
  const [addingToCart, setAddingToCart] = useState(false);

  // Parse the drive unit string
  const parsed = useMemo(() => parseDriveUnitString(driveUnitString), [driveUnitString]);
  
  // Get collection handle
  const collectionHandle = useMemo(() => {
    if (!parsed) return null;
    return getCollectionHandle(parsed.collection);
  }, [parsed]);

  // Fetch products from the collection
  const { productMap, loading: collectionLoading } = useShopifyCollection(collectionHandle);

  // Find the product in the collection
  useEffect(() => {
    if (!parsed || collectionLoading) {
      setLoading(true);
      return;
    }

    const foundProduct = productMap.get(parsed.handle);
    setProduct(foundProduct || null);
    setLoading(false);
  }, [parsed, productMap, collectionLoading]);

  const handleAddToCart = async () => {
    if (!product || !product.variants || product.variants.length === 0) return;
    
    setAddingToCart(true);
    try {
      const variant = product.variants[0];
      if (variant.availableForSale) {
        await addToCart(variant.id, parsed?.quantity || 1);
      } else {
        alert('This product is currently out of stock');
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
      alert('Unable to add item to cart. Please try again.');
    } finally {
      setAddingToCart(false);
    }
  };

  const handleWishlistToggle = () => {
    if (!product) return;

    const wishlistItem = {
      id: product.id,
      handle: product.handle,
      title: product.title,
      price: formatPrice(product.priceRange.minVariantPrice.amount, product.priceRange.minVariantPrice.currencyCode),
      image: product.images[0]?.url || '',
      shopifyHandle: product.handle,
      type: 'shopify' as const,
      url: `/products/${product.handle}`,
    };

    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(wishlistItem);
    }
  };

  const isSaved = product ? isInWishlist(product.id) : false;
  const productImage = product?.images[0]?.url || '/images/placeholder-drive-unit.jpg';
  const productPrice = product 
    ? formatPrice(product.priceRange.minVariantPrice.amount, product.priceRange.minVariantPrice.currencyCode)
    : null;

  if (loading || !parsed) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-4 animate-pulse">
        <div className="flex gap-4">
          <div className="w-24 h-24 bg-gray-200 rounded"></div>
          <div className="flex-1">
            <div className="h-4 bg-gray-200 rounded w-32 mb-2"></div>
            <div className="h-6 bg-gray-200 rounded w-40 mb-4"></div>
            <div className="h-10 bg-gray-200 rounded w-full"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow">
      <div className="flex gap-4">
        {/* Image */}
        <div className="relative w-24 h-24 flex-shrink-0 bg-gray-100 rounded overflow-hidden">
          {product ? (
            <Image
              src={productImage}
              alt={product.title}
              fill
              className="object-contain p-2"
              sizes="96px"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs text-center p-2">
              {parsed.label}
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Label */}
          <div className="mb-1">
            {label === 'Recommended' && (
              <span className="text-xs font-semibold text-[#c59862]">✨ Recommended option</span>
            )}
            {label === 'Standard' && (
              <span className="text-xs font-semibold text-gray-600">Standard option</span>
            )}
            {label === 'Sealed' && (
              <span className="text-xs font-semibold text-gray-600">If worried about sealing</span>
            )}
          </div>

          {/* Product Name */}
          <h4 className="font-display text-lg font-semibold text-gray-900 mb-1">
            {parsed.label}
          </h4>

          {/* Price */}
          {productPrice && (
            <p className="text-sm text-gray-600 mb-3">
              From {productPrice}*
            </p>
          )}

          {/* Buttons */}
          <div className="flex gap-2">
            {product ? (
              <>
                <Button
                  size="sm"
                  className="flex-1 bg-black hover:bg-[#c59862] text-white font-sarabun text-xs tracking-[3px] transition-all duration-300 uppercase"
                  onClick={handleAddToCart}
                  disabled={addingToCart || cartLoading || !product.variants[0]?.availableForSale}
                >
                  {addingToCart || cartLoading ? 'ADDING...' : 'ADD TO BAG'}
                </Button>
                <button
                  type="button"
                  onClick={handleWishlistToggle}
                  className={`flex-shrink-0 w-10 h-10 flex items-center justify-center rounded border transition-all duration-200 ${
                    isSaved
                      ? 'bg-[#c59862] border-[#c59862] text-white hover:bg-[#b78955]'
                      : 'bg-white border-[#c59862] text-[#c59862] hover:bg-[#c59862] hover:text-white'
                  }`}
                  aria-label={isSaved ? 'Remove from wishlist' : 'Add to wishlist'}
                >
                  <Heart
                    className="w-5 h-5"
                    strokeWidth={isSaved ? 0 : 1.6}
                    fill={isSaved ? 'currentColor' : 'none'}
                  />
                </button>
              </>
            ) : (
              <Link href={`/collection/${parsed.collection || 'concert'}`}>
                <Button
                  size="sm"
                  variant="outline"
                  className="w-full"
                >
                  View Collection
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

