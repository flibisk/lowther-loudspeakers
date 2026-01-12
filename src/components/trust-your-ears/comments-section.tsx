'use client';

import { useEffect, useState, useCallback } from 'react';
import { MessageCircle, Send, Loader2, User, LogOut } from 'lucide-react';
import { useAuth } from '@/contexts/auth-context';
import { AuthModal } from './auth-modal';

interface Comment {
  id: string;
  content: string;
  createdAt: string;
  user: {
    id: string;
    displayName: string;
  };
}

interface CommentsSectionProps {
  albumId: string;
  albumTitle: string;
}

export function CommentsSection({ albumId, albumTitle }: CommentsSectionProps) {
  const { user, loading: authLoading, signOut } = useAuth();
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);

  const fetchComments = useCallback(async () => {
    try {
      const response = await fetch(`/api/trust-your-ears/comments?albumId=${albumId}`);
      if (response.ok) {
        const data = await response.json();
        setComments(data.comments || []);
      }
    } catch (err) {
      console.error('Failed to fetch comments:', err);
    } finally {
      setLoading(false);
    }
  }, [albumId]);

  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      setShowAuthModal(true);
      return;
    }

    if (!newComment.trim() || newComment.trim().length < 10) {
      setError('Comment must be at least 10 characters');
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const response = await fetch('/api/trust-your-ears/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          albumId,
          content: newComment.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Failed to post comment');
        return;
      }

      // Add new comment to the top
      setComments(prev => [data.comment, ...prev]);
      setNewComment('');
    } catch (err) {
      setError('Failed to post comment');
    } finally {
      setSubmitting(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    
    return date.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
    });
  };

  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-black/5">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <MessageCircle className="h-5 w-5 text-neutral-400" />
          <h3 className="font-hvmuse text-lg text-neutral-900">Discussion</h3>
          {comments.length > 0 && (
            <span className="rounded-full bg-neutral-100 px-2 py-0.5 font-sarabun text-xs text-neutral-500">
              {comments.length}
            </span>
          )}
        </div>
        
        {/* User indicator / Sign out */}
        {!authLoading && user && (
          <div className="flex items-center gap-2">
            <span className="font-sarabun text-sm text-neutral-500">
              {user.displayName || user.email.split('@')[0]}
            </span>
            <button
              onClick={() => signOut()}
              className="rounded-lg p-1.5 text-neutral-400 transition-colors hover:bg-neutral-100 hover:text-neutral-600"
              title="Sign out"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>

      {/* Comment prompt */}
      <p className="mb-4 font-sarabun text-sm text-neutral-500">
        Share why &ldquo;{albumTitle}&rdquo; is worth listening to on Lowther speakers. 
        What makes the production special?
      </p>

      {/* Comment Form */}
      <form onSubmit={handleSubmitComment} className="mb-6">
        <div className="relative">
          <textarea
            value={newComment}
            onChange={(e) => {
              setNewComment(e.target.value);
              setError(null);
            }}
            placeholder={user ? "Share your thoughts on the production quality, mastering, or why this album sounds great..." : "Sign in to join the conversation..."}
            disabled={!user}
            rows={3}
            maxLength={1000}
            className="w-full resize-none rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-3 font-sarabun text-neutral-900 placeholder:text-neutral-400 focus:border-neutral-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-neutral-200 disabled:cursor-not-allowed disabled:opacity-60"
          />
          
          {/* Character count */}
          {newComment.length > 0 && (
            <span className="absolute bottom-3 right-3 font-sarabun text-xs text-neutral-400">
              {newComment.length}/1000
            </span>
          )}
        </div>

        {error && (
          <p className="mt-2 font-sarabun text-sm text-red-600">{error}</p>
        )}

        <div className="mt-3 flex items-center justify-end gap-3">
          {!user && !authLoading && (
            <button
              type="button"
              onClick={() => setShowAuthModal(true)}
              className="flex items-center gap-2 rounded-xl bg-neutral-900 px-4 py-2.5 font-sarabun text-sm font-medium text-white transition-all hover:bg-neutral-800"
            >
              <User className="h-4 w-4" />
              Sign in to comment
            </button>
          )}
          
          {user && (
            <button
              type="submit"
              disabled={submitting || newComment.trim().length < 10}
              className="flex items-center gap-2 rounded-xl bg-neutral-900 px-4 py-2.5 font-sarabun text-sm font-medium text-white transition-all hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {submitting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  <Send className="h-4 w-4" />
                  Post
                </>
              )}
            </button>
          )}
        </div>
      </form>

      {/* Comments List */}
      {loading ? (
        <div className="py-8 text-center">
          <Loader2 className="mx-auto h-6 w-6 animate-spin text-neutral-400" />
        </div>
      ) : comments.length === 0 ? (
        <div className="py-8 text-center">
          <p className="font-sarabun text-neutral-500">
            No comments yet. Be the first to share your thoughts!
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {comments.map((comment) => (
            <div key={comment.id} className="rounded-xl bg-neutral-50 p-4">
              <div className="mb-2 flex items-center justify-between">
                <span className="font-sarabun text-sm font-medium text-neutral-700">
                  {comment.user.displayName}
                </span>
                <span className="font-sarabun text-xs text-neutral-400">
                  {formatDate(comment.createdAt)}
                </span>
              </div>
              <p className="font-sarabun text-sm leading-relaxed text-neutral-600 whitespace-pre-wrap">
                {comment.content}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Auth Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onSuccess={() => {
          // Focus the textarea after sign in
          const textarea = document.querySelector('textarea');
          textarea?.focus();
        }}
      />
    </div>
  );
}
