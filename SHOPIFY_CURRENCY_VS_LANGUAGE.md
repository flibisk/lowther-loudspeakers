# Currency vs Language - How They Work Together

## Important: Language ≠ Currency

You have **two independent selectors**:

### 1. Language Selector 🌍
**Purpose**: Changes UI text only
**Examples**:
- English → "Add to Bag"
- French → "Ajouter au panier"
- German → "In den Warenkorb"
- Japanese → "カートに入れる"

**Does NOT affect**:
- ❌ Product prices
- ❌ Shopify queries
- ❌ Currency symbols

### 2. Currency Selector 💰
**Purpose**: Changes prices and talks to Shopify
**Examples**:
- GBP → £1,130
- USD → $1,445
- EUR → €1,310
- JPY → ¥215,000

**Controls**:
- ✅ All product prices
- ✅ Shopify API queries
- ✅ Cart totals
- ✅ Checkout currency

---

## How They Work Independently

### Example 1: French User Buying in USD
```
Language: 🇫🇷 French
Currency: 🇺🇸 USD $

Result:
- UI shows: "Ajouter au panier" (French)
- Price shows: $1,445 (USD)
- Checkout: Processes in USD
```

### Example 2: English User Buying in EUR
```
Language: 🇬🇧 English
Currency: 🇪🇺 EUR €

Result:
- UI shows: "Add to Bag" (English)
- Price shows: €1,310 (EUR)
- Checkout: Processes in EUR
```

### Example 3: Japanese User in Japanese Yen
```
Language: 🇯🇵 Japanese
Currency: 🇯🇵 JPY ¥

Result:
- UI shows: "カートに入れる" (Japanese)
- Price shows: ¥215,000 (JPY)
- Checkout: Processes in JPY
```

---

## Technical Implementation

### Language Selector (Existing)
File: `src/components/language-selector-simple.tsx`

```typescript
const handleLanguageChange = (newLanguage: string) => {
  // Only updates UI translations
  setLanguage(newLanguage);
  
  // Does NOT trigger Shopify API calls
  // Does NOT change prices
};
```

### Currency Selector (Connects to Shopify)
File: `src/components/currency-selector.tsx`

```typescript
const handleCurrencyChange = (newCurrency: string, regionCode: string) => {
  // Updates currency context
  setCurrency(newCurrency);
  
  // Triggers Shopify API call with new currency
  refetchShopifyProducts(regionCode);
  
  // Updates all displayed prices
  // Example: £1,130 → €1,310
};
```

---

## Shopify Integration - Currency Only

### How Currency Selector Talks to Shopify

When user selects a currency:

```typescript
// User selects: EUR (Eurozone)
onCurrencyChange('EUR', 'EU');

↓

// Shopify API Query
query getProducts($country: CountryCode) 
  @inContext(country: $country) {  // country: EU
  products(first: 50) {
    edges {
      node {
        title
        variants {
          price {
            amount        // Returns: "1310.00"
            currencyCode  // Returns: "EUR"
          }
        }
      }
    }
  }
}

↓

// Display on website
PM2A Sinfonia: €1,310
DX3 Concert: €425
```

### Currency to Country Code Mapping

The currency selector sends the country/region code to Shopify:

```typescript
const currencyToCountryMap = {
  'GBP': 'GB',  // United Kingdom
  'USD': 'US',  // United States
  'EUR': 'EU',  // Eurozone
  'JPY': 'JP',  // Japan
  'AUD': 'AU',  // Australia
  'CAD': 'CA',  // Canada
  'CNY': 'CN',  // China
  'INR': 'IN',  // India
  // ... all 54 currencies
};

// When user selects EUR:
const countryCode = currencyToCountryMap['EUR']; // 'EU'
fetchShopifyProducts(countryCode);
```

---

## Auto-Detection (Optional Feature)

You can optionally auto-detect on first visit:

### Option A: Detect Both Independently
```typescript
// On page load
const detectedLanguage = navigator.language; // 'fr-FR'
const detectedCountry = await getGeoLocation(); // 'FR'

// Set language based on browser
setLanguage('fr'); // French UI

// Set currency based on location
setCurrency('EUR'); // Euro prices
```

### Option B: Let User Choose Everything
```typescript
// Default to English and GBP
setLanguage('en');
setCurrency('GBP');

// User can override both independently
```

---

## Example Scenarios

### Scenario 1: American in France
```
User: American tourist in Paris
Browser Language: English (en-US)
Location: France

Auto-detected:
- Language: English (browser preference)
- Currency: EUR (location-based)

User sees:
- "Add to Bag" (English)
- €1,310 (Euro)
```

