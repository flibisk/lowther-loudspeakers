'use client';

import { useState, useEffect, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCart } from '@/contexts/cart-context';
import { useWishlist } from '@/contexts/wishlist-context';
import { useShopifyCollection } from '@/hooks/use-shopify-collection';
import { useCurrency } from '@/contexts/currency-context';
import { parseDriveUnitString, getCollectionHandle, type ParsedDriveUnit } from '@/lib/utils/parse-drive-unit';
import { formatPrice, getProduct } from '@/lib/shopify-storefront';
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
  const { currency, region } = useCurrency();
  const [addingToCart, setAddingToCart] = useState(false);
  const [quantity, setQuantity] = useState(1);

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
    if (!parsed) {
      setLoading(false);
      return;
    }

    // Wait for collection to finish loading
    if (collectionLoading) {
      setLoading(true);
      return;
    }

    // Try multiple handle variations to find the product in collection
    let foundProduct = null;
    const handleVariations = [
      parsed.handle, // Original parsed handle
      parsed.handle.replace(/^lowther-/, ''), // Without lowther- prefix
      `lowther-${parsed.handle}`, // With lowther- prefix
      parsed.handle.replace(/^lowther-/, '').replace(/-sinfonia$/, '-sinfonia'), // Ensure correct suffix
      parsed.handle.replace(/^lowther-/, '').replace(/-concert$/, '-concert'), // Ensure correct suffix
    ];

    // Try each variation in the productMap
    for (const handle of handleVariations) {
      foundProduct = productMap.get(handle);
      if (foundProduct) break;
    }

    // Also try case-insensitive matching by checking all handles
    if (!foundProduct && productMap.size > 0) {
      const searchHandle = parsed.handle.toLowerCase().replace(/^lowther-/, '');
      for (const [handle, product] of productMap.entries()) {
        const normalizedHandle = handle.toLowerCase().replace(/^lowther-/, '');
        if (normalizedHandle === searchHandle) {
          foundProduct = product;
          break;
        }
      }
    }

    // If not found in collection and collection is empty or product not found, try fetching directly by handle
    if (!foundProduct && parsed) {
      const directFetchHandles = [
        parsed.handle,
        parsed.handle.replace(/^lowther-/, ''),
        `lowther-${parsed.handle}`,
      ];

      // Try fetching each handle variation directly
      const fetchProductDirectly = async () => {
        for (const handle of directFetchHandles) {
          try {
            const directProduct = await getProduct(handle, currency, region);
            if (directProduct) {
              foundProduct = directProduct;
              console.log('DriveUnitCard: Found product via direct fetch', { handle, product: directProduct.title });
              break;
            }
          } catch (error) {
            // Continue to next variation
            continue;
          }
        }
        
        if (!foundProduct) {
          console.log('DriveUnitCard: Product not found in collection or direct fetch', {
            parsedHandle: parsed.handle,
            collectionHandle,
            availableHandles: Array.from(productMap.keys()).slice(0, 10),
            driveUnitString,
            triedVariations: handleVariations,
            triedDirectHandles: directFetchHandles,
          });
        }
        
        setProduct(foundProduct || null);
        setLoading(false);
      };

      fetchProductDirectly();
    } else {
      setProduct(foundProduct || null);
      setLoading(false);
    }
    
    // Set initial quantity from parsed string
    if (parsed && parsed.quantity > 1) {
      setQuantity(parsed.quantity);
    }
  }, [parsed, productMap, collectionLoading, collectionHandle, driveUnitString, currency, region]);

  const handleAddToCart = async () => {
    if (!product || !product.variants || product.variants.length === 0) return;
    
    setAddingToCart(true);
    try {
      const variant = product.variants[0];
      if (variant.availableForSale) {
        await addToCart(variant.id, quantity);
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
  const productImage = product?.images?.[0]?.url || null;
  const productPrice = product 
    ? formatPrice(product.priceRange.minVariantPrice.amount, product.priceRange.minVariantPrice.currencyCode)
    : null;

  if (loading || !parsed) {
    return (
      <div className="bg-gray-50 rounded-lg border-2 border-[#c59862] p-4 animate-pulse">
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
    <div className="bg-gray-50 rounded-lg border-2 border-[#c59862] p-4 hover:shadow-md transition-shadow">
      <div className="flex gap-4">
        {/* Image */}
        <div className="relative w-24 h-24 flex-shrink-0 bg-gray-100 rounded overflow-hidden">
          {product && productImage ? (
            <Image
              src={productImage}
              alt={product.title}
              fill
              className="object-contain p-2"
              sizes="96px"
              unoptimized
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs text-center p-2">
              {product ? product.title : parsed.label}
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
            <p className="text-sm text-gray-600 mb-2">
              From {productPrice}*
            </p>
          )}

          {/* Quantity Selector and Buttons */}
          {product ? (
            <div className="space-y-2">
              {/* Quantity Selector */}
              <div className="flex items-center gap-2 mb-2">
                <label htmlFor={`quantity-${parsed.handle}`} className="text-sm text-gray-600">
                  Quantity:
                </label>
                <div className="flex items-center border border-gray-300 rounded">
                  <button
                    type="button"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-2 py-1 text-gray-600 hover:bg-gray-100 transition-colors"
                    aria-label="Decrease quantity"
                  >
                    −
                  </button>
                  <input
                    id={`quantity-${parsed.handle}`}
                    type="number"
                    min="1"
                    value={quantity}
                    onChange={(e) => {
                      const val = parseInt(e.target.value, 10);
                      if (!isNaN(val) && val > 0) {
                        setQuantity(val);
                      }
                    }}
                    className="w-16 px-2 py-1 text-center border-0 focus:outline-none focus:ring-0"
                  />
                  <button
                    type="button"
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-2 py-1 text-gray-600 hover:bg-gray-100 transition-colors"
                    aria-label="Increase quantity"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2">
                <Button
                  size="sm"
                  className="flex-1 h-10 bg-black hover:bg-[#c59862] text-white font-sarabun text-xs tracking-[3px] transition-all duration-300 uppercase"
                  onClick={handleAddToCart}
                  disabled={addingToCart || cartLoading || !product.variants[0]?.availableForSale}
                >
                  {addingToCart || cartLoading ? 'ADDING...' : 'ADD TO BAG'}
                </Button>
                <button
                  type="button"
                  onClick={handleWishlistToggle}
                  className={`flex-shrink-0 h-10 w-10 flex items-center justify-center rounded border transition-all duration-200 ${
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
              </div>
            </div>
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
  );
}

