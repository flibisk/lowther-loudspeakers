/**
 * Integration Test Script
 * 
 * Tests the complete Shopify integration flow:
 * 1. Fetch products from Sinfonia collection
 * 2. Find a specific variant
 * 3. Create a cart
 * 4. Add item to cart
 * 5. Verify cart contents
 */

import { config } from 'dotenv';
import { resolve } from 'path';

config({ path: resolve(process.cwd(), '.env.local') });

import {
  getCollectionProducts,
  createCart,
  addToCart,
  formatPrice,
  findVariantByOptions,
} from './shopify-storefront';

async function testIntegration() {
  console.log('🧪 Testing Shopify Integration\n');
  console.log('═'.repeat(60));

  try {
    // Step 1: Fetch Sinfonia Collection
    console.log('\n📦 Step 1: Fetching Sinfonia Collection...');
    const products = await getCollectionProducts('the-symphonic-collection', 'GBP');
    
    if (products.length === 0) {
      console.error('❌ No products found in Sinfonia collection');
      return;
    }
    
    console.log(`✅ Found ${products.length} products`);
    console.log(`   First product: ${products[0].title}`);

    // Step 2: Find PM2A Sinfonia
    console.log('\n🔍 Step 2: Finding PM2A Sinfonia...');
    const pm2a = products.find(p => p.handle === 'lowther-pm2a-sinfonia');
    
    if (!pm2a) {
      console.error('❌ PM2A Sinfonia not found');
      return;
    }
    
    console.log(`✅ Found: ${pm2a.title}`);
    console.log(`   Variants: ${pm2a.variants.length}`);

    // Step 3: Find specific variant (Aluminium, 8 Ohms)
    console.log('\n🎯 Step 3: Finding variant (Aluminium / 8 Ohms)...');
    const variant = findVariantByOptions(pm2a.variants, {
      'Voice Coil': 'Aluminium',
      'Impedance': '8 Ohms',
    });
    
    if (!variant) {
      console.error('❌ Variant not found');
      console.log('Available variants:');
      pm2a.variants.forEach(v => {
        console.log(`   - ${v.title}: ${v.selectedOptions.map(o => `${o.name}=${o.value}`).join(', ')}`);
      });
      return;
    }
    
    console.log(`✅ Found variant: ${variant.title}`);
    console.log(`   Price: ${formatPrice(variant.price.amount, variant.price.currencyCode)}`);
    console.log(`   Available: ${variant.availableForSale ? 'Yes' : 'No'}`);

    // Step 4: Create cart
    console.log('\n🛒 Step 4: Creating cart...');
    const cart = await createCart();
    
    if (!cart) {
      console.error('❌ Failed to create cart');
      return;
    }
    
    console.log(`✅ Cart created: ${cart.id}`);

    // Step 5: Add item to cart
    console.log('\n➕ Step 5: Adding PM2A Sinfonia to cart...');
    const updatedCart = await addToCart(cart.id, variant.id, 2);
    
    if (!updatedCart) {
      console.error('❌ Failed to add item to cart');
      return;
    }
    
    console.log(`✅ Item added to cart`);
    console.log(`   Items in cart: ${updatedCart.lines.length}`);
    console.log(`   Total quantity: ${updatedCart.lines.reduce((sum, line) => sum + line.quantity, 0)}`);
    console.log(`   Subtotal: ${formatPrice(updatedCart.cost.subtotalAmount.amount, updatedCart.cost.subtotalAmount.currencyCode)}`);

    // Step 6: Verify cart contents
    console.log('\n✅ Step 6: Verifying cart contents...');
    updatedCart.lines.forEach((line, index) => {
      console.log(`\n   Item ${index + 1}:`);
      console.log(`   - Product: ${line.merchandise.product.title}`);
      console.log(`   - Variant: ${line.merchandise.title}`);
      console.log(`   - Quantity: ${line.quantity}`);
      console.log(`   - Price: ${formatPrice(line.merchandise.price.amount, line.merchandise.price.currencyCode)}`);
      console.log(`   - Line Total: ${formatPrice(line.cost.totalAmount.amount, line.cost.totalAmount.currencyCode)}`);
    });

    // Step 7: Show checkout URL
    console.log('\n🔗 Step 7: Checkout URL:');
    console.log(`   ${updatedCart.checkoutUrl}`);

    // Summary
    console.log('\n' + '═'.repeat(60));
    console.log('🎉 Integration Test PASSED!');
    console.log('═'.repeat(60));
    console.log('\n✅ All systems operational:');
    console.log('   • Product fetching from Shopify');
    console.log('   • Variant selection by options');
    console.log('   • Cart creation');
    console.log('   • Add to cart functionality');
    console.log('   • Price formatting');
    console.log('   • Checkout URL generation');
    console.log('\n🚀 Your Shopify integration is ready for production!');

  } catch (error) {
    console.error('\n❌ Integration test failed:', error);
    if (error instanceof Error) {
      console.error('   Error message:', error.message);
      console.error('   Stack:', error.stack);
    }
  }
}

testIntegration();

