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

interface ShopifyFile {
  id: string;
  url: string;
  alt: string;
}

/**
 * Upload image to Shopify Files from URL
 * This allows images to be stored in Shopify and displayed as thumbnails
 */
async function uploadImageToShopifyFiles(
  imageUrl: string,
  alt: string
): Promise<ShopifyFile | null> {
  if (!SHOPIFY_STORE || !ADMIN_TOKEN) {
    console.error('Shopify Admin API credentials not configured');
    return null;
  }

  try {
    const mutation = `
      mutation fileCreate($files: [FileCreateInput!]!) {
        fileCreate(files: $files) {
          files {
            id
            ... on MediaImage {
              image {
                url
                altText
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
      files: [
        {
          alt: alt,
          contentType: 'IMAGE',
          originalSource: imageUrl,
        },
      ],
    };

    const response = await fetch(
      `https://${SHOPIFY_STORE}/admin/api/${API_VERSION}/graphql.json`,
      {
        method: 'POST',
        headers: {
          'X-Shopify-Access-Token': ADMIN_TOKEN,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query: mutation, variables }),
      }
    );

    if (!response.ok) {
      console.error('Shopify file upload failed:', await response.text());
      return null;
    }

    const result = await response.json();
    
    if (result.data?.fileCreate?.userErrors?.length > 0) {
      console.error('Shopify file upload errors:', result.data.fileCreate.userErrors);
      return null;
    }

    const file = result.data?.fileCreate?.files?.[0];
    if (file && file.image) {
      return {
        id: file.id,
        url: file.image.url,
        alt: file.image.altText || alt,
      };
    }

    return null;
  } catch (error) {
    console.error('Error uploading to Shopify Files:', error);
    return null;
  }
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
    console.log('Step 1: Uploading images to Shopify Files...');
    
    // Upload images to Shopify Files for thumbnail display
    const [frontFile, rearFile] = await Promise.all([
      uploadImageToShopifyFiles(frontPhotoUrl, 'Front Bumper Photo'),
      uploadImageToShopifyFiles(rearPhotoUrl, 'Rear Bumper Photo'),
    ]);

    const endpoint = `https://${SHOPIFY_STORE}/admin/api/${API_VERSION}/orders/${orderId}.json`;

    console.log('Step 2: Fetching current order...');
    
    // Get the current order to preserve existing notes and tags
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

    // Prepare new note with photo URLs - formatted for easy viewing
    const uploadDate = new Date().toLocaleString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
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

    console.log('Step 3: Creating metafields for image thumbnails...');
    
    // Add metafields with Shopify File references for thumbnail display
    // This makes images show up as thumbnails in the Shopify admin order view
    if (frontFile && rearFile) {
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
                type: 'file_reference',
                value: frontFile.id,
              },
              {
                namespace: 'custom',
                key: 'rear_bumper_photo',
                type: 'file_reference',
                value: rearFile.id,
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
            console.log('✅ Image thumbnails added to order');
          }
        }
      } catch (metafieldError) {
        // Don't fail the whole operation if metafields fail
        console.warn('Failed to create metafields (thumbnails), but order updated:', metafieldError);
      }
    } else {
      console.warn('Shopify Files upload failed - thumbnails not available, but URLs saved in notes');
    }

    console.log(`✅ Successfully updated Shopify order ${orderId} with photo URLs and thumbnails`);
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

