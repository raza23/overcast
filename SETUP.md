# Overcast Setup Guide

This guide will walk you through setting up the Overcast video classroom application from scratch.

## Prerequisites

Before you begin, ensure you have:

- **Node.js 18+** installed ([download](https://nodejs.org))
- **npm** or **yarn** package manager
- A **Daily.co account** (free tier available)
- A modern web browser (Chrome, Firefox, Safari, Edge)

## Step-by-Step Setup

### 1. Install Dependencies

Navigate to the project directory and install required packages:

```bash
cd /Users/razashareef/Documents/OverClock\ Work/overcast
npm install
```

This will install:
- Next.js 16 (React framework)
- Daily.co libraries (@daily-co/daily-react, @daily-co/daily-js)
- Jotai (state management)
- Tailwind CSS 4 (styling)
- TypeScript 5

### 2. Create Daily.co Account & Rooms

#### Sign Up for Daily.co

1. Go to [daily.co](https://daily.co)
2. Click "Sign Up" and create a free account
3. Verify your email address
4. Log in to the Dashboard

#### Create 6 Classroom Rooms

**Method 1: Via Dashboard (Recommended for MVP)**

1. In the Daily dashboard, go to **Rooms** section
2. Click **"Create Room"**
3. Configure the room:
   - **Name**: `cohort-1` (or your preferred naming)
   - **Privacy**: Public (for testing) or Private (for production)
   - **Max Participants**: 15
4. Click **"Create Room"**
5. Copy the **Room URL** (e.g., `https://yourdomain.daily.co/cohort-1`)
6. Repeat steps 2-5 for 6 total rooms (`cohort-1` through `cohort-6`)

**Method 2: Via API (For Advanced Users)**

```bash
# Set your API key (get from Dashboard > Developers)
export DAILY_API_KEY="your-api-key"

# Create rooms via API
for i in {1..6}; do
  curl -X POST https://api.daily.co/v1/rooms \
    -H "Authorization: Bearer $DAILY_API_KEY" \
    -H "Content-Type: application/json" \
    -d "{
      \"name\": \"cohort-$i\",
      \"properties\": {
        \"max_participants\": 15
      }
    }"
done
```

### 3. Configure Classroom URLs

Open `/config/classrooms.ts` in your code editor and replace the placeholder URLs with your actual Daily.co room URLs:

**Before:**
```typescript
{
  id: 1,
  name: "Cohort 1",
  roomUrl: "https://overcast.daily.co/cohort-1", // Placeholder
  maxCapacity: 15,
  status: ClassroomStatus.NOT_STARTED
}
```

**After:**
```typescript
{
  id: 1,
  name: "Cohort 1",
  roomUrl: "https://yourdomain.daily.co/cohort-1", // Your actual URL
  maxCapacity: 15,
  status: ClassroomStatus.NOT_STARTED
}
```

Repeat for all 6 classrooms.

### 4. Run the Application

Start the development server:

```bash
npm run dev
```

You should see:
```
▲ Next.js 16.0.10
- Local:        http://localhost:3000
- Ready in 2.5s
```

### 5. Test the Application

#### Open in Browser

1. Navigate to `http://localhost:3000`
2. You should see the **Overcast Lobby** with 6 classroom cards

#### Test Student Mode

1. Click "Join Classroom" on any classroom card
2. Enter your name when prompted
3. Allow camera/microphone permissions
4. You should see your video feed
5. Open another browser window (incognito/private mode)
6. Join the same classroom with a different name
7. Both windows should now show both participants

#### Test Instructor Mode

1. Click "Instructors" in the header
2. Join a classroom
3. You should see the **Control Panel** below the video grid
4. Try muting a participant (if you have multiple windows open)

#### Test Navigation

1. Click "Return to Lobby"
2. Join a different classroom
3. Verify you can switch between rooms

### 6. Optional: Environment Variables

If you want to use advanced features (programmatic room creation, meeting tokens), create a `.env.local` file:

```bash
cp .env.local.example .env.local
```

Edit `.env.local`:
```env
DAILY_API_KEY=your_actual_daily_api_key
NEXT_PUBLIC_DAILY_DOMAIN=yourdomain.daily.co
```

⚠️ **Never commit `.env.local` to version control** (it's already in `.gitignore`)

## Verification Checklist

Before proceeding to production, verify:

- [ ] All 6 classrooms appear in lobby
- [ ] Classroom names are correct
- [ ] Capacity displays as "0/15" initially
- [ ] Name entry modal works
- [ ] Video/audio broadcasts in classroom
- [ ] Multiple participants can join and see each other
- [ ] "Return to Lobby" button works
- [ ] Instructor mode toggle works
- [ ] Control panel appears for instructors
- [ ] Mute controls work
- [ ] Breakout rooms UI functions (full functionality requires Daily Enterprise)

## Common Issues & Solutions

### Issue: "Module not found" errors

**Solution:**
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Issue: Camera/microphone not working

**Solution:**
1. Check browser permissions (click lock icon in address bar)
2. Allow camera and microphone access
3. Refresh the page
4. Try a different browser (Chrome recommended)

### Issue: "Failed to join room"

**Solution:**
1. Verify room URLs in `/config/classrooms.ts` are correct
2. Check that rooms exist in Daily dashboard
3. Ensure rooms are not at max capacity (15 participants)
4. Check browser console for specific error messages

### Issue: Other participants not visible

**Solution:**
1. Ensure both users are in the same room
2. Check that both have granted camera/mic permissions
3. Wait 5-10 seconds for WebRTC connection to establish
4. Check network/firewall isn't blocking WebRTC

### Issue: Breakout rooms don't work

**Solution:**
This is expected. Breakout rooms require Daily.co Enterprise plan. The UI shows a demo, but full functionality requires upgrading your Daily plan.

## Next Steps

### For Development
- Customize classroom names in `/config/classrooms.ts`
- Adjust color theme in `/app/globals.css`
- Add more instructor features
- Implement recording functionality

### For Production
- Set up Daily meeting tokens for security
- Configure production Daily.co rooms
- Deploy to Vercel (see README.md)
- Set up custom domain
- Enable Daily Enterprise for breakout rooms

## Getting Help

### Resources
- [Daily.co Documentation](https://docs.daily.co)
- [Daily React Hooks Reference](https://docs.daily.co/reference/daily-react)
- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

### Support
For Overcast-specific issues:
1. Check the [README.md](./README.md)
2. Review [spec documents](./specs/001-video-classroom-app/)
3. Contact: support@overclock.com

---

**Ready to build the future of video classrooms!** 🚀

