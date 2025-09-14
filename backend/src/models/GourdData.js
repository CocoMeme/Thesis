const mongoose = require('mongoose');

const gourdDataSchema = new mongoose.Schema({
  // Basic gourd information
  name: {
    type: String,
    required: [true, 'Gourd name is required'],
    trim: true,
    unique: true
  },

  scientificName: {
    type: String,
    trim: true,
    sparse: true // Allows multiple null values but unique non-null values
  },

  commonNames: [String], // Alternative names

  category: {
    type: String,
    enum: ['bottle', 'dipper', 'ornamental', 'birdhouse', 'canteen', 'snake', 'spoon', 'bowl', 'other'],
    required: true
  },

  // Physical characteristics
  characteristics: {
    // Size ranges
    size: {
      minLength: { type: Number, min: 0 }, // in cm
      maxLength: { type: Number, min: 0 },
      minWidth: { type: Number, min: 0 },
      maxWidth: { type: Number, min: 0 },
      minWeight: { type: Number, min: 0 }, // in grams
      maxWeight: { type: Number, min: 0 }
    },

    // Visual characteristics
    shape: {
      type: String,
      enum: ['round', 'elongated', 'bottle-shaped', 'pear-shaped', 'curved', 'irregular']
    },

    color: {
      primary: String,
      secondary: [String],
      patterns: [String] // stripes, spots, solid, etc.
    },

    surface: {
      texture: {
        type: String,
        enum: ['smooth', 'rough', 'bumpy', 'ridged', 'warty']
      },
      finish: {
        type: String,
        enum: ['glossy', 'matte', 'dull']
      }
    },

    // Wall thickness for functional gourds
    wallThickness: {
      min: Number, // in mm
      max: Number
    }
  },

  // Growing information
  growing: {
    // Growth timeline
    timeline: {
      seedToFlower: { type: Number, min: 0 }, // days
      flowerToFruit: { type: Number, min: 0 }, // days
      fruitToMaturity: { type: Number, min: 0 }, // days
      totalGrowingTime: { type: Number, min: 0 } // days
    },

    // Environmental requirements
    climate: {
      minTemperature: Number, // Celsius
      maxTemperature: Number,
      optimalTemperature: Number,
      humidity: {
        min: Number, // percentage
        max: Number
      },
      rainfall: {
        min: Number, // mm per year
        max: Number
      }
    },

    // Soil requirements
    soil: {
      ph: {
        min: Number,
        max: Number
      },
      type: [String], // sandy, clay, loam, etc.
      drainage: {
        type: String,
        enum: ['well-drained', 'moderately-drained', 'poor-drainage']
      }
    },

    // Space requirements
    spacing: {
      plantSpacing: Number, // cm between plants
      rowSpacing: Number,   // cm between rows
      supportNeeded: Boolean, // needs trellis/support
      supportHeight: Number  // cm
    },

    // Harvest information
    harvest: {
      // Signs of readiness
      maturitySigns: [String],
      harvestSeason: [String], // spring, summer, fall, winter
      storageLife: Number, // days
      curingSuggestion: String
    }
  },

  // Usage and applications
  uses: {
    traditional: [String], // Historical uses
    modern: [String],      // Contemporary uses
    decorative: Boolean,
    functional: Boolean,
    edible: {
      leaves: Boolean,
      flowers: Boolean,
      youngFruit: Boolean,
      seeds: Boolean
    }
  },

  // Reference images for ML training
  referenceImages: [{
    url: String,
    cloudinaryId: String,
    description: String,
    stage: {
      type: String,
      enum: ['seedling', 'flowering', 'young_fruit', 'mature', 'harvest_ready', 'dried']
    },
    angle: String, // front, side, top, etc.
    isAnnotated: Boolean,
    annotations: String, // URL to annotation file
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    uploadDate: { type: Date, default: Date.now },
    verified: { type: Boolean, default: false },
    verifiedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  }],

  // Cultivation tips and care instructions
  care: {
    watering: {
      frequency: String,
      amount: String,
      method: String
    },
    fertilizing: {
      type: String,
      frequency: String,
      npkRatio: String
    },
    pruning: {
      needed: Boolean,
      frequency: String,
      method: String
    },
    pestControl: {
      commonPests: [String],
      organicMethods: [String],
      chemicalMethods: [String]
    },
    diseases: {
      common: [String],
      prevention: [String],
      treatment: [String]
    }
  },

  // Seed information
  seeds: {
    size: {
      length: Number, // mm
      width: Number
    },
    color: String,
    shape: String,
    germinationRate: Number, // percentage
    viabilityPeriod: Number, // years
    sowingDepth: Number, // cm
    sowingSeason: [String]
  },

  // Regional information
  regions: {
    native: [String], // Countries/regions where it's native
    cultivated: [String], // Where it's commonly grown
    climateZones: [String] // USDA zones, etc.
  },

  // Data management
  dataQuality: {
    verified: { type: Boolean, default: false },
    verifiedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    verificationDate: Date,
    confidence: { type: Number, min: 0, max: 1 },
    sources: [String], // URLs or references
    lastReviewed: Date
  },

  // Search and categorization
  tags: [String],
  difficulty: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced'],
    default: 'intermediate'
  },

  popularity: { type: Number, default: 0 }, // Based on user interest/searches

  // Status
  isActive: { type: Boolean, default: true },
  isPublic: { type: Boolean, default: true }

}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for better query performance
gourdDataSchema.index({ name: 1 });
gourdDataSchema.index({ category: 1 });
gourdDataSchema.index({ tags: 1 });
gourdDataSchema.index({ 'dataQuality.verified': 1 });
gourdDataSchema.index({ isActive: 1, isPublic: 1 });
gourdDataSchema.index({ scientificName: 1 }, { sparse: true });

