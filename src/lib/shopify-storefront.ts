/**
 * Shopify Storefront API Client
 * 
 * This client handles all interactions with Shopify's Storefront API:
 * - Fetching products with currency context
 * - Managing cart operations
 * - Creating checkouts
 * - Currency conversion via @inContext directive
 */

import { createStorefrontApiClient } from '@shopify/storefront-api-client';

// ============================================================================
// CONFIGURATION
// ============================================================================

// Lazy-load client to ensure environment variables are loaded
let clientInstance: ReturnType<typeof createStorefrontApiClient> | null = null;
const STOREFRONT_ID = process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ID;

type RequestOptions = {
  variables?: Record<string, unknown>;
  headers?: Record<string, string>;
  [key: string]: unknown;
};

function withStorefrontHeaders(options?: RequestOptions): RequestOptions {
  if (!STOREFRONT_ID) {
    return options ?? {};
  }

  return {
    ...(options ?? {}),
    headers: {
      ...(options?.headers ?? {}),
      'Shopify-Storefront-Id': STOREFRONT_ID,
    },
  };
}

function getClient() {
  if (!clientInstance) {
    if (!process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN) {
      throw new Error('NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN is not set in environment variables');
    }
    if (!process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN) {
      throw new Error('NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN is not set in environment variables');
    }
    
    clientInstance = createStorefrontApiClient({
      storeDomain: process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN,
      apiVersion: '2025-01',
      publicAccessToken: process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN,
    });
  }
  return clientInstance;
}

// ============================================================================
// TYPES
// ============================================================================

export interface ShopifyProduct {
  id: string;
  handle: string;
  title: string;
  description: string;
  images: ShopifyImage[];
  variants: ShopifyVariant[];
  priceRange: {
    minVariantPrice: ShopifyMoney;
    maxVariantPrice: ShopifyMoney;
  };
}

export interface ShopifyVariant {
  id: string;
  title: string;
  price: ShopifyMoney;
  availableForSale: boolean;
  quantityAvailable: number;
  selectedOptions: Array<{
    name: string;
    value: string;
  }>;
}

export interface ShopifyMoney {
  amount: string;
  currencyCode: string;
}

export interface ShopifyImage {
  url: string;
  altText: string | null;
  width: number;
  height: number;
}

export interface ShopifyCart {
  id: string;
  checkoutUrl: string;
  lines: ShopifyCartLine[];
  cost: {
    totalAmount: ShopifyMoney;
    subtotalAmount: ShopifyMoney;
  };
}

export interface ShopifyCartLine {
  id: string;
  quantity: number;
  merchandise: {
    id: string;
    title: string;
    product: {
      title: string;
      handle: string;
    };
    price: ShopifyMoney;
    image: ShopifyImage;
    selectedOptions: Array<{
      name: string;
      value: string;
    }>;
  };
  cost: {
    totalAmount: ShopifyMoney;
  };
}

export interface ShopifyAvailableCountry {
  isoCode: string;
  name: string;
  currency: {
    isoCode: string;
    name: string;
    symbol: string;
  } | null;
}

// ============================================================================
// CURRENCY TO COUNTRY CODE MAPPING
// ============================================================================

const CURRENCY_TO_COUNTRY: Record<string, string> = {
  'GBP': 'GB',
  'USD': 'US',
  'EUR': 'FR',  // Default to France for Eurozone (ensure Markets configured)
  'JPY': 'JP',
  'AUD': 'AU',
  'CAD': 'CA',
  'AED': 'AE',
  'ARS': 'AR',
  'BDT': 'BD',
  'BGN': 'BG',
  'BHD': 'BH',
  'BRL': 'BR',
  'CHF': 'CH',
  'CLP': 'CL',
  'CNY': 'CN',
  'COP': 'CO',
  'CRC': 'CR',
  'CZK': 'CZ',
  'DKK': 'DK',
  'EGP': 'EG',
  'HKD': 'HK',
  'HRK': 'HR',
  'HUF': 'HU',
  'IDR': 'ID',
  'ILS': 'IL',
  'INR': 'IN',
  'ISK': 'IS',
  'KES': 'KE',
  'KRW': 'KR',
  'KWD': 'KW',
  'LKR': 'LK',
  'MAD': 'MA',
  'MXN': 'MX',
  'MYR': 'MY',
  'NGN': 'NG',
  'NOK': 'NO',
  'NZD': 'NZ',
  'OMR': 'OM',
  'PEN': 'PE',
  'PHP': 'PH',
  'PKR': 'PK',
  'PLN': 'PL',
  'QAR': 'QA',
  'RON': 'RO',
  'RUB': 'RU',
  'SAR': 'SA',
  'SEK': 'SE',
  'SGD': 'SG',
  'THB': 'TH',
  'TRY': 'TR',
  'TWD': 'TW',
  'VND': 'VN',
  'ZAR': 'ZA',
};

