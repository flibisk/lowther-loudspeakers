# 🎯 Shopify Integration Approach - Using Existing Overlays

## Current State (What You Already Have) ✅

You've already built beautiful product overlays with:
- ✅ Full-screen product detail modal
- ✅ Voice Coil selector (Aluminium/Silver)
- ✅ Impedance selector (8 Ohms/15 Ohms)
- ✅ Quantity input
- ✅ "ADD TO BAG" button
- ✅ Product images and specifications
- ✅ Price display

**Example**: PM2A Sinfonia page at `/collection/sinfonia`

---

## What We Need To Do (Integration Plan)

### Phase 1: Connect to Shopify API (Day 1)

#### 1.1 Install Shopify Packages
```bash
npm install @shopify/storefront-api-client
```

#### 1.2 Create Shopify Client
File: `src/lib/shopify-client.ts`

This will handle:
- Fetching products with currency conversion
- Creating checkouts
- Adding line items to cart
- Managing cart state

#### 1.3 Set Up Environment Variables
Add to `.env.local`:
```env
NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN=your-store.myshopify.com
NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN=shpat_your_token_here
```

---

### Phase 2: Update Product Data Fetching (Day 2)

#### 2.1 Replace Static Product Data
Currently in `src/app/collection/sinfonia/page.tsx`:
```typescript
const sinfoniaProducts = [
  {
    id: 'pm2a-sinfonia',
    title: 'PM2A Sinfonia',
    price: '£1,130',  // ← Static price
    ...
  },
];
```

Will become:
```typescript
// Fetch from Shopify with currency context
const sinfoniaProducts = await fetchShopifyProducts('sinfonia-collection', userCurrency);

// Returns:
{
  id: 'gid://shopify/Product/...',
  title: 'PM2A Sinfonia',
  price: {
    amount: '1130.00',
    currencyCode: 'GBP'  // or EUR, USD, etc. based on selection
  },
  variants: [
    { 
      id: 'gid://shopify/ProductVariant/...',
      title: 'Aluminium / 8 Ohms',
      price: { amount: '1130.00', currencyCode: 'GBP' }
    },
    { 
      id: 'gid://shopify/ProductVariant/...',
      title: 'Aluminium / 15 Ohms',
      price: { amount: '1130.00', currencyCode: 'GBP' }
    },
    {
      id: 'gid://shopify/ProductVariant/...',
      title: 'Silver / 8 Ohms',
      price: { amount: '1230.00', currencyCode: 'GBP' }  // Different price for silver
    },
    {
      id: 'gid://shopify/ProductVariant/...',
      title: 'Silver / 15 Ohms',
      price: { amount: '1230.00', currencyCode: 'GBP' }
    },
  ]
}
```

#### 2.2 Update Price Display Logic
Add dynamic pricing based on selected options:
```typescript
// Calculate price based on voice coil and impedance selection
const selectedVariant = product.variants.find(v => 
  v.options.some(o => o.name === 'Voice Coil' && o.value === selectedVoiceCoil) &&
  v.options.some(o => o.name === 'Impedance' && o.value === selectedImpedance)
);

const displayPrice = formatCurrency(selectedVariant.price.amount, selectedVariant.price.currencyCode);
```

#### 2.3 Show Price Changes in Real-Time
When user switches from Aluminium → Silver:
- Price updates instantly (e.g., £1,130 → £1,230)
- When user switches currency (EUR), both update (€1,310 → €1,425)

---

### Phase 3: Make "ADD TO BAG" Functional (Day 2-3)

#### 3.1 Update the Button Handler
Currently:
```typescript
<Button 
  className="w-full bg-black hover:bg-[#c59862] text-white ..."
>
  ADD TO BAG
</Button>
```

Will become:
```typescript
<Button 
  className="w-full bg-black hover:bg-[#c59862] text-white ..."
  onClick={() => handleAddToCart(selectedProduct, selectedVariant, quantity)}
  disabled={isAddingToCart}
>
  {isAddingToCart ? 'ADDING...' : 'ADD TO BAG'}
</Button>
```

