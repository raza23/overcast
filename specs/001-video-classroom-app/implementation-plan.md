# Implementation Plan: Overcast Video Classroom Application

## Project Overview

**Feature**: Video-based classroom application with lobby, live video sessions, and instructor controls  
**Branch**: `001-video-classroom-app`  
**Status**: In Development  
**Timeline**: Sprint 1 (MVP)

## Technical Context

### Technology Stack
- **Framework**: Next.js 14+ (App Router, TypeScript)
- **Video Platform**: Daily.co (@daily-co/daily-react, @daily-co/daily-js)
- **State Management**: Jotai (peer dependency of Daily React)
- **Styling**: Tailwind CSS 3.x with custom Overclock theme
- **Deployment**: Vercel (serverless functions for future enhancements)

### Key Dependencies
```json
{
  "next": "^14.0.0",
  "react": "^18.2.0",
  "@daily-co/daily-react": "latest",
  "@daily-co/daily-js": "latest",
  "jotai": "latest",
  "tailwindcss": "^3.0.0",
  "typescript": "^5.0.0"
}
```

### Architecture Decisions (from research.md)
✅ Daily.co for WebRTC video platform  
✅ Pre-defined room URLs (no database)  
✅ localStorage for user name persistence  
✅ Daily owner/moderator roles for instructor permissions  
✅ Next.js App Router for navigation  
✅ Tailwind CSS with Overclock visual theme  

## Constitution Check

### Design Principles ✅
- **User-first**: Simple lobby → classroom navigation in < 5 seconds
- **Performance**: < 5 seconds buffering per 10 minutes viewing
- **Accessibility**: Clear visual hierarchy, keyboard navigation support
- **Maintainability**: TypeScript types, modular components, documented APIs

### Technical Standards ✅
- TypeScript strict mode enabled
- ESLint + Prettier configured
- Component-driven architecture
- Responsive design (desktop focus, mobile-aware)

### Security Considerations ✅
- Daily meeting tokens with expiration
- Client-side role enforcement (UI only)
- Daily.co backend enforces permissions
- No sensitive data storage

### Quality Gates
- [ ] All P1 acceptance scenarios passing
- [ ] TypeScript compiles without errors
- [ ] Tailwind visual theme matches Overclock spec
- [ ] Daily.co video connects in < 5 seconds
- [ ] 15-participant capacity enforced

---

## Phase 0: Research & Foundation ✅

**Status**: Complete

**Outputs**:
- ✅ `research.md` - All technology decisions documented
- ✅ `data-model.md` - Entity definitions and relationships
- ✅ `implementation-plan.md` - This document

**Key Decisions Resolved**:
- Video platform: Daily.co selected
- State management: Jotai + Daily hooks
- No database: Configuration file approach
- Instructor permissions: Daily owner tokens
- Breakout rooms: Daily native API

---

## Phase 1: Project Setup & Configuration

**Goal**: Initialize Next.js project with all dependencies and configuration

### Tasks

#### 1.1 Initialize Next.js Project
```bash
cd /Users/razashareef/Documents/OverClock\ Work/overcast
npm install
```

#### 1.2 Install Daily.co Dependencies
```bash
npm install @daily-co/daily-react @daily-co/daily-js jotai
```

#### 1.3 Configure Tailwind CSS with Overclock Theme
- Extend `tailwind.config.ts` with custom colors
- Add custom fonts (geometric sans-serif)
- Configure JIT mode

**Custom Theme**:
```typescript
colors: {
  'neon-teal': '#00FFD1',
  'accent-orange': '#FFBD17',
  'deep-black': '#000000',
  'soft-gray': '#E5E5E5'
}
```

#### 1.4 Create Type Definitions
- `/types/classroom.ts`
- `/types/user.ts`
- `/types/session.ts`
- `/types/breakout.ts`

#### 1.5 Create Classroom Configuration
- `/config/classrooms.ts` - 6 pre-defined classrooms

**Example**:
```typescript
export const CLASSROOMS = [
  {
    id: 1,
    name: "Cohort 1",
    roomUrl: "https://overcast.daily.co/cohort-1",
    maxCapacity: 15
  },
  // ... 5 more
];
```

**Deliverables**:
- ✅ Dependencies installed
- ✅ TypeScript configured
- ✅ Tailwind extended with Overclock theme
- ✅ Type definitions created
- ✅ Configuration file with 6 classrooms

---

