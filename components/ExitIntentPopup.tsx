'use client';

import { useState, useEffect } from 'react';
import { Button } from './Button';

export function ExitIntentPopup() {
  const [isVisible, setIsVisible] = useState(false);
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);

  useEffect(() => {
    // Check if user has already dismissed or submitted
    const dismissed = localStorage.getItem('stealthshield_exit_dismissed');
    const submitted = localStorage.getItem('stealthshield_exit_submitted');
    
    if (dismissed || submitted) {
      return;
    }

    let hasShown = false;

    const handleMouseLeave = (e: MouseEvent) => {
      // Detect exit intent (mouse moving toward top of page)
      if (!hasShown && e.clientY <= 10 && e.clientY >= 0) {
        hasShown = true;
        setIsVisible(true);
      }
    };

    // Add event listener after a short delay
    const timer = setTimeout(() => {
      document.addEventListener('mouseleave', handleMouseLeave);
    }, 5000); // Wait 5 seconds before enabling

    return () => {
      clearTimeout(timer);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    localStorage.setItem('stealthshield_exit_dismissed', 'true');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    setHasSubmitted(true);
    localStorage.setItem('stealthshield_exit_submitted', 'true');
    
    setTimeout(() => {
      setIsVisible(false);
    }, 2000);
  };

  if (!isVisible) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fadeIn">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-stealth-black/90 backdrop-blur-sm"
        onClick={handleClose}
      ></div>

      {/* Modal - Simple Card Style */}
      <div className="relative bg-radar-grey border border-radar-grey-dark max-w-lg w-full">
        {/* Close button */}
        <button
          onClick={handleClose}
          className="absolute top-3 right-3 text-radar-grey-light hover:text-infrared transition-colors"
          aria-label="Close"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Content */}
        <div className="p-6 sm:p-8">
          {!hasSubmitted ? (
            <>
              {/* Header */}
              <div className="text-center mb-6">
                <div className="text-[10px] text-infrared uppercase tracking-[0.3em] font-heading mb-3">
                  SPECIAL_OFFER
                </div>
                <h3 className="text-2xl sm:text-3xl font-heading text-ghost-white mb-3 tracking-wide">
                  GET 10% OFF YOUR FIRST KIT
                </h3>
                <p className="text-radar-grey-light text-sm leading-relaxed">
                  Plus a free installation guide. Join 1,200+ protected vehicles.
                </p>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <input
                    type="email"
                    id="exit-email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    required
                    className="w-full px-4 py-3 bg-stealth-black border border-radar-grey-dark text-ghost-white focus:outline-none focus:border-infrared transition-colors text-sm"
                  />
                </div>

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full"
                  size="lg"
                >
                  {isSubmitting ? 'Processing...' : 'Claim Discount'}
                </Button>

                <p className="text-radar-grey-light text-xs text-center">
                  Unsubscribe anytime
                </p>
              </form>
            </>
          ) : (
            <>
              {/* Success state */}
              <div className="text-center py-6">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-infrared/20 border border-infrared mb-4">
                  <svg className="w-6 h-6 text-infrared" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-xl font-heading text-ghost-white mb-2 tracking-wide">
                  Check Your Email
                </h3>
                <p className="text-radar-grey-light text-sm leading-relaxed">
                  Your discount code and installation guide are on the way.
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

