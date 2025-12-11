# Abandoned Cart Email System

Three-step abandoned cart email flow for Lowther Loudspeakers Shopify store.

## Email Template Signatures

### 1. `buildQueueEmail(cartUrl: string, cartItems: CartItem[]): string`
**Email 1 - Sent at +1 day after detection**

- **Focus**: Build queue reservation
- **Key Message**: Place reserved in build queue for 7 days
- **Content**: 
  - Build queue notice explaining 7-day reservation
  - Complete list of all cart items with images
  - Cart link at top and bottom
  - Total price display
- **Call to Action**: "Complete Your Purchase"

### 2. `buildNarrativeEmail(narratives: ProductNarrative[], cartUrl: string, cartItems: CartItem[]): string`
**Email 2 - Sent at +3 days after detection**

- **Focus**: Product stories and narratives
- **Key Message**: Why we make what we make and what they sound like
- **Content**:
  - Product narratives for each matching cart item:
    - `rangePosition`: Where the product sits in our range
    - `soundCharacter`: What it sounds like
    - `cabinetMatches`: What cabinets it works with
  - Brief reminder about 7-day build queue reservation
  - Cart link at top and bottom
  - List of items in cart
- **Call to Action**: "Complete Your Purchase"

### 3. `buildFinalCallEmail(cartUrl: string, cartItems: CartItem[]): string`
**Email 3 - Sent at +6 days after detection**

- **Focus**: Final warning about build queue slot
- **Key Messages**:
  - We handmake everything to order
  - Build queue slot will be released tomorrow
  - Cart will still be waiting when they come back
- **Content**:
  - Warning notice about slot expiration
  - Reassurance that cart remains available
  - Complete list of cart items with images
  - Cart link at top and bottom
  - Total price display
- **Call to Action**: "Complete Your Purchase Now"

## State Machine Logic (cron-handler.ts)

### State Structure
```typescript
interface CheckoutState {
  checkoutId: string;
  email: string;
  cartItems: CartItem[];
  cartUrl: string;
  detectionTime: number;        // When checkout first detected as abandoned
  email1Sent?: boolean;          // Email 1 sent flag
  email1SentTime?: number;      // When Email 1 was sent
  email2Sent?: boolean;          // Email 2 sent flag
  email2SentTime?: number;      // When Email 2 was sent
  email3Sent?: boolean;          // Email 3 sent flag
  email3SentTime?: number;       // When Email 3 was sent
  completed?: boolean;            // Checkout converted to order
}
```

### State Transitions

1. **Initial Detection** (First time checkout is detected as abandoned)
   - Create new `CheckoutState`
   - Set `detectionTime` to current timestamp
   - Store state
   - **No email sent** (wait for 24 hours)

2. **Email 1 Trigger** (24 hours after detection)
   - Condition: `timeSinceDetection >= ONE_DAY && !email1Sent`
   - Action: Send `buildQueueEmail`
   - Update: Set `email1Sent = true`, `email1SentTime = now`

3. **Email 2 Trigger** (3 days after detection)
   - Condition: `timeSinceDetection >= THREE_DAYS && email1Sent && !email2Sent`
   - Action: Send `buildNarrativeEmail` (with matched narratives)
   - Update: Set `email2Sent = true`, `email2SentTime = now`

4. **Email 3 Trigger** (6 days after detection)
   - Condition: `timeSinceDetection >= SIX_DAYS && email2Sent && !email3Sent`
   - Action: Send `buildFinalCallEmail`
   - Update: Set `email3Sent = true`, `email3SentTime = now`

5. **Completion** (Checkout converts to order)
   - Action: Call `markCheckoutComplete(checkoutId)`
   - Update: Set `completed = true`
   - **Stop sending further emails**

### Timeline Summary

```
Detection Time (T=0)
  ↓
  [Wait 24 hours]
  ↓
T+1 day: Email 1 (Build Queue)
  ↓
  [Wait 2 more days]
  ↓
T+3 days: Email 2 (Product Narratives)
  ↓
  [Wait 3 more days]
  ↓
T+6 days: Email 3 (Final Call)
  ↓
T+7 days: Build queue slot expires (but cart remains)
```

### Key Behaviors

- **Sequential**: Each email requires the previous one to be sent
- **Idempotent**: State flags prevent duplicate emails
- **Non-blocking**: If an email fails to send, state is not updated and it will retry on next cron run
- **Completion-aware**: Completed checkouts are skipped entirely
- **State persistence**: All state changes are saved via `setCheckoutState()`

## Placeholder Functions (To Be Implemented)

1. `getCheckoutState(checkoutId: string)` - Fetch state from storage
2. `setCheckoutState(checkoutId: string, state: CheckoutState)` - Save state to storage
3. `markCheckoutComplete(checkoutId: string)` - Mark checkout as completed
4. `fetchAbandonedCheckoutsFromShopify()` - Fetch abandoned checkouts from Shopify API

## Requirements Met

✅ Three-step email flow (1 day, 3 days, 6 days)  
✅ Build queue focus in Email 1 (7-day reservation)  
✅ Product narratives in Email 2  
✅ Final warning in Email 3  
✅ Cart links at top and bottom of all emails  
✅ Mobile-friendly HTML with inline CSS  
✅ No discount codes  
✅ No dynamic pricing logic  
✅ TypeScript only  
✅ State machine prevents duplicate sends  
✅ Completion detection stops further emails  

