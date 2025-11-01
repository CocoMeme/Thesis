#!/usr/bin/env python3
"""
Fix InputLayer configuration for TensorFlow.js compatibility
Changes 'batch_shape' to 'batch_input_shape' in model.json
"""

import json
import os
import shutil
from datetime import datetime

# Paths
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_DIR = os.path.join(SCRIPT_DIR, '..', 'assets', 'models', 'tfjs')
MODEL_JSON_PATH = os.path.join(MODEL_DIR, 'model.json')

print("=" * 70)
print("FIX INPUT LAYER: Rename batch_shape to batch_input_shape")
print("=" * 70)

# Create backup
timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
backup_path = f"{MODEL_JSON_PATH}.backup_{timestamp}"
shutil.copy(MODEL_JSON_PATH, backup_path)
print(f"✅ Backup created: {os.path.basename(backup_path)}\n")

# Load model.json
print("🔧 Loading model.json...")
with open(MODEL_JSON_PATH, 'r', encoding='utf-8') as f:
    model_data = json.load(f)

print("✅ Loaded successfully\n")

# Fix function
def fix_input_layer(layer):
    """Recursively fix InputLayer configs"""
    fixed_count = 0
    
    if isinstance(layer, dict):
        # Check if this is an InputLayer
        if layer.get('class_name') == 'InputLayer':
            config = layer.get('config', {})
            
            # Rename batch_shape to batch_input_shape
            if 'batch_shape' in config and 'batch_input_shape' not in config:
                config['batch_input_shape'] = config.pop('batch_shape')
                fixed_count += 1
                print(f"✓ Fixed InputLayer: {config.get('name', 'unnamed')}")
        
        # Recursively process nested layers
        if 'layers' in layer and isinstance(layer['layers'], list):
            for nested_layer in layer['layers']:
                fixed_count += fix_input_layer(nested_layer)
        
        # Process config if it has layers
        config = layer.get('config', {})
        if 'layers' in config and isinstance(config['layers'], list):
            for nested_layer in config['layers']:
                fixed_count += fix_input_layer(nested_layer)
    
    return fixed_count

# Process model
print("🔧 Processing model.json...\n")
total_fixed = 0

# Get layers from model topology
topology = model_data.get('modelTopology', {})
model_config = topology.get('model_config', {})
config = model_config.get('config', {})

if 'layers' in config and isinstance(config['layers'], list):
    for layer in config['layers']:
        total_fixed += fix_input_layer(layer)

# Save fixed model.json
print(f"\n💾 Saving fixed model.json...")
with open(MODEL_JSON_PATH, 'w', encoding='utf-8') as f:
    json.dump(model_data, f, indent=2)

print("✅ Saved successfully\n")

# Summary
print("=" * 70)
print("✅ FIX COMPLETE!")
print("=" * 70)
print(f"\n📊 SUMMARY:")
print(f"   • InputLayers fixed: {total_fixed}")
print(f"   • Backup saved: {os.path.basename(backup_path)}")
print(f"   • Fixed file: model.json")
print("\n🚀 NEXT STEPS:")
print("   1. Restart Expo: npx expo start --clear")
print("   2. Check for: ✅ Model loaded successfully")
print("=" * 70)
