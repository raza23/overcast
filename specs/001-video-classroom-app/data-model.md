# Data Model: Overcast Video Classroom Application

## Overview

This document defines the core entities and their relationships for the Overcast video classroom application. Since this is a local-first application without a database, these models represent runtime state and configuration structures.

## Core Entities

### 1. Classroom (Cohort)

Represents one of the 6 available classroom sessions that users can join.

**Properties**:
```typescript
interface Classroom {
  id: number;                    // Unique identifier (1-6)
  name: string;                  // Display name (e.g., "Cohort 1")
  roomUrl: string;               // Daily.co room URL
  maxCapacity: number;           // Maximum participants (15)
  currentCapacity?: number;      // Current participant count (runtime)
  status: ClassroomStatus;       // Session state (runtime)
}

enum ClassroomStatus {
  NOT_STARTED = 'not-started',
  IN_SESSION = 'in-session',
  ENDED = 'ended',
  FULL = 'full'
}
```

**Validation Rules**:
- `id` must be 1-6
- `name` must not be empty
- `roomUrl` must be valid Daily.co URL format
- `maxCapacity` must equal 15 (per FR-003a)
- `currentCapacity` must not exceed `maxCapacity`

**State Transitions**:
```
NOT_STARTED → IN_SESSION (when first participant joins)
IN_SESSION → FULL (when currentCapacity === maxCapacity)
FULL → IN_SESSION (when participant leaves and currentCapacity < maxCapacity)
IN_SESSION → ENDED (when last participant leaves or session manually ended)
```

**Source**: Configuration file (`/config/classrooms.ts`), Daily.co API for runtime capacity

**Requirements**: FR-001, FR-003, FR-003a, FR-003b, FR-004a

---

### 2. User (Participant)

Represents a person using the Overcast application.

**Properties**:
```typescript
interface User {
  displayName: string;           // User-entered name (from localStorage)
  mode: UserMode;                // Current role
  currentLocation: Location;     // Where user is in app
  dailyParticipantId?: string;   // Daily.co participant ID (when in session)
  audioEnabled: boolean;         // Audio broadcast state
  videoEnabled: boolean;         // Video broadcast state
  isMuted: boolean;              // Muted by instructor (if applicable)
}

enum UserMode {
  STUDENT = 'student',
  INSTRUCTOR = 'instructor'
}

interface Location {
  type: LocationType;
  classroomId?: number;          // Present if in classroom
  breakoutRoomId?: string;       // Present if in breakout room
}

enum LocationType {
  LOBBY = 'lobby',
  CLASSROOM = 'classroom',
  BREAKOUT_ROOM = 'breakout-room'
}
```

**Validation Rules**:
- `displayName` must not be empty (prompted before joining)
- `displayName` can be duplicate (per edge case decision)
- `mode` persists across navigation until explicitly changed (FR-011)
- `currentLocation.classroomId` must be valid (1-6) when in classroom

**State Transitions**:
```
mode: STUDENT ↔ INSTRUCTOR (via navigation toggle)
location.type: LOBBY → CLASSROOM → BREAKOUT_ROOM → CLASSROOM → LOBBY
audioEnabled: true ↔ false (user controls)
videoEnabled: true ↔ false (user controls)
isMuted: false → true (instructor action), true → false (instructor action)
```

**Source**: 
- localStorage for `displayName`
- React state for `mode`, `currentLocation`
- Daily.co participant state for audio/video/mute status

**Requirements**: FR-002a, FR-002b, FR-005a, FR-011

---

### 3. VideoSession

Represents the active Daily.co call for a classroom.

**Properties**:
```typescript
interface VideoSession {
  classroomId: number;           // Associated classroom
  dailyRoomUrl: string;          // Daily.co room URL
  participants: Participant[];   // All active participants
  localParticipant: Participant; // Current user
  connectionState: ConnectionState;
  startedAt?: Date;
  breakoutSession?: BreakoutSession;
}

interface Participant {
  participantId: string;         // Daily.co unique ID
  userName: string;              // Display name
  audioTrack?: MediaStreamTrack;
  videoTrack?: MediaStreamTrack;
  isLocal: boolean;
  isMuted: boolean;
  isOwner: boolean;              // True for instructors
}

enum ConnectionState {
  IDLE = 'idle',
  JOINING = 'joining',
  JOINED = 'joined',
  RECONNECTING = 'reconnecting',
  LEFT = 'left',
  ERROR = 'error'
}
```

**Validation Rules**:
- Maximum 15 participants (enforced by capacity check before join)
- `participants` array must include `localParticipant`
- Only one local participant per session

**State Transitions**:
```
connectionState:
IDLE → JOINING → JOINED ↔ RECONNECTING → JOINED
JOINED → LEFT
JOINING → ERROR
```

**Source**: Daily.co call object via `@daily-co/daily-react` hooks

**Requirements**: FR-005, FR-005a, FR-005b, Edge case 3 (reconnection)

---

### 4. ControlPanel

Container for instructor-specific features (UI model, not data model).

