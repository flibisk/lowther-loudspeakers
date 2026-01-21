'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { 
  Eye, 
  Users, 
  ShoppingCart, 
  TrendingUp,
  FileDown,
  Play,
  MousePointer,
  Package,
  UserCheck,
  Loader2
} from 'lucide-react';

interface DashboardData {
  totalPageViews: number;
  newUsers: number;
  totalUsers: number;
  topPages: { path: string; count: number }[];
  topProducts: { handle: string; count: number }[];
  topUser: { email: string; displayName: string | null; eventCount: number } | null;
  eventBreakdown: { type: string; count: number }[];
}

export function DashboardStats() {
  const searchParams = useSearchParams();
  const range = searchParams.get('range') || '7d';
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchStats();
  }, [range]);

  const fetchStats = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/admin/stats?range=${range}`);
      if (response.ok) {
        const result = await response.json();
        setData(result);
      } else {
        setError('Failed to load stats');
      }
    } catch (err) {
      setError('Failed to load stats');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-neutral-400" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="text-center py-20">
        <p className="text-neutral-500">{error || 'No data available'}</p>
        <p className="text-sm text-neutral-400 mt-2">
          Start tracking events to see analytics here.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          label="Total Page Views"
          value={data.totalPageViews.toLocaleString()}
          icon={Eye}
          color="blue"
        />
        <StatCard
          label="New Users"
          value={data.newUsers.toLocaleString()}
          icon={UserCheck}
          color="green"
        />
        <StatCard
          label="Total Users"
          value={data.totalUsers.toLocaleString()}
          icon={Users}
          color="purple"
        />
        <StatCard
          label="Top User Events"
          value={data.topUser?.eventCount.toLocaleString() || '0'}
          subtitle={data.topUser?.displayName || data.topUser?.email || 'No data'}
          icon={TrendingUp}
          color="amber"
        />
      </div>

      {/* Event Breakdown & Top Pages */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Event Breakdown */}
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h3 className="font-hvmuse text-lg text-neutral-900 mb-4">Event Breakdown</h3>
          <div className="space-y-3">
            {data.eventBreakdown.length > 0 ? (
              data.eventBreakdown.map((event) => (
                <div key={event.type} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <EventIcon type={event.type} />
                    <span className="text-sm text-neutral-600">
                      {formatEventType(event.type)}
                    </span>
                  </div>
                  <span className="text-sm font-medium text-neutral-900">
                    {event.count.toLocaleString()}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-sm text-neutral-500">No events recorded yet</p>
            )}
          </div>
        </div>

        {/* Top Pages */}
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h3 className="font-hvmuse text-lg text-neutral-900 mb-4">Top Pages</h3>
          <div className="space-y-3">
            {data.topPages.length > 0 ? (
              data.topPages.map((page, i) => (
                <div key={page.path} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-medium text-neutral-400 w-6">
                      {i + 1}.
                    </span>
                    <span className="text-sm text-neutral-600 truncate max-w-[250px]">
                      {page.path}
                    </span>
                  </div>
                  <span className="text-sm font-medium text-neutral-900">
                    {page.count.toLocaleString()}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-sm text-neutral-500">No page views recorded yet</p>
            )}
          </div>
        </div>
      </div>

      {/* Top Products */}
      <div className="bg-white rounded-xl p-6 shadow-sm">
        <h3 className="font-hvmuse text-lg text-neutral-900 mb-4">Top Products</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {data.topProducts.length > 0 ? (
            data.topProducts.map((product, i) => (
              <div 
                key={product.handle} 
                className="flex items-center gap-3 p-3 rounded-lg bg-neutral-50"
              >
                <span className="flex items-center justify-center h-8 w-8 rounded-full bg-amber-100 text-amber-700 text-sm font-medium">
                  {i + 1}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-neutral-900 truncate">
                    {formatProductHandle(product.handle)}
                  </p>
                  <p className="text-xs text-neutral-500">
                    {product.count.toLocaleString()} views
                  </p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-sm text-neutral-500 col-span-3">No product views recorded yet</p>
          )}
        </div>
      </div>
    </div>
  );
}

function StatCard({ 
  label, 
  value, 
  subtitle,
  icon: Icon, 
  color 
}: { 
  label: string; 
  value: string; 
  subtitle?: string;
  icon: any; 
  color: 'blue' | 'green' | 'purple' | 'amber';
}) {
  const colorClasses = {
    blue: 'bg-blue-50 text-blue-600',
    green: 'bg-green-50 text-green-600',
    purple: 'bg-purple-50 text-purple-600',
    amber: 'bg-amber-50 text-amber-600',
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm text-neutral-500">{label}</span>
        <div className={`p-2 rounded-lg ${colorClasses[color]}`}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
      <p className="text-3xl font-hvmuse text-neutral-900">{value}</p>
      {subtitle && (
        <p className="text-xs text-neutral-500 mt-1 truncate">{subtitle}</p>
      )}
    </div>
  );
}

function EventIcon({ type }: { type: string }) {
  const icons: Record<string, any> = {
    PAGE_VIEW: Eye,
    CTA_CLICK: MousePointer,
    VIDEO_PLAY: Play,
    DOWNLOAD_BROCHURE: FileDown,
    FORM_SUBMIT: Users,
    PRODUCT_VIEW: Package,
    ADD_TO_CART: ShoppingCart,
    BEGIN_CHECKOUT: ShoppingCart,
    TRUST_YOUR_EARS_VOTE: TrendingUp,
    ENQUIRY_START: Users,
    ENQUIRY_SUBMIT: UserCheck,
    PRODUCT_REVISIT: Eye,
    BLOG_DEEP_READ: Eye,
  };
  
  const Icon = icons[type] || Eye;
  return <Icon className="h-4 w-4 text-neutral-400" />;
}

function formatEventType(type: string): string {
  return type
    .split('_')
    .map(word => word.charAt(0) + word.slice(1).toLowerCase())
    .join(' ');
}

function formatProductHandle(handle: string): string {
  return handle
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}
