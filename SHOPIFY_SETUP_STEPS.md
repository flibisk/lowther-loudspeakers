# Shopify Headless Integration - Step-by-Step Guide

## 🎯 Overview
This guide will help you connect your existing Shopify store to the Lowther website, enabling:
- ✅ Real product data with live pricing in multiple currencies
- ✅ Working cart with Shopify checkout
- ✅ Customer accounts
- ✅ Wishlist/favorites functionality
- ✅ Currency selector integration with Shopify's multi-currency

---

## 📋 Phase 1: Shopify Store Setup (You Do This First)

### Step 1.1: Get Your Shopify Storefront API Credentials

1. **Log into your Shopify Admin** at `https://admin.shopify.com/store/[your-store-name]`

2. **Create a Custom App**:
   - Go to: `Settings` → `Apps and sales channels` → `Develop apps`
   - Click `Create an app`
   - Name it: `Lowther Website Integration`
   - Click `Create app`

3. **Configure Storefront API Permissions**:
   - Click `Configuration` tab
   - Under `Storefront API integration`, click `Configure`
   - Enable these scopes:
     - ✅ `unauthenticated_read_product_listings`
     - ✅ `unauthenticated_read_product_inventory`
     - ✅ `unauthenticated_read_product_tags`
     - ✅ `unauthenticated_read_selling_plans`
     - ✅ `unauthenticated_write_checkouts`
     - ✅ `unauthenticated_read_checkouts`
     - ✅ `unauthenticated_write_customers`
     - ✅ `unauthenticated_read_customer_tags`
   - Click `Save`

4. **Install the App**:
   - Click `API credentials` tab
   - Under `Storefront API access token`, click `Install app`
   - Copy your **Storefront API access token** (looks like: `shpat_abc123...`)
   - Copy your **API key** (looks like: `abc123def456...`)
   - **SAVE THESE SOMEWHERE SAFE** - you'll need them!

### Step 1.2: Set Up Shopify Markets (Multi-Currency)

1. **Enable Shopify Payments** (required for multi-currency):
   - Go to: `Settings` → `Payments`
   - Click `Activate Shopify Payments`
   - Complete the setup

2. **Configure Markets**:
   - Go to: `Settings` → `Markets`
   - Your primary market (UK) should already be set
   - Click `Add market` for each additional market:

   **Add these markets:**
   - 🇺🇸 United States (USD)
   - 🇪🇺 European Union (EUR)
   - 🇯🇵 Japan (JPY)
   - 🇦🇺 Australia (AUD)
   - 🇨🇦 Canada (CAD)
   - Plus any other regions you want to support

3. **Enable Multi-Currency**:
   - Under each market, ensure `Market-specific pricing` is enabled
   - Choose `Automatic pricing` (Shopify will auto-convert)
   - Or set custom prices per market if you prefer

### Step 1.3: Organize Your Products

For the integration to work smoothly, organize your products into collections:

1. **Create Collections** (if not already done):
   - Go to: `Products` → `Collections`
   - Create these collections:
     - `concert-collection` (DX3, DX4, DX5, DX6)
     - `sinfonia-collection` (DX2, EX2)
     - `philharmonic-collection` (PM4A, PM6A, PM6C, PM7A, Field Coil)
     - `grand-opera-collection` (Grand Opera speakers)
     - `ensemble` (PX4 Amplifier, Cables, Badges, etc.)
     - `drive-units` (All drive units)

2. **Set Product Handles**:
   - Click on each product
   - Scroll to `Search engine listing`
   - The **URL handle** should match your website's product URLs
   - Examples:
     - `dx3-concert` or `dx3`
     - `pm6a-philharmonic`
     - `px4-amplifier`
   
   **Share this list with me**: Product name → Handle mapping

3. **Add Product Metafields** (for additional data):
   - Go to: `Settings` → `Custom data` → `Products`
   - Add these metafield definitions:
     - `specifications` (Multi-line text)
     - `technical_details` (JSON)
     - `product_category` (Single line text)
   - This lets us store additional product info

### Step 1.4: Get Store Information

I need this information from you:

```
1. Store Domain: ___________________________
   (e.g., your-store.myshopify.com)

2. Storefront API Access Token: ___________________________
   (starts with shpat_)

3. API Key: ___________________________

4. Example Product Handles (pick 3):
   - ___________________________
   - ___________________________
   - ___________________________

5. Example Collection Handle (pick 1):
   - ___________________________
```

---

## 🔧 Phase 2: Website Integration (I Do This)

Once you provide the above information, I'll implement:

### Step 2.1: Install Required Packages
```bash
npm install @shopify/storefront-api-client graphql-request
```

### Step 2.2: Set Up Environment Variables
Add your credentials to `.env.local`:
```env
NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN=your-store.myshopify.com
NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN=shpat_your_token_here
SHOPIFY_ADMIN_ACCESS_TOKEN=shpat_admin_token_here
NEXT_PUBLIC_SHOP_URL=https://your-store.myshopify.com
```

### Step 2.3: Create Shopify Client
I'll create a robust Shopify client that:
- Fetches products with correct currency
- Handles cart operations
- Manages customer accounts
- Implements wishlist functionality

### Step 2.4: Update Product Pages
I'll connect your existing product pages to real Shopify data:
- Live pricing in selected currency
- Real-time inventory status
- Working "Buy Now" buttons

### Step 2.5: Implement Cart System
Create a full cart system with:
- Add to cart functionality
- Cart icon with item count
- Cart drawer/modal
- Checkout redirect to Shopify