### Scenario 2: French Speaker in UK
```
User: French person living in London
Browser Language: French (fr-FR)
Location: United Kingdom

Auto-detected:
- Language: French (browser preference)
- Currency: GBP (location-based)

User sees:
- "Ajouter au panier" (French)
- £1,130 (Pounds)
```

### Scenario 3: Japanese Audiophile
```
User: Japanese collector
Browser Language: Japanese (ja-JP)
Location: Japan

Auto-detected:
- Language: Japanese (browser preference)
- Currency: JPY (location-based)

User sees:
- "カートに入れる" (Japanese)
- ¥215,000 (Yen)
```

---

## User Can Override

Both selectors are always available:

```
┌─────────────────────────────────────┐
│                                     │
│  🌍 Language: French  ▼             │
│  💰 Currency: USD $   ▼             │
│                                     │
│  Result:                            │
│  "Ajouter au panier" button         │
│  Price: $1,445                      │
│                                     │
└─────────────────────────────────────┘
```

User can mix and match any combination:
- Japanese language + GBP currency ✅
- English language + JPY currency ✅
- French language + USD currency ✅
- German language + EUR currency ✅

---

## Implementation Checklist

### Currency Selector Updates
- [x] Already has 54 currencies
- [x] Already has search functionality
- [ ] Connect to Shopify context
- [ ] Trigger API refetch on change
- [ ] Store user preference (localStorage)

### Language Selector
- [x] Already implemented
- [x] Switches UI text
- [x] Independent from currency
- [ ] No changes needed for Shopify

### Product Pages
- [ ] Use currency context (not language) for Shopify queries
- [ ] Display prices from Shopify response
- [ ] Update when currency changes
- [ ] Keep language for UI text only

---

## Code Example: Separating Concerns

```typescript
import { useCurrency } from '@/contexts/currency-context';
import { useTranslation } from '@/hooks/use-translations';

function ProductOverlay({ product }) {
  // Currency context - affects Shopify
  const { currency, formatPrice } = useCurrency();
  
  // Language context - affects UI only
  const { t } = useTranslation();
  
  // Fetch product with currency context
  const { data: shopifyProduct } = useShopifyProduct(
    product.handle,
    currency  // Uses currency, not language!
  );
  
  return (
    <div>
      <h2>{product.title}</h2>
      
      {/* Price from Shopify (currency-dependent) */}
      <p className="price">
        {formatPrice(shopifyProduct.price.amount, shopifyProduct.price.currencyCode)}
      </p>
      
      {/* Button text (language-dependent) */}
      <button>
        {t('addToBag')}  {/* "Add to Bag" or "Ajouter au panier" */}
      </button>
    </div>
  );
}
```

---

## Summary

### Language Selector
- **Changes**: UI text, labels, buttons
- **Does NOT change**: Prices, Shopify queries
- **File**: `language-selector-simple.tsx`
- **Context**: `i18n` or `translation`

### Currency Selector
- **Changes**: All prices, Shopify queries, checkout currency
- **Does NOT change**: UI text
- **File**: `currency-selector.tsx`
- **Context**: `currency-context.tsx`
- **Talks to**: Shopify API

### They Work Together
```
Currency Selector → Shopify → Prices
        +
Language Selector → Translations → UI Text
        ↓
Perfect Experience
```

---

## Important for Shopify Setup

When setting up products in Shopify:

1. **Add markets for currencies** (Settings → Markets)
   - United Kingdom (GBP)
   - United States (USD)
   - Eurozone (EUR)
   - Japan (JPY)
   - ... all your supported currencies

2. **DO NOT tie markets to languages**
   - Markets = Currency/Region
   - Languages = UI translation only

3. **Set base prices in GBP**
   - Shopify auto-converts to other currencies
   - Or set custom prices per market

4. **Test with currency selector**
   - Change currency → Prices update
   - Change language → Only text updates

---

## Questions?

**Q: Can a French user buy in GBP?**
A: Yes! Language = French (UI), Currency = GBP (price/checkout)

**Q: Should currency auto-detect location?**
A: Optional. You can auto-detect or default to GBP.

**Q: What if someone wants French + USD?**
A: Perfectly fine! They're independent selectors.

**Q: Does Shopify handle the conversion?**
A: Yes! Shopify converts based on the currency/country code you send.

**Q: Do I need to translate product descriptions?**
A: Optional. You can have multilingual descriptions in Shopify or keep English only.

---

Ready to integrate? The currency selector is the one that will talk to Shopify! 💰

