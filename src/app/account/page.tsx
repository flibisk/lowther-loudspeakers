'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/auth-context';
import { AuthModal } from '@/components/trust-your-ears/auth-modal';
import { ProfileModal } from '@/components/account/profile-modal';
import { EquipmentSection } from '@/components/account/equipment-section';
import { RecommendationsSection } from '@/components/account/recommendations-section';
import { 
  LogOut, 
  Heart, 
  Package, 
  MapPin, 
  HelpCircle,
  ChevronRight,
  Mail,
  MapPinned,
  Pencil
} from 'lucide-react';

interface UserProfile {
  id: string;
  email: string;
  displayName: string | null;
  fullName: string | null;
  address: string | null;
  level: 'ENTHUSIAST' | 'ADVOCATE' | 'AMBASSADOR';
}

const levelConfig = {
  ENTHUSIAST: { label: 'Enthusiast Level', color: 'bg-amber-100 text-amber-800' },
  ADVOCATE: { label: 'Advocate Level', color: 'bg-blue-100 text-blue-800' },
  AMBASSADOR: { label: 'Ambassador Level', color: 'bg-purple-100 text-purple-800' },
};

export default function AccountPage() {
  const { user, loading: authLoading, signOut } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loadingProfile, setLoadingProfile] = useState(false);

  const shopifyAccountUrl = process.env.NEXT_PUBLIC_SHOP_URL 
    ? `${process.env.NEXT_PUBLIC_SHOP_URL}/account`
    : 'https://shop.lowtherloudspeakers.com/account';

  // Fetch full profile when user is authenticated
  useEffect(() => {
    if (user) {
      fetchProfile();
    }
  }, [user]);

  const fetchProfile = async () => {
    setLoadingProfile(true);
    try {
      const response = await fetch('/api/account/profile');
      if (response.ok) {
        const data = await response.json();
        setProfile(data.user);
      }
    } catch (error) {
      console.error('Failed to fetch profile:', error);
    } finally {
      setLoadingProfile(false);
    }
  };

  const handleLogout = async () => {
    await signOut();
    setProfile(null);
  };

  const handleProfileUpdate = () => {
    fetchProfile();
    setShowProfileModal(false);
  };

  // Show loading state
  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#faf9f7] pt-32 pb-16">
        <div className="max-w-3xl mx-auto px-4">
          <div className="flex items-center justify-center py-20">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-neutral-200 border-t-neutral-600" />
          </div>
        </div>
      </div>
    );
  }

  // Show sign-in prompt if not authenticated
  if (!user) {
    return (
      <>
        <div className="min-h-screen bg-[#faf9f7] pt-32 pb-16">
          <div className="max-w-3xl mx-auto px-4">
            <div className="text-center py-20">
              <h1 className="font-hvmuse text-3xl text-neutral-900 mb-4">Your Account</h1>
              <p className="font-sarabun text-neutral-600 mb-8">
                Sign in to access your account, manage your Lowther collection, and more.
              </p>
              <button
                onClick={() => setShowAuthModal(true)}
                className="inline-flex items-center gap-2 rounded-lg bg-neutral-900 px-6 py-3 font-sarabun text-sm font-medium text-white transition-colors hover:bg-neutral-800"
              >
                Sign In
              </button>
            </div>
          </div>
        </div>
        <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
      </>
    );
  }

  const displayName = profile?.fullName || profile?.displayName || 'Lowther Member';
  const level = profile?.level || 'ENTHUSIAST';
  const levelInfo = levelConfig[level];

  return (
    <>
      <div className="min-h-screen bg-[#faf9f7] pt-28 pb-16">
        <div className="max-w-3xl mx-auto px-4">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <h1 className="font-hvmuse text-2xl sm:text-3xl text-neutral-900">Your Account</h1>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 font-sarabun text-sm text-neutral-500 hover:text-neutral-700 transition-colors"
            >
              <LogOut className="h-4 w-4" />
              Sign Out
            </button>
          </div>

          {/* Profile Card */}
          <div className="bg-white rounded-2xl p-6 shadow-sm ring-1 ring-black/5 mb-6">
            <div className="flex items-start gap-4 sm:gap-6">
              {/* Avatar placeholder - could be initials or default image */}
              <div className="relative shrink-0">
                <div className="h-20 w-20 sm:h-24 sm:w-24 rounded-full bg-gradient-to-br from-amber-200 to-amber-400 flex items-center justify-center">
                  <span className="font-hvmuse text-2xl sm:text-3xl text-white">
                    {displayName.charAt(0).toUpperCase()}
                  </span>
                </div>
              </div>

              {/* Profile Info */}
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <h2 className="font-hvmuse text-xl sm:text-2xl text-neutral-900 truncate">
                    {displayName}
                  </h2>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${levelInfo.color}`}>
                    {levelInfo.label}
                  </span>
                </div>
                
                <div className="space-y-1 text-sm text-neutral-500">
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-neutral-400" />
                    <span className="truncate">{profile?.email || user.email}</span>
                  </div>
                  {profile?.address && (
                    <div className="flex items-center gap-2">
                      <MapPinned className="h-4 w-4 text-neutral-400" />
                      <span className="truncate">{profile.address}</span>
                    </div>
                  )}
                </div>

                <button
                  onClick={() => setShowProfileModal(true)}
                  className="mt-4 inline-flex items-center gap-1.5 font-sarabun text-xs uppercase tracking-wider text-neutral-500 hover:text-neutral-700 transition-colors"
                >
                  Update Profile Details
                  <Pencil className="h-3 w-3" />
                </button>
              </div>
            </div>
          </div>

          {/* My Lowther Collection */}
          <EquipmentSection userId={user.id} />

          {/* Trust Your Ears Recommendations */}
          <RecommendationsSection userId={user.id} />

          {/* Account Management */}
          <div className="mb-6">
            <h3 className="font-sarabun text-xs uppercase tracking-wider text-neutral-400 mb-3">
              Account Management
            </h3>
            <div className="bg-white rounded-2xl shadow-sm ring-1 ring-black/5 divide-y divide-neutral-100">
              {/* My Wishlist */}
              <Link
                href="/wishlist"
                className="flex items-center justify-between p-4 hover:bg-neutral-50 transition-colors first:rounded-t-2xl"
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-neutral-100">
                    <Heart className="h-5 w-5 text-neutral-500" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-sarabun font-medium text-neutral-900">My Wishlist</span>
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-amber-100 text-amber-700">STORE</span>
                    </div>
                    <p className="font-sarabun text-sm text-neutral-500">Your saved audio setups</p>
                  </div>
                </div>
                <ChevronRight className="h-5 w-5 text-neutral-300" />
              </Link>

              {/* Order History */}
              <a
                href={`${shopifyAccountUrl}/orders`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-4 hover:bg-neutral-50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-neutral-100">
                    <Package className="h-5 w-5 text-neutral-500" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-sarabun font-medium text-neutral-900">Order History</span>
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-amber-100 text-amber-700">STORE</span>
                    </div>
                    <p className="font-sarabun text-sm text-neutral-500">Track, return or buy again</p>
                  </div>
                </div>
                <ChevronRight className="h-5 w-5 text-neutral-300" />
              </a>

              {/* Saved Addresses */}
              <a
                href={`${shopifyAccountUrl}/addresses`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-4 hover:bg-neutral-50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-neutral-100">
                    <MapPin className="h-5 w-5 text-neutral-500" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-sarabun font-medium text-neutral-900">Saved Addresses</span>
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-amber-100 text-amber-700">STORE</span>
                    </div>
                    <p className="font-sarabun text-sm text-neutral-500">Manage shipping & billing</p>
                  </div>
                </div>
                <ChevronRight className="h-5 w-5 text-neutral-300" />
              </a>

              {/* Support & FAQs */}
              <Link
                href="/faq"
                className="flex items-center justify-between p-4 hover:bg-neutral-50 transition-colors last:rounded-b-2xl"
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-neutral-100">
                    <HelpCircle className="h-5 w-5 text-neutral-500" />
                  </div>
                  <div>
                    <span className="font-sarabun font-medium text-neutral-900">Support & FAQs</span>
                    <p className="font-sarabun text-sm text-neutral-500">Get help with your products</p>
                  </div>
                </div>
                <ChevronRight className="h-5 w-5 text-neutral-300" />
              </Link>
            </div>
          </div>

          {/* Need Assistance */}
          <div className="bg-[#faf8f5] rounded-2xl p-8 text-center border border-neutral-200">
            <h3 className="font-hvmuse text-xl text-[#c59862] italic mb-2">
              Need Assistance?
            </h3>
            <p className="font-sarabun text-neutral-600 mb-6">
              Our specialist team is available for any questions regarding<br className="hidden sm:block" />
              your bespoke products or orders.
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center rounded-full border border-neutral-300 bg-white px-6 py-2.5 font-sarabun text-sm text-neutral-700 hover:bg-neutral-50 transition-colors"
            >
              Contact Support
            </Link>
          </div>
        </div>
      </div>

      {/* Profile Modal */}
      <ProfileModal
        isOpen={showProfileModal}
        onClose={() => setShowProfileModal(false)}
        onSave={handleProfileUpdate}
        profile={profile}
      />
    </>
  );
}
