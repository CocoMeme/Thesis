# TensorFlow 2.12 Conversion (Pre-Keras 3)

This script converts your model using TensorFlow 2.12, which is the last version before Keras 3.x that introduced all the compatibility issues.

## 🔧 Google Colab Conversion Script

```python
# ============================================================================
# AMPALAYA CLASSIFIER - TF 2.12 CONVERSION (PRE-KERAS 3)
# ============================================================================
# Uses TensorFlow 2.12 to avoid Keras 3.x format issues
# ============================================================================

# Step 1: Install specific TensorFlow version
print("=" * 70)
print("📦 INSTALLING TENSORFLOW 2.12 (PRE-KERAS 3)")
print("=" * 70)
!pip uninstall -y tensorflow tensorflowjs
!pip install -q tensorflow==2.12.0
!pip install -q tensorflowjs==4.4.0
print("✅ TensorFlow 2.12 installed!\n")

# Step 2: Mount Google Drive
print("=" * 70)
print("📁 MOUNTING GOOGLE DRIVE")
print("=" * 70)
from google.colab import drive
drive.mount('/content/drive')
print("✅ Google Drive mounted!\n")

# Step 3: Upload Model File
print("=" * 70)
print("📤 UPLOAD YOUR MODEL FILE")
print("=" * 70)
print("Please select your 'ampalaya_classifier.h5' file")
print()

from google.colab import files
import os

uploaded = files.upload()

if uploaded:
    actual_filename = list(uploaded.keys())[0]
    if actual_filename.startswith('ampalaya_classifier'):
        print(f"\n✅ Upload successful!")
        if actual_filename != 'ampalaya_classifier.h5':
            os.rename(actual_filename, 'ampalaya_classifier.h5')
else:
    print("\n❌ Error: No file uploaded")
    raise SystemExit

# Step 4: Convert to TensorFlow.js
print("\n" + "=" * 70)
print("🔄 CONVERTING TO TENSORFLOW.JS (TF 2.12)")
print("=" * 70)

import tensorflow as tf
import tensorflowjs as tfjs
import json
import shutil
import zipfile
from datetime import datetime

print(f"TensorFlow version: {tf.__version__}")
print(f"TensorFlow.js version: {tfjs.__version__}\n")

try:
    # Load model
    print("Loading Keras model from .h5...")
    model = tf.keras.models.load_model('ampalaya_classifier.h5')
    print(f"✅ Model loaded!")
    print(f"   Input: {model.input_shape}")
    print(f"   Output: {model.output_shape}")
    print(f"   Parameters: {model.count_params():,}")
    
    # Convert to TensorFlow.js
    print("\n🔄 Converting to TensorFlow.js format...")
    output_dir = './tfjs_model'
    tfjs.converters.save_keras_model(model, output_dir)
    print("✅ Converted to TensorFlow.js!")
    
    # Verify model.json
    print("\n🔍 Verifying conversion...")
    model_json_path = os.path.join(output_dir, 'model.json')
    with open(model_json_path, 'r') as f:
        model_data = json.load(f)
    
    # Check for Keras 3 issues
    model_str = json.dumps(model_data)
    keras3_issues = []
    
    if '__keras_tensor__' in model_str:
        keras3_issues.append("❌ Found __keras_tensor__ objects")
    else:
        print("   ✅ No __keras_tensor__ objects")
    
    if '"batch_shape":' in model_str:
        keras3_issues.append("❌ Found batch_shape (should be batch_input_shape)")
    else:
        print("   ✅ No batch_shape issues")
    
    if keras3_issues:
        print("\n⚠️ KERAS 3 ISSUES DETECTED:")
        for issue in keras3_issues:
            print(f"   {issue}")
        print("\n   This conversion still has Keras 3 format issues!")
        print("   You may need to downgrade your training environment too.")
    else:
        print("\n✅ NO KERAS 3 ISSUES DETECTED!")
        print("   This model should work without additional fixes!")
    
    # Determine version number
    print("\n📦 Determining version number...")
    drive_model_dir = '/content/drive/MyDrive/EGourd/Model_Versions/Converted_Models'
    os.makedirs(drive_model_dir, exist_ok=True)
    
    existing_files = []
    try:
        existing_files = [f for f in os.listdir(drive_model_dir) if f.startswith('tfjs_v') and f.endswith('.zip')]
    except:
        pass
    
    version_numbers = []
    for filename in existing_files:
        try:
            num_str = filename.replace('tfjs_v', '').replace('.zip', '')
            version_numbers.append(int(num_str))
        except:
            pass
    
    next_version = max(version_numbers) + 1 if version_numbers else 1
    zip_filename = f'tfjs_v{next_version}.zip'
    
    print(f"✅ Version determined: v{next_version}")
    
    # Create ZIP file
    print(f"\n📦 Creating {zip_filename}...")
    with zipfile.ZipFile(zip_filename, 'w', zipfile.ZIP_DEFLATED) as zipf:
        for root, dirs, files_list in os.walk(output_dir):
            for file in files_list:
                file_path = os.path.join(root, file)
                arcname = os.path.relpath(file_path, output_dir)
                zipf.write(file_path, arcname)
    
    zip_size_mb = os.path.getsize(zip_filename) / (1024 * 1024)
    print(f"✅ ZIP created: {zip_filename} ({zip_size_mb:.2f} MB)")
    
    # Save to Google Drive
    print("\n📁 Saving to Google Drive...")
    drive_path = os.path.join(drive_model_dir, zip_filename)
    shutil.copy(zip_filename, drive_path)
    print(f"✅ Saved to: EGourd/Model_Versions/Converted_Models/{zip_filename}")
    
    print("\n" + "=" * 70)
    print("✅ CONVERSION COMPLETE!")
    print("=" * 70)
    print("\n📋 SUMMARY:")
    print(f"   • TensorFlow version: {tf.__version__}")
    print(f"   • Format: layers-model")
    print(f"   • Files: model.json + weight shards")
    print(f"   • Keras 3 issues: {'YES' if keras3_issues else 'NO'}")
    print(f"   • Saved to Drive: EGourd/Model_Versions/Converted_Models/{zip_filename}")
    print(f"   • Version: v{next_version}")
    
    if keras3_issues:
        print("\n⚠️ ACTION REQUIRED:")
        print("   Your model was trained with Keras 3.x")
        print("   You need to either:")
        print("   1. Retrain with TensorFlow 2.12 in a new Colab session")
        print("   2. Or use the fix scripts after extracting this ZIP")
    else:
        print("\n🎯 NEXT STEPS:")
        print("   1. Go to Google Drive: EGourd/Model_Versions/Converted_Models/")
        print(f"   2. Download {zip_filename}")
        print("   3. Extract the ZIP file")
        print("   4. Replace ALL files in: frontend/mobile-app/assets/models/tfjs/")
        print("      (⚠️ IMPORTANT: Replace model.json AND all .bin files!)")
        print("   5. Restart Expo: npx expo start --clear")
        print("   6. NO FIX SCRIPTS NEEDED!")
    
    print("=" * 70)
    
except Exception as e:
    print(f"\n❌ ERROR: {str(e)}")
    import traceback
    traceback.print_exc()
```

