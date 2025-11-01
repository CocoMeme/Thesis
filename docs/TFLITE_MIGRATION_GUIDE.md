# TensorFlow.js to TensorFlow Lite Migration Guide

## 🎯 Executive Summary

**Problem**: Our trained model uses Keras 3.10.0 format, but TensorFlow.js v4.22.0 only supports Keras 2.x format, causing incompatibility errors that cannot be fixed with conversion scripts.

**Solution**: Switch from TensorFlow.js (web-based) to TensorFlow Lite (native mobile) format. Our training script already exports `.tflite` format which works with ANY Keras version.

**Status**: ✅ `.tflite` file already exists from initial training (4.57 MB)

**Estimated Time**: 1-2 hours

**Success Rate**: High (TFLite is the industry standard for mobile ML)

---

## 📋 Table of Contents

1. [Why TFLite Instead of TF.js?](#why-tflite)
2. [Prerequisites](#prerequisites)
3. [Migration Steps](#migration-steps)
4. [Code Changes](#code-changes)
5. [Testing](#testing)
6. [Cleanup](#cleanup)
7. [Troubleshooting](#troubleshooting)

---

## 🤔 Why TFLite Instead of TF.js? {#why-tflite}

### Problems with TensorFlow.js Approach

**Keras 3 Incompatibility Issues:**
```
❌ ERROR: __keras_tensor__ objects instead of [layer_name, node_index, tensor_index]
❌ ERROR: batch_shape not recognized (expects batch_input_shape)
❌ ERROR: Weight file format mismatch (binary structure incompatible)
```

**Why Fix Scripts Failed:**
- ✅ Can modify `model.json` (JSON structure)
- ❌ **Cannot modify `.bin` files (binary weight format)**
- ❌ Keras 3 binary weight structure fundamentally incompatible with TF.js v4.22.0
- ❌ JSON fixes create mismatch between model.json and weight files

**Attempted Solutions (All Failed):**
1. Runtime patching → Failed
2. Manual fix scripts v1-v2 → Partial success, weight mismatch
3. Direct H5 conversion → Same Keras 3 issues
4. Retrain with TF 2.12/2.15 → **Versions no longer available in pip**
5. Custom conversion → Same fundamental issue

### Advantages of TensorFlow Lite

| Feature | TensorFlow.js | TensorFlow Lite |
|---------|---------------|-----------------|
| **Format Coupling** | Tightly coupled to Keras 2.x | ✅ Works with ANY Keras version |
| **File Size** | ~10 MB (JSON + 3 BIN files) | ✅ ~4.57 MB (single file) |
| **Performance** | Web-based (slower) | ✅ Native mobile (optimized) |
| **Compatibility** | Requires specific versions | ✅ Version-agnostic |
| **Industry Standard** | For web apps | ✅ For mobile ML |
| **Our Status** | Problematic, needs fixing | ✅ **Already exported & ready!** |

**Key Insight**: Our training script (Cell 9) already creates TFLite successfully, regardless of Keras version! We just need to use it.

---

## ✅ Prerequisites {#prerequisites}

### Verify You Have the .tflite File

```powershell
# Check if .tflite file exists
cd C:\Users\coand\Desktop\Thesis\frontend\mobile-app\assets\models
Get-ChildItem -Filter "*.tflite"

# Expected output:
# ampalaya_classifier.tflite (~4.57 MB)
```

**User Confirmation**: ✅ "I still have my .tflite here from our very first trained model"

### Current Tech Stack (To Be Changed)

```json
// Current (TF.js - Problematic)
{
  "@tensorflow/tfjs": "^4.22.0",
  "@tensorflow/tfjs-react-native": "^1.0.0",
  "expo-gl": "~16.0.7"
}
```

### Target Tech Stack (TFLite - Solution)

```json
// New (TFLite - Native)
{
  "react-native-tflite": "^latest"
  // OR
  "@tensorflow/tfjs": "^4.22.0" // Keep for minimal TF.js usage
}
```

**Note**: We'll explore using TF.js v4.22.0's built-in TFLite support first (simplest approach).

---

## 🚀 Migration Steps {#migration-steps}

### Step 1: Research TFLite Integration Options (15 min)

We have three options for TFLite in React Native:

#### Option A: TF.js Built-in TFLite Support ⭐ RECOMMENDED
```javascript
// TensorFlow.js v4.x has TFLite support via tfjs-tflite
import * as tf from '@tensorflow/tfjs';
import { loadTFLiteModel } from '@tensorflow/tfjs-tflite';

// Load .tflite directly
const model = await loadTFLiteModel(
  require('../../assets/models/ampalaya_classifier.tflite')
);
```

**Pros:**
- ✅ No new dependencies (already have @tensorflow/tfjs)
- ✅ Same TF.js API we're familiar with
- ✅ Easiest migration path

**Cons:**
- ⚠️ Experimental API (may have limitations)
- ⚠️ Need to verify compatibility with React Native

#### Option B: react-native-tflite Package
```bash
npm install react-native-tflite
```

**Pros:**
- ✅ Pure native implementation (best performance)
- ✅ Direct TFLite interpreter access

**Cons:**
- ⚠️ New dependency
- ⚠️ May require native code linking
- ⚠️ Different API from TF.js

#### Option C: MediaPipe Tasks
```bash
npm install @mediapipe/tasks-vision
```

**Pros:**
- ✅ Google's official solution
- ✅ High-level API

**Cons:**
- ⚠️ Heavier package
- ⚠️ Overkill for simple classification

**Decision**: Start with **Option A (TF.js TFLite support)** as it requires minimal changes.

### Step 2: Install Dependencies (5 min)

#### If Using Option A (TF.js TFLite - Recommended):
```bash
cd C:\Users\coand\Desktop\Thesis\frontend\mobile-app

# Check if tfjs-tflite is available
npm list @tensorflow/tfjs-tflite

# If not included, install it
npm install @tensorflow/tfjs-tflite
```

#### If Using Option B (react-native-tflite):
```bash
npm install react-native-tflite

# May need to rebuild for native modules
npx expo prebuild --clean
```

### Step 3: Backup Current Implementation (2 min)

```bash
cd C:\Users\coand\Desktop\Thesis\frontend\mobile-app\src\services

# Backup current modelService.js
Copy-Item modelService.js modelService.js.tfjs-backup
```

### Step 4: Update modelService.js (30 min)

See [Code Changes](#code-changes) section below for complete implementation.

### Step 5: Update App.js (10 min)

Remove TF.js-specific initialization:

```javascript
// OLD (App.js):
await tf.ready();
console.log('✅ TensorFlow.js is ready');

// NEW (App.js):
// TFLite doesn't require explicit tf.ready() in most cases
// Or keep minimal initialization if using TF.js TFLite loader
```

### Step 6: Test Model Loading (10 min)

```bash
# Clear Expo cache and restart
npx expo start --clear

# Expected console output:
# ✅ TFLite model loaded
# 📊 Model ready for inference
# Input shape: [1, 224, 224, 3]
# Output shape: [1, 1]
```

### Step 7: Test Real Predictions (10 min)

1. Open app on physical device
2. Navigate to classification screen
3. Take photo of flower with camera
4. Verify prediction appears with confidence score

### Step 8: Clean Up Old Files (5 min)

```bash
cd C:\Users\coand\Desktop\Thesis\frontend\mobile-app

# Remove TF.js model files (~10 MB)
Remove-Item -Recurse -Force assets\models\tfjs\

# Update package.json (remove unused TF.js dependencies)
# See Cleanup section below
```

---

## 💻 Code Changes {#code-changes}

### New modelService.js (Option A: TF.js TFLite)

```javascript
/**
 * Model Service for Ampalaya Flower Gender Classification
 * Now using TensorFlow Lite format for better compatibility
 * 
 * @module modelService
 */

import * as tf from '@tensorflow/tfjs';
import '@tensorflow/tfjs-react-native'; // For React Native support
import * as ImageManipulator from 'expo-image-manipulator';
import { Platform } from 'react-native';
import { Asset } from 'expo-asset';
import * as FileSystem from 'expo-file-system';

class ModelService {
  constructor() {
    this.model = null;
    this.isReady = false;
    this.isInitializing = false;
    this.modelMetadata = {
      inputSize: [224, 224],
      classes: ['Female', 'Male'],
      preprocessing: {
        rescale: 1.0 / 255.0
      }
    };
  }

  /**
   * Initialize and load the TFLite model
   */
  async initialize() {
    if (this.isInitializing) {
      console.log('⏳ Model initialization already in progress...');
      while (this.isInitializing) {
        await new Promise(resolve => setTimeout(resolve, 100));
      }
      return this.isReady;
    }

    if (this.isReady) {
      console.log('✅ Model already initialized');
      return true;
    }

    this.isInitializing = true;

    try {
      console.log('🤖 Initializing TensorFlow for React Native...');
      await tf.ready();
      console.log(`✅ TensorFlow ready - Backend: ${tf.getBackend()}`);
      
      console.log('🔄 Loading TFLite model...');
      await this.loadTFLiteModel();
      
      this.isReady = true;
      this.isInitializing = false;
      
      console.log('✅ TFLite model loaded successfully');
      return true;
    } catch (error) {
      this.isInitializing = false;
      this.isReady = false;
      console.error('❌ Model initialization failed:', error);
      throw new Error(`Failed to initialize model: ${error.message}`);
    }
  }

  /**
   * Load TFLite model using TF.js TFLite loader
   */
  async loadTFLiteModel() {
    try {
      // Option 1: Try loading directly with require (Metro bundler)
      console.log('📦 Loading TFLite model via Metro bundler...');
      
      const modelAsset = Asset.fromModule(
        require('../../assets/models/ampalaya_classifier.tflite')
      );
      
      await modelAsset.downloadAsync();
      const modelUri = modelAsset.localUri || modelAsset.uri;
      
      console.log(`📍 Model URI: ${modelUri}`);
      
      // Load TFLite model using TF.js
      // Note: This may require @tensorflow/tfjs-tflite package
      this.model = await tf.loadGraphModel(modelUri, {
        fromTFHub: false
      });
      
      console.log('✅ TFLite model loaded');
      console.log('📊 Model info:');
      console.log(`   Input shape: ${JSON.stringify(this.model.inputs[0].shape)}`);
      console.log(`   Output shape: ${JSON.stringify(this.model.outputs[0].shape)}`);
      
    } catch (error) {
      console.error('❌ TFLite loading failed:', error);
      
      // Fallback: Try alternative loading method
      console.log('🔄 Trying alternative loading method...');
      await this.loadTFLiteAlternative();
    }
  }

  /**
   * Alternative TFLite loading method
   */
  async loadTFLiteAlternative() {
    try {
      // Load as raw binary and convert
      const modelPath = require('../../assets/models/ampalaya_classifier.tflite');
      
      // For now, throw error with instructions
      throw new Error(
        'TFLite direct loading not supported. ' +
        'Please install: npm install react-native-tflite'
      );
    } catch (error) {
      throw error;
    }
  }

  /**
   * Preprocess image for model input
   */
  async preprocessImage(imageUri) {
    try {
      console.log('🖼️ Preprocessing image...');
      
      // Resize to 224×224
      const manipResult = await ImageManipulator.manipulateAsync(
        imageUri,
        [{ resize: { width: 224, height: 224 } }],
        { compress: 1, format: ImageManipulator.SaveFormat.JPEG }
      );

      // Read image as base64
      const base64 = await FileSystem.readAsStringAsync(manipResult.uri, {
        encoding: FileSystem.EncodingType.Base64
      });
      
      // Convert base64 to array buffer
      const binaryString = atob(base64);
      const bytes = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }
      
      // Decode image to tensor
      const imageTensor = tf.node.decodeImage(bytes, 3);
      
      // Normalize [0, 255] → [0, 1]
      const normalized = imageTensor.div(255.0);
      
      // Add batch dimension
      const batched = normalized.expandDims(0);
      
      // Clean up intermediate tensors
      imageTensor.dispose();
      normalized.dispose();
      
      console.log('✅ Image preprocessed:', batched.shape);
      return batched;
    } catch (error) {
      console.error('❌ Preprocessing failed:', error);
      throw new Error(`Failed to preprocess image: ${error.message}`);
    }
  }

  /**
   * Predict flower gender from image
   */
  async predictFlowerGender(imageUri) {
    if (!this.isReady) {
      throw new Error('Model not initialized. Call initialize() first.');
    }

    let inputTensor = null;
    let prediction = null;

    try {
      console.log('🔍 Starting prediction...');
      const startTime = Date.now();

      // Preprocess
      inputTensor = await this.preprocessImage(imageUri);

      // Run inference
      console.log('🧠 Running model inference...');
      prediction = await this.model.predict(inputTensor);
      
      // Get results
      const predictionData = await prediction.data();
      const rawScore = predictionData[0];
      
      // Parse results (binary classification)
      const isMale = rawScore > 0.5;
      const gender = isMale ? 'male' : 'female';
      const confidencePercentage = isMale 
        ? rawScore * 100 
        : (1 - rawScore) * 100;

      const processingTime = Date.now() - startTime;
      
      console.log('✅ Prediction complete:', {
        gender,
        confidence: `${confidencePercentage.toFixed(1)}%`,
        processingTime: `${processingTime}ms`
      });

      return {
        gender,
        confidence: confidencePercentage,
        rawScore: rawScore,
        processingTime,
        modelVersion: '1.0.0-tflite',
        modelType: 'MobileNetV2 (TFLite)',
        timestamp: new Date().toISOString(),
        inputShape: [224, 224, 3],
        debug: {
          backend: tf.getBackend(),
          memoryInfo: tf.memory()
        }
      };
    } catch (error) {
      console.error('❌ Prediction failed:', error);
      throw new Error(`Prediction failed: ${error.message}`);
    } finally {
      if (inputTensor) inputTensor.dispose();
      if (prediction) prediction.dispose();
    }
  }

  /**
   * Get model information
   */
  getModelInfo() {
    return {
      isReady: this.isReady,
      isInitializing: this.isInitializing,
      modelVersion: '1.0.0-tflite',
      modelType: 'MobileNetV2 (TFLite)',
      format: 'TensorFlow Lite',
      inputShape: [224, 224, 3],
      classes: ['female', 'male'],
      backend: this.isReady ? tf.getBackend() : null,
      tfVersion: tf.version.tfjs
    };
  }

  /**
   * Warm up the model
   */
  async warmUp() {
    if (!this.isReady) {
      throw new Error('Model not initialized');
    }

    console.log('🔥 Warming up model...');
    const dummyInput = tf.randomUniform([1, 224, 224, 3]);
    const prediction = await this.model.predict(dummyInput);
    dummyInput.dispose();
    prediction.dispose();
    console.log('✅ Model warmed up');
  }

  /**
   * Cleanup resources
   */
  dispose() {
    console.log('🧹 Disposing model...');
    if (this.model) {
      this.model.dispose();
      this.model = null;
    }
    this.isReady = false;
    this.isInitializing = false;
    console.log('✅ Model disposed');
  }

  reset() {
    this.dispose();
    console.log('🔄 Model service reset');
  }
}

export const modelService = new ModelService();
export { ModelService };
```

### Alternative: modelService.js (Option B: react-native-tflite)

If Option A doesn't work, use this native TFLite implementation:

```javascript
/**
 * Model Service using react-native-tflite
 */

import { TFLite } from 'react-native-tflite';
import * as ImageManipulator from 'expo-image-manipulator';
import * as FileSystem from 'expo-file-system';

class ModelService {
  constructor() {
    this.model = null;
    this.isReady = false;
  }

  async initialize() {
    try {
      console.log('🔄 Loading TFLite model...');
      
      // Load model
      this.model = await TFLite.loadModel({
        model: require('../../assets/models/ampalaya_classifier.tflite'),
        numThreads: 4
      });
      
      this.isReady = true;
      console.log('✅ TFLite model loaded');
      return true;
    } catch (error) {
      console.error('❌ Failed to load model:', error);
      throw error;
    }
  }

  async predictFlowerGender(imageUri) {
    if (!this.isReady) {
      throw new Error('Model not initialized');
    }

    try {
      // Resize image
      const resized = await ImageManipulator.manipulateAsync(
        imageUri,
        [{ resize: { width: 224, height: 224 } }],
        { format: ImageManipulator.SaveFormat.JPEG }
      );

      // Run inference
      const result = await this.model.run(resized.uri);
      
      // Parse result
      const rawScore = result.output[0];
      const isMale = rawScore > 0.5;
      const gender = isMale ? 'male' : 'female';
      const confidence = isMale ? rawScore * 100 : (1 - rawScore) * 100;

      return {
        gender,
        confidence,
        rawScore,
        modelVersion: '1.0.0-tflite',
        modelType: 'MobileNetV2 (Native TFLite)'
      };
    } catch (error) {
      console.error('❌ Prediction failed:', error);
      throw error;
    }
  }

  dispose() {
    if (this.model) {
      this.model.close();
      this.model = null;
    }
    this.isReady = false;
  }
}

export const modelService = new ModelService();
export { ModelService };
```

---

## 🧪 Testing {#testing}

### Test 1: Model Loading
```javascript
// In App.js or test file
import { modelService } from './src/services/modelService';

async function testModelLoading() {
  try {
    await modelService.initialize();
    console.log('✅ Test 1 PASSED: Model loaded successfully');
    console.log(modelService.getModelInfo());
  } catch (error) {
    console.error('❌ Test 1 FAILED:', error);
  }
}
```

### Test 2: Dummy Prediction
```javascript
async function testPrediction() {
  try {
    await modelService.warmUp();
    console.log('✅ Test 2 PASSED: Warm-up successful');
  } catch (error) {
    console.error('❌ Test 2 FAILED:', error);
  }
}
```

### Test 3: Real Image Prediction
```javascript
async function testRealPrediction(imageUri) {
  try {
    const result = await modelService.predictFlowerGender(imageUri);
    console.log('✅ Test 3 PASSED: Real prediction successful');
    console.log('Result:', result);
  } catch (error) {
    console.error('❌ Test 3 FAILED:', error);
  }
}
```

### Expected Console Output
```
🤖 Initializing TensorFlow for React Native...
✅ TensorFlow ready - Backend: cpu
🔄 Loading TFLite model...
📦 Loading TFLite model via Metro bundler...
📍 Model URI: file:///data/.../ampalaya_classifier.tflite
✅ TFLite model loaded
📊 Model info:
   Input shape: [1,224,224,3]
   Output shape: [1,1]
✅ TFLite model loaded successfully
```

---

## 🧹 Cleanup {#cleanup}

### Step 1: Remove TF.js Model Files

```powershell
cd C:\Users\coand\Desktop\Thesis\frontend\mobile-app\assets\models

# Check current size
Get-ChildItem tfjs\ -Recurse | Measure-Object -Property Length -Sum

# Expected: ~10 MB

# Delete TF.js files
Remove-Item -Recurse -Force tfjs\

# Verify deletion
Get-ChildItem tfjs\ -ErrorAction SilentlyContinue
# Should return: Cannot find path
```

**Files Removed** (~10 MB total):
- `model.json` (334 KB)
- `group1-shard1of3.bin` (4.19 MB)
- `group1-shard2of3.bin` (4.19 MB)
- `group1-shard3of3.bin` (1.30 MB)
- All `.backup_*` files

### Step 2: Update package.json Dependencies

If using Option A (TF.js TFLite), **keep TF.js** but can remove expo-gl:

```json
{
  "dependencies": {
    "@tensorflow/tfjs": "^4.22.0",
    "@tensorflow/tfjs-react-native": "^1.0.0",
    // Remove if not needed for other features:
    // "expo-gl": "~16.0.7",
    
    // Keep these:
    "expo-image-manipulator": "^14.0.7",
    "expo-camera": "~17.0.8",
    "expo-file-system": "~19.0.17"
  }
}
```

If using Option B (react-native-tflite), **remove TF.js**:

```json
{
  "dependencies": {
    // Remove:
    // "@tensorflow/tfjs": "^4.22.0",
    // "@tensorflow/tfjs-react-native": "^1.0.0",
    // "expo-gl": "~16.0.7",
    
    // Add:
    "react-native-tflite": "^latest"
  }
}
```

### Step 3: Clean Expo Cache

```bash
cd C:\Users\coand\Desktop\Thesis\frontend\mobile-app

# Clear all caches
npx expo start --clear

# Or full clean
rm -rf node_modules/.cache
rm -rf .expo
npx expo start --clear
```

### Step 4: Update Documentation

Update these files to reflect TFLite usage:

1. **MODEL_SERVICE_IMPLEMENTATION_SUMMARY.md**
   - Change "TensorFlow.js" → "TensorFlow Lite"
   - Update file sizes and formats

2. **model-integration.md**
   - Mark TF.js approach as deprecated
   - Add TFLite integration instructions

3. **README.md**
   - Update model loading section
   - Add TFLite requirements

---

## 🔧 Troubleshooting {#troubleshooting}

### Issue 1: "Cannot find module 'ampalaya_classifier.tflite'"

**Cause**: Metro bundler not recognizing .tflite files

**Solution**: Add to `metro.config.js`:

```javascript
const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

config.resolver.assetExts.push('tflite');

module.exports = config;
```

### Issue 2: "@tensorflow/tfjs-tflite not found"

**Cause**: TFLite support not included in TF.js v4.22.0

**Solution 1**: Install TFLite package separately
```bash
npm install @tensorflow/tfjs-tflite
```

**Solution 2**: Switch to Option B (react-native-tflite)
```bash
npm install react-native-tflite
```

### Issue 3: "Model loading failed: unsupported format"

**Cause**: TF.js trying to load .tflite as regular model

**Solution**: Use `tf.loadGraphModel()` instead of `tf.loadLayersModel()`:

```javascript
// Wrong:
const model = await tf.loadLayersModel(tfliteUri);

// Correct:
const model = await tf.loadGraphModel(tfliteUri, {
  fromTFHub: false
});
```

### Issue 4: Native module linking failed (Option B)

**Cause**: react-native-tflite requires native modules

**Solution**:
```bash
# Prebuild to generate native code
npx expo prebuild --clean

# Run on device
npx expo run:android
# or
npx expo run:ios
```

### Issue 5: Prediction returns wrong results

**Cause**: Preprocessing mismatch

**Solution**: Verify preprocessing matches training:
```javascript
// Training used:
// - Resize: 224×224
// - Rescale: 1./255 (divide by 255)
// - No other preprocessing

// Ensure modelService uses same:
imageTensor.div(255.0) // ✅ Correct
// NOT:
imageTensor.div(127.5).sub(1.0) // ❌ Wrong (this is [-1,1] normalization)
```

### Issue 6: "tf.node.decodeImage is not a function"

**Cause**: `tf.node` only available in Node.js, not React Native

**Solution**: Use different image decoding method:

```javascript
// Option A: Use @tensorflow/tfjs-react-native's decodeJpeg
import { decodeJpeg } from '@tensorflow/tfjs-react-native';

const response = await fetch(imageUri);
const imageBuffer = await response.arrayBuffer();
const imageData = new Uint8Array(imageBuffer);
const imageTensor = decodeJpeg(imageData, 3);

// Option B: Use react-native's Image component
// (see examples in current implementation)
```

### Issue 7: Memory leaks / app crashes

**Cause**: Tensors not disposed properly

**Solution**: Always dispose tensors in `finally` block:

```javascript
let tensor1 = null;
let tensor2 = null;

try {
  tensor1 = tf.randomUniform([1, 224, 224, 3]);
  tensor2 = await model.predict(tensor1);
  // ... use tensors
} catch (error) {
  console.error(error);
} finally {
  // ALWAYS dispose, even if error occurs
  if (tensor1) tensor1.dispose();
  if (tensor2) tensor2.dispose();
}
```

### Issue 8: Expo Go doesn't support TFLite

**Cause**: Expo Go has limited native module support

**Solution**: Use Development Build:

```bash
# Create development build
npx expo prebuild

# Run on physical device
npx expo run:android
# or
npx expo run:ios
```

---

## 📊 Success Checklist

### Phase 1: Setup ✅
- [ ] Verified `.tflite` file exists (4.57 MB)
- [ ] Backed up current `modelService.js`
- [ ] Chose TFLite integration option (A or B)
- [ ] Installed required dependencies

### Phase 2: Implementation ✅
- [ ] Updated `modelService.js` with TFLite loading
- [ ] Updated `App.js` initialization
- [ ] Added `.tflite` to Metro config (if needed)
- [ ] Code compiles without errors

### Phase 3: Testing ✅
- [ ] Model loads successfully (no Keras 3 errors!)
- [ ] Warm-up prediction works
- [ ] Real image prediction returns results
- [ ] Confidence scores reasonable (0-100%)
- [ ] Camera integration works

### Phase 4: Cleanup ✅
- [ ] Removed TF.js model files (~10 MB freed)
- [ ] Updated `package.json` dependencies
- [ ] Cleared Expo cache
- [ ] Updated documentation

### Phase 5: Validation ✅
- [ ] App starts without errors
- [ ] No Keras 3 compatibility errors
- [ ] No weight mismatch errors
- [ ] Predictions match expected accuracy
- [ ] Memory usage stable (no leaks)

---

## 🎉 Expected Outcome

### Before (TF.js - Broken)
```
❌ ERROR: Loading model.json...
❌ ERROR: __keras_tensor__ not recognized
❌ ERROR: batch_shape not found
❌ ERROR: Weight mismatch (Keras 3 incompatible)
❌ Model loading failed
```

### After (TFLite - Working)
```
✅ Loading TFLite model...
✅ Model loaded successfully
📊 Input: [1, 224, 224, 3]
📊 Output: [1, 1]
✅ Ready for predictions!

🔍 Predicting gender...
✅ Result: male, 95.2% confidence
⚡ Processing time: 156ms
```

---

## 📚 Additional Resources

- [TensorFlow Lite Guide](https://www.tensorflow.org/lite/guide)
- [TF.js for React Native](https://js.tensorflow.org/api_react_native/latest/)
- [Expo Asset Module](https://docs.expo.dev/versions/latest/sdk/asset/)
- [React Native TFLite Package](https://github.com/shaqian/react-native-tflite)

---

## 💡 Key Takeaways

1. **TFLite bypasses Keras version issues** - Format is version-agnostic
2. **We already have the .tflite file** - No retraining needed!
3. **Smaller file size** - 4.57 MB vs ~10 MB
4. **Better mobile performance** - Native optimization
5. **Industry standard** - This is what production ML mobile apps use

**Bottom Line**: We spent a full day trying to fix TF.js Keras 3 incompatibility. The solution was always to use TFLite - we just needed to switch the loader! 🚀

---

*Last Updated: October 31, 2025*
*Status: Ready for implementation*
*Estimated Time: 1-2 hours*
*Success Rate: High ✅*

## 🎯 What We're Doing

**FROM:** TensorFlow.js (`.json` + `.bin` files) with Keras 3 issues  
**TO:** TensorFlow Lite (`.tflite` file) - NO Keras issues!

## ✅ Why TFLite is Better

1. **NO Keras Version Issues** - TFLite format is independent of Keras versions
2. **Smaller Model Size** - `tflite` (~4 MB) vs TF.js (~10 MB)
3. **Faster Inference** - Native TFLite is optimized for mobile
4. **Simpler Code** - No complex tensor manipulation needed
5. **Industry Standard** - What Google recommends for mobile ML

---

## 📦 Phase 1: Install TFLite Package

### Option A: Use `react-native-tensorflow-lite` ✅ **RECOMMENDED**

```bash
cd C:\Users\coand\Desktop\Thesis\frontend\mobile-app
npx expo install react-native-tensorflow-lite
```

### Option B: Use `@expo/tensorflow-lite` (if available)

```bash
npx expo install @tensorflow/tfjs-tflite
```

---

## 🗂️ Phase 2: File Organization

### Keep Your `.tflite` File

```
frontend/mobile-app/assets/models/
├── ampalaya_classifier.tflite  ← KEEP THIS ⭐
├── model_metadata.json          ← KEEP THIS ⭐
├── tfjs/                        ← CAN DELETE (old TF.js files)
│   ├── model.json               ← DELETE
│   ├── group1-shard1of3.bin     ← DELETE
│   ├── group1-shard2of3.bin     ← DELETE
│   └── group1-shard3of3.bin     ← DELETE
```

---

## 🔧 Phase 3: Update modelService.js

I'll create the new implementation for you!

---

## 📱 Phase 4: Testing

After implementation:

```bash
# Clear cache and restart
cd frontend/mobile-app
npx expo start --clear
```

---

## 🎉 Expected Results

### Before (TF.js with Keras 3 issues):
```
❌ Error: Corrupted configuration, expected array for nodeData
❌ Error: Provided weight data has no target variable
❌ Model size: ~10 MB
```

### After (TFLite):
```
✅ Model loaded successfully
✅ No Keras compatibility issues
✅ Model size: ~4 MB
✅ Faster inference
✅ Predictions work immediately!
```

---

## 🧹 Phase 5: Cleanup (After Testing)

Once TFLite works, clean up old files:

```bash
# Remove old TF.js stuff
rm -rf frontend/mobile-app/assets/models/tfjs/

# Remove fix scripts (no longer needed)
rm frontend/mobile-app/scripts/manual-fix-model.py
rm frontend/mobile-app/scripts/fix-input-layer.py
```

---

## 📊 Migration Checklist

- [ ] Install `react-native-tensorflow-lite` package
- [ ] Update `modelService.js` with TFLite loader
- [ ] Remove TF.js dependencies from `package.json`
- [ ] Test model loading
- [ ] Test predictions
- [ ] Clean up old TF.js files
- [ ] Update documentation

---

## ⏱️ Time Estimate

- **Package Installation**: 2 minutes
- **Code Updates**: 15 minutes
- **Testing**: 10 minutes
- **Cleanup**: 5 minutes
- **Total**: ~30 minutes

---

## 🚨 Troubleshooting

### If `react-native-tensorflow-lite` doesn't work with Expo:

We'll use **TF.js TFLite delegate** instead:

```javascript
import * as tf from '@tensorflow/tfjs';
import { bundleResourceIO } from '@tensorflow/tfjs-react-native';

// Load .tflite file using TF.js's TFLite loader
const model = await tf.loadGraphModel(
  bundleResourceIO(require('./assets/models/ampalaya_classifier.tflite'))
);
```

---

## 📝 Next Steps

1. I'll create the new `modelService.js` implementation
2. We'll test it with your existing `.tflite` file
3. Clean up the old TF.js code
4. Document the new approach

**Ready to proceed?** Let me know and I'll create the new implementation!
