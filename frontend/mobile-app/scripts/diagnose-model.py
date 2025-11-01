# ============================================================================
# DIAGNOSTIC SCRIPT - Check model.json structure
# ============================================================================
# Run this in Google Colab AFTER converting to see what structure exists
# ============================================================================

import json
import os

# Path to your converted model.json
model_json_path = './tfjs_model_temp/model.json'

# Load the model.json
with open(model_json_path, 'r', encoding='utf-8') as f:
    model_json = json.load(f)

print("=" * 70)
print("DIAGNOSTIC: MODEL.JSON STRUCTURE ANALYSIS")
print("=" * 70)

# Check top-level structure
print("\n1. TOP-LEVEL KEYS:")
for key in model_json.keys():
    print(f"   • {key}")

# Navigate to topology
topo = model_json.get('modelTopology') or model_json.get('model_config') or model_json
print(f"\n2. TOPOLOGY TYPE: {type(topo)}")

if isinstance(topo, dict):
    print(f"   TOPOLOGY KEYS: {list(topo.keys())}")
    
    # Check for model_config
    if 'model_config' in topo:
        mc = topo['model_config']
        print(f"\n3. MODEL_CONFIG TYPE: {type(mc)}")
        print(f"   MODEL_CONFIG KEYS: {list(mc.keys())}")
        
        # Check for config inside model_config
        if 'config' in mc:
            cfg = mc['config']
            print(f"\n4. CONFIG TYPE: {type(cfg)}")
            print(f"   CONFIG KEYS: {list(cfg.keys())}")
            
            # Check for layers
            if 'layers' in cfg:
                layers = cfg['layers']
                print(f"\n5. LAYERS FOUND: {len(layers)} layers")
                
                # Analyze first few layers
                for i, layer in enumerate(layers[:3]):
                    print(f"\n   LAYER {i} ({layer.get('class_name', 'Unknown')}):")
                    print(f"      Keys: {list(layer.keys())}")
                    
                    if 'config' in layer:
                        layer_cfg = layer['config']
                        print(f"      Config keys: {list(layer_cfg.keys())}")
                        
                        if 'inbound_nodes' in layer_cfg:
                            inbound = layer_cfg['inbound_nodes']
                            print(f"      inbound_nodes type: {type(inbound)}")
                            print(f"      inbound_nodes length: {len(inbound)}")
                            
                            if len(inbound) > 0:
                                print(f"      inbound_nodes[0] type: {type(inbound[0])}")
                                
                                if isinstance(inbound[0], dict):
                                    print(f"      inbound_nodes[0] keys: {list(inbound[0].keys())}")
                                    
                                    if 'args' in inbound[0]:
                                        args = inbound[0]['args']
                                        print(f"      args type: {type(args)}")
                                        print(f"      args length: {len(args)}")
                                        
                                        if len(args) > 0:
                                            print(f"      args[0] type: {type(args[0])}")
                                            
                                            if isinstance(args[0], dict):
                                                print(f"      args[0] keys: {list(args[0].keys())}")
                                                
                                                if 'class_name' in args[0]:
                                                    print(f"      args[0]['class_name']: {args[0]['class_name']}")
                                                
                                                if args[0].get('class_name') == '__keras_tensor__':
                                                    print(f"      ⚠️ FOUND __keras_tensor__ - needs conversion!")
                                                    if 'config' in args[0]:
                                                        kt_cfg = args[0]['config']
                                                        if 'keras_history' in kt_cfg:
                                                            print(f"      keras_history: {kt_cfg['keras_history']}")
                                elif isinstance(inbound[0], list):
                                    print(f"      ✅ inbound_nodes[0] is already a list (correct format)")
                    
                    if 'inbound_nodes' in layer:
                        print(f"      ⚠️ LAYER-LEVEL inbound_nodes found (unusual)")
                
                # Check for nested Functional models
                for i, layer in enumerate(layers):
                    if layer.get('class_name') == 'Functional':
                        print(f"\n   NESTED FUNCTIONAL MODEL found at layer {i}")
                        if 'config' in layer and 'layers' in layer['config']:
                            nested_layers = layer['config']['layers']
                            print(f"      Contains {len(nested_layers)} nested layers")

print("\n" + "=" * 70)
print("DIAGNOSTIC COMPLETE")
print("=" * 70)
