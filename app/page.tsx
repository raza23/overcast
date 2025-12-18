'use client';

import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { ClassroomCard } from './components/ClassroomCard';
import { getAllClassrooms } from '@/config/classrooms';
import { useAtomValue } from 'jotai';
import { userModeAtom } from '@/lib/atoms';
import { UserMode } from '@/types/user';

export default function Home() {
  const classrooms = getAllClassrooms();
  const userMode = useAtomValue(userModeAtom);

  return (
    <div className="min-h-screen flex flex-col bg-deep-black">
      <Header />

      <main className="flex-1 py-12 px-6">
        <div className="max-w-7xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-soft-gray mb-4 uppercase tracking-tight">
              Video Classroom Lobby
            </h2>
            <p className="text-medium-gray text-lg max-w-2xl mx-auto">
              {userMode === UserMode.INSTRUCTOR
                ? 'Select a classroom to enter as an instructor with full control capabilities.'
                : 'Choose from 6 live classrooms. Join any session and switch between rooms at any time.'}
            </p>
          </div>

          {/* Mode Badge */}
          <div className="flex justify-center mb-8">
            <div className="inline-flex items-center space-x-2 bg-medium-gray/10 px-4 py-2 rounded-full border border-medium-gray/20">
              <div className={`w-2 h-2 rounded-full ${userMode === UserMode.INSTRUCTOR ? 'bg-accent-orange' : 'bg-neon-teal'}`} />
              <span className="text-sm font-semibold text-soft-gray uppercase tracking-wide">
                {userMode === UserMode.INSTRUCTOR ? 'Instructor Mode' : 'Student Mode'}
              </span>
            </div>
          </div>

          {/* Classroom Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {classrooms.map((classroom) => (
              <ClassroomCard
                key={classroom.id}
                classroom={classroom}
                userMode={userMode}
              />
            ))}
          </div>

          {/* Info Section */}
          <div className="mt-12 max-w-3xl mx-auto bg-medium-gray/5 border border-medium-gray/20 rounded-lg p-6">
            <h3 className="text-lg font-bold text-neon-teal mb-3 uppercase">
              How It Works
            </h3>
            <ul className="space-y-2 text-medium-gray text-sm">
              <li className="flex items-start">
                <span className="text-neon-teal mr-2">▸</span>
                <span>Click on any classroom to join the live video session</span>
              </li>
              <li className="flex items-start">
                <span className="text-neon-teal mr-2">▸</span>
                <span>Your audio and video will be broadcast to other participants</span>
              </li>
              <li className="flex items-start">
                <span className="text-neon-teal mr-2">▸</span>
                <span>Return to the lobby at any time to switch classrooms</span>
              </li>
              <li className="flex items-start">
                <span className="text-neon-teal mr-2">▸</span>
                <span>Maximum 15 participants per classroom</span>
              </li>
              {userMode === UserMode.INSTRUCTOR && (
                <li className="flex items-start">
                  <span className="text-accent-orange mr-2">★</span>
                  <span className="text-accent-orange">As an instructor, you have access to mute controls and breakout rooms</span>
                </li>
              )}
            </ul>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
