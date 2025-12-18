# Overcast Quickstart Guide

Get Overcast running in under 5 minutes!

## Prerequisites
✅ Node.js 18+ installed  
✅ Daily.co account (free)

## Setup in 4 Steps

### 1. Install Dependencies (30 seconds)
```bash
cd /Users/razashareef/Documents/OverClock\ Work/overcast
npm install
```

### 2. Create Daily.co Rooms (2 minutes)
1. Go to [daily.co/dashboard](https://dashboard.daily.co/rooms)
2. Create 6 rooms: `cohort-1`, `cohort-2`, `cohort-3`, `cohort-4`, `cohort-5`, `cohort-6`
3. Set max participants to **15** for each
4. Copy the room URLs

### 3. Configure Classrooms (1 minute)
Edit `/config/classrooms.ts` and paste your room URLs:

```typescript
export const CLASSROOMS: Classroom[] = [
  {
    id: 1,
    name: "Cohort 1",
    roomUrl: "https://YOUR-DOMAIN.daily.co/cohort-1", // ← Paste here
    maxCapacity: 15,
    status: ClassroomStatus.NOT_STARTED
  },
  // ... repeat for 6 classrooms
];
```

### 4. Run the App (10 seconds)
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Test It Out

### Student Experience
1. Click "Join Classroom" on any room
2. Enter your name
3. Allow camera/microphone
4. See yourself on video!

### Instructor Experience
1. Toggle to "Instructors" mode
2. Join a classroom
3. See the Control Panel
4. Test mute controls

### Multi-User Test
1. Open incognito window
2. Join same classroom
3. Both users should see each other

## That's It!

You now have a fully functional video classroom platform.

## Next Steps
- Read the [README.md](../../README.md) for full documentation
- Review [implementation-plan.md](./implementation-plan.md) for architecture details
- See [SETUP.md](../../SETUP.md) for troubleshooting

## Need Help?
- Daily.co not working? Check your room URLs in `/config/classrooms.ts`
- Camera issues? Allow permissions in browser
- Can't see other users? Wait 10 seconds for WebRTC connection

**Happy teaching!** 🎓

