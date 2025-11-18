'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { X } from 'lucide-react';

const DISCOUNT_POPUP_KEY = 'lowther_discount_popup_shown';
const DISCOUNT_EMAIL_KEY = 'lowther_discount_email';

export function DiscountPopup() {
  const [showPopup, setShowPopup] = useState(false);
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{
    type: 'success' | 'error' | null;
    message: string;
  }>({ type: null, message: '' });

  useEffect(() => {
    // Check if popup has been shown before
    const hasShown = localStorage.getItem(DISCOUNT_POPUP_KEY);
    const storedEmail = localStorage.getItem(DISCOUNT_EMAIL_KEY);
    
    // If email already stored, don't show popup
    if (storedEmail) {
      return;
    }

    // Show popup after 3 seconds if not shown before
    if (!hasShown) {
      const timer = setTimeout(() => {
        setShowPopup(true);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, []);

  const handleClose = () => {
    setShowPopup(false);
    localStorage.setItem(DISCOUNT_POPUP_KEY, 'true');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !email.includes('@')) {
      setSubmitStatus({
        type: 'error',
        message: 'Please enter a valid email address.',
      });
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus({ type: null, message: '' });

    try {
      const response = await fetch('/api/discount-signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      // Check if response is ok first
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Network error occurred' }));
        setSubmitStatus({
          type: 'error',
          message: errorData.message || `Server error (${response.status}). Please try again.`,
        });
        return;
      }

      const data = await response.json();

      if (data.success) {
        // Store email for abandoned cart tracking
        localStorage.setItem(DISCOUNT_EMAIL_KEY, email);
        localStorage.setItem(DISCOUNT_POPUP_KEY, 'true');
        
        // Show discount code if email failed or show success message
        if (data.discountCode && !data.emailSent) {
          setSubmitStatus({
            type: 'success',
            message: `Your discount code: ${data.discountCode}. Use it at checkout!`,
          });
        } else {
          setSubmitStatus({
            type: 'success',
            message: 'Success! Check your email for your 20% discount code.',
          });
        }
        
        // Close popup after 3 seconds (longer if showing code)
        setTimeout(() => {
          handleClose();
        }, data.emailSent ? 2000 : 5000);
      } else {
        setSubmitStatus({
          type: 'error',
          message: data.message || 'Failed to submit. Please try again.',
        });
      }
    } catch (error) {
      console.error('Error submitting discount signup:', error);
      setSubmitStatus({
        type: 'error',
        message: 'An error occurred. Please try again.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!showPopup) return null;

  return (
    <div className="fixed inset-0 bg-black/60 z-[100] flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-white rounded-lg max-w-md w-full shadow-2xl relative animate-slide-up">
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-900 transition-colors z-10"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-8">
          <div className="text-center mb-6">
            <h2 className="font-display text-3xl mb-2" style={{ color: '#c59862' }}>
              Get 20% Off
            </h2>
            <p className="text-gray-600 text-sm">
              Enter your email to receive your exclusive discount code
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              type="email"
              placeholder="Enter your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full"
              disabled={isSubmitting}
            />

            {submitStatus.type && (
              <div
                className={`p-3 rounded-md text-sm ${
                  submitStatus.type === 'success'
                    ? 'bg-green-50 text-green-800 border border-green-200'
                    : 'bg-red-50 text-red-800 border border-red-200'
                }`}
              >
                {submitStatus.message}
              </div>
            )}

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-black hover:bg-[#c59862] text-white font-sarabun text-xs tracking-[3px] transition-all duration-300 uppercase"
            >
              {isSubmitting ? 'SUBMITTING...' : 'GET MY DISCOUNT CODE'}
            </Button>

            <p className="text-xs text-gray-500 text-center">
              By submitting, you agree to receive marketing emails from Lowther Loudspeakers.
              You can unsubscribe at any time.
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}

