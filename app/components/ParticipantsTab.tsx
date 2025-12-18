'use client';

import { useState } from 'react';
import { DailyCall } from '@daily-co/daily-js';
import { useParticipantIds, useParticipantProperty, useLocalSessionId } from '@daily-co/daily-react';

interface ParticipantsTabProps {
  callObject: DailyCall;
}

export function ParticipantsTab({ callObject }: ParticipantsTabProps) {
  const participantIds = useParticipantIds();
  const localSessionId = useLocalSessionId();
  const [isMutingAll, setIsMutingAll] = useState(false);

  // Filter out local participant (instructor)
  const remoteParticipants = participantIds.filter(id => id !== localSessionId);

  const handleMuteParticipant = async (participantId: string, shouldMute: boolean) => {
    try {
      await callObject.updateParticipant(participantId, {
        setAudio: !shouldMute
      });
    } catch (error) {
      console.error('Failed to mute participant:', error);
    }
  };

  const handleMuteAll = async () => {
    setIsMutingAll(true);
    try {
      const mutePromises = remoteParticipants.map(id =>
        callObject.updateParticipant(id, { setAudio: false })
      );
      await Promise.all(mutePromises);
    } catch (error) {
      console.error('Failed to mute all participants:', error);
    } finally {
      setIsMutingAll(false);
    }
  };

  const handleUnmuteAll = async () => {
    setIsMutingAll(true);
    try {
      const unmutePromises = remoteParticipants.map(id =>
        callObject.updateParticipant(id, { setAudio: true })
      );
      await Promise.all(unmutePromises);
    } catch (error) {
      console.error('Failed to unmute all participants:', error);
    } finally {
      setIsMutingAll(false);
    }
  };

  if (remoteParticipants.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-medium-gray">
          No other participants in the classroom yet.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Bulk Actions */}
      <div className="flex space-x-3">
        <button
          onClick={handleMuteAll}
          disabled={isMutingAll}
          className="flex-1 px-4 py-2 bg-accent-orange text-deep-black rounded-lg font-semibold text-sm hover:bg-accent-orange/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-wide"
        >
          {isMutingAll ? 'Muting...' : 'Mute All'}
        </button>
        <button
          onClick={handleUnmuteAll}
          disabled={isMutingAll}
          className="flex-1 px-4 py-2 bg-neon-teal text-deep-black rounded-lg font-semibold text-sm hover:bg-neon-teal/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-wide"
        >
          {isMutingAll ? 'Unmuting...' : 'Unmute All'}
        </button>
      </div>

      {/* Participant List */}
      <div className="space-y-2">
        <h4 className="text-sm font-semibold text-soft-gray uppercase tracking-wide mb-3">
          Participants ({remoteParticipants.length})
        </h4>
        {remoteParticipants.map(participantId => (
          <ParticipantControl
            key={participantId}
            participantId={participantId}
            onMute={handleMuteParticipant}
          />
        ))}
      </div>
    </div>
  );
}

interface ParticipantControlProps {
  participantId: string;
  onMute: (participantId: string, shouldMute: boolean) => void;
}

function ParticipantControl({ participantId, onMute }: ParticipantControlProps) {
  const userName = useParticipantProperty(participantId, 'user_name');
  const isAudioEnabled = useParticipantProperty(participantId, 'audio');

  return (
    <div className="flex items-center justify-between bg-medium-gray/10 rounded-lg p-3 border border-medium-gray/20">
      <div className="flex items-center space-x-3">
        {/* Avatar */}
        <div className="w-10 h-10 bg-neon-teal rounded-full flex items-center justify-center">
          <span className="text-deep-black font-bold">
            {userName?.charAt(0)?.toUpperCase() || '?'}
          </span>
        </div>

        {/* Name */}
        <div>
          <p className="text-soft-gray font-semibold text-sm">
            {userName || 'Guest'}
          </p>
          <p className="text-medium-gray text-xs">
            {isAudioEnabled ? 'Audio on' : 'Audio off'}
          </p>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center space-x-2">
        {/* Audio Status Indicator */}
        <div className={`w-2 h-2 rounded-full ${isAudioEnabled ? 'bg-neon-teal' : 'bg-accent-orange'}`} />

        {/* Mute Button */}
        <button
          onClick={() => onMute(participantId, isAudioEnabled)}
          className={`px-4 py-2 rounded-md font-semibold text-xs uppercase tracking-wide transition-colors ${
            isAudioEnabled
              ? 'bg-accent-orange/20 text-accent-orange hover:bg-accent-orange hover:text-deep-black'
              : 'bg-neon-teal/20 text-neon-teal hover:bg-neon-teal hover:text-deep-black'
          }`}
        >
          {isAudioEnabled ? 'Mute' : 'Unmute'}
        </button>
      </div>
    </div>
  );
}

