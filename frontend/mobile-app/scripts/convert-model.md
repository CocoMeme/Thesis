# Converting TensorFlow Lite Model to TF.js Format

## Why Convert?

The `.tflite` file cannot be directly used in React Native with TensorFlow.js. We need to convert it to TF.js format (which creates `model.json` and binary weight files).

## Option 1: Convert from .h5 file (RECOMMENDED)

Since you have `ampalaya_classifier.h5` in your assets/models folder, we can convert that directly:

### Step 1: Install TensorFlow.js Converter

```bash
pip install tensorflowjs
```

### Step 2: Navigate to your project directory

```bash
cd C:\Users\coand\Desktop\Thesis\frontend\mobile-app
```

### Step 3: Convert the model

```bash
tensorflowjs_converter --input_format=keras \
  ./assets/models/ampalaya_classifier.h5 \
  ./assets/models/
```

**Windows PowerShell Command:**
```powershell
tensorflowjs_converter --input_format=keras .\assets\models\ampalaya_classifier.h5 .\assets\models\
```

This will create:
- `model.json` - Model architecture and weights manifest
- `group1-shard1of1.bin` - Model weights (binary file)

### Step 4: Verify the files

After conversion, you should have:
```
assets/models/
├── ampalaya_classifier.h5          (original)
├── ampalaya_classifier.tflite      (original)
├── model.json                       (✓ NEW - for TF.js)
├── group1-shard1of1.bin            (✓ NEW - for TF.js)
└── model_metadata.json             (original)
```

---

## Option 2: Convert from TFLite (Alternative)

If you want to convert from `.tflite`:

```bash
tensorflowjs_converter --input_format=tf_saved_model \
  ./path/to/saved_model \
  ./assets/models/
```

**Note:** This requires the TensorFlow SavedModel format, not just `.tflite`.

---

## Quick Conversion Script

Create a file `convert-model.py` in your project root:

```python
import tensorflowjs as tfjs

# Path to your Keras .h5 model
model_path = './assets/models/ampalaya_classifier.h5'

# Output directory
output_dir = './assets/models/'

# Convert
tfjs.converters.save_keras_model(
    model_path,
    output_dir,
    quantization_dtype=None  # Keep float32 for accuracy
)

print(f"✓ Model converted successfully!")
print(f"✓ Files saved to: {output_dir}")
print(f"✓ Look for: model.json and .bin files")
```

Run it:
```bash
python convert-model.py
```

---

## After Conversion

Once you have `model.json` and the `.bin` files:

1. **Keep these files in `assets/models/`:**
   - `model.json` ⭐ (Required)
   - `group1-shard1of1.bin` ⭐ (Required)
   - `model_metadata.json` ⭐ (Required)

2. **Optional (can delete to save space):**
   - `ampalaya_classifier.h5` (22 MB)
   - `best_model.h5` (10 MB)
   - `ampalaya_classifier.tflite` (4.5 MB)

3. **Your app will use:**
   - `model.json` - ~1 KB
   - `group1-shard1of1.bin` - ~9 MB
   - `model_metadata.json` - ~1 KB

**Total app size for model: ~9 MB** (much smaller than the .h5 files!)

---

## Troubleshooting

### Error: "No module named 'tensorflowjs'"
```bash
pip install tensorflowjs
```

### Error: "Command not found"
Make sure Python and pip are in your PATH.

### Conversion takes too long
The conversion should take 10-30 seconds for a MobileNetV2 model. If it's taking longer, check your Python version and TensorFlow installation.

---

## Next Steps

After conversion, the app should automatically work! The `modelService.js` has been updated to load from `model.json`.

Test the conversion with:
```bash
cd frontend/mobile-app
npm start
```

Then test the camera and classification features in your app! 🚀
