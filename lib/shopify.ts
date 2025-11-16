/**
 * Shopify Storefront API Client
 * Handles all GraphQL queries and mutations for products, cart, and checkout
 */

import { createStorefrontApiClient } from '@shopify/storefront-api-client';

// Initialize Shopify Storefront API client
const client = createStorefrontApiClient({
  storeDomain: process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN!,
  apiVersion: process.env.NEXT_PUBLIC_SHOPIFY_API_VERSION || '2025-01',
  publicAccessToken: process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN!,
});

// Type definitions for Shopify data structures
export interface ShopifyProduct {
  id: string;
  title: string;
  description: string;
  handle: string;
  tags: string[];
  featuredImage?: {
    url: string;
    altText?: string;
  };
  priceRange: {
    minVariantPrice: {
      amount: string;
      currencyCode: string;
    };
    maxVariantPrice: {
      amount: string;
      currencyCode: string;
    };
  };
  variants: {
    edges: Array<{
      node: ShopifyVariant;
    }>;
  };
  metafields: Array<{
    key: string;
    value: string;
    type: string;
  }>;
}

export interface ShopifyVariant {
  id: string;
  title: string;
  price: {
    amount: string;
    currencyCode: string;
  };
  availableForSale: boolean;
  sku?: string;
}

export interface ShopifyCart {
  id: string;
  checkoutUrl: string;
  totalQuantity: number;
  cost: {
    totalAmount: {
      amount: string;
      currencyCode: string;
    };
    subtotalAmount: {
      amount: string;
      currencyCode: string;
    };
  };
  lines: {
    edges: Array<{
      node: {
        id: string;
        quantity: number;
        merchandise: {
          id: string;
          title: string;
          price: {
            amount: string;
            currencyCode: string;
          };
          image?: {
            url: string;
            altText?: string;
          };
          product: {
            title: string;
            priceRange: {
              minVariantPrice: {
                amount: string;
                currencyCode: string;
              };
            };
            images?: {
              edges: Array<{
                node: {
                  url: string;
                  altText?: string;
                };
              }>;
            };
          };
        };
        attributes: Array<{
          key: string;
          value: string;
        }>;
      };
    }>;
  };
}

/**
 * Fetch all pre-cut kit products from Shopify
 */
export async function fetchPreCutKits(): Promise<ShopifyProduct[]> {
  const query = `
    query FetchPreCutKits {
      products(first: 10, query: "tag:pre-cut-kit") {
        edges {
          node {
            id
            title
            description
            handle
            tags
            featuredImage {
              url
              altText
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
            variants(first: 10) {
              edges {
                node {
                  id
                  title
                  price {
                    amount
                    currencyCode
                  }
                  availableForSale
                  sku
                }
              }
            }
            metafields(identifiers: [
              {namespace: "custom", key: "coverage_includes"}
            ]) {
              key
              value
              type
            }
          }
        }
      }
    }
  `;

  const { data, errors } = await client.request(query);

  if (errors) {
    console.error('Shopify API errors:', errors);
    throw new Error('Failed to fetch products from Shopify');
  }

  return data.products.edges.map((edge: any) => edge.node);
}

/**
 * Fetch PPF roll products from Shopify
 */
export async function fetchPPFRolls(): Promise<ShopifyProduct[]> {
  const query = `
    query FetchPPFRolls {
      products(first: 20, query: "tag:ppf-roll") {
        edges {
          node {
            id
            title
            description
            handle
            tags
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
            variants(first: 20) {
              edges {
                node {
                  id
                  title
                  price {
                    amount
                    currencyCode
                  }
                  availableForSale
                  sku
                }
              }
            }
          }
        }
      }
    }
  `;

  const { data, errors } = await client.request(query);

  if (errors) {
    console.error('Shopify API errors:', errors);
    throw new Error('Failed to fetch PPF rolls from Shopify');
  }

  return data.products.edges.map((edge: any) => edge.node);
}

/**
 * Create a new cart in Shopify
 */
export async function createCart(
  variantId: string,
  quantity: number = 1,
  customAttributes: Array<{ key: string; value: string }> = []
): Promise<ShopifyCart> {
  const mutation = `
    mutation CreateCart($cartInput: CartInput!) {
      cartCreate(input: $cartInput) {
        cart {
          id
          checkoutUrl
          totalQuantity
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
          lines(first: 10) {
            edges {
              node {
                id
                quantity
                merchandise {
                  ... on ProductVariant {
                    id
                    title
                    price {
                      amount
                      currencyCode
                    }
                    image {
                      url
                      altText
                    }
                    product {
                      title
                      priceRange {
                        minVariantPrice {
                          amount
                          currencyCode
                        }
                      }
                      images(first: 1) {
                        edges {
                          node {
                            url
                            altText
                          }
                        }
                      }
                    }
                  }
                }
                attributes {
                  key
                  value
                }
              }
            }
          }
        }
        userErrors {
          field
          message
        }
      }
    }
  `;

  const variables = {
    cartInput: {
      lines: [
        {
          merchandiseId: variantId,
          quantity,
          attributes: customAttributes,
        },
      ],
    },
  };

  const { data, errors } = await client.request(mutation, { variables });

  if (errors || data.cartCreate.userErrors.length > 0) {
    console.error('Cart creation errors:', errors || data.cartCreate.userErrors);
    throw new Error('Failed to create cart');
  }

  return data.cartCreate.cart;
}

/**
 * Add items to an existing cart
 */
