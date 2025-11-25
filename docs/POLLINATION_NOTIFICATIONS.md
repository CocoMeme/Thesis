# Pollination Notification System

## Overview

Complete push notification system for gourd pollination that sends reminders 1 hour before and 30 minutes before the pollination window opens for each plant type.

## Pollination Windows by Plant Type

### 🌞 Morning Bloomers (6:00 AM - 9:00 AM Philippine Time)

| Plant | Local Name | Window | Notes |
|-------|-----------|--------|-------|
| Ampalaya | Bitter Gourd | 6:00 AM - 9:00 AM | Yellow flowers, best pollen right after sunrise |
| Kalabasa | Squash/Pumpkin | 6:00 AM - 9:00 AM | Yellow flowers |
| Kundol | Winter Melon | 6:00 AM - 8:00 AM | Opens very early, pollinate by 8:00 AM |
| Patola (Round/Smooth) | Smooth Luffa | 6:00 AM - 9:00 AM | If variety has no sharp ridges |

### 🌙 Evening Bloomers (5:00 PM - 8:00 PM Philippine Time)

| Plant | Local Name | Window | Notes |
|-------|-----------|--------|-------|
| Upo | Bottle Gourd | 5:00 PM - 8:00 PM | White flowers, opens at dusk for night moths |
| Patola (Ridged) | Ridged Luffa | 5:00 PM - 8:00 PM | If variety has sharp ridges (most common in PH) |

## Backend Implementation

### Database Schema Updates (`Pollination.js`)

Added `pollinationTiming` object to track:
```javascript
pollinationTiming: {
  startHour: Number,           // Hour when window opens (0-23)
  endHour: Number,             // Hour when window closes (0-23)
  scheduledDate: Date,         // Date of pollination window
  notificationScheduled: {
    oneHourBefore: Boolean,    // Whether 1-hour notification sent
    thirtyMinsBefore: Boolean  // Whether 30-min notification sent
  }
}
```

### Instance Method: `setPollintionTiming(pollinationDate)`

Automatically called when `markPollinated()` is invoked. Sets notification times based on plant type:

```javascript
plant.markPollinated(date);
// Automatically calls setPollintionTiming() internally
// Stores startHour, endHour, and scheduledDate in pollinationTiming
```

### Notification Scheduler Utility (`notificationScheduler.js`)

Core logic for managing notifications:

**`getPendingNotifications(userId)`**
- Returns all plants that need pollination notifications
- Checks if we should send 1-hour and 30-minute notifications
- Returns array of notification objects with timing and messages

**`markNotificationAsSent(plantId, notificationType)`**
- Updates `notificationScheduled` flags in database
- Prevents duplicate notifications

**`getPollinationTiming(plantName)`**
- Returns timing details for a plant
- Used for message generation

### API Endpoints

#### Get Pending Notifications
```
GET /api/pollination/notifications/pending
Headers: Authorization: Bearer {token}

Response:
{
  "success": true,
  "data": [
    {
      "plantId": "...",
      "plantName": "Ampalaya",
      "plantNameTagalog": "Ampalaya",
      "type": "oneHourBefore",
      "message": "🌸 Pollination starts in 1 hour! Ampalaya is ready at 6:00",
      "pollinationWindow": "6:00 - 9:00"
    },
    {
      "plantId": "...",
      "type": "thirtyMinsBefore",
      "message": "🌸 Pollination in 30 minutes! Get your tools ready!"
    }
  ]
}
```

#### Mark Notification as Sent
```
POST /api/pollination/:id/notification-sent
Headers: Authorization: Bearer {token}
Body: { "notificationType": "oneHourBefore" | "thirtyMinsBefore" }

Response:
{
  "success": true,
  "message": "Notification marked as sent",
  "data": { ...updated plant... }
}
```

## Frontend Implementation

### Notification Helper (`pollinationNotificationHelper.js`)

Manages all local notification scheduling and event handling.

**Key Methods:**

**`requestPermissions()`**
- Requests notification permission from user
- Returns boolean indicating permission status

**`schedulePendingNotifications()`**
- Fetches pending notifications from backend
- Schedules local Expo notifications
- Automatically marks notifications as sent on backend
- Handles 1-hour and 30-minute reminders

