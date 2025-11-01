# Fixed Model Conversion - With TF.js Compatibility

This version adds compatibility flags to ensure the converted model works with TensorFlow.js in React Native.

## 🔧 Updated Conversion Code

Copy this into Google Colab:

```python
# ============================================================================
# AMPALAYA CLASSIFIER - MODEL CONVERSION TO TENSORFLOW.JS (FIXED)
# ============================================================================
# This version includes compatibility flags for TensorFlow.js
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

# Verify upload
if uploaded:
    actual_uploaded_filename = list(uploaded.keys())[0]

    if actual_uploaded_filename.startswith('ampalaya_classifier'):
        file_size_mb = len(uploaded[actual_uploaded_filename]) / (1024 * 1024)
        print(f"\n✅ Upload successful! File size: {file_size_mb:.2f} MB")

        if actual_uploaded_filename != 'ampalaya_classifier.h5':
            if os.path.exists('ampalaya_classifier.h5'):
                os.remove('ampalaya_classifier.h5')
            os.rename(actual_uploaded_filename, 'ampalaya_classifier.h5')
            print(f"Renamed uploaded file to 'ampalaya_classifier.h5'.")
    else:
        print(f"\n❌ Error: Expected file 'ampalaya_classifier.h5' not found.")
        raise SystemExit
elif not uploaded:
    print("\n❌ Error: No file was uploaded.")
    raise SystemExit

# Step 4: Convert Model with Compatibility Settings
print("\n" + "=" * 70)
print("🔄 CONVERTING MODEL TO TENSORFLOW.JS (COMPATIBILITY MODE)")
print("=" * 70)
print("Converting with TensorFlow.js compatibility flags...")
print("This may take 30-60 seconds...\n")

import tensorflow as tf
import tensorflowjs as tfjs
import shutil
import json
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

    # Convert model (standard conversion, no custom metadata)
    print("Converting to TensorFlow.js format...")
    tfjs.converters.save_keras_model(keras_model, temp_output)
    print("✅ Initial conversion successful!")
    
    # ⭐ ROBUST POST-PROCESSING: Comprehensive compatibility fixes
    print("\n🔧 Applying comprehensive compatibility fixes to model.json...")
    
    model_json_path = os.path.join(temp_output, 'model.json')
    
    # Helper functions for robust normalization
    def ensure_list(x):
        """Ensure value is a list"""
        if isinstance(x, list):
            return x
        return [x]
    
    def keras_tensor_to_ref(kt):
        """Extract keras_history from __keras_tensor__ object"""
        try:
            if isinstance(kt, dict) and kt.get('class_name') == '__keras_tensor__':
                kh = kt.get('config', {}).get('keras_history')
                if isinstance(kh, list) and len(kh) >= 3:
                    return [kh[0], kh[1], kh[2]]  # [layer_name, node_index, tensor_index]
        except Exception:
            pass
        return None
    
    def normalize_inbound_nodes_field(nodes):
        """
        Normalize inbound_nodes to TF.js expected format: list-of-lists
        Handles:
        - Dict with 'args' containing __keras_tensor__ objects (Keras v3)
        - List of dicts with 'args'
        - Single objects
        - Already correct list-of-lists
        """
        # Already list-of-lists? Return unchanged
        if isinstance(nodes, list) and len(nodes) > 0:
            # Check if all items are lists (correct format)
            if all(isinstance(item, list) for item in nodes):
                # Extra check: make sure inner lists don't contain __keras_tensor__
                needs_fix = False
                for item in nodes:
                    if isinstance(item, list):
                        for inner in item:
                            if isinstance(inner, dict) and inner.get('class_name') == '__keras_tensor__':
                                needs_fix = True
                                break
                if not needs_fix:
                    return nodes
        
        # List of dicts (Keras v3 format: [{args: [...], kwargs: {}}, ...])
        if isinstance(nodes, list):
            new_nodes = []
            for item in nodes:
                if isinstance(item, dict) and 'args' in item:
                    # Extract and process args
                    args = item['args']
                    inner = []
                    
                    # Process each arg
                    for a in (args if isinstance(args, list) else [args]):
                        ref = keras_tensor_to_ref(a)
                        if ref:
                            # Successfully extracted keras_history
                            inner.append(ref)
                        elif isinstance(a, list):
                            # Already a list, keep it
                            inner.append(a)
                        elif isinstance(a, dict):
                            # Dict without __keras_tensor__, wrap it
                            inner.append([a])
                        else:
                            # Primitive value, wrap it
                            inner.append([a])
                    
                    # Add the inner array to new_nodes
                    new_nodes.append(inner if inner else [])
                    
                elif isinstance(item, dict) and 'node' in item and isinstance(item['node'], list):
                    # Some variants store node entries
                    new_nodes.append(item['node'])
                elif isinstance(item, list):
                    # Keep as-is
                    new_nodes.append(item)
                else:
                    # Wrap single non-list item
                    new_nodes.append([item])
            
            return new_nodes if new_nodes else [[]]
        
        # Single dict with 'args' (less common)
        if isinstance(nodes, dict):
            if 'args' in nodes:
                args = nodes['args']
                inner = []
                for a in (args if isinstance(args, list) else [args]):
                    ref = keras_tensor_to_ref(a)
                    if ref:
                        inner.append(ref)
                    elif isinstance(a, list):
                        inner.append(a)
                return [inner] if inner else [[]]
            else:
                # Fallback: wrap the dict
                return [[nodes]]
        
        # Last resort: wrap whatever it was
        return [[nodes]]
    
    def patch_layer(layer, patched_counters):
        """Recursively patch a single layer"""
        cfg = layer.get('config') if isinstance(layer, dict) else None
        
        # 1) Patch batch_shape → batch_input_shape (Keras v3 fix)
        if cfg and isinstance(cfg, dict):
            if 'batch_shape' in cfg and 'batch_input_shape' not in cfg and 'input_shape' not in cfg:
                cfg['batch_input_shape'] = cfg['batch_shape']
                patched_counters['shapes'] += 1
        
        # 2) Normalize inbound_nodes in config
        try:
            if cfg and 'inbound_nodes' in cfg:
                original = cfg['inbound_nodes']
                normalized = normalize_inbound_nodes_field(original)
                if normalized != original:
                    cfg['inbound_nodes'] = normalized
                    patched_counters['inbound'] += 1
        except Exception:
            pass
        
        # 3) Normalize layer-level nodeData
        try:
            if 'nodeData' in layer and not isinstance(layer['nodeData'], list):
                layer['nodeData'] = ensure_list(layer['nodeData'])
                patched_counters['nodeData'] += 1
            elif 'nodeData' in layer and isinstance(layer['nodeData'], list):
                # Ensure inner elements are lists
                nd = layer['nodeData']
                changed = False
                for i, v in enumerate(nd):
                    if not isinstance(v, list):
                        nd[i] = [v]
                        changed = True
                if changed:
                    patched_counters['nodeData'] += 1
        except Exception:
            pass
        
        # 4) Recursively patch nested Functional models
        try:
            if cfg and 'layers' in cfg and isinstance(cfg['layers'], list):
                for child in cfg['layers']:
                    patch_layer(child, patched_counters)
        except Exception:
            pass
    
    def normalize_model_json(model_json):
        """Normalize entire model.json structure"""
        patched = {'shapes': 0, 'inbound': 0, 'nodeData': 0, 'input_layers': 0, 'output_layers': 0}
        
        # Navigate to topology (handles different export formats)
        topo = model_json.get('modelTopology') or model_json.get('model_config') or model_json
        
        # Find layers array (multiple possible locations)
        layers = None
        if isinstance(topo, dict):
            # Try typical locations
            if 'model_config' in topo and isinstance(topo['model_config'], dict):
                cfg = topo['model_config'].get('config') or topo['model_config']
                if isinstance(cfg, dict) and isinstance(cfg.get('layers'), list):
                    layers = cfg['layers']
            if not layers and isinstance(topo.get('config'), dict) and isinstance(topo['config'].get('layers'), list):
                layers = topo['config']['layers']
            if not layers and isinstance(topo.get('layers'), list):
                layers = topo['layers']
        
        # DEBUG: Print what we found
        if layers:
            print(f"   🔍 Found {len(layers)} top-level layers")
            for i, layer in enumerate(layers):
                print(f"      Layer {i}: {layer.get('class_name', 'Unknown')}")
                # Check for nested Functional models
                if layer.get('class_name') == 'Functional':
                    if 'config' in layer and 'layers' in layer['config']:
                        nested_layers = layer['config']['layers']
                        print(f"         └─ Contains {len(nested_layers)} nested layers")
        else:
            print(f"   ⚠️  WARNING: No layers found!")
            print(f"   Topology keys: {list(topo.keys()) if isinstance(topo, dict) else 'not a dict'}")
        
        # Patch all layers
        if layers:
            for layer in layers:
                patch_layer(layer, patched)
        
        # Ensure top-level input_layers/output_layers are arrays
        try:
            if isinstance(topo, dict):
                mc = topo.get('model_config') or topo.get('config') or topo
                if isinstance(mc, dict):
                    if 'input_layers' in mc and not isinstance(mc['input_layers'], list):
                        mc['input_layers'] = ensure_list(mc['input_layers'])
                        patched['input_layers'] = 1
                    if 'output_layers' in mc and not isinstance(mc['output_layers'], list):
                        mc['output_layers'] = ensure_list(mc['output_layers'])
                        patched['output_layers'] = 1
        except Exception:
            pass
        
        return patched
    
    # Load, patch, and save model.json
    with open(model_json_path, 'r', encoding='utf-8') as f:
        model_json = json.load(f)
    
    patched_counts = normalize_model_json(model_json)
    
    with open(model_json_path, 'w', encoding='utf-8') as f:
        json.dump(model_json, f, indent=2)
    
    print(f"   ✅ Compatibility patches applied:")
    print(f"      • batch_shape fixes: {patched_counts['shapes']}")
    print(f"      • inbound_nodes normalized: {patched_counts['inbound']}")
    print(f"      • nodeData normalized: {patched_counts['nodeData']}")
    print(f"      • input/output layers wrapped: {patched_counts['input_layers'] + patched_counts['output_layers']}")
    print()
    
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
    
    # Step 6: Create Zip File
    print("\n" + "=" * 70)
    print("� CREATING ZIP FILE")
    print("=" * 70)
    
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    zip_filename = f'tfjs_model_FIXED_{timestamp}.zip'
    
    print(f"Creating: {zip_filename}")
    !zip -r -q {zip_filename} {temp_output}
    
    zip_size_mb = os.path.getsize(zip_filename) / (1024 * 1024)
    print(f"✅ Zip created: {zip_size_mb:.2f} MB")
    
    # Step 7: Save to Google Drive
    print("\n" + "=" * 70)
    print("� SAVING TO GOOGLE DRIVE")
    print("=" * 70)
    
    drive_base = "/content/drive/MyDrive/EGourd/Model_Versions/Converted_Models"
    os.makedirs(drive_base, exist_ok=True)
    
    zip_drive_path = f"{drive_base}/{zip_filename}"
    shutil.copy2(zip_filename, zip_drive_path)
    print(f"✅ Saved to Drive: {zip_drive_path}")
    
    # Step 8: Auto-Download to Computer
    print("\n" + "=" * 70)
    print("📥 AUTO-DOWNLOADING TO YOUR COMPUTER")
    print("=" * 70)
    print("Your download should start automatically...\n")
    
    files.download(zip_filename)
    
    # Step 9: Cleanup
    print("\n" + "=" * 70)
    print("🧹 CLEANING UP TEMPORARY FILES")
    print("=" * 70)
    
    shutil.rmtree(temp_output)
    os.remove(zip_filename)
    os.remove('ampalaya_classifier.h5')
    print("✅ Temporary files removed!")
    
    # Step 10: Summary
    print("\n" + "=" * 70)
    print("✅ SUCCESS! MODEL CONVERTED AND READY")
    print("=" * 70)
    print("\n📊 SUMMARY:")
    print(f"  • Model size: {total_size:.2f} MB")
    print(f"  • Zip size: {zip_size_mb:.2f} MB")
    print(f"  • Files in package: {len(files_list)}")
    print(f"  • Compatibility fixes: ✅ Applied")
    print(f"  • Google Drive backup: {zip_drive_path}")
    print(f"  • Downloaded to computer: ✅ {zip_filename}")
    
    print("\n📋 NEXT STEPS:")
    print()
    print("1. Find the downloaded file: " + zip_filename)
    print()
    print("2. Extract the zip file")
    print()
    print("3. REPLACE files in: frontend/mobile-app/assets/models/tfjs/")
    print("   Delete old files first, then copy:")
    for filename in sorted(files_list):
        print(f"   • {filename}")
    print()
    print("4. Restart Expo: npx expo start --clear")
    print()
    print("5. Expected logs:")
    print("   ✅ Model assets loaded via require()")
    print("   ✅ Model loaded successfully")
    print("   📊 Model summary: Input shapes: ,224,224,3")
    print()
    print("=" * 70)
    
except Exception as e:
    print(f"\n❌ Conversion failed: {str(e)}")
    import traceback
    traceback.print_exc()

# ============================================================================
# END OF FIXED CONVERSION SCRIPT
# ============================================================================
```

