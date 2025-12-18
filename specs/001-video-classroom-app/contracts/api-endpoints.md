# API Contracts: Overcast Video Classroom

This document defines the external API contracts and integrations for the Overcast application.

## Daily.co API Integration

Overcast integrates with Daily.co's REST API and WebRTC platform.

### Room Management API

#### Get Room Information

**Endpoint**: `GET https://api.daily.co/v1/rooms/:roomName`

**Headers**:
```
Authorization: Bearer {DAILY_API_KEY}
```

**Response**:
```json
{
  "id": "abc123",
  "name": "cohort-1",
  "api_created": true,
  "privacy": "public",
  "url": "https://yourdomain.daily.co/cohort-1",
  "created_at": "2025-12-18T10:00:00.000Z",
  "config": {
    "max_participants": 15
  }
}
```

**Usage in Overcast**: 
- Check room capacity before joining
- Display current participant count in lobby

#### Create Room

**Endpoint**: `POST https://api.daily.co/v1/rooms`

**Headers**:
```
Authorization: Bearer {DAILY_API_KEY}
Content-Type: application/json
```

**Request Body**:
```json
{
  "name": "cohort-1",
  "privacy": "public",
  "properties": {
    "max_participants": 15,
    "enable_chat": false,
    "enable_screenshare": true,
    "enable_recording": "cloud"
  }
}
```

**Response**: Same as Get Room Information

**Usage in Overcast**: 
- Programmatic room creation (production setup)
- Not used in MVP (rooms created via Dashboard)

### Meeting Tokens API

#### Create Meeting Token

**Endpoint**: `POST https://api.daily.co/v1/meeting-tokens`

**Headers**:
```
Authorization: Bearer {DAILY_API_KEY}
Content-Type: application/json
```

**Request Body**:
```json
{
  "properties": {
    "room_name": "cohort-1",
    "user_name": "John Doe",
    "is_owner": true,
    "enable_recording": "cloud",
    "start_video_off": false,
    "start_audio_off": false,
    "exp": 1703001600
  }
}
```

**Response**:
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Usage in Overcast**:
- Generate instructor tokens (`is_owner: true`)
- Generate student tokens (`is_owner: false`)
- Future enhancement for production security

## Daily.co Client SDK

### Join Room

**Method**: `daily.join(options)`

**Parameters**:
```typescript
{
  url: string;              // Room URL
  userName?: string;        // Display name
  token?: string;           // Meeting token (optional)
  startVideoOff?: boolean;  // Start with video off
  startAudioOff?: boolean;  // Start with audio off
}
```

**Returns**: `Promise<DailyParticipant>`

**Usage in Overcast**:
```typescript
await daily.join({
  url: classroom.roomUrl,
  userName: enteredName
});
```

### Update Participant (Mute Control)

**Method**: `daily.updateParticipant(sessionId, updates)`

**Parameters**:
```typescript
sessionId: string
updates: {
  setAudio?: boolean;     // Enable/disable audio
  setVideo?: boolean;     // Enable/disable video
  eject?: boolean;        // Remove from call
}
```

**Returns**: `Promise<DailyParticipant>`

**Usage in Overcast**:
```typescript
// Mute participant
await callObject.updateParticipant(participantId, {
  setAudio: false
});

// Unmute participant
await callObject.updateParticipant(participantId, {
  setAudio: true
});
```

### Start Breakout Rooms

**Method**: `daily.startBreakout(options)`

**Parameters**:
```typescript
{
  rooms: Array<{
    name: string;
    participants: string[];  // Array of session IDs
  }>
}
```

**Returns**: `Promise<void>`

**Usage in Overcast**:
```typescript
await daily.startBreakout({
  rooms: [
    {
      name: 'Breakout Room 1',
      participants: ['session-id-1', 'session-id-2']
    },
    {
      name: 'Breakout Room 2',
      participants: ['session-id-3', 'session-id-4']
    }
  ]
});
```

**Note**: Requires Daily Enterprise plan

### Stop Breakout Rooms

**Method**: `daily.stopBreakout()`

**Returns**: `Promise<void>`

