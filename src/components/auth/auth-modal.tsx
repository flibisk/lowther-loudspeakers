'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, Mail, ArrowRight, Loader2, User, MapPin, Speaker, Globe } from 'lucide-react';
import { useAuth } from '@/contexts/auth-context';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  mode?: 'signin' | 'signup';
}

export function AuthModal({ isOpen, onClose, onSuccess, mode = 'signin' }: AuthModalProps) {
  const { signIn, verifyCode, setUsername, refreshUser } = useAuth();
  const [step, setStep] = useState<'email' | 'code' | 'profile'>('email');
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [fullName, setFullName] = useState('');
  const [address, setAddress] = useState('');
  const [country, setCountry] = useState('');
  const [equipment, setEquipment] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmitEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const result = await signIn(email);

    setLoading(false);
    if (result.success) {
      setStep('code');
    } else {
      setError(result.error || 'Failed to send code');
    }
  };

  const handleSubmitCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const result = await verifyCode(email, code);

    setLoading(false);
    if (result.success) {
      // If user doesn't have a displayName, show profile step
      if (result.needsUsername) {
        setStep('profile');
      } else {
        onSuccess?.();
        handleClose();
      }
    } else {
      setError(result.error || 'Invalid code');
    }
  };

  const handleSubmitProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate display name
    const trimmedName = displayName.trim();
    if (trimmedName.length < 3) {
      setError('Display name must be at least 3 characters');
      return;
    }
    if (trimmedName.length > 20) {
      setError('Display name must be 20 characters or less');
      return;
    }
    if (!/^[a-zA-Z0-9_]+$/.test(trimmedName)) {
      setError('Display name can only contain letters, numbers, and underscores');
      return;
    }
    
    setLoading(true);
    setError(null);

    // First set the username
    const usernameResult = await setUsername(trimmedName);
    
    if (!usernameResult.success) {
      setLoading(false);
      setError(usernameResult.error || 'Display name not available');
      return;
    }

    // Then save optional profile data if provided
    if (fullName.trim() || address.trim() || country.trim()) {
      try {
        const profileResponse = await fetch('/api/account/profile', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            fullName: fullName.trim() || null,
            address: address.trim() || null,
            country: country.trim() || null,
          }),
        });
        
        if (!profileResponse.ok) {
          const data = await profileResponse.json();
          console.error('Failed to save profile:', data.error);
        }
      } catch (err) {
        console.error('Failed to save profile data:', err);
      }
    }
    
    // Add equipment if provided - do this separately
    if (equipment.trim()) {
      try {
        const equipmentItems = equipment.split(',').map(item => item.trim()).filter(Boolean);
        console.log('[AUTH] Saving equipment items:', equipmentItems);
        
        for (const item of equipmentItems) {
          const equipResponse = await fetch('/api/account/equipment', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: item }),
          });
          
          if (!equipResponse.ok) {
            const data = await equipResponse.json();
            console.error('Failed to save equipment:', item, data.error);
          } else {
            console.log('[AUTH] Equipment saved:', item);
          }
        }
      } catch (err) {
        console.error('Failed to save equipment:', err);
      }
    }

    setLoading(false);
    await refreshUser();
    onSuccess?.();
    handleClose();
  };

  const handleClose = () => {
    onClose();
    // Reset after animation
    setTimeout(() => {
      setStep('email');
      setEmail('');
      setCode('');
      setDisplayName('');
      setFullName('');
      setAddress('');
      setCountry('');
      setEquipment('');
      setError(null);
    }, 300);
  };

  // Use state to track if we're mounted (for portal)
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  if (!isOpen || !mounted) return null;

  // Use portal to render to document.body - this ensures the modal persists
  // even if the parent component re-renders/unmounts
  const modalContent = (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-fade-in"
        onClick={handleClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-md animate-slide-up max-h-[90vh] overflow-y-auto">
        <div className="rounded-2xl bg-white p-6 shadow-2xl ring-1 ring-black/5 sm:p-8">
          {/* Close button */}
          <button
            onClick={handleClose}
            className="absolute right-4 top-4 rounded-full p-2 text-neutral-400 transition-colors hover:bg-neutral-100 hover:text-neutral-600"
          >
            <X className="h-5 w-5" />
          </button>

          {/* Header */}
          <div className="mb-6 text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-neutral-100">
              {step === 'profile' ? (
                <User className="h-6 w-6 text-neutral-600" />
              ) : (
                <Mail className="h-6 w-6 text-neutral-600" />
              )}
            </div>
            <h2 className="font-hvmuse text-xl text-neutral-900">
              {step === 'email' && (mode === 'signup' ? 'Create Your Account' : 'Welcome Back')}
              {step === 'code' && 'Check Your Email'}
              {step === 'profile' && 'Complete Your Profile'}
            </h2>
            <p className="mt-2 font-sarabun text-sm text-neutral-500">
              {step === 'email' && (mode === 'signup' 
                ? 'Join the Lowther community to access exclusive features'
                : 'Sign in to your Lowther account'
              )}
              {step === 'code' && `We sent a 6-digit code to ${email}`}
              {step === 'profile' && 'Tell us a bit about yourself'}
            </p>
          </div>

          {/* Email Form */}
          {step === 'email' && (
            <form onSubmit={handleSubmitEmail}>
              <div className="mb-4">
                <label htmlFor="email" className="sr-only">
                  Email address
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  required
                  autoFocus
                  className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-3 font-sarabun text-neutral-900 placeholder:text-neutral-400 focus:border-neutral-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-neutral-200"
                />
              </div>

              {error && (
                <p className="mb-4 text-center font-sarabun text-sm text-red-600">
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={loading || !email}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-neutral-900 px-4 py-3 font-sarabun font-medium text-white transition-all hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <>
                    Continue
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>
            </form>
          )}

          {/* Code Form */}
          {step === 'code' && (
            <form onSubmit={handleSubmitCode}>
              <div className="mb-4">
                <label htmlFor="code" className="sr-only">
                  Verification code
                </label>
                <input
                  id="code"
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  maxLength={6}
                  value={code}
                  onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
                  placeholder="000000"
                  required
                  autoFocus
                  className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-center font-mono text-2xl tracking-[0.5em] text-neutral-900 placeholder:tracking-[0.5em] placeholder:text-neutral-300 focus:border-neutral-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-neutral-200"
                />
              </div>

              {error && (
                <p className="mb-4 text-center font-sarabun text-sm text-red-600">
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={loading || code.length !== 6}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-neutral-900 px-4 py-3 font-sarabun font-medium text-white transition-all hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  'Verify'
                )}
              </button>

              <button
                type="button"
                onClick={() => {
                  setStep('email');
                  setCode('');
                  setError(null);
                }}
                className="mt-3 w-full font-sarabun text-sm text-neutral-500 hover:text-neutral-700"
              >
                Use a different email
              </button>
            </form>
          )}

          {/* Profile Form (for new users) */}
          {step === 'profile' && (
            <form onSubmit={handleSubmitProfile}>
              {/* Display Name (Required) */}
              <div className="mb-4">
                <label htmlFor="displayName" className="block font-sarabun text-xs uppercase tracking-wider text-neutral-500 mb-2">
                  Display Name <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
                  <input
                    id="displayName"
                    type="text"
                    value={displayName}
                    onChange={(e) => {
                      setDisplayName(e.target.value.replace(/[^a-zA-Z0-9_]/g, ''));
                      setError(null);
                    }}
                    placeholder="YourUsername"
                    required
                    autoFocus
                    maxLength={20}
                    className="w-full rounded-xl border border-neutral-200 bg-neutral-50 pl-10 pr-4 py-3 font-sarabun text-neutral-900 placeholder:text-neutral-400 focus:border-neutral-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-neutral-200"
                  />
                </div>
                <p className="mt-1 font-sarabun text-xs text-neutral-400">
                  This will be shown publicly. Letters, numbers, underscores only.
                </p>
              </div>

              {/* Full Name */}
              <div className="mb-4">
                <label htmlFor="fullName" className="block font-sarabun text-xs uppercase tracking-wider text-neutral-500 mb-2">
                  Full Name <span className="text-neutral-400">(optional)</span>
                </label>
                <input
                  id="fullName"
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="John Smith"
                  className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-3 font-sarabun text-neutral-900 placeholder:text-neutral-400 focus:border-neutral-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-neutral-200"
                />
              </div>

              {/* Country */}
              <div className="mb-4">
                <label htmlFor="country" className="block font-sarabun text-xs uppercase tracking-wider text-neutral-500 mb-2">
                  Country <span className="text-neutral-400">(optional)</span>
                </label>
                <div className="relative">
                  <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
                  <input
                    id="country"
                    type="text"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    placeholder="United Kingdom"
                    className="w-full rounded-xl border border-neutral-200 bg-neutral-50 pl-10 pr-4 py-3 font-sarabun text-neutral-900 placeholder:text-neutral-400 focus:border-neutral-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-neutral-200"
                  />
                </div>
              </div>

              {/* Full Address */}
              <div className="mb-4">
                <label htmlFor="address" className="block font-sarabun text-xs uppercase tracking-wider text-neutral-500 mb-2">
                  Full Address <span className="text-neutral-400">(optional)</span>
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
                  <input
                    id="address"
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="123 High Street, London"
                    className="w-full rounded-xl border border-neutral-200 bg-neutral-50 pl-10 pr-4 py-3 font-sarabun text-neutral-900 placeholder:text-neutral-400 focus:border-neutral-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-neutral-200"
                  />
                </div>
              </div>

              {/* Hi-Fi Equipment */}
              <div className="mb-4">
                <label htmlFor="equipment" className="block font-sarabun text-xs uppercase tracking-wider text-neutral-500 mb-2">
                  My Hi-Fi Equipment <span className="text-neutral-400">(optional)</span>
                </label>
                <div className="relative">
                  <Speaker className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
                  <input
                    id="equipment"
                    type="text"
                    value={equipment}
                    onChange={(e) => setEquipment(e.target.value)}
                    placeholder="TP1 Speakers, Rega Planar 3, Naim Nait"
                    className="w-full rounded-xl border border-neutral-200 bg-neutral-50 pl-10 pr-4 py-3 font-sarabun text-neutral-900 placeholder:text-neutral-400 focus:border-neutral-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-neutral-200"
                  />
                </div>
                <p className="mt-1 font-sarabun text-xs text-neutral-400">
                  Show off your setup! Separate items with commas.
                </p>
              </div>

              {error && (
                <p className="mb-4 text-center font-sarabun text-sm text-red-600">
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={loading || displayName.length < 3}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-neutral-900 px-4 py-3 font-sarabun font-medium text-white transition-all hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <>
                    Complete Sign Up
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>
            </form>
          )}

          {/* Footer */}
          <p className="mt-6 text-center font-sarabun text-xs text-neutral-400">
            {step === 'profile' 
              ? 'Your email will never be shown publicly'
              : 'By continuing, you agree to receive occasional updates about Lowther.'
            }
          </p>
        </div>
      </div>
    </div>
  );

  // Render via portal to document.body so it persists through parent re-renders
  return createPortal(modalContent, document.body);
}
