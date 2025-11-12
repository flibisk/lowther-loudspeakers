/**
 * Test script to verify Shopify connection
 * 
 * Run this to test your Shopify credentials and API connection
 * Usage: npm run test:shopify
 */

// Load environment variables from .env.local
import { config } from 'dotenv';
import { resolve } from 'path';

config({ path: resolve(process.cwd(), '.env.local') });

import { getProduct, getCollectionProducts, formatPrice } from './shopify-storefront';

async function testConnection() {
  console.log('🔄 Testing Shopify connection...\n');
  
  // Check environment variables
  console.log('📋 Environment Check:');
  console.log('  Store Domain:', process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN || '❌ Missing');
  console.log('  Has Token:', process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN ? '✅ Yes' : '❌ Missing');
  console.log('');

  if (!process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN || !process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN) {
    console.error('❌ Missing required environment variables in .env.local');
    console.log('\nRequired variables:');
    console.log('  NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN=your-store.myshopify.com');
    console.log('  NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN=shpat_xxxxx');
    process.exit(1);
  }

  // Test fetching a product
  console.log('🧪 Test 1: Fetch a single product');
  console.log('  Attempting to fetch product by handle...');
  
  // Try common handles (user will need to replace with their actual handles)
  const testHandles = [
    'pm2a-sinfonia',
    'dx3-concert',
    'pm6a-philharmonic',
    'field-coil-motor',
  ];

  let productFound = false;
  
  for (const handle of testHandles) {
    try {
      const product = await getProduct(handle, 'GBP');
      
      if (product) {
        console.log(`  ✅ Found product: ${product.title}`);
        console.log(`     Handle: ${product.handle}`);
        console.log(`     Variants: ${product.variants.length}`);
        console.log(`     Price Range: ${formatPrice(product.priceRange.minVariantPrice.amount, product.priceRange.minVariantPrice.currencyCode)}`);
        
        // Show first few variants
        if (product.variants.length > 0) {
          console.log(`\n     First variant:`);
          console.log(`       - ${product.variants[0].title}`);
          console.log(`       - ${formatPrice(product.variants[0].price.amount, product.variants[0].price.currencyCode)}`);
          console.log(`       - Available: ${product.variants[0].availableForSale ? 'Yes' : 'No'}`);
          
          // Show options
          if (product.variants[0].selectedOptions.length > 0) {
            console.log(`       - Options:`);
            product.variants[0].selectedOptions.forEach(opt => {
              console.log(`         * ${opt.name}: ${opt.value}`);
            });
          }
        }
        
        productFound = true;
        break;
      }
    } catch (error) {
      // Try next handle
    }
  }
  
  if (!productFound) {
    console.log(`  ⚠️  Could not find any products with test handles`);
    console.log(`     You need to provide your actual product handles`);
  }
  
  console.log('');
  
  // Test currency conversion
  if (productFound) {
    console.log('🧪 Test 2: Currency conversion');
    console.log('  Testing price in different currencies...');
    
    const currencies = ['GBP', 'USD', 'EUR', 'JPY'];
    
    for (const currency of currencies) {
      try {
        const product = await getProduct(testHandles[0], currency);
        if (product) {
          const price = formatPrice(
            product.priceRange.minVariantPrice.amount,
            product.priceRange.minVariantPrice.currencyCode
          );
          console.log(`     ${currency}: ${price}`);
        }
      } catch (error) {
        console.log(`     ${currency}: ❌ Error`);
      }
    }
  }
  
  console.log('');
  
  // Test collection fetch
  console.log('🧪 Test 3: Fetch collection');
  console.log('  Attempting to fetch collection...');
  
  const testCollections = [
    'sinfonia-collection',
    'concert-collection',
    'philharmonic-collection',
  ];
  
  let collectionFound = false;
  
  for (const collection of testCollections) {
    try {
      const products = await getCollectionProducts(collection, 'GBP');
      
      if (products && products.length > 0) {
        console.log(`  ✅ Found collection: ${collection}`);
        console.log(`     Products: ${products.length}`);
        
        // Show first 3 products
        console.log(`     First products:`);
        products.slice(0, 3).forEach(p => {
          console.log(`       - ${p.title} (${formatPrice(p.priceRange.minVariantPrice.amount, p.priceRange.minVariantPrice.currencyCode)})`);
        });
        
        collectionFound = true;
        break;
      }
    } catch (error) {
      // Try next collection
    }
  }
  
  if (!collectionFound) {
    console.log(`  ⚠️  Could not find any collections with test handles`);
    console.log(`     You need to provide your actual collection handles`);
  }
  
  console.log('');
  console.log('═══════════════════════════════════════');
  console.log('✅ Connection test complete!');
  console.log('');
  console.log('Next steps:');
  console.log('1. Provide your actual product handles');
  console.log('2. Provide your actual collection handles');
  console.log('3. Provide variant pricing information');
  console.log('');
  console.log('Then I can integrate this into your product pages!');
  console.log('═══════════════════════════════════════');
}

testConnection().catch(console.error);

