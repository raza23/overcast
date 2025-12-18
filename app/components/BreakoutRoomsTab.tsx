'use client';

import { useState } from 'react';
import { DailyCall } from '@daily-co/daily-js';
import { useParticipantIds, useParticipantProperty, useLocalSessionId } from '@daily-co/daily-react';

interface BreakoutRoomsTabProps {
  callObject: DailyCall;
}

interface BreakoutRoomAssignment {
  roomName: string;
  participantIds: string[];
}

export function BreakoutRoomsTab({ callObject }: BreakoutRoomsTabProps) {
  const participantIds = useParticipantIds();
  const localSessionId = useLocalSessionId();
  const [numRooms, setNumRooms] = useState(2);
  const [isConfiguring, setIsConfiguring] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const [rooms, setRooms] = useState<BreakoutRoomAssignment[]>([]);
  const [isStarting, setIsStarting] = useState(false);

  // Filter out local participant (instructor)
  const remoteParticipants = participantIds.filter(id => id !== localSessionId);

  const handleBeginConfiguration = () => {
    setIsConfiguring(true);
    // Create empty rooms
    const newRooms: BreakoutRoomAssignment[] = [];
    for (let i = 1; i <= numRooms; i++) {
      newRooms.push({
        roomName: `Breakout Room ${i}`,
        participantIds: []
      });
    }
    setRooms(newRooms);
  };

  const handleAssignToRoom = (participantId: string, roomIndex: number) => {
    setRooms(prevRooms => {
      // Remove participant from any existing room
      const updatedRooms = prevRooms.map(room => ({
        ...room,
        participantIds: room.participantIds.filter(id => id !== participantId)
      }));

      // Add to new room
      updatedRooms[roomIndex].participantIds.push(participantId);
      return updatedRooms;
    });
  };

  const handleAutoAssign = () => {
    const shuffled = [...remoteParticipants].sort(() => Math.random() - 0.5);
    const newRooms: BreakoutRoomAssignment[] = rooms.map(room => ({ 
      ...room, 
      participantIds: [] as string[] 
    }));

    shuffled.forEach((participantId, index) => {
      const roomIndex = index % numRooms;
      newRooms[roomIndex].participantIds.push(participantId);
    });

    setRooms(newRooms);
  };

  const handleStartBreakout = async () => {
    setIsStarting(true);
    try {
      // Daily.co breakout rooms API
      // Note: This requires Daily's breakout rooms feature to be enabled
      // For the MVP, we'll show a message about this being a placeholder
      
      // In production, you would call:
      // await callObject.startBreakout({
      //   rooms: rooms.map(room => ({
      //     name: room.roomName,
      //     participants: room.participantIds
      //   }))
      // });

      setIsActive(true);
      alert('Breakout rooms feature requires Daily.co Enterprise plan. This is a UI demo.');
    } catch (error) {
      console.error('Failed to start breakout rooms:', error);
      alert('Failed to start breakout rooms. Please try again.');
    } finally {
      setIsStarting(false);
    }
  };

  const handleEndBreakout = async () => {
    try {
      // In production:
      // await callObject.stopBreakout();
      
      setIsActive(false);
      setIsConfiguring(false);
      setRooms([]);
      alert('Breakout rooms ended. All participants returned to main session.');
    } catch (error) {
      console.error('Failed to end breakout rooms:', error);
      alert('Failed to end breakout rooms. Please try again.');
    }
  };

  if (remoteParticipants.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-medium-gray">
          No other participants available for breakout rooms.
        </p>
        <p className="text-medium-gray/60 text-sm mt-2">
          Wait for participants to join the classroom.
        </p>
      </div>
    );
  }

  if (isActive) {
    return (
      <div className="space-y-4">
        <div className="bg-neon-teal/10 border border-neon-teal rounded-lg p-4 text-center">
          <div className="flex items-center justify-center space-x-2 mb-2">
            <div className="w-3 h-3 bg-neon-teal rounded-full animate-pulse" />
            <p className="text-neon-teal font-semibold uppercase tracking-wide">
              Breakout Rooms Active
            </p>
          </div>
          <p className="text-medium-gray text-sm">
            {rooms.length} breakout rooms are currently in session
          </p>
        </div>

        {/* Active Rooms Display */}
        <div className="space-y-3">
          {rooms.map((room, index) => (
            <div key={index} className="bg-medium-gray/10 border border-medium-gray/20 rounded-lg p-4">
              <h4 className="text-soft-gray font-semibold mb-2">{room.roomName}</h4>
              <p className="text-medium-gray text-sm">
                {room.participantIds.length} participant{room.participantIds.length !== 1 ? 's' : ''}
              </p>
            </div>
          ))}
        </div>

        <button
          onClick={handleEndBreakout}
          className="w-full px-4 py-3 bg-accent-orange text-deep-black rounded-lg font-semibold hover:bg-accent-orange/80 transition-colors uppercase tracking-wide"
        >
          End All Breakout Rooms
        </button>
      </div>
    );
  }

  if (!isConfiguring) {
    return (
      <div className="space-y-6">
        <div className="text-center py-4">
          <p className="text-medium-gray mb-4">
            Create breakout rooms for small group discussions
          </p>

          {/* Number of Rooms Selector */}
          <div className="max-w-xs mx-auto mb-6">
            <label className="block text-sm font-semibold text-soft-gray mb-2 uppercase tracking-wide">
              Number of Rooms
            </label>
            <select
              value={numRooms}
              onChange={(e) => setNumRooms(parseInt(e.target.value))}
              className="w-full px-4 py-3 bg-medium-gray/10 border border-medium-gray/30 rounded-lg text-soft-gray focus:outline-none focus:border-neon-teal transition-colors"
            >
              {[2, 3, 4, 5, 6].map(num => (
                <option key={num} value={num}>
                  {num} Rooms
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={handleBeginConfiguration}
            className="px-8 py-3 bg-neon-teal text-deep-black rounded-lg font-semibold hover:bg-accent-orange transition-colors uppercase tracking-wide"
          >
            Begin Breakout Rooms
          </button>
        </div>

        {/* Info Box */}
        <div className="bg-medium-gray/5 border border-medium-gray/20 rounded-lg p-4">
          <h4 className="text-neon-teal text-sm font-semibold mb-2 uppercase">
            About Breakout Rooms
          </h4>
          <ul className="space-y-1 text-medium-gray text-sm">
            <li>• Create 2-6 separate video sessions</li>
            <li>• Assign participants to specific rooms</li>
            <li>• Complete audio/video isolation between rooms</li>
            <li>• Monitor or join any room as instructor</li>
          </ul>
        </div>
      </div>
    );
  }

  // Configuration View
  const assignedParticipants = new Set(rooms.flatMap(room => room.participantIds));
  const unassignedParticipants = remoteParticipants.filter(id => !assignedParticipants.has(id));

  return (
    <div className="space-y-4">
      {/* Action Buttons */}
      <div className="flex space-x-3">
        <button
          onClick={handleAutoAssign}
          className="flex-1 px-4 py-2 bg-medium-gray/20 text-soft-gray rounded-lg font-semibold text-sm hover:bg-medium-gray/30 transition-colors uppercase tracking-wide"
        >
          Auto Assign
        </button>
        <button
          onClick={handleStartBreakout}
          disabled={isStarting || unassignedParticipants.length > 0}
          className="flex-1 px-4 py-2 bg-neon-teal text-deep-black rounded-lg font-semibold text-sm hover:bg-accent-orange transition-colors disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-wide"
        >
          {isStarting ? 'Starting...' : 'Start Breakout'}
        </button>
      </div>

      {/* Warning for unassigned participants */}
      {unassignedParticipants.length > 0 && (
        <div className="bg-accent-orange/10 border border-accent-orange rounded-lg p-3">
          <p className="text-accent-orange text-sm font-semibold">
            {unassignedParticipants.length} participant{unassignedParticipants.length !== 1 ? 's' : ''} not assigned
          </p>
        </div>
      )}

      {/* Rooms */}
      <div className="space-y-3">
        {rooms.map((room, roomIndex) => (
          <BreakoutRoomCard
            key={roomIndex}
            room={room}
            roomIndex={roomIndex}
            allParticipants={remoteParticipants}
            onAssign={handleAssignToRoom}
          />
        ))}
      </div>

      {/* Cancel Button */}
      <button
        onClick={() => {
          setIsConfiguring(false);
          setRooms([]);
        }}
        className="w-full px-4 py-2 bg-medium-gray/20 text-medium-gray rounded-lg font-semibold text-sm hover:bg-medium-gray/30 transition-colors"
      >
        Cancel
      </button>
    </div>
  );
}

interface BreakoutRoomCardProps {
  room: BreakoutRoomAssignment;
  roomIndex: number;
  allParticipants: string[];
  onAssign: (participantId: string, roomIndex: number) => void;
}

function BreakoutRoomCard({ room, roomIndex, allParticipants, onAssign }: BreakoutRoomCardProps) {
  return (
    <div className="bg-medium-gray/10 border border-medium-gray/20 rounded-lg p-4">
      <h4 className="text-soft-gray font-semibold mb-3 uppercase text-sm tracking-wide">
        {room.roomName}
      </h4>

      {room.participantIds.length === 0 ? (
        <p className="text-medium-gray text-sm italic mb-2">No participants assigned</p>
      ) : (
        <div className="space-y-2 mb-3">
          {room.participantIds.map(participantId => (
            <ParticipantChip
              key={participantId}
              participantId={participantId}
              onRemove={() => onAssign(participantId, -1)}
            />
          ))}
        </div>
      )}

      {/* Add Participant Dropdown */}
      <select
        onChange={(e) => {
          if (e.target.value) {
            onAssign(e.target.value, roomIndex);
            e.target.value = '';
          }
        }}
        className="w-full px-3 py-2 bg-medium-gray/10 border border-medium-gray/30 rounded text-soft-gray text-sm focus:outline-none focus:border-neon-teal"
        defaultValue=""
      >
        <option value="" disabled>Add participant...</option>
        {allParticipants.map(participantId => (
          <ParticipantOption key={participantId} participantId={participantId} />
        ))}
      </select>
    </div>
  );
}

function ParticipantChip({ participantId, onRemove }: { participantId: string; onRemove: () => void }) {
  const userName = useParticipantProperty(participantId, 'user_name');

  return (
    <div className="flex items-center justify-between bg-neon-teal/10 border border-neon-teal/30 rounded px-3 py-2">
      <span className="text-soft-gray text-sm font-semibold">
        {userName || 'Guest'}
      </span>
      <button
        onClick={onRemove}
        className="text-accent-orange hover:text-accent-orange/80 text-xs font-bold"
      >
        Remove
      </button>
    </div>
  );
}

function ParticipantOption({ participantId }: { participantId: string }) {
  const userName = useParticipantProperty(participantId, 'user_name');
  return <option value={participantId}>{userName || 'Guest'}</option>;
}

