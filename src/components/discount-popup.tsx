'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { X, Mail, ArrowRight, Loader2, Check, Copy } from 'lucide-react';
import { useAuth } from '@/contexts/auth-context';

const DISCOUNT_POPUP_KEY = 'lowther_discount_popup_shown';
const DISCOUNT_EMAIL_KEY = 'lowther_discount_email';

type Step = 'email' | 'code' | 'success';

export function DiscountPopup() {
  const { refreshUser } = useAuth();
  const [showPopup, setShowPopup] = useState(false);
  const [step, setStep] = useState<Step>('email');
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [discountCode, setDiscountCode] = useState('');
  const [discountPercent, setDiscountPercent] = useState(20);
  const [copied, setCopied] = useState(false);

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

  const handleSubmitEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !email.includes('@')) {
      setError('Please enter a valid email address.');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch('/api/discount-signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'send-code', email }),
      });

      const data = await response.json();

      if (data.success) {
        setStep('code');
      } else {
        setError(data.message || 'Failed to send code. Please try again.');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmitCode = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!code || code.length < 6) {
      setError('Please enter the 6-digit code.');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch('/api/discount-signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'verify-code', email, code }),
      });

      const data = await response.json();

      if (data.success) {
        // Store email for abandoned cart tracking
        localStorage.setItem(DISCOUNT_EMAIL_KEY, email);
        localStorage.setItem(DISCOUNT_POPUP_KEY, 'true');
        
        // Update abandoned cart with email if cart exists
        if (typeof window !== 'undefined') {
          import('@/lib/abandoned-cart').then(({ updateAbandonedCartEmail }) => {
            updateAbandonedCartEmail(email);
          }).catch(() => {});
        }
        
        // Refresh auth context
        await refreshUser();
        
        // Show success with discount code
        setDiscountCode(data.discountCode);
        setDiscountPercent(data.discountPercent || 20);
        setStep('success');
      } else {
        setError(data.message || 'Invalid code. Please try again.');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(discountCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!showPopup) return null;

  return (
    <div className="fixed inset-0 bg-black/60 z-[100] flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl relative animate-slide-up overflow-hidden">
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-900 transition-colors z-10 rounded-full p-1 hover:bg-gray-100"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Email Step */}
        {step === 'email' && (
          <div className="p-8">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-amber-100 to-amber-200 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail className="w-8 h-8 text-amber-600" />
              </div>
              <h2 className="font-hvmuse text-3xl mb-2" style={{ color: '#c59862' }}>
                Get 20% Off
              </h2>
              <p className="text-gray-600 text-sm">
                Create your account to receive your exclusive discount code
              </p>
            </div>

            <form onSubmit={handleSubmitEmail} className="space-y-4">
              <Input
                type="email"
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full h-12"
                disabled={isSubmitting}
              />

              {error && (
                <div className="p-3 rounded-lg text-sm bg-red-50 text-red-800 border border-red-200">
                  {error}
                </div>
              )}

              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full h-12 bg-black hover:bg-[#c59862] text-white font-sarabun text-xs tracking-[3px] transition-all duration-300 uppercase"
              >
                {isSubmitting ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    CONTINUE
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </>
                )}
              </Button>

              <p className="text-xs text-gray-500 text-center">
                By continuing, you agree to receive marketing emails from Lowther Loudspeakers.
              </p>
            </form>
          </div>
        )}

        {/* Code Step */}
        {step === 'code' && (
          <div className="p-8">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-amber-100 to-amber-200 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail className="w-8 h-8 text-amber-600" />
              </div>
              <h2 className="font-hvmuse text-2xl mb-2 text-neutral-900">
                Check Your Email
              </h2>
              <p className="text-gray-600 text-sm">
                We&apos;ve sent a 6-digit code to<br />
                <span className="font-medium text-neutral-900">{email}</span>
              </p>
            </div>

            <form onSubmit={handleSubmitCode} className="space-y-4">
              <Input
                type="text"
                inputMode="numeric"
                placeholder="Enter 6-digit code"
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                required
                maxLength={6}
                className="w-full h-12 text-center text-2xl tracking-[8px] font-mono"
                disabled={isSubmitting}
                autoFocus
              />

              {error && (
                <div className="p-3 rounded-lg text-sm bg-red-50 text-red-800 border border-red-200">
                  {error}
                </div>
              )}

              <Button
                type="submit"
                disabled={isSubmitting || code.length < 6}
                className="w-full h-12 bg-black hover:bg-[#c59862] text-white font-sarabun text-xs tracking-[3px] transition-all duration-300 uppercase"
              >
                {isSubmitting ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  'VERIFY & GET DISCOUNT'
                )}
              </Button>

              <button
                type="button"
                onClick={() => {
                  setStep('email');
                  setCode('');
                  setError(null);
                }}
                className="w-full text-sm text-gray-500 hover:text-gray-700"
              >
                Use a different email
              </button>
            </form>
          </div>
        )}

        {/* Success Step */}
        {step === 'success' && (
          <div className="p-8">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-green-100 to-green-200 rounded-full flex items-center justify-center mx-auto mb-4">
                <Check className="w-8 h-8 text-green-600" />
              </div>
              <h2 className="font-hvmuse text-2xl mb-2 text-neutral-900">
                You&apos;re In!
              </h2>
              <p className="text-gray-600 text-sm">
                Your account has been created. Here&apos;s your exclusive discount:
              </p>
            </div>

            <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-xl p-6 mb-6 border-2 border-dashed border-amber-300">
              <p className="text-xs text-amber-700 uppercase tracking-wider mb-2 text-center">
                Your {discountPercent}% Discount Code
              </p>
              <div className="flex items-center justify-center gap-3">
                <span className="text-3xl font-bold text-amber-800 tracking-[4px]">
                  {discountCode}
                </span>
                <button
                  onClick={handleCopyCode}
                  className="p-2 rounded-lg bg-white/80 hover:bg-white text-amber-700 transition-colors"
                  title="Copy code"
                >
                  {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                </button>
              </div>
              <p className="text-xs text-amber-600 text-center mt-2">
                {copied ? 'Copied!' : 'Enter at checkout'}
              </p>
            </div>

            <Button
              onClick={handleClose}
              className="w-full h-12 bg-black hover:bg-[#c59862] text-white font-sarabun text-xs tracking-[3px] transition-all duration-300 uppercase"
            >
              CONTINUE SHOPPING
            </Button>

            <p className="text-xs text-gray-500 text-center mt-4">
              We&apos;ve also emailed your code. Check your inbox!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

