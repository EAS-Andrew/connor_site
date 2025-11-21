'use client';

import { useState, FormEvent } from 'react';
import { PageLayout } from '@/components';
import { Button } from '@/components';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      const formDataToSubmit = new FormData(e.currentTarget as HTMLFormElement);
      formDataToSubmit.append("access_key", "52a9e82f-eb18-4f3b-b324-7d8008ecf5ec");

      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: formDataToSubmit
      });

      const data = await response.json();

      if (data.success) {
        setSubmitStatus('success');
        // Reset form after 3 seconds
        setTimeout(() => {
          setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
          setSubmitStatus('idle');
        }, 3000);
      } else {
        setSubmitStatus('error');
      }
    } catch (error) {
      console.error('Form submission error:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <PageLayout>
      <div className="bg-stealth-black min-h-screen">
        {/* Hero Section */}
        <section className="relative py-16 sm:py-24 overflow-hidden">
          <div className="container mx-auto px-4 sm:px-6">
            {/* Angular background pattern */}
            <div className="absolute top-0 left-0 w-48 h-48 md:w-64 md:h-64 border-l-2 border-t-2 border-radar-grey-dark opacity-30"></div>
            <div className="absolute bottom-0 right-0 w-48 h-48 md:w-64 md:h-64 border-r-2 border-b-2 border-radar-grey-dark opacity-30"></div>

            <div className="relative z-10 max-w-4xl mx-auto text-center">
              <div className="mb-4">
                <span className="text-[10px] text-infrared uppercase tracking-[0.3em] font-heading">
                  COMMUNICATION_CHANNEL
                </span>
              </div>

              <h1 className="text-4xl sm:text-5xl md:text-6xl font-heading mb-6 text-ghost-white tracking-wider">
                CONTACT US
              </h1>

              {/* Divider */}
              <div className="flex items-center justify-center gap-3 mb-6">
                <div className="h-px w-16 bg-radar-grey-dark"></div>
                <div className="w-1 h-1 bg-infrared rotate-45"></div>
                <div className="h-px w-16 bg-radar-grey-dark"></div>
              </div>

              <p className="text-lg sm:text-xl text-radar-grey-light max-w-2xl mx-auto leading-relaxed">
                Questions about PPF, ordering, or installation? We&apos;re here to help.
              </p>
            </div>
          </div>
        </section>

        {/* Contact Form & Info */}
        <section className="py-12 sm:py-20">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Contact Information */}
              <div className="lg:col-span-1 space-y-6">
                <div className="bg-radar-grey border border-radar-grey-dark p-6">
                  <div className="mb-3">
                    <span className="text-[9px] text-infrared uppercase tracking-[0.3em] font-heading">
                      DIRECT_LINE
                    </span>
                  </div>
                  <h3 className="text-xl font-heading text-ghost-white mb-4 uppercase tracking-wider">
                    Phone
                  </h3>
                  <p className="text-radar-grey-light">
                    <a href="tel:+441234567890" className="hover:text-infrared transition-colors">
                      +44 (0) 1234 567 890
                    </a>
                  </p>
                  <p className="text-radar-grey-light text-sm mt-2">
                    Mon-Fri: 9:00 AM - 6:00 PM GMT
                  </p>
                </div>

                <div className="bg-radar-grey border border-radar-grey-dark p-6">
                  <div className="mb-3">
                    <span className="text-[9px] text-infrared uppercase tracking-[0.3em] font-heading">
                      EMAIL_PROTOCOL
                    </span>
                  </div>
                  <h3 className="text-xl font-heading text-ghost-white mb-4 uppercase tracking-wider">
                    Email
                  </h3>
                  <p className="text-radar-grey-light break-all">
                    <a href="mailto:info@stealthshieldppf.com" className="hover:text-infrared transition-colors">
                      info@stealthshieldppf.com
                    </a>
                  </p>
                  <p className="text-radar-grey-light text-sm mt-2">
                    Response within 24 hours
                  </p>
                </div>

                <div className="bg-radar-grey border border-radar-grey-dark p-6">
                  <div className="mb-3">
                    <span className="text-[9px] text-infrared uppercase tracking-[0.3em] font-heading">
                      GEOGRAPHIC_ZONE
                    </span>
                  </div>
                  <h3 className="text-xl font-heading text-ghost-white mb-4 uppercase tracking-wider">
                    Location
                  </h3>
                  <p className="text-radar-grey-light leading-relaxed">
                    United Kingdom<br />
                    Nationwide Service
                  </p>
                </div>

                <div className="bg-radar-grey border-l-4 border-infrared p-6">
                  <p className="text-radar-grey-light text-sm leading-relaxed">
                    <span className="text-ghost-white font-semibold">Need urgent assistance?</span><br />
                    Call us directly for immediate support with active orders or installation queries.
                  </p>
                </div>
              </div>

              {/* Contact Form */}
              <div className="lg:col-span-2">
                <div className="bg-radar-grey border border-radar-grey-dark p-6 sm:p-8">
                  <div className="mb-6">
                    <span className="text-[9px] text-infrared uppercase tracking-[0.3em] font-heading">
                      TRANSMISSION_FORM
                    </span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-heading text-ghost-white mb-6 uppercase tracking-wider">
                    Send Us A Message
                  </h2>

                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Name */}
                    <div>
                      <label htmlFor="name" className="block text-sm font-heading text-ghost-white mb-2 uppercase tracking-wider">
                        Name *
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="w-full bg-stealth-black border border-radar-grey-dark text-ghost-white px-4 py-3 focus:border-infrared focus:outline-none transition-colors text-base"
                        placeholder="Your name"
                      />
                    </div>

                    {/* Email */}
                    <div>
                      <label htmlFor="email" className="block text-sm font-heading text-ghost-white mb-2 uppercase tracking-wider">
                        Email *
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="w-full bg-stealth-black border border-radar-grey-dark text-ghost-white px-4 py-3 focus:border-infrared focus:outline-none transition-colors text-base"
                        placeholder="your.email@example.com"
                      />
                    </div>

                    {/* Phone */}
                    <div>
                      <label htmlFor="phone" className="block text-sm font-heading text-ghost-white mb-2 uppercase tracking-wider">
                        Phone
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full bg-stealth-black border border-radar-grey-dark text-ghost-white px-4 py-3 focus:border-infrared focus:outline-none transition-colors text-base"
                        placeholder="+44 1234 567890"
                      />
                    </div>

                    {/* Subject */}
                    <div>
                      <label htmlFor="subject" className="block text-sm font-heading text-ghost-white mb-2 uppercase tracking-wider">
                        Subject *
                      </label>
                      <select
                        id="subject"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        required
                        className="w-full bg-stealth-black border border-radar-grey-dark text-ghost-white px-4 py-3 focus:border-infrared focus:outline-none transition-colors text-base"
                      >
                        <option value="">Select a subject</option>
                        <option value="general">General Inquiry</option>
                        <option value="order">Order Question</option>
                        <option value="installation">Installation Help</option>
                        <option value="technical">Technical Support</option>
                        <option value="partnership">Installer Partnership</option>
                        <option value="other">Other</option>
                      </select>
                    </div>

                    {/* Message */}
                    <div>
                      <label htmlFor="message" className="block text-sm font-heading text-ghost-white mb-2 uppercase tracking-wider">
                        Message *
                      </label>
                      <textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        required
                        rows={6}
                        className="w-full bg-stealth-black border border-radar-grey-dark text-ghost-white px-4 py-3 focus:border-infrared focus:outline-none transition-colors resize-none text-base"
                        placeholder="Tell us how we can help..."
                      />
                    </div>

                    {/* Submit Status */}
                    {submitStatus === 'success' && (
                      <div className="bg-infrared/10 border-l-4 border-infrared p-4">
                        <p className="text-infrared font-heading text-sm tracking-wider">
                          ✓ MESSAGE TRANSMITTED SUCCESSFULLY
                        </p>
                        <p className="text-radar-grey-light text-sm mt-1">
                          We&apos;ll respond within 24 hours.
                        </p>
                      </div>
                    )}

                    {submitStatus === 'error' && (
                      <div className="bg-infrared/10 border-l-4 border-infrared p-4">
                        <p className="text-infrared font-heading text-sm tracking-wider">
                          ⚠ TRANSMISSION FAILED
                        </p>
                        <p className="text-radar-grey-light text-sm mt-1">
                          Please try again or contact us directly.
                        </p>
                      </div>
                    )}

                    {/* Submit Button */}
                    <Button
                      type="submit"
                      size="lg"
                      className="w-full sm:w-auto"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? 'Sending...' : 'Send Message'}
                    </Button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Quick Links */}
        <section className="py-12 sm:py-20 border-t border-radar-grey-dark">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="max-w-4xl mx-auto">
              <div className="mb-8 text-center">
                <span className="text-[10px] text-infrared uppercase tracking-[0.3em] font-heading">
                  QUICK_ACCESS
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <a
                  href="/how-it-works"
                  className="bg-radar-grey border border-radar-grey-dark p-6 text-center hover:border-infrared/50 hover:scale-[1.02] transition-all duration-300"
                >
                  <div className="w-2 h-2 bg-infrared rotate-45 mx-auto mb-4"></div>
                  <h3 className="text-lg font-heading text-ghost-white mb-2 uppercase tracking-wider">
                    How It Works
                  </h3>
                  <p className="text-radar-grey-light text-sm">
                    Learn about our precision process
                  </p>
                </a>

                <a
                  href="/faq"
                  className="bg-radar-grey border border-radar-grey-dark p-6 text-center hover:border-infrared/50 hover:scale-[1.02] transition-all duration-300"
                >
                  <div className="w-2 h-2 bg-infrared rotate-45 mx-auto mb-4"></div>
                  <h3 className="text-lg font-heading text-ghost-white mb-2 uppercase tracking-wider">
                    FAQ
                  </h3>
                  <p className="text-radar-grey-light text-sm">
                    Find answers to common questions
                  </p>
                </a>

                <a
                  href="/pre-cut"
                  className="bg-radar-grey border border-radar-grey-dark p-6 text-center hover:border-infrared/50 hover:scale-[1.02] transition-all duration-300"
                >
                  <div className="w-2 h-2 bg-infrared rotate-45 mx-auto mb-4"></div>
                  <h3 className="text-lg font-heading text-ghost-white mb-2 uppercase tracking-wider">
                    Configure Kit
                  </h3>
                  <p className="text-radar-grey-light text-sm">
                    Start your order in 60 seconds
                  </p>
                </a>
              </div>
            </div>
          </div>
        </section>
      </div>
    </PageLayout>
  );
}

