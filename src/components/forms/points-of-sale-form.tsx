"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { OverlayForm } from "@/components/ui/overlay-form";

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Points of Sale Form Data:', formData);
    // Here you would typically send the data to your backend
    alert('Request submitted successfully! We\'ll contact you about points of sale in your preferred location.');
    onClose();
  };

  const handleInputChange = (field: keyof FormData, value: string) => {
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

        {/* Submit Button */}
        <div className="pt-4">
          <Button
            type="submit"
            variant="black"
            size="lowther"
            className="w-full"
          >
            Submit Request
          </Button>
        </div>
      </form>
    </OverlayForm>
  );
}
