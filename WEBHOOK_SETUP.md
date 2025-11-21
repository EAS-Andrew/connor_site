# Shopify Webhook Setup Guide

This guide explains how to set up automated follow-up emails for orders with vehicle data.

## Overview

When a customer places an order for a pre-cut PPF kit:
1. Shopify sends a webhook to your Next.js API
2. Your API extracts the vehicle data from the order
3. An automated email is sent to the customer asking them to verify their vehicle details

---

## Step 1: Set Up Email Service (Resend)

### Why Resend?
- Modern, developer-friendly API
- Free tier: 3,000 emails/month (100/day)
- No credit card required for free tier
- Excellent deliverability

### Setup Instructions:

1. **Sign up**: Go to [https://resend.com](https://resend.com)

2. **Get API Key**:
   - Dashboard → API Keys
   - Click "Create API Key"
   - Copy the key (starts with `re_`)

3. **Verify Domain** (Important for deliverability):
   - Dashboard → Domains
   - Add `stealthshieldppf.com`
   - Follow DNS setup instructions
   - Wait for verification (can take up to 48 hours)

4. **Update `.env.local`**:
   ```bash
   RESEND_API_KEY=re_your_actual_api_key_here
   ```

### Alternative Email Services:
If you prefer a different service, edit `lib/email.ts`:
- **SendGrid**: 100 emails/day free
- **Mailgun**: 1,000 emails/month free
- **AWS SES**: Very cheap, requires AWS account

---

## Step 2: Deploy Your API to Production

Your webhook endpoint needs to be publicly accessible. Options:

### Option A: Vercel (Recommended)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```
Your webhook URL will be: `https://your-domain.vercel.app/api/webhooks/orders`

### Option B: Other Platforms
- **Netlify**: Supports Next.js
- **AWS Amplify**: Full AWS integration
- **DigitalOcean App Platform**: Simple deployment

**Important**: Make sure to add your environment variables to your production deployment:
- `SHOPIFY_WEBHOOK_SECRET`
- `RESEND_API_KEY`

---

## Step 3: Configure Shopify Webhook

### In Shopify Admin:

1. **Go to Settings → Notifications**

2. **Scroll to "Webhooks" section**

3. **Click "Create webhook"**

4. **Configure**:
   - **Event**: `Order creation`
   - **Format**: `JSON`
   - **URL**: `https://your-domain.vercel.app/api/webhooks/orders`
   - **API Version**: `2025-01` (or latest stable)

5. **Save** and copy the **Webhook signing secret**

6. **Update `.env.local`** (and production env vars):
   ```bash
   SHOPIFY_WEBHOOK_SECRET=your_webhook_signing_secret_here
   ```

7. **Test the webhook**:
   - Click "Send test notification"
   - Check your server logs for confirmation

---

## Step 4: Test End-to-End

### Test in Development:

1. **Use ngrok** to expose your local server:
   ```bash
   # Install ngrok
   brew install ngrok  # or download from ngrok.com
   
   # Start your dev server
   npm run dev
   
   # In another terminal, expose port 3000
   ngrok http 3000
   ```

2. **Update Shopify webhook URL** to your ngrok URL:
   ```
   https://your-ngrok-url.ngrok.app/api/webhooks/orders
   ```

3. **Place a test order** with vehicle data

4. **Check**:
   - Server logs for webhook received
   - Email inbox for follow-up email
   - Spam folder (first emails often land there)

### Test in Production:

1. **Deploy to Vercel/your platform**
2. **Update webhook URL** to production URL
3. **Place a test order**
4. **Verify email received**

---

## What the Email Contains

The automated email includes:
- ✅ Order number and date
- ✅ Complete vehicle details (make, model, year, variant, registration)
- ✅ Request to verify information
- ✅ Warning about modifications (body kits, etc.)
- ✅ Clear call-to-action (reply if incorrect)
- ✅ Branded StealthShield design

---

## Monitoring & Logs

### Check Webhook Deliveries:
- Shopify Admin → Settings → Notifications → Webhooks
- Click on your webhook
- View "Recent deliveries" tab
- Shows success/failure status and response codes

### Check Email Deliveries:
- Resend Dashboard → Emails
- See delivery status, opens, bounces
- Debug failed sends

### Server Logs:
```bash
# Vercel
vercel logs

# Or check your hosting platform's logs
```

---

## Troubleshooting

### Webhook Not Received:
1. Check URL is correct and publicly accessible
2. Verify webhook is enabled in Shopify
3. Check webhook signing secret matches `.env`
4. Look for 401 errors (failed verification)

### Email Not Sent:
1. Check `RESEND_API_KEY` is set correctly
2. Verify domain is verified in Resend
3. Check spam folder
4. Review Resend dashboard for errors

### Webhook Verification Failed:
1. Ensure `SHOPIFY_WEBHOOK_SECRET` is correct
2. Don't modify the request body before verification
3. Check for middleware that might alter the request

---

## Customizing the Email

Edit `lib/email.ts` to customize:
- Email subject line
- HTML template design
- Content and messaging
- From address (after domain verification)

---

## Security Best Practices

1. ✅ **Always verify webhook signature** (already implemented)
2. ✅ **Use environment variables** for secrets
3. ✅ **Keep webhook secret private**
4. ✅ **Monitor webhook delivery failures**
5. ✅ **Rate limit your endpoint** (optional, for high traffic)

---

## Cost Breakdown

### Free Tier:
- **Resend**: 3,000 emails/month, 100/day
- **Vercel**: Generous free tier, ~100GB bandwidth
- **Total**: £0/month for moderate traffic

### Paid (if needed):
- **Resend**: From $20/month for 50,000 emails
- **Vercel**: From $20/month for more bandwidth
- **Estimate**: ~£20-40/month for 1,000 orders/month

---

## Next Steps

1. ✅ Set up Resend account
2. ✅ Get API key and webhook secret
3. ✅ Update environment variables
4. ✅ Deploy to production
5. ✅ Configure Shopify webhook
6. ✅ Test with real order
7. ✅ Monitor deliverability

---

## Support

Need help? Common issues:
- **Domain verification delays**: Can take 24-48 hours
- **Emails in spam**: Normal for first sends, improves over time
- **Webhook timeouts**: Keep processing under 5 seconds

For more help:
- Resend docs: https://resend.com/docs
- Shopify webhook docs: https://shopify.dev/docs/apps/webhooks


