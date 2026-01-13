'use client';

import { useState } from 'react';
import { X, Mail, ArrowRight, Loader2, User } from 'lucide-react';
import { useAuth } from '@/contexts/auth-context';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export function AuthModal({ isOpen, onClose, onSuccess }: AuthModalProps) {
  const { signIn, verifyCode, setUsername } = useAuth();
  const [step, setStep] = useState<'email' | 'code' | 'username'>('email');
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [username, setUsernameValue] = useState('');
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
      // Check if this is a new user who needs to set a username
      if (result.needsUsername) {
        setStep('username');
      } else {
        onSuccess?.();
        handleClose();
      }
    } else {
      setError(result.error || 'Invalid code');
    }
  };

  const handleSubmitUsername = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate username
    const trimmedUsername = username.trim();
    if (trimmedUsername.length < 3) {
      setError('Username must be at least 3 characters');
      return;
    }
    if (trimmedUsername.length > 20) {
      setError('Username must be 20 characters or less');
      return;
    }
    if (!/^[a-zA-Z0-9_]+$/.test(trimmedUsername)) {
      setError('Username can only contain letters, numbers, and underscores');
      return;
    }
    
    setLoading(true);
    setError(null);

    const result = await setUsername(trimmedUsername);

    setLoading(false);
    if (result.success) {
      onSuccess?.();
      handleClose();
    } else {
      setError(result.error || 'Username not available');
    }
  };

  const handleClose = () => {
    onClose();
    // Reset after animation
    setTimeout(() => {
      setStep('email');
      setEmail('');
      setCode('');
      setUsernameValue('');
      setError(null);
    }, 300);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-fade-in"
        onClick={handleClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-md animate-slide-up">
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
              {step === 'username' ? (
                <User className="h-6 w-6 text-neutral-600" />
              ) : (
                <Mail className="h-6 w-6 text-neutral-600" />
              )}
            </div>
            <h2 className="font-hvmuse text-xl text-neutral-900">
              {step === 'email' && 'Join the Conversation'}
              {step === 'code' && 'Check Your Email'}
              {step === 'username' && 'Choose a Username'}
            </h2>
            <p className="mt-2 font-sarabun text-sm text-neutral-500">
              {step === 'email' && 'Enter your email to sign in and share your thoughts'}
              {step === 'code' && `We sent a 6-digit code to ${email}`}
              {step === 'username' && 'This will be displayed publicly with your comments'}
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

          {/* Username Form */}
          {step === 'username' && (
            <form onSubmit={handleSubmitUsername}>
              <div className="mb-4">
                <label htmlFor="username" className="sr-only">
                  Username
                </label>
                <input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => {
                    setUsernameValue(e.target.value.replace(/[^a-zA-Z0-9_]/g, ''));
                    setError(null);
                  }}
                  placeholder="YourUsername"
                  required
                  autoFocus
                  maxLength={20}
                  className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-3 font-sarabun text-neutral-900 placeholder:text-neutral-400 focus:border-neutral-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-neutral-200"
                />
                <p className="mt-2 font-sarabun text-xs text-neutral-400">
                  3-20 characters. Letters, numbers, and underscores only.
                </p>
              </div>

              {error && (
                <p className="mb-4 text-center font-sarabun text-sm text-red-600">
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={loading || username.length < 3}
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
            {step === 'username' 
              ? 'Your email will never be shown publicly'
              : 'By continuing, you agree to receive occasional updates about Lowther.'
            }
          </p>
        </div>
      </div>
    </div>
  );
}
