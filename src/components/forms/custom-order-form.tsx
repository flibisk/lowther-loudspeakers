"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X } from "lucide-react";

interface CustomOrderFormProps {
  isOpen: boolean;
  onClose: () => void;
  productName?: string;
}

interface FormData {
  name: string;
  email: string;
  country: string;
  bespokeVeneer: string;
  magnetType: "Neodymium" | "Alnico" | "";
  extraQuestions: string;
}

export function CustomOrderForm({ isOpen, onClose, productName = "Super Tweeter" }: CustomOrderFormProps) {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    country: '',
    bespokeVeneer: '',
    magnetType: '',
    extraQuestions: ''
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

    // Validate required fields
    if (!formData.name || !formData.email || !formData.country || !formData.magnetType) {
      setSubmitStatus({
        type: 'error',
        message: 'Please fill in all required fields.',
      });
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await fetch('/api/custom-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          productName,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setSubmitStatus({
          type: 'success',
          message: data.message || 'Thank you for your custom order enquiry. We\'ll get back to you soon!',
        });
        // Reset form after successful submission
        setFormData({
          name: '',
          email: '',
          country: '',
          bespokeVeneer: '',
          magnetType: '',
          extraQuestions: ''
        });
        // Close form after 2 seconds
        setTimeout(() => {
          onClose();
          setSubmitStatus({ type: null, message: '' });
        }, 2000);
      } else {
        setSubmitStatus({
          type: 'error',
          message: data.message || 'Failed to submit enquiry. Please try again.',
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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="font-display text-2xl" style={{ color: '#c59862' }}>
            Custom Order - {productName}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-900 transition-colors"
            aria-label="Close"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-900 mb-2">
              Name <span className="text-red-500">*</span>
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

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-900 mb-2">
              Email <span className="text-red-500">*</span>
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

          <div>
            <label htmlFor="country" className="block text-sm font-medium text-gray-900 mb-2">
              Country <span className="text-red-500">*</span>
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

          <div>
            <label htmlFor="bespokeVeneer" className="block text-sm font-medium text-gray-900 mb-2">
              Bespoke Veneer
            </label>
            <Input
              id="bespokeVeneer"
              type="text"
              value={formData.bespokeVeneer}
              onChange={(e) => handleInputChange('bespokeVeneer', e.target.value)}
              placeholder="Please specify your preferred veneer"
              className="w-full"
            />
          </div>

          <div>
            <label htmlFor="magnetType" className="block text-sm font-medium text-gray-900 mb-2">
              Magnet Type <span className="text-red-500">*</span>
            </label>
            <select
              id="magnetType"
              value={formData.magnetType}
              onChange={(e) => handleInputChange('magnetType', e.target.value as "Neodymium" | "Alnico" | "")}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
            >
              <option value="">Select magnet type</option>
              <option value="Neodymium">Neodymium</option>
              <option value="Alnico">Alnico</option>
            </select>
          </div>

          <div>
            <label htmlFor="extraQuestions" className="block text-sm font-medium text-gray-900 mb-2">
              Extra Questions or Requirements
            </label>
            <textarea
              id="extraQuestions"
              value={formData.extraQuestions}
              onChange={(e) => handleInputChange('extraQuestions', e.target.value)}
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black resize-none"
              placeholder="Please share any additional requirements or questions..."
            />
          </div>

          {submitStatus.type && (
            <div
              className={`p-4 rounded-md ${
                submitStatus.type === 'success'
                  ? 'bg-green-50 text-green-800 border border-green-200'
                  : 'bg-red-50 text-red-800 border border-red-200'
              }`}
            >
              {submitStatus.message}
            </div>
          )}

          <div className="flex gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1 border-gray-300 text-gray-700 hover:bg-gray-50 font-sarabun text-xs tracking-[2px] uppercase"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 bg-black hover:bg-[#c59862] text-white font-sarabun text-xs tracking-[2px] uppercase"
            >
              {isSubmitting ? 'SUBMITTING...' : 'SUBMIT ENQUIRY'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

