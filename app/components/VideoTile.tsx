'use client';

import { useRef, useEffect } from 'react';
import { useVideoTrack, useAudioTrack, useParticipantProperty } from '@daily-co/daily-react';

interface VideoTileProps {
  participantId: string;
  isLocal: boolean;
}

export function VideoTile({ participantId, isLocal }: VideoTileProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  
  const videoTrack = useVideoTrack(participantId);
  const audioTrack = useAudioTrack(participantId);
  const userName = useParticipantProperty(participantId, 'user_name');
  const isAudioMuted = useParticipantProperty(participantId, 'audio');

  // Set up video track
  useEffect(() => {
    if (videoRef.current && videoTrack.track) {
      const stream = new MediaStream([videoTrack.track]);
      videoRef.current.srcObject = stream;
    }
  }, [videoTrack.track]);

  // Set up audio track (but not for local participant to avoid echo)
  useEffect(() => {
    if (!isLocal && audioRef.current && audioTrack.track) {
      const stream = new MediaStream([audioTrack.track]);
      audioRef.current.srcObject = stream;
    }
  }, [audioTrack.track, isLocal]);

  return (
    <div className={`relative aspect-video bg-medium-gray/10 rounded-lg overflow-hidden border-2 ${
      isLocal ? 'border-neon-teal' : 'border-medium-gray/20'
    }`}>
      {/* Video Element */}
      {videoTrack.track ? (
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted={isLocal}
          className="w-full h-full object-cover"
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center bg-medium-gray/20">
          <div className="w-20 h-20 bg-neon-teal rounded-full flex items-center justify-center">
            <span className="text-deep-black text-3xl font-bold">
              {userName?.charAt(0)?.toUpperCase() || '?'}
            </span>
          </div>
        </div>
      )}

      {/* Audio Element (hidden) */}
      {!isLocal && <audio ref={audioRef} autoPlay />}

      {/* Participant Info Overlay */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-deep-black/80 to-transparent p-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-soft-gray text-sm font-semibold">
              {userName || 'Guest'}
            </span>
            {isLocal && (
              <span className="text-neon-teal text-xs font-semibold uppercase">
                (You)
              </span>
            )}
          </div>

          {/* Audio Indicator */}
          <div>
            {!isAudioMuted ? (
              <svg
                className="w-4 h-4 text-accent-orange"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM12.293 7.293a1 1 0 011.414 0L15 8.586l1.293-1.293a1 1 0 111.414 1.414L16.414 10l1.293 1.293a1 1 0 01-1.414 1.414L15 11.414l-1.293 1.293a1 1 0 01-1.414-1.414L13.586 10l-1.293-1.293a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            ) : (
              <svg
                className="w-4 h-4 text-soft-gray"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828 1 1 0 010-1.415z"
                  clipRule="evenodd"
                />
              </svg>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

