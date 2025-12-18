'use client';

import { useState, useEffect } from 'react';
import { useAtom } from 'jotai';
import { userNameAtom } from '@/lib/atoms';
import { getUserName, saveUserName } from '@/lib/storage';

interface NameEntryModalProps {
  isOpen: boolean;
  onClose: (name: string) => void;
}

export function NameEntryModal({ isOpen, onClose }: NameEntryModalProps) {
  const [name, setName] = useState('');
  const [userName, setUserName] = useAtom(userNameAtom);

  useEffect(() => {
    // Load saved name on mount
    const savedName = getUserName();
    if (savedName) {
      setName(savedName);
      setUserName(savedName);
    }
  }, [setUserName]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      saveUserName(name.trim());
      setUserName(name.trim());
      onClose(name.trim());
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-deep-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-deep-black border border-neon-teal rounded-lg max-w-md w-full p-8 shadow-2xl">
        <h2 className="text-2xl font-bold text-soft-gray mb-2">
          Enter Your Name
        </h2>
        <p className="text-medium-gray text-sm mb-6">
          Your name will be visible to other participants in the classroom.
        </p>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name"
            autoFocus
            className="w-full px-4 py-3 bg-medium-gray/10 border border-medium-gray/30 rounded-lg text-soft-gray placeholder-medium-gray focus:outline-none focus:border-neon-teal transition-colors"
            maxLength={50}
          />

          <div className="mt-6 flex space-x-3">
            <button
              type="submit"
              disabled={!name.trim()}
              className="flex-1 py-3 bg-neon-teal text-deep-black rounded-lg font-semibold uppercase text-sm tracking-wide hover:bg-accent-orange transition-colors disabled:bg-medium-gray/20 disabled:text-medium-gray disabled:cursor-not-allowed"
            >
              Continue
            </button>
          </div>
        </form>

        <p className="text-xs text-medium-gray mt-4 text-center">
          No password required. Your name is stored locally.
        </p>
      </div>
    </div>
  );
}

