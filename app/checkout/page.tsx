'use client';

import { useEffect, useState } from 'react';
import { PageLayout, Button } from '@/components';
import { getCurrentCart } from '@/lib/cart';
import { ShopifyCart } from '@/lib/shopify';

interface ShippingAddress {
  firstName: string;
  lastName: string;
  address1: string;
  address2: string;
  city: string;
  province: string;
  country: string;
  zip: string;
  phone: string;
}

export default function CheckoutPage() {
  const [cart, setCart] = useState<ShopifyCart | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [shippingAddress, setShippingAddress] = useState<ShippingAddress>({
    firstName: '',
    lastName: '',
    address1: '',
    address2: '',
    city: '',
    province: '',
    country: 'GB',
    zip: '',
    phone: '',
  });
  const [email, setEmail] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    async function loadCart() {
      try {
        const currentCart = await getCurrentCart();
        if (!currentCart) {
          window.location.href = '/pre-cut';
          return;
        }
        setCart(currentCart);
      } catch (error) {
        console.error('Failed to load cart:', error);
      } finally {
        setIsLoading(false);
      }
    }
    loadCart();
  }, []);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!email || !email.includes('@')) newErrors.email = 'Valid email required';
    if (!shippingAddress.firstName) newErrors.firstName = 'First name required';
    if (!shippingAddress.lastName) newErrors.lastName = 'Last name required';
    if (!shippingAddress.address1) newErrors.address1 = 'Address required';
    if (!shippingAddress.city) newErrors.city = 'City required';
    if (!shippingAddress.zip) newErrors.zip = 'Postcode required';
    if (!shippingAddress.phone) newErrors.phone = 'Phone required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCheckout = async () => {
    if (!validateForm() || !cart) return;

    setIsProcessing(true);

    try {
      // Redirect to Shopify checkout with pre-filled information
      // Shopify will handle the payment through Shop Pay
      const checkoutUrl = new URL(cart.checkoutUrl);
      
      // Add customer email
      checkoutUrl.searchParams.set('checkout[email]', email);
      
      // Add shipping address
      checkoutUrl.searchParams.set('checkout[shipping_address][first_name]', shippingAddress.firstName);
      checkoutUrl.searchParams.set('checkout[shipping_address][last_name]', shippingAddress.lastName);
      checkoutUrl.searchParams.set('checkout[shipping_address][address1]', shippingAddress.address1);
      if (shippingAddress.address2) {
        checkoutUrl.searchParams.set('checkout[shipping_address][address2]', shippingAddress.address2);
      }
      checkoutUrl.searchParams.set('checkout[shipping_address][city]', shippingAddress.city);
      checkoutUrl.searchParams.set('checkout[shipping_address][zip]', shippingAddress.zip);
      checkoutUrl.searchParams.set('checkout[shipping_address][country]', shippingAddress.country);
      checkoutUrl.searchParams.set('checkout[shipping_address][phone]', shippingAddress.phone);

      // Redirect to Shopify checkout
      window.location.href = checkoutUrl.toString();
    } catch (error) {
      console.error('Checkout error:', error);
      setErrors({ general: 'Failed to proceed to checkout. Please try again.' });
      setIsProcessing(false);
    }
  };

  if (isLoading) {
    return (
      <PageLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="text-infrared font-heading text-xl mb-2">LOADING_CHECKOUT</div>
            <div className="text-radar-grey-light text-sm">Initializing secure checkout...</div>
          </div>
        </div>
      </PageLayout>
    );
  }

  if (!cart) {
    return (
      <PageLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="text-infrared font-heading text-xl mb-4">NO ACTIVE CART</div>
            <Button onClick={() => window.location.href = '/pre-cut'}>
              Configure Your Kit
            </Button>
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
                  SECURE_CHECKOUT
                </span>
              </div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-heading mb-4 text-ghost-white tracking-wider">
                COMPLETE YOUR ORDER
              </h1>
              <div className="flex items-center justify-center gap-3">
                <div className="h-px w-12 bg-radar-grey-dark"></div>
                <div className="w-1 h-1 bg-infrared rotate-45"></div>
                <div className="h-px w-12 bg-radar-grey-dark"></div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left Column: Forms */}
              <div className="space-y-6">
                {/* Contact Information */}
                <div className="relative bg-radar-grey border border-radar-grey-dark p-6">
                  <div className="absolute -top-2 -left-2 w-6 h-6 border-l-2 border-t-2 border-infrared"></div>
                  
                  <h2 className="text-xl font-heading text-ghost-white mb-4 uppercase tracking-wider">
                    Contact Information
                  </h2>

                  <div>
                    <label className="block text-ghost-white mb-2 font-heading text-sm">Email</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-4 py-3 bg-stealth-black border-2 border-radar-grey-dark text-ghost-white focus:outline-none focus:border-infrared transition-colors"
                      placeholder="your@email.com"
                    />
                    {errors.email && (
                      <p className="text-infrared text-xs mt-1">{errors.email}</p>
                    )}
                  </div>
                </div>

                {/* Shipping Address */}
                <div className="relative bg-radar-grey border border-radar-grey-dark p-6">
                  <div className="absolute -top-2 -left-2 w-6 h-6 border-l-2 border-t-2 border-infrared"></div>
                  
                  <h2 className="text-xl font-heading text-ghost-white mb-4 uppercase tracking-wider">
                    Shipping Address
                  </h2>

                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-ghost-white mb-2 font-heading text-sm">First Name</label>
                        <input
                          type="text"
                          value={shippingAddress.firstName}
                          onChange={(e) => setShippingAddress({ ...shippingAddress, firstName: e.target.value })}
                          className="w-full px-4 py-3 bg-stealth-black border-2 border-radar-grey-dark text-ghost-white focus:outline-none focus:border-infrared transition-colors"
                        />
                        {errors.firstName && (
                          <p className="text-infrared text-xs mt-1">{errors.firstName}</p>
                        )}
                      </div>
                      <div>
                        <label className="block text-ghost-white mb-2 font-heading text-sm">Last Name</label>
                        <input
                          type="text"
                          value={shippingAddress.lastName}
                          onChange={(e) => setShippingAddress({ ...shippingAddress, lastName: e.target.value })}
                          className="w-full px-4 py-3 bg-stealth-black border-2 border-radar-grey-dark text-ghost-white focus:outline-none focus:border-infrared transition-colors"
                        />
                        {errors.lastName && (
                          <p className="text-infrared text-xs mt-1">{errors.lastName}</p>
                        )}
                      </div>
                    </div>

                    <div>
                      <label className="block text-ghost-white mb-2 font-heading text-sm">Address</label>
                      <input
                        type="text"
                        value={shippingAddress.address1}
                        onChange={(e) => setShippingAddress({ ...shippingAddress, address1: e.target.value })}
                        className="w-full px-4 py-3 bg-stealth-black border-2 border-radar-grey-dark text-ghost-white focus:outline-none focus:border-infrared transition-colors"
                        placeholder="Street address"
                      />
                      {errors.address1 && (
                        <p className="text-infrared text-xs mt-1">{errors.address1}</p>
                      )}
                    </div>

                    <div>
                      <input
                        type="text"
                        value={shippingAddress.address2}
                        onChange={(e) => setShippingAddress({ ...shippingAddress, address2: e.target.value })}
                        className="w-full px-4 py-3 bg-stealth-black border-2 border-radar-grey-dark text-ghost-white focus:outline-none focus:border-infrared transition-colors"
                        placeholder="Apartment, suite, etc. (optional)"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-ghost-white mb-2 font-heading text-sm">City</label>
                        <input
                          type="text"
                          value={shippingAddress.city}
                          onChange={(e) => setShippingAddress({ ...shippingAddress, city: e.target.value })}
                          className="w-full px-4 py-3 bg-stealth-black border-2 border-radar-grey-dark text-ghost-white focus:outline-none focus:border-infrared transition-colors"
                        />
                        {errors.city && (
                          <p className="text-infrared text-xs mt-1">{errors.city}</p>
                        )}
                      </div>
                      <div>
                        <label className="block text-ghost-white mb-2 font-heading text-sm">Postcode</label>
                        <input
                          type="text"
                          value={shippingAddress.zip}
                          onChange={(e) => setShippingAddress({ ...shippingAddress, zip: e.target.value.toUpperCase() })}
                          className="w-full px-4 py-3 bg-stealth-black border-2 border-radar-grey-dark text-ghost-white focus:outline-none focus:border-infrared transition-colors uppercase"
                        />
                        {errors.zip && (
                          <p className="text-infrared text-xs mt-1">{errors.zip}</p>
                        )}
                      </div>
                    </div>

                    <div>
                      <label className="block text-ghost-white mb-2 font-heading text-sm">Phone</label>
                      <input
                        type="tel"
                        value={shippingAddress.phone}
                        onChange={(e) => setShippingAddress({ ...shippingAddress, phone: e.target.value })}
                        className="w-full px-4 py-3 bg-stealth-black border-2 border-radar-grey-dark text-ghost-white focus:outline-none focus:border-infrared transition-colors"
                        placeholder="07XXX XXXXXX"
                      />
                      {errors.phone && (
                        <p className="text-infrared text-xs mt-1">{errors.phone}</p>
                      )}
                    </div>
                  </div>
                </div>

                {errors.general && (
                  <div className="bg-infrared/10 border-l-4 border-infrared p-4">
                    <p className="text-infrared font-heading text-sm">{errors.general}</p>
                  </div>
                )}
              </div>

              {/* Right Column: Order Summary */}
              <div>
                <div className="relative bg-radar-grey border border-radar-grey-dark p-6 sticky top-4">
                  <div className="absolute -top-2 -right-2 w-6 h-6 border-r-2 border-t-2 border-infrared"></div>
                  
                  <h2 className="text-xl font-heading text-ghost-white mb-6 uppercase tracking-wider">
                    Order Summary
                  </h2>

                  {/* Cart Items */}
                  <div className="space-y-4 mb-6">
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
                        <div key={edge.node.id} className="border-b border-radar-grey-dark pb-4 last:border-b-0">
                          <div className="flex justify-between items-start mb-2">
                            <div className="flex-1">
                              <div className="text-ghost-white font-heading text-sm">
                                {edge.node.merchandise.product.title}
                              </div>
                              <div className="text-radar-grey-light text-xs">
                                {edge.node.merchandise.title} × {edge.node.quantity}
                              </div>
                            </div>
                            <div className="text-ghost-white font-heading">
                              £{(parseFloat(edge.node.merchandise.price.amount) * edge.node.quantity).toFixed(2)}
                            </div>
                          </div>
                          
                          {/* Vehicle Info - if this item has vehicle data */}
                          {hasVehicleData && (
                            <div className="mt-2 bg-stealth-black/50 border-l-2 border-infrared/50 p-2">
                              <div className="text-[9px] text-radar-grey-light uppercase tracking-widest mb-1">
                                VEHICLE
                              </div>
                              <div className="text-ghost-white text-xs">
                                {lineVehicleData.year} {lineVehicleData.make} {lineVehicleData.model}
                                {lineVehicleData.variant && ` · ${lineVehicleData.variant}`}
                                <span className="text-infrared ml-1">· {lineVehicleData.registration}</span>
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {/* Totals */}
                  <div className="border-t border-radar-grey-dark pt-4 space-y-2">
                    <div className="flex justify-between text-radar-grey-light">
                      <span>Subtotal</span>
                      <span>£{parseFloat(cart.cost.subtotalAmount.amount).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-radar-grey-light text-sm">
                      <span>Shipping</span>
                      <span>Calculated at next step</span>
                    </div>
                    <div className="flex justify-between text-ghost-white font-heading text-xl pt-2 border-t border-radar-grey-dark">
                      <span>Total</span>
                      <span className="text-infrared">£{parseFloat(cart.cost.totalAmount.amount).toFixed(2)}</span>
                    </div>
                  </div>

                  {/* Checkout Button */}
                  <Button
                    onClick={handleCheckout}
                    disabled={isProcessing}
                    className="w-full mt-6"
                    size="lg"
                  >
                    {isProcessing ? 'Processing...' : 'Continue to Payment →'}
                  </Button>

                  <div className="mt-4 text-center text-radar-grey-light text-xs">
                    <div className="flex items-center justify-center gap-2">
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

