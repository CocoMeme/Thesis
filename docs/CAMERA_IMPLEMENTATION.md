# Camera Implementation Guide

## Overview
The CameraScreen component provides full camera functionality for the Gourd Scanner app, including:
- Live camera preview with front/back camera toggle
- Capture photos directly from camera
- Select images from gallery
- Preview captured/selected images
- Image analysis preparation (ready for ML model integration)

## Features

### 1. Camera Functionality
- **Live Preview**: Real-time camera view with visual guide frame
- **Camera Toggle**: Switch between front and back cameras
- **Capture Button**: Large, intuitive button to take photos
- **Visual Guide**: Frame overlay to help users position gourds correctly

### 2. Gallery Integration
- **Image Picker**: Select existing photos from device gallery
- **Image Editing**: Basic crop and aspect ratio adjustment (4:3)
- **Quality Optimization**: Images compressed to 0.8 quality for faster processing

### 3. Image Preview
- **Preview Mode**: Full-screen preview of captured/selected images
- **Retake Option**: Easy way to discard and capture new images
- **Analyze Button**: Ready for ML model integration

### 4. Permissions Handling
- **Camera Permission**: Automatic request with user-friendly prompt
- **Gallery Permission**: Separate permission for photo library access
- **Graceful Degradation**: Clear messages when permissions are denied

## Permissions Required

### iOS (Info.plist)
```
NSCameraUsageDescription: "This app needs camera access to scan gourds and predict harvest readiness."
NSPhotoLibraryUsageDescription: "This app needs photo library access to select gourd images for analysis."
```

### Android (AndroidManifest.xml)
```
CAMERA
READ_MEDIA_IMAGES
READ_EXTERNAL_STORAGE
WRITE_EXTERNAL_STORAGE
```

## Usage

### Navigation
From the Home screen, tap "Start Scanning" to navigate to the Camera screen.

### Taking a Photo
1. Position the gourd within the guide frame
2. Tap the large white capture button
3. Preview the captured image
4. Choose to "Retake" or "Analyze"

### Selecting from Gallery
1. Tap the gallery icon (bottom left)
2. Select an image from your device
3. Optionally crop/adjust the image
4. Preview and analyze

## Integration Points

### ML Model Integration
The `analyzePicture()` function is ready for ML model integration:

```javascript
const analyzePicture = () => {
  // TODO: Implement ML model integration
  // 1. Send capturedImage to ML service
  // 2. Get prediction results
  // 3. Navigate to results screen with data
  
  // Example:
  // const result = await mlService.predictGourdReadiness(capturedImage);
  // navigation.navigate('Results', { imageUri: capturedImage, result });
};
```

### Future Enhancements
- [ ] Add flash control
- [ ] Add zoom functionality
- [ ] Implement batch image analysis
- [ ] Add image preprocessing (resize, normalize)
- [ ] Save analysis history to backend
- [ ] Add loading state during ML processing
- [ ] Implement offline mode with local storage

## Technical Details

### Dependencies
- `expo-camera`: Camera functionality
- `expo-image-picker`: Gallery access
- `@expo/vector-icons`: UI icons

### State Management
- `facing`: Current camera direction ('back' | 'front')
- `permission`: Camera permission status
- `capturedImage`: URI of captured/selected image
- `isProcessing`: Loading state during capture

### Performance
- Image quality set to 0.8 for balance between quality and file size
- No base64 encoding for faster capture
- Optimized preview rendering

## Troubleshooting

### Camera Not Working
1. Check if permissions are granted in device settings
2. Ensure physical device is being used (camera doesn't work in simulator)
3. Restart the Expo development server

### Image Not Displaying
1. Verify the image URI is valid
2. Check console for error messages
3. Ensure proper permissions for file access

### Permission Denied
1. Go to device Settings > [App Name] > Permissions
2. Enable Camera and Photos permissions
3. Restart the app

## Testing Checklist
- [ ] Camera opens successfully
- [ ] Camera toggle switches between front/back
- [ ] Capture button takes photos
- [ ] Gallery picker works
- [ ] Preview shows captured images
- [ ] Retake clears current image
- [ ] Navigation works properly
- [ ] Permissions are requested properly
- [ ] Error messages display correctly
- [ ] Works on both iOS and Android

## Notes
- Camera requires a physical device; it will not work on iOS Simulator or Android Emulator
- For testing on simulator, use the gallery picker function instead
- The app currently shows an alert for "Analyze" - this will be replaced with actual ML model integration
