# StealthShield PPF

Premium paint protection film e-commerce site for cars and motorcycles. Built with Next.js 16, React 19, and Shopify Storefront API.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router) |
| UI | React 19, TypeScript 5 |
| Styling | Tailwind CSS v4, PostCSS |
| Fonts | Sora (headings), Inter (body) via next/font |
| Commerce | Shopify Storefront API (cart, checkout), Admin API (order updates) |
| Caching | Redis (ioredis) for vehicle lookups, rate limiting, photo tokens |
| Media | Cloudinary for customer photo uploads |
| Email | Resend for transactional emails |
| Vehicle Data | UK Vehicle Data API for registration lookups |
| Analytics | Vercel Analytics + Speed Insights |
| Deployment | Vercel |

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Environment Variables

```
NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN=
NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN=
SHOPIFY_ADMIN_ACCESS_TOKEN=
SHOPIFY_WEBHOOK_SECRET=
REDIS_URL=
UK_VEHICLE_DATA_API_KEY=
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
RESEND_API_KEY=
NEXT_PUBLIC_SITE_URL=
```

## Project Structure

```
app/
  page.tsx              # Homepage (server component)
  pre-cut/              # Kit configuration flow
  rolls/                # PPF rolls for professionals
  cart/                 # Shopping cart
  checkout/             # Checkout with Shopify redirect
  upload-photos/        # Post-purchase bumper photo upload
  about/, faq/, contact/, how-it-works/
  api/
    vehicle-lookup/     # UK reg lookup with Redis caching
    upload-photos/      # Cloudinary upload + Shopify order update
    validate-token/     # One-time photo upload token validation
    webhooks/orders/    # Shopify order webhook handler
components/
  home/                 # Homepage section components
    FaqAccordion.tsx     # Interactive FAQ (client)
    TierTabs.tsx         # Coverage tier switching (client)
  Header.tsx, Footer.tsx, PageLayout.tsx
  ComparisonSlider.tsx   # Before/after image slider
  ScrollToTop.tsx        # Floating scroll-to-top button
  CookieConsent.tsx      # GDPR cookie consent banner
lib/
  shopify.ts            # Storefront API GraphQL client
  shopify-admin.ts      # Admin API for order updates
  cart.ts               # Cart state with event-driven updates
  api.ts                # Vehicle lookup + coverage options
  rate-limit.ts         # Shared Redis rate limiter
  cloudinary.ts, email.ts, photoToken.ts, ukvehicledata.ts
```

## Brand Identity

- **Stealth Black** `#0A0A0A` -- primary background
- **Radar Grey** `#2B2B2D` -- card/section backgrounds
- **Ghost White** `#F3F3F3` -- primary text
- **Infrared** `#D6422F` -- accent and CTAs

## Key Features

- Registration-verified PPF kit ordering with Shopify checkout
- Server-rendered homepage with client islands for interactivity
- Optimised images via next/image (AVIF/WebP)
- SEO: sitemap, robots.txt, JSON-LD structured data, canonical URLs
- Security headers, timing-safe webhook verification, Redis rate limiting
- Event-driven cart state (no polling)
- Branded 404/error pages, loading skeletons
- GDPR cookie consent banner

## License

Private project for StealthShield PPF.
