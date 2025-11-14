'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ScrollReveal } from '@/components/scroll-reveal';
import { LowtherForLifeSection } from '@/components/lowther-for-life-section';
import { Breadcrumbs } from '@/components/breadcrumbs';

export default function OEMOpportunitiesPage() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    country: '',
    companyName: '',
    companyWebsite: '',
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      const handleLoadedData = () => {
        setIsVideoLoaded(true);
      };
      
      if (video.readyState >= 2) {
        setIsVideoLoaded(true);
      }
      
      video.addEventListener('loadeddata', handleLoadedData);
      video.addEventListener('canplay', handleLoadedData);
      
      video.play().catch(err => console.log('Video autoplay failed:', err));
      
      return () => {
        video.removeEventListener('loadeddata', handleLoadedData);
        video.removeEventListener('canplay', handleLoadedData);
      };
    }
  }, []);

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
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          location: `${formData.address}, ${formData.country}`,
          message: `OEM Opportunity Application\n\nCompany Name: ${formData.companyName}\nCompany Website: ${formData.companyWebsite}\nAddress: ${formData.address}\nCountry: ${formData.country}`,
          segment: 'OEM',
        }),
      });

      const data = await response.json();

      if (data.success) {
        setIsSubmitted(true);
      } else {
        setError(data.message || 'Failed to submit application. Please try again.');
      }
    } catch (err) {
      console.error('Error submitting OEM form:', err);
      setError('An error occurred. Please try again or contact us directly.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

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
          <source src="/images/oem-opportunities/hero/OEM-Lowther-Opportunities.mp4" type="video/mp4" />
          <source src="/images/oem-opportunities/hero/OEM-Lowther-Opportunities.webm" type="video/webm" />
          Your browser does not support the video tag.
        </video>
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent z-20"></div>
        
        <div className="absolute bottom-20 930:bottom-20 left-6 930:left-16 z-30 text-white max-w-xs sm:max-w-md 930:max-w-3xl">
          <div className="flex items-center mb-2">
            <div className="w-8 h-px bg-white mr-3"></div>
            <span className="text-sm tracking-wider uppercase text-white/80">OEM SOLUTIONS</span>
          </div>
          
          <h1 className="font-display text-4xl md:text-6xl font-bold leading-tight mb-4" style={{ color: '#c59862' }}>
            OEM Drive Units for Speaker Designers
          </h1>
          
          <p className="text-xl leading-relaxed">
            Discover Lowther's OEM drive units for speaker designers. Premium and Classic options, 10-year warranty, and trusted audio quality for over 90 years.
          </p>
        </div>

        {/* Scroll Indicator */}
        <div className="hidden 930:flex absolute bottom-8 left-1/2 transform -translate-x-1/2 z-30 flex-col items-center text-white">
          <span className="text-xs tracking-wider uppercase mb-2">Scroll</span>
          <svg className="w-4 h-4 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </section>

      <Breadcrumbs 
        items={[
          { label: 'Home', href: '/' },
          { label: 'Services', href: '/services/oem-opportunities' },
          { label: 'OEM Opportunities' }
        ]} 
      />

      {/* Partner with Lowther Section */}
      <section data-surface="light" className="py-24 bg-white">
        <div className="max-w-4xl mx-auto px-6 sm:px-8">
          <ScrollReveal animation="fade-up">
            <div className="prose prose-lg prose-gray max-w-none">
              <h2 className="font-display text-4xl md:text-5xl mb-8 text-center" style={{ color: '#c59862' }}>
                Partner with Lowther
              </h2>
              
              <p className="text-xl leading-relaxed text-gray-800 mb-8">
                Lowther offers OEM solutions for speaker designers, providing our renowned drive units at a discount. Choose from our Classic range, featuring unbranded drive units for discreet integration, or our Premium range, which proudly displays the Lowther brand, inspiring trust built over 90 years of excellence.
              </p>
              
              <p className="text-xl leading-relaxed text-gray-800 mb-8">
                All OEM drive units come with a 10-year warranty, provided they are unaltered before delivery to the end customer.
              </p>
              
              <p className="text-xl leading-relaxed text-gray-800 mb-16">
                To explore this opportunity and elevate your speaker designs, complete the application form below.
              </p>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Video Section */}
      <section data-surface="light" className="py-16 bg-[#fafaf8]">
        <div className="max-w-5xl mx-auto px-6 sm:px-8">
          <ScrollReveal animation="fade-up">
            <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
              <iframe
                className="absolute inset-0 w-full h-full rounded-sm shadow-lg"
                src="https://www.youtube.com/embed/Uo7T3y4O_YU"
                title="Lowther OEM Opportunities"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Application Form Section */}
      <section data-surface="light" className="py-24 bg-white">
        <div className="max-w-3xl mx-auto px-6 sm:px-8">
          <ScrollReveal animation="fade-up">
            <h2 className="font-display text-3xl md:text-4xl mb-4 text-center" style={{ color: '#c59862' }}>
              OEM Application Form
            </h2>
            <p className="text-center text-gray-700 mb-12">
              Complete the form below and our team will be in touch to discuss your requirements.
            </p>
          </ScrollReveal>

          {!isSubmitted ? (
            <ScrollReveal animation="fade-up" delay={0.1}>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Name */}
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    value={formData.name}
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

                {/* Address */}
                <div>
                  <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-2">
                    Address *
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

                {/* Company Name */}
                <div>
                  <label htmlFor="companyName" className="block text-sm font-medium text-gray-700 mb-2">
                    Company Name *
                  </label>
                  <input
                    type="text"
                    id="companyName"
                    name="companyName"
                    required
                    value={formData.companyName}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-[#c59862] focus:border-transparent"
                  />
                </div>

                {/* Company Website */}
                <div>
                  <label htmlFor="companyWebsite" className="block text-sm font-medium text-gray-700 mb-2">
                    Company Website *
                  </label>
                  <input
                    type="url"
                    id="companyWebsite"
                    name="companyWebsite"
                    required
                    value={formData.companyWebsite}
                    onChange={handleInputChange}
                    placeholder="https://www.example.com"
                    className="w-full px-4 py-3 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-[#c59862] focus:border-transparent"
                  />
                </div>

                {/* Submit Button */}
                <div className="pt-4">
                  <Button 
                    type="submit" 
                    size="lg" 
                    className="w-full bg-black hover:bg-[#c59862] text-white font-sarabun text-xs tracking-[3px] transition-all duration-300 uppercase"
                  >
                    Submit Application
                  </Button>
                </div>
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
                
                <h3 className="font-display text-3xl mb-4" style={{ color: '#c59862' }}>
                  Application Received
                </h3>
                
                <p className="text-lg text-gray-700 max-w-xl mx-auto">
                  Thank you for your interest in partnering with Lowther. Our team will review your application and be in touch shortly to discuss how we can support your speaker designs.
                </p>
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