#### 3.2 Implement Add to Cart Function
```typescript
const handleAddToCart = async (product, variant, quantity) => {
  setIsAddingToCart(true);
  
  try {
    // Add to Shopify cart via API
    await shopifyClient.cart.addLineItems({
      variantId: variant.id,
      quantity: quantity
    });
    
    // Update local cart state
    updateCartCount(cartCount + quantity);
    
    // Show success notification
    toast.success('Added to cart!');
    
    // Close product overlay
    closeProductDetail();
    
  } catch (error) {
    toast.error('Failed to add to cart');
  } finally {
    setIsAddingToCart(false);
  }
};
```

#### 3.3 Create Global Cart Context
File: `src/contexts/cart-context.tsx`

Manages:
- Cart item count
- Cart items
- Add/remove functions
- Checkout URL

---

### Phase 4: Update Header Cart Button (Day 3)

#### 4.1 Current State
File: `src/components/site-header.tsx`
```typescript
<Link href={process.env.NEXT_PUBLIC_SHOP_URL}>
  <svg className="h-5 w-5" ... >
    {/* Shopping bag icon */}
  </svg>
</Link>
```

#### 4.2 After Integration
```typescript
<button onClick={openCartDrawer} className="relative">
  <svg className="h-5 w-5" ... >
    {/* Shopping bag icon */}
  </svg>
  {/* Badge showing count */}
  {cartCount > 0 && (
    <span className="absolute -top-1 -right-1 bg-black text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
      {cartCount}
    </span>
  )}
</button>
```

---

### Phase 5: Create Cart Drawer (Day 3-4)

#### 5.1 Cart Drawer Component
File: `src/components/cart-drawer.tsx`

Slides in from right side when cart button clicked:

```
┌─────────────────────────────┐
│ Your Cart               [×] │
├─────────────────────────────┤
│                             │
│ [img] PM2A Sinfonia         │
│       Silver / 8 Ohms       │
│       £1,230 × 1            │
│       [−] 1 [+] [Remove]    │
│                             │
│ [img] DX3 Concert           │
│       Aluminium / 15 Ohms   │
│       €425 × 2              │
│       [−] 2 [+] [Remove]    │
│                             │
├─────────────────────────────┤
│ Subtotal:          €2,080   │
│ Estimated Shipping: €45     │
│ ─────────────────────────   │
│ Total:             €2,125   │
│                             │
│ [   PROCEED TO CHECKOUT   ] │
│                             │
│ 🔒 Secure Shopify Checkout  │
└─────────────────────────────┘
```

Features:
- Update quantity inline
- Remove items
- Shows selected variant options
- Displays prices in user's selected currency
- "Proceed to Checkout" → Redirects to Shopify

---

### Phase 6: Implement Shopify Variants (Day 2)

#### 6.1 Shopify Product Structure
In Shopify admin, set up each product with variants:

**Example: PM2A Sinfonia**
- **Option 1**: Voice Coil (Aluminium, Silver)
- **Option 2**: Impedance (8 Ohms, 15 Ohms)

This creates 4 variants:
1. Aluminium / 8 Ohms → £1,130
2. Aluminium / 15 Ohms → £1,130
3. Silver / 8 Ohms → £1,230
4. Silver / 15 Ohms → £1,230

#### 6.2 Map Shopify Variants to UI
When user clicks button in your overlay:
```typescript
// User selects: Silver voice coil
setVoiceCoil({ ...voiceCoil, [productId]: 'silver' });

// Find matching Shopify variant
const variant = product.variants.find(v => {
  const voiceCoilOption = v.selectedOptions.find(o => o.name === 'Voice Coil');
  const impedanceOption = v.selectedOptions.find(o => o.name === 'Impedance');
  
  return voiceCoilOption.value === 'Silver' && 
         impedanceOption.value === getImpedance(productId);
});

// Update displayed price
setDisplayPrice(variant.price);
```

