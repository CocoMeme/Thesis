# Pollination Notifications - API Reference

## Backend Endpoints

### 1. Get Pending Notifications

Fetches all pending pollination notifications for the authenticated user.

```
GET /api/pollination/notifications/pending
```

**Headers:**
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Found 2 pending notifications",
  "data": [
    {
      "plantId": "674a1b2c3d4e5f6g7h8i9j0k",
      "plantName": "Ampalaya",
      "plantNameTagalog": "Ampalaya",
      "type": "oneHourBefore",
      "scheduledTime": "2025-11-27T05:00:00.000Z",
      "message": "🌸 Pollination starts in 1 hour! Ampalaya is ready at 6:00",
      "pollintationWindow": "6:00 - 9:00"
    },
    {
      "plantId": "674a1b2c3d4e5f6g7h8i9j0k",
      "plantName": "Ampalaya",
      "plantNameTagalog": "Ampalaya",
      "type": "thirtyMinsBefore",
      "scheduledTime": "2025-11-27T05:30:00.000Z",
      "message": "🌸 Pollination in 30 minutes! Get your tools ready!",
      "pollintationWindow": "6:00 - 9:00"
    }
  ]
}
```

**Response (400 Error):**
```json
{
  "success": false,
  "message": "Error fetching pending notifications",
  "error": "error details"
}
```

---

### 2. Mark Notification as Sent

Marks a notification as sent to prevent duplicate notifications.

```
POST /api/pollination/:id/notification-sent
```

**Headers:**
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Request Body:**
```json
{
  "notificationType": "oneHourBefore"
}
```

**Allowed Values for notificationType:**
- `"oneHourBefore"` - Marks 1-hour notification as sent
- `"thirtyMinsBefore"` - Marks 30-minute notification as sent

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Notification marked as sent: oneHourBefore",
  "data": {
    "_id": "674a1b2c3d4e5f6g7h8i9j0k",
    "name": "ampalaya",
    "status": "pollinated",
    "pollinationTiming": {
      "startHour": 6,
      "endHour": 9,
      "scheduledDate": "2025-11-27T00:00:00.000Z",
      "notificationScheduled": {
        "oneHourBefore": true,
        "thirtyMinsBefore": false
      }
    },
    "...": "other plant fields"
  }
}
```

**Response (400 Error - Invalid Type):**
```json
{
  "success": false,
  "message": "Invalid notification type"
}
```

**Response (404 Error - Plant Not Found):**
```json
{
  "success": false,
  "message": "Pollination record not found"
}
```

---

## Frontend Service Methods

### Using in React Components

Import the service:
```javascript
import { pollinationService } from '../../services';
```

### 1. Get Pending Notifications

```javascript
try {
  const response = await pollinationService.getPendingNotifications();
  const notifications = response.data; // Array of pending notifications
  
  notifications.forEach(notif => {
    console.log(`${notif.plantName}: ${notif.message}`);
  });
} catch (error) {
  console.error('Error fetching notifications:', error);
}
```

**Returns:**
```javascript
{
  success: true,
  data: [
    {
      plantId: "...",
      plantName: "Ampalaya",
      type: "oneHourBefore",
      message: "🌸 Pollination starts in 1 hour!...",
      pollintationWindow: "6:00 - 9:00"
    }
  ]
}
```

---

### 2. Mark Notification as Sent

```javascript
try {
  const response = await pollinationService.markNotificationSent(
    plantId,
    'oneHourBefore'  // or 'thirtyMinsBefore'
  );
  
  console.log('Marked as sent:', response.message);
} catch (error) {
  console.error('Error marking notification:', error);
}
```

**Parameters:**
- `plantId` (string): ID of the plant
- `notificationType` (string): `'oneHourBefore'` or `'thirtyMinsBefore'`

**Returns:**
```javascript
{
  success: true,
  message: "Notification marked as sent: oneHourBefore",
  data: { ...updated plant... }
}
```

---

## Notification Helper

### Using Notification System

Import the helper:
```javascript
import { pollinationNotificationHelper } from '../utils/pollinationNotificationHelper';
```

### Initialize (Called in App.js)

```javascript
// On app startup
await pollinationNotificationHelper.initialize();
// This automatically:
// - Requests permissions
// - Fetches pending notifications
// - Schedules local notifications
// - Sets up listeners
```

### Schedule Pending Notifications

```javascript
const count = await pollinationNotificationHelper.schedulePendingNotifications();
console.log(`Scheduled ${count} notifications`);
```

### Request Permissions

```javascript
const granted = await pollinationNotificationHelper.requestPermissions();
if (granted) {
  console.log('Notifications allowed');
} else {
  console.log('Notifications denied');
}
```

