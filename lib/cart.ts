/**
 * Cart Management for StealthShield
 * Handles cart operations with vehicle metadata attachment
 */

import { createCart, addToCart as shopifyAddToCart, getCart } from './shopify';
import { VehicleData } from './api';

const CART_ID_KEY = 'stealthshield_cart_id';

/**
 * Get the current cart ID from localStorage
 */
export function getCartId(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(CART_ID_KEY);
}

/**
 * Save cart ID to localStorage
 */
export function setCartId(cartId: string): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(CART_ID_KEY, cartId);
}

/**
 * Clear cart ID from localStorage
 */
export function clearCartId(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(CART_ID_KEY);
}

/**
 * Create custom attributes from vehicle data
 */
export function createVehicleAttributes(vehicleData: VehicleData): Array<{ key: string; value: string }> {
  const attributes = [
    { key: 'registration', value: vehicleData.registration },
    { key: 'make', value: vehicleData.make },
    { key: 'model', value: vehicleData.model },
    { key: 'year', value: vehicleData.year.toString() },
  ];

  if (vehicleData.variant) {
    attributes.push({ key: 'variant', value: vehicleData.variant });
  }

  return attributes;
}

/**
 * Create a new cart with vehicle metadata
 */
export async function createCartWithVehicle(
  variantId: string,
  vehicleData: VehicleData,
  quantity: number = 1
) {
  const attributes = createVehicleAttributes(vehicleData);
  const cart = await createCart(variantId, quantity, attributes);
  setCartId(cart.id);
  return cart;
}

/**
 * Add item to existing cart or create new one
 */
export async function addToCartWithVehicle(
  variantId: string,
  vehicleData: VehicleData,
  quantity: number = 1
) {
  const existingCartId = getCartId();
  const attributes = createVehicleAttributes(vehicleData);

  if (existingCartId) {
    try {
      // Try to add to existing cart
      const cart = await shopifyAddToCart(existingCartId, variantId, quantity, attributes);
      return cart;
    } catch (error) {
      // If cart doesn't exist or is invalid, create a new one
      console.log('Existing cart invalid, creating new cart');
      clearCartId();
      return createCartWithVehicle(variantId, vehicleData, quantity);
    }
  } else {
    // No existing cart, create new one
    return createCartWithVehicle(variantId, vehicleData, quantity);
  }
}

/**
 * Retrieve current cart
 */
export async function getCurrentCart() {
  const cartId = getCartId();
  if (!cartId) return null;

  try {
    return await getCart(cartId);
  } catch (error) {
    console.error('Failed to retrieve cart:', error);
    clearCartId();
    return null;
  }
}

/**
 * Get vehicle data from cart line items
 */
export function getVehicleDataFromCart(cart: any): VehicleData | null {
  if (!cart || !cart.lines || cart.lines.edges.length === 0) {
    return null;
  }

  const attributes = cart.lines.edges[0].node.attributes;
  const registrationAttr = attributes.find((a: any) => a.key === 'registration');
  const makeAttr = attributes.find((a: any) => a.key === 'make');
  const modelAttr = attributes.find((a: any) => a.key === 'model');
  const yearAttr = attributes.find((a: any) => a.key === 'year');
  const variantAttr = attributes.find((a: any) => a.key === 'variant');

  if (!registrationAttr || !makeAttr || !modelAttr || !yearAttr) {
    return null;
  }

  return {
    registration: registrationAttr.value,
    make: makeAttr.value,
    model: modelAttr.value,
    year: parseInt(yearAttr.value),
    variant: variantAttr?.value,
  };
}

