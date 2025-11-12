/**
 * Quick test using Admin API (REST) instead of Storefront API (GraphQL)
 * This should work with your existing legacy private app credentials
 */

import { config } from 'dotenv';
import { resolve } from 'path';

config({ path: resolve(process.cwd(), '.env.local') });

async function testAdminAPI() {
  console.log('🔄 Testing Shopify Admin API (REST)...\n');
  
  const apiKey = process.env.SHOPIFY_ADMIN_API_KEY;
  const apiPassword = process.env.SHOPIFY_ADMIN_API_PASSWORD;
  const storeDomain = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN;
  
  console.log('📋 Environment Check:');
  console.log('  Store Domain:', storeDomain || '❌ Missing');
  console.log('  API Key:', apiKey ? '✅ Yes' : '❌ Missing');
  console.log('  API Password:', apiPassword ? '✅ Yes' : '❌ Missing');
  console.log('');
  
  if (!apiKey || !apiPassword || !storeDomain) {
    console.error('❌ Missing required environment variables');
    return;
  }
  
  // Create basic auth header
  const auth = Buffer.from(`${apiKey}:${apiPassword}`).toString('base64');
  
  console.log('🧪 Test: Fetch products from Admin API');
  
  try {
    const response = await fetch(
      `https://${storeDomain}/admin/api/2025-01/products.json?limit=5`,
      {
        headers: {
          'Authorization': `Basic ${auth}`,
          'Content-Type': 'application/json',
        },
      }
    );
    
    if (!response.ok) {
      console.error(`❌ Error: ${response.status} ${response.statusText}`);
      const text = await response.text();
      console.error('Response:', text);
      return;
    }
    
    const data = await response.json();
    
    if (data.products && data.products.length > 0) {
      console.log(`✅ Success! Found ${data.products.length} products:\n`);
      
      data.products.forEach((product: any) => {
        console.log(`📦 ${product.title}`);
        console.log(`   Handle: ${product.handle}`);
        console.log(`   ID: ${product.id}`);
        console.log(`   Status: ${product.status}`);
        console.log(`   Variants: ${product.variants.length}`);
        
        if (product.variants.length > 0) {
          console.log(`   Price: ${product.variants[0].price} ${product.variants[0].currency || ''}`);
        }
        console.log('');
      });
      
      console.log('═══════════════════════════════════════');
      console.log('✅ Admin API is working!');
      console.log('We can use this to fetch products!');
      console.log('═══════════════════════════════════════');
    } else {
      console.log('⚠️  No products found in store');
    }
    
  } catch (error) {
    console.error('❌ Request failed:', error);
  }
}

testAdminAPI().catch(console.error);

