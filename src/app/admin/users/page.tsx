'use client';

import { useState, useEffect } from 'react';
import { Search, Loader2, User, Calendar, Activity, ChevronDown } from 'lucide-react';
import { UserActivityView } from '@/components/admin/user-activity-view';

interface UserResult {
  id: string;
  email: string;
  displayName: string | null;
  fullName: string | null;
  country: string | null;
  level: string;
  createdAt: string;
  eventCount: number;
  leadScore: number;
}

const PAGE_SIZE = 100;

export default function AdminUsersPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searching, setSearching] = useState(false);
  const [users, setUsers] = useState<UserResult[]>([]);
  const [selectedUser, setSelectedUser] = useState<UserResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const [offset, setOffset] = useState(0);
  const [isSearchMode, setIsSearchMode] = useState(false);

  // Load users on mount
  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async (reset = true) => {
    if (reset) {
      setLoading(true);
      setOffset(0);
    } else {
      setLoadingMore(true);
    }

    try {
      const currentOffset = reset ? 0 : offset;
      const response = await fetch(`/api/admin/users/list?limit=${PAGE_SIZE}&offset=${currentOffset}`);
      if (response.ok) {
        const data = await response.json();
        if (reset) {
          setUsers(data.users);
        } else {
          setUsers(prev => [...prev, ...data.users]);
        }
        setHasMore(data.hasMore);
        setOffset(currentOffset + data.users.length);
        setIsSearchMode(false);
      }
    } catch (error) {
      console.error('Failed to load users:', error);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!searchQuery.trim()) {
      // If search is cleared, reload all users
      loadUsers();
      return;
    }

    setSearching(true);
    setIsSearchMode(true);

    try {
      const response = await fetch(`/api/admin/users/search?q=${encodeURIComponent(searchQuery)}`);
      if (response.ok) {
        const data = await response.json();
        setUsers(data.users);
        setHasMore(false);
      }
    } catch (error) {
      console.error('Search failed:', error);
    } finally {
      setSearching(false);
    }
  };

  const handleLoadMore = () => {
    loadUsers(false);
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    loadUsers();
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-hvmuse text-3xl text-neutral-900">Users</h1>
        <p className="text-neutral-500 mt-1">Browse all users sorted by lead score, or search by email</p>
      </div>

      {/* Search Form */}
      <form onSubmit={handleSearch} className="mb-8">
        <div className="relative max-w-xl">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-neutral-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by email address..."
            className="w-full h-12 pl-12 pr-32 rounded-xl border border-neutral-200 bg-white text-neutral-900 placeholder:text-neutral-400 focus:border-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-200"
          />
          <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-2">
            {isSearchMode && (
              <button
                type="button"
                onClick={handleClearSearch}
                className="px-3 py-2 text-sm text-neutral-500 hover:text-neutral-700"
              >
                Clear
              </button>
            )}
            <button
              type="submit"
              disabled={searching}
              className="px-4 py-2 rounded-lg bg-neutral-900 text-white text-sm font-medium hover:bg-neutral-800 disabled:opacity-50 transition-colors"
            >
              {searching ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Search'}
            </button>
          </div>
        </div>
      </form>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* User List */}
        <div>
          <h2 className="font-hvmuse text-lg text-neutral-900 mb-4">
            {isSearchMode ? `Search Results (${users.length})` : `All Users (${users.length}${hasMore ? '+' : ''})`}
          </h2>
          
          {loading ? (
            <div className="bg-white rounded-xl p-8 shadow-sm text-center">
              <Loader2 className="h-8 w-8 text-neutral-300 mx-auto mb-3 animate-spin" />
              <p className="text-neutral-500">Loading users...</p>
            </div>
          ) : users.length === 0 ? (
            <div className="bg-white rounded-xl p-8 shadow-sm text-center">
              <User className="h-12 w-12 text-neutral-300 mx-auto mb-3" />
              <p className="text-neutral-500">No users found</p>
            </div>
          ) : (
            <div className="space-y-3">
              {users.map((user, index) => (
                <button
                  key={user.id}
                  onClick={() => setSelectedUser(user)}
                  className={`w-full text-left bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow ${
                    selectedUser?.id === user.id ? 'ring-2 ring-amber-500' : ''
                  }`}
                >
                  <div className="flex items-start gap-4">
                    {/* Rank number */}
                    <div className="flex-shrink-0 w-8 text-center">
                      <span className="text-lg font-medium text-neutral-300">
                        #{index + 1}
                      </span>
                    </div>
                    <div className="h-12 w-12 rounded-full bg-gradient-to-br from-amber-200 to-amber-400 flex items-center justify-center flex-shrink-0">
                      <span className="font-hvmuse text-lg text-white">
                        {(user.displayName || user.email).charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-neutral-900 truncate">
                          {user.displayName || user.fullName || 'No name'}
                        </p>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                          user.level === 'AMBASSADOR' ? 'bg-purple-100 text-purple-700' :
                          user.level === 'ADVOCATE' ? 'bg-blue-100 text-blue-700' :
                          'bg-amber-100 text-amber-700'
                        }`}>
                          {user.level}
                        </span>
                      </div>
                      <p className="text-sm text-neutral-500 truncate">{user.email}</p>
                      <div className="flex items-center gap-4 mt-2 text-xs text-neutral-400">
                        <span className="flex items-center gap-1">
                          <Activity className="h-3 w-3" />
                          {user.eventCount} events
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {new Date(user.createdAt).toLocaleDateString()}
                        </span>
                        <span className="font-semibold text-amber-600">
                          Score: {user.leadScore}
                        </span>
                      </div>
                    </div>
                  </div>
                </button>
              ))}
              
              {/* Load More Button */}
              {hasMore && !isSearchMode && (
                <button
                  onClick={handleLoadMore}
                  disabled={loadingMore}
                  className="w-full py-4 rounded-xl border-2 border-dashed border-neutral-200 text-neutral-500 hover:border-neutral-300 hover:text-neutral-600 transition-colors flex items-center justify-center gap-2"
                >
                  {loadingMore ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Loading more...
                    </>
                  ) : (
                    <>
                      <ChevronDown className="h-4 w-4" />
                      Load More Users
                    </>
                  )}
                </button>
              )}
            </div>
          )}
        </div>

        {/* User Activity */}
        <div>
          <h2 className="font-hvmuse text-lg text-neutral-900 mb-4">User Activity</h2>
          {selectedUser ? (
            <UserActivityView userId={selectedUser.id} userEmail={selectedUser.email} />
          ) : (
            <div className="bg-white rounded-xl p-8 shadow-sm text-center">
              <Activity className="h-12 w-12 text-neutral-300 mx-auto mb-3" />
              <p className="text-neutral-500">Select a user to view their activity</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