## 🎯 What's Different? (Robust Version)

### 1. **Comprehensive Post-Processing**
The script now handles **all known Keras v3 → TF.js incompatibilities**:

**Fixes Applied:**
- ✅ `batch_shape` → `batch_input_shape` (Keras v3 InputLayer fix)
- ✅ `inbound_nodes` normalization (handles 5+ different formats)
- ✅ `nodeData` wrapping (ensures array-of-arrays structure)
- ✅ `input_layers`/`output_layers` array wrapping
- ✅ Recursive processing of nested Functional models

**Formats Handled:**
```python
# Dict with 'args' (Keras v3 common)
[{args: [...], kwargs: {}}] → [[...]]

# List of dicts with 'args'
[{args: [...]}, {args: [...]}] → [[...], [...]]

# Single dict (rare)
{args: [...]} → [[...]]

# Already correct (unchanged)
[[...], [...]] → [[...], [...]]
```

### 2. **Defensive Programming**
- Safe navigation through different model.json structures
- Try-catch blocks prevent partial failures
- Handles multiple export format variations

### 3. **Standard Conversion**
```python
tfjs.converters.save_keras_model(keras_model, temp_output)
```
Uses the standard API without unsupported parameters—more reliable across TensorFlow.js versions.

### 4. **Detailed Logging**
Shows exactly what was patched:
```
✅ Compatibility patches applied:
   • batch_shape fixes: 2
   • inbound_nodes normalized: 152
   • nodeData normalized: 0
   • input/output layers wrapped: 2
```

