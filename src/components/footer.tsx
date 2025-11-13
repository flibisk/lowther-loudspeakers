'use client';

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";

export function Footer() {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{
    type: 'success' | 'error' | null;
    message: string;
  }>({ type: null, message: '' });

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus({ type: null, message: '' });

    try {
      const response = await fetch('/api/newsletter', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (data.success) {
        setSubmitStatus({
          type: 'success',
          message: data.message || 'Successfully subscribed!',
        });
        setEmail('');
      } else {
        setSubmitStatus({
          type: 'error',
          message: data.message || 'Failed to subscribe. Please try again.',
        });
      }
    } catch (error) {
      console.error('Newsletter subscription error:', error);
      setSubmitStatus({
        type: 'error',
        message: 'An error occurred. Please try again.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <footer className="bg-black">
      <div className="w-full px-6 sm:px-6 lg:px-8 xl:px-12">
        {/* Top Navigation Bar - Hidden on mobile */}
        <div className="hidden md:block py-8 border-b" style={{ borderColor: '#ffffff1a' }}>
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            {/* Left - Logo and Navigation Links */}
            <div className="flex items-center space-x-6">
              <Link href="/" className="flex items-center">
                <Image
                  src="/images/Lowther-logo.svg"
                  alt="Lowther"
                  width={100}
                  height={25}
                  className="h-5 w-auto"
                />
              </Link>
              <div className="w-8 h-px bg-white"></div>
              <nav className="flex items-center space-x-8">
                <Link href="/category/loudspeakers" className="text-white hover:text-[#c59862] transition-colors font-medium">
                  Our Products
                </Link>
                <Link href="/build-a-lowther" className="text-white hover:text-[#c59862] transition-colors font-medium">
                  Build Your Own
                </Link>
                <Link href="/blog" className="text-white hover:text-[#c59862] transition-colors font-medium">
                  Blog
                </Link>
                <Link href="/contact" className="text-white hover:text-[#c59862] transition-colors font-medium">
                  Contact
                </Link>
              </nav>
            </div>

            {/* Right - Social Media */}
            <div className="flex items-center space-x-4">
              <span className="text-white text-sm">Be a part of our community</span>
              <div className="flex space-x-3">
                {/* Instagram */}
                <a href="https://www.instagram.com/lowtherloudspeakers" target="_blank" rel="noopener noreferrer" className="text-white hover:text-[#c59862] transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                </a>
                {/* Facebook */}
                <a href="https://www.facebook.com/lowtherloudspeakers" target="_blank" rel="noopener noreferrer" className="text-white hover:text-[#c59862] transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </a>
                {/* YouTube */}
                <a href="https://www.youtube.com/channel/UCUqlMnLunZJClcUQSqsz1LQ" target="_blank" rel="noopener noreferrer" className="text-white hover:text-[#c59862] transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                  </svg>
                </a>
                {/* X (Twitter) */}
                <a href="https://x.com/LowtherOfficial" target="_blank" rel="noopener noreferrer" className="text-white hover:text-[#c59862] transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Main Footer Content */}
        <div className="py-16">
        <div className="flex flex-col md:flex-row justify-between gap-12 mb-12">
          {/* Left Column - Our Brand */}
          <div className="space-y-6 md:max-w-[40%] text-left">
            <h3 className="font-bold text-white text-xl tracking-wider" style={{ fontFamily: 'var(--font-sarabun)' }}>
              OUR BRAND
            </h3>
            <p className="text-white leading-relaxed">
              For nearly 90 years, Lowther has been dedicated to the art of sound, developing a range of speaker cabinets and cultivating a passionate community of DIY enthusiasts. Our commitment to handmade excellence means that every speaker is crafted in Great Britain, using techniques honed over decades.
            </p>
            <div className="flex items-center space-x-4">
              <div className="w-8 h-px" style={{ backgroundColor: '#ffffff1a' }}></div>
              <Link href="/brand/handcrafted" className="text-white hover:text-[#c59862] transition-colors font-medium tracking-wider uppercase text-sm">
                read more
              </Link>
            </div>
          </div>

          {/* Right Column - Newsletter */}
          <div className="space-y-6 md:max-w-[40%] text-left md:text-right">
            <p className="text-white">
              Join the Lowther community by subscribing below.
            </p>
            <form onSubmit={handleNewsletterSubmit} className="space-y-3">
              <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
                <Input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                  disabled={isSubmitting}
                  className="flex-1 bg-neutral-800 border-neutral-700 text-white placeholder-neutral-400 h-12"
                />
                <Button 
                  type="submit"
                  variant="white" 
                  size="lowther" 
                  className="h-12 px-8 w-full sm:w-auto"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Subscribing...' : 'Subscribe'}
                </Button>
              </div>
              {submitStatus.type && (
                <p className={`text-sm ${
                  submitStatus.type === 'success' ? 'text-green-400' : 'text-red-400'
                }`}>
                  {submitStatus.message}
                </p>
              )}
            </form>
          </div>
        </div>

        {/* Bottom Copyright Section */}
        <div className="border-t pt-8" style={{ borderColor: '#ffffff1a' }}>
          <div className="flex flex-col md:flex-row justify-between items-center md:items-center gap-6">
            <p className="text-white text-sm text-center md:text-left">
              Lowther Loudspeaker Systems Ltd. All Rights Reserved
            </p>
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 text-center">
              <Link href="/privacy" className="text-white hover:text-[#c59862] transition-colors text-sm">
                Privacy Policy
              </Link>
              <Link href="/shipping" className="text-white hover:text-[#c59862] transition-colors text-sm">
                Shipping and Returns
              </Link>
              <Link href="/contact" className="text-white hover:text-[#c59862] transition-colors text-sm">
                Support
              </Link>
            </div>
          </div>
        </div>
        </div>
      </div>
    </footer>
  );
}
