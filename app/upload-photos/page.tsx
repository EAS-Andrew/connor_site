'use client';

import { useEffect, useState, useRef, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { BumperOverlay } from '@/components';

interface OrderData {
  shopifyOrderName: string;
  email: string;
  vehicleData: {
    registration: string;
    make: string;
    model: string;
    year: string;
    variant?: string;
  };
}

type CaptureStep = 'front' | 'rear' | 'preview' | 'success';

function UploadPhotosContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [orderData, setOrderData] = useState<OrderData | null>(null);
  
  const [step, setStep] = useState<CaptureStep>('front');
  const [frontImage, setFrontImage] = useState<string | null>(null);
  const [rearImage, setRearImage] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [cameraActive, setCameraActive] = useState(false);

  // Detect if user is on mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(/iPhone|iPad|iPod|Android/i.test(navigator.userAgent) || window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Validate token and load order data
  useEffect(() => {
    const validateToken = async () => {
      if (!token) {
        setError('Missing photo upload token. Please check the link in your email.');
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`/api/validate-token?token=${token}`);
        if (!response.ok) {
          if (response.status === 404) {
            setError('This link has expired or been used already.');
          } else {
            setError('Invalid upload link.');
          }
          setLoading(false);
          return;
        }

        const data = await response.json();
        setOrderData(data);
        setLoading(false);
      } catch (err) {
        setError('Unable to verify upload link.');
        setLoading(false);
      }
    };

    validateToken();
  }, [token]);

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { 
          facingMode: 'environment',
          width: { ideal: 1920 },
          height: { ideal: 1080 }
        }
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
      setStream(mediaStream);
      setCameraActive(true);
    } catch (err) {
      console.error('Camera access error:', err);
      alert('Unable to access camera. Please grant camera permissions.');
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
      setCameraActive(false);
    }
  };

  useEffect(() => {
    return () => stopCamera();
  }, []);

  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(video, 0, 0);
      const imageData = canvas.toDataURL('image/jpeg', 0.85);
      
      if (step === 'front') {
        setFrontImage(imageData);
        stopCamera();
        setStep('rear');
      } else if (step === 'rear') {
        setRearImage(imageData);
        stopCamera();
        setStep('preview');
      }
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, bumper: 'front' | 'rear') => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      alert('File too large. Maximum size: 10MB');
      return;
    }

    if (!file.type.startsWith('image/')) {
      alert('Please select an image file.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const imageData = event.target?.result as string;
      
      if (bumper === 'front') {
        setFrontImage(imageData);
        if (rearImage) setStep('preview');
        else setStep('rear');
      } else {
        setRearImage(imageData);
        if (frontImage) setStep('preview');
      }
    };
    reader.readAsDataURL(file);
  };

  const retake = (bumper: 'front' | 'rear') => {
    if (bumper === 'front') {
      setFrontImage(null);
      setStep('front');
    } else {
      setRearImage(null);
      setStep('rear');
    }
  };

  const submitPhotos = async () => {
    if (!frontImage || !rearImage || !token) return;

    setSubmitting(true);
    try {
      const response = await fetch('/api/upload-photos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, frontImage, rearImage }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Upload failed');
      }

      setStep('success');
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to upload photos.');
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-void-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-infrared border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-radar-grey-light font-heading tracking-[0.2em] text-sm">VERIFYING_LINK</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-void-black flex items-center justify-center p-4">
        <div className="max-w-md text-center">
          <div className="relative inline-block mb-6">
            <div className="absolute -top-1 -left-1 w-4 h-4 border-l-2 border-t-2 border-infrared"></div>
            <div className="absolute -bottom-1 -right-1 w-4 h-4 border-r-2 border-b-2 border-infrared"></div>
            <div className="px-8 py-4 border border-radar-grey-dark bg-radar-grey">
              <span className="text-infrared text-4xl">⚠</span>
            </div>
          </div>
          <h1 className="text-2xl font-heading text-ghost-white mb-4 tracking-wider uppercase">Access Denied</h1>
          <p className="text-radar-grey-light mb-8 text-sm leading-relaxed">{error}</p>
          <a
            href="mailto:hello@orders.stealthshieldppf.com"
            className="inline-block bg-infrared text-ghost-white px-8 py-3 font-heading tracking-widest text-sm uppercase hover:bg-red-700 transition"
          >
            Contact Support
          </a>
        </div>
      </div>
    );
  }

  if (step === 'success') {
    return (
      <div className="min-h-screen bg-void-black flex items-center justify-center p-4">
        <div className="max-w-md text-center">
          <div className="relative inline-block mb-6">
            <div className="absolute -top-1 -left-1 w-4 h-4 border-l-2 border-t-2 border-infrared"></div>
            <div className="absolute -bottom-1 -right-1 w-4 h-4 border-r-2 border-b-2 border-infrared"></div>
            <div className="px-8 py-4 border border-radar-grey-dark bg-radar-grey">
              <span className="text-infrared text-4xl">✓</span>
            </div>
          </div>
          <h1 className="text-2xl font-heading text-ghost-white mb-4 tracking-wider uppercase">Mission Complete</h1>
          <p className="text-radar-grey-light mb-4 text-sm leading-relaxed">
            Bumper photos received. Your custom PPF kit will be precision-cut based on your vehicle specifications.
          </p>
          <div className="bg-radar-grey border border-radar-grey-dark p-4 mb-8">
            <p className="text-ghost-white font-heading text-xs tracking-widest mb-2">ORDER_ID</p>
            <p className="text-infrared font-heading text-lg tracking-wider">{orderData?.shopifyOrderName}</p>
          </div>
          <p className="text-radar-grey-light text-sm mb-8">
            Expected dispatch: 2-3 business days<br/>
            Tracking details will be sent via email
          </p>
          <a
            href="/"
            className="inline-block bg-infrared text-ghost-white px-8 py-3 font-heading tracking-widest text-sm uppercase hover:bg-red-700 transition"
          >
            Return to Base
          </a>
        </div>
      </div>
    );
  }

  const currentBumper = step === 'front' ? 'FRONT' : step === 'rear' ? 'REAR' : 'REVIEW';
  const progress = step === 'front' ? 33 : step === 'rear' ? 66 : 100;

  return (
    <div className="min-h-screen bg-void-black text-ghost-white">
      {/* Tactical Header */}
      <div className="border-b border-radar-grey-dark bg-radar-grey/30">
        <div className="max-w-5xl mx-auto p-4 md:p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-2 h-2 bg-infrared"></div>
                <h1 className="text-xl md:text-2xl font-heading tracking-[0.2em] uppercase">Photo_Upload</h1>
              </div>
              <p className="text-radar-grey-light text-xs tracking-wider">
                ORDER: <span className="text-infrared">{orderData?.shopifyOrderName}</span> • 
                {' '}{orderData?.vehicleData.year} {orderData?.vehicleData.make} {orderData?.vehicleData.model}
              </p>
            </div>
            <div className="text-right">
              <p className="text-xs text-radar-grey-light tracking-wider uppercase mb-1">Progress</p>
              <p className="text-2xl font-heading text-infrared">{progress}%</p>
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="h-1 bg-radar-grey-dark relative">
            <div 
              className="h-full bg-infrared transition-all duration-500"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto p-4 md:p-6">
        {/* Step Indicator */}
        {step !== 'preview' && (
          <div className="mb-8">
            <div className="inline-flex items-center gap-3 bg-radar-grey border border-radar-grey-dark px-4 py-2">
              <div className="w-8 h-8 bg-infrared/20 border border-infrared flex items-center justify-center">
                <span className="text-infrared font-heading text-sm">{step === 'front' ? '1' : '2'}</span>
              </div>
              <div>
                <p className="text-xs text-radar-grey-light tracking-widest uppercase">Capturing</p>
                <p className="text-ghost-white font-heading tracking-wider uppercase">{currentBumper}_Bumper</p>
              </div>
            </div>
          </div>
        )}

        {/* Mobile: Camera Mode */}
        {isMobile && step !== 'preview' && (
          <div className="space-y-6">
            {/* Instructions */}
            <div className="bg-radar-grey border-l-2 border-infrared p-6">
              <h3 className="text-ghost-white font-heading tracking-wider uppercase mb-3 text-sm">Mission Brief</h3>
              <ul className="space-y-2 text-radar-grey-light text-sm leading-relaxed">
                <li className="flex items-start gap-2">
                  <span className="text-infrared mt-1">▸</span>
                  <span>Center {step === 'front' ? 'front' : 'rear'} bumper in viewfinder</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-infrared mt-1">▸</span>
                  <span>Ensure sensors and features are visible</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-infrared mt-1">▸</span>
                  <span>Good lighting required for analysis</span>
                </li>
              </ul>
            </div>

            {/* Camera View */}
            {cameraActive ? (
              <div className="relative aspect-[4/3] bg-black border border-radar-grey-dark overflow-hidden">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover"
                />
                <BumperOverlay type={step === 'front' ? 'front' : 'rear'} />
                
                {/* Capture Button */}
                <div className="absolute bottom-6 left-0 right-0 flex justify-center">
                  <button
                    onClick={capturePhoto}
                    className="relative w-20 h-20"
                  >
                    <div className="absolute inset-0 border-4 border-ghost-white rounded-full"></div>
                    <div className="absolute inset-2 bg-infrared rounded-full hover:bg-red-700 transition"></div>
                  </button>
                </div>
                
                <canvas ref={canvasRef} className="hidden" />
              </div>
            ) : (
              <button
                onClick={startCamera}
                className="w-full bg-infrared text-ghost-white py-6 font-heading tracking-widest text-sm uppercase hover:bg-red-700 transition flex items-center justify-center gap-3"
              >
                <span className="text-2xl">📸</span>
                <span>Activate Camera</span>
              </button>
            )}
          </div>
        )}

        {/* Desktop: File Upload Mode */}
        {!isMobile && step !== 'preview' && (
          <div className="space-y-6">
            {/* Front Bumper */}
            {step === 'front' || frontImage ? (
              <div className="border border-radar-grey-dark bg-radar-grey/20">
                <div className="border-b border-radar-grey-dark bg-radar-grey/50 px-6 py-3">
                  <h3 className="font-heading tracking-wider uppercase text-sm flex items-center gap-2">
                    <span className="w-6 h-6 bg-infrared/20 border border-infrared flex items-center justify-center text-xs">1</span>
                    Front_Bumper
                  </h3>
                </div>
                <div className="p-6">
                  {frontImage ? (
                    <div className="relative">
                      <img src={frontImage} alt="Front bumper" className="w-full border border-radar-grey-dark" />
                      <button
                        onClick={() => setFrontImage(null)}
                        className="absolute top-4 right-4 bg-radar-grey border border-infrared text-infrared px-4 py-2 text-xs font-heading tracking-wider hover:bg-infrared hover:text-ghost-white transition uppercase"
                      >
                        Retake
                      </button>
                    </div>
                  ) : (
                    <label className="block cursor-pointer group">
                      <div className="border-2 border-dashed border-radar-grey-dark group-hover:border-infrared transition p-16 text-center">
                        <div className="text-6xl mb-4 text-radar-grey-light group-hover:text-infrared transition">📁</div>
                        <p className="text-ghost-white font-heading tracking-wider uppercase text-sm mb-2">Click to Upload</p>
                        <p className="text-xs text-radar-grey-light">JPG, PNG • Max 10MB</p>
                      </div>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileUpload(e, 'front')}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>
              </div>
            ) : null}

            {/* Rear Bumper */}
            {(step === 'rear' || rearImage) && frontImage ? (
              <div className="border border-radar-grey-dark bg-radar-grey/20">
                <div className="border-b border-radar-grey-dark bg-radar-grey/50 px-6 py-3">
                  <h3 className="font-heading tracking-wider uppercase text-sm flex items-center gap-2">
                    <span className="w-6 h-6 bg-infrared/20 border border-infrared flex items-center justify-center text-xs">2</span>
                    Rear_Bumper
                  </h3>
                </div>
                <div className="p-6">
                  {rearImage ? (
                    <div className="relative">
                      <img src={rearImage} alt="Rear bumper" className="w-full border border-radar-grey-dark" />
                      <button
                        onClick={() => setRearImage(null)}
                        className="absolute top-4 right-4 bg-radar-grey border border-infrared text-infrared px-4 py-2 text-xs font-heading tracking-wider hover:bg-infrared hover:text-ghost-white transition uppercase"
                      >
                        Retake
                      </button>
                    </div>
                  ) : (
                    <label className="block cursor-pointer group">
                      <div className="border-2 border-dashed border-radar-grey-dark group-hover:border-infrared transition p-16 text-center">
                        <div className="text-6xl mb-4 text-radar-grey-light group-hover:text-infrared transition">📁</div>
                        <p className="text-ghost-white font-heading tracking-wider uppercase text-sm mb-2">Click to Upload</p>
                        <p className="text-xs text-radar-grey-light">JPG, PNG • Max 10MB</p>
                      </div>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileUpload(e, 'rear')}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>
              </div>
            ) : null}

            {frontImage && rearImage && step !== 'preview' && (
              <button
                onClick={() => setStep('preview')}
                className="w-full bg-infrared text-ghost-white py-4 font-heading tracking-widest text-sm uppercase hover:bg-red-700 transition"
              >
                Continue to Review
              </button>
            )}
          </div>
        )}

        {/* Preview (Both Mobile & Desktop) */}
        {step === 'preview' && (
          <div className="space-y-6">
            <div className="bg-radar-grey border-l-2 border-infrared p-6">
              <h3 className="text-ghost-white font-heading tracking-wider uppercase mb-3 text-sm">Final Check</h3>
              <p className="text-radar-grey-light text-sm leading-relaxed">
                Verify both images clearly show sensors, parking cameras, washer jets, and any modifications before submission.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-heading tracking-wider uppercase text-sm">Front_Bumper</h3>
                  <button
                    onClick={() => retake('front')}
                    className="text-xs text-infrared hover:text-red-400 transition uppercase tracking-wider"
                  >
                    Retake
                  </button>
                </div>
                <img src={frontImage || ''} alt="Front bumper" className="w-full border border-radar-grey-dark" />
              </div>
              
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-heading tracking-wider uppercase text-sm">Rear_Bumper</h3>
                  <button
                    onClick={() => retake('rear')}
                    className="text-xs text-infrared hover:text-red-400 transition uppercase tracking-wider"
                  >
                    Retake
                  </button>
                </div>
                <img src={rearImage || ''} alt="Rear bumper" className="w-full border border-radar-grey-dark" />
              </div>
            </div>

            <button
              onClick={submitPhotos}
              disabled={submitting}
              className="w-full bg-infrared text-ghost-white py-4 font-heading tracking-widest text-sm uppercase hover:bg-red-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? 'Transmitting Data...' : 'Submit Photos'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// Loading fallback component
function LoadingFallback() {
  return (
    <div className="min-h-screen bg-void-black flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-infrared border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-radar-grey-light font-heading tracking-[0.2em] text-sm">LOADING</p>
      </div>
    </div>
  );
}

// Default export with Suspense boundary
export default function UploadPhotosPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <UploadPhotosContent />
    </Suspense>
  );
}
