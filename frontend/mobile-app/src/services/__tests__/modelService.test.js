/**
 * Model Service Tests
 * 
 * These tests verify the modelService functionality
 * Run with: npm test
 */

import { modelService, ModelService } from '../modelService';

describe('ModelService', () => {
  describe('Singleton Instance', () => {
    test('should export a singleton instance', () => {
      expect(modelService).toBeDefined();
      expect(modelService).toBeInstanceOf(ModelService);
    });

    test('should have initial state', () => {
      expect(modelService.isReady).toBe(false);
      expect(modelService.isInitializing).toBe(false);
      expect(modelService.model).toBeNull();
      expect(modelService.metadata).toBeNull();
    });
  });

  describe('Model Information', () => {
    test('getModelInfo should return status', () => {
      const info = modelService.getModelInfo();
      expect(info).toHaveProperty('isReady');
      expect(info).toHaveProperty('isInitializing');
      expect(info).toHaveProperty('metadata');
    });

    test('getModelMetrics should return null when not loaded', () => {
      const metrics = modelService.getModelMetrics();
      expect(metrics).toBeNull();
    });
  });

  describe('Error Handling', () => {
    test('should throw error when predicting without initialization', async () => {
      await expect(
        modelService.predictFlowerGender('dummy-uri')
      ).rejects.toThrow('Model not initialized');
    });

    test('should throw error when batch predicting without initialization', async () => {
      await expect(
        modelService.predictBatch(['dummy-uri'])
      ).rejects.toThrow('Model not initialized');
    });

    test('should throw error when warming up without initialization', async () => {
      await expect(
        modelService.warmUp()
      ).rejects.toThrow('Model not initialized');
    });
  });

  describe('Memory Management', () => {
    test('getMemoryInfo should return null when not ready', () => {
      const memInfo = modelService.getMemoryInfo();
      expect(memInfo).toBeNull();
    });

    test('dispose should clean up resources', () => {
      modelService.dispose();
      expect(modelService.isReady).toBe(false);
      expect(modelService.model).toBeNull();
      expect(modelService.metadata).toBeNull();
    });

    test('reset should call dispose', () => {
      const disposeSpy = jest.spyOn(modelService, 'dispose');
      modelService.reset();
      expect(disposeSpy).toHaveBeenCalled();
    });
  });
});

describe('ModelService Integration', () => {
  // These tests require the actual model files to be present
  // Mark as skip if running in CI/CD without model files

  describe.skip('Model Initialization', () => {
    test('should initialize successfully', async () => {
      await modelService.initialize();
      expect(modelService.isReady).toBe(true);
      expect(modelService.metadata).not.toBeNull();
    });

    test('should handle multiple initialization calls', async () => {
      await modelService.initialize();
      await modelService.initialize(); // Should return quickly
      expect(modelService.isReady).toBe(true);
    });

    test('should load metadata correctly', async () => {
      await modelService.initialize();
      const metrics = modelService.getModelMetrics();
      
      expect(metrics).not.toBeNull();
      expect(metrics).toHaveProperty('accuracy');
      expect(metrics).toHaveProperty('precision');
      expect(metrics).toHaveProperty('recall');
    });
  });

  describe.skip('Prediction', () => {
    beforeAll(async () => {
      await modelService.initialize();
    });

    test('should predict from image URI', async () => {
      // Mock image URI - replace with actual test image
      const mockImageUri = 'file:///path/to/test/image.jpg';
      
      const result = await modelService.predictFlowerGender(mockImageUri);
      
      expect(result).toHaveProperty('gender');
      expect(result).toHaveProperty('confidence');
      expect(result).toHaveProperty('processingTime');
      expect(['male', 'female']).toContain(result.gender);
      expect(result.confidence).toBeGreaterThanOrEqual(0);
      expect(result.confidence).toBeLessThanOrEqual(100);
    });

    test('should process batch predictions', async () => {
      const mockImageUris = [
        'file:///path/to/test/image1.jpg',
        'file:///path/to/test/image2.jpg'
      ];
      
      const results = await modelService.predictBatch(mockImageUris);
      
      expect(results).toHaveLength(mockImageUris.length);
      results.forEach(result => {
        expect(result).toHaveProperty('index');
        expect(result).toHaveProperty('uri');
        expect(result).toHaveProperty('success');
      });
    });
  });

  describe.skip('Performance', () => {
    beforeAll(async () => {
      await modelService.initialize();
    });

    test('should complete prediction within reasonable time', async () => {
      const mockImageUri = 'file:///path/to/test/image.jpg';
      
      const startTime = Date.now();
      await modelService.predictFlowerGender(mockImageUri);
      const duration = Date.now() - startTime;
      
      // Should complete within 2 seconds as per requirements
      expect(duration).toBeLessThan(2000);
    });

    test('warm up should improve performance', async () => {
      await modelService.warmUp();
      // Warm-up should complete without errors
      expect(modelService.isReady).toBe(true);
    });
  });

  afterAll(() => {
    modelService.dispose();
  });
});
