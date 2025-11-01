# Model Files Guide - What Each File Does

## 📦 Complete File Breakdown

After training completes, you'll have **6 files** saved to Google Drive. Here's what each one is for:

---

## ⭐⭐⭐ ESSENTIAL FILES (Must Have)

### 1. `ampalaya_classifier.tflite` (3-4 MB)
**🎯 Purpose:** Mobile-optimized model for your Expo React Native app

**What it is:**
- Compressed version of the trained model
- Optimized for mobile/edge devices
- Uses TensorFlow Lite format
- Smaller size, faster inference

**Why you need it:**
- This is THE file your mobile app will load
- Runs efficiently on phones/tablets
- No internet needed for predictions
- Fast real-time classification

**How to use:**
```javascript
// In your Expo app
import * as tf from '@tensorflow/tfjs';
const model = await tf.loadLayersModel(tfliteFile);
```

**Must download:** ✅ YES - This is your production model!

---

### 2. `model_metadata.json` (<1 KB)
**🎯 Purpose:** Configuration file with all model settings

**What it contains:**
```json
{
  "model_name": "Ampalaya Flower Classifier",
  "version": "1.0.0",
  "input_shape": [224, 224, 3],
  "classes": ["female", "male"],
  "preprocessing": {
    "rescale": 0.00392156862745098,  // 1/255
    "input_size": [224, 224]
  },
  "metrics": {
    "test_accuracy": 0.8940,
    "test_precision": 0.8852,
    "test_recall": 0.9012,
    "test_f1_score": 0.8931
  }
}
```

**Why you need it:**
- Tells your app the correct image size (224x224)
- Shows how to normalize images (divide by 255)
- Lists class names in correct order
- Documents model performance

**How to use:**
```javascript
// Read preprocessing settings
const metadata = require('./model_metadata.json');
const inputSize = metadata.preprocessing.input_size;
const rescale = metadata.preprocessing.rescale;
```

**Must download:** ✅ YES - Critical for correct predictions!

---

## ⭐⭐ BACKUP FILES (Good to Keep)

### 3. `ampalaya_classifier.h5` (14 MB)
**🎯 Purpose:** Full Keras model in original format

**What it is:**
- Complete model with all layers
- Uncompressed, full precision
- HDF5 format (Keras native)
- Larger but more accurate

**Why keep it:**
- Can retrain or fine-tune later
- Convert to other formats if needed
- Analyze model architecture
- Transfer learning source

**When to use:**
- Want to train on more data later
- Need to improve the model
- Create different export formats
- Debug or analyze performance

**Must download:** ⭐⭐ Recommended - Future-proofs your work

**Note:** Don't use this in your mobile app (too large!)

---

### 4. `best_model.h5` (14 MB)
**🎯 Purpose:** Best checkpoint during training

**What it is:**
- Model saved at the epoch with highest validation accuracy
- Might be from an earlier epoch
- Safety backup

**Why keep it:**
- Sometimes early epochs are better
- Backup if final model overfitted
- Comparison reference

**Difference from #3:**
- `ampalaya_classifier.h5` = Final model after all training
- `best_model.h5` = Best model during training (might be earlier)

**Must download:** ⭐ Optional - Usually same as final model

---

## ⭐ DOCUMENTATION FILES (Optional)

### 5. `training_history.png` (<1 MB)
**🎯 Purpose:** Visual graphs of training process

**What it shows:**
- Training vs validation accuracy over epochs
- Training vs validation loss over epochs
- Precision and recall curves
- Where fine-tuning started (red line)

**Why keep it:**
- Verify no overfitting occurred
- Documentation for thesis/reports
- Compare different training runs
- Understand model learning

**Example:**
```
[Graph showing]
- Accuracy increasing from 65% → 89%
- Loss decreasing from 0.8 → 0.2
- Val accuracy following train accuracy closely
```

**Must download:** ⭐ Optional - Good for documentation

---

### 6. `sample_images.png` (<1 MB)
**🎯 Purpose:** Preview of training data

**What it shows:**
- 8 female flower examples
- 8 male flower examples
- Random samples from training set

**Why keep it:**
- Verify data quality
- Show examples in presentations
- Documentation for reports
- Class visualization

**Must download:** ⭐ Optional - Nice to have

---

## 🎯 Quick Decision Guide

### For Your Expo Mobile App:
```
✅ Download: ampalaya_classifier.tflite
✅ Download: model_metadata.json
❌ Skip: All other files
```