// Text search index
gourdDataSchema.index({
  name: 'text',
  scientificName: 'text',
  commonNames: 'text',
  tags: 'text'
}, {
  weights: {
    name: 10,
    scientificName: 8,
    commonNames: 6,
    tags: 4
  }
});

// Virtual for average size
gourdDataSchema.virtual('averageSize').get(function() {
  if (this.characteristics && this.characteristics.size) {
    const size = this.characteristics.size;
    return {
      length: size.minLength && size.maxLength ? (size.minLength + size.maxLength) / 2 : null,
      width: size.minWidth && size.maxWidth ? (size.minWidth + size.maxWidth) / 2 : null,
      weight: size.minWeight && size.maxWeight ? (size.minWeight + size.maxWeight) / 2 : null
    };
  }
  return null;
});

// Virtual for total growing time
gourdDataSchema.virtual('totalGrowingDays').get(function() {
  if (this.growing && this.growing.timeline) {
    const timeline = this.growing.timeline;
    return (timeline.seedToFlower || 0) + 
           (timeline.flowerToFruit || 0) + 
           (timeline.fruitToMaturity || 0);
  }
  return this.growing?.timeline?.totalGrowingTime || null;
});

// Virtual for verification status
gourdDataSchema.virtual('isVerified').get(function() {
  return this.dataQuality?.verified || false;
});

// Static method to search gourds
gourdDataSchema.statics.searchGourds = function(query, filters = {}) {
  const searchQuery = {
    isActive: true,
    isPublic: true,
    ...filters
  };

  if (query && query.trim()) {
    searchQuery.$text = { $search: query };
  }

  return this.find(searchQuery)
    .sort({ score: { $meta: 'textScore' }, popularity: -1 })
    .limit(20);
};

// Static method to find similar gourds
gourdDataSchema.statics.findSimilar = function(gourdId, limit = 5) {
  return this.aggregate([
    { $match: { _id: { $ne: mongoose.Types.ObjectId(gourdId) }, isActive: true, isPublic: true } },
    { $lookup: { from: 'gourddata', localField: 'category', foreignField: 'category', as: 'similar' } },
    { $limit: limit },
    { $sort: { popularity: -1 } }
  ]);
};

// Static method to get category statistics
gourdDataSchema.statics.getCategoryStats = function() {
  return this.aggregate([
    { $match: { isActive: true, isPublic: true } },
    {
      $group: {
        _id: '$category',
        count: { $sum: 1 },
        avgGrowingTime: { $avg: '$growing.timeline.totalGrowingTime' },
        varieties: { $push: '$name' }
      }
    },
    { $sort: { count: -1 } }
  ]);
};

// Instance method to add reference image
gourdDataSchema.methods.addReferenceImage = function(imageData, uploadedBy) {
  this.referenceImages.push({
    ...imageData,
    uploadedBy: uploadedBy,
    uploadDate: new Date()
  });
};

// Instance method to verify data
gourdDataSchema.methods.verifyData = function(verifiedBy) {
  this.dataQuality.verified = true;
  this.dataQuality.verifiedBy = verifiedBy;
  this.dataQuality.verificationDate = new Date();
  this.dataQuality.lastReviewed = new Date();
};

// Pre-save middleware to update popularity and calculate total growing time
gourdDataSchema.pre('save', function(next) {
  // Calculate total growing time if individual stages are provided
  if (this.growing?.timeline) {
    const timeline = this.growing.timeline;
    if (!timeline.totalGrowingTime && 
        (timeline.seedToFlower || timeline.flowerToFruit || timeline.fruitToMaturity)) {
      timeline.totalGrowingTime = 
        (timeline.seedToFlower || 0) + 
        (timeline.flowerToFruit || 0) + 
        (timeline.fruitToMaturity || 0);
    }
  }

  next();
});

const GourdData = mongoose.model('GourdData', gourdDataSchema);

module.exports = GourdData;