export async function addToCart(
  cartId: string,
  variantId: string,
  quantity: number = 1,
  customAttributes: Array<{ key: string; value: string }> = []
): Promise<ShopifyCart> {
  const mutation = `
    mutation AddToCart($cartId: ID!, $lines: [CartLineInput!]!) {
      cartLinesAdd(cartId: $cartId, lines: $lines) {
        cart {
          id
          checkoutUrl
          totalQuantity
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
          lines(first: 10) {
            edges {
              node {
                id
                quantity
                merchandise {
                  ... on ProductVariant {
                    id
                    title
                    price {
                      amount
                      currencyCode
                    }
                    image {
                      url
                      altText
                    }
                    product {
                      title
                      priceRange {
                        minVariantPrice {
                          amount
                          currencyCode
                        }
                      }
                      images(first: 1) {
                        edges {
                          node {
                            url
                            altText
                          }
                        }
                      }
                    }
                  }
                }
                attributes {
                  key
                  value
                }
              }
            }
          }
        }
        userErrors {
          field
          message
        }
      }
    }
  `;

  const variables = {
    cartId,
    lines: [
      {
        merchandiseId: variantId,
        quantity,
        attributes: customAttributes,
      },
    ],
  };

  const { data, errors } = await client.request(mutation, { variables });

  if (errors || data.cartLinesAdd.userErrors.length > 0) {
    console.error('Add to cart errors:', errors || data.cartLinesAdd.userErrors);
    throw new Error('Failed to add to cart');
  }

  return data.cartLinesAdd.cart;
}

/**
 * Retrieve an existing cart by ID
 */
export async function getCart(cartId: string): Promise<ShopifyCart> {
  const query = `
    query GetCart($cartId: ID!) {
      cart(id: $cartId) {
        id
        checkoutUrl
        totalQuantity
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
        lines(first: 10) {
          edges {
            node {
              id
              quantity
              merchandise {
                ... on ProductVariant {
                  id
                  title
                  price {
                    amount
                    currencyCode
                  }
                  image {
                    url
                    altText
                  }
                  product {
                    title
                    priceRange {
                      minVariantPrice {
                        amount
                        currencyCode
                      }
                    }
                    images(first: 1) {
                      edges {
                        node {
                          url
                          altText
                        }
                      }
                    }
                  }
                }
              }
              attributes {
                key
                value
              }
            }
          }
        }
      }
    }
  `;

  const variables = { cartId };

  const { data, errors } = await client.request(query, { variables });

  if (errors) {
    console.error('Get cart errors:', errors);
    throw new Error('Failed to retrieve cart');
  }

  return data.cart;
}

/**
 * Update cart line item quantity
 */
export async function updateCartLine(
  cartId: string,
  lineId: string,
  quantity: number
): Promise<ShopifyCart> {
  const mutation = `
    mutation UpdateCartLine($cartId: ID!, $lines: [CartLineUpdateInput!]!) {
      cartLinesUpdate(cartId: $cartId, lines: $lines) {
        cart {
          id
          checkoutUrl
          totalQuantity
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
          lines(first: 10) {
            edges {
              node {
                id
                quantity
                merchandise {
                  ... on ProductVariant {
                    id
                    title
                    price {
                      amount
                      currencyCode
                    }
                    image {
                      url
                      altText
                    }
                    product {
                      title
                      priceRange {
                        minVariantPrice {
                          amount
                          currencyCode
                        }
                      }
                      images(first: 1) {
                        edges {
                          node {
                            url
                            altText
                          }
                        }
                      }
                    }
                  }
                }
                attributes {
                  key
                  value
                }
              }
            }
          }
        }
        userErrors {
          field
          message
        }
      }
    }
  `;

  const variables = {
    cartId,
    lines: [{ id: lineId, quantity }],
  };

  const { data, errors } = await client.request(mutation, { variables });

  if (errors || data.cartLinesUpdate.userErrors.length > 0) {
    console.error('Update cart line errors:', errors || data.cartLinesUpdate.userErrors);
    throw new Error('Failed to update cart line');
  }

  return data.cartLinesUpdate.cart;
}

/**
 * Remove cart line item
 */
export async function removeCartLine(
  cartId: string,
  lineId: string
): Promise<ShopifyCart> {
  const mutation = `
    mutation RemoveCartLine($cartId: ID!, $lineIds: [ID!]!) {
      cartLinesRemove(cartId: $cartId, lineIds: $lineIds) {
        cart {
          id
          checkoutUrl
          totalQuantity
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
          lines(first: 10) {
            edges {
              node {
                id
                quantity
                merchandise {
                  ... on ProductVariant {
                    id
                    title
                    price {
                      amount
                      currencyCode
                    }
                    image {
                      url
                      altText
                    }
                    product {
                      title
                      priceRange {
                        minVariantPrice {
                          amount
                          currencyCode
                        }
                      }
                      images(first: 1) {
                        edges {
                          node {
                            url
                            altText
                          }
                        }
                      }
                    }
                  }
                }
                attributes {
                  key
                  value
                }
              }
            }
          }
        }
        userErrors {
          field
          message
        }
      }
    }
  `;

  const variables = {
    cartId,
    lineIds: [lineId],
  };

  const { data, errors } = await client.request(mutation, { variables });

  if (errors || data.cartLinesRemove.userErrors.length > 0) {
    console.error('Remove cart line errors:', errors || data.cartLinesRemove.userErrors);
    throw new Error('Failed to remove cart line');
  }

  return data.cartLinesRemove.cart;
}

export default client;

