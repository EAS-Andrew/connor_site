# Shopify Admin API Token Setup

## Problem
The photo upload works, but updating the Shopify order fails with "Forbidden" error because the Admin API token doesn't have the necessary permissions.

## Solution: Create Custom App with Admin API Access

### Step 1: Create a Custom App in Shopify

1. **Go to Shopify Admin** → Settings → Apps and sales channels
2. Click **"Develop apps"** (top right)
3. If prompted, click **"Allow custom app development"**
4. Click **"Create an app"**
5. Name it: `StealthShield Photo Upload`
6. Click **"Create app"**

### Step 2: Configure Admin API Scopes

1. Click on **"Configuration"** tab
2. Under **"Admin API access scopes"**, click **"Configure"**
3. **Required scopes** - Search and enable these:
   - ✅ `write_orders` - Update orders (add notes, tags)
   - ✅ `read_orders` - Read order details

4. Click **"Save"**

### Step 3: Install the App

1. Click **"API credentials"** tab at the top
2. Click **"Install app"** button
3. Confirm the installation

### Step 4: Get the Admin API Access Token

1. Under **"Admin API access token"** section
2. Click **"Reveal token once"** (you only get to see this once!)
3. **Copy the token** - it starts with `shpat_`
4. Save it securely

### Step 5: Update Environment Variables

**Local Development (`.env.local`):**
```bash
SHOPIFY_ADMIN_ACCESS_TOKEN=shpat_your_new_token_here
```

**Vercel (Production):**
1. Go to Vercel Dashboard → Your Project → Settings → Environment Variables
2. Find `SHOPIFY_ADMIN_ACCESS_TOKEN`
3. Click Edit → Update with new token
4. Set for: **Production**, **Preview**, **Development**
5. Click **"Save"**

**Important:** After updating Vercel env vars, you need to redeploy:
- Go to Deployments tab
- Click the 3 dots on latest deployment → **"Redeploy"**

### Step 6: Test

1. Place a test order through pre-cut flow
2. Upload bumper photos
3. Check Shopify Admin → Orders → Your order
4. Should see photo URLs in order notes and `photos-uploaded` tag

---

## Troubleshooting

### "Forbidden" Error
- Token doesn't have `write_orders` scope
- Token expired or invalid
- App not installed properly

**Fix:** Create new custom app with proper scopes (follow steps above)

### "Not Found" Error
- Wrong store domain
- Order ID is incorrect
- API version mismatch

**Fix:** Verify `NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN` in env vars

### Photos Upload but Order Not Updated
- Check Vercel logs for exact error
- Verify admin token is set in Vercel (not just local)
- Ensure token starts with `shpat_`

---

## What Gets Updated in Shopify Order

When photos are successfully uploaded:

**Order Note:**
```
--- BUMPER PHOTOS ---
Front: https://res.cloudinary.com/.../1001_front.jpg
Rear: https://res.cloudinary.com/.../1001_rear.jpg
Uploaded: 2025-01-17T16:45:00.000Z
```

**Order Tag:**
```
photos-uploaded
```

**To View:**
1. Shopify Admin → Orders
2. Click order number
3. Scroll to **"Notes"** section
4. Click photo URLs to view images
5. Filter orders by `photos-uploaded` tag

---

## Security Notes

- ✅ Admin API token is server-side only (never exposed to client)
- ✅ Token stored in environment variables
- ✅ API route secured with webhook HMAC verification
- ✅ Photo upload token is one-time use with 7-day expiry

**Never** commit the admin token to git or expose it publicly!

---

## Current Status

✅ **New token created** with proper `write_orders` scope
- Token starts with `shpat_` (Admin API token)
- Has both `read_orders` and `write_orders` permissions

**Next steps:**
1. ✅ Updated in `.env.local` (local development)
2. ⏳ Update in Vercel environment variables (production)
3. ⏳ Redeploy and test

Once Vercel is updated, photos will upload to Cloudinary AND update Shopify orders automatically!

