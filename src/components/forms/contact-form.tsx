"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { OverlayForm } from "@/components/ui/overlay-form";
import { TurnstileInvisible, TurnstileRef } from "@/components/turnstile";
import { trackFormSubmit, trackEnquiryStart, trackEnquirySubmit } from "@/lib/analytics";

interface ContactFormProps {
  isOpen: boolean;
  onClose: () => void;
  segment?: string; // For categorizing form source (e.g., "Contact", "Upgrade", "Refurbishment")
}

interface FormData {
  name: string;
  phone: string;
  email: string;
  location: string;
  message: string;
}

export function ContactForm({ isOpen, onClose, segment = "Contact" }: ContactFormProps) {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    phone: '',
    email: '',
    location: '',
    message: ''
  });
  const turnstileRef = useRef<TurnstileRef>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{
    type: 'success' | 'error' | null;
    message: string;
  }>({ type: null, message: '' });
  const hasTrackedStart = useRef(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus({ type: null, message: '' });

    try {
      // Get Turnstile token (invisible verification)
      let turnstileToken = '';
      try {
        turnstileToken = await turnstileRef.current?.execute() || '';
      } catch (error) {
        console.error('Turnstile verification failed:', error);
        setSubmitStatus({
          type: 'error',
          message: 'Security verification failed. Please try again.',
        });
        setIsSubmitting(false);
        turnstileRef.current?.reset();
        return;
      }

      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          segment,
          turnstileToken,
        }),
      });

      const data = await response.json();

      if (data.success) {
        // Track form submission
        trackFormSubmit(segment);
        trackEnquirySubmit(segment);
        
        // Store email in localStorage for wishlist notifications
        if (formData.email) {
          localStorage.setItem('user_email', formData.email);
        }
        setSubmitStatus({
          type: 'success',
          message: data.message || 'Message sent successfully! We\'ll get back to you soon.',
        });
        // Reset form after successful submission
        setFormData({
          name: '',
          phone: '',
          email: '',
          location: '',
          message: ''
        });
        // Close form after 2 seconds
        setTimeout(() => {
          onClose();
          setSubmitStatus({ type: null, message: '' });
        }, 2000);
      } else {
        setSubmitStatus({
          type: 'error',
          message: data.message || 'Failed to send message. Please try again.',
        });
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      setSubmitStatus({
        type: 'error',
        message: 'An error occurred. Please try again or contact us directly.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: keyof FormData, value: string) => {
    // Track enquiry start on first input
    if (!hasTrackedStart.current && value.length > 0) {
      hasTrackedStart.current = true;
      trackEnquiryStart(segment);
    }
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <OverlayForm
      isOpen={isOpen}
      onClose={onClose}
      title="Contact Us"
      onSubmit={handleSubmit}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Name */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-neutral-700 mb-1">
            Name *
          </label>
          <Input
            id="name"
            type="text"
            value={formData.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
            required
            className="w-full"
          />
        </div>

        {/* Phone */}
        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-neutral-700 mb-1">
            Phone Number
          </label>
          <Input
            id="phone"
            type="tel"
            value={formData.phone}
            onChange={(e) => handleInputChange('phone', e.target.value)}
            className="w-full"
          />
        </div>

        {/* Email */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-neutral-700 mb-1">
            Email Address *
          </label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
            required
            className="w-full"
          />
        </div>

        {/* Location */}
        <div>
          <label htmlFor="location" className="block text-sm font-medium text-neutral-700 mb-1">
            Location
          </label>
          <Input
            id="location"
            type="text"
            value={formData.location}
            onChange={(e) => handleInputChange('location', e.target.value)}
            className="w-full"
            placeholder="City, Country"
          />
        </div>

        {/* Message */}
        <div>
          <label htmlFor="message" className="block text-sm font-medium text-neutral-700 mb-1">
            Message *
          </label>
          <textarea
            id="message"
            value={formData.message}
            onChange={(e) => handleInputChange('message', e.target.value)}
            rows={4}
            required
            className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#c59862] focus:border-transparent"
            placeholder="How can we help you?"
          />
        </div>

        {/* Contact Information */}
        <div className="bg-neutral-50 p-4 rounded-lg">
          <p className="text-sm text-neutral-600 mb-2">
            <strong>Direct Contact:</strong>
          </p>
          <p className="text-sm text-neutral-700">
            Phone: <a href="tel:+442083009166" className="text-[#c59862] hover:underline">+44 20 8300 9166</a>
          </p>
        </div>

        {/* Invisible Turnstile - runs on submit */}
        <TurnstileInvisible ref={turnstileRef} />

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

        {/* Submit Button */}
        <div className="pt-4">
          <Button
            type="submit"
            variant="black"
            size="lowther"
            className="w-full"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Sending...' : 'Send Message'}
          </Button>
        </div>
      </form>
    </OverlayForm>
  );
}
