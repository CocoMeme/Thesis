# HomeScreen Components Documentation

## Overview
The HomeScreen has been enhanced with reusable components located in `src/components/HomeScreenComponents/`. These components provide a rich, interactive dashboard experience for the Gourd Scanner app.

## Components

### 1. WelcomeHeader
A personalized greeting header that displays time-based greetings and user information.

**Props:**
- `userName` (string): The user's name to display

**Features:**
- Dynamic greeting based on time of day (Good Morning/Afternoon/Evening)
- Displays user name
- Decorative leaf icon

**Usage:**
```javascript
<WelcomeHeader userName="John" />
```

---

### 2. QuickActionCard
An interactive card for quick navigation to major app features.

**Props:**
- `icon` (string): Ionicons icon name
- `title` (string): Action title
- `subtitle` (string): Action description
- `color` (string): Accent color for the icon
- `onPress` (function): Callback when card is pressed

**Features:**
- Icon with custom color background
- Title and subtitle text
- Chevron indicator
- Touch feedback

**Usage:**
```javascript
<QuickActionCard
  icon="camera"
  title="Scan Gourd"
  subtitle="Take a photo to analyze"
  color={theme.colors.primary}
  onPress={() => navigation.navigate('Camera')}
/>
```

---

### 3. StatCard
A compact card displaying a single statistic with an icon.

**Props:**
- `icon` (string): Ionicons icon name
- `value` (number|string): The stat value to display
- `label` (string): Description of the stat
- `color` (string): Accent color for the icon
- `onPress` (function, optional): Callback when card is pressed

**Features:**
- Centered layout with icon
- Large value display
- Descriptive label
- Optional tap interaction

**Usage:**
```javascript
<StatCard
  icon="scan"
  value={24}
  label="Total Scans"
  color={theme.colors.primary}
  onPress={() => console.log('Stat pressed')}
/>
```

---

### 4. StatsSection
A container component that displays three StatCards in a row for key metrics.

**Props:**
- `totalScans` (number): Total number of scans
- `readyGourds` (number): Number of ready gourds
- `pendingGourds` (number): Number of pending gourds
- `onStatsPress` (function, optional): Callback with stat type parameter

**Features:**
- Responsive three-column layout
- Pre-configured stats with icons and colors
- Tap to filter functionality

**Usage:**
```javascript
<StatsSection
  totalScans={24}
  readyGourds={18}
  pendingGourds={6}
  onStatsPress={(type) => navigation.navigate('History', { filter: type })}
/>
```

---

### 5. RecentScanCard
Displays information about a recent scan with image preview.

**Props:**
- `imageUri` (string, optional): URI of the scanned image
- `result` (string): Analysis result text
- `date` (string): ISO date string of the scan
- `onPress` (function): Callback when card is pressed

**Features:**
- Image thumbnail with placeholder fallback
- Result text with truncation
- Relative date formatting (Today, Yesterday, X days ago)
- Status badge with color coding
- Status colors based on result (Ready = green, Almost = yellow, etc.)

**Usage:**
```javascript
<RecentScanCard
  imageUri="file://path/to/image.jpg"
  result="Ready for Harvest"
  date={new Date().toISOString()}
  onPress={() => navigation.navigate('ScanDetails', { scanId: '123' })}
/>
```

---

### 6. TipCard
An informational card displaying helpful tips to users.

**Props:**
- `tip` (string): The tip text to display
- `onDismiss` (function, optional): Callback to dismiss the tip
- `onNext` (function, optional): Callback to show next tip

**Features:**
- Eye-catching yellow accent
- Lightbulb icon
- Dismissible with close button
- "Next Tip" button for cycling through tips
- Left border accent

**Usage:**
```javascript
<TipCard
  tip="Take photos in good lighting for better analysis results."
  onDismiss={() => setShowTip(false)}
  onNext={() => setCurrentTipIndex(prev => prev + 1)}
/>
```

---

## HomeScreen Layout Structure

The updated HomeScreen follows this structure:

```
SafeAreaView
└── ScrollView
    └── Content
        ├── WelcomeHeader
        ├── StatsSection (3 StatCards)
        ├── Quick Actions Section
        │   ├── QuickActionCard (Scan)
        │   ├── QuickActionCard (History)
        │   └── QuickActionCard (Profile)
        ├── TipCard (dismissible)
        └── Recent Scans Section
            ├── RecentScanCard
            └── RecentScanCard
```

## Integration with Backend

### Data Requirements
The HomeScreen currently uses mock data. To integrate with the backend, replace the mock data with API calls:

```javascript
// Example API integration
useEffect(() => {
  const fetchUserData = async () => {
    const user = await authService.getCurrentUser();
    const stats = await scanService.getUserStats();
    const recentScans = await scanService.getRecentScans(2);
    
    setUserName(user.name);
    setStats(stats);
    setRecentScans(recentScans);
  };
  
  fetchUserData();
}, []);
```

### Backend Endpoints Needed
- `GET /api/users/me` - Get current user info
- `GET /api/scans/stats` - Get user statistics
- `GET /api/scans/recent?limit=2` - Get recent scans

## Styling

All components use the centralized theme system from `src/styles/theme.js`:
- **Colors**: Primary, secondary, success, warning, info, error
- **Typography**: Consistent font sizes and families (Poppins)
- **Spacing**: Standardized spacing scale (xs, sm, md, lg, xl)
- **Border Radius**: Small, medium, large
- **Shadows**: Consistent elevation for cards

## Accessibility

All components include:
- Proper touch targets (minimum 44x44 points)
- `hitSlop` for small interactive elements
- `activeOpacity` for touch feedback
- Semantic component structure

## Performance Considerations

- Components use `React.memo` where appropriate (future optimization)
- ScrollView has `showsVerticalScrollIndicator={false}` for cleaner UI
- Images use `resizeMode: 'contain'` for proper scaling
- Conditional rendering for empty states

## Future Enhancements

### Short-term
- [ ] Connect to real backend API
- [ ] Add pull-to-refresh functionality
- [ ] Implement skeleton loading states
- [ ] Add empty state components

### Medium-term
- [ ] Add animations (Animated API or Reanimated)
- [ ] Implement search functionality
- [ ] Add filter options for scans
- [ ] Create scan details screen

### Long-term
- [ ] Add data visualization (charts/graphs)
- [ ] Implement offline support
- [ ] Add push notifications for scan reminders
- [ ] Create batch scanning feature

## Testing

Test each component individually:

```bash
# Run the app
npm start

# Navigate to HomeScreen to see all components
# Test interactions:
# - Tap stat cards
# - Navigate with quick action cards
# - Dismiss and cycle through tips
# - View recent scans
```

## Troubleshooting

### Components not showing
1. Ensure all imports are correct in `components/index.js`
2. Check that HomeScreen imports from `'../components'`
3. Verify no circular dependencies

### Styling issues
1. Confirm theme is imported correctly
2. Check that Poppins fonts are loaded in App.js
3. Verify SafeAreaView is used correctly

### Navigation errors
1. Ensure navigation prop is passed to HomeScreen
2. Check that all navigation targets exist in navigator
3. Verify route names match exactly

## Dependencies

All components require:
- `react` and `react-native`
- `@expo/vector-icons` (Ionicons)
- `../styles/theme.js`

No additional dependencies needed!
