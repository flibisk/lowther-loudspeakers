# Fix Shopify Storefront API Token

Your connection test shows **401 Unauthorized**, which means the token needs to be updated.

## What You Need: Storefront API Token (NOT Admin API)

The **Storefront API** is public-safe and designed for headless storefronts.

---

## Step-by-Step: Get the Correct Token

### 1. Log into Shopify Admin
Go to: `https://9f9944-a3.myshopify.com/admin`

### 2. Navigate to Settings → Apps and sales channels
- Click **Settings** (bottom left)
- Click **Apps and sales channels**
- Click **Develop apps** (top right)

### 3. Create a Custom App (if you haven't already)
- Click **Create an app**
- Name it: `Lowther Headless Storefront`
- Click **Create app**

### 4. Configure API Scopes for Storefront API
- Click **Configure Storefront API scopes**
- Enable these scopes (minimum required):
  - ✅ `unauthenticated_read_product_listings`
  - ✅ `unauthenticated_read_product_inventory`
  - ✅ `unauthenticated_read_product_pickup_locations`
  - ✅ `unauthenticated_read_checkouts`
  - ✅ `unauthenticated_write_checkouts`
  - ✅ `unauthenticated_read_customers`
  - ✅ `unauthenticated_write_customers` (for wishlist/favorites)

- Click **Save**

### 5. Install the App
- Click **Install app** button
- Confirm installation

### 6. Get the Storefront API Access Token
- After installation, you'll see the **API credentials**
- Look for: **Storefront API access token**
- It will look like: `shpat_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`
- Copy this token

### 7. Update Your `.env.local`
Replace the existing token with the new one:

```env
NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN=9f9944-a3.myshopify.com
NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN=shpat_your_new_token_here
NEXT_PUBLIC_SHOP_URL=https://9f9944-a3.myshopify.com
```

---

## Test Again

After updating `.env.local`, run:

```bash
npm run test:shopify
```

You should see a successful connection!

---

## ⚠️ Important Notes

1. **Use Storefront API token** (starts with `shpat_`)
   - NOT Admin API token (also starts with `shpat_` but different permissions)
   - The Storefront API token is from the "Storefront API access token" section

2. **The token is public-safe**
   - It's designed to be used in browser
   - That's why we use `NEXT_PUBLIC_` prefix

3. **Keep your Admin API token separate**
   - Never use Admin API tokens in browser code
   - Admin tokens should NOT have `NEXT_PUBLIC_` prefix

---

## Still Having Issues?

If you still get 401 errors:
1. Make sure you clicked "Install app" after configuring scopes
2. Make sure you're using the **Storefront API access token** (not Admin API)
3. Double-check there are no extra spaces in your `.env.local`
4. Restart any running dev servers after updating `.env.local`

Let me know once you've updated the token and I'll help you test the connection!

