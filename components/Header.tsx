'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from './Button';
import { getCurrentCart } from '@/lib/cart';

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [productsOpen, setProductsOpen] = useState(false);
  const [learnOpen, setLearnOpen] = useState(false);

  useEffect(() => {
    async function loadCartCount() {
      try {
        const cart = await getCurrentCart();
        if (cart) {
          setCartCount(cart.totalQuantity);
        }
      } catch (error) {
        console.error('Failed to load cart:', error);
      }
    }
    
    loadCartCount();
    
    // Poll for cart updates every 2 seconds when on the page
    const interval = setInterval(loadCartCount, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-stealth-black/95 backdrop-blur-sm border-b border-radar-grey-dark">
      <nav className="container mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 group" onClick={() => setIsMenuOpen(false)}>
          <div className="w-8 h-8 sm:w-10 sm:h-10 flex-shrink-0">
            <img src="/logo.svg" alt="StealthShield Logo" className="w-full h-full group-hover:opacity-80 transition-opacity duration-200" />
          </div>
          <span className="font-heading text-xl sm:text-2xl text-ghost-white tracking-wider group-hover:text-infrared transition-colors duration-200">
            STEALTHSHIELD
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-6 lg:gap-8">
          {/* Products Dropdown */}
          <div 
            className="relative"
            onMouseEnter={() => setProductsOpen(true)}
            onMouseLeave={() => setProductsOpen(false)}
          >
            <button className="text-ghost-white hover:text-infrared transition-colors duration-200 font-sans text-sm uppercase tracking-wider flex items-center gap-1">
              Products
              <svg className={`w-3 h-3 transition-transform duration-200 ${productsOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {productsOpen && (
              <div className="absolute top-full left-0 pt-2 w-48">
                <div className="bg-radar-grey border border-radar-grey-dark shadow-xl">
                  <Link
                    href="/pre-cut"
                    className="block px-4 py-3 text-ghost-white hover:bg-stealth-black hover:text-infrared transition-colors text-sm uppercase tracking-wide border-b border-radar-grey-dark"
                  >
                    Pre-Cut Kits
                  </Link>
                  <Link
                    href="/rolls"
                    className="block px-4 py-3 text-ghost-white hover:bg-stealth-black hover:text-infrared transition-colors text-sm uppercase tracking-wide"
                  >
                    PPF Rolls
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* Learn Dropdown */}
          <div 
            className="relative"
            onMouseEnter={() => setLearnOpen(true)}
            onMouseLeave={() => setLearnOpen(false)}
          >
            <button className="text-ghost-white hover:text-infrared transition-colors duration-200 font-sans text-sm uppercase tracking-wider flex items-center gap-1">
              Learn
              <svg className={`w-3 h-3 transition-transform duration-200 ${learnOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {learnOpen && (
              <div className="absolute top-full left-0 pt-2 w-48">
                <div className="bg-radar-grey border border-radar-grey-dark shadow-xl">
                  <Link
                    href="/how-it-works"
                    className="block px-4 py-3 text-ghost-white hover:bg-stealth-black hover:text-infrared transition-colors text-sm uppercase tracking-wide border-b border-radar-grey-dark"
                  >
                    How It Works
                  </Link>
                  <Link
                    href="/faq"
                    className="block px-4 py-3 text-ghost-white hover:bg-stealth-black hover:text-infrared transition-colors text-sm uppercase tracking-wide border-b border-radar-grey-dark"
                  >
                    FAQ
                  </Link>
                  <Link
                    href="/about"
                    className="block px-4 py-3 text-ghost-white hover:bg-stealth-black hover:text-infrared transition-colors text-sm uppercase tracking-wide"
                  >
                    About
                  </Link>
                </div>
              </div>
            )}
          </div>

          <Link
            href="/contact"
            className="relative text-ghost-white hover:text-infrared transition-colors duration-200 font-sans text-sm uppercase tracking-wider group"
          >
            <span className="relative">
              Contact
              <span className="absolute -bottom-1 left-0 w-0 h-px bg-infrared group-hover:w-full transition-all duration-300"></span>
            </span>
          </Link>
          
          {/* Tactical divider */}
          <div className="w-px h-6 bg-radar-grey-dark"></div>
          
          {/* Cart Icon */}
          <Link href="/cart" className="relative text-ghost-white hover:text-infrared transition-colors duration-200 group">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 w-5 h-5 bg-infrared text-stealth-black text-xs font-heading flex items-center justify-center rounded-sm">
                {cartCount}
              </span>
            )}
          </Link>
          
          {/* CTA Button */}
          <Link href="/pre-cut">
            <Button size="sm">
              Configure Kit
            </Button>
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
        <div className="md:hidden bg-radar-grey border-t border-radar-grey-dark">
          <div className="container mx-auto px-4 py-6 flex flex-col gap-3">
            {/* Products Section */}
            <div>
              <div className="text-[10px] text-infrared uppercase tracking-widest font-heading mb-2">Products</div>
              <Link
                href="/pre-cut"
                className="text-ghost-white hover:text-infrared transition-colors duration-200 font-sans py-2 text-sm uppercase tracking-wide flex items-center gap-2 group pl-2"
                onClick={() => setIsMenuOpen(false)}
              >
                <div className="w-1 h-1 bg-infrared rotate-45 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
                Pre-Cut Kits
              </Link>
              <Link
                href="/rolls"
                className="text-ghost-white hover:text-infrared transition-colors duration-200 font-sans py-2 text-sm uppercase tracking-wide flex items-center gap-2 group pl-2"
                onClick={() => setIsMenuOpen(false)}
              >
                <div className="w-1 h-1 bg-infrared rotate-45 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
                PPF Rolls
              </Link>
            </div>

            {/* Divider */}
            <div className="h-px bg-radar-grey-dark"></div>

            {/* Learn Section */}
            <div>
              <div className="text-[10px] text-infrared uppercase tracking-widest font-heading mb-2">Learn</div>
              <Link
                href="/how-it-works"
                className="text-ghost-white hover:text-infrared transition-colors duration-200 font-sans py-2 text-sm uppercase tracking-wide flex items-center gap-2 group pl-2"
                onClick={() => setIsMenuOpen(false)}
              >
                <div className="w-1 h-1 bg-infrared rotate-45 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
                How It Works
              </Link>
              <Link
                href="/faq"
                className="text-ghost-white hover:text-infrared transition-colors duration-200 font-sans py-2 text-sm uppercase tracking-wide flex items-center gap-2 group pl-2"
                onClick={() => setIsMenuOpen(false)}
              >
                <div className="w-1 h-1 bg-infrared rotate-45 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
                FAQ
              </Link>
              <Link
                href="/about"
                className="text-ghost-white hover:text-infrared transition-colors duration-200 font-sans py-2 text-sm uppercase tracking-wide flex items-center gap-2 group pl-2"
                onClick={() => setIsMenuOpen(false)}
              >
                <div className="w-1 h-1 bg-infrared rotate-45 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
                About
              </Link>
            </div>

            {/* Divider */}
            <div className="h-px bg-radar-grey-dark"></div>

            <Link
              href="/contact"
              className="text-ghost-white hover:text-infrared transition-colors duration-200 font-sans py-2 text-sm uppercase tracking-wider flex items-center gap-2 group"
              onClick={() => setIsMenuOpen(false)}
            >
              <div className="w-1 h-1 bg-infrared rotate-45 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
              Contact
            </Link>
            
            {/* Divider */}
            <div className="h-px bg-radar-grey-dark"></div>
            
            {/* Cart Link */}
            <Link 
              href="/cart"
              className="text-ghost-white hover:text-infrared transition-colors duration-200 font-sans py-2 text-sm uppercase tracking-wider flex items-center gap-3 group"
              onClick={() => setIsMenuOpen(false)}
            >
              <div className="relative">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-infrared text-stealth-black text-[10px] font-heading flex items-center justify-center rounded-sm">
                    {cartCount}
                  </span>
                )}
              </div>
              Cart {cartCount > 0 && `(${cartCount})`}
            </Link>
            
            {/* CTA */}
            <Link href="/pre-cut" onClick={() => setIsMenuOpen(false)}>
              <Button size="sm" className="w-full">
                Configure Kit
              </Button>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}