---

### Phase 7: Currency Integration (Day 4)

#### 7.1 Connect Currency Selector to Shopify
File: `src/components/currency-selector.tsx`

**IMPORTANT**: Currency selector (not language selector) controls Shopify pricing!

- **Language Selector** = UI text only (English, French, German, etc.)
- **Currency Selector** = Shopify prices (GBP, USD, EUR, JPY, etc.)

When user changes currency:
```typescript
const handleCurrencyChange = (newCurrency: string, regionCode: string) => {
  // Update currency context
  setCurrency(newCurrency, regionCode);
  
  // Refetch all product prices in new currency from Shopify
  refetchProducts(regionCode);  // Uses regionCode (GB, US, EU, JP)
  
  // Update cart prices
  updateCartPrices(newCurrency);
};
```

#### 7.2 Shopify @inContext Directive
Query products with currency context:
```graphql
query getProducts($country: CountryCode) @inContext(country: $country) {
  products(first: 50) {
    edges {
      node {
        title
        variants(first: 10) {
          edges {
            node {
              title
              price {
                amount        # Auto-converted by Shopify!
                currencyCode  # Returns selected currency
              }
            }
          }
        }
      }
    }
  }
}
```

Shopify automatically converts:
- User selects EUR → All prices return in EUR
- User selects JPY → All prices return in JPY
- Conversion rates updated daily by Shopify

---

### Phase 8: Account & Wishlist (Day 4-5)

#### 8.1 Account Dropdown
Update header account button:
```typescript
<button onClick={toggleAccountMenu}>
  {isLoggedIn ? (
    <>
      <UserIcon />
      <AccountDropdown 
        user={currentUser}
        onLogout={handleLogout}
      />
    </>
  ) : (
    <LoginModal 
      isOpen={showLogin}
      onClose={() => setShowLogin(false)}
    />
  )}
</button>
```

#### 8.2 Wishlist / Heart Button
```typescript
<button 
  onClick={() => toggleWishlist(product.id)}
  className={isInWishlist(product.id) ? 'text-red-500' : 'text-gray-400'}
>
  <HeartIcon className={isInWishlist(product.id) ? 'fill-current' : ''} />
  {wishlistCount > 0 && <span>{wishlistCount}</span>}
</button>
```

---

## File Structure After Integration

```
src/
├── lib/
│   ├── shopify-client.ts          # NEW: Shopify API client
│   ├── shopify-cart.ts             # NEW: Cart management
│   └── shopify-types.ts            # NEW: TypeScript types
│
├── contexts/
│   ├── cart-context.tsx            # NEW: Global cart state
│   ├── currency-context.tsx        # EXISTS: Updated for Shopify
│   └── wishlist-context.tsx        # NEW: Wishlist state
│
├── components/
│   ├── cart-drawer.tsx             # NEW: Sliding cart panel
│   ├── cart-item.tsx               # NEW: Individual cart items
│   ├── login-modal.tsx             # NEW: Login/signup
│   ├── account-dropdown.tsx        # NEW: Account menu
│   └── site-header.tsx             # EXISTS: Updated cart button
│
└── app/
    └── collection/
        ├── sinfonia/page.tsx       # EXISTS: Connect to Shopify
        ├── concert/page.tsx        # EXISTS: Connect to Shopify
        └── philharmonic/page.tsx   # EXISTS: Connect to Shopify
```

---

## Integration Points - Checklist

### Collection Pages
- [ ] Fetch products from Shopify instead of static data
- [ ] Map Shopify variants to voice coil/impedance selectors
- [ ] Update price display dynamically
- [ ] Connect "ADD TO BAG" button to Shopify cart
- [ ] Show real-time currency conversion
- [ ] Display stock status from Shopify

### Header
- [ ] Update cart button with item count badge
- [ ] Open cart drawer instead of external link
- [ ] Add account dropdown menu
- [ ] Update wishlist/heart button
- [ ] Integrate with cart context

