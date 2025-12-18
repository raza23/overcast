'use client';

import { use, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAtomValue } from 'jotai';
import { userModeAtom, userNameAtom } from '@/lib/atoms';
import { getClassroomById } from '@/config/classrooms';
import { Header } from '@/app/components/Header';
import { Footer } from '@/app/components/Footer';
import { NameEntryModal } from '@/app/components/NameEntryModal';
import { VideoRoom } from '@/app/components/VideoRoom';
import { getUserName } from '@/lib/storage';

interface ClassroomPageProps {
  params: Promise<{ id: string }>;
}

export default function ClassroomPage({ params }: ClassroomPageProps) {
  const resolvedParams = use(params);
  const router = useRouter();
  const classroomId = parseInt(resolvedParams.id);
  const classroom = getClassroomById(classroomId);
  const userMode = useAtomValue(userModeAtom);
  const userName = useAtomValue(userNameAtom);
  const [showNameModal, setShowNameModal] = useState(false);
  const [enteredName, setEnteredName] = useState<string | null>(null);

  useEffect(() => {
    // Check if we have a classroom
    if (!classroom) {
      router.push('/');
      return;
    }

    // Check if user has entered their name
    const savedName = getUserName();
    if (savedName) {
      setEnteredName(savedName);
    } else {
      setShowNameModal(true);
    }
  }, [classroom, router]);

  const handleNameSubmit = (name: string) => {
    setEnteredName(name);
    setShowNameModal(false);
  };

  const handleReturnToLobby = () => {
    router.push('/');
  };

  if (!classroom) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col bg-deep-black">
      <Header />

      <main className="flex-1 py-8 px-6">
        <div className="max-w-7xl mx-auto">
          {/* Classroom Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-3xl font-bold text-soft-gray uppercase">
                {classroom.name}
              </h2>
              <p className="text-medium-gray text-sm mt-1">
                Live Video Session
              </p>
            </div>
            <button
              onClick={handleReturnToLobby}
              className="px-6 py-3 bg-medium-gray/20 text-soft-gray rounded-lg font-semibold hover:bg-neon-teal hover:text-deep-black transition-colors duration-200 uppercase text-sm tracking-wide"
            >
              ← Return to Lobby
            </button>
          </div>

          {/* Video Room */}
          {enteredName ? (
            <VideoRoom
              classroom={classroom}
              userName={enteredName}
              userMode={userMode}
            />
          ) : (
            <div className="bg-medium-gray/5 border border-medium-gray/20 rounded-lg p-12 text-center">
              <div className="animate-pulse">
                <div className="w-16 h-16 bg-neon-teal rounded-full mx-auto mb-4" />
                <p className="text-medium-gray">Loading...</p>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />

      {/* Name Entry Modal */}
      <NameEntryModal
        isOpen={showNameModal}
        onClose={handleNameSubmit}
      />
    </div>
  );
}

