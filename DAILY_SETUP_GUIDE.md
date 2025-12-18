# Daily.co Room Setup Guide

## ⚠️ REQUIRED: You must create Daily.co rooms to use Overcast

The error you're seeing means the room URLs in your configuration don't exist. Follow this guide to create them.

---

## Quick Setup (2-3 minutes)

### Step 1: Create Free Daily.co Account

1. Go to: **https://dashboard.daily.co/signup**
2. Sign up with your email (100% free, no credit card needed)
3. Verify your email
4. Log into the Daily.co dashboard

**Free Tier Includes:**
- Up to 10 participants per room
- Unlimited rooms
- Perfect for testing Overcast!

---

### Step 2: Create Your First Room

1. In the Daily dashboard, click **"Rooms"** in the left sidebar
2. Click the **"Create Room"** button (top right)
3. Fill in the form:
   - **Room Name**: `overcast-cohort-1`
   - **Privacy**: Leave as "Public" for testing
   - **Max Participants**: Set to `15` (or `10` for free tier)
   - **Expiration**: Leave blank (room never expires)
4. Click **"Create Room"**
5. **Copy the Room URL** - it will look like:
   ```
   https://yourdomain.daily.co/overcast-cohort-1
   ```

---

### Step 3: Create 5 More Rooms

Repeat Step 2 for the remaining cohorts:

- `overcast-cohort-2`
- `overcast-cohort-3`
- `overcast-cohort-4`
- `overcast-cohort-5`
- `overcast-cohort-6`

**Tip**: You can quickly copy/paste room names and just change the number!

---

### Step 4: Update Your Configuration

1. Open the file: `/config/classrooms.ts`
2. Replace each `REPLACE_WITH_YOUR_DAILY_ROOM_URL_X` with your actual room URLs
3. Save the file

**Example:**

```typescript
export const CLASSROOMS: Classroom[] = [
  {
    id: 1,
    name: "Cohort 1",
    roomUrl: "https://yourdomain.daily.co/overcast-cohort-1", // ← Your actual URL
    maxCapacity: 15,
    status: ClassroomStatus.NOT_STARTED
  },
  {
    id: 2,
    name: "Cohort 2",
    roomUrl: "https://yourdomain.daily.co/overcast-cohort-2", // ← Your actual URL
    maxCapacity: 15,
    status: ClassroomStatus.NOT_STARTED
  },
  // ... continue for all 6 rooms
];
```

---

### Step 5: Test Your Setup

1. Save the configuration file
2. Your dev server should automatically reload
3. Go to the Overcast lobby
4. Click "Join Classroom" on Cohort 1
5. You should successfully join the video room! 🎉

---

## Troubleshooting

### Error: "Meeting you're trying to join does not exist"

**Cause**: The room URL is incorrect or the room wasn't created

**Solutions**:
- Double-check the room URL in your Daily dashboard
- Make sure you copied the full URL including `https://`
- Verify the room exists in your Daily dashboard

### Error: "Too many participants"

**Cause**: Free tier is limited to 10 participants per room

**Solutions**:
- Reduce `maxCapacity` to `10` in your config
- Upgrade to Daily Pro plan (if needed)

### Error: "Meeting token required"

**Cause**: Room privacy is set to "Private"

**Solutions**:
- Change room privacy to "Public" in Daily dashboard
- Or implement meeting tokens (see README.md for advanced setup)

---

## Quick Reference

### Your Daily.co Dashboard
- **URL**: https://dashboard.daily.co
- **Rooms**: https://dashboard.daily.co/rooms
- **Docs**: https://docs.daily.co

### Free Tier Limits
- ✅ Unlimited rooms
- ✅ Up to 10 participants per call
- ✅ Unlimited minutes
- ✅ HD video quality
- ✅ Screen sharing
- ❌ Recording (Pro plan)
- ❌ Breakout rooms (Enterprise plan)

### Need Help?
- Daily.co Docs: https://docs.daily.co
- Overcast README: `/README.md`
- Overcast Setup Guide: `/SETUP.md`

---

## Alternative: Use Daily.co API to Create Rooms Programmatically

If you prefer to create rooms via code:

```bash
# Get your API key from: https://dashboard.daily.co/developers
export DAILY_API_KEY="your-api-key"

# Create 6 rooms
for i in {1..6}; do
  curl -X POST https://api.daily.co/v1/rooms \
    -H "Authorization: Bearer $DAILY_API_KEY" \
    -H "Content-Type: application/json" \
    -d "{
      \"name\": \"overcast-cohort-$i\",
      \"privacy\": \"public\",
      \"properties\": {
        \"max_participants\": 15
      }
    }"
done
```

Then copy the room URLs from the API response into your config.

---

## ✅ Checklist

Before you can use Overcast, make sure you've completed:

- [ ] Created a Daily.co account
- [ ] Created 6 rooms in the Daily dashboard
- [ ] Copied all 6 room URLs
- [ ] Updated `/config/classrooms.ts` with your room URLs
- [ ] Saved the file
- [ ] Tested joining a classroom

---

**Once you complete these steps, Overcast will work perfectly!** 🚀

The application is 100% ready - it just needs valid Daily.co room URLs to connect to.

