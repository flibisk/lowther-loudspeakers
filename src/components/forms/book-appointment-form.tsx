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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Book Appointment Form Data:', formData);
    // Here you would typically send the data to your backend
    alert('Appointment request submitted successfully!');
    onClose();
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
            className="w-full"
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
            className="w-full"
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

        {/* Submit Button */}
        <div className="pt-4">
          <Button
            type="submit"
            variant="black"
            size="lowther"
            className="w-full"
          >
            Submit Appointment Request
          </Button>
        </div>
      </form>
    </OverlayForm>
  );
}
