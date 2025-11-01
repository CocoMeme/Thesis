# Model Integration Plan: Ampalaya Gourd Classifier

**Document Version:** 1.0  
**Created:** October 31, 2025  
**Last Updated:** October 31, 2025  
**Status:** Planning Phase  

---

## 📋 Table of Contents

1. [Overview](#overview)
2. [Current System Analysis](#current-system-analysis)
3. [Integration Options](#integration-options)
4. [Recommended Approach](#recommended-approach)
5. [Implementation Plan](#implementation-plan)
6. [Code Adjustments Required](#code-adjustments-required)
7. [Testing Strategy](#testing-strategy)
8. [Deployment Checklist](#deployment-checklist)
9. [Performance Considerations](#performance-considerations)
10. [Future Enhancements](#future-enhancements)

---

## 🎯 Overview

### Mission
Integrate the trained Ampalaya flower classifier (male/female detection) into the existing Thesis mobile application built with Expo React Native.

### Model Specifications
- **Model Type:** MobileNetV2 (optimized for mobile)
- **Input Size:** 224×224×3 (RGB images)
- **Output:** Binary classification (Female: 0, Male: 1)
- **Format:** TensorFlow Lite (.tflite)
- **Performance:** 100% accuracy on test set (152 images)
- **Model Size:** ~4-8 MB (after optimization)

### Success Criteria
- ✅ Real-time inference on mobile devices (<2 seconds)
- ✅ Accurate predictions matching training performance (≥90%)
- ✅ Seamless user experience with camera integration
- ✅ Offline capability (on-device inference)
- ✅ Result storage and history tracking
- ✅ Backend integration for analytics

---

## 🔍 Current System Analysis

### Existing Infrastructure

#### ✅ **Already Implemented**
```javascript
// Frontend (Mobile App)
├── TensorFlow.js packages installed
│   ├── @tensorflow/tfjs: ^4.22.0
│   └── @tensorflow/tfjs-react-native: ^1.0.0
├── Camera functionality (CameraScreen.js)
│   ├── expo-camera: ~17.0.8
│   ├── expo-image-picker: ~17.0.8
│   └── expo-gl: ~16.0.7 (for GPU acceleration)
├── Image manipulation tools
│   └── expo-image-manipulator: ^14.0.7
└── Model files in assets/models/
    ├── ampalaya_classifier.tflite ✅
    ├── model_metadata.json ✅
    ├── ampalaya_classifier.h5 (backup)
    └── best_model.h5 (backup)

// Backend (Node.js/Express)
├── Scan model schema (Scan.js) - comprehensive
├── Cloudinary image storage configured
├── User authentication (Google OAuth + Local)
├── MongoDB database setup
└── API routes structure ready
```

#### ⚠️ **Needs Implementation**
```javascript
// Frontend
├── modelService.js - EMPTY (needs full implementation)
├── CameraScreen.js - TODO: ML model integration
└── ResultsScreen.js - Needs prediction display logic

// Backend
├── /api/scans route - NOT YET CREATED
├── Scan controller - MISSING
├── Image upload handling - NEEDS CONFIGURATION
└── ML inference endpoint (optional for hybrid approach)
```

---

## 🛠️ Integration Options

### Option 1: **On-Device Only** (Recommended for MVP)
**Architecture:** Mobile → TFLite Model → Local Processing → Backend (Store Results)

#### ✅ Pros
- **Fast:** Real-time inference (<1 second)
- **Offline capable:** Works without internet
- **Privacy:** Images never leave device until user chooses to save
- **Free:** No inference server costs
- **Low latency:** No network delays

#### ❌ Cons
- Device performance varies (older phones slower)
- Model updates require app update
- Can't leverage more powerful models easily

#### Best For
- MVP and initial launch
- Privacy-sensitive applications
- Unreliable internet connectivity scenarios

---

### Option 2: **Hybrid (Smart Routing)**
**Architecture:** Mobile → Decision Logic → (TFLite OR API) → Backend

```
┌─────────────┐
│   Mobile    │
│   Device    │
└──────┬──────┘
       │
       ├─────────┐ High confidence
       │         │ & fast device
       ├──→ [On-Device TFLite]
       │         │
       │         ↓
       │    Quick Result
       │
       └─────────┐ Low confidence
                 │ OR slow device
                 │ OR user requests
                 ↓
          [Backend API]
                 │
                 ↓
         Server-side Model
          (Higher accuracy)
                 │
                 ↓
            Result +
          Cloud Storage
```

#### ✅ Pros
- Best of both worlds
- Fallback mechanism
- Can use larger/better models server-side
- Collects edge cases for retraining

#### ❌ Cons
- More complex implementation
- Requires backend ML infrastructure
- Higher development cost

#### Best For
- Production-ready system
- High accuracy requirements
- Large user base with varied devices

---

### Option 3: **Server-Side Only**
**Architecture:** Mobile → Upload → Backend ML → Return Result

#### ✅ Pros
- Easy model updates (no app redeployment)
- Can use powerful models
- Consistent results across devices
- Centralized monitoring

#### ❌ Cons
- Requires internet connection
- Slower (upload + processing + download)
- Server infrastructure costs
- Privacy concerns (images uploaded)

#### Best For
- Web applications
- Enterprise solutions
- Complex models too large for mobile

---

## 🎯 Recommended Approach

### **Phase 1: On-Device Only (MVP)** - Target: 2-3 days
Start with Option 1 for fastest time-to-market, then evolve to Option 2.

### Why?
1. ✅ All dependencies already installed
2. ✅ Model files already in project
3. ✅ 100% accuracy means reliable on-device performance
4. ✅ MobileNetV2 is designed for mobile
5. ✅ Matches user expectations (instant results)

### Migration Path
```
Week 1-2:   On-Device MVP ────────┐
                                  │
Week 3-4:   Add Result Storage    ├─→ Launch v1.0
            & History             │
                                  │
Week 5-6:   User Analytics    ────┘

Month 2:    Hybrid Implementation (Optional)
            └─→ Server fallback for edge cases
            └─→ Retrain with user feedback

Month 3+:   Advanced Features
            └─→ Batch processing
            └─→ Historical tracking
            └─→ Harvest predictions
```

---

## 📝 Implementation Plan

### **PHASE 1: Core Model Integration (Days 1-3)**

#### Day 1: Model Service Implementation
**File:** `frontend/mobile-app/src/services/modelService.js`

```javascript
// Complete implementation needed:
- loadModel() - Initialize TFLite model
- preprocessImage() - Resize to 224×224, normalize
- predictFlowerGender() - Run inference
- formatPrediction() - Parse results
- getModelInfo() - Return metadata
```

**Complexity:** Medium  
**Dependencies:** TensorFlow.js, expo-gl  
**Testing:** Unit tests with sample images

---

#### Day 2: Camera Screen Integration
**File:** `frontend/mobile-app/src/screens/CameraScreen.js`

```javascript
// Updates needed:
- Import modelService
- Load model on mount (or lazy load)
- Replace TODO in analyzePicture()
- Add loading states during inference
- Handle prediction errors gracefully
- Navigate to ResultsScreen with predictions
```

**Complexity:** Low (wiring existing pieces)  
**Testing:** Manual testing with camera

---

#### Day 3: Results Screen Creation
**File:** `frontend/mobile-app/src/screens/ResultsScreen.js`

```javascript
// New screen to create:
- Display captured image
- Show prediction (Male/Female)
- Display confidence percentage
- Visual indicators (colors, icons)
- Options: Save to history, Retake, Share
- Navigate to Save flow
```

**Complexity:** Medium (new UI)  
**Testing:** UI/UX testing

---

### **PHASE 2: Backend Integration (Days 4-6)**

#### Day 4: Backend Routes & Controller
**Files to Create:**
- `backend/src/routes/scans.js`
- `backend/src/controllers/scanController.js`

```javascript
// Routes needed:
POST   /api/scans          - Create new scan record
GET    /api/scans          - Get user's scan history
GET    /api/scans/:id      - Get specific scan
PUT    /api/scans/:id      - Update scan (add feedback)
DELETE /api/scans/:id      - Delete scan
GET    /api/scans/stats    - Get user statistics
```

**Complexity:** Medium  
**Testing:** API tests with Postman/Insomnia

---

#### Day 5: Image Upload Configuration
**File:** `backend/src/controllers/scanController.js`

```javascript
// Cloudinary integration:
- Configure multer for image uploads
- Upload to Cloudinary with transformations
- Store URLs in Scan document
- Handle upload errors
- Implement file size limits
```

**Complexity:** Low (Cloudinary already configured)  
**Testing:** Upload tests

---

#### Day 6: Mobile-to-Backend Connection
**File:** `frontend/mobile-app/src/services/scanService.js` (new)

```javascript
// API calls needed:
- saveScan(imageUri, predictions)
- getScanHistory()
- updateScanFeedback(scanId, feedback)
- deleteScan(scanId)
- getUserStats()
```

**Complexity:** Low  
**Testing:** Integration tests

---

### **PHASE 3: History & Polish (Days 7-9)**

#### Day 7: History Screen Enhancement
**File:** `frontend/mobile-app/src/screens/HistoryScreen.js`

```javascript
// Enhancements:
- Fetch scans from backend
- Display in chronological order
- Filter by date, type, confidence
- Pull-to-refresh functionality
- Infinite scroll/pagination
- Delete functionality
```

---

#### Day 8: User Feedback System
**Implementation:**
- Rating system (1-5 stars)
- Correction mechanism ("This is actually male/female")
- Notes field for user comments
- Flag inaccurate predictions
- Use for model retraining

---

#### Day 9: Testing & Bug Fixes
- End-to-end testing
- Performance optimization
- Edge case handling
- Error message refinement
- UI polish

---

## 🔧 Code Adjustments Required

### 1. **modelService.js** - Complete Implementation

```javascript
// frontend/mobile-app/src/services/modelService.js
import * as tf from '@tensorflow/tfjs';
import { bundleResourceIO } from '@tensorflow/tfjs-react-native';
import * as FileSystem from 'expo-file-system';
import * as ImageManipulator from 'expo-image-manipulator';
import { Asset } from 'expo-asset';

class ModelService {
  constructor() {
    this.model = null;
    this.metadata = null;
    this.isReady = false;
  }

  /**
   * Initialize TensorFlow and load the model
   */
  async initialize() {
    try {
      console.log('🤖 Initializing TensorFlow...');
      await tf.ready();
      console.log('✅ TensorFlow ready');
      
      // Load metadata
      const metadataAsset = Asset.fromModule(
        require('../../assets/models/model_metadata.json')
      );
      await metadataAsset.downloadAsync();
      const metadataJson = await FileSystem.readAsStringAsync(
        metadataAsset.localUri
      );
      this.metadata = JSON.parse(metadataJson);
      console.log('✅ Metadata loaded:', this.metadata.model_name);

      // Load TFLite model
      console.log('🔄 Loading model...');
      const modelAsset = Asset.fromModule(
        require('../../assets/models/ampalaya_classifier.tflite')
      );
      await modelAsset.downloadAsync();
      
      this.model = await tf.loadLayersModel(
        bundleResourceIO(modelAsset.localUri)
      );
      
      this.isReady = true;
      console.log('✅ Model loaded successfully');
      
      return true;
    } catch (error) {
      console.error('❌ Model initialization failed:', error);
      throw new Error(`Failed to initialize model: ${error.message}`);
    }
  }

  /**
   * Preprocess image for model input
   */
  async preprocessImage(imageUri) {
    try {
      // Resize to 224×224
      const manipResult = await ImageManipulator.manipulateAsync(
        imageUri,
        [{ resize: { width: 224, height: 224 } }],
        { compress: 1, format: ImageManipulator.SaveFormat.JPEG }
      );

      // Load image as tensor
      const response = await fetch(manipResult.uri);
      const imageBlob = await response.blob();
      const imageBuffer = await new Response(imageBlob).arrayBuffer();
      
      // Convert to tensor and normalize to [0, 1]
      let imageTensor = tf.browser.fromPixels(imageBuffer);
      imageTensor = imageTensor.expandDims(0); // Add batch dimension
      imageTensor = imageTensor.div(255.0); // Normalize

      return imageTensor;
    } catch (error) {
      console.error('❌ Image preprocessing failed:', error);
      throw new Error(`Failed to preprocess image: ${error.message}`);
    }
  }

  /**
   * Predict flower gender (male/female)
   */
  async predictFlowerGender(imageUri) {
    if (!this.isReady) {
      throw new Error('Model not initialized. Call initialize() first.');
    }

    try {
      console.log('🔍 Starting prediction...');
      const startTime = Date.now();

      // Preprocess image
      const inputTensor = await this.preprocessImage(imageUri);

      // Run inference
      const prediction = await this.model.predict(inputTensor);
      const predictionData = await prediction.data();
      
      // Clean up tensors
      inputTensor.dispose();
      prediction.dispose();

      // Parse results
      const confidence = predictionData[0]; // Sigmoid output [0, 1]
      const isMale = confidence > 0.5;
      const gender = isMale ? 'male' : 'female';
      const confidencePercentage = isMale 
        ? confidence * 100 
        : (1 - confidence) * 100;

      const processingTime = Date.now() - startTime;
      console.log(`✅ Prediction complete in ${processingTime}ms`);

      return {
        gender,
        confidence: confidencePercentage,
        rawScore: confidence,
        processingTime,
        modelVersion: this.metadata.version,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error('❌ Prediction failed:', error);
      throw new Error(`Prediction failed: ${error.message}`);
    }
  }

  /**
   * Get model information
   */
  getModelInfo() {
    return {
      ...this.metadata,
      isReady: this.isReady,
      backendInfo: tf.getBackend()
    };
  }

  /**
   * Cleanup resources
   */
  dispose() {
    if (this.model) {
      this.model.dispose();
      this.model = null;
    }
    this.isReady = false;
  }
}

// Singleton instance
export const modelService = new ModelService();
```

**Status:** ⚠️ NEEDS IMPLEMENTATION  
**Priority:** 🔴 CRITICAL  
**Estimated Time:** 3-4 hours

---

### 2. **CameraScreen.js** - Model Integration

**Changes needed in `analyzePicture()` function:**

```javascript
// BEFORE (Current)
const analyzePicture = () => {
  // TODO: Implement ML model integration
  Alert.alert('Analyze', 'Image analysis will be implemented with ML model');
};

// AFTER (Updated)
const analyzePicture = async () => {
  try {
    setIsProcessing(true);
    
    // Ensure model is loaded
    if (!modelService.isReady) {
      await modelService.initialize();
    }
    
    // Run prediction
    const prediction = await modelService.predictFlowerGender(capturedImage);
    
    // Navigate to results with prediction data
    navigation.navigate('Results', {
      imageUri: capturedImage,
      prediction: prediction
    });
    
  } catch (error) {
    console.error('Analysis error:', error);
    Alert.alert(
      'Analysis Failed',
      error.message || 'Unable to analyze image. Please try again.'
    );
  } finally {
    setIsProcessing(false);
  }
};
```

**Additional changes:**
```javascript
// Add imports
import { modelService } from '../services/modelService';

// Add model initialization on mount (optional - lazy load)
useEffect(() => {
  // Preload model for faster first prediction
  modelService.initialize().catch(console.error);
}, []);
```

**Status:** ⚠️ NEEDS UPDATE  
**Priority:** 🔴 HIGH  
**Estimated Time:** 30 minutes

---

### 3. **ResultsScreen.js** - NEW FILE NEEDED

**File:** `frontend/mobile-app/src/screens/ResultsScreen.js`

```javascript
import React, { useState } from 'react';
import { 
  View, 
  Text, 
  Image, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView,
  Alert 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../styles';

export const ResultsScreen = ({ route, navigation }) => {
  const { imageUri, prediction } = route.params;
  const [isSaving, setIsSaving] = useState(false);

  const getGenderIcon = (gender) => {
    return gender === 'male' ? 'male' : 'female';
  };

  const getGenderColor = (gender) => {
    return gender === 'male' ? '#4A90E2' : '#E94B9E';
  };

  const getConfidenceLevel = (confidence) => {
    if (confidence >= 90) return { label: 'Very High', color: '#2ECC71' };
    if (confidence >= 75) return { label: 'High', color: '#3498DB' };
    if (confidence >= 60) return { label: 'Moderate', color: '#F39C12' };
    return { label: 'Low', color: '#E74C3C' };
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // TODO: Implement save to backend
      Alert.alert('Success', 'Scan saved to your history!');
      navigation.navigate('Home');
    } catch (error) {
      Alert.alert('Error', 'Failed to save scan. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleRetake = () => {
    navigation.goBack();
  };

  const confidenceInfo = getConfidenceLevel(prediction.confidence);

  return (
    <ScrollView style={styles.container}>
      {/* Image Preview */}
      <View style={styles.imageContainer}>
        <Image source={{ uri: imageUri }} style={styles.image} />
      </View>

      {/* Results Card */}
      <View style={styles.resultsCard}>
        <View style={styles.resultHeader}>
          <Ionicons 
            name={getGenderIcon(prediction.gender)} 
            size={64} 
            color={getGenderColor(prediction.gender)} 
          />
          <Text style={[
            styles.genderText, 
            { color: getGenderColor(prediction.gender) }
          ]}>
            {prediction.gender.toUpperCase()}
          </Text>
        </View>

        {/* Confidence Bar */}
        <View style={styles.confidenceContainer}>
          <View style={styles.confidenceHeader}>
            <Text style={styles.confidenceLabel}>Confidence</Text>
            <Text style={[
              styles.confidenceBadge,
              { backgroundColor: confidenceInfo.color }
            ]}>
              {confidenceInfo.label}
            </Text>
          </View>
          
          <View style={styles.progressBarBackground}>
            <View 
              style={[
                styles.progressBarFill, 
                { 
                  width: `${prediction.confidence}%`,
                  backgroundColor: confidenceInfo.color
                }
              ]} 
            />
          </View>
          
          <Text style={styles.confidencePercentage}>
            {prediction.confidence.toFixed(1)}%
          </Text>
        </View>

        {/* Metadata */}
        <View style={styles.metadata}>
          <View style={styles.metadataRow}>
            <Ionicons name="time-outline" size={20} color={theme.colors.text.secondary} />
            <Text style={styles.metadataText}>
              Processing time: {prediction.processingTime}ms
            </Text>
          </View>
          <View style={styles.metadataRow}>
            <Ionicons name="git-branch-outline" size={20} color={theme.colors.text.secondary} />
            <Text style={styles.metadataText}>
              Model version: {prediction.modelVersion}
            </Text>
          </View>
        </View>

        {/* Information Box */}
        <View style={styles.infoBox}>
          <Text style={styles.infoTitle}>
            {prediction.gender === 'male' ? '🌼 Male Flower' : '🌸 Female Flower'}
          </Text>
          <Text style={styles.infoDescription}>
            {prediction.gender === 'male' 
              ? 'Male flowers produce pollen and typically appear in clusters. They have thin stems and no fruit development.'
              : 'Female flowers have a small gourd-like structure at the base. They develop into mature gourds after pollination.'
            }
          </Text>
        </View>
      </View>

      {/* Action Buttons */}
      <View style={styles.actionButtons}>
        <TouchableOpacity 
          style={[styles.button, styles.secondaryButton]} 
          onPress={handleRetake}
        >
          <Ionicons name="camera" size={24} color={theme.colors.primary} />
          <Text style={styles.secondaryButtonText}>Retake Photo</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.button, styles.primaryButton]} 
          onPress={handleSave}
          disabled={isSaving}
        >
          <Ionicons name="save" size={24} color="#FFFFFF" />
          <Text style={styles.primaryButtonText}>
            {isSaving ? 'Saving...' : 'Save to History'}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background.primary,
  },
  imageContainer: {
    width: '100%',
    height: 300,
    backgroundColor: '#000000',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  resultsCard: {
    padding: theme.spacing.lg,
  },
  resultHeader: {
    alignItems: 'center',
    paddingVertical: theme.spacing.xl,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  genderText: {
    fontSize: 32,
    fontWeight: 'bold',
    marginTop: theme.spacing.md,
  },
  confidenceContainer: {
    paddingVertical: theme.spacing.lg,
  },
  confidenceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  confidenceLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.text.primary,
  },
  confidenceBadge: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.small,
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  progressBarBackground: {
    height: 12,
    backgroundColor: theme.colors.background.secondary,
    borderRadius: theme.borderRadius.small,
    overflow: 'hidden',
    marginVertical: theme.spacing.sm,
  },
  progressBarFill: {
    height: '100%',
    borderRadius: theme.borderRadius.small,
  },
  confidencePercentage: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.colors.text.primary,
    textAlign: 'center',
    marginTop: theme.spacing.sm,
  },
  metadata: {
    paddingVertical: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  metadataRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: theme.spacing.xs,
  },
  metadataText: {
    fontSize: 14,
    color: theme.colors.text.secondary,
    marginLeft: theme.spacing.sm,
  },
  infoBox: {
    backgroundColor: theme.colors.background.secondary,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.medium,
    marginTop: theme.spacing.lg,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.sm,
  },
  infoDescription: {
    fontSize: 14,
    color: theme.colors.text.secondary,
    lineHeight: 20,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: theme.spacing.lg,
    gap: theme.spacing.md,
  },
  button: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: theme.spacing.md,
    borderRadius: theme.borderRadius.medium,
    gap: theme.spacing.sm,
  },
  primaryButton: {
    backgroundColor: theme.colors.primary,
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: theme.colors.primary,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryButtonText: {
    color: theme.colors.primary,
    fontSize: 16,
    fontWeight: '600',
  },
});
```

**Status:** 🔴 NEW FILE REQUIRED  
**Priority:** 🔴 HIGH  
**Estimated Time:** 2-3 hours

---

### 4. **Backend: Scan Routes** - NEW FILE

**File:** `backend/src/routes/scans.js`

```javascript
const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth');
const scanController = require('../controllers/scanController');
const { upload } = require('../config/cloudinary');

// All routes require authentication
router.use(authenticate);

// Create new scan with image upload
router.post('/', 
  upload.single('image'),
  scanController.createScan
);

// Get user's scan history
router.get('/',
  scanController.getUserScans
);

// Get specific scan
router.get('/:id',
  scanController.getScanById
);

// Update scan (add feedback)
router.put('/:id',
  scanController.updateScan
);

// Delete scan
router.delete('/:id',
  scanController.deleteScan
);

// Get user statistics
router.get('/stats/summary',
  scanController.getUserStats
);

module.exports = router;
```

**Status:** 🔴 NEW FILE REQUIRED  
**Priority:** 🟡 MEDIUM  
**Estimated Time:** 1 hour

---

### 5. **Backend: Scan Controller** - NEW FILE

**File:** `backend/src/controllers/scanController.js`

```javascript
const Scan = require('../models/Scan');
const { uploadToCloudinary } = require('../utils/uploadHelper');

// Create new scan
exports.createScan = async (req, res, next) => {
  try {
    const { predictions, metadata } = req.body;
    
    // Upload image to Cloudinary
    let imageData = {};
    if (req.file) {
      const result = await uploadToCloudinary(req.file);
      imageData = {
        originalName: req.file.originalname,
        filename: result.public_id,
        path: result.secure_url,
        cloudinaryId: result.public_id,
        size: req.file.size,
        mimetype: req.file.mimetype,
        dimensions: {
          width: result.width,
          height: result.height
        }
      };
    }

    // Parse predictions from mobile app
    const scanData = {
      user: req.user._id,
      image: imageData,
      predictions: {
        gourds: [{
          bbox: { x: 0, y: 0, width: 224, height: 224 }, // Default full image
          gender: {
            predicted: predictions.gender,
            confidence: predictions.confidence / 100,
            isFlower: true
          }
        }],
        modelVersion: predictions.modelVersion,
        modelType: 'mobile',
        processingTime: predictions.processingTime
      },
      metadata: {
        ...metadata,
        device: {
          platform: req.get('User-Agent'),
          appVersion: req.get('App-Version')
        }
      },
      status: 'completed'
    };

    const scan = new Scan(scanData);
    await scan.save();

    res.status(201).json({
      success: true,
      message: 'Scan saved successfully',
      scan
    });

  } catch (error) {
    next(error);
  }
};

// Get user's scans
exports.getUserScans = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, sort = '-createdAt' } = req.query;
    
    const scans = await Scan.find({ user: req.user._id })
      .sort(sort)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .select('-__v');

    const total = await Scan.countDocuments({ user: req.user._id });

    res.json({
      success: true,
      scans,
      pagination: {
        total,
        page: Number(page),
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    next(error);
  }
};

// Get specific scan
exports.getScanById = async (req, res, next) => {
  try {
    const scan = await Scan.findOne({
      _id: req.params.id,
      user: req.user._id
    });

    if (!scan) {
      return res.status(404).json({
        success: false,
        message: 'Scan not found'
      });
    }

    res.json({
      success: true,
      scan
    });

  } catch (error) {
    next(error);
  }
};

// Update scan (feedback)
exports.updateScan = async (req, res, next) => {
  try {
    const { userFeedback } = req.body;
    
    const scan = await Scan.findOne({
      _id: req.params.id,
      user: req.user._id
    });

    if (!scan) {
      return res.status(404).json({
        success: false,
        message: 'Scan not found'
      });
    }

    if (userFeedback) {
      scan.userFeedback = { ...scan.userFeedback, ...userFeedback };
    }

    await scan.save();

    res.json({
      success: true,
      message: 'Scan updated successfully',
      scan
    });

  } catch (error) {
    next(error);
  }
};

// Delete scan
exports.deleteScan = async (req, res, next) => {
  try {
    const scan = await Scan.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id
    });

    if (!scan) {
      return res.status(404).json({
        success: false,
        message: 'Scan not found'
      });
    }

    // TODO: Delete from Cloudinary if needed

    res.json({
      success: true,
      message: 'Scan deleted successfully'
    });

  } catch (error) {
    next(error);
  }
};

// Get user statistics
exports.getUserStats = async (req, res, next) => {
  try {
    const stats = await Scan.getUserStats(req.user._id);

    res.json({
      success: true,
      stats
    });

  } catch (error) {
    next(error);
  }
};
```

**Status:** 🔴 NEW FILE REQUIRED  
**Priority:** 🟡 MEDIUM  
**Estimated Time:** 2 hours

---

### 6. **Backend: Register Scan Routes**

**File:** `backend/src/app.js`

**Change needed:**

```javascript
// BEFORE (Line 123)
// this.app.use('/api/scans', require('./routes/scans'));

// AFTER (Line 123)
this.app.use('/api/scans', require('./routes/scans'));
```

**Status:** ⚠️ NEEDS UNCOMMENT  
**Priority:** 🟡 MEDIUM  
**Estimated Time:** 1 minute

---

### 7. **Navigation: Add Results Screen**

**File:** `frontend/mobile-app/src/navigation/AppNavigator.js` (or wherever navigation is configured)

```javascript
// Add to your stack navigator
import { ResultsScreen } from '../screens/ResultsScreen';

// In your navigator component:
<Stack.Screen 
  name="Results" 
  component={ResultsScreen}
  options={{ title: 'Scan Results' }}
/>
```

**Status:** ⚠️ NEEDS UPDATE  
**Priority:** 🔴 HIGH  
**Estimated Time:** 5 minutes

---

### 8. **Screen Index Export**

**File:** `frontend/mobile-app/src/screens/index.js`

```javascript
// Add export
export { ResultsScreen } from './ResultsScreen';
```

---

## 🧪 Testing Strategy

### Unit Tests
```javascript
// Test files to create:
├── modelService.test.js
│   ├── Model initialization
│   ├── Image preprocessing
│   ├── Prediction accuracy
│   └── Error handling
│
├── scanController.test.js
│   ├── Create scan
│   ├── Get scans
│   ├── Update scan
│   └── Delete scan
```

### Integration Tests
```javascript
├── Camera → Model → Results flow
├── Results → Save → Backend flow
├── History retrieval and display
└── Error recovery scenarios
```

### Manual Testing Checklist
- [ ] Take photo with camera
- [ ] Select photo from gallery
- [ ] Prediction completes in <2 seconds
- [ ] Results display correctly
- [ ] Male flowers detected accurately
- [ ] Female flowers detected accurately
- [ ] Confidence shown appropriately
- [ ] Save to history works
- [ ] History displays saved scans
- [ ] Delete scan works
- [ ] App works offline (no backend)
- [ ] App syncs when online
- [ ] Works on low-end devices
- [ ] Works with poor lighting
- [ ] Handles edge cases gracefully

---

## 📋 Deployment Checklist

### Pre-Deployment
- [ ] All code written and reviewed
- [ ] Unit tests passing
- [ ] Integration tests passing
- [ ] Manual testing complete
- [ ] Performance benchmarks met (<2s inference)
- [ ] Error handling robust
- [ ] Logging implemented
- [ ] Documentation updated

### Deployment Steps
1. [ ] Build production APK/IPA
2. [ ] Test on physical devices (iOS + Android)
3. [ ] Deploy backend updates
4. [ ] Run database migrations if needed
5. [ ] Update API endpoints
6. [ ] Submit to app stores (if applicable)
7. [ ] Monitor error logs
8. [ ] Gather user feedback

### Post-Deployment
- [ ] Monitor performance metrics
- [ ] Track prediction accuracy
- [ ] Collect edge cases for retraining
- [ ] User feedback system active
- [ ] Analytics dashboard setup

---

## ⚡ Performance Considerations

### Mobile Optimization
```javascript
// Tips for optimal performance:
1. Lazy load model (on first use, not app start)
2. Cache model in memory after first load
3. Implement prediction queue for multiple images
4. Use WebGL backend for GPU acceleration
5. Implement image compression before upload
6. Add loading states and progress indicators
```

### Expected Performance
| Device Type | Load Time | Inference Time | Memory Usage |
|-------------|-----------|----------------|--------------|
| High-end    | <1s       | <500ms         | ~50 MB       |
| Mid-range   | 1-2s      | 500-1000ms     | ~50 MB       |
| Low-end     | 2-3s      | 1000-2000ms    | ~50 MB       |

### Optimization Strategies
1. **Model Quantization** (if performance is poor)
   - Convert to INT8 quantization
   - Reduces size by 4x
   - Minimal accuracy loss

2. **Batch Processing**
   - Process multiple images at once
   - Better GPU utilization

3. **Progressive Loading**
   - Show preview while processing
   - Non-blocking UI

---

## 🚀 Future Enhancements

### Phase 2 Features (Month 2)
```
🔹 Hybrid inference (fallback to server for low confidence)
🔹 Batch scanning (multiple images at once)
🔹 Historical tracking (growth over time)
🔹 Smart notifications (optimal harvest time)
🔹 Community sharing (anonymized data)
```

### Phase 3 Features (Month 3+)
```
🔸 Multi-class classification (gourd types, diseases)
🔸 Object detection (bounding boxes for multiple flowers)
🔸 Growth stage prediction (days to harvest)
🔸 AR visualization (overlay predictions on camera feed)
🔸 Offline sync (queue predictions, upload later)
🔸 Model versioning (A/B testing for improvements)
```

### Advanced Features
```
🔺 Federated learning (improve model from user data without uploading images)
🔺 3D size estimation (using depth sensors)
🔺 Time-lapse tracking (monitor individual gourds)
🔺 Weather integration (optimal planting/harvesting times)
🔺 Pest/disease detection
🔺 Yield prediction
```

---

## 📊 Success Metrics

### Technical KPIs
- ✅ Inference time: <2 seconds
- ✅ Prediction accuracy: >90%
- ✅ App crash rate: <1%
- ✅ API response time: <500ms
- ✅ Model size: <10 MB

### User Experience KPIs
- ✅ Time to first prediction: <5 seconds
- ✅ User satisfaction: >4/5 stars
- ✅ Feature usage: >50% of users try scan feature
- ✅ Retention: >60% return within 7 days

### Business KPIs
- ✅ Daily active users
- ✅ Scans per user per day
- ✅ User feedback participation rate
- ✅ Data quality for retraining

---

## 🎯 Next Steps

### Immediate Actions (This Week)
1. ✅ Read this document thoroughly
2. ⚠️ Implement `modelService.js`
3. ⚠️ Update `CameraScreen.js`
4. ⚠️ Create `ResultsScreen.js`
5. ⚠️ Test end-to-end flow

### Week 2 Actions
1. ⚠️ Create backend routes and controller
2. ⚠️ Implement image upload
3. ⚠️ Connect mobile app to backend
4. ⚠️ Test save functionality

### Week 3 Actions
1. ⚠️ Enhance history screen
2. ⚠️ Add user feedback system
3. ⚠️ Polish UI/UX
4. ⚠️ Comprehensive testing

---

## 📚 Resources & References

### Documentation
- [TensorFlow.js React Native Guide](https://www.tensorflow.org/js/guide/react_native)
- [Expo Camera Documentation](https://docs.expo.dev/versions/latest/sdk/camera/)
- [MobileNetV2 Paper](https://arxiv.org/abs/1801.04381)

### Code Examples
- [TFLite Example in React Native](https://github.com/tensorflow/tfjs-examples/tree/master/react-native)
- [Image Classification Tutorial](https://www.tensorflow.org/lite/examples/image_classification/overview)

### Tools
- [Netron (Model Visualizer)](https://netron.app/)
- [TensorFlow Model Optimization Toolkit](https://www.tensorflow.org/model_optimization)

---

## ❓ FAQ

**Q: Why on-device instead of server-side inference?**  
A: Faster, works offline, free, better privacy. Your model is small enough (MobileNetV2) and accurate enough (100% test accuracy) to run efficiently on mobile devices.

**Q: What if the model is too slow on some devices?**  
A: We can implement hybrid approach where slow devices fall back to server-side inference.

**Q: How do we handle model updates?**  
A: For MVP, model updates require app updates. Later, we can implement over-the-air model updates using Expo Updates or a custom solution.

**Q: What about privacy concerns?**  
A: On-device inference means images never leave the device unless the user explicitly saves to history. Always get user consent before uploading.

**Q: How accurate will it be in production?**  
A: Training showed 100% test accuracy, but real-world performance may vary (85-95%) due to lighting, angles, image quality. We'll improve with user feedback.

---

## 📝 Summary

### Integration Strategy: ON-DEVICE FIRST ✅

**Why?**
- ✅ All dependencies already installed
- ✅ Model files already in project  
- ✅ Fast implementation (2-3 days)
- ✅ Best user experience (instant results)
- ✅ Works offline
- ✅ Free (no server costs)

### Implementation Order
```
Day 1: modelService.js       [4 hours]
Day 2: CameraScreen updates   [2 hours]
Day 3: ResultsScreen          [4 hours]
Day 4: Backend routes         [4 hours]
Day 5: Backend controller     [4 hours]
Day 6: Integration testing    [4 hours]
Day 7: Polish & bug fixes     [4 hours]
─────────────────────────────────────
Total: ~7 days (28 hours)
```

### Key Files to Create/Modify
```
✏️ MODIFY:
   ├── frontend/mobile-app/src/services/modelService.js (EMPTY → COMPLETE)
   ├── frontend/mobile-app/src/screens/CameraScreen.js (ADD: model integration)
   └── backend/src/app.js (UNCOMMENT: scans route)

🆕 CREATE:
   ├── frontend/mobile-app/src/screens/ResultsScreen.js
   ├── frontend/mobile-app/src/services/scanService.js
   ├── backend/src/routes/scans.js
   └── backend/src/controllers/scanController.js
```

### Success Criteria Met When:
- ✅ User can take/select photo
- ✅ Model predicts male/female in <2 seconds
- ✅ Results display with confidence
- ✅ Save to history works
- ✅ History screen shows saved scans
- ✅ App works offline for predictions

---

**Document Status:** ✅ COMPLETE  
**Last Updated:** October 31, 2025  
**Next Review:** After Phase 1 Implementation  

---

*Ready to start? Begin with implementing `modelService.js`!* 🚀
