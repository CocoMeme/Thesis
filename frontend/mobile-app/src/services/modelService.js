/**
 * Model Service for Ampalaya Flower Gender Classification
 * Using TensorFlow Lite format with react-native-fast-tflite
 * 
 * This service handles:
 * - Loading the TensorFlow Lite model (native)
 * - Image preprocessing (resize, normalize)
 * - Running inference for flower gender prediction
 * - Managing model lifecycle
 * 
 * @module modelService
 * @version 2.0.0-tflite-native
 */

import { loadTensorflowModel } from 'react-native-fast-tflite';
import * as ImageManipulator from 'expo-image-manipulator';
import * as FileSystem from 'expo-file-system/legacy';
import jpeg from 'jpeg-js';

class ModelService {
  constructor() {
    this.model = null;
    this.isReady = false;
    this.isInitializing = false;
    this.modelMetadata = {
      inputSize: [224, 224],
      classes: ['Female', 'Male'],
      preprocessing: {
        rescale: 1.0 / 255.0
      }
    };
  }

  /**
   * Initialize and load the TFLite model (native)
   * @returns {Promise<boolean>} True if initialization successful
   * @throws {Error} If model initialization fails
   */
  async initialize() {
    // Prevent multiple simultaneous initialization attempts
    if (this.isInitializing) {
      console.log('⏳ Model initialization already in progress...');
      while (this.isInitializing) {
        await new Promise(resolve => setTimeout(resolve, 100));
      }
      return this.isReady;
    }

    if (this.isReady) {
      console.log('✅ Model already initialized');
      return true;
    }

    this.isInitializing = true;

    try {
      console.log('🤖 Initializing TFLite model (native)...');
      
      // Load the TFLite model
      console.log('🔄 Loading TFLite model...');
      await this.loadTFLiteModel();
      
      this.isReady = true;
      this.isInitializing = false;
      
      console.log('✅ TFLite model loaded successfully');
      
      return true;
    } catch (error) {
      this.isInitializing = false;
      this.isReady = false;
      console.error('❌ Model initialization failed:', error);
      throw new Error(`Failed to initialize model: ${error.message}`);
    }
  }

  /**
   * Load the TensorFlow Lite model using native loader
   * @private
   */
  async loadTFLiteModel() {
    try {
      console.log('📦 Loading TFLite model asset...');
      
      // react-native-fast-tflite expects the require() directly
      const modelSource = require('../../assets/models/ampalaya_classifier.tflite');
      
      console.log(' Model size: 4.57 MB');
      
      // Load TFLite model using react-native-fast-tflite (native)
      console.log('🔄 Loading model with native TFLite interpreter...');
      
      this.model = await loadTensorflowModel(modelSource);
      
      console.log('✅ TFLite model loaded successfully (native)');
      console.log('📊 Model info:');
      console.log('   Inputs:', JSON.stringify(this.model.inputs, null, 2));
      console.log('   Outputs:', JSON.stringify(this.model.outputs, null, 2));
      console.log(`   Expected input shape: [1, 224, 224, 3]`);
      console.log(`   Expected output shape: [1, 1]`);
      
    } catch (error) {
      console.error('❌ TFLite model loading failed:', error);
      console.error('Error details:', {
        name: error.name,
        message: error.message,
        stack: error.stack
      });
      throw new Error(`Failed to load TFLite model: ${error.message}`);
    }
  }

