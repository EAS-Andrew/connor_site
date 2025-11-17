/**
 * Cloudinary Image Upload Integration
 * Handles uploading bumper photos to Cloudinary
 */

import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary
function configureCloudinary() {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  if (!cloudName || !apiKey || !apiSecret) {
    console.error('Cloudinary environment variables not configured');
    return false;
  }

  cloudinary.config({
    cloud_name: cloudName,
    api_key: apiKey,
    api_secret: apiSecret,
  });

  return true;
}

interface UploadResult {
  url: string;
  public_id: string;
}

/**
 * Upload image to Cloudinary
 * @param base64Image - Base64 encoded image string
 * @param orderNumber - Order number for organizing uploads
 * @param type - 'front' or 'rear' bumper
 * @returns Public URL of uploaded image
 */
export async function uploadToCloudinary(
  base64Image: string,
  orderNumber: string,
  type: 'front' | 'rear'
): Promise<string> {
  if (!configureCloudinary()) {
    throw new Error('Cloudinary not configured');
  }

  try {
    // Create folder structure: /stealthshield/orders/{year}/{month}/
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const folder = `stealthshield/orders/${year}/${month}`;

    // Clean order number for filename (remove #)
    const cleanOrderNumber = orderNumber.replace('#', '');
    const publicId = `${folder}/${cleanOrderNumber}_${type}`;

    console.log(`Uploading ${type} bumper photo for order ${orderNumber}...`);

    const result = await cloudinary.uploader.upload(base64Image, {
      public_id: publicId,
      folder: folder,
      resource_type: 'image',
      format: 'jpg',
      transformation: [
        {
          quality: 'auto:good',
          fetch_format: 'auto',
        }
      ],
      overwrite: true,
    }) as UploadResult;

    console.log(`Successfully uploaded to Cloudinary: ${result.url}`);
    return result.url;
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    throw new Error('Failed to upload image');
  }
}

/**
 * Delete image from Cloudinary
 * @param publicId - Public ID of the image to delete
 */
export async function deleteFromCloudinary(publicId: string): Promise<boolean> {
  if (!configureCloudinary()) {
    console.error('Cloudinary not configured for deletion');
    return false;
  }

  try {
    await cloudinary.uploader.destroy(publicId);
    console.log(`Deleted from Cloudinary: ${publicId}`);
    return true;
  } catch (error) {
    console.error('Cloudinary deletion error:', error);
    return false;
  }
}

