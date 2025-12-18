'use client';

import { useEffect, useState, useRef } from 'react';
import DailyIframe, { DailyCall } from '@daily-co/daily-js';
import { DailyProvider } from '@daily-co/daily-react';
import { Classroom } from '@/types/classroom';
import { UserMode } from '@/types/user';
import { VideoGrid } from './VideoGrid';
import { ControlPanel } from './ControlPanel';

interface VideoRoomProps {
  classroom: Classroom;
  userName: string;
  userMode: UserMode;
}

export function VideoRoom({ classroom, userName, userMode }: VideoRoomProps) {
  const [callObject, setCallObject] = useState<DailyCall | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isJoining, setIsJoining] = useState(true);
  const dailyRef = useRef<DailyCall | null>(null);

  useEffect(() => {
    let isMounted = true;

    const initializeCall = async () => {
      try {
        // Clean up any existing instance first
        if (dailyRef.current) {
          console.log('Cleaning up existing Daily instance...');
          try {
            await dailyRef.current.leave();
            dailyRef.current.destroy();
          } catch (cleanupErr) {
            console.warn('Error during cleanup:', cleanupErr);
          }
          dailyRef.current = null;
        }

        // Small delay to ensure cleanup completes
        await new Promise(resolve => setTimeout(resolve, 100));

        if (!isMounted) return;

        console.log('Creating new Daily call object...');
        // Create Daily call object
        const daily = DailyIframe.createCallObject();
        dailyRef.current = daily;

        if (!isMounted) {
          daily.destroy();
          return;
        }

        setCallObject(daily);
        setIsJoining(true);
        
        console.log('Joining room:', classroom.roomUrl);
        await daily.join({
          url: classroom.roomUrl,
          userName: userName,
        });

        if (isMounted) {
          console.log('Successfully joined room');
          setIsJoining(false);
        }
      } catch (err) {
        console.error('Failed to join room:', err);
        if (isMounted) {
          setError('Failed to join the classroom. Please try again.');
          setIsJoining(false);
        }
        // Clean up on error
        if (dailyRef.current) {
          dailyRef.current.destroy();
          dailyRef.current = null;
        }
      }
    };

    initializeCall();

    // Cleanup function
    return () => {
      console.log('VideoRoom unmounting, cleaning up...');
      isMounted = false;
      if (dailyRef.current) {
        dailyRef.current.leave().catch(console.error);
        dailyRef.current.destroy();
        dailyRef.current = null;
      }
    };
  }, [classroom.roomUrl, userName])

  if (error) {
    return (
      <div className="bg-medium-gray/5 border border-accent-orange rounded-lg p-8 text-center">
        <div className="text-accent-orange text-lg font-semibold mb-2">
          Connection Error
        </div>
        <p className="text-medium-gray mb-4">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="px-6 py-3 bg-neon-teal text-deep-black rounded-lg font-semibold hover:bg-accent-orange transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  if (isJoining) {
    return (
      <div className="bg-medium-gray/5 border border-medium-gray/20 rounded-lg p-12 text-center">
        <div className="animate-pulse">
          <div className="w-16 h-16 bg-neon-teal rounded-full mx-auto mb-4" />
          <p className="text-soft-gray text-lg font-semibold mb-2">
            Joining Classroom...
          </p>
          <p className="text-medium-gray text-sm">
            Setting up video connection
          </p>
        </div>
      </div>
    );
  }

  if (!callObject) {
    return null;
  }

  return (
    <DailyProvider callObject={callObject}>
      <div className="space-y-6">
        {/* Video Grid */}
        <VideoGrid />

        {/* Control Panel (Instructor Only) */}
        {userMode === UserMode.INSTRUCTOR && (
          <ControlPanel callObject={callObject} />
        )}
      </div>
    </DailyProvider>
  );
}

