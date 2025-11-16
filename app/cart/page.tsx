'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { PageLayout, Button } from '@/components';
import { getCurrentCart, clearCartId } from '@/lib/cart';
import { ShopifyCart, updateCartLine, removeCartLine } from '@/lib/shopify';
import Link from 'next/link';

export default function CartPage() {
  const router = useRouter();
  const [cart, setCart] = useState<ShopifyCart | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [updatingLineId, setUpdatingLineId] = useState<string | null>(null);

  useEffect(() => {
    async function loadCart() {
      try {
        const currentCart = await getCurrentCart();
        if (currentCart) {
          setCart(currentCart);
          
          // Debug: Check what image data we're getting
          if (currentCart.lines.edges.length > 0) {
            console.log('Merchandise:', currentCart.lines.edges[0].node.merchandise);
            console.log('Variant image:', currentCart.lines.edges[0].node.merchandise.image);
            console.log('Product images:', currentCart.lines.edges[0].node.merchandise.product.images);
          }
        }
      } catch (error) {
        console.error('Failed to load cart:', error);
      } finally {
        setIsLoading(false);
      }
    }
    loadCart();
  }, []);

  const handleClearCart = () => {
    clearCartId();
    setCart(null);
  };

  const handleUpdateQuantity = async (lineId: string, newQuantity: number) => {
    if (!cart || newQuantity < 1) return;
    
    setUpdatingLineId(lineId);
    try {
      const updatedCart = await updateCartLine(cart.id, lineId, newQuantity);
      setCart(updatedCart);
    } catch (error) {
      console.error('Failed to update quantity:', error);
    } finally {
      setUpdatingLineId(null);
    }
  };

  const handleRemoveItem = async (lineId: string) => {
    if (!cart) return;
    
    setUpdatingLineId(lineId);
    try {
      const updatedCart = await removeCartLine(cart.id, lineId);
      setCart(updatedCart);
      
      // If cart is now empty, clear it
      if (updatedCart.lines.edges.length === 0) {
        clearCartId();
        setCart(null);
      }
    } catch (error) {
      console.error('Failed to remove item:', error);
    } finally {
      setUpdatingLineId(null);
    }
  };

  if (isLoading) {
    return (
      <PageLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="text-infrared font-heading text-xl mb-2">LOADING_CART</div>
            <div className="text-radar-grey-light text-sm">Retrieving your items...</div>
          </div>
        </div>
      </PageLayout>
    );
  }

  if (!cart || cart.lines.edges.length === 0) {
    return (
      <PageLayout>
        <div className="min-h-screen py-16 sm:py-24">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="max-w-3xl mx-auto text-center">
              <div className="mb-8">
                <div className="w-24 h-24 mx-auto mb-6 bg-radar-grey/30 rounded-full flex items-center justify-center">
                  <svg className="w-12 h-12 text-radar-grey-light" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                </div>
                <h1 className="text-3xl sm:text-4xl font-heading text-ghost-white mb-4 tracking-wider">
                  YOUR CART IS EMPTY
                </h1>
                <p className="text-radar-grey-light mb-8">
                  No items in your cart yet. Start by configuring a precision-cut kit or browse our PPF rolls.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/pre-cut">
                  <Button size="lg">
                    Configure Pre-Cut Kit
                  </Button>
                </Link>
                <Link href="/rolls">
                  <Button size="lg" variant="secondary">
                    Browse PPF Rolls
                  </Button>
                </Link>
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
          <div className="max-w-6xl mx-auto">
            {/* Header */}
            <div className="text-center mb-8 sm:mb-12">
              <div className="inline-block mb-4">
                <span className="text-[10px] text-infrared uppercase tracking-[0.3em] font-heading">
                  ORDER_REVIEW
                </span>
              </div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-heading mb-4 text-ghost-white tracking-wider">
                YOUR CART
              </h1>
              <div className="flex items-center justify-center gap-3">
                <div className="h-px w-12 bg-radar-grey-dark"></div>
                <div className="w-1 h-1 bg-infrared rotate-45"></div>
                <div className="h-px w-12 bg-radar-grey-dark"></div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left: Cart Items */}
              <div className="lg:col-span-2 space-y-4">
                {/* Cart Items */}
                {cart.lines.edges.map((edge) => {
                  // Extract vehicle data from this line item's attributes
                  const lineVehicleData = {
                    registration: edge.node.attributes.find((a: any) => a.key === 'registration')?.value,
                    make: edge.node.attributes.find((a: any) => a.key === 'make')?.value,
                    model: edge.node.attributes.find((a: any) => a.key === 'model')?.value,
                    year: edge.node.attributes.find((a: any) => a.key === 'year')?.value,
                    variant: edge.node.attributes.find((a: any) => a.key === 'variant')?.value,
                  };
                  const hasVehicleData = lineVehicleData.registration && lineVehicleData.make;

                  return (
                  <div key={edge.node.id} className="bg-radar-grey border border-radar-grey-dark p-4 sm:p-6">
                    <div className="flex flex-col sm:flex-row gap-4">
                      <div className="flex gap-4 flex-1">
                        {/* Product Image */}
                        <div className="w-16 h-16 sm:w-20 sm:h-20 flex-shrink-0 bg-stealth-black/50 border border-radar-grey-dark overflow-hidden">
                          {(() => {
                            // Get image from variant image or first product image
                            const variantImage = edge.node.merchandise.image;
                            const productImage = edge.node.merchandise.product.images?.edges?.[0]?.node;
                            const imageToUse = variantImage || productImage;
                            
                            return imageToUse ? (
                              <img 
                                src={imageToUse.url} 
                                alt={imageToUse.altText || edge.node.merchandise.product.title}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <svg className="w-6 h-6 sm:w-8 sm:h-8 text-radar-grey-dark" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                              </div>
                            );
                          })()}
                        </div>

                        {/* Product Details */}
                        <div className="flex-1 min-w-0">
                          <h3 className="text-ghost-white font-heading text-base sm:text-lg mb-1 break-words">
                            {edge.node.merchandise.product.title}
                          </h3>
                          <div className="text-radar-grey-light text-xs sm:text-sm mb-3 break-words">
                            {edge.node.merchandise.title}
                          </div>
                          
                          {/* Quantity Controls - Mobile */}
                          <div className="flex items-center gap-3 sm:hidden">
                            <div className="flex items-center border border-radar-grey-dark">
                              <button
                                onClick={() => handleUpdateQuantity(edge.node.id, edge.node.quantity - 1)}
                                disabled={updatingLineId === edge.node.id || edge.node.quantity <= 1}
                                className="px-2 py-1 bg-stealth-black text-ghost-white hover:text-infrared transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                              >
                                −
                              </button>
                              <span className="px-3 py-1 bg-stealth-black text-ghost-white font-heading text-sm">
                                {edge.node.quantity}
                              </span>
                              <button
                                onClick={() => handleUpdateQuantity(edge.node.id, edge.node.quantity + 1)}
                                disabled={updatingLineId === edge.node.id}
                                className="px-2 py-1 bg-stealth-black text-ghost-white hover:text-infrared transition-colors disabled:opacity-50 text-sm"
                              >
                                +
                              </button>
                            </div>
                            
                            {/* Remove Button - Mobile */}
                            <button
                              onClick={() => handleRemoveItem(edge.node.id)}
                              disabled={updatingLineId === edge.node.id}
                              className="text-radar-grey-light hover:text-infrared transition-colors text-xs flex items-center gap-1 disabled:opacity-50"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                              Remove
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Price - Mobile at bottom, Desktop on right */}
                      <div className="flex items-center justify-between sm:flex-col sm:items-end sm:justify-start border-t sm:border-t-0 border-radar-grey-dark pt-3 sm:pt-0 sm:text-right sm:min-w-[120px]">
                        <div>
                          <div className="text-ghost-white font-heading text-lg sm:text-xl whitespace-nowrap">
                            £{(parseFloat(edge.node.merchandise.price.amount) * edge.node.quantity).toFixed(2)}
                          </div>
                          <div className="text-radar-grey-light text-xs mt-1 whitespace-nowrap">
                            £{parseFloat(edge.node.merchandise.price.amount).toFixed(2)} each
                          </div>
                        </div>
                        
                        {/* Quantity Controls - Desktop */}
                        <div className="hidden sm:flex items-center gap-3 mt-4">
                          <div className="flex items-center border border-radar-grey-dark">
                            <button
                              onClick={() => handleUpdateQuantity(edge.node.id, edge.node.quantity - 1)}
                              disabled={updatingLineId === edge.node.id || edge.node.quantity <= 1}
                              className="px-3 py-1 bg-stealth-black text-ghost-white hover:text-infrared transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              −
                            </button>
                            <span className="px-4 py-1 bg-stealth-black text-ghost-white font-heading">
                              {edge.node.quantity}
                            </span>
                            <button
                              onClick={() => handleUpdateQuantity(edge.node.id, edge.node.quantity + 1)}
                              disabled={updatingLineId === edge.node.id}
                              className="px-3 py-1 bg-stealth-black text-ghost-white hover:text-infrared transition-colors disabled:opacity-50"
                            >
                              +
                            </button>
                          </div>
                          
                          {/* Remove Button - Desktop */}
                          <button
                            onClick={() => handleRemoveItem(edge.node.id)}
                            disabled={updatingLineId === edge.node.id}
                            className="text-radar-grey-light hover:text-infrared transition-colors text-sm flex items-center gap-1 disabled:opacity-50"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Vehicle Info - if this item has vehicle data */}
                    {hasVehicleData && (
                      <div className="mt-4 bg-stealth-black/30 border-l-2 border-infrared/50 p-3">
                        <div className="text-[10px] text-radar-grey-light uppercase tracking-widest mb-2">
                          VEHICLE_DATA
                        </div>
                        <div className="flex flex-wrap items-center gap-2 text-sm">
                          <span className="text-ghost-white font-heading">
                            {lineVehicleData.year} {lineVehicleData.make} {lineVehicleData.model}
                          </span>
                          {lineVehicleData.variant && (
                            <span className="text-radar-grey-light">· {lineVehicleData.variant}</span>
                          )}
                          <span className="text-infrared">· {lineVehicleData.registration}</span>
                        </div>
                      </div>
                    )}
                  </div>
                  );
                })}

                {/* Clear Cart */}
                <button
                  onClick={handleClearCart}
                  className="text-radar-grey-light hover:text-infrared text-sm transition-colors flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  Clear Cart
                </button>
              </div>

              {/* Right: Order Summary */}
              <div>
                <div className="relative bg-radar-grey border border-radar-grey-dark p-6 sticky top-24">
                  <div className="absolute -top-2 -right-2 w-6 h-6 border-r-2 border-t-2 border-infrared"></div>
                  
                  <h2 className="text-xl font-heading text-ghost-white mb-6 uppercase tracking-wider">
                    Order Summary
                  </h2>

                  {/* Totals */}
                  <div className="space-y-3 mb-6 pb-6 border-b border-radar-grey-dark">
                    <div className="flex justify-between text-radar-grey-light text-sm sm:text-base gap-4">
                      <span>Subtotal</span>
                      <span className="font-heading whitespace-nowrap">£{parseFloat(cart.cost.subtotalAmount.amount).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-radar-grey-light text-xs sm:text-sm gap-4">
                      <span>Shipping</span>
                      <span className="text-right">Calculated at checkout</span>
                    </div>
                    <div className="flex justify-between text-radar-grey-light text-xs sm:text-sm gap-4">
                      <span>Tax</span>
                      <span className="text-right">Calculated at checkout</span>
                    </div>
                  </div>

                  <div className="flex justify-between text-ghost-white font-heading text-xl sm:text-2xl mb-6 gap-4">
                    <span>Total</span>
                    <span className="text-infrared whitespace-nowrap">£{parseFloat(cart.cost.totalAmount.amount).toFixed(2)}</span>
                  </div>

                  {/* Checkout Button */}
                  <Button
                    onClick={() => router.push('/checkout')}
                    className="w-full mb-4"
                    size="lg"
                  >
                    Proceed to Checkout →
                  </Button>

                  <Link href="/rolls">
                    <Button variant="secondary" className="w-full" size="sm">
                      Continue Shopping
                    </Button>
                  </Link>

                  {/* Security Badge */}
                  <div className="mt-6 pt-6 border-t border-radar-grey-dark text-center">
                    <div className="flex items-center justify-center gap-2 text-radar-grey-light text-xs">
                      <div className="w-4 h-4 bg-infrared/20 flex items-center justify-center">
                        <div className="w-2 h-2 bg-infrared"></div>
                      </div>
                      <span>Secure checkout powered by Shopify</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}