## Phase 2: Core UI Components (No Video Yet)

**Goal**: Build static UI components with routing and navigation

### Tasks

#### 2.1 Create Layout Component
- `/app/layout.tsx` - Root layout with Overclock branding
- Header with logo, Students/Instructors toggle
- Footer with "Powered by Overclock Accelerator"

#### 2.2 Build Lobby Page (`/`)
- Display 6 classroom cards in grid layout
- Each card shows: cohort name, capacity status (placeholder)
- "Join" button for each classroom
- Responsive grid (3x2 on desktop, 2x3 on tablet, 1x6 on mobile)

#### 2.3 Create Classroom Page (`/classroom/[cohortId]`)
- Dynamic route for classroom ID (1-6)
- Video placeholder area (gray box with "Video will appear here")
- "Return to Main Lobby" button
- Conditional instructor control panel (if instructor mode)

#### 2.4 Implement Mode Toggle
- React Context or Jotai atom for user mode
- Toggle button in header (Students ↔ Instructors)
- Mode persists across navigation
- Mode reset when explicitly toggled

#### 2.5 Create Name Entry Modal
- Modal prompts for name on first classroom join
- Stores name in localStorage
- Pre-fills name on subsequent joins
- Allow name edit from settings menu

**Deliverables**:
- ✅ Lobby page with 6 classroom cards
- ✅ Classroom page with placeholder
- ✅ Navigation between pages working
- ✅ Mode toggle functional
- ✅ Name entry modal implemented

**Testing**: Can navigate lobby → classroom → lobby without errors

---

## Phase 3: Daily.co Video Integration

**Goal**: Replace placeholders with live Daily.co video streams

### Tasks

#### 3.1 Create Daily Provider Setup
- Wrap app with `<DailyProvider>`
- Create custom hook: `useDailyRoom(roomUrl, userName)`
- Handle Daily call object lifecycle

#### 3.2 Build Video Component
- `/app/components/VideoGrid.tsx`
- Display all participant video tiles
- Use `useParticipantIds()` and `useVideoTrack()` hooks
- Grid layout: 3x3 for up to 9 participants, 4x4 for 10-16

#### 3.3 Implement Join/Leave Logic
- Join room when entering classroom page
- Pass userName from localStorage
- Leave room when clicking "Return to Lobby"
- Leave room when navigating away

#### 3.4 Add Connection State Handling
- Loading spinner while joining
- Error message if join fails
- Reconnection UI if connection drops
- "No active session" placeholder if no participants

#### 3.5 Display Participant Names
- Show userName below each video tile
- Highlight local participant (different border color)
- Update names when participants join/leave

**Deliverables**:
- ✅ Daily.co video streaming functional
- ✅ Participants can see each other
- ✅ Audio/video broadcasting works
- ✅ Names displayed correctly
- ✅ Connection states handled

**Testing**: 2+ users can join same classroom and see/hear each other

---

## Phase 4: Capacity Management

**Goal**: Enforce 15-participant limit and display capacity status

### Tasks

#### 4.1 Create Capacity Hook
- `useClassroomCapacity(classroomId)`
- Queries Daily room info API
- Returns current count and max capacity

#### 4.2 Update Lobby Cards
- Display "X/15 participants" on each card
- Show "Full" badge if at capacity
- Disable "Join" button when full
- Refresh capacity every 10 seconds

#### 4.3 Enforce Capacity Check
- Before joining, check if room is full
- Show modal: "This classroom is full (15/15)"
- Prevent join action
- Suggest trying another classroom

**Deliverables**:
- ✅ Real-time capacity displayed in lobby
- ✅ Join prevented when room full
- ✅ Clear messaging to users

**Testing**: 16th user cannot join a full classroom (15 already in)

---

## Phase 5: Instructor Mode & Control Panel

**Goal**: Add instructor-specific UI and basic controls

### Tasks

#### 5.1 Create Control Panel Component
- `/app/components/ControlPanel.tsx`
- Visible only when user mode is INSTRUCTOR
- Positioned below video grid
- Tabs: "Participants", "Breakout Rooms"

#### 5.2 Build Participants Tab
- List all active participants
- Show mute status (icon)
- "Mute" / "Unmute" button per participant
- "Mute All" / "Unmute All" buttons

#### 5.3 Implement Meeting Token Logic
- Generate meeting token based on user mode
- Student token: `isOwner: false`
- Instructor token: `isOwner: true`
- Pass token to `daily.join()`

