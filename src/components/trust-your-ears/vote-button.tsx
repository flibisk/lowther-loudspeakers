'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';

interface VoteButtonProps {
  spotifyAlbumId: string;
  onSuccess?: () => void;
}

export function VoteButton({ spotifyAlbumId, onSuccess }: VoteButtonProps) {
  const [loading, setLoading] = useState(false);
  const [voted, setVoted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleVote = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/trust-your-ears/vote', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ spotifyAlbumId }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 409) {
          setVoted(true);
          setError('You have already voted for this album');
        } else {
          setError(data.error || 'Failed to vote');
        }
        return;
      }

      setVoted(true);
      if (onSuccess) {
        onSuccess();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to vote');
    } finally {
      setLoading(false);
    }
  };

  if (voted) {
    return (
      <Button
        variant="outline"
        size="sm"
        disabled
        className="font-sarabun text-xs"
      >
        Voted
      </Button>
    );
  }

  return (
    <div className="flex flex-col items-end gap-1">
      <Button
        variant="outline"
        size="sm"
        onClick={handleVote}
        disabled={loading}
        className="font-sarabun text-xs"
      >
        {loading ? 'Voting...' : 'Vote'}
      </Button>
      {error && (
        <p className="font-sarabun text-[10px] text-red-600">{error}</p>
      )}
    </div>
  );
}
