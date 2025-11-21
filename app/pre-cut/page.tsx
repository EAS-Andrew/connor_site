'use client';

import { useState, useRef, useEffect } from 'react';
import { PageLayout, Button } from '@/components';
import { lookupVehicleByRegistration, getCoverageOptions, materialOptions, VehicleData, CoverageOption, MaterialOption, VehicleLookupError } from '@/lib/api';
import { addToCartWithVehicle } from '@/lib/cart';

type Step = 1 | 2 | 3 | 4;

export default function PreCutPage() {
  const [currentStep, setCurrentStep] = useState<Step>(1);
  const [registration, setRegistration] = useState('');
  const [vehicleData, setVehicleData] = useState<VehicleData | null>(null);
  const [coverageOptions, setCoverageOptions] = useState<CoverageOption[]>([]);
  const [selectedCoverage, setSelectedCoverage] = useState<CoverageOption | null>(null);
  const [selectedMaterial, setSelectedMaterial] = useState<MaterialOption | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [error, setError] = useState('');

  // Refs for each step section
  const step1Ref = useRef<HTMLDivElement>(null);
  const step2Ref = useRef<HTMLDivElement>(null);
  const step3Ref = useRef<HTMLDivElement>(null);
  const step4Ref = useRef<HTMLDivElement>(null);
  const materialSectionRef = useRef<HTMLDivElement>(null);
  const actionButtonsRef = useRef<HTMLDivElement>(null);
  const errorRef = useRef<HTMLDivElement>(null);

  // Fetch coverage options from Shopify - load cars initially, then reload based on vehicle type
  useEffect(() => {
    async function loadCoverageOptions() {
      try {
        // Default to 'Car' on initial load, then use actual vehicle type once known
        const vehicleType = vehicleData?.vehicleClass === 'Motorcycle' ? 'Motorcycle' : 'Car';
        const options = await getCoverageOptions(vehicleType);
        setCoverageOptions(options);
      } catch (error) {
        console.error('Failed to load coverage options:', error);
      }
    }
    
    // Load on mount (defaults to car), and reload when vehicle data changes
    loadCoverageOptions();
  }, [vehicleData]);

  // Scroll to step when it changes
  useEffect(() => {
    const refs = [step1Ref, step2Ref, step3Ref, step4Ref];
    const targetRef = refs[currentStep - 1];

    if (targetRef.current) {
      setTimeout(() => {
        const element = targetRef.current;
        if (element) {
          const elementPosition = element.getBoundingClientRect().top + window.scrollY;
          const offsetPosition = elementPosition - 100; // Account for header + some spacing

          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          });
        }
      }, 100);
    }
  }, [currentStep]);

  // Scroll to error when validation fails
  useEffect(() => {
    if (error && errorRef.current) {
      setTimeout(() => {
        const element = errorRef.current;
        if (element) {
          const elementPosition = element.getBoundingClientRect().top + window.scrollY;
          const offsetPosition = elementPosition - 120; // Account for header + more spacing for visibility

          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          });
        }
      }, 100);
    }
  }, [error]);

  const steps = [
    { label: 'SCAN', desc: 'Enter Registration' },
    { label: 'VERIFY', desc: 'Confirm Vehicle' },
    { label: 'CONFIGURE', desc: 'Select Coverage' },
    { label: 'DEPLOY', desc: 'Review Order' }
  ];

  const handleRegistrationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const data = await lookupVehicleByRegistration(registration);
      if (data) {
        setVehicleData(data);
        setCurrentStep(2);
      } else {
        setError('VEHICLE NOT FOUND - Please check the registration and try again');
      }
    } catch (err) {
      // Handle specific error types
      if (err instanceof VehicleLookupError) {
        if (err.statusCode === 429) {
          // Rate limit error - show specific message with reset time
          const resetTime = err.details?.reset 
            ? new Date(err.details.reset).toLocaleTimeString('en-GB', { 
                hour: '2-digit', 
                minute: '2-digit' 
              })
            : 'a few minutes';
          setError(`RATE LIMIT EXCEEDED - Too many lookups. Please try again after ${resetTime}`);
        } else {
          // Other API errors
          setError(err.message.toUpperCase());
        }
      } else {
        // Unknown errors
        setError('SYSTEM ERROR - Unable to process request');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleVehicleConfirm = () => {
    setCurrentStep(3);
  };

  const handleCoverageSelect = (coverage: CoverageOption) => {
    setSelectedCoverage(coverage);
    // Scroll to material section after coverage is selected
    setTimeout(() => {
      const element = materialSectionRef.current;
      if (element) {
        const elementPosition = element.getBoundingClientRect().top + window.scrollY;
        const offsetPosition = elementPosition - 100; // Account for header + some spacing

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    }, 300);
  };

  const handleMaterialSelect = (material: MaterialOption) => {
    setSelectedMaterial(material);
    // Scroll to action buttons after material is selected (mobile only)
    setTimeout(() => {
      const element = actionButtonsRef.current;
      if (element && window.innerWidth < 640) { // Only scroll on mobile (< sm breakpoint)
        const elementPosition = element.getBoundingClientRect().top + window.scrollY;
        const offsetPosition = elementPosition - 100; // Account for header + some spacing

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    }, 300);
  };

  const handleProceedToReview = () => {
    if (selectedCoverage && selectedMaterial) {
      setCurrentStep(4);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((currentStep - 1) as Step);
    }
  };

  const handleAddToCart = async () => {
    if (!vehicleData || !selectedCoverage || !selectedMaterial) {
      setError('Missing required information');
      return;
    }

    setIsCheckingOut(true);
    setError('');

    try {
      // Find the selected variant (Gloss or Matte)
      const selectedVariant = selectedCoverage.variants.find(
        (v) => v.title.toLowerCase() === selectedMaterial.id.toLowerCase()
      );

      if (!selectedVariant) {
        throw new Error('Selected variant not found');
      }

      // Add to cart (or create new cart) with vehicle metadata
      await addToCartWithVehicle(
        selectedVariant.id,
        vehicleData,
        1
      );

      // Redirect to cart page
      window.location.href = '/cart';
    } catch (error) {
      console.error('Add to cart error:', error);
      setError('Failed to add to cart. Please try again.');
      setIsCheckingOut(false);
    }
  };

  return (
    <PageLayout>
      <div className="min-h-screen py-12 sm:py-16 relative">
        {/* Background angular grid */}
        <div className="absolute inset-0 opacity-[0.02] pointer-events-none overflow-hidden">
          <div className="absolute top-0 left-1/4 w-48 h-48 md:w-96 md:h-96 border border-ghost-white transform rotate-45"></div>
          <div className="absolute bottom-0 right-1/4 w-48 h-48 md:w-96 md:h-96 border border-ghost-white transform -rotate-12"></div>
        </div>

        <div className="container mx-auto px-4 sm:px-6 relative z-10">
          <div className="max-w-6xl mx-auto">

            {/* Header */}
            <div className="text-center mb-8 sm:mb-12 px-4">
              <div className="inline-block mb-4">
                <div className="h-px w-8 sm:w-12 bg-infrared mb-3 sm:mb-4 mx-auto"></div>
                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-heading text-ghost-white tracking-wider">
                  CONFIGURE YOUR KIT
                </h1>
                <div className="h-px w-8 sm:w-12 bg-infrared mt-3 sm:mt-4 mx-auto"></div>
              </div>
              <p className="text-radar-grey-light text-xs sm:text-sm tracking-wide leading-relaxed max-w-2xl mx-auto mb-6">
                Precision-matched PPF for your car or motorcycle • Enter registration • Instant pricing • We verify and cut to spec
              </p>

              {/* Why Buy Direct? */}
              <div className="max-w-3xl mx-auto mt-8 bg-radar-grey/50 border border-radar-grey-dark p-4 sm:p-6">
                <div className="flex items-start gap-3 sm:gap-4">
                  <div className="w-10 h-10 bg-infrared/10 border border-infrared flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-infrared" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <div className="text-left">
                    <h3 className="text-sm sm:text-base font-heading text-ghost-white mb-2 uppercase tracking-wide">
                      Why Buy Direct?
                    </h3>
                    <p className="text-radar-grey-light text-xs sm:text-sm leading-relaxed">
                      No installer markup. No middleman. Registration-verified patterns cut specifically for your vehicle.
                      Get professional-grade PPF at direct-to-consumer pricing with guaranteed perfect fit.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Tactical Progress System */}
            <div className="max-w-4xl mx-auto mb-8 sm:mb-12 md:mb-16 px-4">
              {/* Progress bar */}
              <div className="relative h-1 bg-radar-grey-dark mb-4 sm:mb-6 md:mb-8">
                <div
                  className="absolute top-0 left-0 h-full bg-infrared transition-all duration-500"
                  style={{ width: `${(currentStep / steps.length) * 100}%` }}
                ></div>
                {/* Angular accent at current position */}
                <div
                  className="absolute w-2 h-2 bg-infrared transition-all duration-500"
                  style={{
                    left: `${(currentStep / steps.length) * 100}%`,
                    top: '50%',
                    transform: 'translateX(-50%) translateY(-50%) rotate(45deg)'
                  }}
                ></div>
              </div>

              {/* Step labels */}
              <div className="flex justify-between gap-1 sm:gap-2">
                {steps.map((step, index) => {
                  const stepNum = index + 1;
                  const isActive = currentStep === stepNum;
                  const isComplete = currentStep > stepNum;

                  return (
                    <div
                      key={index}
                      className={`
                        flex-1 text-center transition-all duration-300
                        ${isActive ? 'scale-105' : ''}
                      `}
                    >
                      <div className={`
                        text-[10px] sm:text-xs md:text-sm font-heading tracking-wider sm:tracking-widest mb-0.5 sm:mb-1
                        ${isActive
                          ? 'text-infrared'
                          : isComplete
                            ? 'text-ghost-white'
                            : 'text-radar-grey-light'
                        }
                      `}>
                        {step.label}
                      </div>
                      <div className="text-[8px] sm:text-[9px] md:text-[10px] text-radar-grey-light uppercase tracking-wide sm:tracking-wider hidden sm:block">
                        {step.desc}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Step 1: Registration Scan */}
            {currentStep === 1 && (
              <div ref={step1Ref} className="max-w-2xl mx-auto">
                {/* Angular card wrapper */}
                <div className="relative">
                  {/* Top left corner accent */}
                  <div className="absolute -top-2 -left-2 w-8 h-8 border-l-2 border-t-2 border-infrared"></div>
                  <div className="absolute -bottom-2 -right-2 w-8 h-8 border-r-2 border-b-2 border-infrared"></div>

                  <div className="bg-radar-grey border border-radar-grey-dark p-8 sm:p-12 relative">
                    <div className="absolute top-0 right-0 text-infrared text-xs font-heading opacity-30 p-4">
                      STEP_01
                    </div>

                    <h2 className="text-3xl sm:text-4xl font-heading mb-3 text-ghost-white">
                      ENTER YOUR REGISTRATION
                    </h2>
                    <p className="text-radar-grey-light mb-8 text-sm leading-relaxed">
                      We&apos;ll automatically look up your vehicle details to ensure perfect fitment
                    </p>

                    <form onSubmit={handleRegistrationSubmit}>
                      <div className="mb-6">
                        <label htmlFor="registration" className="block text-ghost-white mb-3 font-heading text-sm tracking-wider uppercase">
                          Registration Code
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            id="registration"
                            value={registration}
                            onChange={(e) => setRegistration(e.target.value.toUpperCase())}
                            placeholder="AB12 CDE"
                            className="w-full px-4 sm:px-6 py-3 sm:py-4 bg-stealth-black border-2 border-radar-grey-dark text-ghost-white font-heading text-base sm:text-2xl tracking-widest focus:outline-none focus:border-infrared transition-colors uppercase"
                            required
                          />
                          <div className="absolute right-4 top-1/2 -translate-y-1/2">
                            <div className="w-2 h-2 bg-infrared animate-pulse"></div>
                          </div>
                        </div>
                      </div>

                      {error && (
                        <div ref={errorRef} className="mb-6 p-4 bg-infrared/10 border-l-4 border-infrared">
                          <p className="text-infrared font-heading text-sm tracking-wider">⚠ {error}</p>
                        </div>
                      )}

                      <Button
                        type="submit"
                        size="lg"
                        className="w-full"
                        disabled={isLoading || registration.length < 2}
                      >
                        {isLoading ? 'Looking up vehicle...' : 'Find My Vehicle'}
                      </Button>
                    </form>

                    <div className="mt-8 pt-6 border-t border-radar-grey-dark">
                      <div className="flex items-start gap-3">
                        <div className="w-1 h-1 bg-infrared rotate-45 mt-2 flex-shrink-0"></div>
                        <p className="text-xs text-radar-grey-light leading-relaxed">
                          <span className="text-ghost-white font-heading">INSTANT VERIFICATION:</span> Enter your UK registration for automatic vehicle identification and precision kit matching
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Verify Vehicle */}
            {currentStep === 2 && vehicleData && (
              <div ref={step2Ref} className="max-w-3xl mx-auto">
                <div className="relative">
                  <div className="absolute -top-2 -left-2 w-8 h-8 border-l-2 border-t-2 border-infrared"></div>
                  <div className="absolute -bottom-2 -right-2 w-8 h-8 border-r-2 border-b-2 border-infrared"></div>

                  <div className="bg-radar-grey border border-radar-grey-dark p-8 sm:p-12">
                    <div className="absolute top-0 right-0 text-infrared text-xs font-heading opacity-30 p-4">
                      STEP_02
                    </div>

                    <h2 className="text-3xl sm:text-4xl font-heading mb-3 text-ghost-white">
                      CONFIRM YOUR VEHICLE
                    </h2>
                    <p className="text-radar-grey-light mb-8 text-sm leading-relaxed">
                      Please verify these details match your vehicle exactly
                    </p>

                    {/* Technical spec display */}
                    <div className="bg-stealth-black border-l-4 border-infrared p-4 sm:p-6 mb-6 sm:mb-8">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                        <div>
                          <div className="text-[10px] text-radar-grey-light uppercase tracking-widest mb-1">REG_ID</div>
                          <div className="text-ghost-white font-heading text-xl sm:text-2xl tracking-wider">{vehicleData.registration}</div>
                        </div>
                        <div>
                          <div className="text-[10px] text-radar-grey-light uppercase tracking-widest mb-1">YEAR</div>
                          <div className="text-ghost-white font-heading text-xl sm:text-2xl">{vehicleData.year}</div>
                        </div>
                        <div>
                          <div className="text-[10px] text-radar-grey-light uppercase tracking-widest mb-1">MAKE</div>
                          <div className="text-ghost-white font-heading text-lg sm:text-xl">{vehicleData.make}</div>
                        </div>
                        <div>
                          <div className="text-[10px] text-radar-grey-light uppercase tracking-widest mb-1">MODEL</div>
                          <div className="text-ghost-white font-heading text-lg sm:text-xl">{vehicleData.model}</div>
                        </div>
                        {vehicleData.vehicleClass && (
                          <div>
                            <div className="text-[10px] text-radar-grey-light uppercase tracking-widest mb-1">TYPE</div>
                            <div className="text-infrared font-heading text-lg sm:text-xl uppercase tracking-wider">{vehicleData.vehicleClass}</div>
                          </div>
                        )}
                        {vehicleData.variant && (
                          <div className={vehicleData.vehicleClass ? '' : 'sm:col-span-2'}>
                            <div className="text-[10px] text-radar-grey-light uppercase tracking-widest mb-1">VARIANT</div>
                            <div className="text-ghost-white font-heading text-base sm:text-lg">{vehicleData.variant}</div>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                      <Button variant="secondary" onClick={handleBack} className="w-full sm:flex-1">
                        ← Go Back
                      </Button>
                      <Button onClick={handleVehicleConfirm} className="w-full sm:flex-1">
                        Confirm & Continue →
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Configure Protection */}
            {currentStep === 3 && (
              <div ref={step3Ref} className="max-w-7xl mx-auto px-4 sm:px-0">
                <div className="text-center mb-8 sm:mb-10 md:mb-12">
                  <h2 className="text-2xl sm:text-3xl md:text-4xl font-heading text-ghost-white mb-2">
                    CHOOSE YOUR COVERAGE
                  </h2>
                  <p className="text-radar-grey-light text-xs sm:text-sm leading-relaxed max-w-xl mx-auto">
                    Select your protection level and finish • All kits are precision-cut for your {vehicleData?.vehicleClass?.toLowerCase() || 'vehicle'}
                  </p>
                </div>

                {/* Coverage Options */}
                <div className="mb-8 sm:mb-10 md:mb-12">
                  <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
                    <div className="h-px flex-1 bg-radar-grey-dark"></div>
                    <span className="text-[10px] sm:text-xs text-radar-grey-light font-heading tracking-widest">COVERAGE LEVEL</span>
                    <div className="h-px flex-1 bg-radar-grey-dark"></div>
                  </div>

                  {coverageOptions.length === 0 && (
                    <div className="bg-radar-grey border border-radar-grey-dark p-8 text-center">
                      <p className="text-radar-grey-light text-sm">
                        Loading coverage options for your {vehicleData?.vehicleClass?.toLowerCase() || 'vehicle'}...
                      </p>
                    </div>
                  )}

                  <div className={`
                    grid gap-4 sm:gap-6
                    ${coverageOptions.length === 1 
                      ? 'grid-cols-1 max-w-md mx-auto' 
                      : coverageOptions.length === 2 
                        ? 'grid-cols-1 md:grid-cols-2 max-w-4xl mx-auto'
                        : coverageOptions.length === 4
                          ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-2 max-w-5xl mx-auto'
                          : 'grid-cols-1 md:grid-cols-3'
                    }
                  `}>
                    {coverageOptions.map((option) => {
                      // Get image from Shopify product
                      const imageSrc = option.image || '';

                      return (
                        <div
                          key={option.id}
                          onClick={() => handleCoverageSelect(option)}
                          className={`
                            relative cursor-pointer group transition-all duration-300
                            ${selectedCoverage?.id === option.id 
                              ? 'scale-105' 
                              : coverageOptions.length === 1 
                                ? 'hover:scale-[1.01]' 
                                : 'hover:scale-[1.02]'}
                          `}
                        >
                          {/* Angular corners */}
                          {selectedCoverage?.id === option.id && (
                            <>
                              <div className="absolute -top-1 sm:-top-2 -left-1 sm:-left-2 w-4 h-4 sm:w-6 sm:h-6 border-l-2 border-t-2 border-infrared z-10"></div>
                              <div className="absolute -bottom-1 sm:-bottom-2 -right-1 sm:-right-2 w-4 h-4 sm:w-6 sm:h-6 border-r-2 border-b-2 border-infrared z-10"></div>
                            </>
                          )}

                          <div className={`
                            bg-radar-grey border-2 transition-all duration-300 flex flex-col h-full overflow-hidden
                            ${selectedCoverage?.id === option.id
                              ? 'border-infrared shadow-lg shadow-infrared/20'
                              : 'border-radar-grey-dark hover:border-infrared/50'
                            }
                          `}>
                            {/* Image Section */}
                            {imageSrc && (
                              <div className="relative w-full aspect-[4/3] bg-stealth-black overflow-hidden border-b-2 border-radar-grey-dark">
                                <img
                                  src={imageSrc}
                                  alt={option.name}
                                  className="w-full h-full object-contain p-4"
                                />
                                {/* Image overlay on hover */}
                                <div className="absolute inset-0 bg-infrared/0 group-hover:bg-infrared/5 transition-all duration-300"></div>
                              </div>
                            )}

                            {/* Content Section */}
                            <div className="p-4 sm:p-5 md:p-6 flex flex-col flex-1">
                              {/* Header */}
                              <div className="mb-3 sm:mb-4">
                                <div className="text-[9px] sm:text-[10px] text-radar-grey-light uppercase tracking-widest mb-2">
                                  {option.id.replace('-', '_')}
                                </div>
                                <h3 className="text-lg sm:text-xl font-heading text-ghost-white mb-2 sm:mb-3 uppercase tracking-wide">
                                  {option.name}
                                </h3>
                                <div className="flex items-baseline gap-2">
                                  {(() => {
                                    // Check if variants have different prices
                                    const prices = option.variants.map(v => v.price);
                                    const minPrice = Math.min(...prices);
                                    const maxPrice = Math.max(...prices);
                                    const hasDifferentPrices = minPrice !== maxPrice && prices.length > 1;
                                    
                                    return (
                                      <>
                                        {hasDifferentPrices && (
                                          <span className="text-sm sm:text-base font-heading text-radar-grey-light">from</span>
                                        )}
                                        <span className="text-2xl sm:text-3xl font-heading text-infrared">
                                          £{hasDifferentPrices ? minPrice : option.price}
                                        </span>
                                        <span className="text-[10px] sm:text-xs text-radar-grey-light uppercase">GBP</span>
                                      </>
                                    );
                                  })()}
                                </div>
                              </div>

                              {/* Specs */}
                              <div className="space-y-1.5 sm:space-y-2 mb-4 sm:mb-6 flex-1">
                                <div className="text-[9px] sm:text-[10px] text-radar-grey-light uppercase tracking-widest mb-2">
                                  COVERAGE_SPEC
                                </div>
                                {option.includes.map((item, idx) => (
                                  <div key={idx} className="flex items-start gap-2">
                                    <div className="w-1 h-1 bg-infrared rotate-45 mt-1.5 flex-shrink-0"></div>
                                    <span className="text-[11px] sm:text-xs text-ghost-white leading-relaxed">{item}</span>
                                  </div>
                                ))}
                              </div>

                              {/* Selection indicator */}
                              {selectedCoverage?.id === option.id && (
                                <div className="bg-infrared/10 border-l-2 border-infrared py-1.5 sm:py-2 px-2 sm:px-3 mt-auto">
                                  <span className="text-infrared font-heading text-[10px] sm:text-xs tracking-wider">✓ SELECTED</span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Material Selection */}
                {selectedCoverage && (
                  <div ref={materialSectionRef} className="max-w-4xl mx-auto animate-fadeIn">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="h-px flex-1 bg-radar-grey-dark"></div>
                      <span className="text-xs text-radar-grey-light font-heading tracking-widest">MATERIAL SPEC</span>
                      <div className="h-px flex-1 bg-radar-grey-dark"></div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 max-w-4xl mx-auto">
                      {materialOptions.map((material) => (
                        <div
                          key={material.id}
                          onClick={() => handleMaterialSelect(material)}
                          className={`
                            relative cursor-pointer group transition-all duration-300
                            ${selectedMaterial?.id === material.id ? 'scale-105' : 'hover:scale-[1.02]'}
                          `}
                        >
                          {selectedMaterial?.id === material.id && (
                            <>
                              <div className="absolute -top-2 -left-2 w-6 h-6 border-l-2 border-t-2 border-infrared z-10"></div>
                              <div className="absolute -bottom-2 -right-2 w-6 h-6 border-r-2 border-b-2 border-infrared z-10"></div>
                            </>
                          )}

                          <div className={`
                            bg-radar-grey border-2 transition-all duration-300 flex flex-col h-full overflow-hidden
                            ${selectedMaterial?.id === material.id
                              ? 'border-infrared shadow-lg shadow-infrared/20'
                              : 'border-radar-grey-dark hover:border-infrared/50'
                            }
                          `}>
                            {/* Texture Visualization */}
                            <div className="relative aspect-[16/9] bg-gradient-to-br from-stealth-black to-radar-grey-dark border-b-2 border-radar-grey-dark overflow-hidden">
                              {material.id === 'matte' ? (
                                // Matte texture pattern - more visible
                                <div className="w-full h-full opacity-40">
                                  <svg className="w-full h-full" viewBox="0 0 200 200" preserveAspectRatio="none">
                                    <defs>
                                      <pattern id={`matte-texture-${material.id}`} x="0" y="0" width="10" height="10" patternUnits="userSpaceOnUse">
                                        <circle cx="2" cy="2" r="1.5" fill="currentColor" className="text-ghost-white" opacity="0.6" />
                                        <circle cx="7" cy="7" r="1.5" fill="currentColor" className="text-ghost-white" opacity="0.4" />
                                      </pattern>
                                    </defs>
                                    <rect width="200" height="200" fill={`url(#matte-texture-${material.id})`} />
                                  </svg>
                                </div>
                              ) : (
                                // Glossy shine effect - more prominent
                                <div className="w-full h-full relative">
                                  <div className="absolute inset-0 bg-gradient-to-br from-ghost-white/20 via-transparent to-transparent"></div>
                                  <div className="absolute top-0 right-0 w-2/3 h-2/3 bg-gradient-to-br from-ghost-white/30 via-ghost-white/10 to-transparent blur-2xl"></div>
                                  <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-gradient-to-tr from-ghost-white/5 to-transparent blur-xl"></div>
                                </div>
                              )}
                            </div>

                            {/* Content Section */}
                            <div className="p-6 flex flex-col flex-1">
                              <div className="text-[10px] text-radar-grey-light uppercase tracking-widest mb-2">
                                {material.id}_finish
                              </div>
                              <h3 className="text-2xl font-heading text-ghost-white mb-2 uppercase">
                                {material.name}
                              </h3>
                              <div className="text-sm text-infrared font-heading uppercase tracking-wider mb-4">
                                {material.finish}
                              </div>
                              
                              {/* Show variant price if available */}
                              {(() => {
                                const variant = selectedCoverage.variants.find(
                                  (v) => v.title.toLowerCase() === material.id.toLowerCase()
                                );
                                if (variant) {
                                  return (
                                    <div className="mb-4 pb-4 border-b border-radar-grey-dark">
                                      <div className="flex items-baseline gap-2">
                                        <span className="text-2xl font-heading text-ghost-white">£{variant.price}</span>
                                        <span className="text-[10px] text-radar-grey-light uppercase tracking-wider">GBP</span>
                                      </div>
                                    </div>
                                  );
                                }
                                return null;
                              })()}

                              <p className="text-radar-grey-light text-sm leading-relaxed flex-1">
                                {material.description}
                              </p>

                              {selectedMaterial?.id === material.id && (
                                <div className="mt-4 bg-infrared/10 border-l-2 border-infrared py-2 px-3">
                                  <span className="text-infrared font-heading text-xs tracking-wider">✓ SELECTED</span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div ref={actionButtonsRef} className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
                      <Button variant="secondary" onClick={handleBack} className="w-full sm:w-auto">
                        ← Go Back
                      </Button>
                      <Button
                        onClick={handleProceedToReview}
                        disabled={!selectedCoverage || !selectedMaterial}
                        className="w-full sm:w-auto"
                      >
                        Review Order →
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Step 4: Mission Brief / Review */}
            {currentStep === 4 && vehicleData && selectedCoverage && selectedMaterial && (
              <div ref={step4Ref} className="max-w-4xl mx-auto">
                <div className="relative">
                  <div className="absolute -top-2 -left-2 w-8 h-8 border-l-2 border-t-2 border-infrared"></div>
                  <div className="absolute -bottom-2 -right-2 w-8 h-8 border-r-2 border-b-2 border-infrared"></div>

                  <div className="bg-radar-grey border border-radar-grey-dark p-8 sm:p-12">
                    <div className="absolute top-0 right-0 text-infrared text-xs font-heading opacity-30 p-4">
                      STEP_04
                    </div>

                    <h2 className="text-3xl sm:text-4xl font-heading mb-3 text-ghost-white">
                      REVIEW YOUR ORDER
                    </h2>
                    <p className="text-radar-grey-light mb-8 text-sm leading-relaxed">
                      Next step: We&apos;ll request photos of your front and rear bumpers to verify your exact vehicle spec before cutting
                    </p>

                    {/* Mission specs */}
                    <div className="space-y-4 mb-8">
                      {/* Target vehicle */}
                      <div className="bg-stealth-black border-l-4 border-infrared p-6">
                        <div className="text-[10px] text-radar-grey-light uppercase tracking-widest mb-3">TARGET_VEHICLE</div>
                        <div className="text-ghost-white font-heading text-xl mb-1">
                          {vehicleData.year} {vehicleData.make} {vehicleData.model}
                          {vehicleData.variant && ` ${vehicleData.variant}`}
                        </div>
                        <div className="text-radar-grey-light text-sm tracking-wider">{vehicleData.registration}</div>
                      </div>

                      {/* Protection config */}
                      <div className="bg-stealth-black border-l-4 border-infrared p-6">
                        <div className="text-[10px] text-radar-grey-light uppercase tracking-widest mb-3">PROTECTION_CONFIG</div>
                        <div className="mb-4">
                          <div className="text-ghost-white font-heading text-lg mb-3 uppercase">
                            {selectedCoverage.name}
                          </div>
                          <div className="space-y-1.5">
                            {selectedCoverage.includes.map((item, idx) => (
                              <div key={idx} className="flex items-start gap-2">
                                <div className="w-1 h-1 bg-infrared rotate-45 mt-1.5 flex-shrink-0"></div>
                                <span className="text-xs text-radar-grey-light">{item}</span>
                              </div>
                            ))}
                          </div>
                          <div className="mt-4 pt-4 border-t border-radar-grey-dark">
                            <div className="text-[10px] text-radar-grey-light uppercase tracking-widest mb-1">MATERIAL_SPEC</div>
                            <div className="text-ghost-white font-heading">
                              {selectedMaterial.name}
                              <span className="text-infrared ml-2 text-sm">({selectedMaterial.finish})</span>
                            </div>
                          </div>
                        </div>
                        
                        {/* Price - Separate section for mobile compatibility */}
                        <div className="pt-4 border-t border-radar-grey-dark">
                          <div className="text-infrared font-heading text-3xl">
                            £{(() => {
                              // Get the selected variant's price
                              const selectedVariant = selectedCoverage.variants.find(
                                (v) => v.title.toLowerCase() === selectedMaterial.id.toLowerCase()
                              );
                              return selectedVariant ? selectedVariant.price : selectedCoverage.price;
                            })()}
                          </div>
                          <div className="text-[10px] text-radar-grey-light uppercase tracking-widest mt-1">TOTAL_GBP</div>
                        </div>
                      </div>

                      {/* Post-deployment protocol */}
                      <div className="bg-radar-grey/30 border-l-4 border-radar-grey-light p-6">
                        <div className="text-[10px] text-radar-grey-light uppercase tracking-widest mb-3">POST_DEPLOY_PROTOCOL</div>
                        <p className="text-radar-grey-light text-sm leading-relaxed">
                          Automated system will request vehicle imagery (front/rear bumpers) plus sensor configuration data.
                          This ensures precision pattern matching for your specific vehicle configuration.
                        </p>
                      </div>

                    </div>

                    {error && (
                      <div className="mb-6 p-4 bg-infrared/10 border-l-4 border-infrared">
                        <p className="text-infrared font-heading text-sm tracking-wider">⚠ {error}</p>
                      </div>
                    )}

                    <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                      <Button variant="secondary" onClick={handleBack} className="w-full sm:flex-1" disabled={isCheckingOut}>
                        ← Edit Configuration
                      </Button>
                      <Button onClick={handleAddToCart} className="w-full sm:flex-1" disabled={isCheckingOut}>
                        {isCheckingOut ? 'Adding to Cart...' : 'Add to Cart →'}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </PageLayout>
  );
}
