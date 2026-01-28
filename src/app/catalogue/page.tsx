'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { ScrollReveal } from '@/components/scroll-reveal';
import { LowtherForLifeSection } from '@/components/lowther-for-life-section';
import { Breadcrumbs } from '@/components/breadcrumbs';
import { useAuth } from '@/contexts/auth-context';
import { AuthModal } from '@/components/auth/auth-modal';
import { trackBrochureDownload } from '@/lib/analytics';
import { Download, Lock, LogIn, User, Truck } from 'lucide-react';

export default function CataloguePage() {
  const { user, loading: authLoading } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [catalogueType, setCatalogueType] = useState<'download' | 'printed' | null>(null);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    country: '',
    isLowtherOwner: '',
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleAuthSuccess = () => {
    setShowAuthModal(false);
  };

  const handleDownloadCatalogue = () => {
    if (!user) return;
    
    // Track the download
    trackBrochureDownload('lowther-catalogue', 'Lowther Product Catalogue');
    
    // Trigger the download
    const link = document.createElement('a');
    link.href = '/images/catalogue/details/Lowther Catalogue A4 - Feb 2025 - Download.pdf';
    link.download = 'Lowther-Catalogue.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      const response = await fetch('/api/form', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.fullName,
          email: formData.email,
          phone: formData.phone,
          location: `${formData.address}, ${formData.country}`,
          message: `Catalogue Request (${catalogueType === 'download' ? 'Download' : 'Printed'})\n\nLowther Owner: ${formData.isLowtherOwner}\nAddress: ${formData.address}\nCountry: ${formData.country}`,
          segment: 'Catalogue Request',
        }),
      });

      const data = await response.json();

      if (data.success) {
        setIsSubmitted(true);
      } else {
        setError(data.message || 'Failed to submit request. Please try again.');
      }
    } catch (err) {
      console.error('Error submitting catalogue form:', err);
      setError('An error occurred. Please try again or contact us directly.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Sentinel for Nav */}
      <div id="hero-sentinel" className="absolute top-0 left-0 w-full h-16" />

      {/* Hero Banner */}
      <section data-surface="dark" className="relative min-h-[100vh] overflow-hidden">
        <Image
          src="/images/catalogue/hero/Order-a-lowther-catalogue-hero.avif"
          alt="Lowther Product Catalogue"
          fill
          className="absolute inset-0 h-full w-full object-cover"
          priority
          quality={100}
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>
        
        <div className="absolute bottom-20 930:bottom-20 left-6 930:left-16 z-10 text-white max-w-xs sm:max-w-md 930:max-w-3xl">
          <div className="flex items-center mb-2">
            <div className="w-8 h-px bg-white mr-3"></div>
            <span className="text-sm tracking-wider uppercase text-white/80">CATALOGUE</span>
          </div>
          
          <h1 className="font-display text-4xl md:text-6xl font-bold leading-tight mb-4" style={{ color: '#c59862' }}>
            Lowther Product Catalogue
          </h1>
          
          <p className="hidden 930:block text-xl leading-relaxed">
            Download our catalogue or fill out the form to receive the printed version of the full collection of Lowther's products.
          </p>
        </div>

        {/* Scroll Indicator */}
        <div className="hidden 930:flex absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10 flex-col items-center text-white">
          <span className="text-xs tracking-wider uppercase mb-2">Scroll</span>
          <svg className="w-4 h-4 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </section>

      {/* Breadcrumbs */}
      <Breadcrumbs 
        items={[
          { label: 'Home', href: '/' },
          { label: 'Catalogue' }
        ]}
      />

      {/* Form Section */}
      <section data-surface="light" className="py-24 bg-white">
        <div className="max-w-3xl mx-auto px-6 sm:px-8">
          <ScrollReveal animation="fade-up">
            <div className="space-y-8">
              {/* Catalogue Type Selection */}
              <div>
                <label className="block text-lg font-display mb-4 text-gray-900">
                  How would you like to receive the catalogue?
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => setCatalogueType('download')}
                    className={`p-6 border-2 rounded-lg transition-all ${
                      catalogueType === 'download'
                        ? 'border-[#c59862] bg-[#c59862]/5'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="text-center">
                      <Download className={`w-12 h-12 mx-auto mb-3 ${catalogueType === 'download' ? 'text-[#c59862]' : 'text-gray-400'}`} />
                      <span className="font-display text-lg">Download Digital Copy</span>
                      <p className="text-sm text-gray-500 mt-1">Instant access</p>
                    </div>
                  </button>
                  <button
                    type="button"
                    onClick={() => setCatalogueType('printed')}
                    className={`p-6 border-2 rounded-lg transition-all ${
                      catalogueType === 'printed'
                        ? 'border-[#c59862] bg-[#c59862]/5'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="text-center">
                      <Truck className={`w-12 h-12 mx-auto mb-3 ${catalogueType === 'printed' ? 'text-[#c59862]' : 'text-gray-400'}`} />
                      <span className="font-display text-lg">Order Printed Version</span>
                      <p className="text-sm text-gray-500 mt-1">Free delivery worldwide</p>
                    </div>
                  </button>
                </div>
              </div>

              {/* Digital Download Option */}
              {catalogueType === 'download' && (
                <div className="mt-8">
                  {!user && !authLoading ? (
                    /* Login Required */
                    <div className="p-8 bg-neutral-900 rounded-lg text-white">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="h-12 w-12 rounded-full bg-[#c59862] flex items-center justify-center">
                          <Lock className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <h3 className="font-display text-2xl" style={{ color: '#c59862' }}>
                            Login to Download
                          </h3>
                          <p className="text-gray-400 text-sm">Free access for all members</p>
                        </div>
                      </div>
                      
                      <p className="text-gray-300 mb-6 leading-relaxed">
                        Create a free account or sign in to download our complete product catalogue featuring all Lowther loudspeakers, drive units, and accessories.
                      </p>
                      
                      <Button
                        variant="white"
                        size="lowther"
                        className="w-full"
                        onClick={() => setShowAuthModal(true)}
                      >
                        <LogIn className="h-5 w-5 mr-2" />
                        SIGN IN / CREATE ACCOUNT
                      </Button>
                    </div>
                  ) : user ? (
                    /* Logged In - Show Download */
                    <div className="space-y-6">
                      <div className="p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0">
                          <User className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <p className="text-green-800 font-medium">
                            Welcome{user.displayName ? `, ${user.displayName}` : ''}!
                          </p>
                          <p className="text-green-700 text-sm">
                            Your catalogue is ready to download
                          </p>
                        </div>
                      </div>

                      <div className="p-6 bg-[#c59862] rounded-lg">
                        <h3 className="font-display text-xl mb-3 text-white">
                          Download Lowther Catalogue
                        </h3>
                        <p className="text-white/80 mb-4 text-sm">
                          The complete collection featuring all our loudspeakers, drive units, and accessories.
                        </p>
                        <Button
                          variant="white"
                          size="lowther"
                          className="w-full"
                          onClick={handleDownloadCatalogue}
                        >
                          <Download className="h-5 w-5 mr-2" />
                          DOWNLOAD CATALOGUE PDF
                        </Button>
                      </div>
                    </div>
                  ) : (
                    /* Loading */
                    <div className="p-8 bg-gray-100 rounded-lg text-center">
                      <div className="animate-pulse">
                        <div className="h-8 bg-gray-200 rounded w-48 mx-auto mb-4"></div>
                        <div className="h-4 bg-gray-200 rounded w-64 mx-auto"></div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Printed Version Form */}
              {catalogueType === 'printed' && !isSubmitted && (
                <form onSubmit={handleSubmit} className="space-y-6 mt-8">
                  <p className="text-gray-600 mb-4">
                    Fill in your details below and we'll post you a beautifully printed catalogue.
                  </p>

                  {/* Full Name */}
                  <div>
                    <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      id="fullName"
                      name="fullName"
                      required
                      value={formData.fullName}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#c59862] focus:border-transparent"
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#c59862] focus:border-transparent"
                    />
                  </div>

                  {/* Phone Number */}
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#c59862] focus:border-transparent"
                    />
                  </div>

                  {/* Address */}
                  <div>
                    <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-2">
                      Full Address *
                    </label>
                    <textarea
                      id="address"
                      name="address"
                      required
                      rows={3}
                      value={formData.address}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#c59862] focus:border-transparent"
                      placeholder="Street address, city, postal code"
                    />
                  </div>

                  {/* Country */}
                  <div>
                    <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-2">
                      Country *
                    </label>
                    <input
                      type="text"
                      id="country"
                      name="country"
                      required
                      value={formData.country}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#c59862] focus:border-transparent"
                    />
                  </div>

                  {/* Are they a Lowther owner? */}
                  <div>
                    <label htmlFor="isLowtherOwner" className="block text-sm font-medium text-gray-700 mb-2">
                      Are you a Lowther owner?
                    </label>
                    <select
                      id="isLowtherOwner"
                      name="isLowtherOwner"
                      value={formData.isLowtherOwner}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#c59862] focus:border-transparent"
                    >
                      <option value="">Please select</option>
                      <option value="yes">Yes</option>
                      <option value="no">No</option>
                    </select>
                  </div>

                  {error && (
                    <p className="text-red-600 text-sm">{error}</p>
                  )}

                  {/* Submit Button */}
                  <div className="pt-4">
                    <Button 
                      type="submit" 
                      variant="black"
                      size="lowther"
                      className="w-full"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? 'SUBMITTING...' : 'ORDER PRINTED CATALOGUE'}
                    </Button>
                  </div>
                </form>
              )}

              {/* Success Message for Printed */}
              {catalogueType === 'printed' && isSubmitted && (
                <div className="text-center py-12 mt-8">
                  <div className="w-20 h-20 bg-[#c59862]/10 rounded-full flex items-center justify-center mx-auto mb-6">
                    <svg className="w-10 h-10" style={{ color: '#c59862' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  
                  <h2 className="font-display text-3xl mb-4" style={{ color: '#c59862' }}>
                    Order Received
                  </h2>
                  
                  <p className="text-lg text-gray-700 mb-8 max-w-xl mx-auto">
                    Thank you for your order. We will post out your printed catalogue as soon as the next batch is in stock. In the meantime, you can also download the digital version:
                  </p>
                  
                  {user ? (
                    <Button 
                      variant="black"
                      size="lowther"
                      onClick={handleDownloadCatalogue}
                    >
                      <Download className="h-5 w-5 mr-2" />
                      DOWNLOAD CATALOGUE PDF
                    </Button>
                  ) : (
                    <Button 
                      variant="black"
                      size="lowther"
                      onClick={() => {
                        setCatalogueType('download');
                        setIsSubmitted(false);
                      }}
                    >
                      SIGN IN TO DOWNLOAD
                    </Button>
                  )}
                </div>
              )}
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Auth Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onSuccess={handleAuthSuccess}
        mode="signup"
      />

      {/* Lowther for Life Video Section */}
      <LowtherForLifeSection backgroundColor="bg-[#fafaf8]" />
    </div>
  );
}
