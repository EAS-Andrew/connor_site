# Quick Shopify Webhook Configuration

## What This Does
When a customer orders a pre-cut kit, Shopify will automatically:
1. Trigger a webhook to your server
2. Send the customer an email asking them to verify their vehicle details
3. Request photos of front/rear bumpers

## Step-by-Step Setup

### Step 1: Get Your Webhook URL

First, you need your production URL. If deployed on Vercel:
```
https://your-domain.vercel.app/api/webhooks/orders
```

Replace `your-domain` with your actual Vercel domain or custom domain.

### Step 2: Configure in Shopify Admin

1. **Login to Shopify Admin**
   - Go to https://1qitbu-1i.myshopify.com/admin

2. **Navigate to Settings**
   - Click **Settings** (bottom left)
   - Click **Notifications**

3. **Scroll to Webhooks Section**
   - Scroll all the way down
   - Find the **"Webhooks"** section

4. **Create New Webhook**
   - Click **"Create webhook"** button

5. **Fill in the Details**:
   ```
   Event: Order creation
   Format: JSON
   URL: https://your-domain.vercel.app/api/webhooks/orders
   Webhook API version: 2025-01 (or latest stable)
   ```

6. **Save the Webhook**
   - Click **"Save"**

7. **Copy the Signing Secret**
   - After saving, you'll see a **"Webhook signing secret"**
   - Click **"Show"** or copy button
   - It will look like: `shpss_1234567890abcdef...`
   - **Keep this secret safe!**

### Step 3: Add Secrets to Your Environment

#### For Local Development (`.env.local`):

```bash
# Add this to your .env.local file
SHOPIFY_WEBHOOK_SECRET=shpss_your_actual_secret_here
```

#### For Production (Vercel):

1. Go to **Vercel Dashboard**
2. Select your project
3. Go to **Settings** → **Environment Variables**
4. Add:
   ```
   Name: SHOPIFY_WEBHOOK_SECRET
   Value: shpss_your_actual_secret_here
   Environment: Production
   ```
5. Click **Save**

### Step 4: Set Up Email Service (Resend)

#### Create Resend Account:

1. Go to https://resend.com
2. Sign up (free - 3,000 emails/month)
3. Go to **API Keys**
4. Click **"Create API Key"**
5. Copy the key (starts with `re_`)

#### Add to Environment:

**Local (`.env.local`):**
```bash
RESEND_API_KEY=re_your_actual_key_here
```

**Production (Vercel):**
- Add as environment variable (same as webhook secret above)

### Step 5: Verify Domain (Important!)

For emails to not go to spam:

1. **In Resend Dashboard**:
   - Go to **Domains**
   - Click **"Add Domain"**
   - Enter: `stealthshieldppf.com` (or your domain)

2. **Add DNS Records**:
   - Resend will show you DNS records to add
   - Go to your domain registrar (Namecheap, GoDaddy, etc.)
   - Add the records Resend provides
   - Wait 24-48 hours for verification

3. **Update Email Sender** (in `lib/email.ts`):
   ```typescript
   from: 'orders@stealthshieldppf.com'  // After domain verified
   ```

### Step 6: Deploy to Production

```bash
# If using Vercel
git add .
git commit -m "Configure webhooks and email"
git push

# Vercel will auto-deploy
```

Or manually:
```bash
vercel --prod
```

### Step 7: Test the Webhook

#### Option A: Use Shopify's Test Feature

1. In Shopify Webhook settings
2. Click your webhook
3. Click **"Send test notification"**
4. Check Vercel logs:
   ```bash
   vercel logs --follow
   ```

#### Option B: Place a Test Order

1. Go to your website
2. Add a pre-cut kit to cart
3. Enter a test registration (e.g., `AB12CDE`)
4. Complete checkout
5. Check your email!

## Webhook URL Examples

### Development (with ngrok):
```
https://abc123.ngrok.app/api/webhooks/orders
```

### Production (Vercel):
```
https://stealthshield.vercel.app/api/webhooks/orders
```

### Production (Custom Domain):
```
https://stealthshieldppf.com/api/webhooks/orders
```

## Troubleshooting

### Webhook Not Working?

**Check Webhook Deliveries**:
1. Shopify Admin → Settings → Notifications
2. Click on your webhook
3. Go to **"Recent deliveries"** tab
4. Look for errors

**Common Issues**:

❌ **401 Unauthorized**
- Webhook secret doesn't match
- Check `SHOPIFY_WEBHOOK_SECRET` in production env vars

❌ **404 Not Found**
- URL is wrong
- Check your domain/path

❌ **500 Server Error**
- Check Vercel logs: `vercel logs`
- Email service might not be configured

### Email Not Sending?

**Check**:
1. Is `RESEND_API_KEY` set in production?
2. Is domain verified in Resend?
3. Check spam folder
4. Check Resend dashboard for errors

### Test Locally with ngrok:

```bash
# Terminal 1: Start dev server
npm run dev

# Terminal 2: Expose to internet
npx ngrok http 3000

# Use ngrok URL in Shopify webhook settings
```

## Quick Checklist

✅ Webhook created in Shopify
✅ Webhook secret copied
✅ `SHOPIFY_WEBHOOK_SECRET` added to production env
✅ Resend account created
✅ `RESEND_API_KEY` added to production env
✅ Domain verified in Resend (optional but recommended)
✅ Code deployed to production
✅ Test order placed successfully
✅ Email received!

## What the Customer Receives

Subject: **"Verify Your Vehicle Details - Order #1234"**

Contents:
- Order confirmation
- Vehicle details (from registration lookup)
- Request to verify accuracy
- Request for bumper photos
- Reply-to email address

## Monitoring

### Check Webhook Status:
- Shopify Admin → Settings → Notifications → Webhooks
- View delivery history and success rate

### Check Email Status:
- Resend Dashboard → Emails
- See opens, deliveries, bounces

### Check Server Logs:
```bash
vercel logs --follow
```

## Cost

**Free Tier**:
- Resend: 3,000 emails/month, 100/day
- Vercel: Free tier usually sufficient
- Total: **£0/month** for moderate traffic

## Need Help?

Common issues:
1. **"Email goes to spam"** - Normal for first few emails, improves over time
2. **"Webhook verification fails"** - Check secret matches exactly
3. **"Domain verification pending"** - Can take 24-48 hours

Done! 🎉 Your orders will now automatically trigger vehicle verification emails.