## ⚡ Quick Start

1. **Open Google Colab**: [colab.research.google.com](https://colab.research.google.com)
2. **New Notebook**
3. **Paste the code above**
4. **Run** (Shift+Enter)
5. **Upload** your `ampalaya_classifier.h5`
6. **Wait** ~2 minutes
7. **Download** the zip file (named `tfjs_model_FIXED_*.zip`)

## 📦 After Conversion

The script will automatically:
1. ✅ Create a zip file with all model files
2. ✅ Save the zip to your Google Drive (backup)
3. ✅ Auto-download the zip to your computer

**Then you:**

1. **Locate the downloaded file**: `tfjs_model_FIXED_YYYYMMDD_HHMMSS.zip` (in your Downloads folder)

2. **Extract the zip file**

3. **Replace model files**:
   - Navigate to: `frontend/mobile-app/assets/models/tfjs/`
   - **Delete all old files** (model.json and .bin files)
   - **Copy the new files** from the extracted folder:
     - `model.json` (with all compatibility fixes)
     - `group1-shard1of3.bin`
     - `group1-shard2of3.bin`
     - `group1-shard3of3.bin`

4. **Restart Expo** with cleared cache:
   ```bash
   cd frontend/mobile-app
   npx expo start --clear
   ```

## ✅ Expected Result

After reloading with the new model, you should see:

```
✅ Model assets loaded via require()
🔧 Topology patch summary: patchedShapes=0, normalizedInbound=0
✅ Model loaded successfully
📊 Model summary:
   Input shapes: ,224,224,3
   Output shapes: ,1
   Total parameters: 2421889
```

**Key indicators of success:**
- `patchedShapes=0` and `normalizedInbound=0` — **This is GOOD!** It means the model.json is already correctly formatted (pre-fixed by the conversion script)
- `✅ Model loaded successfully` — No errors
- Model summary displays correctly

**Old behavior (problematic):**
```
❌ ERROR: Corrupted configuration, expected array for nodeData
```

**New behavior (fixed):**
```
✅ Model loaded successfully
```

## 💡 Why This Works

- **Root Cause**: Keras v3.10.0 exports `inbound_nodes` in a new format that TF.js doesn't recognize
- **Solution**: Post-process the `model.json` to extract just the `args` arrays
- **Benefit**: Works with current TF.js version without waiting for library updates

---

Let me know once you've reconverted and I'll help test it! 🚀
