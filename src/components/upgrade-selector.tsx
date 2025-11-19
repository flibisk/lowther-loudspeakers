'use client';

import { useState, useEffect, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useCart } from '@/contexts/cart-context';
import { useCurrency } from '@/contexts/currency-context';
import { CartOverlay } from '@/components/cart-overlay';
import { getProductsByTag, formatPrice, type ShopifyProduct } from '@/lib/shopify-storefront';

// Concert collection drive units for the "current drive unit" dropdown
const concertDriveUnits = [
  { id: 'pm2a-concert', title: 'PM2A Concert', handle: 'lowther-pm2a-concert' },
  { id: 'pm3a-concert', title: 'PM3A Concert', handle: 'lowther-pm3a-concert' },
  { id: 'pm4a-concert', title: 'PM4A Concert', handle: 'lowther-pm4a-concert' },
  { id: 'pm5a-concert', title: 'PM5A Concert', handle: 'lowther-pm5a-concert' },
  { id: 'pm6a-concert', title: 'PM6A Concert', handle: 'lowther-pm6a-concert' },
  { id: 'pm6c-concert', title: 'PM6C Concert', handle: 'lowther-pm6c-concert' },
  { id: 'pm7a-concert', title: 'PM7A Concert', handle: 'lowther-pm7a-concert' },
  { id: 'dx2-concert', title: 'DX2 Concert', handle: 'lowther-dx2-concert' },
  { id: 'dx3-concert', title: 'DX3 Concert', handle: 'lowther-dx3-concert' },
  { id: 'dx4-concert', title: 'DX4 Concert', handle: 'lowther-dx4-concert' },
  { id: 'ex2-concert', title: 'EX2 Concert', handle: 'lowther-ex2-concert' },
  { id: 'ex3-concert', title: 'EX3 Concert', handle: 'lowther-ex3-concert' },
  { id: 'ex4-concert', title: 'EX4 Concert', handle: 'lowther-ex4-concert' },
];

export function UpgradeSelector() {
  const { currency } = useCurrency();
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
        const products = await getProductsByTag('hidden-upgrade', currency.code, currency.countryCode);
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
  }, [currency.code, currency.countryCode]);

  // Get selected upgrade product
  const selectedUpgradeProduct = useMemo(() => {
    return upgradeProducts.find(p => p.id === selectedUpgradeUnit);
  }, [upgradeProducts, selectedUpgradeUnit]);

  // Calculate total price
  const totalPrice = useMemo(() => {
    if (!selectedUpgradeProduct || !selectedUpgradeProduct.variants.length) return null;
    
    const variant = selectedUpgradeProduct.variants[0];
    const priceAmount = parseFloat(variant.price.amount);
    return priceAmount * quantity;
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
              {concertDriveUnits.map((unit) => (
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
                <div className="text-2xl font-display" style={{ color: '#c59862' }}>
                  {formatPrice(totalPrice.toString(), selectedUpgradeProduct.variants[0].price.currencyCode)}
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