**`setupNotificationListeners()`**
- Listens for notifications received while app is open
- Listens for notification taps/interactions
- Logs notification events

**`initialize()`**
- Called on app startup (in App.js)
- Requests permissions
- Sets up listeners
- Schedules all pending notifications

### Service Methods (`pollinationService.js`)

**`getPendingNotifications()`**
- Fetches pending notifications from backend

**`markNotificationSent(id, notificationType)`**
- Marks notification as sent on backend
- Prevents duplicate notifications

### App Initialization (`App.js`)

Notification system initializes on app startup:

```javascript
useEffect(() => {
  async function prepare() {
    if (fontsLoaded) {
      // Initialize pollination notifications
      await pollinationNotificationHelper.initialize();
      // ... other initialization
    }
  }
  prepare();
}, [fontsLoaded]);
```

## Notification Timeline Example

**For Ampalaya plant marked as pollinated on Nov 27, 2025:**

| Time | Event | Notification |
|------|-------|--------------|
| 5:00 AM (Nov 27) | 1 hour before window | 🔔 "Pollination starts in 1 hour! Ampalaya is ready at 6:00" |
| 5:30 AM (Nov 27) | 30 mins before window | 🔔 "Pollination in 30 minutes! Get your tools ready!" |
| 6:00 AM - 9:00 AM | Pollination window | Flower is open and ready |
| After 9:00 AM | Window closed | Flower closes (no more pollination possible) |

## User Flow

1. **Mark Plant as Pollinated**
   - User clicks "Mark Pollinated"
   - Plant status → "POLLINATED"
   - Backend calculates timing based on plant type
   - `pollinationTiming` is saved with startHour, endHour, scheduledDate

2. **App Startup**
   - Notification system initializes
   - Requests notification permission
   - Fetches pending notifications from backend
   - Schedules local notifications for 1 hour and 30 mins before

3. **Notification Received**
   - 1 hour before: "Pollination starts in 1 hour! [Plant] is ready at [time]"
   - 30 mins before: "Pollination in 30 minutes! Get your tools ready!"

4. **User Taps Notification**
   - App responds to notification interaction
   - Can navigate to plant detail or show alert

5. **User Checks Success**
   - After pollination window
   - Clicks "Successful" or "Failed"
   - Updates pollination status

## Technical Details

### Time Calculation

Notifications are scheduled based on Philippine timezone:

```javascript
const schedDate = new Date(scheduledDate);
schedDate.setHours(0, 0, 0, 0);  // Midnight of scheduled date

// 1 hour before
const oneHourBefore = new Date(schedDate);
oneHourBefore.setHours(startHour - 1, 0, 0, 0);

// 30 minutes before
const thirtyMinsBefore = new Date(schedDate);
thirtyMinsBefore.setHours(startHour - 1, 30, 0, 0);
```

### Notification Data

Each notification includes metadata:
```javascript
{
  plantId: "...",
  plantName: "Ampalaya",
  plantNameTagalog: "Ampalaya",
  type: "oneHourBefore" | "thirtyMinsBefore",
  pollinationWindow: "6:00 - 9:00"
}
```

### Event Listeners

Two Expo notification listeners are set up:

1. **NotificationReceivedListener**
   - Fires when notification arrives while app is open
   - Logs notification details

2. **NotificationResponseListener**
   - Fires when user taps notification
   - Returns plantId and action type
   - Can trigger navigation or alerts

## Permissions Required

- **Android**: `android.permission.POST_NOTIFICATIONS` (Android 13+)
- **iOS**: Local Notifications

The app requests these permissions on startup.

## Testing

To test the notification system:

1. **Mark plant as pollinated** in app
2. **Check backend logs** to verify `pollinationTiming` is set
3. **Restart app** to trigger notification initialization
4. **Check notification logs** in console
5. **Wait or manipulate device time** to see notifications appear

## Error Handling

- Missing notifications don't block app functionality
- Failed backend calls are logged but don't crash app
- Permissions denied are logged with warning
- Each notification is wrapped in try-catch

## Notes

- Notifications are LOCAL (device-based), not cloud-based
- Timezone is hardcoded to Philippine time (UTC+8)
- Each plant can have max 2 pending notifications (1hr + 30min)
- Notifications persist across app restarts until manually cleared
- Once marked "Successful", no more notifications are sent
