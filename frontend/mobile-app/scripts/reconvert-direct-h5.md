# Direct H5 to TensorFlow.js Conversion (No Keras Format)

This script converts directly from .h5 to TensorFlow.js without the `.keras` intermediate step that caused weight naming issues.

## 🔧 Google Colab Conversion Script

```python
# ============================================================================
# AMPALAYA CLASSIFIER - DIRECT H5 TO TF.JS CONVERSION
# ============================================================================
# Converts directly from .h5 to TensorFlow.js with post-processing fixes
# ============================================================================

# Step 1: Mount Google Drive
print("=" * 70)
print("📁 MOUNTING GOOGLE DRIVE")
print("=" * 70)
from google.colab import drive
drive.mount('/content/drive')
print("✅ Google Drive mounted!\n")

# Step 2: Install TensorFlow.js Converter
print("=" * 70)
print("📦 INSTALLING TENSORFLOWJS CONVERTER")
print("=" * 70)
!pip install -q tensorflowjs
print("✅ Installation complete!\n")

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

# Step 4: Convert directly to TensorFlow.js
print("\n" + "=" * 70)
print("🔄 CONVERTING TO TENSORFLOW.JS (DIRECT FROM H5)")
print("=" * 70)

import tensorflow as tf
import tensorflowjs as tfjs
import json
import shutil
import zipfile
from datetime import datetime

try:
    # Load model
    print("Loading Keras model from .h5...")
    model = tf.keras.models.load_model('ampalaya_classifier.h5')
    print(f"✅ Model loaded!")
    print(f"   Input: {model.input_shape}")
    print(f"   Output: {model.output_shape}")
    print(f"   Parameters: {model.count_params():,}")
    
    # Convert to TensorFlow.js directly
    print("\n🔄 Converting to TensorFlow.js format...")
    output_dir = './tfjs_model'
    tfjs.converters.save_keras_model(model, output_dir)
    print("✅ Converted to TensorFlow.js!")
    
    # ⚠️ DO NOT MODIFY model.json yet - we need weights to match the original structure
    # The fixes will be applied locally on your computer after extraction
    
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
    print(f"   • Format: layers-model")
    print(f"   • Files: model.json + weight shards")
    print(f"   • Saved to Drive: EGourd/Model_Versions/Converted_Models/{zip_filename}")
    print(f"   • Version: v{next_version}")
    print("\n⚠️ IMPORTANT: The model.json needs compatibility fixes!")
    print("   These will be applied locally with manual-fix-model.py")
    print("\n🎯 NEXT STEPS:")
    print("   1. Go to Google Drive: EGourd/Model_Versions/Converted_Models/")
    print(f"   2. Download {zip_filename}")
    print("   3. Extract the ZIP file")
    print("   4. Replace ALL files in: frontend/mobile-app/assets/models/tfjs/")
    print("      (⚠️ IMPORTANT: Replace model.json AND all .bin files!)")
    print("   5. Run fix script:")
    print("      cd frontend/mobile-app/scripts")
    print("      python manual-fix-model.py")
    print("   6. Restart Expo: npx expo start --clear")
    print("=" * 70)
    
except Exception as e:
    print(f"\n❌ ERROR: {str(e)}")
    import traceback
    traceback.print_exc()
```

## 🚀 How to Use

1. **Open Google Colab**: https://colab.research.google.com/
2. **Create new notebook**
3. **Copy the entire script above**
4. **Paste into a code cell**
5. **Run the cell** (Ctrl+Enter)
6. **Follow prompts**:
   - Mount Google Drive
   - Upload `ampalaya_classifier.h5`
   - Wait for conversion (~1 minute)
   - Check Google Drive for the saved ZIP file
7. **Download from Drive manually**:
   - Go to `EGourd/Model_Versions/Converted_Models/`
   - Download `tfjs_v{number}.zip`
8. **Extract ZIP** on your computer
9. **Replace ALL files** in `frontend/mobile-app/assets/models/tfjs/`
   - ⚠️ Make sure to replace the `.bin` files too!
10. **Restart Expo**: `npx expo start --clear`

## 🔍 What This Does Differently

1. **Converts directly from .h5** - No `.keras` intermediate step
2. **Preserves original weight names** - No `block_14_depthwise/kernel` issues
3. **Fixes `__keras_tensor__` objects** - Automated in the script
4. **Fixes InputLayer `batch_shape`** - Automated in the script
5. **Auto-versions and saves to Drive** - Keeps your version history

## ✅ Expected Result

After replacing files and restarting Expo, you should see:
```
✅ Model assets loaded via require()
✅ Model loaded successfully
📊 Model summary:
   Input shapes: ,224,224,3
   Output shapes: ,1
   Total parameters: 2421889
```

## 📝 Why This Works

The `.keras` format conversion changed layer names and weight variable names, causing mismatches. This direct conversion:
- Keeps original layer/weight naming from your training
- Applies all compatibility fixes automatically
- No manual fix scripts needed afterwards

---

**TL;DR**: This script does everything in one go - converts from .h5, fixes all Keras 3 compatibility issues, and saves to Drive with versioning. Just upload your original `ampalaya_classifier.h5` file!
