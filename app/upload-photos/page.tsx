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

type CaptureMode = 'camera' | 'upload';
type CaptureStep = 'front' | 'rear' | 'preview' | 'success';

function UploadPhotosContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [orderData, setOrderData] = useState<OrderData | null>(null);
  
  const [mode, setMode] = useState<CaptureMode>('camera');
  const [step, setStep] = useState<CaptureStep>('front');
  const [frontImage, setFrontImage] = useState<string | null>(null);
  const [rearImage, setRearImage] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);

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
            setError('This link has expired or been used already. Please contact support if you need to upload photos.');
          } else {
            setError('Invalid upload link. Please check the link in your email.');
          }
          setLoading(false);
          return;
        }

        const data = await response.json();
        setOrderData(data);
        setLoading(false);
      } catch (err) {
        setError('Unable to verify upload link. Please try again.');
        setLoading(false);
      }
    };

    validateToken();
  }, [token]);

  // Initialize camera when in camera mode
  useEffect(() => {
    if (mode === 'camera' && step !== 'preview' && step !== 'success') {
      startCamera();
    } else {
      stopCamera();
    }

    return () => stopCamera();
  }, [mode, step]);

  const startCamera = async () => {
    try {
      setCameraError(null);
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { 
          facingMode: 'environment', // Use back camera on mobile
          width: { ideal: 1920 },
          height: { ideal: 1080 }
        }
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
      setStream(mediaStream);
    } catch (err) {
      console.error('Camera access error:', err);
      setCameraError('Unable to access camera. Please use file upload instead.');
      setMode('upload');
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
  };

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

    // Check file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      alert('File too large. Please choose an image under 10MB.');
      return;
    }

    // Check file type
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
        body: JSON.stringify({
          token,
          frontImage,
          rearImage,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Upload failed');
      }

      setStep('success');
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to upload photos. Please try again.');
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-void-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-stealthshield-red border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-radar-grey-light font-heading tracking-wider">VERIFYING LINK...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-void-black flex items-center justify-center p-4">
        <div className="max-w-md text-center">
          <div className="text-6xl mb-4">⚠️</div>
          <h1 className="text-2xl font-heading text-ghost-white mb-4 tracking-wider">INVALID LINK</h1>
          <p className="text-radar-grey-light mb-8">{error}</p>
          <a
            href="mailto:hello@orders.stealthshieldppf.com"
            className="inline-block bg-stealthshield-red text-ghost-white px-8 py-3 font-heading tracking-wider hover:bg-red-700 transition"
          >
            CONTACT SUPPORT
          </a>
        </div>
      </div>
    );
  }

  if (step === 'success') {
    return (
      <div className="min-h-screen bg-void-black flex items-center justify-center p-4">
        <div className="max-w-md text-center">
          <div className="text-6xl mb-4">✓</div>
          <h1 className="text-2xl font-heading text-ghost-white mb-4 tracking-wider">PHOTOS SUBMITTED</h1>
          <p className="text-radar-grey-light mb-4">
            Thanks for uploading your bumper photos! We'll review them and precision-cut your PPF kit.
          </p>
          <p className="text-radar-grey-light mb-8">
            Your order <span className="text-stealthshield-red font-bold">{orderData?.shopifyOrderName}</span> will ship within 2-3 business days.
          </p>
          <a
            href="/"
            className="inline-block bg-stealthshield-red text-ghost-white px-8 py-3 font-heading tracking-wider hover:bg-red-700 transition"
          >
            RETURN HOME
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-void-black text-ghost-white">
      {/* Header */}
      <div className="border-b border-carbon-fiber-grey">
        <div className="max-w-4xl mx-auto p-6">
          <h1 className="text-2xl font-heading tracking-wider mb-2">UPLOAD BUMPER PHOTOS</h1>
          <p className="text-radar-grey-light text-sm">
            Order: <span className="text-stealthshield-red">{orderData?.shopifyOrderName}</span> • 
            {' '}{orderData?.vehicleData.year} {orderData?.vehicleData.make} {orderData?.vehicleData.model}
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-6">
        {/* Mode Toggle */}
        {step !== 'preview' && (
          <div className="flex gap-2 mb-6">
            <button
              onClick={() => setMode('camera')}
              className={`flex-1 px-4 py-3 font-heading tracking-wider transition ${
                mode === 'camera'
                  ? 'bg-stealthshield-red text-ghost-white'
                  : 'bg-carbon-fiber-grey text-radar-grey-light hover:text-ghost-white'
              }`}
            >
              📸 CAMERA
            </button>
            <button
              onClick={() => setMode('upload')}
              className={`flex-1 px-4 py-3 font-heading tracking-wider transition ${
                mode === 'upload'
                  ? 'bg-stealthshield-red text-ghost-white'
                  : 'bg-carbon-fiber-grey text-radar-grey-light hover:text-ghost-white'
              }`}
            >
              📁 UPLOAD FILES
            </button>
          </div>
        )}

        {cameraError && mode === 'camera' && (
          <div className="bg-yellow-900/20 border border-yellow-700 p-4 mb-6">
            <p className="text-yellow-200 text-sm">{cameraError}</p>
          </div>
        )}

        {/* Camera Mode */}
        {mode === 'camera' && step !== 'preview' && (
          <div className="relative aspect-video bg-black rounded overflow-hidden">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover"
            />
            <BumperOverlay type={step === 'front' ? 'front' : 'rear'} />
            
            <div className="absolute bottom-6 left-0 right-0 flex justify-center">
              <button
                onClick={capturePhoto}
                className="w-20 h-20 rounded-full bg-stealthshield-red border-4 border-white hover:scale-110 transition"
              >
                <span className="sr-only">Capture Photo</span>
              </button>
            </div>
            
            <canvas ref={canvasRef} className="hidden" />
          </div>
        )}

        {/* Upload Mode */}
        {mode === 'upload' && step !== 'preview' && (
          <div className="space-y-4">
            {/* Front Bumper Upload */}
            <div className="border-2 border-dashed border-carbon-fiber-grey rounded p-6">
              <h3 className="font-heading tracking-wider mb-4">FRONT BUMPER</h3>
              {frontImage ? (
                <div className="relative">
                  <img src={frontImage} alt="Front bumper" className="w-full rounded" />
                  <button
                    onClick={() => setFrontImage(null)}
                    className="absolute top-2 right-2 bg-black/70 text-white px-3 py-1 text-sm font-heading tracking-wider hover:bg-black"
                  >
                    RETAKE
                  </button>
                </div>
              ) : (
                <label className="block cursor-pointer">
                  <div className="border-2 border-dashed border-radar-grey-light rounded p-12 text-center hover:border-stealthshield-red transition">
                    <div className="text-4xl mb-4">📸</div>
                    <p className="text-radar-grey-light mb-2">Click to select front bumper photo</p>
                    <p className="text-xs text-radar-grey-light">JPG, PNG up to 10MB</p>
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

            {/* Rear Bumper Upload */}
            <div className="border-2 border-dashed border-carbon-fiber-grey rounded p-6">
              <h3 className="font-heading tracking-wider mb-4">REAR BUMPER</h3>
              {rearImage ? (
                <div className="relative">
                  <img src={rearImage} alt="Rear bumper" className="w-full rounded" />
                  <button
                    onClick={() => setRearImage(null)}
                    className="absolute top-2 right-2 bg-black/70 text-white px-3 py-1 text-sm font-heading tracking-wider hover:bg-black"
                  >
                    RETAKE
                  </button>
                </div>
              ) : (
                <label className="block cursor-pointer">
                  <div className="border-2 border-dashed border-radar-grey-light rounded p-12 text-center hover:border-stealthshield-red transition">
                    <div className="text-4xl mb-4">📸</div>
                    <p className="text-radar-grey-light mb-2">Click to select rear bumper photo</p>
                    <p className="text-xs text-radar-grey-light">JPG, PNG up to 10MB</p>
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

            {frontImage && rearImage && (
              <button
                onClick={() => setStep('preview')}
                className="w-full bg-stealthshield-red text-ghost-white px-8 py-4 font-heading tracking-wider hover:bg-red-700 transition"
              >
                CONTINUE TO PREVIEW
              </button>
            )}
          </div>
        )}

        {/* Preview */}
        {step === 'preview' && (
          <div className="space-y-6">
            <h2 className="text-xl font-heading tracking-wider">REVIEW PHOTOS</h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-heading tracking-wider mb-2 text-sm">FRONT BUMPER</h3>
                <div className="relative">
                  <img src={frontImage || ''} alt="Front bumper" className="w-full rounded" />
                  <button
                    onClick={() => retake('front')}
                    className="absolute top-2 right-2 bg-black/70 text-white px-3 py-1 text-sm font-heading tracking-wider hover:bg-black"
                  >
                    RETAKE
                  </button>
                </div>
              </div>
              
              <div>
                <h3 className="font-heading tracking-wider mb-2 text-sm">REAR BUMPER</h3>
                <div className="relative">
                  <img src={rearImage || ''} alt="Rear bumper" className="w-full rounded" />
                  <button
                    onClick={() => retake('rear')}
                    className="absolute top-2 right-2 bg-black/70 text-white px-3 py-1 text-sm font-heading tracking-wider hover:bg-black"
                  >
                    RETAKE
                  </button>
                </div>
              </div>
            </div>

            <div className="bg-carbon-fiber-grey border border-radar-grey-light p-6 rounded">
              <p className="text-sm text-radar-grey-light mb-4">
                Please verify both images are clear and show:
              </p>
              <ul className="space-y-2 text-sm text-radar-grey-light">
                <li>✓ Full bumper width visible</li>
                <li>✓ Parking sensors and cameras clearly visible</li>
                <li>✓ Good lighting (not too dark or bright)</li>
                <li>✓ Straight-on angle (not tilted)</li>
              </ul>
            </div>

            <button
              onClick={submitPhotos}
              disabled={submitting}
              className="w-full bg-stealthshield-red text-ghost-white px-8 py-4 font-heading tracking-wider hover:bg-red-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? 'SUBMITTING...' : 'SUBMIT PHOTOS'}
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
        <div className="w-16 h-16 border-4 border-stealthshield-red border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-radar-grey-light font-heading tracking-wider">LOADING...</p>
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

