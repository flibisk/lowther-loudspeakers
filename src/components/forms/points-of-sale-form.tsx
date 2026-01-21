"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { OverlayForm } from "@/components/ui/overlay-form";
import { TurnstileInvisible, TurnstileRef } from "@/components/turnstile";
import { trackFormSubmit, trackEnquiryStart, trackEnquirySubmit } from "@/lib/analytics";

interface PointsOfSaleFormProps {
  isOpen: boolean;
  onClose: () => void;
}

interface FormData {
  name: string;
  email: string;
  preferredLocation: string;
}

export function PointsOfSaleForm({ isOpen, onClose }: PointsOfSaleFormProps) {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    preferredLocation: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{
    type: 'success' | 'error' | null;
    message: string;
  }>({ type: null, message: '' });
  const turnstileRef = useRef<TurnstileRef>(null);
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

      const response = await fetch('/api/points-of-sale', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          turnstileToken,
        }),
      });

      const data = await response.json();

      if (data.success) {
        // Track form submission
        trackFormSubmit('Points of Sale');
        trackEnquirySubmit('Points of Sale');
        
        // Store email in localStorage for wishlist notifications
        if (formData.email) {
          localStorage.setItem('user_email', formData.email);
        }
        setSubmitStatus({
          type: 'success',
          message: data.message || 'Request submitted successfully!',
        });
        // Reset form after successful submission
        setFormData({
          name: '',
          email: '',
          preferredLocation: ''
        });
        // Close form after 2 seconds
        setTimeout(() => {
          onClose();
          setSubmitStatus({ type: null, message: '' });
        }, 2000);
      } else {
        setSubmitStatus({
          type: 'error',
          message: data.message || 'Failed to submit request. Please try again.',
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
      trackEnquiryStart('Points of Sale');
    }
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <OverlayForm
      isOpen={isOpen}
      onClose={onClose}
      title="Points of Sale"
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

        {/* Preferred Location */}
        <div>
          <label htmlFor="preferredLocation" className="block text-sm font-medium text-neutral-700 mb-1">
            Preferred Location *
          </label>
          <textarea
            id="preferredLocation"
            value={formData.preferredLocation}
            onChange={(e) => handleInputChange('preferredLocation', e.target.value)}
            rows={3}
            required
            className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#c59862] focus:border-transparent"
            placeholder="Please specify your preferred location for points of sale (city, region, country)..."
          />
        </div>

        {/* Information */}
        <div className="bg-neutral-50 p-4 rounded-lg">
          <p className="text-sm text-neutral-600 mb-2">
            <strong>About Points of Sale:</strong>
          </p>
          <p className="text-sm text-neutral-700">
            We're always looking to expand our network of authorized dealers and points of sale. 
            If you're interested in becoming a Lowther dealer or know of a potential location 
            that would be suitable for our products, please let us know.
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
            {isSubmitting ? 'Submitting...' : 'Submit Request'}
          </Button>
        </div>
      </form>
    </OverlayForm>
  );
}
