# Pollination Success Tracking Flow

## Overview
Complete implementation of pollination success tracking system that guides users through marking pollination and tracking fruiting until harvest.

## Status Flow

```
FLOWERING
    ↓
[Mark Pollinated Button]
    ↓
POLLINATED ← pollinationStatus: [pending]
    ↓
[Successful? / Failed? Buttons]
    ↓
IF SUCCESSFUL:
  ├→ pollinationStatus: [Successful]
  ├→ status: FRUITING
  └→ [Mark as Harvested Button]
      ↓
      HARVESTED ← status: harvested
      
IF FAILED:
  └→ pollinationStatus: [Failed]
      status remains: POLLINATED
      (User can try again)
```

## Backend Implementation

### 1. Controller Methods (pollinationController.js)

#### updatePollinationStatus()
- **Route**: `POST /api/pollination/:id/check-success`
- **Body**: `{ status: "Successful" | "Failed" }`
- **Behavior**:
  - Adds entry to `pollinationStatus` array with the selected status
  - If "Successful": Changes main `status` to "fruiting"
  - If "Failed": Keeps status as "pollinated" (allows retry)
- **Response**: Updated pollination document

#### updateStatus()
- **Route**: `POST /api/pollination/:id/status`
- **Body**: `{ newStatus: "harvested" | "fruiting" | "pollinated" | "flowering" | "planted" }`
- **Behavior**:
  - Updates the main `status` field to the new status
  - Validates against allowed status values
- **Response**: Updated pollination document

### 2. Routes (pollination.js)
```javascript
router.post('/:id/check-success', updatePollinationStatus);
router.post('/:id/status', updateStatus);
```

### 3. Model Schema (Pollination.js)
Already has `pollinationStatus` array defined:
```javascript
pollinationStatus: [{
  statuspollination: {
    type: String,
    enum: ['Successful', 'Failed', 'pending'],
    default: 'pending'
  },
  date: {
    type: Date,
    default: Date.now
  }
}]
```

## Frontend Implementation

### 1. Service Methods (pollinationService.js)

#### updatePollinationStatus(id, status)
```javascript
async updatePollinationStatus(id, status) {
  // POST to /pollination/:id/check-success
  // status: 'Successful' | 'Failed'
}
```

#### updateStatus(id, newStatus)
```javascript
async updateStatus(id, newStatus) {
  // POST to /pollination/:id/status
  // newStatus: 'harvested' | 'fruiting' | etc.
}
```

### 2. UI Components (PlantDetailScreen.js)

#### Handlers

**handleMarkPollinated()**
- Shows confirmation alert
- Updates status to "pollinated"
- Triggers refresh

**handlePollinationCheck(success)**
- Called when user clicks "✓ Successful" or "✗ Failed"
- Calls `updatePollinationStatus()` with appropriate status
- Shows success message with status change info

**handleHarvest()**
- Called when user clicks "Mark as Harvested"
- Calls `updateStatus()` with "harvested"
- Shows harvest complete message

#### Conditional UI Rendering

**When status is FLOWERING**:
- Shows "Mark Pollinated" button

**When status is POLLINATED**:
- Shows "Was the pollination successful?" message
- Shows two buttons:
  - "✓ Successful" (green button)
  - "✗ Failed" (red button)

**When status is FRUITING**:
- Shows "Mark as Harvested" button

**When status is HARVESTED**:
- Shows green banner: "Harvest Complete! 🎉"
- No action buttons

#### Styles Added
- `pollinationCheckContainer`: Container for success/failed message
- `pollinationCheckTitle`: Title text styling
- `checkButtonsRow`: Flexbox for two buttons side-by-side
- `successButton`: Green styling for success button
- `failedButton`: Red styling for failed button
- `harvestedBanner`: Green banner for harvest completion

## API Flow

### Marking as Pollinated
```
POST /api/pollination/:id/pollinate
Response: { status: "pollinated" }
```

### Checking Pollination Success
```
POST /api/pollination/:id/check-success
Body: { status: "Successful" }
Response: { 
  status: "fruiting",
  pollinationStatus: [..., { statuspollination: "Successful", date: ... }]
}
```

### Marking as Harvested
```
POST /api/pollination/:id/status
Body: { newStatus: "harvested" }
Response: { status: "harvested" }
```

## User Experience Flow

1. **User sees FLOWERING plant**
   - Can see "Mark Pollinated" button
   - Clicks button → confirms pollination action

2. **Plant becomes POLLINATED**
   - Status badge changes to "POLLINATED"
   - Two buttons appear: "✓ Successful" and "✗ Failed"
   - User indicates if pollination was successful

3. **If SUCCESSFUL**
   - Status changes to "FRUITING"
   - "Mark as Harvested" button appears
   - `pollinationStatus` array updated with "Successful" entry

4. **If FAILED**
   - Status stays "POLLINATED"
   - User can try marking as pollinated again
   - `pollinationStatus` array updated with "Failed" entry

5. **When plant is FRUITING**
   - "Mark as Harvested" button visible
   - User clicks when fruit is ready
   - Status becomes "HARVESTED"

6. **When HARVESTED**
   - Plant record complete
   - Shows success banner
   - No more action buttons

## Data Structure

### Plant Document
```javascript
{
  _id: ObjectId,
  name: 'ampalaya',
  status: 'fruiting', // or 'harvested'
  datePollinated: Date,
  pollinationStatus: [
    {
      statuspollination: 'Successful',
      date: Date
    }
  ],
  // ... other fields
}
```

## Testing Checklist

- [ ] Press "Mark Pollinated" on flowering plant
- [ ] Verify plant status changes to "POLLINATED"
- [ ] Verify "Successful"/"Failed" buttons appear
- [ ] Click "✓ Successful"
- [ ] Verify status changes to "FRUITING"
- [ ] Verify "Mark as Harvested" button appears
- [ ] Click "Mark as Harvested"
- [ ] Verify status changes to "HARVESTED"
- [ ] Verify green success banner appears
- [ ] Test "Failed" flow: status should stay POLLINATED

## Notes

- Each pollination check creates a new entry in `pollinationStatus` array
- Main `status` field controls which UI buttons/messages are shown
- Only "Successful" automatically advances to "fruiting"
- "Failed" keeps plant in "pollinated" state for retry
- Manual status update endpoint allows future flexibility for status changes
