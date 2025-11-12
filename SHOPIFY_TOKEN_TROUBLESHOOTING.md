# Shopify 401 Unauthorized - Detailed Fix

You're getting a **401 Unauthorized** error, which means Shopify is rejecting the API token. Let's fix this step-by-step.

---

## 🔍 Most Common Issues:

### Issue 1: Using Admin API Token Instead of Storefront API Token
**Symptom**: Getting 401 even though you copied a token  
**Solution**: Make sure you're using the **Storefront API** token, not Admin API

### Issue 2: App Not Installed
**Symptom**: Token created but not working  
**Solution**: You must click "Install app" after creating it

### Issue 3: Products Not Published to Sales Channel
**Symptom**: 401 errors when trying to fetch products  
**Solution**: Products must be published to the sales channel

---

## ✅ Complete Step-by-Step Fix

### Step 1: Go to Shopify Admin
URL: `https://9f9944-a3.myshopify.com/admin`

---

### Step 2: Create/Update Custom App

#### A. Navigate to App Settings
1. Click **Settings** (bottom left of sidebar)
2. Click **Apps and sales channels**
3. Click **Develop apps** (button in top right)
4. If you see an existing app (like "Lowther Headless Storefront"), click on it
5. Otherwise, click **Create an app**

#### B. If Creating New App:
- App name: `Lowther Headless Storefront`
- App developer: (your email)
- Click **Create app**

---

### Step 3: Configure Storefront API Scopes

1. Click on **Configuration** tab
2. Scroll to **Storefront API integration**
3. Click **Configure**

4. **Enable these scopes** (scroll through and check these):
   - ✅ `unauthenticated_read_product_listings`
   - ✅ `unauthenticated_read_product_inventory`
   - ✅ `unauthenticated_read_product_pickup_locations`
   - ✅ `unauthenticated_read_checkouts`
   - ✅ `unauthenticated_write_checkouts`
   - ✅ `unauthenticated_read_customers`
   - ✅ `unauthenticated_write_customers`

5. Click **Save** (bottom of page)

---

### Step 4: Install the App

**This is critical! The app won't work until installed.**

1. After saving scopes, you should see a button: **Install app**
2. Click **Install app**
3. Confirm the installation

**If you don't see "Install app":**
- Go to the **API credentials** tab
- Look at the top of the page - there should be a banner prompting you to install
- OR go back to the app list and click your app, then look for the install button

---

### Step 5: Get the Storefront API Access Token

1. After installation, click the **API credentials** tab
2. Scroll down to **Storefront API access token** section
3. You should see a token that starts with `shpat_`
4. Click **Copy** or manually select and copy the entire token

**Important**: 
- Do NOT use the "Admin API access token" (even though it also starts with `shpat_`)
- Make sure you're copying from the **"Storefront API access token"** section

---

### Step 6: Update `.env.local`

Open your `.env.local` file and update:

```env
NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN=9f9944-a3.myshopify.com
NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN=shpat_xxxxxxxxxxxxxxxxxxxxxxxxxxxxx
NEXT_PUBLIC_SHOP_URL=https://9f9944-a3.myshopify.com
```

**Double-check**:
- No extra spaces before or after the token
- No quotes around the values
- The domain doesn't have `https://` in the `SHOPIFY_STORE_DOMAIN` variable
- The token is the full string (usually 32-40 characters after `shpat_`)

---

### Step 7: Publish Products to Sales Channel

Products must be published to the sales channel for the Storefront API to access them.

1. Go to **Products** in Shopify Admin
2. Click on a product (e.g., PM2A Sinfonia)
3. Scroll to the right sidebar
4. Look for **Sales channels and apps** section
5. Make sure your custom app is listed and checked
6. If not, click **Manage** and enable your custom app
7. Click **Save**
8. Repeat for all products you want to sell

**Quick way to publish multiple products:**
1. Go to **Products** list
2. Select all products (checkbox at top)
3. Click **More actions** → **Manage sales channels**
4. Enable your custom app for all products

---

### Step 8: Test Again

After completing all steps above, run:

```bash
npm run test:shopify
```

---

## 🔍 Still Getting 401?

### Check Token Format
Your token in `.env.local` should look like:
```
shpat_1234567890abcdefghijklmnopqrstuv
```

### Verify App is Installed
1. Go to **Settings → Apps and sales channels**
2. Click **Develop apps**
3. Your app should show **Status: Installed**
4. If it says "Not installed", click the app and find the Install button

### Check Sales Channel Access
1. Go to **Products**
2. Open any product
3. Right sidebar → **Sales channels and apps**
4. Your custom app must be listed there

### Verify Scopes
1. Open your custom app
2. Go to **Configuration** tab
3. Under **Storefront API integration**, verify the scopes are saved
4. If you changed scopes after installing, you may need to **reinstall the app**

---

## 🆘 Alternative: Try with a Test Product

Let's create a simple test product to verify the connection:

1. Go to **Products → Add product**
2. Title: `Test Product`
3. Price: `100.00`
4. Click **Save**
5. Make sure it's published to your custom app sales channel
6. Note the product handle (usually `test-product`)

Then I can update the test script to try fetching this specific product.

---

## 📸 Need Visual Help?

If you're still stuck, take screenshots of:
1. The **API credentials** tab (showing both Admin and Storefront tokens - blur the actual tokens)
2. The **Configuration** tab showing Storefront API scopes
3. The app list showing installation status
4. A product's sales channels section

Share those and I'll help identify the issue!

---

## ⚡ Quick Checklist

- [ ] Custom app created
- [ ] Storefront API scopes configured (at least `unauthenticated_read_product_listings`)
- [ ] App is **installed** (not just created)
- [ ] Copied token from "Storefront API access token" section (not Admin API)
- [ ] Token pasted in `.env.local` with `NEXT_PUBLIC_` prefix
- [ ] No extra spaces or quotes in `.env.local`
- [ ] Products published to the custom app sales channel
- [ ] Tested after all steps completed

Once all these are checked, the test should work!

