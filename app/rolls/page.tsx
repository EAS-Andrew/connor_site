'use client';

import { useState, useEffect } from 'react';
import { PageLayout, Button, Card } from '@/components';
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
            <p className="text-lg text-radar-grey-light max-w-3xl mx-auto leading-relaxed">
              Professional-grade protection film for custom applications. Premium quality with optical clarity and self-healing technology.
            </p>
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
                  <div key={product.id} className="bg-radar-grey border border-radar-grey-dark hover:border-infrared transition-all duration-300 group flex flex-col">
                    {/* Product Image - PPF Roll Visual */}
                    <div className="aspect-square bg-gradient-to-br from-stealth-black to-radar-grey-dark border-b border-radar-grey-dark flex items-center justify-center relative overflow-hidden">
                      {/* Glossy/Matte effect visualization */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        {product.title.toLowerCase().includes('matte') ? (
                          // Matte texture pattern
                          <div className="w-full h-full opacity-20">
                            <svg className="w-full h-full" viewBox="0 0 200 200">
                              <defs>
                                <pattern id="matte-texture" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                                  <circle cx="2" cy="2" r="1" fill="currentColor" className="text-ghost-white" opacity="0.3"/>
                                </pattern>
                              </defs>
                              <rect width="200" height="200" fill="url(#matte-texture)"/>
                            </svg>
                          </div>
                        ) : (
                          // Glossy shine effect
                          <div className="w-full h-full relative">
                            <div className="absolute inset-0 bg-gradient-to-br from-ghost-white/10 via-transparent to-transparent"></div>
                            <div className="absolute top-1/4 left-1/4 w-1/3 h-1/3 bg-gradient-to-br from-ghost-white/20 to-transparent blur-xl rounded-full"></div>
                          </div>
                        )}
                      </div>
                      
                      {/* Roll icon */}
                      <div className="relative z-10">
                        <svg className="w-20 h-20 text-infrared/30" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                          <circle cx="12" cy="12" r="9" strokeWidth="2"/>
                          <circle cx="12" cy="12" r="6" strokeWidth="2"/>
                          <circle cx="12" cy="12" r="3" strokeWidth="2"/>
                        </svg>
                      </div>
                      
                      {/* Finish Badge */}
                      <div className="absolute top-2 right-2 px-2 py-1 bg-stealth-black/80 border border-infrared/50">
                        <span className="text-[10px] font-heading text-infrared uppercase tracking-wider">
                          {product.title.toLowerCase().includes('matte') ? 'MATTE' : 'GLOSS'}
                        </span>
                      </div>
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

          {/* Info Section */}
          <div className="max-w-4xl mx-auto mt-16">
            <div className="bg-radar-grey border border-radar-grey-dark p-6 sm:p-8">
              <h3 className="text-xl font-heading text-ghost-white mb-4 uppercase tracking-wider">
                Professional Quality
              </h3>
              <ul className="space-y-2 text-radar-grey-light">
                <li className="flex items-start gap-3">
                  <div className="w-1 h-1 bg-infrared rotate-45 mt-2 flex-shrink-0"></div>
                  <span className="text-sm">Premium PPF with self-healing technology</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-1 h-1 bg-infrared rotate-45 mt-2 flex-shrink-0"></div>
                  <span className="text-sm">Crystal-clear optical quality</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-1 h-1 bg-infrared rotate-45 mt-2 flex-shrink-0"></div>
                  <span className="text-sm">Available in gloss and matte finishes</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-1 h-1 bg-infrared rotate-45 mt-2 flex-shrink-0"></div>
                  <span className="text-sm">Professional installer-ready</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}

