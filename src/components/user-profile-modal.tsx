'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, Loader2, Speaker, Music, Calendar } from 'lucide-react';

interface UserProfile {
  id: string;
  displayName: string;
  fullName: string | null;
  level: 'ENTHUSIAST' | 'ADVOCATE' | 'AMBASSADOR';
  memberSince: string;
}

interface Equipment {
  id: string;
  name: string;
  fromOrder: boolean;
}

interface Recommendation {
  id: string;
  title: string;
  artist: string;
  coverUrl: string | null;
  releaseDate: string | null;
}

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
}

const levelConfig = {
  ENTHUSIAST: { label: 'Enthusiast', color: 'bg-amber-100 text-amber-800' },
  ADVOCATE: { label: 'Advocate', color: 'bg-blue-100 text-blue-800' },
  AMBASSADOR: { label: 'Ambassador', color: 'bg-purple-100 text-purple-800' },
};

export function UserProfileModal({ isOpen, onClose, userId }: UserProfileModalProps) {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  useEffect(() => {
    if (isOpen && userId) {
      fetchProfile(1, true);
    }
  }, [isOpen, userId]);

  const fetchProfile = async (pageNum: number, reset: boolean = false) => {
    if (reset) {
      setLoading(true);
    } else {
      setLoadingMore(true);
    }

    try {
      const response = await fetch(`/api/users/${userId}/profile?page=${pageNum}`);
      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
        setEquipment(data.equipment);
        
        if (reset) {
          setRecommendations(data.recommendations);
        } else {
          setRecommendations(prev => [...prev, ...data.recommendations]);
        }
        
        setPage(pageNum);
        setHasMore(data.pagination.hasMore);
      }
    } catch (error) {
      console.error('Failed to fetch user profile:', error);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  const handleLoadMore = () => {
    fetchProfile(page + 1, false);
  };

  const handleClose = () => {
    onClose();
    // Reset state after animation
    setTimeout(() => {
      setUser(null);
      setEquipment([]);
      setRecommendations([]);
      setPage(1);
      setHasMore(false);
    }, 300);
  };

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        handleClose();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  if (!mounted) return null;

  const modalContent = (
    <div
      className={`fixed inset-0 z-[100] flex items-center justify-center transition-opacity duration-300 ${
        isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
      }`}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={handleClose}
      />

      {/* Modal */}
      <div
        className={`relative w-full max-w-md mx-4 max-h-[85vh] overflow-hidden rounded-2xl bg-white shadow-2xl transform transition-all duration-300 ${
          isOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
        }`}
      >
        {/* Close button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 z-10 rounded-full p-2 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-600 transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-neutral-400" />
          </div>
        ) : user ? (
          <div className="overflow-y-auto max-h-[85vh]">
            {/* Header */}
            <div className="bg-gradient-to-br from-neutral-50 to-neutral-100 px-6 pt-6 pb-5">
              <div className="flex items-center gap-4">
                {/* Avatar */}
                <div className="h-16 w-16 rounded-full bg-gradient-to-br from-amber-200 to-amber-400 flex items-center justify-center flex-shrink-0">
                  <span className="font-hvmuse text-2xl text-white">
                    {user.displayName.charAt(0).toUpperCase()}
                  </span>
                </div>

                {/* Info */}
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h2 className="font-hvmuse text-xl text-neutral-900 truncate">
                      {user.displayName}
                    </h2>
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${levelConfig[user.level].color}`}>
                      {levelConfig[user.level].label}
                    </span>
                  </div>
                  {user.fullName && (
                    <p className="font-sarabun text-sm text-neutral-600 truncate">
                      {user.fullName}
                    </p>
                  )}
                  <p className="font-sarabun text-xs text-neutral-400 mt-1 flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    Member since {new Date(user.memberSince).toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })}
                  </p>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="px-6 py-5 space-y-6">
              {/* Hi-Fi Equipment */}
              {equipment.length > 0 && (
                <div>
                  <h3 className="font-sarabun text-xs uppercase tracking-wider text-neutral-400 mb-3 flex items-center gap-2">
                    <Speaker className="h-4 w-4" />
                    Hi-Fi Equipment
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {equipment.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center gap-2 rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-1.5"
                      >
                        <span className="font-sarabun text-sm text-neutral-700">{item.name}</span>
                        {item.fromOrder && (
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-100 text-amber-700 font-medium">
                            LOWTHER
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Album Recommendations */}
              {recommendations.length > 0 && (
                <div>
                  <h3 className="font-sarabun text-xs uppercase tracking-wider text-neutral-400 mb-3 flex items-center gap-2">
                    <Music className="h-4 w-4" />
                    Album Recommendations
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    {recommendations.map((album) => (
                      <a
                        key={album.id}
                        href={`/trust-your-ears/album/${album.id}`}
                        className="group block rounded-lg border border-neutral-200 overflow-hidden hover:border-neutral-300 transition-colors"
                      >
                        <div className="aspect-square relative bg-neutral-100">
                          {album.coverUrl ? (
                            <img
                              src={album.coverUrl}
                              alt={album.title}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <Music className="h-8 w-8 text-neutral-300" />
                            </div>
                          )}
                        </div>
                        <div className="p-2">
                          <p className="font-sarabun text-sm font-medium text-neutral-900 truncate group-hover:text-amber-700 transition-colors">
                            {album.title}
                          </p>
                          <p className="font-sarabun text-xs text-neutral-500 truncate">
                            {album.artist}
                          </p>
                        </div>
                      </a>
                    ))}
                  </div>

                  {hasMore && (
                    <button
                      onClick={handleLoadMore}
                      disabled={loadingMore}
                      className="mt-4 w-full py-2 rounded-lg border border-neutral-200 font-sarabun text-sm text-neutral-600 hover:bg-neutral-50 transition-colors disabled:opacity-50"
                    >
                      {loadingMore ? (
                        <Loader2 className="h-4 w-4 animate-spin mx-auto" />
                      ) : (
                        'Show More'
                      )}
                    </button>
                  )}
                </div>
              )}

              {/* Empty state */}
              {equipment.length === 0 && recommendations.length === 0 && (
                <p className="text-center font-sarabun text-sm text-neutral-500 py-4">
                  This member hasn&apos;t added any equipment or recommendations yet.
                </p>
              )}
            </div>
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="font-sarabun text-neutral-500">User not found</p>
          </div>
        )}
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}
