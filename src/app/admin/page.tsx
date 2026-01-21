import { Suspense } from 'react';
import { prisma } from '@/lib/db/prisma';
import { DashboardStats } from '@/components/admin/dashboard-stats';
import { TimeRangeSelector } from '@/components/admin/time-range-selector';

export const dynamic = 'force-dynamic';

export default function AdminDashboard() {
  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-hvmuse text-3xl text-neutral-900">Dashboard</h1>
          <p className="text-neutral-500 mt-1">Overview of your site analytics</p>
        </div>
        <TimeRangeSelector />
      </div>

      <Suspense fallback={<DashboardSkeleton />}>
        <DashboardStats />
      </Suspense>
    </div>
  );
}

function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      {/* Stats cards skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white rounded-xl p-6 shadow-sm animate-pulse">
            <div className="h-4 w-24 bg-neutral-200 rounded mb-2" />
            <div className="h-8 w-16 bg-neutral-200 rounded" />
          </div>
        ))}
      </div>
      
      {/* Charts skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm h-80 animate-pulse">
          <div className="h-4 w-32 bg-neutral-200 rounded mb-4" />
          <div className="h-full bg-neutral-100 rounded" />
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm h-80 animate-pulse">
          <div className="h-4 w-32 bg-neutral-200 rounded mb-4" />
          <div className="h-full bg-neutral-100 rounded" />
        </div>
      </div>
    </div>
  );
}
