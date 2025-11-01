# Convert Model Using Keras 2 Format (TF.js Compatible)

The issue is that Keras v3.10.0 exports model configs with extensive metadata (DTypePolicy, module paths, registered_name fields) that TensorFlow.js v4.22.0 doesn't fully support.

## Solution: Export in Keras 2 (`.keras`) format

Keras 3.x can export models in a simplified format that's more compatible with TensorFlow.js.

## 🔧 Google Colab Conversion Script

```python
# ============================================================================
# AMPALAYA CLASSIFIER - KERAS 2 FORMAT CONVERSION
# ============================================================================
# This converts your model to a TF.js-compatible format by using .keras format
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

# Step 4: Convert to simplified format
print("\n" + "=" * 70)
print("🔄 CONVERTING TO TENSORFLOW.JS (SIMPLIFIED FORMAT)")
print("=" * 70)

import tensorflow as tf
import tensorflowjs as tfjs
import json
import shutil
import zipfile
from datetime import datetime

try:
    # Load model
    print("Loading Keras model...")
    model = tf.keras.models.load_model('ampalaya_classifier.h5')
    print(f"✅ Model loaded!")
    print(f"   Input: {model.input_shape}")
    print(f"   Output: {model.output_shape}")
    print(f"   Parameters: {model.count_params():,}")
    
    # ⭐ KEY CHANGE: Save as .keras format (newer, cleaner)
    print("\n🔄 Converting to .keras format...")
    model.save('model_clean.keras')
    print("✅ Saved as .keras format")
    
    # Load the .keras model
    print("\n🔄 Loading .keras model...")
    clean_model = tf.keras.models.load_model('model_clean.keras')
    print("✅ .keras model loaded")
    
    # Convert to TensorFlow.js
    print("\n🔄 Converting to TensorFlow.js format...")
    output_dir = './tfjs_model'
    tfjs.converters.save_keras_model(clean_model, output_dir)
    print("✅ Converted to TensorFlow.js!")
    
    # Post-processing: Simplify model.json
    print("\n🔧 Simplifying model.json...")
    model_json_path = os.path.join(output_dir, 'model.json')
    
    with open(model_json_path, 'r') as f:
        model_data = json.load(f)
    
    def keras_tensor_to_ref(kt):
        """Extract keras_history from __keras_tensor__"""
        if isinstance(kt, dict) and kt.get('class_name') == '__keras_tensor__':
            kh = kt.get('config', {}).get('keras_history')
            if isinstance(kh, list) and len(kh) >= 3:
                return [kh[0], kh[1], kh[2]]
        return None
    
    def process_inbound_nodes(nodes):
        """Convert Keras 3 inbound_nodes format to TF.js format"""
        if not isinstance(nodes, list):
            return nodes
        
        new_nodes = []
        for item in nodes:
            if isinstance(item, dict) and 'args' in item:
                args = item['args']
                inner = []
                
                for a in (args if isinstance(args, list) else [args]):
                    # Handle arrays of tensors (Add/Concatenate layers)
                    if isinstance(a, list):
                        for tensor in a:
                            ref = keras_tensor_to_ref(tensor)
                            if ref:
                                inner.append(ref)
                            elif isinstance(tensor, list):
                                inner.append(tensor)
                    else:
                        # Single tensor
                        ref = keras_tensor_to_ref(a)
                        if ref:
                            inner.append(ref)
                        elif isinstance(a, list):
                            inner.append(a)
                
                new_nodes.append(inner if inner else [])
            elif isinstance(item, list):
                new_nodes.append(item)
        
        return new_nodes
    
    def process_layer(layer):
        """Process a single layer"""
        if isinstance(layer, dict):
            # Fix inbound_nodes if present
            if 'inbound_nodes' in layer:
                layer['inbound_nodes'] = process_inbound_nodes(layer['inbound_nodes'])
            
            # Remove Keras 3 metadata that TF.js doesn't need
            config = layer.get('config', {})
            if isinstance(config, dict):
                # Remove complex dtype objects
                if 'dtype' in config and isinstance(config['dtype'], dict):
                    if 'module' in config['dtype']:
                        # Simplify to just the name
                        dtype_name = config['dtype'].get('config', {}).get('name', 'float32')
                        config['dtype'] = dtype_name
                
                # Remove registered_name (Keras 3 specific)
                if 'registered_name' in config:
                    del config['registered_name']
                
                # Simplify initializers (remove module paths)
                for key in list(config.keys()):
                    if 'initializer' in key and isinstance(config[key], dict):
                        if 'module' in config[key]:
                            # Keep only class_name and config
                            config[key] = {
                                'class_name': config[key].get('class_name', 'VarianceScaling'),
                                'config': config[key].get('config', {})
                            }
            
            # Process nested layers (for Functional models)
            if 'layers' in layer and isinstance(layer['layers'], list):
                for nested_layer in layer['layers']:
                    process_layer(nested_layer)
        
        return layer
    
    # Process all layers
    topology = model_data.get('modelTopology', {})
    model_config = topology.get('model_config', {})
    config = model_config.get('config', {})
    
    if 'layers' in config and isinstance(config['layers'], list):
        for layer in config['layers']:
            process_layer(layer)
    
    # Save cleaned model.json
    with open(model_json_path, 'w') as f:
        json.dump(model_data, f, indent=2)
    
    print("✅ model.json simplified!")
    
    # Determine version number by checking existing files
    print("\n📦 Determining version number...")
    drive_model_dir = '/content/drive/MyDrive/EGourd/Model_Versions/Converted_Models'
    
    # Create directory if it doesn't exist
    os.makedirs(drive_model_dir, exist_ok=True)
    
    # Find existing keras_v*.zip files
    existing_files = []
    try:
        existing_files = [f for f in os.listdir(drive_model_dir) if f.startswith('keras_v') and f.endswith('.zip')]
    except:
        pass
    
    # Extract version numbers
    version_numbers = []
    for filename in existing_files:
        try:
            # Extract number from keras_v{number}.zip
            num_str = filename.replace('keras_v', '').replace('.zip', '')
            version_numbers.append(int(num_str))
        except:
            pass
    
    # Determine next version number
    next_version = max(version_numbers) + 1 if version_numbers else 1
    zip_filename = f'keras_v{next_version}.zip'
    
    print(f"✅ Version determined: v{next_version}")
    
    # Create ZIP file
    print(f"\n📦 Creating {zip_filename}...")
    with zipfile.ZipFile(zip_filename, 'w', zipfile.ZIP_DEFLATED) as zipf:
        for root, dirs, files in os.walk(output_dir):
            for file in files:
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
    
    # Also download to computer
    print("\n📥 Starting download to your computer...")
    files.download(zip_filename)
    print("✅ Download started!")
    
    print("\n" + "=" * 70)
    print("✅ CONVERSION COMPLETE!")
    print("=" * 70)
    print("\n📋 SUMMARY:")
    print(f"   • Format: layers-model")
    print(f"   • Files: model.json + weight shards")
    print(f"   • Optimizations: Simplified Keras 3 metadata")
    print(f"   • inbound_nodes: Normalized for TF.js compatibility")
    print(f"   • Saved to Drive: EGourd/Model_Versions/Converted_Models/{zip_filename}")
    print(f"   • Version: v{next_version}")
    print("\n🎯 NEXT STEPS:")
    print("   1. Extract the ZIP file (from Drive or Downloads)")
    print("   2. Replace files in: frontend/mobile-app/assets/models/tfjs/")
    print("   3. Restart Expo: npx expo start --clear")
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
   - Download will start automatically
7. **Extract ZIP** on your computer
8. **Replace files** in `frontend/mobile-app/assets/models/tfjs/`
9. **Restart Expo**: `npx expo start --clear`

## 🔍 What This Does Differently

1. **Saves as .keras format first** - This is a cleaner format that Keras 3 uses
2. **Loads the .keras model** - Gets a cleaner internal representation
3. **Converts to TF.js** - Uses the cleaned model
4. **Simplifies metadata**:
   - Converts `DTypePolicy` objects to simple strings like `"float32"`
   - Removes `registered_name` fields (Keras 3 specific)
   - Simplifies initializer objects (removes `module` paths)
5. **Processes inbound_nodes** - Converts `__keras_tensor__` objects to simple arrays
6. **Auto-downloads** - ZIP file downloads automatically

## ✅ Expected Improvements

- No more `DTypePolicy` complexity
- No `module` or `registered_name` fields
- Cleaner `inbound_nodes` format
- Better TensorFlow.js v4.22.0 compatibility

## 📝 Notes

- This preserves all model weights and architecture
- Just simplifies the metadata format
- Should work with TensorFlow.js v4.22.0+
- Compatible with React Native Expo apps
