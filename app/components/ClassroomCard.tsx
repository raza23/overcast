'use client';

import { Classroom } from '@/types/classroom';
import Link from 'next/link';
import { UserMode } from '@/types/user';

interface ClassroomCardProps {
  classroom: Classroom;
  userMode: UserMode;
}

export function ClassroomCard({ classroom, userMode }: ClassroomCardProps) {
  const currentCapacity = classroom.currentCapacity ?? 0;
  const isFull = currentCapacity >= classroom.maxCapacity;
  const capacityPercentage = (currentCapacity / classroom.maxCapacity) * 100;

  return (
    <div className="bg-medium-gray/5 border border-medium-gray/20 rounded-lg overflow-hidden hover:border-neon-teal/50 transition-all duration-300 group">
      {/* Card Header */}
      <div className="p-6 pb-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-xl font-bold text-soft-gray group-hover:text-neon-teal transition-colors">
            {classroom.name}
          </h3>
          {isFull && (
            <span className="px-3 py-1 bg-accent-orange text-deep-black text-xs font-bold rounded-full uppercase">
              Full
            </span>
          )}
        </div>

        {/* Capacity Bar */}
        <div className="mt-4">
          <div className="flex items-center justify-between text-sm text-medium-gray mb-2">
            <span>Participants</span>
            <span className="font-mono">
              {currentCapacity}/{classroom.maxCapacity}
            </span>
          </div>
          <div className="w-full bg-medium-gray/20 rounded-full h-2 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                isFull ? 'bg-accent-orange' : 'bg-neon-teal'
              }`}
              style={{ width: `${capacityPercentage}%` }}
            />
          </div>
        </div>
      </div>

      {/* Card Footer */}
      <div className="p-6 pt-0">
        {isFull ? (
          <button
            disabled
            className="w-full py-3 bg-medium-gray/20 text-medium-gray rounded-lg font-semibold uppercase text-sm tracking-wide cursor-not-allowed"
          >
            Room Full
          </button>
        ) : (
          <Link
            href={`/classroom/${classroom.id}`}
            className="block w-full py-3 bg-neon-teal text-deep-black rounded-lg font-semibold uppercase text-sm tracking-wide text-center hover:bg-accent-orange transition-colors duration-200"
          >
            {userMode === UserMode.INSTRUCTOR ? 'Enter as Instructor' : 'Join Classroom'}
          </Link>
        )}
      </div>
    </div>
  );
}

