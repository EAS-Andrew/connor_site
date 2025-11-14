# StealthShield - Quick Start Guide

## 🚀 Get Started in 3 Steps

### 1. Install Dependencies
```bash
cd stealthshield
npm install
```

### 2. Run Development Server
```bash
npm run dev
```

### 3. Open in Browser
Navigate to [http://localhost:3000](http://localhost:3000)

## 🎯 What You'll See

### Landing Page (`/`)
- Hero section with "Invisible Strength" tagline
- Brand value propositions (Discretion, Precision, Performance)
- Product overview (Pre-cut Kits & PPF Rolls)
- Clear CTAs to configure kits

### Pre-Cut Configuration (`/pre-cut`)
A 4-step guided process:

1. **Registration Lookup** - Enter UK vehicle registration
2. **Confirm Vehicle** - Verify retrieved details
3. **Configure Protection** - Choose coverage level (£599-£1599) and material finish (Gloss/Matte)
4. **Review Order** - Summary before checkout

## 🧪 Demo Mode

Try these test registrations:
- `AB12CDE` → BMW 3 Series 2022
- `XY34FGH` → Audi A4 2021
- `CD56IJK` → Mercedes C-Class 2023
- Any other → Generic Vehicle 2022

## 📱 Test Responsive Design

**Resize your browser to test:**
- Mobile: < 768px (hamburger menu)
- Tablet: 768px - 1023px
- Desktop: 1024px+

**Or use browser dev tools:**
- Chrome: F12 → Toggle device toolbar
- Safari: Develop → Enter Responsive Design Mode

## 🎨 Brand Colors

Quick reference for development:
```css
--stealth-black: #0A0A0A   /* Primary background */
--radar-grey: #2B2B2D       /* Secondary background */
--ghost-white: #F3F3F3      /* Primary text */
--infrared: #D6422F         /* Accent/CTA */
```

## 🔧 Key Files to Know

```
app/page.tsx           → Landing page
app/pre-cut/page.tsx   → Configuration flow
components/            → Reusable UI components
lib/api.ts             → Vehicle lookup (stubbed)
app/globals.css        → Brand design tokens
```

## ⚠️ Integration Notes

### Vehicle Smart API
Currently stubbed in `lib/api.ts`. To integrate:
1. Get API credentials from Vehicle Smart
2. Replace `lookupVehicleByRegistration()` function
3. Update error handling for real responses

### Shopify
Checkout currently disabled. To integrate:
1. Set up Shopify store
2. Add products to catalog
3. Configure checkout SDK
4. Connect to pre-cut flow Step 4

## 📦 Build for Production

```bash
npm run build
npm start
```

## 🆘 Need Help?

Check the main README.md for:
- Full feature documentation
- Component usage examples
- Project structure details
- Deployment instructions

---

**Ready to protect?** Start configuring your kit! 🥷