export function getCountryCodeFromCurrency(currencyCode: string): string {
  return CURRENCY_TO_COUNTRY[currencyCode] || 'GB'; // Default to GB
}

// ============================================================================
// LOCALIZATION QUERIES
// ============================================================================

export async function getAvailableCountries(): Promise<ShopifyAvailableCountry[]> {
  const query = `
    query getAvailableCountries {
      localization {
        availableCountries {
          isoCode
          name
          currency {
            isoCode
            name
            symbol
          }
        }
      }
    }
  `;

  try {
    const client = getClient();
    const { data, errors } = await client.request(
      query,
      withStorefrontHeaders(),
    );

    if (errors) {
      console.error('Shopify API errors:', errors);
      return [];
    }

    const countries = data?.localization?.availableCountries ?? [];
    return countries
      .filter((country: any) => country.currency?.isoCode)
      .map((country: any) => ({
        isoCode: country.isoCode,
        name: country.name,
        currency: country.currency,
      }));
  } catch (error) {
    console.error('Error fetching available countries:', error);
    return [];
  }
}

// ============================================================================
// PRODUCT QUERIES
// ============================================================================

/**
 * Fetch a single product by handle with currency context
 */
export async function getProduct(
  handle: string,
  currencyCode: string = 'GBP'
): Promise<ShopifyProduct | null> {
  const countryCode = getCountryCodeFromCurrency(currencyCode);
  
  const query = `
    query getProduct($handle: String!, $country: CountryCode!) @inContext(country: $country) {
      product(handle: $handle) {
        id
        handle
        title
        description
        images(first: 10) {
          edges {
            node {
              url
              altText
              width
              height
            }
          }
        }
        variants(first: 20) {
          edges {
            node {
              id
              title
              availableForSale
              quantityAvailable
              selectedOptions {
                name
                value
              }
              price {
                amount
                currencyCode
              }
            }
          }
        }
        priceRange {
          minVariantPrice {
            amount
            currencyCode
          }
          maxVariantPrice {
            amount
            currencyCode
          }
        }
      }
    }
  `;

  try {
    const client = getClient();
    const { data, errors } = await client.request(
      query,
      withStorefrontHeaders({
        variables: { handle, country: countryCode },
      }),
    );

    if (errors) {
      console.error('Shopify API errors:', errors);
      return null;
    }

    if (!data?.product) {
      return null;
    }

    const product = data.product;

    return {
      id: product.id,
      handle: product.handle,
      title: product.title,
      description: product.description,
      images: product.images.edges.map((edge: any) => edge.node),
      variants: product.variants.edges.map((edge: any) => edge.node),
      priceRange: product.priceRange,
    };
  } catch (error) {
    console.error('Error fetching product:', error);
    return null;
  }
}

/**
 * Fetch products from a collection with currency context
 */
export async function getCollectionProducts(
  collectionHandle: string,
  currencyCode: string = 'GBP'
): Promise<ShopifyProduct[]> {
  const countryCode = getCountryCodeFromCurrency(currencyCode);
  
  const query = `
    query getCollection($handle: String!, $country: CountryCode!) @inContext(country: $country) {
      collection(handle: $handle) {
        products(first: 50) {
          edges {
            node {
              id
              handle
              title
              description
              images(first: 1) {
                edges {
                  node {
                    url
                    altText
                    width
                    height
                  }
                }
              }
              variants(first: 20) {
                edges {
                  node {
                    id
                    title
                    availableForSale
                    quantityAvailable
                    selectedOptions {
                      name
                      value
                    }
                    price {
                      amount
                      currencyCode
                    }
                  }
                }
              }
              priceRange {
                minVariantPrice {
                  amount
                  currencyCode
                }
                maxVariantPrice {
                  amount
                  currencyCode
                }
              }
            }
          }
        }
      }
    }
  `;

  try {
    const client = getClient();
    const { data, errors } = await client.request(
      query,
      withStorefrontHeaders({
        variables: { handle: collectionHandle, country: countryCode },
      }),
    );

    if (errors) {
      console.error('Shopify API errors:', errors);
      return [];
    }

    if (!data?.collection?.products) {
      return [];
    }

    return data.collection.products.edges.map((edge: any) => ({
      id: edge.node.id,
      handle: edge.node.handle,
      title: edge.node.title,
      description: edge.node.description,
      images: edge.node.images.edges.map((imgEdge: any) => imgEdge.node),
      variants: edge.node.variants.edges.map((varEdge: any) => varEdge.node),
      priceRange: edge.node.priceRange,
    }));
  } catch (error) {
    console.error('Error fetching collection:', error);
    return [];
  }
}

// ============================================================================
// CART OPERATIONS
// ============================================================================

