import Link from 'next/link';

export function Footer() {
  return (
    <footer className="bg-stealth-black border-t border-radar-grey-dark mt-16 sm:mt-24 relative">
      <div className="container mx-auto px-4 sm:px-6 py-8 sm:py-12 relative">
        {/* Angular corner accents */}
        <div className="absolute top-4 left-4 w-8 h-8 border-l border-t border-infrared/30"></div>
        <div className="absolute top-4 right-4 w-8 h-8 border-r border-t border-infrared/30"></div>
        
        {/* Trust Badges */}
        <div className="px-4 sm:px-6 pt-4 pb-8 mb-8 border-b border-radar-grey-dark">
          <div className="flex flex-wrap justify-center gap-6 sm:gap-8 lg:gap-12">
            <div className="flex items-center gap-2 sm:gap-3">
              <svg className="w-5 h-5 text-infrared flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="text-ghost-white text-xs sm:text-sm font-heading uppercase tracking-wider">
                Secure Checkout
              </span>
            </div>
            <div className="flex items-center gap-2 sm:gap-3">
              <svg className="w-5 h-5 text-infrared flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
              </svg>
              <span className="text-ghost-white text-xs sm:text-sm font-heading uppercase tracking-wider">
                UK-Based Support
              </span>
            </div>
            <div className="flex items-center gap-2 sm:gap-3">
              <svg className="w-5 h-5 text-infrared flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
                <path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1V5a1 1 0 00-1-1H3zM14 7a1 1 0 00-1 1v6.05A2.5 2.5 0 0115.95 16H17a1 1 0 001-1v-5a1 1 0 00-.293-.707l-2-2A1 1 0 0015 7h-1z" />
              </svg>
              <span className="text-ghost-white text-xs sm:text-sm font-heading uppercase tracking-wider">
                Fast Delivery (2-3 Days)
              </span>
            </div>
          </div>
        </div>

        <div className="px-4 sm:px-6 pt-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 sm:gap-12">
            <div>
              <div className="flex items-center gap-3 mb-3 sm:mb-4">
                <div className="w-10 h-10 flex-shrink-0">
                  <img src="/logo.svg" alt="StealthShield Logo" className="w-full h-full" />
                </div>
                <h3 className="font-heading text-lg sm:text-xl text-ghost-white tracking-wider">STEALTHSHIELD</h3>
              </div>
              <p className="text-radar-grey-light text-sm leading-relaxed">
                Invisible Strength.<br />
                Precision-engineered PPF protection.
              </p>
            </div>

            <div>
                <h4 className="font-heading text-[10px] sm:text-xs uppercase mb-3 sm:mb-4 text-infrared tracking-[0.3em]">Product</h4>
                <ul className="space-y-2">
                  <li><Link href="/pre-cut" className="text-radar-grey-light hover:text-infrared transition-colors text-sm uppercase tracking-wider">Configure Kit</Link></li>
                  <li><Link href="/how-it-works" className="text-radar-grey-light hover:text-infrared transition-colors text-sm uppercase tracking-wider">How It Works</Link></li>
                  <li><Link href="/#products" className="text-radar-grey-light hover:text-infrared transition-colors text-sm uppercase tracking-wider">Products</Link></li>
                </ul>
            </div>

            <div>
                <h4 className="font-heading text-[10px] sm:text-xs uppercase mb-3 sm:mb-4 text-infrared tracking-[0.3em]">Company</h4>
                <ul className="space-y-2">
                  <li><Link href="/about" className="text-radar-grey-light hover:text-infrared transition-colors text-sm uppercase tracking-wider">About</Link></li>
                  <li><Link href="/faq" className="text-radar-grey-light hover:text-infrared transition-colors text-sm uppercase tracking-wider">FAQ</Link></li>
                  <li><Link href="/contact" className="text-radar-grey-light hover:text-infrared transition-colors text-sm uppercase tracking-wider">Contact</Link></li>
                </ul>
            </div>

            <div>
              <h4 className="font-heading text-[10px] sm:text-xs uppercase mb-3 sm:mb-4 text-infrared tracking-[0.3em]">Transmission</h4>
              <p className="text-radar-grey-light text-sm leading-relaxed">
                <span className="text-[10px] uppercase tracking-wider block mb-1">Status: Standby</span>
                info@stealthshieldppf.com
              </p>
            </div>
          </div>

          <div className="mt-8 sm:mt-12 pt-6 sm:pt-8 border-t border-radar-grey-dark">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="h-px w-12 bg-radar-grey-dark"></div>
              <div className="w-1 h-1 bg-infrared rotate-45"></div>
              <div className="h-px w-12 bg-radar-grey-dark"></div>
            </div>
            <p className="text-radar-grey-light text-xs sm:text-sm text-center">
              &copy; {new Date().getFullYear()} StealthShield. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