#### 5.4 Verify Permission Enforcement
- Instructor can see control panel
- Student cannot see control panel
- Test: Student mode user sees no admin features

**Deliverables**:
- ✅ Control panel renders for instructors only
- ✅ Participant list populated
- ✅ Mode-based permissions working

**Testing**: Instructor sees control panel, student does not

---

## Phase 6: Participant Muting

**Goal**: Enable instructors to mute participants

### Tasks

#### 6.1 Implement Mute Individual
- "Mute" button calls `daily.updateParticipant(id, { setAudio: false })`
- Update UI to show muted state
- "Unmute" button re-enables audio

#### 6.2 Implement Mute All
- Iterate through all remote participants
- Call `updateParticipant` for each
- Update all UI states simultaneously

#### 6.3 Add Audio Status Indicators
- Muted icon on video tiles (for all users to see)
- Different color for instructor-muted vs. self-muted
- Update in real-time when mute status changes

#### 6.4 Handle Edge Cases
- Disable mute button if participant leaves
- Show "Cannot mute: Participant left" tooltip
- Refresh participant list when people join/leave

**Deliverables**:
- ✅ Instructor can mute individual participants
- ✅ Instructor can mute all participants
- ✅ Mute status visible to all users
- ✅ Edge cases handled

**Testing**: Instructor mutes student, student's audio stops broadcasting

---

## Phase 7: Breakout Rooms

**Goal**: Enable instructors to create and manage breakout rooms

### Tasks

#### 7.1 Create Breakout Rooms Tab
- "Begin Breakout Rooms" button
- Input: Number of rooms (2-6)
- Room creation UI

#### 7.2 Implement Room Assignment UI
- Drag-and-drop interface (or simple dropdown)
- Assign each participant to a breakout room
- Visual grouping of assigned participants

#### 7.3 Integrate Daily Breakout API
- Call `daily.startBreakout({ rooms: [...] })`
- Pass room assignments
- Handle breakout room URLs

#### 7.4 Handle Breakout Transitions
- Auto-navigate participants to breakout room
- Display "You are in Breakout Room 2" message
- Instructor can monitor/join any breakout room

#### 7.5 Implement End Breakout
- "End Breakout Rooms" button
- Call `daily.stopBreakout()`
- Return all participants to main classroom

**Deliverables**:
- ✅ Instructor can create multiple breakout rooms
- ✅ Instructor can assign participants
- ✅ Participants automatically enter breakout rooms
- ✅ Complete audio/video isolation verified
- ✅ Instructor can end breakout session

**Testing**: Create 3 breakout rooms, assign participants, verify isolation

---

## Phase 8: Visual Styling & Polish

**Goal**: Apply Overclock visual aesthetic and final UX polish

### Tasks

