# Pollination Management System

## Overview
The Pollination Management System allows users to track and manage the lifecycle of gourd plants from planting to harvest, with automatic calculation of optimal pollination windows.

## Supported Plants
- **Ampalaya** (Bitter Gourd) - English/Tagalog names supported
- **Patola** (Sponge Gourd)
- **Upo** (Bottle Gourd)
- **Kalabasa** (Squash)
- **Kundol** (Winter Melon)

## Estimated Flowering Times (Days After Sowing - DAS)

### Ampalaya (Bitter Gourd)
- Male flowers: 30–35 DAS
- Female flowers: 38–45 DAS
- Pollination window: 40–50 DAS

### Upo (Bottle Gourd)
- Male flowers: 40–45 DAS
- Female flowers: 45–55 DAS
- Pollination window: 50–60 DAS

### Patola (Sponge Gourd)
- Male flowers: 35–40 DAS
- Female flowers: 40–45 DAS
- Pollination window: 45–55 DAS

### Kundol (Winter Melon)
- Male flowers: 45–55 DAS
- Female flowers: 55–65 DAS
- Pollination window: 55–70 DAS

### Kalabasa (Squash)
- Male flowers: 25–30 DAS
- Female flowers: 30–35 DAS
- Pollination window: 30–40 DAS

## API Endpoints

### Base URL: `/api/pollination`

#### GET `/` - Get all pollination records
**Query Parameters:**
- `status` - Filter by status (planted, flowering, pollinated, fruiting, harvested)
- `name` - Filter by plant name (ampalaya, patola, upo, kalabasa, kundol)
- `sort` - Sort order (newest, oldest, name, status, pollination)
- `page` - Page number (default: 1)
- `limit` - Results per page (default: 10, max: 100)

**Example:**
```bash
GET /api/pollination?status=flowering&sort=pollination&page=1&limit=10
```

#### POST `/` - Create new pollination record
**Required Fields:**
- `name` - Plant name (ampalaya, patola, upo, kalabasa, kundol)
- `datePlanted` - Date when plant was planted (ISO 8601 format)

**Optional Fields:**
- `gender` - Plant gender (male, female, undetermined)
- `location.garden` - Garden name
- `location.plot` - Plot identifier
- `location.coordinates.latitude` - GPS latitude
- `location.coordinates.longitude` - GPS longitude
- `notes` - Initial observation notes

**Example:**
```json
{
  "name": "ampalaya",
  "datePlanted": "2025-10-01T00:00:00.000Z",
  "gender": "undetermined",
  "location": {
    "garden": "Home Garden",
    "plot": "A1"
  },
  "notes": "Planted in fertile soil with compost"
}
```

#### GET `/:id` - Get single pollination record
#### PUT `/:id` - Update pollination record
#### DELETE `/:id` - Delete pollination record

### Special Endpoints

#### GET `/plant-types` - Get all supported plant types with display names
**Response:**
```json
{
  "success": true,
  "data": {
    "ampalaya": {
      "english": "Bitter Gourd",
      "tagalog": "Ampalaya"
    },
    "patola": {
      "english": "Sponge Gourd", 
      "tagalog": "Patola"
    }
    // ... other plants
  }
}
```

#### GET `/dashboard/stats` - Get dashboard statistics
**Response includes:**
- Total plants count
- Active plants count
- Plants needing attention count
- Status breakdown
- Plant type breakdown
- Recent activity

#### GET `/attention/needed` - Get plants needing attention
Returns plants approaching or in their pollination window.

#### GET `/upcoming/pollinations` - Get upcoming pollinations
**Query Parameters:**
- `days` - Number of days to look ahead (default: 7)

### Image Management

#### POST `/:id/images` - Add image to pollination record
**Form Data:**
- `image` - Image file (max 10MB, jpg/png only)
- `caption` - Image caption
- `imageType` - Type of image (planting, male_flower, female_flower, pollination, fruit, harvest, general)

#### DELETE `/:id/images/:imageId` - Delete image from pollination record

### Notes Management

#### POST `/:id/notes` - Add note to pollination record
**Body:**
```json
{
  "content": "First male flowers appeared today",
  "type": "milestone"
}
```

**Note Types:**
- `observation` - General observations
- `care` - Care activities (watering, fertilizing, etc.)
- `problem` - Issues or problems noticed
- `milestone` - Important milestones

### Lifecycle Management

#### POST `/:id/flowering` - Mark plant as flowering
**Body:**
```json
{
  "gender": "male",
  "date": "2025-11-01T00:00:00.000Z"
}
```

#### POST `/:id/pollinate` - Mark plant as pollinated
**Body:**
```json
{
  "date": "2025-11-05T00:00:00.000Z"
}
```

## Plant Status Lifecycle
1. **planted** - Initial state after planting
2. **flowering** - When first flowers appear
3. **pollinated** - After successful pollination
4. **fruiting** - When fruits begin to develop
5. **harvested** - When fruits are harvested

## Automatic Features

### Date Calculations
- Estimated flowering dates are calculated automatically based on planting date
- System provides pollination windows for optimal breeding timing
- Notifications for upcoming pollination opportunities

### Status Tracking
- **pollinationStatus** virtual field:
  - `not_ready` - Plant hasn't reached pollination window
  - `upcoming` - Pollination window approaching (within 3 days)
  - `ready` - Currently in pollination window
  - `overdue` - Pollination window has passed
  - `completed` - Plant has been pollinated

### Reminders and Alerts
- Plants needing attention endpoint for upcoming pollinations
- Dashboard statistics for monitoring plant health
- Growth tracking with customizable metrics

## Data Models

### Main Record Fields
```javascript
{
  name: "ampalaya",                    // Plant type
  displayName: {                      // Localized names
    english: "Bitter Gourd",
    tagalog: "Ampalaya"
  },
  gender: "undetermined",             // male/female/undetermined
  datePlanted: Date,                  // Planting date
  dateFirstFlowering: Date,           // When first flowers appear
  datePollinated: Date,               // When pollinated
  estimatedDates: {                   // Auto-calculated dates
    maleFlowering: { earliest: Date, latest: Date },
    femaleFlowering: { earliest: Date, latest: Date },
    pollinationWindow: { earliest: Date, latest: Date }
  },
  status: "planted",                  // Current lifecycle status
  images: [...],                      // Photo documentation
  location: {...},                    // Garden location info
  growth: {...},                      // Growth measurements
  notes: [...],                       // Observation notes
  user: ObjectId                      // Owner reference
}
```

## Usage Examples

### Plant Registration Flow
1. User creates new pollination record with plant type and planting date
2. System automatically calculates estimated flowering and pollination dates
3. User receives notifications as plant approaches flowering time
4. User updates plant gender when flowers first appear
5. User marks pollination when completed
6. System tracks fruit development and harvest timing

### Monitoring and Care
1. Users can add photos at any stage to document plant progress
2. Notes can be added for observations, care activities, or problems
3. Dashboard provides overview of all plants and their current status
4. Attention alerts help users not miss optimal pollination windows

## Integration with Mobile App
- Photo upload capabilities for plant documentation
- GPS integration for location tracking
- Push notifications for pollination reminders
- Offline support for note-taking in garden settings

## Future Enhancements
- Weather integration for pollination timing optimization
- AI-powered plant health assessment from photos
- Community sharing of successful pollination techniques
- Integration with harvest prediction and yield tracking