/**
 * Create a new cart
 */
export async function createCart(currencyCode: string = 'GBP'): Promise<ShopifyCart | null> {
  const countryCode = getCountryCodeFromCurrency(currencyCode);
  
  const mutation = `
    mutation createCart($country: CountryCode!) @inContext(country: $country) {
      cartCreate {
        cart {
          id
          checkoutUrl
          lines(first: 10) {
            edges {
              node {
                id
                quantity
                merchandise {
                  ... on ProductVariant {
                    id
                    title
                    product {
                      title
                      handle
                    }
                    price {
                      amount
                      currencyCode
                    }
                    image {
                      url
                      altText
                      width
                      height
                    }
                    selectedOptions {
                      name
                      value
                    }
                  }
                }
                cost {
                  totalAmount {
                    amount
                    currencyCode
                  }
                }
              }
            }
          }
          cost {
            totalAmount {
              amount
              currencyCode
            }
            subtotalAmount {
              amount
              currencyCode
            }
          }
        }
      }
    }
  `;

  try {
    const client = getClient();
    const { data, errors } = await client.request(
      mutation,
      withStorefrontHeaders({
        variables: { country: countryCode },
      }),
    );

    if (errors) {
      console.error('Shopify API errors:', errors);
      return null;
    }

    const cart = data?.cartCreate?.cart;
    if (!cart) return null;

    return {
      id: cart.id,
      checkoutUrl: cart.checkoutUrl,
      lines: cart.lines.edges.map((edge: any) => edge.node),
      cost: cart.cost,
    };
  } catch (error) {
    console.error('Error creating cart:', error);
    return null;
  }
}

/**
 * Add items to cart with currency context
 */
export async function addToCart(
  cartId: string,
  variantId: string,
  quantity: number = 1,
  currencyCode: string = 'GBP'
): Promise<ShopifyCart | null> {
  const countryCode = getCountryCodeFromCurrency(currencyCode);
  
  const mutation = `
    mutation addToCart($cartId: ID!, $lines: [CartLineInput!]!, $country: CountryCode!) @inContext(country: $country) {
      cartLinesAdd(cartId: $cartId, lines: $lines) {
        cart {
          id
          checkoutUrl
          lines(first: 50) {
            edges {
              node {
                id
                quantity
                merchandise {
                  ... on ProductVariant {
                    id
                    title
                    product {
                      title
                      handle
                    }
                    price {
                      amount
                      currencyCode
                    }
                    image {
                      url
                      altText
                      width
                      height
                    }
                    selectedOptions {
                      name
                      value
                    }
                  }
                }
                cost {
                  totalAmount {
                    amount
                    currencyCode
                  }
                }
              }
            }
          }
          cost {
            totalAmount {
              amount
              currencyCode
            }
            subtotalAmount {
              amount
              currencyCode
            }
          }
        }
      }
    }
  `;

  try {
    const client = getClient();
    const { data, errors } = await client.request(
      mutation,
      withStorefrontHeaders({
        variables: {
          cartId,
          lines: [{ merchandiseId: variantId, quantity }],
          country: countryCode,
        },
      }),
    );

    if (errors) {
      console.error('Shopify API errors:', errors);
      return null;
    }

    const cart = data?.cartLinesAdd?.cart;
    if (!cart) return null;

    return {
      id: cart.id,
      checkoutUrl: cart.checkoutUrl,
      lines: cart.lines.edges.map((edge: any) => edge.node),
      cost: cart.cost,
    };
  } catch (error) {
    console.error('Error adding to cart:', error);
    return null;
  }
}

/**
 * Update cart line quantity with currency context
 */
export async function updateCartLine(
  cartId: string,
  lineId: string,
  quantity: number,
  currencyCode: string = 'GBP'
): Promise<ShopifyCart | null> {
  const countryCode = getCountryCodeFromCurrency(currencyCode);
  
  const mutation = `
    mutation updateCartLine($cartId: ID!, $lines: [CartLineUpdateInput!]!, $country: CountryCode!) @inContext(country: $country) {
      cartLinesUpdate(cartId: $cartId, lines: $lines) {
        cart {
          id
          checkoutUrl
          lines(first: 50) {
            edges {
              node {
                id
                quantity
                merchandise {
                  ... on ProductVariant {
                    id
                    title
                    product {
                      title
                      handle
                    }
                    price {
                      amount
                      currencyCode
                    }
                    image {
                      url
                      altText
                      width
                      height
                    }
                    selectedOptions {
                      name
                      value
                    }
                  }
                }
                cost {
                  totalAmount {
                    amount
                    currencyCode
                  }
                }
              }
            }
          }
          cost {
            totalAmount {
              amount
              currencyCode
            }
            subtotalAmount {
              amount
              currencyCode
            }
          }
        }
      }
    }
  `;

  try {
    const client = getClient();
    const { data, errors } = await client.request(
      mutation,
      withStorefrontHeaders({
        variables: {
          cartId,
          lines: [{ id: lineId, quantity }],
          country: countryCode,
        },
      }),
    );

    if (errors) {
      console.error('Shopify API errors:', errors);
      return null;
    }

    const cart = data?.cartLinesUpdate?.cart;
    if (!cart) return null;

    return {
      id: cart.id,
      checkoutUrl: cart.checkoutUrl,
      lines: cart.lines.edges.map((edge: any) => edge.node),
      cost: cart.cost,
    };
  } catch (error) {
    console.error('Error updating cart line:', error);
    return null;
  }
}

