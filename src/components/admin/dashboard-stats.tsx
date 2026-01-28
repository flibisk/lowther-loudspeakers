'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
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
  Loader2,
  Globe,
  ChevronRight,
  X,
  FileText
} from 'lucide-react';

interface DashboardData {
  totalPageViews: number;
  newUsers: number;
  totalUsers: number;
  catalogueDownloads: number;
  planDownloads: number;
  topPages: { path: string; count: number }[];
  topProducts: { handle: string; count: number }[];
  topCountries: { country: string; count: number }[];
  topUser: { email: string; displayName: string | null; eventCount: number; id: string } | null;
  eventBreakdown: { type: string; count: number }[];
}

interface EventDetailItem {
  id: string;
  title: string;
  count: number;
  users: { email: string | null; displayName: string | null }[];
  lastOccurred: string;
}

interface EventDetails {
  eventType: string;
  totalCount: number;
  items: EventDetailItem[];
  label: string;
}

export function DashboardStats() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const range = searchParams.get('range') || '7d';
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [eventDetails, setEventDetails] = useState<EventDetails | null>(null);
  const [loadingDetails, setLoadingDetails] = useState(false);

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

  const fetchEventDetails = async (eventType: string) => {
    // Only fetch details for events that have meaningful drill-down data
    const drilldownTypes = [
      'DOWNLOAD_BROCHURE', 'DOWNLOAD_PLAN', 'VIDEO_PLAY', 
      'FORM_SUBMIT', 'CTA_CLICK', 'PRODUCT_VIEW', 'PRODUCT_REVISIT',
      'ENQUIRY_START', 'ENQUIRY_SUBMIT'
    ];
    
    if (!drilldownTypes.includes(eventType)) {
      return; // No drill-down for PAGE_VIEW, ADD_TO_CART, etc.
    }

    setLoadingDetails(true);
    try {
      const response = await fetch(`/api/admin/events/${eventType}?range=${range}`);
      if (response.ok) {
        const result = await response.json();
        setEventDetails(result);
      }
    } catch (err) {
      console.error('Failed to load event details:', err);
    } finally {
      setLoadingDetails(false);
    }
  };

  const closeEventDetails = () => {
    setEventDetails(null);
  };

  const navigateToPage = (path: string) => {
    // Navigate to Page Views with the path selected
    router.push(`/admin/pages?selected=${encodeURIComponent(path)}`);
  };

  const navigateToProduct = (handle: string) => {
    // Navigate to Page Views filtered by product
    // Products can be at various paths, so search for the handle
    router.push(`/admin/pages?product=${encodeURIComponent(handle)}`);
  };

  const navigateToUser = (userId: string) => {
    router.push(`/admin/users?selected=${userId}`);
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
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <StatCard
          label="Page Views"
          value={data.totalPageViews.toLocaleString()}
          icon={Eye}
          color="blue"
          onClick={() => router.push('/admin/pages')}
        />
        <StatCard
          label="New Users"
          value={data.newUsers.toLocaleString()}
          icon={UserCheck}
          color="green"
          onClick={() => router.push('/admin/users')}
        />
        <StatCard
          label="Total Users"
          value={data.totalUsers.toLocaleString()}
          icon={Users}
          color="purple"
          onClick={() => router.push('/admin/users')}
        />
        <StatCard
          label="Catalogue Downloads"
          value={data.catalogueDownloads.toLocaleString()}
          icon={FileDown}
          color="amber"
          onClick={() => fetchEventDetails('DOWNLOAD_BROCHURE')}
        />
        <StatCard
          label="Plan Downloads"
          value={data.planDownloads.toLocaleString()}
          icon={FileText}
          color="amber"
          onClick={() => fetchEventDetails('DOWNLOAD_PLAN')}
        />
        <StatCard
          label="Top User"
          value={data.topUser?.eventCount.toLocaleString() || '0'}
          subtitle={data.topUser?.displayName || data.topUser?.email || 'No data'}
          icon={TrendingUp}
          color="blue"
          onClick={data.topUser ? () => navigateToUser(data.topUser!.id) : undefined}
        />
      </div>

      {/* Event Breakdown & Top Pages */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Event Breakdown */}
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h3 className="font-hvmuse text-lg text-neutral-900 mb-4">Event Breakdown</h3>
          <div className="space-y-2">
            {data.eventBreakdown.length > 0 ? (
              data.eventBreakdown.map((event) => {
                const isClickable = [
                  'DOWNLOAD_BROCHURE', 'DOWNLOAD_PLAN', 'VIDEO_PLAY', 
                  'FORM_SUBMIT', 'CTA_CLICK', 'PRODUCT_VIEW', 'PRODUCT_REVISIT',
                  'ENQUIRY_START', 'ENQUIRY_SUBMIT'
                ].includes(event.type);
                
                return (
                  <button
                    key={event.type}
                    onClick={() => isClickable && fetchEventDetails(event.type)}
                    disabled={!isClickable}
                    className={`w-full flex items-center justify-between p-2 rounded-lg transition-colors ${
                      isClickable 
                        ? 'hover:bg-neutral-50 cursor-pointer' 
                        : 'cursor-default'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <EventIcon type={event.type} />
                      <span className="text-sm text-neutral-600">
                        {formatEventType(event.type)}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-neutral-900">
                        {event.count.toLocaleString()}
                      </span>
                      {isClickable && (
                        <ChevronRight className="h-4 w-4 text-neutral-300" />
                      )}
                    </div>
                  </button>
                );
              })
            ) : (
              <p className="text-sm text-neutral-500">No events recorded yet</p>
            )}
          </div>
        </div>

        {/* Top Pages */}
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-hvmuse text-lg text-neutral-900">Top Pages</h3>
            <button 
              onClick={() => router.push('/admin/pages')}
              className="text-xs text-amber-600 hover:text-amber-700 flex items-center gap-1"
            >
              View all <ChevronRight className="h-3 w-3" />
            </button>
          </div>
          <div className="space-y-2">
            {data.topPages.length > 0 ? (
              data.topPages.map((page, i) => (
                <button
                  key={page.path}
                  onClick={() => navigateToPage(page.path)}
                  className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-neutral-50 transition-colors text-left"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-medium text-neutral-400 w-6">
                      {i + 1}.
                    </span>
                    <span className="text-sm text-neutral-600 truncate max-w-[200px]">
                      {formatPath(page.path)}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-neutral-900">
                      {page.count.toLocaleString()}
                    </span>
                    <ChevronRight className="h-4 w-4 text-neutral-300" />
                  </div>
                </button>
              ))
            ) : (
              <p className="text-sm text-neutral-500">No page views recorded yet</p>
            )}
          </div>
        </div>
      </div>

      {/* Top Products & Countries */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Products */}
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h3 className="font-hvmuse text-lg text-neutral-900 mb-4">Top Products</h3>
          <div className="space-y-2">
            {data.topProducts.length > 0 ? (
              data.topProducts.map((product, i) => (
                <button
                  key={product.handle}
                  onClick={() => navigateToProduct(product.handle)}
                  className="w-full flex items-center gap-3 p-3 rounded-lg bg-neutral-50 hover:bg-neutral-100 transition-colors text-left"
                >
                  <span className="flex items-center justify-center h-8 w-8 rounded-full bg-amber-100 text-amber-700 text-sm font-medium flex-shrink-0">
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
                  <ChevronRight className="h-4 w-4 text-neutral-300 flex-shrink-0" />
                </button>
              ))
            ) : (
              <p className="text-sm text-neutral-500">No product views recorded yet</p>
            )}
          </div>
        </div>

        {/* Top Countries */}
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h3 className="font-hvmuse text-lg text-neutral-900 mb-4 flex items-center gap-2">
            <Globe className="h-5 w-5 text-neutral-400" />
            Top Countries
          </h3>
          <div className="space-y-2">
            {data.topCountries && data.topCountries.length > 0 ? (
              data.topCountries.map((country, i) => (
                <div
                  key={country.country}
                  className="flex items-center gap-3 p-3 rounded-lg bg-neutral-50"
                >
                  <span className="flex items-center justify-center h-8 w-8 rounded-full bg-blue-100 text-blue-700 text-sm font-medium flex-shrink-0">
                    {i + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-neutral-900">
                      {country.country}
                    </p>
                    <p className="text-xs text-neutral-500">
                      {country.count.toLocaleString()} visits
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-neutral-500">
                Country data will appear as visitors browse the site
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Event Details Modal */}
      {(eventDetails || loadingDetails) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div 
            className="fixed inset-0 bg-black/50 backdrop-blur-sm"
            onClick={closeEventDetails}
          />
          <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl max-h-[80vh] overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-neutral-100">
              <div className="flex items-center gap-3">
                {eventDetails && <EventIcon type={eventDetails.eventType} />}
                <div>
                  <h2 className="font-hvmuse text-xl text-neutral-900">
                    {eventDetails ? formatEventType(eventDetails.eventType) : 'Loading...'}
                  </h2>
                  {eventDetails && (
                    <p className="text-sm text-neutral-500">
                      {eventDetails.totalCount.toLocaleString()} total events
                    </p>
                  )}
                </div>
              </div>
              <button
                onClick={closeEventDetails}
                className="rounded-full p-2 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-600 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 overflow-y-auto max-h-[60vh]">
              {loadingDetails ? (
                <div className="flex items-center justify-center py-10">
                  <Loader2 className="h-8 w-8 animate-spin text-neutral-400" />
                </div>
              ) : eventDetails && eventDetails.items.length > 0 ? (
                <div className="space-y-3">
                  {eventDetails.items.map((item, i) => (
                    <div
                      key={item.id}
                      className="flex items-start gap-4 p-4 rounded-lg bg-neutral-50"
                    >
                      <span className="flex items-center justify-center h-8 w-8 rounded-full bg-amber-100 text-amber-700 text-sm font-medium flex-shrink-0">
                        {i + 1}
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-neutral-900">
                          {item.title}
                        </p>
                        <div className="flex items-center gap-4 mt-1 text-xs text-neutral-500">
                          <span>{item.count} downloads</span>
                          <span>Last: {new Date(item.lastOccurred).toLocaleDateString()}</span>
                        </div>
                        {item.users.length > 0 && (
                          <div className="mt-2 flex flex-wrap gap-1">
                            {item.users.slice(0, 5).map((user, idx) => (
                              <span 
                                key={idx}
                                className="px-2 py-0.5 rounded-full bg-neutral-200 text-xs text-neutral-600"
                              >
                                {user.displayName || user.email || 'Anonymous'}
                              </span>
                            ))}
                            {item.users.length > 5 && (
                              <span className="px-2 py-0.5 rounded-full bg-neutral-200 text-xs text-neutral-600">
                                +{item.users.length - 5} more
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : eventDetails ? (
                <div className="text-center py-10">
                  <FileText className="h-12 w-12 text-neutral-300 mx-auto mb-3" />
                  <p className="text-neutral-500">No detailed data available for this event type</p>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function StatCard({ 
  label, 
  value, 
  subtitle,
  icon: Icon, 
  color,
  onClick
}: { 
  label: string; 
  value: string; 
  subtitle?: string;
  icon: any; 
  color: 'blue' | 'green' | 'purple' | 'amber';
  onClick?: () => void;
}) {
  const colorClasses = {
    blue: 'bg-blue-50 text-blue-600',
    green: 'bg-green-50 text-green-600',
    purple: 'bg-purple-50 text-purple-600',
    amber: 'bg-amber-50 text-amber-600',
  };

  const Component = onClick ? 'button' : 'div';

  return (
    <Component 
      className={`bg-white rounded-xl p-6 shadow-sm text-left w-full ${
        onClick ? 'hover:shadow-md transition-shadow cursor-pointer' : ''
      }`}
      onClick={onClick}
    >
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
    </Component>
  );
}

function EventIcon({ type }: { type: string }) {
  const icons: Record<string, any> = {
    PAGE_VIEW: Eye,
    CTA_CLICK: MousePointer,
    VIDEO_PLAY: Play,
    DOWNLOAD_BROCHURE: FileDown,
    DOWNLOAD_PLAN: FileText,
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
  // Custom labels for better readability
  const labels: Record<string, string> = {
    'DOWNLOAD_BROCHURE': 'Catalogue Download',
    'DOWNLOAD_PLAN': 'Plan Download',
    'PAGE_VIEW': 'Page Views',
    'PRODUCT_VIEW': 'Product Views',
    'PRODUCT_REVISIT': 'Product Revisits',
    'CTA_CLICK': 'CTA Clicks',
    'VIDEO_PLAY': 'Video Plays',
    'FORM_SUBMIT': 'Form Submissions',
    'ADD_TO_CART': 'Add to Cart',
    'BEGIN_CHECKOUT': 'Begin Checkout',
    'TRUST_YOUR_EARS_VOTE': 'Album Votes',
    'ENQUIRY_START': 'Enquiry Started',
    'ENQUIRY_SUBMIT': 'Enquiry Submitted',
    'BLOG_DEEP_READ': 'Blog Deep Reads',
  };
  
  return labels[type] || type
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

function formatPath(path: string): string {
  if (path === '/') return 'Homepage';
  return path
    .replace(/^\//, '')
    .replace(/-/g, ' ')
    .replace(/\//g, ' → ');
}
