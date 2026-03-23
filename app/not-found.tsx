import Link from 'next/link';
import { PageLayout, Button } from '@/components';

export default function NotFound() {
  return (
    <PageLayout>
      <div className="min-h-[70vh] flex items-center justify-center px-4">
        <div className="max-w-lg text-center">
          <div className="relative inline-block mb-8">
            <div className="absolute -top-2 -left-2 w-6 h-6 border-l-2 border-t-2 border-infrared"></div>
            <div className="absolute -bottom-2 -right-2 w-6 h-6 border-r-2 border-b-2 border-infrared"></div>
            <div className="px-10 py-6 border border-radar-grey-dark bg-radar-grey">
              <span className="text-6xl font-heading text-infrared tracking-widest">404</span>
            </div>
          </div>

          <h1 className="text-3xl sm:text-4xl font-heading text-ghost-white mb-4 tracking-wider uppercase">
            Page Not Found
          </h1>

          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="h-px w-12 bg-radar-grey-dark"></div>
            <div className="w-1 h-1 bg-infrared rotate-45"></div>
            <div className="h-px w-12 bg-radar-grey-dark"></div>
          </div>

          <p className="text-radar-grey-light mb-10 leading-relaxed">
            The page you&apos;re looking for doesn&apos;t exist or has been moved.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/">
              <Button size="lg">Return Home</Button>
            </Link>
            <Link href="/pre-cut">
              <Button variant="secondary" size="lg">Configure Kit</Button>
            </Link>
            <Link href="/contact">
              <Button variant="secondary" size="lg">Contact Us</Button>
            </Link>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