**Usage in Overcast**:
```typescript
await daily.stopBreakout();
```

## React Hooks (Daily React)

### useParticipantIds

**Hook**: `useParticipantIds(options?)`

**Parameters**:
```typescript
{
  filter?: 'local' | 'remote' | 'owner';
  sort?: 'joined_at' | 'user_name';
}
```

**Returns**: `string[]` (Array of participant session IDs)

**Usage**:
```typescript
const participantIds = useParticipantIds();
```

### useParticipantProperty

**Hook**: `useParticipantProperty(sessionId, property)`

**Parameters**:
- `sessionId`: `string`
- `property`: `'user_name' | 'audio' | 'video' | 'owner'`

**Returns**: Value of the property (type varies by property)

**Usage**:
```typescript
const userName = useParticipantProperty(participantId, 'user_name');
const isAudioEnabled = useParticipantProperty(participantId, 'audio');
```

### useVideoTrack

**Hook**: `useVideoTrack(sessionId)`

**Returns**: 
```typescript
{
  track: MediaStreamTrack | null;
  state: 'playable' | 'loading' | 'interrupted' | 'off';
}
```

**Usage**:
```typescript
const videoTrack = useVideoTrack(participantId);
// Attach to video element in useEffect
```

### useAudioTrack

**Hook**: `useAudioTrack(sessionId)`

**Returns**: Same structure as `useVideoTrack`

**Usage**:
```typescript
const audioTrack = useAudioTrack(participantId);
// Attach to audio element in useEffect
```

## Internal API (Future Enhancement)

These endpoints could be added as Next.js API routes for enhanced functionality:

### GET /api/classrooms

**Purpose**: Get all classroom configurations with live capacity

**Response**:
```json
[
  {
    "id": 1,
    "name": "Cohort 1",
    "roomUrl": "https://domain.daily.co/cohort-1",
    "maxCapacity": 15,
    "currentCapacity": 8,
    "status": "in-session"
  }
]
```

### POST /api/meeting-token

**Purpose**: Generate meeting token based on user mode

**Request**:
```json
{
  "roomName": "cohort-1",
  "userName": "John Doe",
  "mode": "instructor"
}
```

**Response**:
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

## Rate Limits

### Daily.co API
- **Free Tier**: 1000 API calls/month
- **Pro Tier**: 10,000 API calls/month
- **WebRTC Connections**: No limit on free tier (up to 10 participants)

### Recommended Implementation
- Cache room information for 30 seconds
- Throttle capacity checks to max once every 10 seconds
- Use WebSocket events from Daily SDK instead of polling

## Error Handling

### Common Daily.co Errors

**Room Full**:
```json
{
  "error": "room-full",
  "info": "The room has reached its maximum participant limit"
}
```

**Invalid Token**:
```json
{
  "error": "invalid-token",
  "info": "The meeting token is expired or invalid"
}
```

**Network Error**:
```json
{
  "error": "network-error",
  "info": "Failed to establish WebRTC connection"
}
```

### Overcast Error Handling Strategy

1. **Graceful Degradation**: Show error message, offer retry
2. **Automatic Reconnection**: For temporary network issues
3. **User Feedback**: Clear error messages in UI
4. **Fallback**: Return to lobby on critical errors

## Security Considerations

### Meeting Tokens (Production)
- Generate server-side only
- Include expiration time (max 24 hours)
- Never expose API key to client
- Different tokens for students vs instructors

### Room Privacy
- **Development**: Public rooms (easier testing)
- **Production**: Private rooms with meeting tokens

### CORS Configuration
- Daily.co handles CORS automatically
- No additional configuration needed

## Testing

### Postman/cURL Examples

**Get Room Info**:
```bash
curl -X GET https://api.daily.co/v1/rooms/cohort-1 \
  -H "Authorization: Bearer YOUR_API_KEY"
```

**Create Room**:
```bash
curl -X POST https://api.daily.co/v1/rooms \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "test-room",
    "properties": {
      "max_participants": 15
    }
  }'
```

---

**Last Updated**: 2025-12-18  
**API Version**: Daily.co REST API v1  
**SDK Version**: @daily-co/daily-js latest