### Schedule Individual Notification

```javascript
const notificationId = await pollinationNotificationHelper.scheduleLocalNotification(
  '🌸 Ampalaya Pollination',
  'Pollination starts in 1 hour!',
  new Date('2025-11-27T05:00:00'),
  {
    plantId: '...',
    plantName: 'Ampalaya',
    type: 'oneHourBefore'
  }
);
```

### Cancel Notification

```javascript
await pollinationNotificationHelper.cancelNotification(plantId);
```

### Cancel All Notifications

```javascript
await pollinationNotificationHelper.cancelAllNotifications();
```

### Set Up Listeners Manually

```javascript
pollinationNotificationHelper.setupNotificationListeners();
```

### Clean Up Listeners

```javascript
pollinationNotificationHelper.cleanupNotificationListeners();
```

---

## Data Models

### Pollination Timing Object

```javascript
{
  startHour: Number,        // 0-23 (hour when window opens)
  endHour: Number,          // 0-23 (hour when window closes)
  scheduledDate: Date,      // Date of the pollination window
  notificationScheduled: {
    oneHourBefore: Boolean, // Has 1-hour notification been sent?
    thirtyMinsBefore: Boolean // Has 30-min notification been sent?
  }
}
```

### Notification Object (from API)

```javascript
{
  plantId: String,              // MongoDB ID
  plantName: String,            // English name (e.g., "Ampalaya")
  plantNameTagalog: String,     // Tagalog name (e.g., "Ampalaya")
  type: String,                 // "oneHourBefore" or "thirtyMinsBefore"
  scheduledTime: Date,          // When notification should appear
  message: String,              // Notification text
  pollintationWindow: String    // Display string (e.g., "6:00 - 9:00")
}
```

---

## Example: Complete Notification Flow

### 1. User marks plant as pollinated
```javascript
// In PlantDetailScreen
await pollinationService.markPollinated(plantId);
// Backend automatically calls setPollintionTiming()
// Stores timing info in database
```

### 2. App restarts
```javascript
// In App.js useEffect
await pollinationNotificationHelper.initialize();
// Fetches pending notifications
// Schedules local notifications
```

### 3. Notification fires
```
Device notification appears:
"🌸 Ampalaya Pollination"
"Pollination starts in 1 hour! Ampalaya is ready at 6:00"
```

### 4. User taps notification
```javascript
// Listener fires in pollinationNotificationHelper
// Can navigate to plant or show details
```

### 5. Backend updates tracking
```javascript
// Service marks notification as sent
await pollinationService.markNotificationSent(plantId, 'oneHourBefore');
// Backend updates notificationScheduled.oneHourBefore = true
```

---

## Timing Examples by Plant Type

### Ampalaya (Bitter Gourd)
- **Pollination Window**: 6:00 AM - 9:00 AM
- **1 Hour Notification**: 5:00 AM
- **30 Min Notification**: 5:30 AM

### Kalabasa (Squash)
- **Pollination Window**: 6:00 AM - 9:00 AM
- **1 Hour Notification**: 5:00 AM
- **30 Min Notification**: 5:30 AM

### Kundol (Winter Melon)
- **Pollination Window**: 6:00 AM - 8:00 AM (early!)
- **1 Hour Notification**: 5:00 AM
- **30 Min Notification**: 5:30 AM

### Patola (Smooth/Round variety)
- **Pollination Window**: 6:00 AM - 9:00 AM
- **1 Hour Notification**: 5:00 AM
- **30 Min Notification**: 5:30 AM

### Patola (Ridged variety - most common)
- **Pollination Window**: 5:00 PM - 8:00 PM
- **1 Hour Notification**: 4:00 PM
- **30 Min Notification**: 4:30 PM

### Upo (Bottle Gourd)
- **Pollination Window**: 5:00 PM - 8:00 PM
- **1 Hour Notification**: 4:00 PM
- **30 Min Notification**: 4:30 PM

---

## Error Handling

All methods include error handling. When errors occur:

1. **Backend returns error response** with `success: false`
2. **Frontend logs error** to console
3. **App continues functioning** (notifications are not critical)
4. **No crashes** - graceful degradation

Example error response:
```json
{
  "success": false,
  "message": "Error fetching pending notifications",
  "error": "Network timeout"
}
```

---

## Notes

- Notifications are **LOCAL** (device-based), not cloud-based
- Timezone is hardcoded to **Philippine Time (UTC+8)**
- Notifications persist across app restarts
- Once notification is sent, duplicate prevention prevents resending
- Users must grant notification permission for system to work
- If permission denied, app continues but no notifications appear
