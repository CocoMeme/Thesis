# Quick Model Conversion - Google Colab Code

Copy and paste this entire code block into a new Google Colab notebook:

```python
# ============================================================================
# AMPALAYA CLASSIFIER - MODEL CONVERSION TO TENSORFLOW.JS
# ============================================================================
# This notebook converts your trained Keras .h5 model to TensorFlow.js format
# for use in React Native mobile applications.
# Saves converted model to Google Drive for easy access.
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
print("(You should see a 'Choose Files' button below)")
print()

from google.colab import files
import os

uploaded = files.upload()

# Verify upload and handle automatic renaming by Colab
if uploaded:
    actual_uploaded_filename = list(uploaded.keys())[0]

    # Check if the uploaded file name starts with the expected prefix
    if actual_uploaded_filename.startswith('ampalaya_classifier'):
        file_size_mb = len(uploaded[actual_uploaded_filename]) / (1024 * 1024)
        print(f"\n✅ Upload successful! File size: {file_size_mb:.2f} MB")

        # If the filename was changed by Colab (e.g., 'ampalaya_classifier (1).h5'),
        # rename it back to the expected 'ampalaya_classifier.h5' for consistent processing.
        if actual_uploaded_filename != 'ampalaya_classifier.h5':
            # Remove the existing 'ampalaya_classifier.h5' if it exists to avoid FileExistsError
            if os.path.exists('ampalaya_classifier.h5'):
                os.remove('ampalaya_classifier.h5')
            os.rename(actual_uploaded_filename, 'ampalaya_classifier.h5')
            print(f"Renamed uploaded file from '{actual_uploaded_filename}' to 'ampalaya_classifier.h5'.")
    else:
        print(f"\n❌ Error: Expected file 'ampalaya_classifier.h5' not found. Instead, '{actual_uploaded_filename}' was uploaded.")
        print("Please make sure you uploaded the correct file.")
        raise SystemExit
elif not uploaded:
    print("\n❌ Error: No file was uploaded.")
    print("Please make sure you selected and uploaded your 'ampalaya_classifier.h5' file.")
    raise SystemExit

# Step 4: Convert Model
print("\n" + "=" * 70)
print("🔄 CONVERTING MODEL TO TENSORFLOW.JS")
print("=" * 70)
print("Converting Keras model to TensorFlow.js format...")
print("This may take 30-60 seconds...\n")

import tensorflow as tf
import tensorflowjs as tfjs
import shutil
from datetime import datetime

try:
    # Load the Keras model
    keras_model = tf.keras.models.load_model('ampalaya_classifier.h5')
    print(f"✅ Model loaded successfully!")
    print(f"   Input shape: {keras_model.input_shape}")
    print(f"   Output shape: {keras_model.output_shape}")
    print()

    # Create temporary output directory
    temp_output = './tfjs_model_temp'

    # Perform conversion
    print("Converting to TensorFlow.js format...")
    tfjs.converters.save_keras_model(
        keras_model,                     # Input: Your loaded Keras model
        temp_output                      # Temporary output directory
        # Full precision (no quantization) is default
    )

    print("✅ Conversion successful!\n")
    
    # Step 5: Show Generated Files
    print("=" * 70)
    print("📦 GENERATED FILES")
    print("=" * 70)
    
    files_list = os.listdir(temp_output)
    total_size = 0
    
    for filename in sorted(files_list):
        filepath = os.path.join(temp_output, filename)
        file_size = os.path.getsize(filepath) / (1024 * 1024)
        total_size += file_size
        print(f"  ✓ {filename:<30} {file_size:>8.2f} MB")
    
    print(f"\n  Total size: {total_size:.2f} MB")
    
    # Step 6: Save to Google Drive
    print("\n" + "=" * 70)
    print("� SAVING TO GOOGLE DRIVE")
    print("=" * 70)
    
    # Create timestamped folder name
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    drive_base = "/content/drive/MyDrive/EGourd/Model_Versions/Converted_Models"
    drive_folder = f"{drive_base}/tfjs_model_{timestamp}"
    
    # Create directory structure if it doesn't exist
    os.makedirs(drive_folder, exist_ok=True)
    
    # Copy files to Google Drive
    print(f"Saving to: {drive_folder}")
    for filename in files_list:
        src = os.path.join(temp_output, filename)
        dst = os.path.join(drive_folder, filename)
        shutil.copy2(src, dst)
        print(f"  ✓ Copied {filename}")
    
    print(f"\n✅ Model saved to Google Drive!")
    print(f"   Location: {drive_folder}")
    
    # Step 7: Create Zip File for Download
    print("\n" + "=" * 70)
    print("📦 CREATING ZIP FILE FOR DOWNLOAD")
    print("=" * 70)
    
    zip_filename = f'tfjs_model_{timestamp}.zip'
    !zip -r {zip_filename} {temp_output}
    
    # Save only zip to Google Drive
    zip_drive_path = f"{drive_base}/{zip_filename}"
    shutil.copy2(zip_filename, zip_drive_path)
    print(f"✅ Zip file saved to Drive: {zip_drive_path}")
    
    # Step 8: Download
    print("\n" + "=" * 70)
    print("📥 DOWNLOADING MODEL")
    print("=" * 70)
    print("Initiating download...\n")
    
    files.download(zip_filename)
    
    # Step 9: Cleanup
    print("\n" + "=" * 70)
    print("🧹 CLEANING UP")
    print("=" * 70)
    
    shutil.rmtree(temp_output)
    os.remove(zip_filename)
    os.remove('ampalaya_classifier.h5')
    print("✅ Temporary files removed!")
    
    # Step 10: Summary
    print("\n" + "=" * 70)
    print("✅ SUCCESS! MODEL CONVERTED AND SAVED")
    print("=" * 70)
    print("\n📊 SUMMARY:")
    print(f"  • Converted model size: {total_size:.2f} MB")
    print(f"  • Files generated: {len(files_list)}")
    print(f"  • Google Drive backup: {zip_drive_path}")
    print(f"  • Downloaded to your computer: {zip_filename}")
    
    print("\n📋 NEXT STEPS:")
    print()
    print("1. Extract the downloaded zip file on your computer")
    print()
    print("2. Create this folder in your project:")
    print("   frontend/mobile-app/assets/models/tfjs/")
    print()
    print("3. Copy these files from the zip to that folder:")
    for filename in sorted(files_list):
        print(f"   - {filename}")
    print()
    print("4. Let the AI assistant know you're ready to update modelService.js")
    print()
    print("💡 TIP: Zip file is backed up in Google Drive if you need it later!")
    print("=" * 70)
    
except Exception as e:
    print(f"\n❌ Conversion failed: {str(e)}")
    print("\n🔧 TROUBLESHOOTING:")
    print("  - Make sure you uploaded a valid .h5 file")
    print("  - Check that the model was trained with Keras/TensorFlow")
    print("  - Verify Google Drive is mounted correctly")
    print("  - Try re-uploading the file")

# ============================================================================
# END OF CONVERSION SCRIPT
# ============================================================================
```

## 🚀 How to Use

1. Open [colab.research.google.com](https://colab.research.google.com)
2. Click "New Notebook"
3. Copy the entire code block above
4. Paste into the first cell
5. Click the "Play" button (▶️) or press Shift+Enter
6. Follow the prompts to upload your model
7. Wait for conversion to complete
8. Download the zip file
9. Extract and copy files to your project

## ⏱️ Expected Time

- Upload: 10-30 seconds (depending on file size)
- Conversion: 30-60 seconds
- Download: 5-15 seconds

**Total: ~1-2 minutes**

## 📦 What You'll Get

After running this notebook, you'll download `tfjs_model.zip` containing:

- `model.json` - Model architecture and configuration
- `group1-shard*.bin` - Model weights in binary format

These files are ready to use in your React Native app!
