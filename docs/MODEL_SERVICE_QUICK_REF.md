# Model Service - Quick Reference Card

## 🚀 Import
```javascript
import { modelService } from '../services/modelService';
```

## 📋 Basic Usage

### Initialize (Do Once)
```javascript
await modelService.initialize();
```

### Predict Single Image
```javascript
const result = await modelService.predictFlowerGender(imageUri);
// Returns: { gender: 'male'|'female', confidence: 0-100, ... }
```

### Predict Multiple Images
```javascript
const results = await modelService.predictBatch([uri1, uri2, uri3]);
```

## 📊 Result Object
```javascript
{
  gender: 'male' | 'female',      // Prediction
  confidence: 95.5,                // 0-100
  rawScore: 0.955,                 // 0-1
  processingTime: 523,             // milliseconds
  modelVersion: '1.0.0',
  timestamp: '2025-10-31T...'
}
```

## 🔍 Status Checks
```javascript
modelService.isReady              // boolean
modelService.getModelInfo()       // Full info
modelService.getModelMetrics()    // Training metrics
modelService.getMemoryInfo()      // Memory usage
```

## 🧹 Cleanup
```javascript
modelService.dispose()            // Free memory
modelService.reset()              // Full reset
```

## ⚡ Performance Tips
```javascript
// Warm up for faster first prediction
await modelService.warmUp();

// Check processing time
if (result.processingTime > 2000) {
  console.warn('Slow prediction detected');
}
```

## ❌ Error Handling
```javascript
try {
  const result = await modelService.predictFlowerGender(uri);
} catch (error) {
  if (error.message.includes('not initialized')) {
    await modelService.initialize();
  } else {
    Alert.alert('Error', 'Failed to analyze image');
  }
}
```

## 📖 Full Documentation
See: `src/services/README_MODEL_SERVICE.md`
