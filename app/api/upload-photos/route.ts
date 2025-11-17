import { NextRequest, NextResponse } from 'next/server';
import { validatePhotoToken, deletePhotoToken } from '@/lib/photoToken';
import { uploadToCloudinary } from '@/lib/cloudinary';
import { updateOrderWithPhotos } from '@/lib/shopify-admin';

interface UploadRequest {
  token: string;
  frontImage: string;
  rearImage: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: UploadRequest = await request.json();
    const { token, frontImage, rearImage } = body;

    // Validate required fields
    if (!token || !frontImage || !rearImage) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate token and get order data
    console.log('Validating photo upload token...');
    const tokenData = await validatePhotoToken(token);
    
    if (!tokenData) {
      return NextResponse.json(
        { error: 'Invalid or expired upload link' },
        { status: 404 }
      );
    }

    const { shopifyOrderId, shopifyOrderName } = tokenData;

    // Upload front bumper photo to Cloudinary
    console.log(`Uploading front bumper photo for order ${shopifyOrderName}...`);
    const frontPhotoUrl = await uploadToCloudinary(
      frontImage,
      shopifyOrderName,
      'front'
    );

    // Upload rear bumper photo to Cloudinary
    console.log(`Uploading rear bumper photo for order ${shopifyOrderName}...`);
    const rearPhotoUrl = await uploadToCloudinary(
      rearImage,
      shopifyOrderName,
      'rear'
    );

    // Update Shopify order with photo URLs
    console.log(`Updating Shopify order ${shopifyOrderId} with photo URLs...`);
    const updateResult = await updateOrderWithPhotos(
      shopifyOrderId,
      frontPhotoUrl,
      rearPhotoUrl
    );

    if (!updateResult.success) {
      console.error('Failed to update Shopify order:', updateResult.error);
      // Photos are uploaded but order update failed - log for manual review
      return NextResponse.json(
        {
          error: 'Photos uploaded but failed to update order. Support has been notified.',
          details: { frontPhotoUrl, rearPhotoUrl },
        },
        { status: 500 }
      );
    }

    // Delete token to prevent reuse
    console.log(`Deleting one-time use token ${token}...`);
    await deletePhotoToken(token);

    console.log(`Photo upload complete for order ${shopifyOrderName}`);
    
    return NextResponse.json({
      success: true,
      message: 'Photos uploaded successfully',
      urls: {
        front: frontPhotoUrl,
        rear: rearPhotoUrl,
      },
    });
  } catch (error) {
    console.error('Photo upload error:', error);
    return NextResponse.json(
      {
        error: 'Failed to process photo upload',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

// Allow larger payloads for base64 images (max ~10MB per image)
export const maxDuration = 60; // Extended timeout for image processing

