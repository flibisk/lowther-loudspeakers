'use client';

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function AccountPage() {
  const shopifyAccountUrl = process.env.NEXT_PUBLIC_SHOP_URL 
    ? `${process.env.NEXT_PUBLIC_SHOP_URL}/account`
    : 'https://shop.lowtherloudspeakers.com/account';

  return (
    <div className="min-h-screen bg-white pt-32 pb-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-display text-[#c59862] mb-4">
            Your Account
          </h1>
          <p className="text-lg text-gray-600">
            Manage your orders, addresses, and account settings
          </p>
        </div>

        {/* Account Options */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {/* Login/Register */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 hover:shadow-lg transition-shadow">
            <div className="flex items-center mb-4">
              <svg
                className="h-8 w-8 text-[#c59862] mr-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
              <h2 className="text-2xl font-display text-gray-900">Sign In</h2>
            </div>
            <p className="text-gray-600 mb-6">
              Access your account to view orders, manage addresses, and update your preferences.
            </p>
            <a href={shopifyAccountUrl} target="_blank" rel="noopener noreferrer">
              <Button
                size="lg"
                className="w-full bg-black hover:bg-[#c59862] text-white font-sarabun text-xs tracking-[3px] transition-all duration-300 uppercase"
              >
                Go to Account
              </Button>
            </a>
          </div>

          {/* Orders */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 hover:shadow-lg transition-shadow">
            <div className="flex items-center mb-4">
              <svg
                className="h-8 w-8 text-[#c59862] mr-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                />
              </svg>
              <h2 className="text-2xl font-display text-gray-900">Orders</h2>
            </div>
            <p className="text-gray-600 mb-6">
              Track your orders, view order history, and manage returns.
            </p>
            <a href={`${shopifyAccountUrl}/orders`} target="_blank" rel="noopener noreferrer">
              <Button
                size="lg"
                variant="outline"
                className="w-full border-black text-black hover:bg-black hover:text-white font-sarabun text-xs tracking-[3px] transition-all duration-300 uppercase"
              >
                View Orders
              </Button>
            </a>
          </div>

          {/* Addresses */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 hover:shadow-lg transition-shadow">
            <div className="flex items-center mb-4">
              <svg
                className="h-8 w-8 text-[#c59862] mr-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              <h2 className="text-2xl font-display text-gray-900">Addresses</h2>
            </div>
            <p className="text-gray-600 mb-6">
              Manage your shipping and billing addresses for faster checkout.
            </p>
            <a href={`${shopifyAccountUrl}/addresses`} target="_blank" rel="noopener noreferrer">
              <Button
                size="lg"
                variant="outline"
                className="w-full border-black text-black hover:bg-black hover:text-white font-sarabun text-xs tracking-[3px] transition-all duration-300 uppercase"
              >
                Manage Addresses
              </Button>
            </a>
          </div>

          {/* Wishlist */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 hover:shadow-lg transition-shadow">
            <div className="flex items-center mb-4">
              <svg
                className="h-8 w-8 text-[#c59862] mr-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
              </svg>
              <h2 className="text-2xl font-display text-gray-900">Wishlist</h2>
            </div>
            <p className="text-gray-600 mb-6">
              View and manage your saved products and favorites.
            </p>
            <Link href="/wishlist">
              <Button
                size="lg"
                variant="outline"
                className="w-full border-black text-black hover:bg-black hover:text-white font-sarabun text-xs tracking-[3px] transition-all duration-300 uppercase"
              >
                View Wishlist
              </Button>
            </Link>
          </div>
        </div>

        {/* Additional Info */}
        <div className="bg-[#c59862]/10 border border-[#c59862]/20 rounded-lg p-6 text-center">
          <h3 className="text-xl font-display text-gray-900 mb-2">
            Need Assistance?
          </h3>
          <p className="text-gray-600 mb-4">
            Our team is here to help with any questions about your account or orders.
          </p>
          <Link href="/contact">
            <Button
              variant="outline"
              className="border-[#c59862] text-[#c59862] hover:bg-[#c59862] hover:text-white font-sarabun text-xs tracking-[3px] transition-all duration-300 uppercase"
            >
              Contact Support
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