### For Complete Backup:
```
✅ Download: ampalaya_classifier.tflite
✅ Download: model_metadata.json
✅ Download: ampalaya_classifier.h5
✅ Download: best_model.h5
✅ Download: training_history.png
✅ Download: sample_images.png
```

### For Future Retraining:
```
✅ Download: ampalaya_classifier.h5 (or best_model.h5)
✅ Download: model_metadata.json
⚠️  Optional: Others for comparison
```

---

## 📊 File Comparison Table

| File | Size | For Mobile? | For Retraining? | For Docs? |
|------|------|-------------|-----------------|-----------|
| `.tflite` | 3-4 MB | ✅ **YES** | ❌ No | ❌ No |
| `.json` | <1 KB | ✅ **YES** | ✅ Yes | ✅ Yes |
| `.h5` (full) | 14 MB | ❌ No | ✅ **YES** | ❌ No |
| `.h5` (best) | 14 MB | ❌ No | ✅ Yes | ❌ No |
| `_history.png` | <1 MB | ❌ No | ❌ No | ✅ **YES** |
| `_samples.png` | <1 MB | ❌ No | ❌ No | ✅ **YES** |

---

## 💡 Common Questions

### Q: Why not use the .h5 file in mobile app?
**A:** The .h5 file is ~14 MB and designed for servers/computers. The .tflite file is only 3-4 MB and optimized for mobile devices. Using .h5 would make your app 10 MB larger and predictions much slower!

### Q: Can I delete files after downloading?
**A:** Yes, but keep the .h5 file somewhere safe in case you want to improve the model later. Everything else can be regenerated from the .h5 file.

### Q: What if I only download .tflite without .json?
**A:** Your app will work but you'll need to manually set:
- Input size: 224x224
- Normalization: divide by 255
- Classes: ["female", "male"]

The .json file just makes this automatic.

### Q: Do I need both .h5 files?
**A:** No. Usually `ampalaya_classifier.h5` and `best_model.h5` are identical. Keep one for backup.

### Q: Can I convert .h5 to .tflite again?
**A:** Yes! If you have the .h5 file, you can regenerate the .tflite anytime using TensorFlow's converter. That's why .h5 is the "master" backup.

### Q: Where exactly are files saved?
**A:** In your Google Drive:
```
MyDrive/EGourd/Model_Versions/Version_10-30-2025_1/
```
The folder name uses the date (MM-DD-YYYY) plus a version number.

Version numbers increment automatically:
- First training of the day: `Version_10-30-2025_1`
- Second training: `Version_10-30-2025_2`
- Third training: `Version_10-30-2025_3`
- And so on...

---

## 🔄 File Relationships

```
Training Process
      ↓
best_model.h5 ←──────────── Saved during training
      ↓
ampalaya_classifier.h5 ←──── Final model after training
      ↓
[Convert to mobile]
      ↓
ampalaya_classifier.tflite ← For Expo app
      +
model_metadata.json ←──────── Configuration
```

---

## 📱 Integration Example

Here's how you'll use the files in your Expo app:

```javascript
// 1. Place files in assets folder
// assets/
//   ├── ampalaya_classifier.tflite
//   └── model_metadata.json

// 2. Load metadata
import metadata from './assets/model_metadata.json';

// 3. Load model
const model = await tf.loadLayersModel(
  bundleResourceIO(require('./assets/ampalaya_classifier.tflite'))
);

// 4. Preprocess image using metadata
const inputSize = metadata.preprocessing.input_size; // [224, 224]
const rescale = metadata.preprocessing.rescale;      // 0.003921...

// 5. Make prediction
const prediction = await model.predict(processedImage);
```

---

## ✅ Checklist

After training completes:

- [ ] Navigate to `MyDrive/EGourd/Model_Versions/`
- [ ] Find the latest version folder (Version_MM-DD-YYYY_N)
- [ ] Download `ampalaya_classifier.tflite` ⭐⭐⭐
- [ ] Download `model_metadata.json` ⭐⭐⭐
- [ ] (Optional) Download `ampalaya_classifier.h5` for backup
- [ ] (Optional) Download visualization files for docs
- [ ] Place .tflite and .json in Expo app's assets folder
- [ ] Test model in your app

---

**Summary:** You need 2 files for your app (.tflite + .json), but keep the .h5 file as backup for future improvements! 🚀