## 🚀 How to Use

### Option 1: Convert Existing Model (Quick Test)

1. **Open Google Colab**: https://colab.research.google.com/
2. **Create new notebook**
3. **Copy the entire script above**
4. **Paste into a code cell**
5. **Run the cell** (Ctrl+Enter)
6. **Upload your existing `ampalaya_classifier.h5`**
7. **Check if Keras 3 issues are detected**
8. **Download from Drive**

### Option 2: Retrain with TF 2.12 (Recommended for Clean Model)

If the script above shows "KERAS 3 ISSUES DETECTED", your model was trained with Keras 3.x. You should:

1. **Use your training script** (`train-model-test-v1.md`)
2. **Add this at the very beginning (Cell 1)**:
   ```python
   # Force TensorFlow 2.12 installation
   !pip uninstall -y tensorflow
   !pip install -q tensorflow==2.12.0
   ```
3. **Retrain the model** (will take 35-90 minutes)
4. **The exported `ampalaya_classifier.h5` will be Keras 2.x format**
5. **Then use this conversion script**

## ✅ Expected Result

After using TF 2.12, you should see:
```
✅ NO KERAS 3 ISSUES DETECTED!
   This model should work without additional fixes!
```

Then after replacing files and restarting Expo:
```
✅ Model assets loaded via require()
✅ Model loaded successfully
📊 Model summary:
   Input shapes: ,224,224,3
   Output shapes: ,1
   Total parameters: 2421889
```

## 📝 Why This Works

- **TensorFlow 2.12** uses Keras 2.x format
- **No `__keras_tensor__` objects**
- **No `batch_shape` issues**
- **Weight names match perfectly**
- **No manual fix scripts needed**

---

**TL;DR**: Use TensorFlow 2.12 to convert your model. If your existing model was trained with Keras 3, either retrain with TF 2.12 or accept that you'll need the fix scripts.
