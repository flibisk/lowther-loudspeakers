'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { FileText, Loader2, User, Eye, MousePointer, MapPin, Star } from 'lucide-react';

interface PageStats {
  path: string;
  viewCount: number;
  uniqueUsers: number;
}

interface PageUser {
  userId: string | null;
  email: string | null;
  displayName: string | null;
  country: string | null;
  visitCount: number;
  ctaClicks: number;
  leadScore: number;
  lastVisit: string;
}

export default function AdminPagesPage() {
  const searchParams = useSearchParams();
  const initialSelected = searchParams.get('selected');
  
  const [pages, setPages] = useState<PageStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPage, setSelectedPage] = useState<string | null>(null);
  const [pageUsers, setPageUsers] = useState<PageUser[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(false);

  // Load top pages on mount
  useEffect(() => {
    loadPages();
  }, []);
  
  // Handle initial selection from URL
  useEffect(() => {
    if (initialSelected && !loading) {
      loadPageUsers(initialSelected);
    }
  }, [initialSelected, loading]);

  const loadPages = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/admin/pages');
      if (response.ok) {
        const data = await response.json();
        setPages(data.pages);
      }
    } catch (error) {
      console.error('Failed to load pages:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadPageUsers = async (path: string) => {
    setSelectedPage(path);
    setLoadingUsers(true);
    try {
      const response = await fetch(`/api/admin/pages/users?path=${encodeURIComponent(path)}`);
      if (response.ok) {
        const data = await response.json();
        setPageUsers(data.users);
      }
    } catch (error) {
      console.error('Failed to load page users:', error);
    } finally {
      setLoadingUsers(false);
    }
  };

  // Format path for display
  const formatPath = (path: string) => {
    if (path === '/') return 'Homepage';
    return path
      .replace(/^\//, '')
      .replace(/-/g, ' ')
      .replace(/\//g, ' → ')
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-hvmuse text-3xl text-neutral-900">Page Views</h1>
        <p className="text-neutral-500 mt-1">See which pages are most popular and who's viewing them</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Page List */}
        <div>
          <h2 className="font-hvmuse text-lg text-neutral-900 mb-4">
            All Pages (by views)
          </h2>
          
          {loading ? (
            <div className="bg-white rounded-xl p-8 shadow-sm text-center">
              <Loader2 className="h-8 w-8 text-neutral-300 mx-auto mb-3 animate-spin" />
              <p className="text-neutral-500">Loading pages...</p>
            </div>
          ) : pages.length === 0 ? (
            <div className="bg-white rounded-xl p-8 shadow-sm text-center">
              <FileText className="h-12 w-12 text-neutral-300 mx-auto mb-3" />
              <p className="text-neutral-500">No page views recorded yet</p>
            </div>
          ) : (
            <div className="space-y-2 max-h-[700px] overflow-y-auto pr-2">
              {pages.map((page, index) => (
                <button
                  key={page.path}
                  onClick={() => loadPageUsers(page.path)}
                  className={`w-full text-left bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-all ${
                    selectedPage === page.path ? 'ring-2 ring-amber-500' : ''
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-8 text-center">
                      <span className="text-lg font-medium text-neutral-300">
                        #{index + 1}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-neutral-900 truncate">
                        {formatPath(page.path)}
                      </p>
                      <p className="text-xs text-neutral-400 truncate mt-0.5">
                        {page.path}
                      </p>
                      <div className="flex items-center gap-4 mt-2 text-xs text-neutral-500">
                        <span className="flex items-center gap-1 font-semibold text-amber-600">
                          <Eye className="h-3 w-3" />
                          {page.viewCount.toLocaleString()} views
                        </span>
                        <span className="flex items-center gap-1">
                          <User className="h-3 w-3" />
                          {page.uniqueUsers} users
                        </span>
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Page Users */}
        <div>
          <h2 className="font-hvmuse text-lg text-neutral-900 mb-4">
            {selectedPage ? `Visitors: ${formatPath(selectedPage)}` : 'Page Visitors'}
          </h2>
          
          {!selectedPage ? (
            <div className="bg-white rounded-xl p-8 shadow-sm text-center">
              <MousePointer className="h-12 w-12 text-neutral-300 mx-auto mb-3" />
              <p className="text-neutral-500">Select a page to see who visited it</p>
            </div>
          ) : loadingUsers ? (
            <div className="bg-white rounded-xl p-8 shadow-sm text-center">
              <Loader2 className="h-8 w-8 text-neutral-300 mx-auto mb-3 animate-spin" />
              <p className="text-neutral-500">Loading visitors...</p>
            </div>
          ) : pageUsers.length === 0 ? (
            <div className="bg-white rounded-xl p-8 shadow-sm text-center">
              <User className="h-12 w-12 text-neutral-300 mx-auto mb-3" />
              <p className="text-neutral-500">No visitors for this page yet</p>
            </div>
          ) : (
            <div className="space-y-3 max-h-[700px] overflow-y-auto pr-2">
              {pageUsers.map((user, index) => (
                <div
                  key={user.userId || `anon-${index}`}
                  className="bg-white rounded-xl p-4 shadow-sm"
                >
                  <div className="flex items-start gap-3">
                    <div className="h-12 w-12 rounded-full bg-gradient-to-br from-amber-200 to-amber-400 flex items-center justify-center flex-shrink-0">
                      <span className="font-hvmuse text-lg text-white">
                        {(user.displayName || user.email || '?').charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-neutral-900 truncate">
                          {user.displayName || 'Anonymous'}
                        </p>
                        {user.leadScore > 0 && (
                          <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-700">
                            <Star className="h-3 w-3" />
                            {user.leadScore}
                          </span>
                        )}
                      </div>
                      
                      {user.email && (
                        <p className="text-sm text-neutral-500 truncate">{user.email}</p>
                      )}
                      
                      {user.country && (
                        <p className="text-xs text-neutral-400 flex items-center gap-1 mt-1">
                          <MapPin className="h-3 w-3" />
                          {user.country}
                        </p>
                      )}
                      
                      {/* Stats row */}
                      <div className="flex items-center gap-4 mt-3 pt-3 border-t border-neutral-100">
                        <div className="text-center">
                          <p className="text-lg font-semibold text-neutral-900">{user.visitCount}</p>
                          <p className="text-xs text-neutral-500">Page Visits</p>
                        </div>
                        <div className="text-center">
                          <p className="text-lg font-semibold text-green-600">{user.ctaClicks}</p>
                          <p className="text-xs text-neutral-500">CTA Clicks</p>
                        </div>
                        <div className="text-center flex-1">
                          <p className="text-xs text-neutral-400">
                            Last visit: {new Date(user.lastVisit).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