  /**
   * Preprocess image for model input
   * - Resize to 224×224 pixels
   * - Decode JPEG to RGB pixels
   * - Convert to Float32Array and normalize [0-1]
   * 
   * @param {string} imageUri - URI of the image to process
   * @returns {Promise<Float32Array>} Preprocessed image as Float32 tensor
   * @throws {Error} If preprocessing fails
   */
  async preprocessImage(imageUri) {
    try {
      console.log('🖼️  Preprocessing image...');
      
      // Step 1: Resize image to 224×224
      const manipResult = await ImageManipulator.manipulateAsync(
        imageUri,
        [{ resize: { width: 224, height: 224 } }],
        { 
          compress: 1, 
          format: ImageManipulator.SaveFormat.JPEG 
        }
      );

      console.log('✅ Image resized to 224×224');
      
      // Step 2: Read the image as base64
      const base64 = await FileSystem.readAsStringAsync(manipResult.uri, {
        encoding: 'base64',
      });
      
      // Step 3: Convert base64 to Uint8Array (JPEG bytes)
      const jpegBytes = Uint8Array.from(atob(base64), c => c.charCodeAt(0));
      
      // Step 4: Decode JPEG to raw RGB pixels
      const rawImageData = jpeg.decode(jpegBytes, { useTArray: true });
      
      // Step 5: Extract RGB data and normalize to [0, 1]
      // rawImageData.data is Uint8Array with RGBA values (4 bytes per pixel)
      // We need RGB only (3 bytes per pixel) and convert to Float32
      const pixels = new Float32Array(224 * 224 * 3);
      let pixelIndex = 0;
      
      for (let i = 0; i < rawImageData.data.length; i += 4) {
        // Extract R, G, B (skip A) and normalize [0-255] → [0-1]
        pixels[pixelIndex++] = rawImageData.data[i] / 255.0;     // R
        pixels[pixelIndex++] = rawImageData.data[i + 1] / 255.0; // G
        pixels[pixelIndex++] = rawImageData.data[i + 2] / 255.0; // B
      }
      
      console.log(`✅ Image decoded to Float32 pixels: ${pixels.length} values`);
      
      return pixels;
    } catch (error) {
      console.error('❌ Image preprocessing failed:', error);
      throw new Error(`Failed to preprocess image: ${error.message}`);
    }
  }

  /**
   * Predict flower gender (male/female) from image
   * 
   * @param {string} imageUri - URI of the flower image
   * @returns {Promise<Object>} Prediction result with gender, confidence, and metadata
   * @throws {Error} If prediction fails or model not initialized
   * 
   * @example
   * const result = await modelService.predictFlowerGender('file:///path/to/image.jpg');
   * // Result: { gender: 'male', confidence: 95.5, rawScore: 0.955, ... }
   */
  async predictFlowerGender(imageUri) {
    if (!this.isReady) {
      throw new Error('Model not initialized. Call initialize() first.');
    }

    try {
      console.log('🔍 Starting prediction...');
      const startTime = Date.now();

      // Step 1: Preprocess image (resize, decode, normalize to Float32)
      const imagePixels = await this.preprocessImage(imageUri);

      // Step 2: Run inference with native TFLite
      console.log('🧠 Running model inference (native)...');
      
      // react-native-fast-tflite expects array of TypedArrays as input
      const outputs = await this.model.run([imagePixels]);
      
      // Step 3: Parse results
      // Output format: array of TypedArrays
      // For binary classification with sigmoid: single value [0, 1]
      const outputTensor = outputs[0];
      const rawScore = outputTensor[0];
      
      console.log('🔍 Raw model output:', {
        outputTensor: outputTensor,
        rawScore: rawScore,
        type: typeof rawScore,
        tensorLength: outputTensor.length
      });
      
      // Model training labels (INVERTED):
      // Low value (0-0.5) = Female  
      // High value (0.5-1) = Male
      const isMale = rawScore > 0.5;
      const gender = isMale ? 'male' : 'female';
      
      // Calculate confidence percentage
      const confidencePercentage = isMale 
        ? rawScore * 100 
        : (1 - rawScore) * 100;
      
      // Check if prediction is confident enough
      // If rawScore is too close to 0.5, it might not be a flower
      const uncertaintyThreshold = 0.6; // Require at least 60% certainty
      const isUncertain = rawScore > 0.4 && rawScore < 0.6;
      
      if (isUncertain) {
        console.log('⚠️  Low confidence - might not be a flower');
      }

      const processingTime = Date.now() - startTime;
      
      console.log('✅ Prediction complete:', {
        gender,
        confidence: `${confidencePercentage.toFixed(1)}%`,
        processingTime: `${processingTime}ms`
      });

      // Return comprehensive prediction result
      return {
        gender,                                    // 'male' or 'female'
        confidence: confidencePercentage,           // 0-100
        rawScore: rawScore,                        // 0-1 (raw model output)
        isUncertain: isUncertain,                  // true if might not be a flower
        processingTime,                            // milliseconds
        modelVersion: '1.0.0-tflite-native',       // Model version
        modelType: 'MobileNetV2 (Native TFLite)', // Model architecture
        timestamp: new Date().toISOString(),       // ISO timestamp
        inputShape: [224, 224, 3],                 // Input dimensions
      };
    } catch (error) {
      console.error('❌ Prediction failed:', error);
      throw new Error(`Prediction failed: ${error.message}`);
    }
  }