#### 8.1 Apply Color Palette
- Black backgrounds throughout
- Neon teal (#00FFD1) for CTAs and highlights
- Accent orange (#FFBD17) for urgency indicators
- Soft gray text on black background

#### 8.2 Typography & Layout
- Bold geometric sans-serif headers (uppercase)
- Clean white/gray body text
- Ample negative space (grid gaps, padding)
- Card-based layouts with minimal borders

#### 8.3 Add Futuristic Graphics
- Hero background: grid particles or data waves
- Classroom cards: subtle gradient overlays
- Control panel: sleek tech aesthetic
- Hover states with neon teal glow

#### 8.4 Responsive Design
- Mobile-friendly lobby grid
- Video grid adapts to screen size
- Control panel collapses on small screens
- Touch-friendly buttons

#### 8.5 Loading & Error States
- Animated loading spinners (neon teal)
- Error messages with retry buttons
- Empty states with helpful messaging
- Connection status indicators

**Deliverables**:
- ✅ Overclock visual aesthetic applied
- ✅ Responsive across devices
- ✅ Smooth animations and transitions
- ✅ Professional, polished UI

**Testing**: Visual QA on desktop, tablet, mobile

---

## Phase 9: Testing & Refinement

**Goal**: Verify all requirements and success criteria

### Test Scenarios

#### User Story 1 (P1) - Student Joins Classroom
- [ ] AS-1.1: Lobby displays 6 classrooms
- [ ] AS-1.2: Name entry prompt appears
- [ ] AS-1.3: User enters classroom with name visible
- [ ] AS-1.4: Live video feed displays
- [ ] AS-1.5: Other participants see/hear new user
- [ ] AS-1.6: "Return to Lobby" button works
- [ ] AS-1.7: Can switch to different classroom
- [ ] AS-1.8: Cohort names visible

#### User Story 2 (P2) - Instructor Mode
- [ ] AS-2.1: Instructor mode activates from toggle
- [ ] AS-2.2: Sees same 6 classrooms
- [ ] AS-2.3: Control panel appears in classroom
- [ ] AS-2.4: Has access to instructor features
- [ ] AS-2.5: Returns to lobby in instructor mode

#### User Story 3 (P3) - Mute Participants
- [ ] AS-3.1: Participant list visible with audio controls
- [ ] AS-3.2: Can mute individual participant
- [ ] AS-3.3: "Mute All" works
- [ ] AS-3.4: Can unmute participant
- [ ] AS-3.5: Muted participants don't broadcast audio

#### User Story 4 (P3) - Breakout Rooms
- [ ] AS-4.1: "Begin Breakout Rooms" button works
- [ ] AS-4.2: Can specify number of rooms
- [ ] AS-4.3: Can assign participants to rooms
- [ ] AS-4.4: Participants auto-transition to breakout rooms
- [ ] AS-4.5: Complete isolation verified
- [ ] AS-4.6: Instructor can monitor/join breakout rooms
- [ ] AS-4.7: "End Breakout Rooms" returns all to main session

#### Edge Cases
- [ ] No active video feed → placeholder message
- [ ] Student cannot access instructor features
- [ ] Connection loss → reconnection UI
- [ ] Capacity status displayed correctly
- [ ] Room full → join prevented
- [ ] Mute unavailable participant → button disabled
- [ ] Breakout room when session ends → return to lobby
- [ ] Mode switch during session → return to lobby
- [ ] Duplicate names → allowed, no error

### Success Criteria Verification
- [ ] SC-001: Lobby → classroom in < 5 seconds
- [ ] SC-002: Classroom switching without errors
- [ ] SC-003: Instructor mode in 2 clicks
- [ ] SC-004: Mute takes effect in < 2 seconds
- [ ] SC-005: 100% breakout room assignment success
- [ ] SC-006: 90% users join classroom first attempt
- [ ] SC-007: All 6 classrooms display capacity
- [ ] SC-007a: 15-participant limit enforced 100%
- [ ] SC-008: < 5 seconds buffering per 10 minutes
- [ ] SC-009: Mode switching 100% reliable
- [ ] SC-010: 0% unauthorized instructor access

---

## Deployment Plan

### Local Development
```bash
npm run dev
# Access at http://localhost:3000
```

### Environment Variables (`.env.local`)
```
NEXT_PUBLIC_DAILY_DOMAIN=overcast.daily.co
DAILY_API_KEY=your_daily_api_key
```

### Vercel Deployment (Future)
1. Connect GitHub repository to Vercel
2. Configure environment variables in Vercel dashboard
3. Deploy on commit to `main` branch
4. Custom domain: `overcast.yourdomain.com`

---

## Risk Mitigation

| Risk | Impact | Mitigation |
|------|--------|-----------|
| Daily.co rate limits | High | Use meeting tokens, monitor usage |
| 15-participant limit too restrictive | Medium | Document in user docs, add waitlist feature |
| Breakout rooms complex | High | Implement last (P3), use Daily's native API |
| Browser WebRTC compatibility | Medium | Test on Chrome, Firefox, Safari; show compatibility warning |
| Network instability | Medium | Implement reconnection logic, show network quality indicator |

---

## Next Steps

1. **Immediate**: Complete Phase 1 (project setup)
2. **Sprint 1**: Phases 2-4 (core UI and video)
3. **Sprint 2**: Phases 5-7 (instructor features)
4. **Sprint 3**: Phase 8-9 (polish and testing)

## Dependencies & Blockers

**Blockers**:
- [ ] Daily.co account created with 6 room URLs

**Dependencies**:
- Daily.co API documentation
- Overclock brand assets (logo, fonts)
- Test users for multi-participant testing

---

## Questions for Review

1. Should we add recording functionality? (Not in current spec)
2. Should we add chat alongside video? (Not in current spec)
3. Do we need analytics/logging? (Future enhancement)
4. Should instructors be able to kick participants? (Not in spec, could add)

---

**Document Version**: 1.0  
**Last Updated**: 2025-12-18  
**Owner**: Engineering Team

