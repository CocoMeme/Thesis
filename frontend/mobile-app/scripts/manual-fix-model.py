# ============================================================================
# MANUAL FIX SCRIPT - Run this AFTER conversion to fix inbound_nodes
# ============================================================================
# This script fixes the model.json file directly on your local machine
# Run this in the tfjs folder where model.json is located
# ============================================================================

import json
import os
import shutil
from datetime import datetime

# Path to your model.json
model_json_path = r"C:\Users\coand\Desktop\Thesis\frontend\mobile-app\assets\models\tfjs\model.json"

print("=" * 70)
print("MANUAL FIX: Converting __keras_tensor__ to keras_history references")
print("=" * 70)

# Create backup
backup_path = model_json_path + f".backup_{datetime.now().strftime('%Y%m%d_%H%M%S')}"
shutil.copy2(model_json_path, backup_path)
print(f"✅ Backup created: {backup_path}\n")

# Load model.json
with open(model_json_path, 'r', encoding='utf-8') as f:
    model_json = json.load(f)

def keras_tensor_to_ref(kt):
    """Extract keras_history from __keras_tensor__ object"""
    try:
        if isinstance(kt, dict) and kt.get('class_name') == '__keras_tensor__':
            kh = kt.get('config', {}).get('keras_history')
            if isinstance(kh, list) and len(kh) >= 3:
                return [kh[0], kh[1], kh[2]]
    except Exception:
        pass
    return None

def fix_inbound_nodes(nodes):
    """Convert Keras v3 inbound_nodes to TF.js format"""
    if not isinstance(nodes, list):
        return nodes
    
    new_nodes = []
    fixed_count = 0
    
    for item in nodes:
        # Check if it's the Keras v3 format: {args: [...], kwargs: {}}
        if isinstance(item, dict) and 'args' in item:
            args = item['args']
            inner = []
            
            # Process each arg
            for a in (args if isinstance(args, list) else [args]):
                # Check if 'a' is a list of tensors (for Add/Concatenate layers)
                if isinstance(a, list):
                    # Process each tensor in the list
                    tensor_refs = []
                    for tensor in a:
                        ref = keras_tensor_to_ref(tensor)
                        if ref:
                            tensor_refs.append(ref)
                            fixed_count += 1
                        elif isinstance(tensor, list):
                            tensor_refs.append(tensor)
                        else:
                            tensor_refs.append([tensor])
                    
                    # For multi-input layers, add all refs to inner
                    if tensor_refs:
                        inner.extend(tensor_refs)
                else:
                    # Single tensor
                    ref = keras_tensor_to_ref(a)
                    if ref:
                        inner.append(ref)
                        fixed_count += 1
                    elif isinstance(a, list):
                        inner.append(a)
                    else:
                        inner.append([a])
            
            new_nodes.append(inner if inner else [])
        elif isinstance(item, list):
            new_nodes.append(item)
        else:
            new_nodes.append([item])
    
    return new_nodes, fixed_count

def process_layer(layer, counters):
    """Process a single layer and its nested layers"""
    if not isinstance(layer, dict):
        return
    
    # Get config
    cfg = layer.get('config')
    
    # Fix inbound_nodes in config
    if cfg and isinstance(cfg, dict) and 'inbound_nodes' in cfg:
        original = cfg['inbound_nodes']
        fixed, count = fix_inbound_nodes(original)
        if count > 0:
            cfg['inbound_nodes'] = fixed
            counters['inbound'] += count
            print(f"   ✓ Fixed {count} inbound_nodes in layer: {layer.get('class_name', 'Unknown')}")
    
    # Fix inbound_nodes at layer level (some layers have it here)
    if 'inbound_nodes' in layer:
        original = layer['inbound_nodes']
        fixed, count = fix_inbound_nodes(original)
        if count > 0:
            layer['inbound_nodes'] = fixed
            counters['inbound'] += count
            print(f"   ✓ Fixed {count} layer-level inbound_nodes: {layer.get('name', 'Unknown')}")
    
    # Recursively process nested Functional models
    if cfg and isinstance(cfg, dict) and 'layers' in cfg and isinstance(cfg['layers'], list):
        print(f"   🔍 Processing nested {len(cfg['layers'])} layers in {layer.get('class_name', 'Functional')}")
        for nested_layer in cfg['layers']:
            process_layer(nested_layer, counters)

# Process the model
counters = {'inbound': 0}

print("🔧 Processing model.json...\n")

# Navigate to layers
topo = model_json.get('modelTopology', {})
model_config = topo.get('model_config', {})
config = model_config.get('config', {})
layers = config.get('layers', [])

print(f"Found {len(layers)} top-level layers\n")

# Process each layer
for i, layer in enumerate(layers):
    layer_name = layer.get('class_name', 'Unknown')
    print(f"Processing layer {i+1}/{len(layers)}: {layer_name}")
    process_layer(layer, counters)

# Save the fixed model.json
with open(model_json_path, 'w', encoding='utf-8') as f:
    json.dump(model_json, f, indent=2)

print("\n" + "=" * 70)
print("✅ MODEL.JSON FIXED!")
print("=" * 70)
print(f"\n📊 SUMMARY:")
print(f"   • __keras_tensor__ objects converted: {counters['inbound']}")
print(f"   • Backup saved: {os.path.basename(backup_path)}")
print(f"   • Fixed file: {os.path.basename(model_json_path)}")

print("\n🚀 NEXT STEPS:")
print("   1. Restart Expo: npx expo start --clear")
print("   2. Check for: ✅ Model loaded successfully")
print("\n" + "=" * 70)
