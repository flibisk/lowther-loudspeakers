'use client';

import { useState, useEffect, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useCart } from '@/contexts/cart-context';
import { useCurrency } from '@/contexts/currency-context';
import { CartOverlay } from '@/components/cart-overlay';
import { getProductsByTag, formatPrice, type ShopifyProduct } from '@/lib/shopify-storefront';

// Concert and Sinfonia collection drive units for the "current drive unit" dropdown
const currentDriveUnits = [
  // Concert Collection
  { id: 'pm2a-concert', title: 'PM2A Concert', handle: 'lowther-pm2a-concert', collection: 'Concert' },
  { id: 'pm3a-concert', title: 'PM3A Concert', handle: 'lowther-pm3a-concert', collection: 'Concert' },
  { id: 'pm4a-concert', title: 'PM4A Concert', handle: 'lowther-pm4a-concert', collection: 'Concert' },
  { id: 'pm5a-concert', title: 'PM5A Concert', handle: 'lowther-pm5a-concert', collection: 'Concert' },
  { id: 'pm6a-concert', title: 'PM6A Concert', handle: 'lowther-pm6a-concert', collection: 'Concert' },
  { id: 'pm6c-concert', title: 'PM6C Concert', handle: 'lowther-pm6c-concert', collection: 'Concert' },
  { id: 'pm7a-concert', title: 'PM7A Concert', handle: 'lowther-pm7a-concert', collection: 'Concert' },
  { id: 'dx2-concert', title: 'DX2 Concert', handle: 'lowther-dx2-concert', collection: 'Concert' },
  { id: 'dx3-concert', title: 'DX3 Concert', handle: 'lowther-dx3-concert', collection: 'Concert' },
  { id: 'dx4-concert', title: 'DX4 Concert', handle: 'lowther-dx4-concert', collection: 'Concert' },
  { id: 'ex2-concert', title: 'EX2 Concert', handle: 'lowther-ex2-concert', collection: 'Concert' },
  { id: 'ex3-concert', title: 'EX3 Concert', handle: 'lowther-ex3-concert', collection: 'Concert' },
  { id: 'ex4-concert', title: 'EX4 Concert', handle: 'lowther-ex4-concert', collection: 'Concert' },
  // Sinfonia Collection
  { id: 'pm2a-sinfonia', title: 'PM2A Sinfonia', handle: 'lowther-pm2a-sinfonia', collection: 'Sinfonia' },
  { id: 'pm3a-sinfonia', title: 'PM3A Sinfonia', handle: 'lowther-pm3a-sinfonia', collection: 'Sinfonia' },
  { id: 'pm4a-sinfonia', title: 'PM4A Sinfonia', handle: 'lowther-pm4a-sinfonia', collection: 'Sinfonia' },
  { id: 'pm5a-sinfonia', title: 'PM5A Sinfonia', handle: 'lowther-pm5a-sinfonia', collection: 'Sinfonia' },
  { id: 'pm6a-sinfonia', title: 'PM6A Sinfonia', handle: 'lowther-pm6a-sinfonia', collection: 'Sinfonia' },
  { id: 'pm7a-sinfonia', title: 'PM7A Sinfonia', handle: 'lowther-pm7a-sinfonia', collection: 'Sinfonia' },
  { id: 'dx2-sinfonia', title: 'DX2 Sinfonia', handle: 'lowther-dx2-sinfonia', collection: 'Sinfonia' },
  { id: 'dx3-sinfonia', title: 'DX3 Sinfonia', handle: 'lowther-dx3-sinfonia', collection: 'Sinfonia' },
  { id: 'dx4-sinfonia', title: 'DX4 Sinfonia', handle: 'lowther-dx4-sinfonia', collection: 'Sinfonia' },
];

