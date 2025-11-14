# StealthShield PPF E-Commerce Site

A premium, dark-themed e-commerce website for Paint Protection Film (PPF) sales, built with Next.js 14, TypeScript, and Tailwind CSS.

## 🎯 Project Overview

StealthShield is a performance-driven, stealth-inspired PPF brand featuring:
- Modern, minimalist dark UI with angular design elements
- Guided pre-cut PPF kit configuration process
- Vehicle registration lookup integration (stubbed for demo)
- Fully responsive design (mobile, tablet, desktop)

## 🎨 Brand Identity

**Brand Values:**
- **Discretion** - Subtle, sleek protection
- **Precision** - Engineered for perfect fit
- **Performance** - High-end durability and speed

**Color Palette:**
- Stealth Black: `#0A0A0A`
- Radar Grey: `#2B2B2D`
- Ghost White: `#F3F3F3`
- Infrared Accent: `#D6422F`

**Typography:**
- Headings: Sora Bold
- Body: Inter Regular

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Navigate to the project directory
cd stealthshield

# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📁 Project Structure

```
stealthshield/
├── app/
│   ├── layout.tsx          # Root layout with fonts
│   ├── page.tsx            # Landing page
│   ├── pre-cut/
│   │   └── page.tsx        # Pre-cut configuration flow
│   └── globals.css         # Global styles & brand tokens
├── components/
│   ├── Button.tsx          # Primary/secondary button variants
│   ├── Card.tsx            # Card component with hover states
│   ├── StepIndicator.tsx   # Multi-step progress indicator
│   ├── Header.tsx          # Navigation with mobile menu
│   ├── Footer.tsx          # Site footer
│   ├── PageLayout.tsx      # Page wrapper with header/footer
│   └── index.ts            # Component exports
├── lib/
│   └── api.ts              # API functions (currently stubbed)
└── public/                 # Static assets
```

## ✨ Features

### Landing Page
- Hero section with bold tagline and CTAs
- "Why Us" section highlighting brand values (Discretion, Precision, Performance)
- Product overview (Pre-cut kits & PPF rolls)
- Clear call-to-action sections

### Pre-Cut Configuration Flow

**Step 1: Vehicle Registration Lookup**
- UK registration input
- Stubbed Vehicle Smart API integration
- Demo registrations: `AB12CDE`, `XY34FGH`, `CD56IJK`

**Step 2: Vehicle Confirmation**
- Display retrieved vehicle details
- Option to modify if incorrect

**Step 3: Coverage & Material Selection**
- Three coverage tiers:
  - **Front End PPF** (£599) - Front Bumper, Bonnet, Headlights, Mirror Caps, Front Wings, Front A Pillar & Edge Of Roof
  - **Extended Front End PPF** (£899) - Everything in Front End PPF + Front Doors + Skirts
  - **Premium Full Car Cover** (£1599) - All Panels Covered (Excluding Glass)
- Material options:
  - **Gloss PPF** - Clear, glossy protection with high durability
  - **Matte PPF** - Satin/matte finish for a unique look while protecting
- Visual comparison with included items
- Progressive reveal of material selection after coverage choice

**Step 4: Review & Summary**
- Order summary
- Next steps explanation
- Checkout placeholder (Shopify integration pending)

## 🔌 Integration Points

### Vehicle Smart API (Currently Stubbed)
Location: `lib/api.ts` - `lookupVehicleByRegistration()`

**TODO:** Replace stub with actual Vehicle Smart API integration
- API endpoint configuration
- Authentication setup
- Error handling for real API responses

### Shopify Integration (Pending)
The pre-cut flow is fully functional but requires:
- Shopify store setup
- Product catalog integration
- Checkout flow connection
- Inventory management sync

## 📱 Responsive Design

Fully optimized for:
- **Mobile**: 320px - 767px (hamburger menu, stacked layouts)
- **Tablet**: 768px - 1023px (2-column grids)
- **Desktop**: 1024px+ (full navigation, 3-column grids)

Key responsive features:
- Mobile-friendly navigation with hamburger menu
- Adaptive typography and spacing
- Touch-optimized buttons and interactions
- Optimized step indicator for small screens

## 🎨 Design System

### Components

**Button**
```tsx
<Button variant="primary" size="lg">Click Me</Button>
<Button variant="secondary" size="md">Secondary</Button>
```

**Card**
```tsx
<Card hover>Content here</Card>
```

**StepIndicator**
```tsx
<StepIndicator steps={steps} currentStep={2} />
```

### Color Usage
- Use `bg-stealth-black` for primary backgrounds
- Use `bg-radar-grey` for card/section backgrounds
- Use `text-ghost-white` for primary text
- Use `text-infrared` for accents and CTAs

## 🔧 Development

### Build for Production
```bash
npm run build
npm start
```

### Linting
```bash
npm run lint
```

## 📝 Notes

### Demo Mode
The vehicle lookup currently uses mock data. Try these registrations:
- `AB12CDE` → BMW 3 Series 2022
- `XY34FGH` → Audi A4 2021
- `CD56IJK` → Mercedes-Benz C-Class 2023
- Any other registration → Generic Vehicle 2022

### Post-Purchase Flow (Planned)
After checkout completion, customers will receive automated emails requesting:
- Front and rear bumper photos
- Sensor/radar confirmation
- Trim-specific variation details

This ensures accurate kit matching while minimizing friction during initial purchase.

## 🚧 Roadmap

- [ ] Integrate Vehicle Smart API with real credentials
- [ ] Connect Shopify checkout and inventory
- [ ] Add PPF rolls product catalog
- [ ] Implement FAQ page
- [ ] Add warranty information page
- [ ] Create contact form
- [ ] Optional project gallery
- [ ] Email automation for post-purchase vehicle confirmation

## 📄 License

Private project for StealthShield PPF.

## 🤝 Contributing

This is a client project. Contact the project owner for contribution guidelines.

---

Built with precision. Engineered in the shadows. 🥷
