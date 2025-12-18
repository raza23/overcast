'use client';

import { useAtom } from 'jotai';
import { userModeAtom } from '@/lib/atoms';
import { UserMode } from '@/types/user';

export function Header() {
  const [userMode, setUserMode] = useAtom(userModeAtom);

  const toggleMode = (mode: UserMode) => {
    setUserMode(mode);
  };

  return (
    <header className="bg-deep-black border-b border-medium-gray/20">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-neon-teal rounded-lg flex items-center justify-center">
            <span className="text-deep-black font-bold text-xl">O</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-soft-gray">
            OVERCAST
          </h1>
        </div>

        {/* Mode Toggle */}
        <div className="flex items-center space-x-2 bg-medium-gray/10 rounded-lg p-1">
          <button
            onClick={() => toggleMode(UserMode.STUDENT)}
            className={`px-6 py-2 rounded-md text-sm font-semibold uppercase tracking-wide transition-all duration-200 ${
              userMode === UserMode.STUDENT
                ? 'bg-neon-teal text-deep-black'
                : 'text-soft-gray hover:text-neon-teal'
            }`}
          >
            Students
          </button>
          <button
            onClick={() => toggleMode(UserMode.INSTRUCTOR)}
            className={`px-6 py-2 rounded-md text-sm font-semibold uppercase tracking-wide transition-all duration-200 ${
              userMode === UserMode.INSTRUCTOR
                ? 'bg-neon-teal text-deep-black'
                : 'text-soft-gray hover:text-neon-teal'
            }`}
          >
            Instructors
          </button>
        </div>
      </div>
    </header>
  );
}

