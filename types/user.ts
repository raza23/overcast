export interface User {
  displayName: string;
  mode: UserMode;
  currentLocation: Location;
  dailyParticipantId?: string;
  audioEnabled: boolean;
  videoEnabled: boolean;
  isMuted: boolean;
}

export enum UserMode {
  STUDENT = 'student',
  INSTRUCTOR = 'instructor'
}

export interface Location {
  type: LocationType;
  classroomId?: number;
  breakoutRoomId?: string;
}

export enum LocationType {
  LOBBY = 'lobby',
  CLASSROOM = 'classroom',
  BREAKOUT_ROOM = 'breakout-room'
}

