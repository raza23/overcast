# Research Document: Overcast Video Classroom Application

## Decision Log

### 1. Video Platform Selection: Daily.co

**Decision**: Use Daily.co as the WebRTC platform for video streaming

**Rationale**:
- Daily provides pre-built React hooks (`@daily-co/daily-react`) that simplify state management
- Native support for features required by spec: participant management, muting, breakout rooms
- No backend infrastructure needed - can use pre-configured room URLs
- Supports up to 15 participants per room (matches requirement FR-003a)
- Clean TypeScript API with comprehensive documentation
- Works seamlessly with Next.js and Vercel serverless functions

**Alternatives Considered**:
- Agora.io: More complex setup, requires backend token generation
- Twilio Video: Higher complexity, needs backend for access tokens
- 100ms: Good alternative but less mature ecosystem
- Jitsi: Open source but requires more infrastructure management

### 2. State Management: Jotai (Daily React Dependency)

**Decision**: Use Jotai for state management (peer dependency of @daily-co/daily-react)

**Rationale**:
- Required peer dependency for @daily-co/daily-react
- Minimal, atomic state management approach
- No need for additional state library (Redux, Zustand, etc.)
- Integrates naturally with Daily's hooks API
- Lightweight and performant for real-time applications

**Implementation Notes**:
- User mode (student/instructor) → local state
- Current classroom → local state
- Participant list, mute status → managed by Daily hooks
- Breakout room assignments → local state with Daily room transitions

### 3. Routing: Next.js App Router

**Decision**: Use Next.js 14+ App Router for navigation

**Rationale**:
- Built-in routing eliminates need for additional libraries
- Server Components for initial page loads
- Dynamic routes for classroom pages: `/classroom/[cohortId]`
- Client Components for real-time video interactions
- Supports serverless API routes for future enhancements

**Route Structure**:
```
/ → Lobby (shows 6 classrooms)
/classroom/[cohortId] → Classroom session page
/api/room-info → Serverless function to validate room capacity (future)
```

### 4. Styling: Tailwind CSS with Custom Overclock Theme

**Decision**: Tailwind CSS with extended configuration for Overclock visual identity

**Rationale**:
- Rapid development with utility classes
- Consistent design system enforcement
- Easy to match specified visual aesthetic (neon teal, black, geometric fonts)
- JIT compiler keeps bundle size minimal
- No runtime CSS-in-JS overhead

**Custom Theme Configuration**:
```javascript
colors: {
  'neon-teal': '#00FFD1',
  'accent-orange': '#FFBD17',
  'deep-black': '#000000',
  'soft-gray': '#E5E5E5'
}
fonts: {
  'sans': ['Inter', 'system-ui', 'sans-serif'] // Geometric sans-serif
}
```

### 5. Daily Room Configuration Strategy

**Decision**: Pre-defined Daily room URLs stored in configuration file (no database)

**Rationale**:
- Requirement: "avoid using a database" for local development
- Each of 6 classrooms maps to a unique Daily room URL
- Room URLs can be created via Daily Dashboard or API
- Configuration stored in `/config/classrooms.ts`
- Easy to update for different cohorts/sessions

**Configuration Structure**:
```typescript
export const CLASSROOMS = [
  {
    id: 1,
    name: "Cohort 1",
    roomUrl: "https://your-domain.daily.co/cohort-1",
    maxCapacity: 15
  },
  // ... 5 more classrooms
]
```

### 6. User Identification: Local Storage + Daily Meeting Tokens

**Decision**: Simple name entry stored in localStorage, passed to Daily as userName

**Rationale**:
- No authentication required (per spec clarification)
- localStorage persists name across navigation
- Daily's `userName` property displays name to other participants
- Meets FR-002a and FR-002b requirements
- Simple implementation without backend auth

**Implementation**:
```typescript
// On name entry
localStorage.setItem('overcast-username', userName);

// When joining Daily room
daily.join({ 
  userName: localStorage.getItem('overcast-username'),
  url: roomUrl 
});
```

### 7. Capacity Management: Daily Participant Count API

**Decision**: Use Daily's participant count API with client-side capacity enforcement

**Rationale**:
- Daily provides `useParticipantIds()` hook to count participants
- Can display real-time capacity: "8/15 participants"
- Client-side check before joining prevents over-capacity
- Meets FR-003a, FR-003b, FR-004a requirements
- No backend needed for MVP

