'use client';

import { useState } from 'react';
import { DailyCall } from '@daily-co/daily-js';
import { useParticipantIds } from '@daily-co/daily-react';
import { ParticipantsTab } from './ParticipantsTab';
import { BreakoutRoomsTab } from './BreakoutRoomsTab';

interface ControlPanelProps {
  callObject: DailyCall;
}

type TabType = 'participants' | 'breakout-rooms';

export function ControlPanel({ callObject }: ControlPanelProps) {
  const [activeTab, setActiveTab] = useState<TabType>('participants');
  const participantIds = useParticipantIds();

  return (
    <div className="bg-medium-gray/5 border border-neon-teal rounded-lg overflow-hidden">
      {/* Header */}
      <div className="bg-medium-gray/10 px-6 py-4 border-b border-medium-gray/20">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-neon-teal uppercase tracking-wide">
            Instructor Control Panel
          </h3>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-accent-orange rounded-full animate-pulse" />
            <span className="text-sm text-medium-gray">
              {participantIds.length} Active
            </span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-medium-gray/20">
        <button
          onClick={() => setActiveTab('participants')}
          className={`flex-1 px-6 py-3 font-semibold text-sm uppercase tracking-wide transition-colors ${
            activeTab === 'participants'
              ? 'bg-neon-teal/10 text-neon-teal border-b-2 border-neon-teal'
              : 'text-medium-gray hover:text-soft-gray hover:bg-medium-gray/5'
          }`}
        >
          Participants
        </button>
        <button
          onClick={() => setActiveTab('breakout-rooms')}
          className={`flex-1 px-6 py-3 font-semibold text-sm uppercase tracking-wide transition-colors ${
            activeTab === 'breakout-rooms'
              ? 'bg-neon-teal/10 text-neon-teal border-b-2 border-neon-teal'
              : 'text-medium-gray hover:text-soft-gray hover:bg-medium-gray/5'
          }`}
        >
          Breakout Rooms
        </button>
      </div>

      {/* Tab Content */}
      <div className="p-6">
        {activeTab === 'participants' && (
          <ParticipantsTab callObject={callObject} />
        )}
        {activeTab === 'breakout-rooms' && (
          <BreakoutRoomsTab callObject={callObject} />
        )}
      </div>
    </div>
  );
}