export function UpgradeSelector() {
  const { currency, region } = useCurrency();
  const { addItem, isLoading: cartLoading } = useCart();
  const [cartOpen, setCartOpen] = useState(false);
  const [upgradeProducts, setUpgradeProducts] = useState<ShopifyProduct[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [selectedCurrentUnit, setSelectedCurrentUnit] = useState<string>('');
  const [selectedUpgradeUnit, setSelectedUpgradeUnit] = useState<string>('');
  const [quantity, setQuantity] = useState<number>(1);

  // Fetch upgrade products from Shopify
  useEffect(() => {
    async function fetchUpgradeProducts() {
      setLoading(true);
      try {
        const products = await getProductsByTag('hidden-upgrade', currency, region);
        // Filter to only include products with "(Upgrade)" in the name
        const filteredProducts = products.filter(product => 
          product.title.includes('(Upgrade)')
        );
        setUpgradeProducts(filteredProducts);
      } catch (error) {
        console.error('Error fetching upgrade products:', error);
      } finally {
        setLoading(false);
      }
    }
    
    fetchUpgradeProducts();
  }, [currency, region]);

  // Get selected upgrade product
  const selectedUpgradeProduct = useMemo(() => {
    return upgradeProducts.find(p => p.id === selectedUpgradeUnit);
  }, [upgradeProducts, selectedUpgradeUnit]);

  // Calculate total price and RRP
  const { totalPrice, rrpPrice } = useMemo(() => {
    if (!selectedUpgradeProduct || !selectedUpgradeProduct.variants.length) {
      return { totalPrice: null, rrpPrice: null };
    }
    
    const variant = selectedUpgradeProduct.variants[0];
    const priceAmount = parseFloat(variant.price.amount);
    const total = priceAmount * quantity;
    
    // Get RRP from compareAtPrice if available
    const rrp = variant.compareAtPrice 
      ? parseFloat(variant.compareAtPrice.amount) * quantity
      : null;
    
    return { totalPrice: total, rrpPrice: rrp };
  }, [selectedUpgradeProduct, quantity]);

  // Handle add to bag
  const handleAddToBag = async () => {
    if (!selectedUpgradeProduct || !selectedUpgradeProduct.variants.length) return;
    
    const variant = selectedUpgradeProduct.variants[0];
    if (!variant.availableForSale) {
      alert('This upgrade product is currently out of stock');
      return;
    }

    try {
      await addItem(variant.id, quantity);
      setTimeout(() => {
        setCartOpen(true);
      }, 100);
    } catch (error) {
      console.error('Error adding to cart:', error);
      alert('Unable to add item to cart. Please try again.');
    }
  };

  return (
    <>
      <div className="grid md:grid-cols-3 gap-8">
        {/* Column 1: Current Drive Unit */}
        <div>
          <label htmlFor="current-unit" className="block text-sm font-medium text-gray-700 mb-2">
            Your Current Drive Unit *
          </label>
          <Select value={selectedCurrentUnit} onValueChange={setSelectedCurrentUnit}>
            <SelectTrigger id="current-unit" className="w-full">
              <SelectValue placeholder="Select your current drive unit" />
            </SelectTrigger>
            <SelectContent>
              {currentDriveUnits.map((unit) => (
                <SelectItem key={unit.id} value={unit.id}>
                  {unit.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Column 2: Upgrade Drive Unit */}
        <div>
          <label htmlFor="upgrade-unit" className="block text-sm font-medium text-gray-700 mb-2">
            Upgrade To *
          </label>
          {loading ? (
            <div className="w-full px-4 py-3 border border-gray-300 rounded-sm text-gray-500">
              Loading upgrade options...
            </div>
          ) : (
            <Select 
              value={selectedUpgradeUnit} 
              onValueChange={setSelectedUpgradeUnit}
              disabled={!selectedCurrentUnit}
            >
              <SelectTrigger id="upgrade-unit" className="w-full">
                <SelectValue placeholder={selectedCurrentUnit ? "Select upgrade" : "Select current unit first"} />
              </SelectTrigger>
              <SelectContent>
                {upgradeProducts.map((product) => (
                  <SelectItem key={product.id} value={product.id}>
                    {product.title.replace(' (Upgrade)', '')}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>

        {/* Column 3: Quantity, Price, and Add to Bag */}
        <div>
          <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-2">
            Quantity *
          </label>
          <div className="space-y-4">
            <Select 
              value={quantity.toString()} 
              onValueChange={(value) => setQuantity(parseInt(value))}
              disabled={!selectedUpgradeUnit}
            >
              <SelectTrigger id="quantity" className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
                  <SelectItem key={num} value={num.toString()}>
                    {num}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {totalPrice && selectedUpgradeProduct && (
              <div className="border border-gray-200 rounded-sm p-4 bg-gray-50">
                <div className="text-sm text-gray-600 mb-1">Total Price</div>
                <div className="flex items-center gap-3">
                  {rrpPrice && (
                    <div className="text-xl font-display text-gray-400 line-through">
                      {formatPrice(rrpPrice.toString(), selectedUpgradeProduct.variants[0].price.currencyCode)}
                    </div>
                  )}
                  <div className="text-2xl font-display" style={{ color: '#c59862' }}>
                    {formatPrice(totalPrice.toString(), selectedUpgradeProduct.variants[0].price.currencyCode)}
                  </div>
                </div>
              </div>
            )}

            <Button
              size="lg"
              className="w-full bg-black hover:bg-[#c59862] text-white font-sarabun text-xs tracking-[3px] transition-all duration-300 uppercase disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={handleAddToBag}
              disabled={!selectedUpgradeUnit || !selectedCurrentUnit || cartLoading || loading}
            >
              {cartLoading ? 'ADDING...' : 'ADD TO BAG'}
            </Button>
          </div>
        </div>
      </div>

      <CartOverlay isOpen={cartOpen} onClose={() => setCartOpen(false)} />
    </>
  );
}

