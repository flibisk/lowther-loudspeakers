'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';

interface CommissionFormProps {
  isOpen: boolean;
  onClose: () => void;
  speakerName: string;
}

// Lead time mapping for masterpieces
const LEAD_TIMES: Record<string, string> = {
  'Quarter Wave': '4-6 weeks',
  'Acousta Quarter Wave': '4-6 weeks',
  'Acousta 117': '4-6 weeks',
  'Edilia': '6-8 weeks',
  'Almira': '6-8 weeks',
  'TP2': '10-12 weeks',
  'AudioVector': '10-12 weeks',
  '4ft Voigt Horn': '16-18 weeks',
  'Voigt Horn': '16-18 weeks',
  'Hegeman': '16-18 weeks',
};

function getLeadTime(speakerName: string): string | null {
  // Try exact match first
  if (LEAD_TIMES[speakerName]) {
    return LEAD_TIMES[speakerName];
  }
  
  // Try case-insensitive match
  const normalizedName = speakerName.toLowerCase();
  for (const [key, value] of Object.entries(LEAD_TIMES)) {
    if (key.toLowerCase() === normalizedName) {
      return value;
    }
  }
  
  // Try partial match for variations
  if (normalizedName.includes('quarter wave') || normalizedName.includes('acousta')) {
    return LEAD_TIMES['Quarter Wave'];
  }
  if (normalizedName.includes('edilia')) {
    return LEAD_TIMES['Edilia'];
  }
  if (normalizedName.includes('almira')) {
    return LEAD_TIMES['Almira'];
  }
  if (normalizedName.includes('tp2')) {
    return LEAD_TIMES['TP2'];
  }
  if (normalizedName.includes('audiovector')) {
    return LEAD_TIMES['AudioVector'];
  }
  if (normalizedName.includes('voigt') || normalizedName.includes('hegeman')) {
    return LEAD_TIMES['Voigt Horn'];
  }
  
  return null;
}

export function CommissionForm({ isOpen, onClose, speakerName }: CommissionFormProps) {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    country: '',
    address: '',
    referrer: '',
    questions: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{
    type: 'success' | 'error' | null;
    message: string;
  }>({ type: null, message: '' });
  
  const leadTime = getLeadTime(speakerName);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus({ type: null, message: '' });

    try {
      const response = await fetch('/api/commission', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          speakerName,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setSubmitStatus({
          type: 'success',
          message: data.message || 'Commission request sent successfully!',
        });
        // Reset form
        setFormData({
          fullName: '',
          email: '',
          phone: '',
          country: '',
          address: '',
          referrer: '',
          questions: ''
        });
        // Close form after 2 seconds
        setTimeout(() => {
          onClose();
          setSubmitStatus({ type: null, message: '' });
        }, 2000);
      } else {
        setSubmitStatus({
          type: 'error',
          message: data.message || 'Failed to send request. Please try again.',
        });
      }
    } catch (error) {
      console.error('Error submitting commission form:', error);
      setSubmitStatus({
        type: 'error',
        message: 'An error occurred. Please try again or contact us directly.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 z-50 transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Slide-in Form with Spring Animation */}
      <div 
        className={`fixed inset-y-0 right-0 w-full sm:w-[600px] bg-white z-50 shadow-2xl transform overflow-y-auto ${
          isOpen ? 'animate-slide-in-spring' : 'translate-x-full'
        }`}
        style={{
          transition: isOpen ? 'none' : 'transform 0.3s ease-in'
        }}
      >
        <div className="p-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-display text-[#c59862] mb-2">
                Commission Your {speakerName}
              </h2>
              <p className="text-gray-600">
                Let's start a conversation about your perfect speaker
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              aria-label="Close form"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Lead Time Box */}
          {leadTime && (
            <div className="mb-8 p-6 bg-white border-2 border-black rounded-lg">
              <p className="text-gray-800 leading-relaxed">
                Crafting your speaker takes time.
              </p>
              <p className="text-gray-800 font-medium mt-2">
                Current lead time is {leadTime}
              </p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Full Name */}
            <div>
              <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-2">
                Full Name *
              </label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                required
                className="w-full p-3 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#c59862] focus:border-transparent"
                placeholder="Enter your full name"
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
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full p-3 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#c59862] focus:border-transparent"
                placeholder="your.email@example.com"
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
                value={formData.phone}
                onChange={handleChange}
                required
                className="w-full p-3 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#c59862] focus:border-transparent"
                placeholder="+44 20 1234 5678"
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
              value={formData.country}
              onChange={handleChange}
              required
              className="w-full p-3 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#c59862] focus:border-transparent"
              placeholder="Where will your Lowthers live?"
            />
          </div>

            {/* Address */}
            <div>
              <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-2">
                Address *
              </label>
              <input
                type="text"
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                required
                className="w-full p-3 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#c59862] focus:border-transparent"
                placeholder="Your address"
              />
            </div>

            {/* Referrer */}
            <div>
              <label htmlFor="referrer" className="block text-sm font-medium text-gray-700 mb-2">
                Referrer (Optional)
              </label>
              <input
                type="text"
                id="referrer"
                name="referrer"
                value={formData.referrer}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#c59862] focus:border-transparent"
                placeholder="How did you hear about us?"
              />
            </div>

            {/* Questions */}
            <div>
              <label htmlFor="questions" className="block text-sm font-medium text-gray-700 mb-2">
                Any Questions or Requirements?
              </label>
              <textarea
                id="questions"
                name="questions"
                value={formData.questions}
                onChange={handleChange}
                rows={4}
                className="w-full p-3 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#c59862] focus:border-transparent resize-none"
                placeholder="Tell us about your room, musical preferences, or any questions you have..."
              />
            </div>

            {/* Info Text */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600">
                Every Lowther speaker begins in conversation. Our team will review your enquiry and get back to you within 24 hours to discuss your requirements and arrange a listening session if desired.
              </p>
            </div>

            {/* Status Messages */}
            {submitStatus.type && (
              <div className={`p-4 rounded-lg ${
                submitStatus.type === 'success' 
                  ? 'bg-green-50 text-green-800 border border-green-200' 
                  : 'bg-red-50 text-red-800 border border-red-200'
              }`}>
                <p className="text-sm">{submitStatus.message}</p>
              </div>
            )}

            {/* Submit Buttons */}
            <div className="flex gap-4 pt-4">
              <Button 
                type="button" 
                variant="white" 
                size="lowther" 
                onClick={onClose}
                className="flex-1"
              >
                CANCEL
              </Button>
              <Button 
                type="submit" 
                variant="black" 
                size="lowther"
                className="flex-1"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'SENDING...' : 'SEND ENQUIRY'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

