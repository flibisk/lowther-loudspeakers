import { config } from 'dotenv';
import { resolve } from 'path';

config({ path: resolve(process.cwd(), '.env.local') });

import { getAvailableCountries } from '@/lib/shopify-storefront';

async function listCurrencies() {
  console.log('🛍️  Fetching currencies enabled in Shopify Markets...\n');

  try {
    const countries = await getAvailableCountries();

    if (countries.length === 0) {
      console.log('No countries returned. Double-check your Storefront API credentials and Markets setup.');
      return;
    }

    console.log(`Found ${countries.length} countries with currencies:`);
    console.log('─'.repeat(60));

    countries
      .sort((a, b) => a.isoCode.localeCompare(b.isoCode))
      .forEach((country) => {
        const currency = country.currency;
        if (!currency) return;

        console.log(
          `${country.isoCode.padEnd(3)} | ${currency.isoCode.padEnd(3)} | ${currency.symbol.padEnd(4)} | ${country.name}`
        );
      });

    console.log('\nTip: Make sure every currency listed here exists in `currency-selector.tsx` and `mobile-menu.tsx`.');
  } catch (error) {
    console.error('Error fetching currencies:', error);
  }
}

listCurrencies();
