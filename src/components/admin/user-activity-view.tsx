'use client';

import { useEffect, useState } from 'react';
import { 
  Loader2, 
  Eye, 
  ShoppingCart, 
  FileDown, 
  Play, 
  MousePointer, 
  Package,
  Users,
  TrendingUp
} from 'lucide-react';

interface UserEvent {
  id: string;
  eventType: string;
  eventData: any;
  path: string;
  timestamp: string;
}

interface TopInterest {
  name: string;
  count: number;
  type: 'product' | 'collection';
}

interface ActivityData {
  events: UserEvent[];
  topInterests: TopInterest[];
  totalEvents: number;
}

interface UserActivityViewProps {
  userId: string;
  userEmail: string;
}

export function UserActivityView({ userId, userEmail }: UserActivityViewProps) {
  const [data, setData] = useState<ActivityData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchActivity();
  }, [userId]);

  const fetchActivity = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/admin/users/${userId}/activity`);
      if (response.ok) {
        const result = await response.json();
        setData(result);
      }
    } catch (error) {
      console.error('Failed to fetch activity:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl p-8 shadow-sm flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-neutral-400" />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="bg-white rounded-xl p-8 shadow-sm text-center">
        <p className="text-neutral-500">Failed to load activity</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Top Interests */}
      {data.topInterests.length > 0 && (
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <h3 className="font-medium text-neutral-900 mb-3">Top Interests</h3>
          <div className="flex flex-wrap gap-2">
            {data.topInterests.map((interest, i) => (
              <span
                key={i}
                className={`px-3 py-1 rounded-full text-sm ${
                  interest.type === 'product'
                    ? 'bg-amber-100 text-amber-700'
                    : 'bg-blue-100 text-blue-700'
                }`}
              >
                {interest.name} ({interest.count})
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Activity Feed */}
      <div className="bg-white rounded-xl p-4 shadow-sm">
        <h3 className="font-medium text-neutral-900 mb-3">
          Recent Activity ({data.totalEvents} total)
        </h3>
        
        {data.events.length === 0 ? (
          <p className="text-sm text-neutral-500">No activity recorded</p>
        ) : (
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {data.events.map((event) => (
              <div 
                key={event.id} 
                className="flex items-start gap-3 p-3 rounded-lg bg-neutral-50"
              >
                <div className="p-2 rounded-lg bg-white">
                  <EventIcon type={event.eventType} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-neutral-900">
                    {formatEventType(event.eventType)}
                  </p>
                  <p className="text-xs text-neutral-500 truncate">
                    {event.path}
                  </p>
                  {event.eventData && (
                    <p className="text-xs text-amber-600 mt-1">
                      {formatEventData(event.eventData)}
                    </p>
                  )}
                </div>
                <span className="text-xs text-neutral-400 whitespace-nowrap">
                  {formatTimestamp(event.timestamp)}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
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
    ENQUIRY_SUBMIT: Users,
    PRODUCT_REVISIT: Eye,
    BLOG_DEEP_READ: Eye,
  };
  
  const Icon = icons[type] || Eye;
  return <Icon className="h-4 w-4 text-neutral-500" />;
}

function formatEventType(type: string): string {
  return type
    .split('_')
    .map(word => word.charAt(0) + word.slice(1).toLowerCase())
    .join(' ');
}

function formatEventData(data: any): string {
  if (data.productHandle) return `Product: ${data.productHandle}`;
  if (data.collection) return `Collection: ${data.collection}`;
  if (data.formType) return `Form: ${data.formType}`;
  return '';
}

function formatTimestamp(timestamp: string): string {
  const date = new Date(timestamp);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  
  if (diff < 60000) return 'Just now';
  if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
  if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
  if (diff < 604800000) return `${Math.floor(diff / 86400000)}d ago`;
  
  return date.toLocaleDateString();
}
