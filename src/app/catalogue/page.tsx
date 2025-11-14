'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { ScrollReveal } from '@/components/scroll-reveal';
import { LowtherForLifeSection } from '@/components/lowther-for-life-section';
import { Breadcrumbs } from '@/components/breadcrumbs';

export default function CataloguePage() {
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
          {!isSubmitted ? (
            <ScrollReveal animation="fade-up">
              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Catalogue Type Selection */}
                <div>
                  <label className="block text-lg font-display mb-4 text-gray-900">
                    How would you like to receive the catalogue? *
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <button
                      type="button"
                      onClick={() => setCatalogueType('download')}
                      className={`p-6 border-2 rounded-sm transition-all ${
                        catalogueType === 'download'
                          ? 'border-[#c59862] bg-[#c59862]/5'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="text-center">
                        <svg className="w-12 h-12 mx-auto mb-3" style={{ color: catalogueType === 'download' ? '#c59862' : '#9ca3af' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <span className="font-display text-lg">Download Digital Copy</span>
                      </div>
                    </button>
                    <button
                      type="button"
                      onClick={() => setCatalogueType('printed')}
                      className={`p-6 border-2 rounded-sm transition-all ${
                        catalogueType === 'printed'
                          ? 'border-[#c59862] bg-[#c59862]/5'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="text-center">
                        <svg className="w-12 h-12 mx-auto mb-3" style={{ color: catalogueType === 'printed' ? '#c59862' : '#9ca3af' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 19v-8.93a2 2 0 01.89-1.664l7-4.666a2 2 0 012.22 0l7 4.666A2 2 0 0121 10.07V19M3 19a2 2 0 002 2h14a2 2 0 002-2M3 19l6.75-4.5M21 19l-6.75-4.5M3 10l6.75 4.5M21 10l-6.75 4.5m0 0l-1.14.76a2 2 0 01-2.22 0l-1.14-.76" />
                        </svg>
                        <span className="font-display text-lg">Order Printed Version</span>
                      </div>
                    </button>
                  </div>
                </div>

                {catalogueType && (
                  <>
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
                        className="w-full px-4 py-3 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-[#c59862] focus:border-transparent"
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
                        className="w-full px-4 py-3 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-[#c59862] focus:border-transparent"
                      />
                    </div>

                    {/* Phone Number */}
                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        required
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-[#c59862] focus:border-transparent"
                      />
                    </div>

                    {catalogueType === 'printed' && (
                      <>
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
                            className="w-full px-4 py-3 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-[#c59862] focus:border-transparent"
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
                            className="w-full px-4 py-3 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-[#c59862] focus:border-transparent"
                          />
                        </div>
                      </>
                    )}

                    {/* Are they a Lowther owner? */}
                    <div>
                      <label htmlFor="isLowtherOwner" className="block text-sm font-medium text-gray-700 mb-2">
                        Are you a Lowther owner? *
                      </label>
                      <select
                        id="isLowtherOwner"
                        name="isLowtherOwner"
                        required
                        value={formData.isLowtherOwner}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-[#c59862] focus:border-transparent"
                      >
                        <option value="">Please select</option>
                        <option value="yes">Yes</option>
                        <option value="no">No</option>
                      </select>
                    </div>

                    {/* Submit Button */}
                    <div className="pt-4">
                      <Button 
                        type="submit" 
                        size="lg" 
                        className="w-full bg-black hover:bg-[#c59862] text-white font-sarabun text-xs tracking-[3px] transition-all duration-300 uppercase"
                      >
                        {catalogueType === 'download' ? 'SUBMIT & DOWNLOAD' : 'SUBMIT ORDER'}
                      </Button>
                    </div>
                  </>
                )}
              </form>
            </ScrollReveal>
          ) : (
            <ScrollReveal animation="fade-up">
              <div className="text-center py-12">
                <div className="w-20 h-20 bg-[#c59862]/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-10 h-10" style={{ color: '#c59862' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                
                <h2 className="font-display text-3xl mb-4" style={{ color: '#c59862' }}>
                  {catalogueType === 'download' ? 'Thank You!' : 'Order Received'}
                </h2>
                
                {catalogueType === 'printed' ? (
                  <>
                    <p className="text-lg text-gray-700 mb-8 max-w-xl mx-auto">
                      Thank you for your order. We will post out your printed catalogue as soon as the next batch is in stock. In the meantime, here is a download link:
                    </p>
                    <a 
                      href="/images/catalogue/details/Lowther Catalogue A4 - Feb 2025 - Download.pdf" 
                      download
                      className="inline-block"
                    >
                      <Button 
                        size="lg" 
                        className="bg-black hover:bg-[#c59862] text-white font-sarabun text-xs tracking-[3px] transition-all duration-300 uppercase"
                      >
                        DOWNLOAD CATALOGUE PDF
                      </Button>
                    </a>
                  </>
                ) : (
                  <>
                    <p className="text-lg text-gray-700 mb-8 max-w-xl mx-auto">
                      Your download is ready. Click the button below to download the Lowther catalogue.
                    </p>
                    <a 
                      href="/images/catalogue/details/Lowther Catalogue A4 - Feb 2025 - Download.pdf" 
                      download
                      className="inline-block"
                    >
                      <Button 
                        size="lg" 
                        className="bg-black hover:bg-[#c59862] text-white font-sarabun text-xs tracking-[3px] transition-all duration-300 uppercase"
                      >
                        DOWNLOAD CATALOGUE PDF
                      </Button>
                    </a>
                  </>
                )}
              </div>
            </ScrollReveal>
          )}
        </div>
      </section>

      {/* Lowther for Life Video Section */}
      <LowtherForLifeSection backgroundColor="bg-[#fafaf8]" />
    </div>
  );
}