**Implementation Strategy**:
- Lobby polls participant count for each room (using Daily API)
- Display capacity status
- Disable "Join" button when room is full
- Show "Room Full" message

### 8. Instructor Features: Daily Owner/Moderator Permissions

**Decision**: Use Daily's meeting owner/moderator roles for instructor privileges

**Rationale**:
- Daily supports granular permissions (updateParticipants, canAdmin)
- Instructors can be designated as meeting owners via meeting token
- Owners can mute participants, start breakout rooms
- Mode selection (student/instructor) determines which meeting token to use
- Clean separation of capabilities without custom backend logic

**Permission Mapping**:
- Student mode → guest token (view, broadcast, no admin)
- Instructor mode → owner token (all permissions)

### 9. Breakout Rooms: Daily Breakout Rooms API

**Decision**: Use Daily's native breakout rooms feature

**Rationale**:
- Daily has built-in breakout rooms API (`daily.startBreakout()`)
- Supports creating multiple rooms, assigning participants
- Complete audio/video isolation (meets FR-017 requirement)
- Instructor can monitor/join any breakout room
- Matches spec acceptance criteria exactly

**API Usage**:
```typescript
// Create breakout rooms
daily.startBreakout({
  rooms: [
    { name: 'Breakout 1', participants: ['user1', 'user2'] },
    { name: 'Breakout 2', participants: ['user3', 'user4'] }
  ]
});

// End breakout rooms
daily.stopBreakout();
```

### 10. Error Handling & Edge Cases

**Decision**: Client-side error boundaries + Daily event listeners

**Edge Case Implementations**:

1. **No active video feed** (Edge case 1):
   - Listen to Daily `'participant-joined'` event
   - Show placeholder: "Classroom session has not started" if no participants

2. **Internet connection loss** (Edge case 3):
   - Daily emits `'call-quality-warning'` and `'network-quality-change'` events
   - Display reconnection UI
   - Daily automatically attempts reconnection

3. **Room full** (Edge case 5):
   - Check participant count before `daily.join()`
   - Display "Full" badge in lobby
   - Prevent join action

4. **Mode switching during session** (Edge case 8):
   - On mode change → `daily.leave()` → redirect to lobby
   - Prevents confusion about available features

5. **Duplicate names** (Edge case 9):
   - Allow duplicate names (per spec decision)
   - Daily assigns unique `participantId` for internal tracking

## Technology Stack Summary

| Component | Technology | Version |
|-----------|-----------|---------|
| Framework | Next.js | 14+ (App Router) |
| Video Platform | Daily.co | Latest |
| React Library | @daily-co/daily-react | Latest |
| State Management | Jotai | Latest (peer dep) |
| Styling | Tailwind CSS | 3.x |
| Language | TypeScript | 5.x |
| Deployment | Vercel | N/A |

## Next Steps

1. Initialize Next.js project with TypeScript and Tailwind
2. Install Daily React dependencies
3. Create configuration file with 6 classroom URLs
4. Build lobby interface
5. Implement classroom video component
6. Add instructor controls
7. Integrate breakout rooms
8. Apply Overclock visual theme
9. Test all user stories and edge cases

## Open Questions Resolved

✅ **Q**: How to handle user identification without authentication?  
**A**: localStorage + Daily userName property

✅ **Q**: How to enforce 15-participant capacity limit?  
**A**: Daily participant count API + client-side validation

✅ **Q**: How to implement instructor-only features?  
**A**: Daily owner/moderator permissions via meeting tokens

✅ **Q**: How to achieve breakout room isolation?  
**A**: Daily's native breakout rooms API provides complete isolation

✅ **Q**: How to avoid database for MVP?  
**A**: Configuration file with pre-defined Daily room URLs

## Performance Considerations

- Daily handles WebRTC optimization automatically
- Tailwind JIT minimizes CSS bundle size
- Next.js code splitting reduces initial load
- Expected performance: < 5 seconds to join room (meets SC-001)
- Expected buffering: < 5 seconds per 10 minutes (meets SC-008)

## Security Considerations

- Daily room URLs should use meeting tokens (not public rooms)
- Meeting tokens can have expiration times
- Instructor tokens require different permissions
- No sensitive data stored (no database, no auth)
- Client-side role enforcement for UI only (Daily enforces on backend)

