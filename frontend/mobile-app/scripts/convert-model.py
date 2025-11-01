#!/usr/bin/env python3
"""
TensorFlow Model to TF.js Converter
Converts Keras .h5 model to TensorFlow.js format for React Native
"""

import os
import sys

try:
    import tensorflowjs as tfjs
    print("✓ TensorFlow.js converter found")
except ImportError:
    print("✗ tensorflowjs not found")
    print("Installing tensorflowjs...")
    os.system("pip install tensorflowjs")
    import tensorflowjs as tfjs

# Paths
MODEL_DIR = os.path.join(os.path.dirname(__file__), '..', 'assets', 'models')
INPUT_MODEL = os.path.join(MODEL_DIR, 'ampalaya_classifier.h5')
OUTPUT_DIR = MODEL_DIR

def main():
    print("\n" + "="*70)
    print("CONVERTING KERAS MODEL TO TENSORFLOW.JS")
    print("="*70 + "\n")

    # Check if input model exists
    if not os.path.exists(INPUT_MODEL):
        print(f"✗ Error: Model file not found at {INPUT_MODEL}")
        print(f"  Make sure 'ampalaya_classifier.h5' is in {MODEL_DIR}")
        sys.exit(1)

    print(f"✓ Found model: {INPUT_MODEL}")
    print(f"  Size: {os.path.getsize(INPUT_MODEL) / (1024*1024):.2f} MB")

    # Convert model
    print("\nConverting model...")
    print("This may take 10-30 seconds...\n")

    try:
        tfjs.converters.save_keras_model(
            INPUT_MODEL,
            OUTPUT_DIR,
            quantization_dtype=None  # Keep full precision
        )

        print("\n" + "="*70)
        print("CONVERSION SUCCESSFUL!")
        print("="*70 + "\n")

        # List generated files
        print("Generated files in assets/models/:")
        for file in os.listdir(OUTPUT_DIR):
            if file.startswith('group') or file == 'model.json':
                file_path = os.path.join(OUTPUT_DIR, file)
                size_mb = os.path.getsize(file_path) / (1024*1024)
                print(f"  ✓ {file} ({size_mb:.2f} MB)")

        print("\n" + "="*70)
        print("NEXT STEPS")
        print("="*70)
        print("1. Verify 'model.json' and '.bin' files are in assets/models/")
        print("2. Run: npm start")
        print("3. Test the camera classification feature")
        print("4. Optional: Delete .h5 files to reduce app size")
        print("="*70 + "\n")

    except Exception as e:
        print(f"\n✗ Conversion failed: {str(e)}")
        print("\nTroubleshooting:")
        print("  - Make sure TensorFlow is installed: pip install tensorflow")
        print("  - Check if the .h5 file is valid")
        print("  - Try updating tensorflowjs: pip install -U tensorflowjs")
        sys.exit(1)

if __name__ == '__main__':
    main()
