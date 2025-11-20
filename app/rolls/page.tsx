'use client';

import { useState, useEffect } from 'react';
import { PageLayout, Button, Card } from '@/components';
import Link from 'next/link';
import { fetchPPFRolls, ShopifyProduct } from '@/lib/shopify';
import { addToCart, createCart } from '@/lib/shopify';

export default function RollsPage() {
  const [products, setProducts] = useState<ShopifyProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState<ShopifyProduct | null>(null);
  const [selectedVariant, setSelectedVariant] = useState<string | null>(null);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    async function loadProducts() {
      try {
        const rollProducts = await fetchPPFRolls();
        setProducts(rollProducts);
      } catch (error) {
        console.error('Failed to load PPF rolls:', error);
        setMessage('Failed to load products. Please try again.');
      } finally {
        setIsLoading(false);
      }
    }
    loadProducts();
  }, []);

  const handleAddToCart = async (product: ShopifyProduct, variantId: string) => {
    setIsAddingToCart(true);
    setMessage('');

    try {
      // Get existing cart ID from localStorage
      const existingCartId = localStorage.getItem('stealthshield_cart_id');

      if (existingCartId) {
        await addToCart(existingCartId, variantId, 1);
      } else {
        const cart = await createCart(variantId, 1);
        localStorage.setItem('stealthshield_cart_id', cart.id);
      }

      setMessage(`✓ ${product.title} added to cart!`);
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error('Failed to add to cart:', error);
      setMessage('Failed to add to cart. Please try again.');
    } finally {
      setIsAddingToCart(false);
    }
  };

  const handleBuyNow = async (product: ShopifyProduct, variantId: string) => {
    setIsAddingToCart(true);
    setMessage('');

    try {
      const cart = await createCart(variantId, 1);
      window.location.href = cart.checkoutUrl;
    } catch (error) {
      console.error('Failed to checkout:', error);
      setMessage('Failed to checkout. Please try again.');
      setIsAddingToCart(false);
    }
  };

  if (isLoading) {
    return (
      <PageLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="text-infrared font-heading text-xl mb-2">LOADING_SYSTEMS</div>
            <div className="text-radar-grey-light text-sm">Retrieving PPF roll inventory...</div>
          </div>
        </div>
      </PageLayout>
    );
  }

  // If no products tagged with 'ppf-roll', show coming soon message
  if (products.length === 0) {
    return (
      <PageLayout>
        <div className="min-h-screen py-16 sm:py-24">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-12">
                <div className="mb-4">
                  <span className="text-[10px] text-infrared uppercase tracking-[0.3em] font-heading">
                    SYSTEM_BRAVO
                  </span>
                </div>
                <h1 className="text-4xl sm:text-5xl md:text-6xl font-heading mb-6 text-ghost-white tracking-wider">
                  PPF FILM ROLLS
                </h1>
                <div className="flex items-center justify-center gap-3 mb-6">
                  <div className="h-px w-16 bg-radar-grey-dark"></div>
                  <div className="w-1 h-1 bg-infrared rotate-45"></div>
                  <div className="h-px w-16 bg-radar-grey-dark"></div>
                </div>
              </div>

              <div className="relative bg-radar-grey border-2 border-infrared/30 p-8 sm:p-12">
                <div className="absolute -top-2 -left-2 w-8 h-8 border-l-2 border-t-2 border-infrared"></div>
                <div className="absolute -bottom-2 -right-2 w-8 h-8 border-r-2 border-b-2 border-infrared"></div>

                <div className="text-center">
                  <div className="text-infrared font-heading text-2xl mb-4">DEPLOYMENT PENDING</div>
                  <p className="text-radar-grey-light leading-relaxed mb-6">
                    Professional-grade PPF film rolls are currently being added to our inventory system.
                    Check back soon for gloss and matte options in various dimensions.
                  </p>
                  <p className="text-ghost-white text-sm">
                    Need rolls now? <a href="/contact" className="text-infrared hover:underline">Contact us directly</a>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <div className="min-h-screen py-12 sm:py-16">
        <div className="container mx-auto px-4 sm:px-6">
          {/* Header */}
          <div className="text-center mb-12 sm:mb-16">
            <div className="inline-block mb-4">
              <span className="text-[10px] text-infrared uppercase tracking-[0.3em] font-heading">
                SYSTEM_BRAVO
              </span>
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-heading mb-6 text-ghost-white tracking-wider">
              PPF FILM ROLLS
            </h1>
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="h-px w-16 bg-radar-grey-dark"></div>
              <div className="w-1 h-1 bg-infrared rotate-45"></div>
              <div className="h-px w-16 bg-radar-grey-dark"></div>
            </div>
            <p className="text-lg text-radar-grey-light max-w-3xl mx-auto leading-relaxed mb-4">
              Professional-grade protection film for custom applications. Premium quality with optical clarity and self-healing technology.
            </p>
            <div className="inline-block px-4 py-2 bg-infrared/20 border border-infrared">
              <span className="text-infrared text-xs font-heading uppercase tracking-wider">
                ✓ Bulk Pricing for Professionals
              </span>
            </div>
          </div>

          {/* Explainer Sections */}
          <div className="max-w-5xl mx-auto mb-12 sm:mb-16 grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Can I install this myself? */}
            <div className="bg-radar-grey border border-radar-grey-dark p-6">
              <div className="flex items-start gap-3 mb-4">
                <div className="w-10 h-10 bg-infrared/10 border border-infrared flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 text-infrared" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-heading text-ghost-white mb-2 uppercase tracking-wide">
                    Can I Install This Myself?
                  </h3>
                  <p className="text-radar-grey-light text-sm leading-relaxed">
                    PPF rolls require professional installation. You&apos;ll need experience with film application, a plotter for cutting patterns, and specialized tools. We recommend these for professional installers or those with advanced DIY skills.
                  </p>
                </div>
              </div>
            </div>

            {/* Will it fit my car? */}
            <div className="bg-radar-grey border border-radar-grey-dark p-6">
              <div className="flex items-start gap-3 mb-4">
                <div className="w-10 h-10 bg-infrared/10 border border-infrared flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 text-infrared" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-heading text-ghost-white mb-2 uppercase tracking-wide">
                    Will It Fit My Car?
                  </h3>
                  <p className="text-radar-grey-light text-sm leading-relaxed">
                    Film rolls are universal - they work with any vehicle when cut to size. Perfect for custom coverage patterns, partial wraps, or multiple vehicles. Installers use plotters with vehicle-specific templates to achieve perfect fits.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Success/Error Message */}
          {message && (
            <div className="max-w-4xl mx-auto mb-8">
              <div className={`p-4 border-l-4 ${message.startsWith('✓') ? 'bg-infrared/10 border-infrared' : 'bg-radar-grey-dark/50 border-radar-grey-light'}`}>
                <p className={`font-heading text-sm tracking-wider ${message.startsWith('✓') ? 'text-infrared' : 'text-radar-grey-light'}`}>
                  {message}
                </p>
              </div>
            </div>
          )}

          {/* Products Grid */}
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {products.map((product) => {
                const currentVariant = selectedProduct?.id === product.id && selectedVariant
                  ? product.variants.edges.find(e => e.node.id === selectedVariant)?.node
                  : product.variants.edges[0].node;

                return (
                  <div key={product.id} className="bg-radar-grey border-2 border-radar-grey-dark hover:border-infrared transition-all duration-300 group flex flex-col overflow-hidden">
                    {/* Product Image */}
                    <div className="relative aspect-[16/9] bg-gradient-to-br from-stealth-black to-radar-grey-dark border-b-2 border-radar-grey-dark overflow-hidden">
                      {product.featuredImage ? (
                        <img 
                          src={product.featuredImage.url} 
                          alt={product.featuredImage.altText || product.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        // Fallback texture if no image
                        <div className="w-full h-full relative">
                          <div className="absolute inset-0 bg-gradient-to-br from-ghost-white/20 via-transparent to-transparent"></div>
                          <div className="absolute top-0 right-0 w-2/3 h-2/3 bg-gradient-to-br from-ghost-white/30 via-ghost-white/10 to-transparent blur-2xl"></div>
                        </div>
                      )}
                    </div>

                    {/* Product Info */}
                    <div className="p-4 flex flex-col flex-1">
                      <h3 className="text-lg font-heading text-ghost-white mb-2 group-hover:text-infrared transition-colors">
                        {product.title}
                      </h3>

                      <p className="text-radar-grey-light text-xs mb-4 line-clamp-2 flex-shrink-0">
                        {product.description}
                      </p>

                      {/* Spacer to push content to bottom */}
                      <div className="flex-1"></div>

                      {/* Size Selector */}
                      <div className="mb-3">
                        <label className="block text-[10px] text-radar-grey-light uppercase tracking-wider mb-2">
                          Size
                        </label>
                        <select
                          value={selectedProduct?.id === product.id && selectedVariant ? selectedVariant : product.variants.edges[0].node.id}
                          onChange={(e) => {
                            setSelectedProduct(product);
                            setSelectedVariant(e.target.value);
                          }}
                          className="w-full px-3 py-2 bg-stealth-black border border-radar-grey-dark text-ghost-white text-sm focus:outline-none focus:border-infrared transition-colors"
                        >
                          {product.variants.edges.map((variantEdge) => (
                            <option key={variantEdge.node.id} value={variantEdge.node.id}>
                              {variantEdge.node.title} - £{parseFloat(variantEdge.node.price.amount).toFixed(2)}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Price */}
                      <div className="mb-3 flex items-baseline gap-2">
                        <span className="text-2xl font-heading text-infrared">
                          £{parseFloat(currentVariant?.price.amount || '0').toFixed(2)}
                        </span>
                        <span className="text-xs text-radar-grey-light">GBP</span>
                      </div>

                      {/* Add to Cart Button - Always at bottom */}
                      <Button
                        onClick={() => {
                          const variantId = selectedProduct?.id === product.id && selectedVariant
                            ? selectedVariant
                            : product.variants.edges[0].node.id;
                          handleAddToCart(product, variantId);
                        }}
                        disabled={isAddingToCart}
                        className="w-full"
                        size="sm"
                      >
                        {isAddingToCart ? 'Adding...' : 'Add to Cart'}
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Info Section - Enhanced */}
          <div className="max-w-6xl mx-auto mt-16">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Key Benefits */}
              <div className="bg-radar-grey border border-radar-grey-dark p-6 sm:p-8">
                <div className="text-[10px] text-infrared uppercase tracking-widest font-heading mb-4">
                  KEY_BENEFITS
                </div>
                <h3 className="text-xl font-heading text-ghost-white mb-4 uppercase tracking-wider">
                  Professional Quality
                </h3>
                <ul className="space-y-3 text-radar-grey-light">
                  <li className="flex items-start gap-3">
                    <div className="w-1 h-1 bg-infrared rotate-45 mt-2 flex-shrink-0"></div>
                    <div>
                      <span className="text-sm text-ghost-white font-heading">Self-Healing Technology:</span>
                      <span className="text-sm"> Minor scratches disappear with heat application</span>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-1 h-1 bg-infrared rotate-45 mt-2 flex-shrink-0"></div>
                    <div>
                      <span className="text-sm text-ghost-white font-heading">Crystal-Clear Optics:</span>
                      <span className="text-sm"> Invisible protection with zero distortion</span>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-1 h-1 bg-infrared rotate-45 mt-2 flex-shrink-0"></div>
                    <div>
                      <span className="text-sm text-ghost-white font-heading">UV Resistance:</span>
                      <span className="text-sm"> No yellowing or degradation over time</span>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-1 h-1 bg-infrared rotate-45 mt-2 flex-shrink-0"></div>
                    <div>
                      <span className="text-sm text-ghost-white font-heading">7-10 Year Lifespan:</span>
                      <span className="text-sm"> Long-term protection with proper installation</span>
                    </div>
                  </li>
                </ul>
              </div>

              {/* Best For */}
              <div className="bg-radar-grey border border-radar-grey-dark p-6 sm:p-8">
                <div className="text-[10px] text-infrared uppercase tracking-widest font-heading mb-4">
                  IDEAL_USE_CASES
                </div>
                <h3 className="text-xl font-heading text-ghost-white mb-4 uppercase tracking-wider">
                  Who Should Buy Rolls?
                </h3>
                <ul className="space-y-3 text-radar-grey-light">
                  <li className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-infrared flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-sm">Professional detailers & installers</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-infrared flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-sm">Body shops offering PPF services</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-infrared flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-sm">Businesses with vehicle fleets</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-infrared flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-sm">Advanced DIYers with plotter access</span>
                  </li>
                </ul>
                <div className="mt-6 pt-6 border-t border-radar-grey-dark">
                  <p className="text-xs text-ghost-white">
                    <span className="text-infrared font-heading">Looking for a pre-cut kit instead?</span> Check out our precision-cut options for your specific vehicle. <Link href="/pre-cut" className="text-infrared underline hover:no-underline">Start with your reg →</Link>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}

