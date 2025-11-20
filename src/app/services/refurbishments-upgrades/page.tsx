'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { LowtherForLifeSection } from '@/components/lowther-for-life-section';
import { Breadcrumbs } from '@/components/breadcrumbs';
import { UpgradeSelector } from '@/components/upgrade-selector';

export default function RefurbishmentsUpgradesPage() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);

  const [upgradeFormData, setUpgradeFormData] = useState({
    name: '',
    address: '',
    email: '',
    phone: '',
    driveUnitType: '',
    serialNumber: '',
    yearPurchased: '',
  });

  const [refurbishmentFormData, setRefurbishmentFormData] = useState({
    name: '',
    address: '',
    email: '',
    phone: '',
    driveUnitType: '',
    serialNumber: '',
    yearPurchased: '',
  });

  const [upgradeSubmitted, setUpgradeSubmitted] = useState(false);
  const [refurbishmentSubmitted, setRefurbishmentSubmitted] = useState(false);
  const [upgradeSubmitting, setUpgradeSubmitting] = useState(false);
  const [refurbishmentSubmitting, setRefurbishmentSubmitting] = useState(false);
  const [upgradeError, setUpgradeError] = useState('');
  const [refurbishmentError, setRefurbishmentError] = useState('');

  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      const handleLoadedData = () => {
        setIsVideoLoaded(true);
      };
      
      // If video is already loaded
      if (video.readyState >= 2) {
        setIsVideoLoaded(true);
      }
      
      video.addEventListener('loadeddata', handleLoadedData);
      video.addEventListener('canplay', handleLoadedData);
      
      // Force play attempt
      video.play().catch(err => console.log('Video autoplay failed:', err));
      
      return () => {
        video.removeEventListener('loadeddata', handleLoadedData);
        video.removeEventListener('canplay', handleLoadedData);
      };
    }
  }, []);

  const handleUpgradeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUpgradeSubmitting(true);
    setUpgradeError('');

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: upgradeFormData.name,
          email: upgradeFormData.email,
          phone: upgradeFormData.phone,
          location: upgradeFormData.address,
          message: `Upgrade Request\n\nDrive Unit Type: ${upgradeFormData.driveUnitType}\nSerial Number: ${upgradeFormData.serialNumber || 'Not provided'}\nYear Purchased: ${upgradeFormData.yearPurchased}`,
          segment: 'Upgrade Request',
        }),
      });

      const data = await response.json();

      if (data.success) {
        setUpgradeSubmitted(true);
      } else {
        setUpgradeError(data.message || 'Failed to send request. Please try again.');
      }
    } catch (err) {
      console.error('Error submitting upgrade form:', err);
      setUpgradeError('An error occurred. Please try again or contact us directly.');
    } finally {
      setUpgradeSubmitting(false);
    }
  };

  const handleRefurbishmentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setRefurbishmentSubmitting(true);
    setRefurbishmentError('');

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: refurbishmentFormData.name,
          email: refurbishmentFormData.email,
          phone: refurbishmentFormData.phone,
          location: refurbishmentFormData.address,
          message: `Refurbishment Request\n\nDrive Unit Type: ${refurbishmentFormData.driveUnitType}\nSerial Number: ${refurbishmentFormData.serialNumber || 'Not provided'}\nYear Purchased: ${refurbishmentFormData.yearPurchased}`,
          segment: 'Refurbishment Request',
        }),
      });

      const data = await response.json();

      if (data.success) {
        setRefurbishmentSubmitted(true);
      } else {
        setRefurbishmentError(data.message || 'Failed to send request. Please try again.');
      }
    } catch (err) {
      console.error('Error submitting refurbishment form:', err);
      setRefurbishmentError('An error occurred. Please try again or contact us directly.');
    } finally {
      setRefurbishmentSubmitting(false);
    }
  };

  const upgradePoints = [
    {
      image: '/images/refurbishments-upgrades/gallery/box-1-recieve-your-new-units.jpg',
      alt: 'Receive your new Lowther drive units',
    },
    {
      image: '/images/refurbishments-upgrades/gallery/box-2-Enjoy-your-drive-units.jpg',
      alt: 'Enjoy your new Lowther drive units',
    },
    {
      image: '/images/refurbishments-upgrades/gallery/box-3-send-us-your-old-units.jpg',
      alt: 'Send us your old drive units',
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Sentinel for Nav */}
      <div id="hero-sentinel" className="absolute top-0 left-0 w-full h-16" />

      {/* Video Hero Banner */}
      <section data-surface="dark" className="relative min-h-[100vh] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-neutral-900 to-neutral-800" />
        
        <video
          ref={videoRef}
          className="absolute inset-0 h-full w-full object-cover z-10"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
        >
          <source src="/images/refurbishments-upgrades/hero/Lowther-returns.mov" type="video/mp4" />
          <source src="/images/refurbishments-upgrades/hero/Lowther-returns.webm" type="video/webm" />
          Your browser does not support the video tag.
        </video>
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent z-20"></div>
        
        <div className="absolute bottom-20 930:bottom-20 left-6 930:left-16 z-30 text-white max-w-xs sm:max-w-md 930:max-w-2xl">
          <div className="flex items-center mb-2">
            <div className="w-8 h-px bg-white mr-3"></div>
            <span className="text-sm tracking-wider uppercase text-white/80">SERVICES</span>
          </div>
          
          <h1 className="font-display text-4xl md:text-6xl font-bold leading-tight mb-4" style={{ color: '#c59862' }}>
            A Second Life for a Legend
          </h1>
          
          <p className="hidden 930:block text-xl leading-relaxed">
            Upgrade or restore your Lowther to its original glory, preserving heritage while embracing the latest advances in acoustic refinement.
          </p>
        </div>

        {/* Scroll Indicator */}
        <div className="hidden 930:flex absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20 flex-col items-center text-white">
          <span className="text-xs tracking-wider uppercase mb-2">Scroll</span>
          <svg className="w-4 h-4 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </section>

      <Breadcrumbs 
        items={[
          { label: 'Home', href: '/' },
          { label: 'Services', href: '/services/refurbishments-upgrades' },
          { label: 'Refurbishments & Upgrades' }
        ]} 
      />

      {/* Upgrading Your Lowther Section */}
      <section className="py-24 px-6 930:px-16">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-display text-4xl md:text-5xl mb-8 leading-tight text-center" style={{ color: '#c59862' }}>
            Upgrading Your Lowther
          </h2>
          <div className="space-y-6 text-lg md:text-xl font-light leading-relaxed text-gray-800 text-center">
            <p>
              For nearly a century, we've built instruments designed to last a lifetime and beyond. When it's time to step into the next chapter of the Lowther journey, our upgrade programme makes it beautifully simple.
            </p>
            <p>
              Upgrades are heavily discounted and include a full 10-year warranty on all Sinfonia, Philharmonic, and Grand Opera Collection upgrades.
            </p>
            <p>
              We send your new drive units directly to you, carefully packed for protection. Once you've installed and experienced them, simply return your old units to us in the same box, effortless, elegant, and environmentally conscious.
            </p>
          </div>
        </div>
      </section>

      {/* How to Upgrade Section */}
      <section className="py-16 px-6 930:px-16">
        <div className="max-w-6xl mx-auto">
          <h3 className="font-display text-3xl md:text-4xl mb-12 text-center" style={{ color: '#c59862' }}>
            How to Upgrade
          </h3>
          <div className="grid md:grid-cols-3 gap-12">
            <div className="text-center">
              <div className="relative w-full max-w-[300px] mx-auto mb-6">
                <Image
                  src={upgradePoints[0].image}
                  alt={upgradePoints[0].alt}
                  width={300}
                  height={300}
                  className="object-contain w-full h-auto rounded-sm"
                />
              </div>
              <h4 className="font-display text-xl mb-3">Place your order</h4>
              <p className="text-gray-700 font-light leading-relaxed">
                Your exclusive upgrade discount is applied automatically. We send your new drive units directly to your door.
              </p>
            </div>
            <div className="text-center">
              <div className="relative w-full max-w-[300px] mx-auto mb-6">
                <Image
                  src={upgradePoints[1].image}
                  alt={upgradePoints[1].alt}
                  width={300}
                  height={300}
                  className="object-contain w-full h-auto rounded-sm"
                />
              </div>
              <h4 className="font-display text-xl mb-3">Test them. Fall in love.</h4>
              <p className="text-gray-700 font-light leading-relaxed">
                Experience the difference of our latest generation: greater clarity, deeper tone, unmistakably Lowther.
              </p>
            </div>
            <div className="text-center">
              <div className="relative w-full max-w-[300px] mx-auto mb-6">
                <Image
                  src={upgradePoints[2].image}
                  alt={upgradePoints[2].alt}
                  width={300}
                  height={300}
                  className="object-contain w-full h-auto rounded-sm"
                />
              </div>
              <h4 className="font-display text-xl mb-3">Send your old drive units</h4>
              <p className="text-gray-700 font-light leading-relaxed">
                Use the same packaging and prepaid return label to send your old units back to our Norfolk workshop.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Upgrade Selector Section */}
      <section className="py-24 px-6 930:px-16">
        <div className="max-w-6xl mx-auto">
          <h3 className="font-display text-3xl md:text-4xl mb-8 text-center" style={{ color: '#c59862' }}>
            Upgrade Your Drive Unit
          </h3>
          <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
            Select your current drive unit and choose the upgrade option. Your exclusive upgrade discount is applied automatically. Quantity means per drive unit.
          </p>
          <UpgradeSelector />
        </div>
      </section>

      {/* Refurbishment Section */}
      <section className="py-24 px-6 930:px-16 bg-[#fafaf8]">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-display text-4xl md:text-5xl mb-8 leading-tight text-center" style={{ color: '#c59862' }}>
            Refurbishment
          </h2>
          <div className="space-y-6 text-lg md:text-xl font-light leading-relaxed text-gray-800 mb-12 text-center">
            <p>
              Sometimes a lifelong companion deserves a little care. Our refurbishment service ensures your Lowther continues to perform as beautifully as the day it was made, extending its life for another generation of listening.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <div className="border border-gray-200 p-8 rounded-sm">
              <h3 className="font-display text-2xl mb-4" style={{ color: '#c59862' }}>
                Full Refurbishment
              </h3>
              <p className="text-gray-700 font-light leading-relaxed">
                Includes new diaphragm, voice coil, recentring, and full magnet recharge, restoring performance to factory specification and renewing magnetic strength for decades to come.
              </p>
            </div>

            <div className="border border-gray-200 p-8 rounded-sm">
              <h3 className="font-display text-2xl mb-4" style={{ color: '#c59862' }}>
                Partial Refurbishment
              </h3>
              <p className="text-gray-700 font-light leading-relaxed">
                Includes new diaphragm, voice coil, and recentring, ideal when your magnet remains in good condition.
              </p>
            </div>
          </div>

          <p className="text-center text-gray-700 font-light italic">
            Every refurbished Lowther is returned with full test certification from our Norfolk atelier.
          </p>
        </div>
      </section>

      {/* Refurbishment Form Section */}
      <section className="py-24 px-6 930:px-16 bg-[#fafaf8]">
        <div className="max-w-2xl mx-auto">
          <h3 className="font-display text-3xl md:text-4xl mb-8 text-center" style={{ color: '#c59862' }}>
            Refurbishment Form
          </h3>
          {refurbishmentSubmitted ? (
            <div className="text-center py-12">
              <h4 className="font-display text-2xl mb-4" style={{ color: '#c59862' }}>Thank You</h4>
              <p className="text-lg text-gray-700 font-light">
                We've received your refurbishment request and will be in touch shortly.
              </p>
            </div>
          ) : (
            <form onSubmit={handleRefurbishmentSubmit} className="space-y-6">
              <div>
                <label htmlFor="refurb-name" className="block text-sm font-medium text-gray-700 mb-2">
                  Name *
                </label>
                <input
                  type="text"
                  id="refurb-name"
                  required
                  value={refurbishmentFormData.name}
                  onChange={(e) => setRefurbishmentFormData({ ...refurbishmentFormData, name: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-[#c59862] focus:border-transparent"
                />
              </div>

              <div>
                <label htmlFor="refurb-address" className="block text-sm font-medium text-gray-700 mb-2">
                  Address *
                </label>
                <textarea
                  id="refurb-address"
                  required
                  rows={3}
                  value={refurbishmentFormData.address}
                  onChange={(e) => setRefurbishmentFormData({ ...refurbishmentFormData, address: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-[#c59862] focus:border-transparent"
                />
              </div>

              <div>
                <label htmlFor="refurb-email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  id="refurb-email"
                  required
                  value={refurbishmentFormData.email}
                  onChange={(e) => setRefurbishmentFormData({ ...refurbishmentFormData, email: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-[#c59862] focus:border-transparent"
                />
              </div>

              <div>
                <label htmlFor="refurb-phone" className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  id="refurb-phone"
                  required
                  value={refurbishmentFormData.phone}
                  onChange={(e) => setRefurbishmentFormData({ ...refurbishmentFormData, phone: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-[#c59862] focus:border-transparent"
                />
              </div>

              <div>
                <label htmlFor="refurb-drive-unit" className="block text-sm font-medium text-gray-700 mb-2">
                  Drive Unit Type *
                </label>
                <input
                  type="text"
                  id="refurb-drive-unit"
                  required
                  value={refurbishmentFormData.driveUnitType}
                  onChange={(e) => setRefurbishmentFormData({ ...refurbishmentFormData, driveUnitType: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-[#c59862] focus:border-transparent"
                  placeholder="e.g. PM6A, DX3, EX3"
                />
              </div>

              <div>
                <label htmlFor="refurb-serial" className="block text-sm font-medium text-gray-700 mb-2">
                  Serial Number (Optional)
                </label>
                <input
                  type="text"
                  id="refurb-serial"
                  value={refurbishmentFormData.serialNumber}
                  onChange={(e) => setRefurbishmentFormData({ ...refurbishmentFormData, serialNumber: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-[#c59862] focus:border-transparent"
                />
              </div>

              <div>
                <label htmlFor="refurb-year" className="block text-sm font-medium text-gray-700 mb-2">
                  Year Purchased *
                </label>
                <input
                  type="text"
                  id="refurb-year"
                  required
                  value={refurbishmentFormData.yearPurchased}
                  onChange={(e) => setRefurbishmentFormData({ ...refurbishmentFormData, yearPurchased: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-[#c59862] focus:border-transparent"
                  placeholder="e.g. 2018"
                />
              </div>

              {/* Error Message */}
              {refurbishmentError && (
                <div className="p-4 rounded-sm bg-red-50 border border-red-200">
                  <p className="text-sm text-red-800">{refurbishmentError}</p>
                </div>
              )}

              <div className="pt-4">
                <Button 
                  type="submit" 
                  variant="black" 
                  size="lowther" 
                  className="w-full disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={refurbishmentSubmitting}
                >
                  {refurbishmentSubmitting ? 'Submitting...' : 'Submit Refurbishment Request'}
                </Button>
              </div>
            </form>
          )}
        </div>
      </section>

      <LowtherForLifeSection backgroundColor="bg-white" />
    </div>
  );
}

