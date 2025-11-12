# Direct Method: Create Custom App for API Credentials

## Step 1: Make Sure You're Logged into YOUR STORE (Not Shopify Partners)

1. Open a **private/incognito browser window**
2. Go to: `https://9f9944-a3.myshopify.com/admin`
3. Log in with your store credentials (not Shopify Partners)

## Step 2: Go Directly to Custom Apps Page

Once logged in, copy and paste this EXACT URL:

```
https://9f9944-a3.myshopify.com/admin/settings/apps/development
```

Press Enter.

## Step 3: You Should See One of These:

### Option A: "Allow custom app development" button
- Click it
- Confirm
- Then click "Create an app"

### Option B: "Create an app" button
- Click it directly

### Option C: You see existing apps
- Click "Create an app"

## Step 4: Fill Out the Form

- **App name:** Lowther Storefront
- **App developer:** (your email - it will auto-suggest)
- Click **Create app**

## Step 5: You'll Be in the App Page

You should now see tabs:
- Overview
- Configuration
- API credentials

## Step 6: Configure Storefront API

1. Click **Configuration** tab
2. Find **"Storefront API integration"** section
3. Click **Configure**
4. Check these boxes:
   - ☑️ `unauthenticated_read_product_listings`
   - ☑️ `unauthenticated_read_checkouts`  
   - ☑️ `unauthenticated_write_checkouts`
5. Click **Save**

## Step 7: Install the App

You should see a banner or button at the top:
- **"Install app"**
- Click it
- Click **Install** on the confirmation dialog

**Important:** You should NOT see "choose a store" at this point. If you do, you're in the wrong place (Shopify Partners instead of your store admin).

## Step 8: Get Your Token

1. Click **API credentials** tab
2. Scroll to **Storefront API access token**
3. Click **Reveal token once**
4. Copy the token (starts with `shpat_`)

## Step 9: Update .env.local

Use that token in your `.env.local`:

```
NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN=9f9944-a3.myshopify.com
NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN=shpat_[your_new_token]
NEXT_PUBLIC_SHOP_URL=https://9f9944-a3.myshopify.com
```

---

## 🔍 Troubleshooting:

### If you see "Choose a store" dialog:
You're in Shopify Partners, not your store admin. 
- Close that window
- Open a new private/incognito window
- Go directly to `https://9f9944-a3.myshopify.com/admin`
- Then go to the apps URL above

### If you don't see "Create an app":
1. Make sure you're at: `https://9f9944-a3.myshopify.com/admin/settings/apps/development`
2. Look for "App development is disabled" message
3. Click "Allow custom app development"
4. Then "Create an app" will appear

### If "Install app" doesn't work:
1. Make sure you saved the API scopes in Configuration
2. Refresh the page
3. The "Install app" button should be at the top of the page
4. If not, check the Overview tab for an install button

---

Try this exact process and let me know at which step you get stuck!

