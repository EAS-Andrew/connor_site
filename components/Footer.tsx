import Link from 'next/link';

export function Footer() {
  return (
    <footer className="bg-stealth-black border-t border-radar-grey-dark mt-16 sm:mt-24 relative">
      <div className="container mx-auto px-4 sm:px-6 py-8 sm:py-12 relative">
        {/* Angular corner accents */}
        <div className="absolute top-4 left-4 w-8 h-8 border-l border-t border-infrared/30"></div>
        <div className="absolute top-4 right-4 w-8 h-8 border-r border-t border-infrared/30"></div>
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
                info@stealthshield.com
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