**Properties**:
```typescript
interface ControlPanel {
  visible: boolean;              // Only true for instructor mode
  activeTab: ControlPanelTab;
  participants: ParticipantControl[];
  breakoutRooms: BreakoutRoom[];
}

enum ControlPanelTab {
  PARTICIPANTS = 'participants',
  BREAKOUT_ROOMS = 'breakout-rooms'
}

interface ParticipantControl {
  participantId: string;
  userName: string;
  isMuted: boolean;
  canMute: boolean;              // False if participant left
}
```

**Validation Rules**:
- `visible` must be false if user mode is STUDENT (FR-010)
- `participants` must match actual video session participants

**Source**: Derived from VideoSession state + user mode

**Requirements**: FR-009, FR-010, FR-012, FR-013

---

### 5. BreakoutRoom

Represents a sub-session within a classroom for small group work.

**Properties**:
```typescript
interface BreakoutRoom {
  id: string;                    // Unique identifier
  name: string;                  // Display name (e.g., "Breakout 1")
  assignedParticipantIds: string[];  // Daily participant IDs
  dailyRoomUrl: string;          // Daily breakout room URL
  isActive: boolean;             // Whether participants are in breakout
}

interface BreakoutSession {
  rooms: BreakoutRoom[];
  isActive: boolean;
  createdBy: string;             // Instructor participantId
}
```

**Validation Rules**:
- Participants can only be assigned to one breakout room at a time
- All `assignedParticipantIds` must correspond to valid participants in main session
- Minimum 2 participants per breakout room (reasonable assumption)
- Maximum participants per breakout room: 15 (inherited from classroom limit)

**State Transitions**:
```
BreakoutSession:
null → created (instructor clicks "Begin Breakout Rooms")
created → active (instructor assigns participants and activates)
active → ended (instructor clicks "End Breakout Rooms")
ended → null
```

**Source**: Daily.co breakout rooms API

**Requirements**: FR-014, FR-015, FR-016, FR-017, FR-018, Edge case 7

---

## Entity Relationships

```
Classroom (1) ──< (1) VideoSession
                      │
                      │ contains
                      │
                      ├──< (0..15) Participant
                      │
                      └──< (0..1) BreakoutSession
                                  │
                                  └──< (2..n) BreakoutRoom
                                              │
                                              └──< (1..15) Participant

User (1) ──< (0..1) Participant (when joined to session)
     (1) ──< (1) UserMode (student or instructor)
```

## Configuration vs. Runtime State

### Configuration (Static)
Stored in `/config/classrooms.ts`:
- 6 Classroom definitions (id, name, roomUrl, maxCapacity)

### Runtime State (Dynamic)
Managed in React state / Daily.co:
- Classroom.currentCapacity
- Classroom.status
- User preferences (mode, displayName)
- VideoSession state (participants, connection)
- ControlPanel state (only for instructors)
- BreakoutSession state (when active)

## Storage Strategy

| Data | Storage Location | Persistence |
|------|------------------|-------------|
| User displayName | localStorage | Across sessions |
| User mode | React state | Current session only |
| Classroom config | Static TypeScript file | Permanent |
| Classroom capacity | Daily.co API query | Real-time |
| Video session state | Daily.co hooks | Active call only |
| Breakout assignments | Daily.co API | Active breakout only |

## API Integration Points

### Daily.co API Endpoints/Methods Used

1. **Join Room**: `daily.join({ url, userName, token })`
2. **Leave Room**: `daily.leave()`
3. **Get Participants**: `useParticipantIds()`, `useParticipantProperty()`
4. **Mute Participant**: `daily.updateParticipant(participantId, { setAudio: false })`
5. **Start Breakout**: `daily.startBreakout({ rooms: [...] })`
6. **Stop Breakout**: `daily.stopBreakout()`
7. **Get Room Info**: `daily.room()` (for capacity checks)

### Meeting Token Structure

```typescript
interface MeetingToken {
  roomName: string;
  isOwner: boolean;              // true for instructors
  userName: string;
  expiration: number;            // Unix timestamp
}
```

Tokens generated per user mode:
- **Student**: `isOwner: false` (no admin permissions)
- **Instructor**: `isOwner: true` (can mute, start breakout, etc.)

## Validation Summary

### Enforced by Client
- Name entry before joining (FR-002a)
- Capacity check before joining (FR-003a, FR-004a)
- Mode-based UI visibility (FR-010)
- Breakout room participant uniqueness (FR-016)

### Enforced by Daily.co
- Maximum 15 participants per room
- Instructor permissions (mute, breakout controls)
- Breakout room isolation (complete audio/video separation)
- Connection stability and reconnection

## Performance Considerations

- Classroom capacity fetched only in lobby (not in active session)
- Participant list updates via Daily.co event stream (efficient)
- React state updates batched for UI performance
- No database queries → zero latency from data layer

## Next Implementation Steps

1. Create `/config/classrooms.ts` with 6 classroom definitions
2. Create TypeScript interfaces in `/types/` directory
3. Implement React hooks for user state management
4. Integrate Daily.co hooks for video session state
5. Build UI components using these data models

