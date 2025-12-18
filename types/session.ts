export interface VideoSession {
  classroomId: number;
  dailyRoomUrl: string;
  participants: Participant[];
  localParticipant: Participant;
  connectionState: ConnectionState;
  startedAt?: Date;
}

export interface Participant {
  participantId: string;
  userName: string;
  audioTrack?: MediaStreamTrack;
  videoTrack?: MediaStreamTrack;
  isLocal: boolean;
  isMuted: boolean;
  isOwner: boolean;
}

export enum ConnectionState {
  IDLE = 'idle',
  JOINING = 'joining',
  JOINED = 'joined',
  RECONNECTING = 'reconnecting',
  LEFT = 'left',
  ERROR = 'error'
}

