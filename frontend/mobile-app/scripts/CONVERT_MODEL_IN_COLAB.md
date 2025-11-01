# Convert Model Using Google Colab

Since we're experiencing dependency issues with local TensorFlow installation, we'll use Google Colab which has all dependencies pre-installed.

## 🚀 Step-by-Step Instructions

### 1. Open Google Colab
Go to [colab.research.google.com](https://colab.research.google.com) and create a new notebook.

### 2. Copy and Run This Code

```python
# Install tensorflowjs converter
!pip install tensorflowjs

# Upload your .h5 model file
from google.colab import files
print("📤 Please upload your ampalaya_classifier.h5 file:")
uploaded = files.upload()

# Convert the model to TensorFlow.js format
import tensorflowjs as tfjs

print("\n🔄 Converting model to TensorFlow.js format...")
tfjs.converters.save_keras_model(
    'ampalaya_classifier.h5',  # Input: Your uploaded .h5 file
    './tfjs_model',             # Output: Directory for converted files
    quantization_dtype=None     # Keep full precision (no quantization)
)

print("\n✅ Conversion complete!")

# Show generated files
print("\n📦 Generated files:")
!ls -lh tfjs_model/

# Zip the converted files for download
print("\n📦 Creating zip file...")
!zip -r tfjs_model.zip tfjs_model/

# Download the zip file
print("\n📥 Downloading converted model...")
files.download('tfjs_model.zip')

print("\n" + "="*70)
print("✅ SUCCESS! Model converted and downloaded")
print("="*70)
print("\nNext steps:")
print("1. Extract tfjs_model.zip on your computer")
print("2. Create folder: frontend/mobile-app/assets/models/tfjs/")
print("3. Copy all files (model.json + .bin files) to that folder")
print("4. Update modelService.js to load from tfjs folder")
print("="*70)
```

### 3. After Download

1. **Extract** the `tfjs_model.zip` file
2. You should see files like:
   - `model.json` - Model architecture and weights manifest
   - `group1-shard1of*.bin` - Model weights in binary format

3. **Create the tfjs directory** in your project:
   ```
   frontend/mobile-app/assets/models/tfjs/
   ```

4. **Copy all files** from the extracted folder to the tfjs directory:
   ```
   frontend/mobile-app/assets/models/tfjs/
   ├── model.json
   ├── group1-shard1of1.bin (or multiple shards)
   └── ... (any other generated files)
   ```

### 4. Update Code

After copying the files, let the AI assistant know so it can update `modelService.js` to load from the new location.

## 📝 Why Google Colab?

- ✅ **No dependency conflicts** - Everything pre-installed
- ✅ **Fast conversion** - Usually takes 30-60 seconds
- ✅ **Free GPU access** - If needed for larger models
- ✅ **Always works** - No local environment issues
- ✅ **Easy to share** - Can convert models anywhere

## 🔍 Expected Output Files

After conversion, you should have:

- **model.json** (~100 KB) - Contains:
  - Model architecture (layers, shapes)
  - Weights manifest (pointers to .bin files)
  - Training configuration

- **group1-shard*.bin** (~4-8 MB total for MobileNetV2) - Contains:
  - Actual model weights in binary format
  - May be split into multiple files if large

## ⚠️ Troubleshooting

If conversion fails in Colab:

1. **Make sure you uploaded the correct .h5 file**
   - Check file size (should be ~22 MB for your model)
   
2. **Try with quantization** (reduces size):
   ```python
   tfjs.converters.save_keras_model(
       'ampalaya_classifier.h5',
       './tfjs_model',
       quantization_dtype='uint8'  # 8-bit quantization
   )
   ```

3. **Check Keras version compatibility**:
   ```python
   import tensorflow as tf
   print(f"TensorFlow version: {tf.__version__}")
   ```

## 📚 Additional Resources

- [TensorFlow.js Converter Documentation](https://www.tensorflow.org/js/guide/conversion)
- [Google Colab](https://colab.research.google.com)
- [Model Conversion Best Practices](https://www.tensorflow.org/js/guide/conversion#converting_keras_models)
