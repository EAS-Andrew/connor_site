'use client';

import Link from 'next/link';
import { Button } from '@/components';

export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-screen bg-stealth-black flex items-center justify-center px-4">
      <div className="max-w-lg text-center">
        <div className="relative inline-block mb-8">
          <div className="absolute -top-2 -left-2 w-6 h-6 border-l-2 border-t-2 border-infrared"></div>
          <div className="absolute -bottom-2 -right-2 w-6 h-6 border-r-2 border-b-2 border-infrared"></div>
          <div className="px-10 py-6 border border-radar-grey-dark bg-radar-grey">
            <svg className="w-12 h-12 text-infrared mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
        </div>

        <h1 className="text-3xl sm:text-4xl font-heading text-ghost-white mb-4 tracking-wider uppercase">
          Something Went Wrong
        </h1>

        <div className="flex items-center justify-center gap-3 mb-6">
          <div className="h-px w-12 bg-radar-grey-dark"></div>
          <div className="w-1 h-1 bg-infrared rotate-45"></div>
          <div className="h-px w-12 bg-radar-grey-dark"></div>
        </div>

        <p className="text-radar-grey-light mb-10 leading-relaxed">
          An unexpected error occurred. Please try again or contact our support team if the problem persists.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" onClick={reset}>Try Again</Button>
          <Link href="/">
            <Button variant="secondary" size="lg">Return Home</Button>
          </Link>
          <Link href="/contact">
            <Button variant="secondary" size="lg">Contact Support</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
