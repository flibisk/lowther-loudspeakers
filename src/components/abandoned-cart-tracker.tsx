'use client';

import { useEffect } from 'react';
import { initAbandonedCartTracking } from '@/lib/abandoned-cart';

/**
 * Abandoned Cart Tracker Component
 * Initializes abandoned cart tracking on page load
 */
export function AbandonedCartTracker() {
  useEffect(() => {
    initAbandonedCartTracking();
  }, []);

  return null;
}

