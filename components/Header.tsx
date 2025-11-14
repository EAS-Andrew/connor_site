'use client';

import { useState } from 'react';
import Link from 'next/link';

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-stealth-black/95 backdrop-blur-sm border-b border-radar-grey">
      <nav className="container mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center" onClick={() => setIsMenuOpen(false)}>
          <span className="font-heading text-xl sm:text-2xl text-ghost-white tracking-wider">
            STEALTHSHIELD
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-6 lg:gap-8">
            <Link 
              href="/pre-cut" 
              className="text-ghost-white hover:text-infrared transition-colors duration-200 font-sans text-sm uppercase tracking-wider"
            >
              Configure Kit
            </Link>
          <Link
            href="/how-it-works"
            className="text-ghost-white hover:text-infrared transition-colors duration-200 font-sans text-sm uppercase tracking-wider"
          >
            How It Works
          </Link>
          <Link
            href="/about"
            className="text-ghost-white hover:text-infrared transition-colors duration-200 font-sans text-sm uppercase tracking-wider"
          >
            About
          </Link>
          <Link
            href="/faq"
            className="text-ghost-white hover:text-infrared transition-colors duration-200 font-sans text-sm uppercase tracking-wider"
          >
            FAQ
          </Link>
          <Link
            href="/contact"
            className="text-ghost-white hover:text-infrared transition-colors duration-200 font-sans text-sm uppercase tracking-wider"
          >
            Contact
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="md:hidden text-ghost-white p-2"
          aria-label="Toggle menu"
        >
          <div className="w-6 h-5 flex flex-col justify-between">
            <span className={`block h-0.5 w-full bg-ghost-white transition-all duration-300 ${isMenuOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
            <span className={`block h-0.5 w-full bg-ghost-white transition-all duration-300 ${isMenuOpen ? 'opacity-0' : ''}`}></span>
            <span className={`block h-0.5 w-full bg-ghost-white transition-all duration-300 ${isMenuOpen ? '-rotate-45 -translate-y-2' : ''}`}></span>
          </div>
        </button>
      </nav>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-radar-grey border-t border-stealth-black">
          <div className="container mx-auto px-4 py-4 flex flex-col gap-4">
            <Link 
              href="/pre-cut" 
              className="text-ghost-white hover:text-infrared transition-colors duration-200 font-sans py-2 text-sm uppercase tracking-wider"
              onClick={() => setIsMenuOpen(false)}
            >
              Configure Kit
            </Link>
            <Link
              href="/how-it-works"
              className="text-ghost-white hover:text-infrared transition-colors duration-200 font-sans py-2 text-sm uppercase tracking-wider"
              onClick={() => setIsMenuOpen(false)}
            >
              How It Works
            </Link>
            <Link
              href="/about"
              className="text-ghost-white hover:text-infrared transition-colors duration-200 font-sans py-2 text-sm uppercase tracking-wider"
              onClick={() => setIsMenuOpen(false)}
            >
              About
            </Link>
            <Link
              href="/faq"
              className="text-ghost-white hover:text-infrared transition-colors duration-200 font-sans py-2 text-sm uppercase tracking-wider"
              onClick={() => setIsMenuOpen(false)}
            >
              FAQ
            </Link>
            <Link
              href="/contact"
              className="text-ghost-white hover:text-infrared transition-colors duration-200 font-sans py-2 text-sm uppercase tracking-wider"
              onClick={() => setIsMenuOpen(false)}
            >
              Contact
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}

