'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { ScrollReveal } from '@/components/scroll-reveal';
import { LowtherForLifeSection } from '@/components/lowther-for-life-section';
import { Breadcrumbs } from '@/components/breadcrumbs';
import { Mail, Phone, Facebook, Instagram } from 'lucide-react';

// Note: Since this is a client component, metadata should be added in a parent layout or page.tsx wrapper
// For now, we'll document the metadata that should be added

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    location: '',
    message: '',
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
          ...formData,
          segment: 'Contact',
        }),
      });

      const data = await response.json();

      if (data.success) {
        setIsSubmitted(true);
      } else {
        setError(data.message || 'Failed to send message. Please try again.');
      }
    } catch (err) {
      console.error('Error submitting form:', err);
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

      {/* Hero Banner */}
      <section data-surface="dark" className="relative min-h-[100vh] overflow-hidden">
        <Image
          src="/images/contact/hero/Contact-us-lowther-hero.jpg"
          alt="Contact Lowther Loudspeakers"
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
            <span className="text-sm tracking-wider uppercase text-white/80">GET IN TOUCH</span>
          </div>
          
          <h1 className="font-display text-4xl md:text-6xl font-bold leading-tight mb-4" style={{ color: '#c59862' }}>
            How can we help?
          </h1>
        </div>

        {/* Scroll Indicator */}
        <div className="hidden 930:flex absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10 flex-col items-center text-white">
          <span className="text-xs tracking-wider uppercase mb-2">Scroll</span>
          <svg className="w-4 h-4 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </section>

      <Breadcrumbs 
        items={[
          { label: 'Home', href: '/' },
          { label: 'Contact' }
        ]} 
      />

      {/* Contact Section */}
      <section data-surface="light" className="py-24 bg-white">
        <div className="max-w-6xl mx-auto px-6 sm:px-8">
          <div className="grid lg:grid-cols-5 gap-12">
            {/* Left Column - Contact Details */}
            <div className="lg:col-span-2">
              <ScrollReveal animation="fade-up">
                <h2 className="font-display text-3xl mb-6" style={{ color: '#c59862' }}>
                  Our customer support team is here to help
                </h2>
                <p className="text-gray-700 leading-relaxed mb-12">
                  Fill out the form below and a representative from our support team will get back to you. Usually, we respond to the general enquiries within 24 hours.
                </p>

                {/* Contact Details */}
                <div className="space-y-6 mb-8">
                  {/* Social Links */}
                  <div className="flex items-center space-x-6 pb-6 border-b border-gray-200">
                    <a 
                      href="https://facebook.com/lowtherloudspeakers" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center text-gray-700 hover:text-[#c59862] transition-colors"
                    >
                      <Facebook className="w-5 h-5 mr-2" />
                      <span>/lowtherloudspeakers</span>
                    </a>
                  </div>

                  <div className="flex items-center space-x-6 pb-6 border-b border-gray-200">
                    <a 
                      href="https://instagram.com/lowtherloudspeakers" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center text-gray-700 hover:text-[#c59862] transition-colors"
                    >
                      <Instagram className="w-5 h-5 mr-2" />
                      <span>/lowtherloudspeakers</span>
                    </a>
                  </div>

                  {/* Email */}
                  <div className="flex items-center space-x-6 pb-6 border-b border-gray-200">
                    <a 
                      href="mailto:hello@lowtherloudspeakers.com"
                      className="flex items-center text-gray-700 hover:text-[#c59862] transition-colors"
                    >
                      <Mail className="w-5 h-5 mr-2" />
                      <span>hello@lowtherloudspeakers.com</span>
                    </a>
                  </div>

                  {/* Phone */}
                  <div className="flex items-center space-x-6">
                    <a 
                      href="tel:+442083009166"
                      className="flex items-center text-gray-700 hover:text-[#c59862] transition-colors"
                    >
                      <Phone className="w-5 h-5 mr-2" />
                      <span>+44 20 8300 9166</span>
                    </a>
                  </div>
                </div>
              </ScrollReveal>
            </div>

            {/* Right Column - Contact Form */}
            <div className="lg:col-span-3">
              {!isSubmitted ? (
                <ScrollReveal animation="fade-up" delay={0.1}>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Name */}
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                        Name *
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
                        Email *
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

                    {/* Location */}
                    <div>
                      <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
                        Location *
                      </label>
                      <input
                        type="text"
                        id="location"
                        name="location"
                        required
                        value={formData.location}
                        onChange={handleInputChange}
                        placeholder="City, Country"
                        className="w-full px-4 py-3 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-[#c59862] focus:border-transparent"
                      />
                    </div>

                    {/* Message */}
                    <div>
                      <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                        Message *
                      </label>
                      <textarea
                        id="message"
                        name="message"
                        required
                        rows={6}
                        value={formData.message}
                        onChange={handleInputChange}
                        placeholder="How can we help you?"
                        className="w-full px-4 py-3 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-[#c59862] focus:border-transparent"
                      />
                    </div>

                    {/* Error Message */}
                    {error && (
                      <div className="p-4 rounded-sm bg-red-50 border border-red-200">
                        <p className="text-sm text-red-800">{error}</p>
                      </div>
                    )}

                    {/* Submit Button */}
                    <div className="pt-4">
                      <Button 
                        type="submit" 
                        size="lg" 
                        disabled={isSubmitting}
                        className="w-full bg-black hover:bg-[#c59862] text-white font-sarabun text-xs tracking-[3px] transition-all duration-300 uppercase disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isSubmitting ? 'Sending...' : 'Send Message'}
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
                      Message Sent
                    </h3>
                    
                    <p className="text-lg text-gray-700 max-w-xl mx-auto mb-8">
                      Thank you for contacting us. A member of our team will be in touch within 24 hours.
                    </p>

                    <Button 
                      onClick={() => {
                        setIsSubmitted(false);
                        setFormData({ name: '', email: '', phone: '', location: '', message: '' });
                      }}
                      variant="outline"
                      className="border-[#c59862] text-[#c59862] hover:bg-[#c59862] hover:text-white"
                    >
                      Send Another Message
                    </Button>
                  </div>
                </ScrollReveal>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Lowther for Life Video Section */}
      <LowtherForLifeSection backgroundColor="bg-[#fafaf8]" />
    </div>
  );
}

