"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { OverlayForm } from "@/components/ui/overlay-form";

interface BookAppointmentFormProps {
  isOpen: boolean;
  onClose: () => void;
}

interface FormData {
  appointmentType: 'phone' | 'visit';
  name: string;
  phone: string;
  email: string;
  country: string;
  date: string;
  time: string;
  message?: string;
}

export function BookAppointmentForm({ isOpen, onClose }: BookAppointmentFormProps) {
  const [formData, setFormData] = useState<FormData>({
    appointmentType: 'phone',
    name: '',
    phone: '',
    email: '',
    country: '',
    date: '',
    time: '',
    message: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{
    type: 'success' | 'error' | null;
    message: string;
  }>({ type: null, message: '' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus({ type: null, message: '' });

    try {
      // Map the form data to match the API expectations
      const apiPayload = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        preferredDate: formData.date,
        preferredTime: formData.time,
        location: formData.appointmentType === 'visit' ? 'norfolk' : 'phone_call',
        interest: formData.appointmentType === 'phone' ? 'Phone Consultation' : 'Listening Room Visit',
        message: formData.message || '',
      };

      const response = await fetch('/api/book-appointment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(apiPayload),
      });

      const data = await response.json();

      if (data.success) {
        // Store email in localStorage for wishlist notifications
        if (formData.email) {
          localStorage.setItem('user_email', formData.email);
        }
        setSubmitStatus({
          type: 'success',
          message: data.message || 'Your appointment request has been sent successfully!',
        });
        
        // Close the form after 2 seconds
        setTimeout(() => {
          onClose();
          // Reset form
          setFormData({
            appointmentType: 'phone',
            name: '',
            phone: '',
            email: '',
            country: '',
            date: '',
            time: '',
            message: ''
          });
          setSubmitStatus({ type: null, message: '' });
        }, 2000);
      } else {
        setSubmitStatus({
          type: 'error',
          message: data.message || 'Failed to send appointment request. Please try again.',
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
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <OverlayForm
      isOpen={isOpen}
      onClose={onClose}
      title="Book an Appointment"
      onSubmit={handleSubmit}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Appointment Type */}
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-2">
            I would like to:
          </label>
          <div className="space-y-2">
            <label className="flex items-center">
              <input
                type="radio"
                name="appointmentType"
                value="phone"
                checked={formData.appointmentType === 'phone'}
                onChange={(e) => handleInputChange('appointmentType', e.target.value)}
                className="mr-2"
              />
              <span className="text-sm">Schedule a phone call</span>
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="appointmentType"
                value="visit"
                checked={formData.appointmentType === 'visit'}
                onChange={(e) => handleInputChange('appointmentType', e.target.value)}
                className="mr-2"
              />
              <span className="text-sm">Arrange a listening room visit</span>
            </label>
          </div>
        </div>

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
            Phone Number *
          </label>
          <Input
            id="phone"
            type="tel"
            value={formData.phone}
            onChange={(e) => handleInputChange('phone', e.target.value)}
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

        {/* Country */}
        <div>
          <label htmlFor="country" className="block text-sm font-medium text-neutral-700 mb-1">
            Country *
          </label>
          <Input
            id="country"
            type="text"
            value={formData.country}
            onChange={(e) => handleInputChange('country', e.target.value)}
            required
            className="w-full"
          />
        </div>

        {/* Date */}
        <div>
          <label htmlFor="date" className="block text-sm font-medium text-neutral-700 mb-1">
            Preferred Date *
          </label>
          <Input
            id="date"
            type="date"
            value={formData.date}
            onChange={(e) => handleInputChange('date', e.target.value)}
            required
            className="w-full [color-scheme:light]"
          />
        </div>

        {/* Time */}
        <div>
          <label htmlFor="time" className="block text-sm font-medium text-neutral-700 mb-1">
            Preferred Time *
          </label>
          <Input
            id="time"
            type="time"
            value={formData.time}
            onChange={(e) => handleInputChange('time', e.target.value)}
            required
            className="w-full [color-scheme:light]"
          />
        </div>

        {/* Message */}
        <div>
          <label htmlFor="message" className="block text-sm font-medium text-neutral-700 mb-1">
            Additional Message
          </label>
          <textarea
            id="message"
            value={formData.message}
            onChange={(e) => handleInputChange('message', e.target.value)}
            rows={3}
            className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#c59862] focus:border-transparent"
            placeholder="Tell us more about your requirements..."
          />
        </div>

        {/* Submit Status Message */}
        {submitStatus.type && (
          <div className={`p-4 rounded-md ${
            submitStatus.type === 'success' ? 'bg-green-50 text-green-800 border border-green-200' : 'bg-red-50 text-red-800 border border-red-200'
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
            className="w-full disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Sending...' : 'Submit Appointment Request'}
          </Button>
        </div>
      </form>
    </OverlayForm>
  );
}