### Cart System
- [ ] Create cart drawer component
- [ ] Display cart items with variant details
- [ ] Allow quantity updates
- [ ] Allow item removal
- [ ] Show totals in selected currency
- [ ] "Checkout" button redirects to Shopify

### Currency Integration
- [ ] Connect selector to Shopify context
- [ ] Refetch prices on currency change
- [ ] Update all displayed prices
- [ ] Update cart prices
- [ ] Store user preference

### Account Features
- [ ] Login modal
- [ ] Signup modal
- [ ] Account dropdown
- [ ] Order history page
- [ ] Logout functionality

### Wishlist
- [ ] Heart button toggle
- [ ] Wishlist page
- [ ] Move to cart function
- [ ] Persistent storage

---

## What Stays The Same ✅

Your beautiful UI/UX:
- ✅ Product overlay design
- ✅ Animation transitions
- ✅ Color scheme
- ✅ Typography
- ✅ Layout
- ✅ Images
- ✅ Specifications display

We're only adding the **backend connectivity** - your frontend stays intact!

---

## What Changes

### Before:
```typescript
// Static data
const price = '£1,130';

// Dead button
<Button>ADD TO BAG</Button>
```

### After:
```typescript
// Live data from Shopify
const price = product.variants[selectedVariant].price;

// Functional button
<Button onClick={handleAddToCart}>ADD TO BAG</Button>
```

---

## Testing Plan

### Test 1: Product Display
1. Open Sinfonia Collection
2. Click "BUY NOW" on PM2A
3. Verify price loads from Shopify
4. Verify specifications display correctly

### Test 2: Variant Selection
1. Select "Silver" voice coil
2. Verify price updates (£1,130 → £1,230)
3. Select "15 Ohms"
4. Verify correct variant is selected

### Test 3: Currency Switching
1. Change currency to EUR
2. Verify all prices update to EUR
3. Verify cart updates to EUR
4. Change to JPY, verify updates

### Test 4: Add to Cart
1. Select product options
2. Set quantity to 2
3. Click "ADD TO BAG"
4. Verify cart badge shows "2"
5. Click cart icon
6. Verify cart drawer opens with correct item

### Test 5: Checkout Flow
1. Add multiple items to cart
2. Update quantities
3. Remove an item
4. Click "PROCEED TO CHECKOUT"
5. Verify redirect to Shopify checkout
6. Complete test purchase
7. Verify return to site

---

## Timeline

**Total: 5 days**

### Day 1 (4 hours)
- Install packages
- Create Shopify client
- Test API connection
- Fetch first product

### Day 2 (6 hours)
- Update collection pages to use Shopify data
- Implement variant selection logic
- Connect prices to currency selector
- Test product display

### Day 3 (6 hours)
- Implement "ADD TO BAG" functionality
- Create cart context
- Build cart drawer component
- Update header cart button

### Day 4 (4 hours)
- Add account functionality
- Implement wishlist
- Test currency switching
- Polish UI interactions

### Day 5 (4 hours)
- End-to-end testing
- Bug fixes
- Mobile optimization
- Documentation

---

## What You Need to Provide

Once you're ready:

1. **Shopify Store Domain**: `your-store.myshopify.com`
2. **Storefront API Token**: `shpat_...`
3. **Product-to-Handle Mapping**:
   ```
   PM2A Sinfonia → pm2a-sinfonia
   PM3A Sinfonia → pm3a-sinfonia
   DX3 Concert → dx3-concert
   ...
   ```
4. **Variant Pricing**:
   ```
   PM2A Sinfonia:
   - Aluminium (both impedances): £1,130
   - Silver (both impedances): £1,230
   ```

---

## Questions?

Ask me anything about:
- The integration approach
- Shopify variant setup
- Currency handling
- Cart implementation
- Testing procedures

**Ready to start?** Fill out `SHOPIFY_QUICKSTART.md` and send me the credentials! 🚀

