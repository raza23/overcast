'use client';

import { useParticipantIds, useVideoTrack, useAudioTrack, useLocalSessionId } from '@daily-co/daily-react';
import { VideoTile } from './VideoTile';

export function VideoGrid() {
  const participantIds = useParticipantIds();
  const localSessionId = useLocalSessionId();

  if (participantIds.length === 0) {
    return (
      <div className="bg-medium-gray/5 border border-medium-gray/20 rounded-lg p-12 text-center">
        <p className="text-medium-gray text-lg mb-2">
          Waiting for participants to join...
        </p>
        <p className="text-medium-gray/60 text-sm">
          You are the first one here. Others will appear once they join.
        </p>
      </div>
    );
  }

  // Determine grid layout based on participant count
  const getGridCols = (count: number) => {
    if (count === 1) return 'grid-cols-1';
    if (count === 2) return 'grid-cols-2';
    if (count <= 4) return 'grid-cols-2';
    if (count <= 9) return 'grid-cols-3';
    return 'grid-cols-4';
  };

  return (
    <div className="bg-deep-black border border-medium-gray/20 rounded-lg p-6">
      <div className={`grid ${getGridCols(participantIds.length)} gap-4`}>
        {participantIds.map((participantId) => (
          <VideoTile
            key={participantId}
            participantId={participantId}
            isLocal={participantId === localSessionId}
          />
        ))}
      </div>

      {/* Participant Count */}
      <div className="mt-4 text-center">
        <span className="text-medium-gray text-sm">
          {participantIds.length} / 15 participants
        </span>
      </div>
    </div>
  );
}

