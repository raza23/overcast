export interface BreakoutRoom {
  id: string;
  name: string;
  assignedParticipantIds: string[];
  dailyRoomUrl: string;
  isActive: boolean;
}

export interface BreakoutSession {
  rooms: BreakoutRoom[];
  isActive: boolean;
  createdBy: string;
}

