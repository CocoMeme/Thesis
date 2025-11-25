# 🔔 Pollination Notifications - Quick Start

## What Just Got Built

A push notification system that reminds farmers when to pollinate their gourds based on accurate Philippine agricultural timing.

**Before**: Users had to manually remember when each plant flowers
**After**: App automatically sends 2 notifications (1 hour before + 30 minutes before)

---

## 🚀 How to Test It

### Step 1: Create a Plant
```
1. Open the app
2. Go to Pollination screen
3. Click "Add Plant"
4. Select plant type (e.g., Ampalaya)
5. Fill in details and create
```

### Step 2: Detect Gender
```
1. Open plant
2. Wait for flowering (or skip to step 3)
3. Click "Select Gender"
4. Choose "Female Flowers"
```

### Step 3: Mark Pollinated
```
1. Status should be "FLOWERING"
2. Click "Mark Pollinated"
3. Confirm when prompted
4. Plant status → "POLLINATED"
```

### Step 4: Restart App
```
1. Close app completely
2. Reopen app
3. Check browser console for logs:
   "🔔 Fetching pending pollination notifications..."
   "Scheduled X notifications"
```

### Step 5: See Notifications
```
On your device:
- Go to notification settings
- Allow notifications for the app
- Wait for scheduled times
- You'll see notifications appear!

OR

Manually adjust device time to test:
- Set device time to 1 hour before window
- Check notification center
```

---

## 📱 Example: Ampalaya

**When you mark as pollinated on Nov 27, 2025:**

| Time | What Happens |
|------|--------------|
| 5:00 AM | 🔔 "Pollination starts in 1 hour! Ampalaya is ready at 6:00" |
| 5:30 AM | 🔔 "Pollination in 30 minutes! Get your tools ready!" |
| 6:00 AM - 9:00 AM | ✅ Pollination window (flowers are open) |
| After 9:00 AM | ❌ Window closed (can't pollinate anymore) |

---

## 🌸 Plant Timing Cheat Sheet

### Morning Bloomers (Get up early!)
- **Ampalaya**: 6:00 AM - 9:00 AM
- **Kalabasa**: 6:00 AM - 9:00 AM
- **Kundol**: 6:00 AM - 8:00 AM (very early!)
- **Patola (smooth)**: 6:00 AM - 9:00 AM

### Evening Bloomers (Work in afternoon)
- **Upo**: 5:00 PM - 8:00 PM
- **Patola (ridged)**: 5:00 PM - 8:00 PM

---

## 💾 What Changed in Code

### Backend (3 files)
```
✅ Pollination.js - Added pollinationTiming field
✅ notificationScheduler.js - New utility for managing notifications
✅ pollinationController.js - New endpoints for notifications
✅ pollination.js (routes) - New routes for API
```

### Frontend (3 files)
```
✅ pollinationService.js - Service methods for API calls
✅ pollinationNotificationHelper.js - Manages local notifications
✅ App.js - Initialize notifications on startup
```

---

## 🔧 How It Works (Simple Version)

```
1. User marks plant as "POLLINATED"
   ↓
2. Backend calculates timing based on plant type
   ↓
3. User restarts app
   ↓
4. Frontend app fetches pending notifications
   ↓
5. Frontend schedules 2 local notifications:
   - 1 hour before window opens
   - 30 minutes before window opens
   ↓
6. Device shows notification at scheduled time
   ↓
7. User gets reminder to pollinate!
```

---

## 🎯 Key Points

✅ **No Internet Required After Initial Setup**
- Notifications scheduled locally on device
- Works even in offline mode

✅ **No Duplicate Notifications**
- Backend tracks which notifications were sent
- Won't spam you

✅ **Accurate to Philippine Agriculture**
- Each plant has scientifically-based timing
- Based on flower bloom times in Philippines

✅ **Two Reminders Per Plant**
- 1 hour before: "Get ready"
- 30 mins before: "Start now"

✅ **Plant-Specific Timing**
- Morning plants: 6 AM notifications
- Evening plants: 4 PM notifications

---

## 🚨 Troubleshooting

### I don't see notifications

**Check 1: Permissions**
- Settings → Apps → [Your App] → Notifications → Allow

**Check 2: Device Time**
- Make sure device time is correct
- Notifications scheduled for future times won't show

**Check 3: App Started**
- Notifications initialize on app startup
- Make sure you've opened app after marking pollinated

**Check 4: Console Logs**
- Open browser dev tools
- Look for "🔔 Fetching pending notifications"
- Check if any notifications were scheduled

### Notifications not marking as sent

- This is handled automatically by the system
- Check backend logs for errors
- Notifications will reschedule on next app restart

### Want to test without waiting?

**Option 1: Adjust Device Time**
- Set device time to 1 hour before window
- Restart app
- Notifications should appear

**Option 2: Check Backend**
- Call `/api/pollination/notifications/pending` manually
- See if notifications are in database

---

## 📊 Database Changes

One new field was added to plants:

```javascript
{
  pollinationTiming: {
    startHour: 6,           // When to pollinate starts
    endHour: 9,             // When window closes
    scheduledDate: Date,    // Date of window
    notificationScheduled: {
      oneHourBefore: false,  // Whether sent
      thirtyMinsBefore: false // Whether sent
    }
  }
}
```

That's it! No existing fields changed.

---

## 🎓 Common Questions

**Q: Will notifications still work if I close the app?**
A: Yes! They're scheduled on the device, not in the app.

**Q: Can I change the notification time?**
A: Timing is based on plant type and is scientifically accurate. You can request custom timing if needed.

**Q: What if I miss the window?**
A: Once the window passes, you'll see "Failed" status. That plant can't be re-pollinated (realistic to actual farming).

**Q: Do I need internet for notifications?**
A: You need internet to set them up, but once scheduled, they work offline.

**Q: Can I turn off notifications?**
A: Yes, through device settings or by denying permission on app startup.

---

## ✅ Testing Checklist

- [ ] Created a plant and marked as pollinated
- [ ] Restarted app
- [ ] Saw console logs about initializing notifications
- [ ] Received notification at right time (or adjusted device time to test)
- [ ] Notification had correct plant name and timing
- [ ] Tapped notification (optional - can navigate to plant)
- [ ] Reported success/failure
- [ ] Plant status updated correctly

---

## 📞 Support

If something doesn't work:
1. Check console logs for error messages
2. Verify notification permissions in device settings
3. Try restarting the app
4. Check backend logs for API errors

---

That's it! The notification system is fully integrated and ready to use. 🌸🔔

Happy farming! 🌱