### Step 2.6: Implement Account System
Set up customer accounts:
- Login/signup functionality
- Order history
- Saved addresses
- Account dashboard

### Step 2.7: Implement Wishlist
Add wishlist/favorites:
- Save products to wishlist
- Wishlist page
- Move from wishlist to cart

---

## 🎨 Phase 3: UI Components (I Do This)

### Step 3.1: Cart Components
```
- CartButton (header icon with count badge)
- CartDrawer (slide-out cart panel)
- CartItem (individual cart items)
- CheckoutButton (redirect to Shopify checkout)
```

### Step 3.2: Account Components
```
- LoginModal
- SignupModal
- AccountDropdown (in header)
- OrderHistory
- AccountSettings
```

### Step 3.3: Wishlist Components
```
- WishlistButton (heart icon)
- WishlistPage
- WishlistItem
```

---

## 🧪 Phase 4: Testing (We Do Together)

### Test Scenarios:

1. **Product Display**:
   - [ ] Products load from Shopify
   - [ ] Prices show in correct currency
   - [ ] Inventory status displays correctly

2. **Currency Switching**:
   - [ ] Switch to USD → prices update
   - [ ] Switch to EUR → prices update
   - [ ] Switch to JPY → prices update

3. **Cart Functionality**:
   - [ ] Add product to cart
   - [ ] Update quantity
   - [ ] Remove from cart
   - [ ] Cart persists on page reload

4. **Checkout Flow**:
   - [ ] Click checkout → redirects to Shopify
   - [ ] Complete purchase
   - [ ] Return to website after purchase

5. **Account Features**:
   - [ ] Create account
   - [ ] Login
   - [ ] View order history
   - [ ] Logout

6. **Wishlist**:
   - [ ] Add to wishlist
   - [ ] View wishlist
   - [ ] Remove from wishlist
   - [ ] Move to cart from wishlist

---

## 🚀 Phase 5: Going Live

### Pre-Launch Checklist:

- [ ] All products added to Shopify
- [ ] Collections properly organized
- [ ] Pricing correct in all currencies
- [ ] Shipping rates configured
- [ ] Tax settings configured
- [ ] Payment gateway tested
- [ ] Checkout customization completed
- [ ] Order confirmation emails tested
- [ ] Mobile responsiveness verified

### Launch Steps:

1. **Soft Launch**: Enable for test users
2. **Monitor**: Watch for any issues
3. **Full Launch**: Open to all visitors
4. **Post-Launch**: Monitor analytics and conversions

---

## 📊 Architecture Overview

```
Website (lowtherloudspeakers.com)
    ↓
Currency Context (user's selection)
    ↓
Shopify Storefront API
    ↓
Query products with @inContext(country: CountryCode)
    ↓
Receive products with prices in correct currency
    ↓
Display on website
    ↓
User clicks "Buy Now"
    ↓
Add to Shopify Cart (via API)
    ↓
User clicks "Checkout"
    ↓
Redirect to Shopify Checkout
    ↓
Complete purchase
    ↓
Return to website confirmation page
```

---

## 🔑 Key Features

### 1. Multi-Currency Support
- User selects currency from dropdown
- All prices automatically convert
- Checkout processes in selected currency
- No manual conversion needed

### 2. Real-Time Inventory
- Shows "In Stock" / "Out of Stock"
- Low stock warnings
- Back-in-stock notifications

### 3. Seamless Checkout
- Cart managed on your website
- Checkout happens on Shopify (secure)
- User returns to your site after purchase
- Order confirmation page on your site

### 4. Customer Accounts
- Save shipping addresses
- View order history
- Track shipments
- Reorder previous purchases

### 5. Wishlist/Favorites
- Save products for later
- Share wishlist with others
- Email reminders
- Price drop notifications

---

## 💰 Pricing Structure Example

Set prices in GBP (your base currency), Shopify auto-converts:

| Product | GBP | USD | EUR | JPY | AUD | CAD |
|---------|-----|-----|-----|-----|-----|-----|
| DX3 | £350 | $445 | €410 | ¥65,000 | $685 | $610 |
| PM6A | £1,200 | $1,525 | €1,405 | ¥223,000 | $2,350 | $2,090 |
| PX4 Amp | £2,500 | $3,180 | €2,930 | ¥465,000 | $4,900 | $4,360 |

Shopify handles all conversions automatically based on current exchange rates.

---

## 🆘 Troubleshooting

### Issue: Products not showing
- **Check**: Storefront API token is correct
- **Check**: Products are published to "Online Store" channel
- **Check**: Products are in stock

### Issue: Prices wrong currency
- **Check**: Currency context is properly set
- **Check**: @inContext directive is used in GraphQL query
- **Check**: Markets are properly configured

### Issue: Cart not working
- **Check**: Checkout API scope is enabled
- **Check**: Browser cookies are enabled
- **Check**: CORS settings in Shopify

### Issue: Checkout fails
- **Check**: Shopify Payments is enabled
- **Check**: Payment methods are configured
- **Check**: Shipping rates are set up

---

## 📞 Next Steps

**Ready to proceed?** Provide me with:

1. ✅ Your Shopify store domain
2. ✅ Storefront API access token
3. ✅ List of product handles
4. ✅ List of collection handles

Once I have these, I can start implementing immediately!

---

## 📝 Notes

- **Development Time**: Approximately 3-5 days for full implementation
- **Testing Phase**: 1-2 days
- **Total Timeline**: 1 week to fully functional e-commerce

**Questions?** Ask me anything about the technical implementation or Shopify setup!

