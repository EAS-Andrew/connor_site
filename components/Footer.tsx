import Link from 'next/link';

export function Footer() {
  return (
    <footer className="bg-stealth-black border-t border-radar-grey-dark mt-16 sm:mt-24 relative">
      {/* Angular corner accents */}
      <div className="absolute top-0 left-4 w-8 h-8 border-l border-t border-infrared/30"></div>
      <div className="absolute top-0 right-4 w-8 h-8 border-r border-t border-infrared/30"></div>

      <div className="container mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 sm:gap-12">
          <div>
            <h3 className="font-heading text-lg sm:text-xl mb-3 sm:mb-4 text-ghost-white tracking-wider">STEALTHSHIELD</h3>
            <p className="text-radar-grey-light text-sm leading-relaxed">
              Invisible Strength.<br />
              Precision-engineered PPF protection.
            </p>
          </div>

          <div>
            <h4 className="font-heading text-[10px] sm:text-xs uppercase mb-3 sm:mb-4 text-infrared tracking-[0.3em]">System_Access</h4>
            <ul className="space-y-2">
              <li><Link href="/pre-cut" className="text-radar-grey-light hover:text-infrared transition-colors text-sm uppercase tracking-wider">Mission Control</Link></li>
              <li><Link href="/#products" className="text-radar-grey-light hover:text-infrared transition-colors text-sm uppercase tracking-wider">Systems</Link></li>
              <li><Link href="/#capabilities" className="text-radar-grey-light hover:text-infrared transition-colors text-sm uppercase tracking-wider">Capabilities</Link></li>
            </ul>
          </div>

          <div className="sm:col-span-2 md:col-span-1">
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
    </footer>
  );
}

