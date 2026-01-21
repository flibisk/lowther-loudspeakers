'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { 
  Loader2, TrendingUp, Mail, Calendar, Activity, 
  ChevronDown, ChevronUp, Eye, ShoppingCart, Play, 
  FileText, MousePointer, AlertCircle
} from 'lucide-react';
import { TimeRangeSelector } from '@/components/admin/time-range-selector';

interface HotLead {
  id: string;
  email: string;
  displayName: string | null;
  fullName: string | null;
  country: string | null;
  level: string;
  createdAt: string;
  score: number;
  scoreBreakdown: { type: string; count: number; points: number }[];
  topInterests: string[];
  lastActivity: string | null;
}

interface UserIntent {
  topPages: { path: string; visits: number; lastVisit: string | null }[];
  products: { handle: string; views: number; revisits: number; lastSeen: string }[];
  cart: {
    items: { handle: string; addedAt: string }[];
    hasStartedCheckout: boolean;
    lastCheckoutAt: string | null;
  };
  videos: { title: string; watchedAt: string }[];
  brochures: { id: string; downloadedAt: string }[];
  forms: { type: string; action: string; at: string }[];
  ctaClicks: { name: string; page: string; at: string }[];
}

export default function AdminLeadsPage() {
  const searchParams = useSearchParams();
  const range = searchParams.get('range') || '7d';
  const [leads, setLeads] = useState<HotLead[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedLead, setExpandedLead] = useState<string | null>(null);
  const [intentData, setIntentData] = useState<Record<string, UserIntent>>({});
  const [loadingIntent, setLoadingIntent] = useState<string | null>(null);

  useEffect(() => {
    fetchLeads();
  }, [range]);

  const fetchLeads = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/admin/leads?range=${range}`);
      if (response.ok) {
        const data = await response.json();
        setLeads(data.leads);
      }
    } catch (error) {
      console.error('Failed to fetch leads:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleExpand = async (leadId: string) => {
    if (expandedLead === leadId) {
      setExpandedLead(null);
      return;
    }

    setExpandedLead(leadId);

    // Load intent data if not cached
    if (!intentData[leadId]) {
      setLoadingIntent(leadId);
      try {
        const response = await fetch(`/api/admin/users/${leadId}/intent`);
        if (response.ok) {
          const data = await response.json();
          setIntentData(prev => ({ ...prev, [leadId]: data }));
        }
      } catch (error) {
        console.error('Failed to fetch intent data:', error);
      } finally {
        setLoadingIntent(null);
      }
    }
  };

  const formatPath = (path: string) => {
    if (path === '/') return 'Homepage';
    return path.replace(/^\//, '').replace(/-/g, ' ').replace(/\//g, ' → ');
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-hvmuse text-3xl text-neutral-900">Hot Leads</h1>
          <p className="text-neutral-500 mt-1">Users scored by engagement and purchase intent</p>
        </div>
        <TimeRangeSelector />
      </div>

      {/* Scoring Legend */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6">
        <h3 className="font-medium text-amber-800 mb-2">Lead Scoring System</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3 text-sm">
          <div className="flex items-center gap-2">
            <span className="font-bold text-amber-700">+30</span>
            <span className="text-amber-600">Begin Checkout</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-bold text-amber-700">+25</span>
            <span className="text-amber-600">Enquiry Submit</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-bold text-amber-700">+20</span>
            <span className="text-amber-600">Add to Cart</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-bold text-amber-700">+10</span>
            <span className="text-amber-600">Brochure Download</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-bold text-amber-700">+5</span>
            <span className="text-amber-600">Product View</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-bold text-amber-700">+3</span>
            <span className="text-amber-600">Revisit</span>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-neutral-400" />
        </div>
      ) : leads.length === 0 ? (
        <div className="bg-white rounded-xl p-12 shadow-sm text-center">
          <TrendingUp className="h-16 w-16 text-neutral-300 mx-auto mb-4" />
          <h3 className="font-hvmuse text-xl text-neutral-900 mb-2">No Hot Leads Yet</h3>
          <p className="text-neutral-500">
            As users engage with your site, they&apos;ll appear here based on their score.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {leads.map((lead, index) => (
            <div 
              key={lead.id}
              className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden"
            >
              {/* Main Lead Card */}
              <button
                onClick={() => toggleExpand(lead.id)}
                className="w-full text-left p-6"
              >
                <div className="flex items-start gap-6">
                  {/* Rank */}
                  <div className={`flex-shrink-0 h-12 w-12 rounded-full flex items-center justify-center font-hvmuse text-xl ${
                    index === 0 ? 'bg-amber-400 text-white' :
                    index === 1 ? 'bg-neutral-300 text-white' :
                    index === 2 ? 'bg-amber-700 text-white' :
                    'bg-neutral-100 text-neutral-500'
                  }`}>
                    {index + 1}
                  </div>

                  {/* User Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-hvmuse text-lg text-neutral-900">
                        {lead.displayName || lead.fullName || 'Anonymous'}
                      </h3>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                        lead.level === 'AMBASSADOR' ? 'bg-purple-100 text-purple-700' :
                        lead.level === 'ADVOCATE' ? 'bg-blue-100 text-blue-700' :
                        'bg-amber-100 text-amber-700'
                      }`}>
                        {lead.level}
                      </span>
                      {lead.country && (
                        <span className="text-sm text-neutral-500">{lead.country}</span>
                      )}
                    </div>

                    <div className="flex items-center gap-4 text-sm text-neutral-500 mb-3">
                      <span className="flex items-center gap-1">
                        <Mail className="h-4 w-4" />
                        {lead.email}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        Joined {new Date(lead.createdAt).toLocaleDateString()}
                      </span>
                      {lead.lastActivity && (
                        <span className="flex items-center gap-1">
                          <Activity className="h-4 w-4" />
                          Last active {formatTimeAgo(lead.lastActivity)}
                        </span>
                      )}
                    </div>

                    {/* Score Breakdown */}
                    {lead.scoreBreakdown.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-3">
                        {lead.scoreBreakdown.map((item, i) => (
                          <span 
                            key={i}
                            className="px-2 py-1 rounded-lg bg-neutral-100 text-xs text-neutral-600"
                          >
                            {formatEventType(item.type)} ×{item.count} (+{item.points})
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Top Interests */}
                    {lead.topInterests.length > 0 && (
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-neutral-400">Interests:</span>
                        <div className="flex flex-wrap gap-1">
                          {lead.topInterests.map((interest, i) => (
                            <span 
                              key={i}
                              className="px-2 py-0.5 rounded bg-amber-100 text-xs text-amber-700"
                            >
                              {interest}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Score & Expand */}
                  <div className="flex-shrink-0 text-right flex items-center gap-4">
                    <div>
                      <div className="text-3xl font-hvmuse text-amber-600">{lead.score}</div>
                      <div className="text-xs text-neutral-400">points</div>
                    </div>
                    {expandedLead === lead.id ? (
                      <ChevronUp className="h-6 w-6 text-neutral-400" />
                    ) : (
                      <ChevronDown className="h-6 w-6 text-neutral-400" />
                    )}
                  </div>
                </div>
              </button>

              {/* Expanded Intent Details */}
              {expandedLead === lead.id && (
                <div className="border-t border-neutral-100 bg-neutral-50 p-6">
                  {loadingIntent === lead.id ? (
                    <div className="flex items-center justify-center py-8">
                      <Loader2 className="h-6 w-6 animate-spin text-neutral-400" />
                    </div>
                  ) : intentData[lead.id] ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {/* Cart & Checkout Intent */}
                      {(intentData[lead.id].cart.items.length > 0 || intentData[lead.id].cart.hasStartedCheckout) && (
                        <div className="bg-white rounded-lg p-4 border-2 border-red-200">
                          <h4 className="font-medium text-red-800 flex items-center gap-2 mb-3">
                            <ShoppingCart className="h-4 w-4" />
                            Cart Activity
                            <AlertCircle className="h-4 w-4 text-red-500" />
                          </h4>
                          {intentData[lead.id].cart.hasStartedCheckout && (
                            <div className="mb-3 p-2 bg-red-50 rounded text-sm text-red-700">
                              🔥 Started checkout {intentData[lead.id].cart.lastCheckoutAt && 
                                formatTimeAgo(intentData[lead.id].cart.lastCheckoutAt!)}
                            </div>
                          )}
                          {intentData[lead.id].cart.items.length > 0 && (
                            <div className="space-y-2">
                              <p className="text-xs text-neutral-500">Items added:</p>
                              {intentData[lead.id].cart.items.slice(0, 5).map((item, i) => (
                                <div key={i} className="text-sm flex justify-between">
                                  <span className="font-medium">{item.handle}</span>
                                  <span className="text-neutral-400 text-xs">
                                    {formatTimeAgo(item.addedAt)}
                                  </span>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      )}

                      {/* Products Interested In */}
                      {intentData[lead.id].products.length > 0 && (
                        <div className="bg-white rounded-lg p-4">
                          <h4 className="font-medium text-neutral-800 flex items-center gap-2 mb-3">
                            <Eye className="h-4 w-4" />
                            Products Viewed
                          </h4>
                          <div className="space-y-2">
                            {intentData[lead.id].products.slice(0, 5).map((product, i) => (
                              <div key={i} className="flex justify-between items-center text-sm">
                                <span className="font-medium">{product.handle}</span>
                                <span className="text-neutral-500">
                                  {product.views + product.revisits} views
                                  {product.revisits > 0 && (
                                    <span className="text-amber-600 ml-1">
                                      ({product.revisits} revisits)
                                    </span>
                                  )}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Top Pages */}
                      {intentData[lead.id].topPages.length > 0 && (
                        <div className="bg-white rounded-lg p-4">
                          <h4 className="font-medium text-neutral-800 flex items-center gap-2 mb-3">
                            <FileText className="h-4 w-4" />
                            Top Pages
                          </h4>
                          <div className="space-y-2">
                            {intentData[lead.id].topPages.slice(0, 5).map((page, i) => (
                              <div key={i} className="flex justify-between items-center text-sm">
                                <span className="truncate flex-1 mr-2">{formatPath(page.path)}</span>
                                <span className="text-neutral-500 flex-shrink-0">{page.visits} visits</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Videos Watched */}
                      {intentData[lead.id].videos.length > 0 && (
                        <div className="bg-white rounded-lg p-4">
                          <h4 className="font-medium text-neutral-800 flex items-center gap-2 mb-3">
                            <Play className="h-4 w-4" />
                            Videos Watched
                          </h4>
                          <div className="space-y-2">
                            {intentData[lead.id].videos.slice(0, 5).map((video, i) => (
                              <div key={i} className="flex justify-between items-center text-sm">
                                <span className="truncate flex-1 mr-2">{video.title}</span>
                                <span className="text-neutral-400 text-xs flex-shrink-0">
                                  {formatTimeAgo(video.watchedAt)}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Brochures Downloaded */}
                      {intentData[lead.id].brochures.length > 0 && (
                        <div className="bg-white rounded-lg p-4">
                          <h4 className="font-medium text-neutral-800 flex items-center gap-2 mb-3">
                            <FileText className="h-4 w-4" />
                            Brochures Downloaded
                          </h4>
                          <div className="space-y-2">
                            {intentData[lead.id].brochures.map((brochure, i) => (
                              <div key={i} className="flex justify-between items-center text-sm">
                                <span className="font-medium">{brochure.id}</span>
                                <span className="text-neutral-400 text-xs">
                                  {formatTimeAgo(brochure.downloadedAt)}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* CTA Clicks */}
                      {intentData[lead.id].ctaClicks.length > 0 && (
                        <div className="bg-white rounded-lg p-4">
                          <h4 className="font-medium text-neutral-800 flex items-center gap-2 mb-3">
                            <MousePointer className="h-4 w-4" />
                            CTA Clicks
                          </h4>
                          <div className="space-y-2">
                            {intentData[lead.id].ctaClicks.slice(0, 5).map((cta, i) => (
                              <div key={i} className="text-sm">
                                <div className="flex justify-between">
                                  <span className="font-medium">{cta.name}</span>
                                  <span className="text-neutral-400 text-xs">
                                    {formatTimeAgo(cta.at)}
                                  </span>
                                </div>
                                <div className="text-xs text-neutral-400 truncate">
                                  on {formatPath(cta.page)}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Forms */}
                      {intentData[lead.id].forms.length > 0 && (
                        <div className="bg-white rounded-lg p-4">
                          <h4 className="font-medium text-neutral-800 flex items-center gap-2 mb-3">
                            <FileText className="h-4 w-4" />
                            Form Activity
                          </h4>
                          <div className="space-y-2">
                            {intentData[lead.id].forms.slice(0, 5).map((form, i) => (
                              <div key={i} className="flex justify-between items-center text-sm">
                                <span>
                                  <span className="font-medium">{form.type}</span>
                                  <span className={`ml-2 text-xs ${
                                    form.action === 'submitted' ? 'text-green-600' : 'text-amber-600'
                                  }`}>
                                    ({form.action})
                                  </span>
                                </span>
                                <span className="text-neutral-400 text-xs">
                                  {formatTimeAgo(form.at)}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <p className="text-neutral-500 text-center py-4">No intent data available</p>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function formatEventType(type: string): string {
  const names: Record<string, string> = {
    ENQUIRY_SUBMIT: 'Enquiry',
    BEGIN_CHECKOUT: 'Checkout',
    ENQUIRY_START: 'Enquiry Start',
    PRODUCT_REVISIT: 'Revisit',
    PRODUCT_VIEW: 'View',
    DOWNLOAD_BROCHURE: 'Brochure',
    BLOG_DEEP_READ: 'Blog',
    ADD_TO_CART: 'Cart',
    PAGE_VIEW: 'Page',
    VIDEO_PLAY: 'Video',
    CTA_CLICK: 'CTA',
    FORM_SUBMIT: 'Form',
  };
  return names[type] || type;
}

function formatTimeAgo(timestamp: string): string {
  const date = new Date(timestamp);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  
  if (diff < 60000) return 'just now';
  if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
  if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
  if (diff < 604800000) return `${Math.floor(diff / 86400000)}d ago`;
  
  return date.toLocaleDateString();
}