  /**
   * Batch predict multiple images
   * Useful for processing multiple photos at once
   * 
   * @param {string[]} imageUris - Array of image URIs
   * @returns {Promise<Object[]>} Array of prediction results
   */
  async predictBatch(imageUris) {
    if (!this.isReady) {
      throw new Error('Model not initialized. Call initialize() first.');
    }

    console.log(`🔍 Starting batch prediction for ${imageUris.length} images...`);
    const results = [];

    for (let i = 0; i < imageUris.length; i++) {
      try {
        console.log(`Processing image ${i + 1}/${imageUris.length}...`);
        const result = await this.predictFlowerGender(imageUris[i]);
        results.push({
          index: i,
          uri: imageUris[i],
          result,
          success: true
        });
      } catch (error) {
        console.error(`Failed to process image ${i + 1}:`, error);
        results.push({
          index: i,
          uri: imageUris[i],
          error: error.message,
          success: false
        });
      }
    }

    console.log(`✅ Batch prediction complete: ${results.filter(r => r.success).length}/${imageUris.length} successful`);
    return results;
  }

  /**
   * Get model information and status
   * @returns {Object} Model metadata and status
   */
  getModelInfo() {
    return {
      isReady: this.isReady,
      isInitializing: this.isInitializing,
      modelVersion: '1.0.0-tflite-native',
      modelType: 'MobileNetV2 (Native TFLite)',
      format: 'TensorFlow Lite (Native)',
      inputShape: [224, 224, 3],
      classes: ['female', 'male'],
      backend: 'native-tflite'
    };
  }

  /**
   * Get model performance metrics from metadata
   * @returns {Object|null} Performance metrics or null if not loaded
   */
  getModelMetrics() {
    return {
      accuracy: 1.0,
      precision: 1.0,
      recall: 1.0,
      f1Score: 1.0,
      auc: 1.0,
      trainingInfo: {
        total_epochs: 62,
        batch_size: 16,
        train_samples: 701,
        val_samples: 150,
        test_samples: 152
      }
    };
  }

  /**
   * Warm up the model by running a dummy prediction
   * This helps improve performance of the first real prediction
   * 
   * @returns {Promise<void>}
   */
  async warmUp() {
    if (!this.isReady) {
      throw new Error('Model not initialized. Call initialize() first.');
    }

    console.log('🔥 Warming up model...');
    console.log('⚠️  Warm-up not implemented for native TFLite (first prediction will be slower)');
  }

  /**
   * Cleanup resources and dispose of the model
   * Call this when the model is no longer needed
   */
  dispose() {
    console.log('🧹 Disposing model...');
    
    if (this.model) {
      // react-native-fast-tflite handles cleanup automatically
      this.model = null;
    }
    
    this.isReady = false;
    this.isInitializing = false;
    
    console.log('✅ Model disposed');
  }

  /**
   * Reset the service (useful for testing or error recovery)
   */
  reset() {
    this.dispose();
    console.log('🔄 Model service reset');
  }

  /**
   * Get memory usage information
   * @returns {Object} Memory usage statistics
   */
  getMemoryInfo() {
    if (!this.isReady) {
      return null;
    }

    return {
      message: 'Native TFLite - memory managed by native layer',
      modelSize: '4.57 MB'
    };
  }
}

// Export singleton instance
export const modelService = new ModelService();

// Also export the class for testing purposes
export { ModelService };
