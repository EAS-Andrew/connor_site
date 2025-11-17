/**
 * Shopify Admin API Integration
 * Functions for updating orders with photo URLs and tags
 */

const SHOPIFY_STORE = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN;
const ADMIN_TOKEN = process.env.SHOPIFY_ADMIN_ACCESS_TOKEN;
const API_VERSION = '2025-01';

interface UpdateOrderResult {
  success: boolean;
  error?: string;
}

/**
 * Update Shopify order with bumper photo URLs
 * Adds a note with the photo URLs and tags the order as "photos-uploaded"
 */
export async function updateOrderWithPhotos(
  orderId: string,
  frontPhotoUrl: string,
  rearPhotoUrl: string
): Promise<UpdateOrderResult> {
  if (!SHOPIFY_STORE || !ADMIN_TOKEN) {
    console.error('Shopify Admin API credentials not configured');
    return { success: false, error: 'Shopify Admin API not configured' };
  }

  try {
    const endpoint = `https://${SHOPIFY_STORE}/admin/api/${API_VERSION}/orders/${orderId}.json`;

    // First, get the current order to preserve existing notes and tags
    const getResponse = await fetch(endpoint, {
      method: 'GET',
      headers: {
        'X-Shopify-Access-Token': ADMIN_TOKEN,
        'Content-Type': 'application/json',
      },
    });

    if (!getResponse.ok) {
      throw new Error(`Failed to fetch order: ${getResponse.statusText}`);
    }

    const currentOrder = await getResponse.json();
    const existingNote = currentOrder.order?.note || '';
    const existingTags = currentOrder.order?.tags || '';

    // Prepare new note with photo URLs
    const photoNote = `\n\n--- BUMPER PHOTOS ---\nFront: ${frontPhotoUrl}\nRear: ${rearPhotoUrl}\nUploaded: ${new Date().toISOString()}`;
    const newNote = existingNote + photoNote;

    // Add "photos-uploaded" tag if not already present
    const tags = existingTags.split(',').map(t => t.trim()).filter(Boolean);
    if (!tags.includes('photos-uploaded')) {
      tags.push('photos-uploaded');
    }
    const newTags = tags.join(', ');

    // Update the order
    const updateResponse = await fetch(endpoint, {
      method: 'PUT',
      headers: {
        'X-Shopify-Access-Token': ADMIN_TOKEN,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        order: {
          id: parseInt(orderId),
          note: newNote,
          tags: newTags,
        },
      }),
    });

    if (!updateResponse.ok) {
      const errorText = await updateResponse.text();
      console.error('Shopify update failed:', errorText);
      throw new Error(`Failed to update order: ${updateResponse.statusText}`);
    }

    console.log(`Successfully updated Shopify order ${orderId} with photo URLs`);
    return { success: true };
  } catch (error) {
    console.error('Error updating Shopify order:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Add metafield to Shopify order (alternative to notes)
 * Stores photo URLs as structured data
 */
export async function addOrderMetafield(
  orderId: string,
  key: string,
  value: string,
  type: string = 'single_line_text_field'
): Promise<UpdateOrderResult> {
  if (!SHOPIFY_STORE || !ADMIN_TOKEN) {
    console.error('Shopify Admin API credentials not configured');
    return { success: false, error: 'Shopify Admin API not configured' };
  }

  try {
    const endpoint = `https://${SHOPIFY_STORE}/admin/api/${API_VERSION}/orders/${orderId}/metafields.json`;

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'X-Shopify-Access-Token': ADMIN_TOKEN,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        metafield: {
          namespace: 'custom',
          key: key,
          value: value,
          type: type,
        },
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Shopify metafield creation failed:', errorText);
      throw new Error(`Failed to add metafield: ${response.statusText}`);
    }

    console.log(`Successfully added metafield ${key} to order ${orderId}`);
    return { success: true };
  } catch (error) {
    console.error('Error adding order metafield:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

