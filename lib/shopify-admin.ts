/**
 * Shopify Admin API Integration
 * Functions for updating orders with photo URLs and tags
 * 
 * Note: Shopify Admin API doesn't support programmatically creating timeline comments
 * with image attachments. Images are stored in Cloudinary and referenced in order notes.
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
 * Adds a formatted note with the Cloudinary photo URLs and tags the order as "photos-uploaded"
 * 
 * @param orderId - Shopify order ID (numeric string)
 * @param frontPhotoUrl - Cloudinary URL for front bumper photo
 * @param rearPhotoUrl - Cloudinary URL for rear bumper photo
 * @returns Promise<UpdateOrderResult>
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

    console.log('Step 1: Fetching current order...');

    // Get the current order to preserve existing notes and tags
    const getResponse = await fetch(endpoint, {
      method: 'GET',
      headers: {
        'X-Shopify-Access-Token': ADMIN_TOKEN,
        'Content-Type': 'application/json',
      },
    });

    if (!getResponse.ok) {
      const errorText = await getResponse.text();
      console.error('Failed to fetch order:', errorText);
      throw new Error(`Failed to fetch order: ${getResponse.statusText}`);
    }

    const currentOrder = await getResponse.json();
    const existingNote = currentOrder.order?.note || '';
    const existingTags = currentOrder.order?.tags || '';

    // Prepare new note with photo URLs - formatted for easy viewing
    const uploadDate = new Date().toLocaleString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    });

    const photoNote = `

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🚗 BUMPER ANALYSIS PHOTOS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📸 FRONT BUMPER
   ${frontPhotoUrl}

📸 REAR BUMPER
   ${rearPhotoUrl}

⏰ Uploaded: ${uploadDate}
✅ Ready for precision cutting

💡 Click URLs above to view high-resolution images
   Use images to identify sensors, cameras, and modifications
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`;

    const newNote = existingNote + photoNote;

    // Add "photos-uploaded" tag if not already present
    const tags = existingTags.split(',').map((t: string) => t.trim()).filter(Boolean);
    if (!tags.includes('photos-uploaded')) {
      tags.push('photos-uploaded');
    }
    const newTags = tags.join(', ');

    console.log('Step 2: Updating order with photo URLs...');

    // Update the order with new note and tags
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

    console.log('Step 3: Adding clickable image URLs as metafields...');

    // Add metafields with image URLs (these show as clickable links in Shopify admin)
    try {
      const metafieldMutation = `
        mutation orderUpdate($input: OrderInput!) {
          orderUpdate(input: $input) {
            order {
              id
            }
            userErrors {
              field
              message
            }
          }
        }
      `;

      const metafieldVariables = {
        input: {
          id: `gid://shopify/Order/${orderId}`,
          metafields: [
            {
              namespace: 'custom',
              key: 'front_bumper_photo',
              type: 'url',
              value: frontPhotoUrl,
            },
            {
              namespace: 'custom',
              key: 'rear_bumper_photo',
              type: 'url',
              value: rearPhotoUrl,
            },
            {
              namespace: 'custom',
              key: 'photos_uploaded_at',
              type: 'single_line_text_field',
              value: uploadDate,
            },
          ],
        },
      };

      const metafieldResponse = await fetch(
        `https://${SHOPIFY_STORE}/admin/api/${API_VERSION}/graphql.json`,
        {
          method: 'POST',
          headers: {
            'X-Shopify-Access-Token': ADMIN_TOKEN,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ query: metafieldMutation, variables: metafieldVariables }),
        }
      );

      if (metafieldResponse.ok) {
        const metafieldResult = await metafieldResponse.json();
        if (metafieldResult.data?.orderUpdate?.userErrors?.length > 0) {
          console.warn('Metafield creation warnings:', metafieldResult.data.orderUpdate.userErrors);
        } else {
          console.log('✅ Clickable image URLs added as metafields');
        }
      } else {
        console.warn('Failed to add metafields (non-critical):', await metafieldResponse.text());
      }
    } catch (metafieldError) {
      // Don't fail the whole operation if metafields fail
      console.warn('Failed to add metafields, but order updated:', metafieldError);
    }

    console.log(`✅ Successfully updated Shopify order ${orderId} with photo URLs`);
    return { success: true };
  } catch (error) {
    console.error('Error updating Shopify order:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}
