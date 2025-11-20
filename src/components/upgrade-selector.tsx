'use client';

import { useState, useEffect, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useCart } from '@/contexts/cart-context';
import { useCurrency } from '@/contexts/currency-context';
import { CartOverlay } from '@/components/cart-overlay';
import { getProductsByTag, formatPrice, findVariantByOptions, type ShopifyProduct, type ShopifyVariant } from '@/lib/shopify-storefront';

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
  const [voiceCoil, setVoiceCoil] = useState<string>('');
  const [impedance, setImpedance] = useState<string>('');

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
        
        // Sort products by collection first (Concert, Sinfonia, Philharmonic), then by model number
        const sortedProducts = filteredProducts.sort((a, b) => {
          // Extract collection from title (e.g., "PM2A Concert (Upgrade)" -> "Concert")
          const extractCollection = (title: string): string => {
            if (title.toLowerCase().includes('concert')) return 'Concert';
            if (title.toLowerCase().includes('sinfonia')) return 'Sinfonia';
            if (title.toLowerCase().includes('philharmonic')) return 'Philharmonic';
            return 'Other';
          };
          
          // Extract model number from title (e.g., "PM2A Concert (Upgrade)" -> "PM2A")
          const extractModel = (title: string) => {
            const match = title.match(/(PM|DX|EX)(\d+)([A-Z]?)/);
            if (match) {
              const prefix = match[1];
              const number = parseInt(match[2]);
              const suffix = match[3] || '';
              return { prefix, number, suffix, full: prefix + number + suffix };
            }
            return { prefix: '', number: 999, suffix: '', full: title };
          };
          
          const collectionA = extractCollection(a.title);
          const collectionB = extractCollection(b.title);
          
          // Define collection order
          const collectionOrder: Record<string, number> = {
            'Concert': 1,
            'Sinfonia': 2,
            'Philharmonic': 3,
            'Other': 4,
          };
          
          // Sort by collection first
          const collectionOrderA = collectionOrder[collectionA] || 99;
          const collectionOrderB = collectionOrder[collectionB] || 99;
          
          if (collectionOrderA !== collectionOrderB) {
            return collectionOrderA - collectionOrderB;
          }
          
          // Within same collection, sort by model number
          const modelA = extractModel(a.title);
          const modelB = extractModel(b.title);
          
          // Sort by prefix (PM, DX, EX), then by number, then by suffix
          if (modelA.prefix !== modelB.prefix) {
            return modelA.prefix.localeCompare(modelB.prefix);
          }
          if (modelA.number !== modelB.number) {
            return modelA.number - modelB.number;
          }
          return modelA.suffix.localeCompare(modelB.suffix);
        });
        
        setUpgradeProducts(sortedProducts);
      } catch (error) {
        console.error('Error fetching upgrade products:', error);
      } finally {
        setLoading(false);
      }
    }
    
    fetchUpgradeProducts();
  }, [currency, region]);
  
  // Reset variant selections when upgrade product changes
  useEffect(() => {
    setVoiceCoil('');
    setImpedance('');
  }, [selectedUpgradeUnit]);

  // Get selected upgrade product
  const selectedUpgradeProduct = useMemo(() => {
    return upgradeProducts.find(p => p.id === selectedUpgradeUnit);
  }, [upgradeProducts, selectedUpgradeUnit]);
  
  // Get available options for selected product
  const { voiceCoilOptions, impedanceOptions } = useMemo(() => {
    if (!selectedUpgradeProduct || !selectedUpgradeProduct.variants.length) {
      return { voiceCoilOptions: [], impedanceOptions: [] };
    }
    
    const voiceCoilSet = new Set<string>();
    const impedanceSet = new Set<string>();
    
    // Debug: log all options to see what we're working with
    if (selectedUpgradeProduct.title.includes('DX2')) {
      console.log('DX2 Concert Upgrade variants:', selectedUpgradeProduct.variants.map(v => ({
        id: v.id,
        options: v.selectedOptions
      })));
    }
    
    selectedUpgradeProduct.variants.forEach(variant => {
      variant.selectedOptions.forEach(option => {
        const optionNameLower = option.name.toLowerCase().trim();
        const optionValueLower = option.value.toLowerCase().trim();
        const optionName = option.name.trim();
        const optionValue = option.value.trim();
        
        // Check for voice coil options (more flexible matching)
        if (
          optionNameLower.includes('voice') || 
          optionNameLower.includes('coil') ||
          optionValueLower.includes('silver') ||
          optionValueLower.includes('aluminium') ||
          optionValueLower.includes('aluminum')
        ) {
          voiceCoilSet.add(optionValue);
        }
        
        // Check for impedance options (more flexible matching)
        // Check option name first
        const isImpedanceOption = 
          optionNameLower === 'impedance' ||
          optionNameLower.includes('impedance') ||
          optionNameLower.includes('imped') ||
          optionNameLower.includes('ohm') ||
          optionName === 'Impedance' ||
          optionName === 'Ohms' ||
          optionName === 'Ohm';
        
        // Check if value looks like impedance (8, 15, 8 Ohms, 15 Ohms, 8Ω, etc.)
        const isImpedanceValue = 
          /^\d+\s*(ohm|ohms|ω|Ω|ωs)/i.test(optionValue) ||
          /^(8|15)(\s|$)/i.test(optionValue) ||
          optionValue === '8' ||
          optionValue === '15' ||
          optionValue === '8 Ohms' ||
          optionValue === '15 Ohms' ||
          optionValue === '8 Ohm' ||
          optionValue === '15 Ohm' ||
          optionValue === '8Ω' ||
          optionValue === '15Ω';
        
        if (isImpedanceOption || isImpedanceValue) {
          impedanceSet.add(optionValue);
        }
      });
    });
    
    return {
      voiceCoilOptions: Array.from(voiceCoilSet).sort(),
      impedanceOptions: Array.from(impedanceSet).sort((a, b) => {
        // Sort by numeric value if possible (8 Ohms before 15 Ohms)
        const numA = parseInt(a);
        const numB = parseInt(b);
        if (!isNaN(numA) && !isNaN(numB)) {
          return numA - numB;
        }
        return a.localeCompare(b);
      }),
    };
  }, [selectedUpgradeProduct]);
  
  // Get current variant based on selections
  const currentVariant = useMemo((): ShopifyVariant | undefined => {
    if (!selectedUpgradeProduct) {
      return undefined;
    }
    
    // If no variant options are required, return first variant
    if (voiceCoilOptions.length === 0 && impedanceOptions.length === 0) {
      return selectedUpgradeProduct.variants[0];
    }
    
    // Build options object only with selected values
    const options: Record<string, string> = {};
    if (voiceCoil) {
      options['Voice Coil'] = voiceCoil;
    }
    if (impedance) {
      options['Impedance'] = impedance;
    }
    
    // If we have options, try to find matching variant
    if (Object.keys(options).length > 0) {
      const variant = findVariantByOptions(selectedUpgradeProduct.variants, options);
      if (variant) {
        return variant;
      }
    }
    
    // Fallback to first variant if no match found
    return selectedUpgradeProduct.variants[0];
  }, [selectedUpgradeProduct, voiceCoil, impedance, voiceCoilOptions.length, impedanceOptions.length]);

  // Calculate total price and RRP
  const { totalPrice, rrpPrice } = useMemo(() => {
    if (!currentVariant) {
      return { totalPrice: null, rrpPrice: null };
    }
    
    const priceAmount = parseFloat(currentVariant.price.amount);
    const total = priceAmount * quantity;
    
    // Get RRP from compareAtPrice if available
    const rrp = currentVariant.compareAtPrice 
      ? parseFloat(currentVariant.compareAtPrice.amount) * quantity
      : null;
    
    return { totalPrice: total, rrpPrice: rrp };
  }, [currentVariant, quantity]);

  // Handle add to bag
  const handleAddToBag = async () => {
    if (!currentVariant) {
      alert('Please select all product options');
      return;
    }
    
    if (!currentVariant.availableForSale) {
      alert('This upgrade product is currently out of stock');
      return;
    }

    try {
      await addItem(currentVariant.id, quantity);
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
        <div className="space-y-4">
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
          
          {/* Voice Coil Selector */}
          {selectedUpgradeProduct && voiceCoilOptions.length > 0 && (
            <div>
              <label htmlFor="voice-coil" className="block text-sm font-medium text-gray-700 mb-2">
                Voice Coil *
              </label>
              <Select value={voiceCoil} onValueChange={setVoiceCoil}>
                <SelectTrigger id="voice-coil" className="w-full">
                  <SelectValue placeholder="Select voice coil" />
                </SelectTrigger>
                <SelectContent>
                  {voiceCoilOptions.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
          
          {/* Impedance Selector */}
          {selectedUpgradeProduct && impedanceOptions.length > 0 && (
            <div>
              <label htmlFor="impedance" className="block text-sm font-medium text-gray-700 mb-2">
                Impedance *
              </label>
              <Select value={impedance} onValueChange={setImpedance}>
                <SelectTrigger id="impedance" className="w-full">
                  <SelectValue placeholder="Select impedance" />
                </SelectTrigger>
                <SelectContent>
                  {impedanceOptions.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
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

            {totalPrice && currentVariant && (
              <div className="border border-gray-200 rounded-sm p-4 bg-gray-50">
                <div className="text-sm text-gray-600 mb-1">Total Price</div>
                <div className="flex items-center gap-3">
                  {rrpPrice && (
                    <div className="text-xl font-display text-gray-400 line-through">
                      {formatPrice(rrpPrice.toString(), currentVariant.price.currencyCode)}
                    </div>
                  )}
                  <div className="text-2xl font-display" style={{ color: '#c59862' }}>
                    {formatPrice(totalPrice.toString(), currentVariant.price.currencyCode)}
                  </div>
                </div>
              </div>
            )}

            <Button
              size="lg"
              className="w-full bg-black hover:bg-[#c59862] text-white font-sarabun text-xs tracking-[3px] transition-all duration-300 uppercase disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={handleAddToBag}
              disabled={
                !selectedUpgradeUnit || 
                !selectedCurrentUnit || 
                cartLoading || 
                loading ||
                (voiceCoilOptions.length > 0 && !voiceCoil) ||
                (impedanceOptions.length > 0 && !impedance) ||
                !currentVariant
              }
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

