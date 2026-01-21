'use client';

import { useState, useEffect } from 'react';
import { X, User, Mail, MapPin, Lock, Eye, EyeOff, Loader2, Check, Globe } from 'lucide-react';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
  profile: {
    id: string;
    email: string;
    displayName: string | null;
    fullName: string | null;
    address: string | null;
    country: string | null;
    level: string;
  } | null;
}

export function ProfileModal({ isOpen, onClose, onSave, profile }: ProfileModalProps) {
  const [fullName, setFullName] = useState('');
  const [address, setAddress] = useState('');
  const [country, setCountry] = useState('');
  const [showPasswordSection, setShowPasswordSection] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [hasPassword, setHasPassword] = useState(false);

  // Initialize form when profile loads
  useEffect(() => {
    if (profile) {
      setFullName(profile.fullName || '');
      setAddress(profile.address || '');
      setCountry(profile.country || '');
    }
  }, [profile]);

  // Check if user has password set
  useEffect(() => {
    if (isOpen && profile) {
      checkPasswordStatus();
    }
  }, [isOpen, profile]);

  const checkPasswordStatus = async () => {
    try {
      const response = await fetch('/api/account/has-password');
      if (response.ok) {
        const data = await response.json();
        setHasPassword(data.hasPassword);
      }
    } catch (error) {
      console.error('Failed to check password status:', error);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setError(null);

    try {
      // Validate password if being set
      if (showPasswordSection && newPassword) {
        if (newPassword.length < 8) {
          setError('Password must be at least 8 characters');
          setSaving(false);
          return;
        }
        if (newPassword !== confirmPassword) {
          setError('Passwords do not match');
          setSaving(false);
          return;
        }
      }

      const response = await fetch('/api/account/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: fullName.trim() || null,
          address: address.trim() || null,
          country: country.trim() || null,
          password: showPasswordSection && newPassword ? newPassword : undefined,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to save profile');
      }

      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        onSave();
      }, 1000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save profile');
    } finally {
      setSaving(false);
    }
  };

  const handleClose = () => {
    setShowPasswordSection(false);
    setNewPassword('');
    setConfirmPassword('');
    setError(null);
    setSuccess(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm"
        onClick={handleClose}
      />
      
      {/* Modal */}
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-neutral-100">
          <h2 className="font-hvmuse text-xl text-neutral-900">Update Profile Details</h2>
          <button
            onClick={handleClose}
            className="rounded-full p-2 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-600 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Avatar placeholder */}
          <div className="flex flex-col items-center">
            <div className="relative">
              <div className="h-20 w-20 rounded-full bg-gradient-to-br from-amber-200 to-amber-400 flex items-center justify-center">
                <span className="font-hvmuse text-2xl text-white">
                  {(fullName || profile?.displayName || 'L').charAt(0).toUpperCase()}
                </span>
              </div>
            </div>
            <p className="mt-2 font-sarabun text-xs uppercase tracking-wider text-neutral-400">
              Update Portrait
            </p>
          </div>

          {/* Form Fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Full Name */}
            <div>
              <label className="block font-sarabun text-xs uppercase tracking-wider text-neutral-400 mb-2">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Alexander Lowther"
                  className="w-full rounded-lg border border-neutral-200 bg-neutral-50 pl-10 pr-4 py-3 font-sarabun text-sm text-neutral-900 placeholder:text-neutral-400 focus:border-neutral-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-neutral-200"
                />
              </div>
            </div>

            {/* Email (read-only) */}
            <div>
              <label className="block font-sarabun text-xs uppercase tracking-wider text-neutral-400 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
                <input
                  type="email"
                  value={profile?.email || ''}
                  disabled
                  className="w-full rounded-lg border border-neutral-200 bg-neutral-100 pl-10 pr-4 py-3 font-sarabun text-sm text-neutral-500 cursor-not-allowed"
                />
              </div>
            </div>
          </div>

          {/* Country */}
          <div>
            <label className="block font-sarabun text-xs uppercase tracking-wider text-neutral-400 mb-2">
              Country
            </label>
            <div className="relative">
              <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
              <input
                type="text"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                placeholder="United Kingdom"
                className="w-full rounded-lg border border-neutral-200 bg-neutral-50 pl-10 pr-4 py-3 font-sarabun text-sm text-neutral-900 placeholder:text-neutral-400 focus:border-neutral-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-neutral-200"
              />
            </div>
          </div>

          {/* Address */}
          <div>
            <label className="block font-sarabun text-xs uppercase tracking-wider text-neutral-400 mb-2">
              Preferred Shipping Address
            </label>
            <div className="relative">
              <MapPin className="absolute left-3 top-3 h-4 w-4 text-neutral-400" />
              <textarea
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="123 Berkeley Square, London, W1J 6BQ"
                rows={3}
                className="w-full rounded-lg border border-neutral-200 bg-neutral-50 pl-10 pr-4 py-3 font-sarabun text-sm text-neutral-900 placeholder:text-neutral-400 focus:border-neutral-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-neutral-200 resize-none"
              />
            </div>
          </div>

          {/* Account Security Section */}
          <div className="border-t border-neutral-100 pt-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Lock className="h-4 w-4 text-neutral-500" />
                <span className="font-sarabun text-sm font-medium text-neutral-700">Account Security</span>
              </div>
              <span className="px-2 py-1 rounded text-xs font-medium bg-neutral-100 text-neutral-500">
                {hasPassword ? 'PASSWORD SET' : 'MAGIC LINK ONLY'}
              </span>
            </div>

            {!showPasswordSection ? (
              <button
                onClick={() => setShowPasswordSection(true)}
                className="w-full flex items-center justify-center gap-2 rounded-lg border border-neutral-200 bg-white py-3 font-sarabun text-sm text-neutral-600 hover:bg-neutral-50 transition-colors"
              >
                <Lock className="h-4 w-4" />
                {hasPassword ? 'Change Password' : 'Add a Password (Optional)'}
              </button>
            ) : (
              <div className="space-y-4">
                {/* New Password */}
                <div>
                  <label className="block font-sarabun text-xs uppercase tracking-wider text-neutral-400 mb-2">
                    {hasPassword ? 'New Password' : 'Create Password'}
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="At least 8 characters"
                      className="w-full rounded-lg border border-neutral-200 bg-neutral-50 pl-10 pr-12 py-3 font-sarabun text-sm text-neutral-900 placeholder:text-neutral-400 focus:border-neutral-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-neutral-200"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                {/* Confirm Password */}
                <div>
                  <label className="block font-sarabun text-xs uppercase tracking-wider text-neutral-400 mb-2">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Confirm your password"
                      className="w-full rounded-lg border border-neutral-200 bg-neutral-50 pl-10 pr-4 py-3 font-sarabun text-sm text-neutral-900 placeholder:text-neutral-400 focus:border-neutral-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-neutral-200"
                    />
                  </div>
                </div>

                <button
                  onClick={() => {
                    setShowPasswordSection(false);
                    setNewPassword('');
                    setConfirmPassword('');
                  }}
                  className="font-sarabun text-xs text-neutral-500 hover:text-neutral-700"
                >
                  Cancel password change
                </button>
              </div>
            )}
          </div>

          {/* Error message */}
          {error && (
            <div className="p-3 rounded-lg bg-red-50 text-red-700 text-sm">
              {error}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex gap-3 p-6 border-t border-neutral-100">
          <button
            onClick={handleClose}
            className="flex-1 rounded-lg border border-neutral-200 bg-white py-3 font-sarabun text-sm font-medium text-neutral-600 hover:bg-neutral-50 transition-colors"
          >
            Discard
          </button>
          <button
            onClick={handleSave}
            disabled={saving || success}
            className="flex-1 flex items-center justify-center gap-2 rounded-lg bg-neutral-900 py-3 font-sarabun text-sm font-medium text-white hover:bg-neutral-800 transition-colors disabled:opacity-50"
          >
            {saving ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : success ? (
              <>
                <Check className="h-4 w-4" />
                Saved!
              </>
            ) : (
              'Save Profile'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
