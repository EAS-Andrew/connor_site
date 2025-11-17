# Photo Upload Workflow - Setup Guide

## Overview

Customers who order pre-cut PPF kits now receive an email asking them to upload photos of their front and rear bumpers. These photos help identify:
- Parking sensors and cameras
- Washer jets and tow hooks  
- Aftermarket modifications
- Other features requiring precise cutouts

## How It Works

1. **Customer orders pre-cut kit** → Vehicle data attached to order
2. **Shopify webhook fires** → Server generates secure photo upload token (7-day expiry)
3. **Email sent to customer** → Contains link to photo upload page
4. **Customer uploads photos** → Camera capture or file upload
5. **Photos stored in Cloudinary** → Organized by order number and date
6. **Shopify order updated** → Photos appear in order notes with "photos-uploaded" tag
7. **Token deleted** → One-time use security

## Setup Steps

### 1. Create Cloudinary Account

1. Go to https://cloudinary.com and sign up (free tier: 25 credits/month)
2. After signup, go to Dashboard → Settings → Access Keys
3. Copy these three values:
   - **Cloud Name** (e.g., `dxxxxx`)
   - **API Key** (e.g., `123456789012345`)
   - **API Secret** (e.g., `abcdefghijklmnopqrstuvwxyz`)

### 2. Update Environment Variables

Add to your `.env.local` file:

```bash
# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your_cloud_name_here
CLOUDINARY_API_KEY=your_api_key_here
CLOUDINARY_API_SECRET=your_api_secret_here

# Site URL (already set)
NEXT_PUBLIC_SITE_URL=https://stealthshieldppf.com
```

**Important**: Also add these to **Vercel Environment Variables**:
- Go to Vercel Dashboard → Project → Settings → Environment Variables
- Add `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`
- Set for: Production, Preview, Development

### 3. Deploy to Production

```bash
git add .
git commit -m "Add photo upload workflow"
git push
```

Vercel will automatically deploy the changes.

### 4. Test the Flow

1. Place a test order through the pre-cut flow
2. Check your email for "Upload Bumper Photos" email
3. Click the link and upload test photos
4. Verify photos appear in Shopify order notes

## Features

### Photo Upload Page

**Mobile-Optimized**: Works perfectly on phones (primary use case)

**Two Capture Modes**:
- **Camera Mode**: Live camera with bumper overlay guide
  - Uses device's back camera on mobile
  - Real-time overlay showing ideal framing
  - One-tap capture
- **File Upload Mode**: Standard file picker
  - Fallback for desktop users
  - Works with existing photos

**Validation**:
- Max 10MB per image
- Image format checking
- Preview before submission
- Retake option

### Security

- **Token-Based**: Unique, secure UUID tokens
- **Time-Limited**: 7-day expiry
- **One-Time Use**: Token deleted after upload
- **Redis Storage**: Token data stored securely
- **Webhook Verification**: HMAC signature validation

### Image Organization

Cloudinary folder structure:
```
/stealthshield/orders/
  /2025/
    /01/
      1001_front.jpg
      1001_rear.jpg
    /02/
      1002_front.jpg
      1002_rear.jpg
```

## Shopify Integration

### Order Updates

When photos are uploaded, the Shopify order is automatically updated with:

**Order Note**:
```
--- BUMPER PHOTOS ---
Front: https://res.cloudinary.com/.../1001_front.jpg
Rear: https://res.cloudinary.com/.../1001_rear.jpg
Uploaded: 2025-01-17T10:30:00.000Z
```

**Order Tag**: `photos-uploaded`

This allows you to:
- Filter orders by photo status
- Click URLs to view photos directly
- Track upload timestamp

### Viewing Photos in Shopify Admin

1. Go to Orders → Click order number
2. Scroll to **Notes** section
3. Click photo URLs to open in new tab
4. Or filter by tag: `photos-uploaded`

## Troubleshooting

### Customer Can't Access Camera

**Symptoms**: "Unable to access camera" error

**Solutions**:
1. Customer should click "Upload Files" tab instead
2. Or grant camera permissions in browser settings
3. Or take photos separately and upload them

### Photos Not Appearing in Shopify

**Check**:
1. Verify Cloudinary credentials in Vercel env vars
2. Check Vercel logs for upload errors
3. Verify `SHOPIFY_ADMIN_ACCESS_TOKEN` is set
4. Test API manually: `curl https://your-site.com/api/upload-photos`

### Token Expired

**Symptoms**: "This link has expired" message

**Cause**: Customer waited more than 7 days to upload

**Solution**: Contact customer and manually generate new link, or have them reply to email

### Image Upload Fails

**Common Causes**:
- Cloudinary free tier limit reached (25 credits/month)
- Image too large (>10MB)
- Network timeout
- Invalid image format

**Solutions**:
1. Upgrade Cloudinary plan if needed
2. Ask customer to compress image
3. Retry upload
4. Check browser console for errors

## Email Customization

To customize the email content, edit `lib/email.ts`:

- Change subject line (line 166)
- Update email body HTML (lines 25-131)
- Modify button text (line 112)
- Add your logo/branding

## Cost Breakdown

### Cloudinary Free Tier
- **25 credits/month** = ~25,000 transformations
- 2 photos per order = ~12,500 orders/month covered
- Very unlikely to exceed free tier for typical volume

### Upgrade Options
If you exceed free tier:
- **Cloudinary Plus**: $99/month for 75,000 credits
- **Cloudinary Advanced**: Contact sales for higher volumes

### Storage
- Images stored indefinitely
- No storage fees on free tier up to 25GB
- 2MB avg per photo = ~12,000 orders before storage fees

## API Routes

### `/api/validate-token` (GET)
- Validates upload token
- Returns order data for display
- Used by upload page on load

### `/api/upload-photos` (POST)
- Receives base64 images
- Uploads to Cloudinary
- Updates Shopify order
- Deletes token

### `/api/webhooks/orders` (POST)
- Receives Shopify order creation webhook
- Generates photo token
- Sends email with upload link

## Files Created

```
lib/
  photoToken.ts          # Token generation/validation
  cloudinary.ts          # Image upload to Cloudinary
  shopify-admin.ts       # Shopify Admin API integration
  email.ts               # Updated for photo upload request

app/
  upload-photos/
    page.tsx             # Photo upload interface
  api/
    validate-token/
      route.ts           # Token validation endpoint
    upload-photos/
      route.ts           # Photo upload handler
    webhooks/
      orders/
        route.ts         # Updated with token generation

components/
  BumperOverlay.tsx      # Camera overlay guide
```

## Support

### Customer Questions

**"Why do you need photos?"**
To identify parking sensors, cameras, and modifications so we can precision-cut your kit with perfect cutouts.

**"Can I skip this?"**
Not recommended - without photos, the kit may not have proper cutouts and won't fit correctly.

**"My link expired"**
Contact us at hello@orders.stealthshieldppf.com and we'll send a new link.

### Technical Support

For issues or questions:
- Check Vercel deployment logs
- Verify all environment variables are set
- Test endpoints manually
- Contact Cloudinary support for upload issues

## Next Steps

1. ✅ Sign up for Cloudinary
2. ✅ Add credentials to `.env.local` and Vercel
3. ✅ Deploy to production
4. ✅ Test with real order
5. ✅ Monitor first few orders closely
6. ✅ Update email branding if desired

---

**Status**: All components implemented and ready for production use.

