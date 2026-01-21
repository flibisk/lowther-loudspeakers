'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Loader2, TrendingUp, Mail, Calendar, Activity, ExternalLink } from 'lucide-react';
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

export default function AdminLeadsPage() {
  const searchParams = useSearchParams();
  const range = searchParams.get('range') || '7d';
  const [leads, setLeads] = useState<HotLead[]>([]);
  const [loading, setLoading] = useState(true);

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
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 text-sm">
          <div className="flex items-center gap-2">
            <span className="font-bold text-amber-700">+10</span>
            <span className="text-amber-600">Enquiry Submit</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-bold text-amber-700">+6</span>
            <span className="text-amber-600">Begin Checkout</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-bold text-amber-700">+5</span>
            <span className="text-amber-600">Enquiry Start</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-bold text-amber-700">+3</span>
            <span className="text-amber-600">Product Revisit</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-bold text-amber-700">+2</span>
            <span className="text-amber-600">Brochure Download</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-bold text-amber-700">+1</span>
            <span className="text-amber-600">Blog Deep Read</span>
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
              className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow"
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

                {/* Score */}
                <div className="flex-shrink-0 text-right">
                  <div className="text-3xl font-hvmuse text-amber-600">{lead.score}</div>
                  <div className="text-xs text-neutral-400">points</div>
                </div>
              </div>
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
    DOWNLOAD_BROCHURE: 'Brochure',
    BLOG_DEEP_READ: 'Blog',
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