/**
 * Remove line from cart with currency context
 */
export async function removeFromCart(
  cartId: string,
  lineId: string,
  currencyCode: string = 'GBP'
): Promise<ShopifyCart | null> {
  const countryCode = getCountryCodeFromCurrency(currencyCode);
  
  const mutation = `
    mutation removeFromCart($cartId: ID!, $lineIds: [ID!]!, $country: CountryCode!) @inContext(country: $country) {
      cartLinesRemove(cartId: $cartId, lineIds: $lineIds) {
        cart {
          id
          checkoutUrl
          lines(first: 50) {
            edges {
              node {
                id
                quantity
                merchandise {
                  ... on ProductVariant {
                    id
                    title
                    product {
                      title
                      handle
                    }
                    price {
                      amount
                      currencyCode
                    }
                    image {
                      url
                      altText
                      width
                      height
                    }
                    selectedOptions {
                      name
                      value
                    }
                  }
                }
                cost {
                  totalAmount {
                    amount
                    currencyCode
                  }
                }
              }
            }
          }
          cost {
            totalAmount {
              amount
              currencyCode
            }
            subtotalAmount {
              amount
              currencyCode
            }
          }
        }
      }
    }
  `;

  try {
    const client = getClient();
    const { data, errors } = await client.request(
      mutation,
      withStorefrontHeaders({
        variables: {
          cartId,
          lineIds: [lineId],
          country: countryCode,
        },
      }),
    );

    if (errors) {
      console.error('Shopify API errors:', errors);
      return null;
    }

    const cart = data?.cartLinesRemove?.cart;
    if (!cart) return null;

    return {
      id: cart.id,
      checkoutUrl: cart.checkoutUrl,
      lines: cart.lines.edges.map((edge: any) => edge.node),
      cost: cart.cost,
    };
  } catch (error) {
    console.error('Error removing from cart:', error);
    return null;
  }
}

/**
 * Get existing cart by ID with currency context
 */
export async function getCart(cartId: string, currencyCode: string = 'GBP'): Promise<ShopifyCart | null> {
  const countryCode = getCountryCodeFromCurrency(currencyCode);
  
  const query = `
    query getCart($cartId: ID!, $country: CountryCode!) @inContext(country: $country) {
      cart(id: $cartId) {
        id
        checkoutUrl
        lines(first: 50) {
          edges {
            node {
              id
              quantity
              merchandise {
                ... on ProductVariant {
                  id
                  title
                  product {
                    title
                    handle
                  }
                  price {
                    amount
                    currencyCode
                  }
                  image {
                    url
                    altText
                    width
                    height
                  }
                  selectedOptions {
                    name
                    value
                  }
                }
              }
              cost {
                totalAmount {
                  amount
                  currencyCode
                }
              }
            }
          }
        }
        cost {
          totalAmount {
            amount
            currencyCode
          }
          subtotalAmount {
            amount
            currencyCode
          }
        }
      }
    }
  `;

  try {
    const client = getClient();
    const { data, errors } = await client.request(
      query,
      withStorefrontHeaders({
        variables: { 
          cartId,
          country: countryCode,
        },
      }),
    );

    if (errors) {
      console.error('Shopify API errors:', errors);
      return null;
    }

    const cart = data?.cart;
    if (!cart) return null;

    return {
      id: cart.id,
      checkoutUrl: cart.checkoutUrl,
      lines: cart.lines.edges.map((edge: any) => edge.node),
      cost: cart.cost,
    };
  } catch (error) {
    console.error('Error fetching cart:', error);
    return null;
  }
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Format price for display
 */
export function formatPrice(amount: string, currencyCode: string): string {
  const numericAmount = parseFloat(amount);
  
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currencyCode,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(numericAmount);
}

/**
 * Find variant by selected options
 */
export function findVariantByOptions(
  variants: ShopifyVariant[],
  options: Record<string, string>
): ShopifyVariant | undefined {
  return variants.find(variant => {
    return Object.entries(options).every(([optionName, optionValue]) => {
      return variant.selectedOptions.some(
        opt => opt.name === optionName && opt.value === optionValue
      );
    });
  });
}

