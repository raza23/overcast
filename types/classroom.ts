export interface Classroom {
  id: number;
  name: string;
  roomUrl: string;
  maxCapacity: number;
  currentCapacity?: number;
  status: ClassroomStatus;
}

export enum ClassroomStatus {
  NOT_STARTED = 'not-started',
  IN_SESSION = 'in-session',
  ENDED = 'ended',
  FULL = 'full'
}

