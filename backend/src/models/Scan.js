const mongoose = require('mongoose');

const scanSchema = new mongoose.Schema({
  // User who performed the scan
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },

  // Original image information
  image: {
    originalName: String,
    filename: String,
    path: String, // Local file path or Cloudinary URL
    cloudinaryId: String, // Cloudinary public ID
    size: Number, // File size in bytes
    mimetype: String,
    dimensions: {
      width: Number,
      height: Number
    }
  },

  // Processed/analyzed image (if different from original)
  processedImage: {
    path: String,
    cloudinaryId: String,
    annotations: String // URL to annotated image with bounding boxes
  },

  // ML Model predictions and results
  predictions: {
    // Main gourd detection results
    gourds: [{
      // Bounding box coordinates
      bbox: {
        x: { type: Number, required: true }, // Top-left x coordinate
        y: { type: Number, required: true }, // Top-left y coordinate
        width: { type: Number, required: true },
        height: { type: Number, required: true }
      },
      
      // Classification results
      gourdType: {
        predicted: String, // bottle, dipper, ornamental, etc.
        confidence: { type: Number, min: 0, max: 1 },
        alternatives: [{
          type: String,
          confidence: Number
        }]
      },

      // Male/Female classification for flowers
      gender: {
        predicted: { type: String, enum: ['male', 'female', 'unknown'] },
        confidence: { type: Number, min: 0, max: 1 },
        isFlower: { type: Boolean, default: false }
      },

      // Growth stage estimation
      growthStage: {
        stage: { 
          type: String, 
          enum: ['seedling', 'flowering', 'young_fruit', 'mature', 'harvest_ready'],
          default: 'unknown'
        },
        confidence: { type: Number, min: 0, max: 1 },
        estimatedDaysToHarvest: Number
      },

      // Size estimation (if possible from image)
      sizeEstimate: {
        length: Number, // in cm
        width: Number,  // in cm
        estimatedWeight: Number, // in grams
        confidence: { type: Number, min: 0, max: 1 }
      },

      // Health assessment
      health: {
        status: {
          type: String,
          enum: ['healthy', 'diseased', 'pest_damage', 'nutrient_deficiency', 'unknown'],
          default: 'unknown'
        },
        confidence: { type: Number, min: 0, max: 1 },
        issues: [String] // Array of detected issues
      }
    }],

    // Overall scan statistics
    totalGourds: { type: Number, default: 0 },
    totalFlowers: { type: Number, default: 0 },
    averageConfidence: { type: Number, min: 0, max: 1 },
    
    // Model information
    modelVersion: String,
    modelType: { type: String, enum: ['mobile', 'server', 'hybrid'] },
    processingTime: Number // Time in milliseconds
  },

  // User feedback and corrections
  userFeedback: {
    // Overall satisfaction with scan results
    rating: {
      type: Number,
      min: 1,
      max: 5
    },
    
    // Accuracy feedback for each detected gourd
    corrections: [{
      gourdIndex: Number, // Index in the predictions.gourds array
      field: String, // Which field was corrected (gourdType, gender, etc.)
      originalValue: String,
      correctedValue: String,
      timestamp: { type: Date, default: Date.now }
    }],
    
    // Additional notes from user
    notes: String,
    
    // Flag for training data
    useForTraining: { type: Boolean, default: false }
  },

  // Scan metadata
  metadata: {
    // GPS location (if available)
    location: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point'
      },
      coordinates: [Number] // [longitude, latitude]
    },
    
    // Weather conditions (if available)
    weather: {
      temperature: Number,
      humidity: Number,
      conditions: String
    },
    
    // Device information
    device: {
      platform: String, // iOS, Android, Web
      model: String,
      appVersion: String,
      cameraSpecs: {
        resolution: String,
        hasFlash: Boolean,
        hasFocus: Boolean
      }
    },
    
    // Capture settings
    captureSettings: {
      hasFlash: Boolean,
      focusMode: String,
      exposureSettings: String,
      timestamp: Date
    }
  },

  // Processing status
  status: {
    type: String,
    enum: ['pending', 'processing', 'completed', 'failed', 'archived'],
    default: 'pending'
  },

  // Error information (if processing failed)
  error: {
    message: String,
    code: String,
    timestamp: Date
  },

  // Tags and categories
  tags: [String],
  
  // Privacy settings
  isPublic: { type: Boolean, default: false },
  shareWithResearchers: { type: Boolean, default: false },

  // Processing timestamps
  processingStarted: Date,
  processingCompleted: Date,

}, {
  timestamps: true, // Adds createdAt and updatedAt
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for better query performance
scanSchema.index({ user: 1, createdAt: -1 });
scanSchema.index({ status: 1 });
scanSchema.index({ 'metadata.location': '2dsphere' }); // For geospatial queries
scanSchema.index({ tags: 1 });
scanSchema.index({ isPublic: 1 });
scanSchema.index({ shareWithResearchers: 1 });

// Virtual for processing duration
scanSchema.virtual('processingDuration').get(function() {
  if (this.processingStarted && this.processingCompleted) {
    return this.processingCompleted.getTime() - this.processingStarted.getTime();
  }
  return null;
});

// Virtual for total detected objects
scanSchema.virtual('totalDetections').get(function() {
  return this.predictions.totalGourds + this.predictions.totalFlowers;
});

// Virtual for scan quality score (based on confidence and user feedback)
scanSchema.virtual('qualityScore').get(function() {
  let score = this.predictions.averageConfidence || 0;
  
  // Adjust based on user feedback
  if (this.userFeedback.rating) {
    score = (score + (this.userFeedback.rating / 5)) / 2;
  }
  
  return Math.round(score * 100);
});

// Pre-save middleware to update scan statistics
scanSchema.pre('save', function(next) {
  // Calculate total gourds and flowers
  if (this.predictions && this.predictions.gourds) {
    this.predictions.totalGourds = this.predictions.gourds.filter(g => !g.gender.isFlower).length;
    this.predictions.totalFlowers = this.predictions.gourds.filter(g => g.gender.isFlower).length;
    
    // Calculate average confidence
    if (this.predictions.gourds.length > 0) {
      const totalConfidence = this.predictions.gourds.reduce((sum, gourd) => {
        return sum + (gourd.gourdType.confidence || 0);
      }, 0);
      this.predictions.averageConfidence = totalConfidence / this.predictions.gourds.length;
    }
  }
  
  next();
});

// Static method to get scan statistics for a user
scanSchema.statics.getUserStats = async function(userId) {
  const stats = await this.aggregate([
    { $match: { user: mongoose.Types.ObjectId(userId) } },
    {
      $group: {
        _id: null,
        totalScans: { $sum: 1 },
        totalGourds: { $sum: '$predictions.totalGourds' },
        totalFlowers: { $sum: '$predictions.totalFlowers' },
        averageConfidence: { $avg: '$predictions.averageConfidence' },
        averageRating: { $avg: '$userFeedback.rating' }
      }
    }
  ]);
  
  return stats[0] || {
    totalScans: 0,
    totalGourds: 0,
    totalFlowers: 0,
    averageConfidence: 0,
    averageRating: 0
  };
};

// Static method to find scans near a location
scanSchema.statics.findNearLocation = function(longitude, latitude, maxDistance = 1000) {
  return this.find({
    'metadata.location': {
      $near: {
        $geometry: { type: 'Point', coordinates: [longitude, latitude] },
        $maxDistance: maxDistance
      }
    },
    isPublic: true
  });
};

// Instance method to add user correction
scanSchema.methods.addCorrection = function(gourdIndex, field, originalValue, correctedValue) {
  if (!this.userFeedback.corrections) {
    this.userFeedback.corrections = [];
  }
  
  this.userFeedback.corrections.push({
    gourdIndex,
    field,
    originalValue,
    correctedValue,
    timestamp: new Date()
  });
};

const Scan = mongoose.model('Scan', scanSchema);

module.exports = Scan;