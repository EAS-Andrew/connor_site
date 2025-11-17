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
   - ✅ `write_orders` - Update orders (add notes, tags, timeline comments)
   - ✅ `read_orders` - Read order details
   - ✅ `write_files` - Upload images to Shopify Files (for timeline attachments)

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
- Token doesn't have `write_orders` or `write_files` scope
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

**Order Timeline Comment (with image attachments):**
- A timeline comment is added with the message: "Customer uploaded bumper photos for precision cutting analysis."
- Front and rear bumper images are attached as **viewable thumbnails** in the timeline
- Click thumbnails to view full-size images

**Order Note (backup URLs):**
```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🚗 BUMPER ANALYSIS PHOTOS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📸 FRONT BUMPER
   https://res.cloudinary.com/.../1001_front.webp

📸 REAR BUMPER
   https://res.cloudinary.com/.../1001_rear.webp

⏰ Uploaded: 17/11/2025, 16:45:32
✅ Ready for precision cutting
```

**Order Tag:**
```
photos-uploaded
```

**To View:**
1. Shopify Admin → Orders
2. Click order number
3. Check **"Timeline"** - images appear as thumbnails in a comment
4. Scroll to **"Notes"** section for backup URLs
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

⚠️ **Token needs update** - Missing `write_files` scope!
- Current token has `read_orders` and `write_orders`
- **Need to add `write_files`** for uploading images to Shopify Files

**Required scopes:**
- ✅ `read_orders` - Read order details
- ✅ `write_orders` - Update orders (notes, tags, timeline)
- ⚠️ `write_files` - **MISSING** - Upload images to Shopify Files

**Next steps:**
1. Go to Shopify Admin → Settings → Apps → StealthShield Photo Upload
2. Configuration tab → Admin API access scopes → Configure
3. Enable `write_files` scope
4. Save and reinstall the app
5. Get new admin token (starts with `shpat_`)
6. Update `.env.local` and Vercel environment variables
7. Redeploy and test

Once updated with all three scopes, photos will upload to Cloudinary, appear as thumbnails in order timeline, AND update Shopify orders automatically!

