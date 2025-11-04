const mongoose = require('mongoose');
require('dotenv').config();
const { News } = require('./src/models');

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB connected successfully');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  }
};

// Seed data for the first news
const seedFirstNews = async () => {
  try {
    await connectDB();

    // Check if news already exists
    const existingNews = await News.findOne({ 'version.modelVersion': 'v1.10.30' });
    
    if (existingNews) {
      console.log('ℹ️  First news already exists. Skipping seed.');
      await mongoose.connection.close();
      return;
    }

    // Create the first news about model v1.10.30
    const firstNews = await News.create({
      title: 'First ML Model Release - Ampalaya Bilog v1.10.30',
      description: 'We are excited to announce the release of our first machine learning model version 1.10.30, trained specifically for Ampalaya Bilog (Round Bitter Gourd) detection and classification.',
      body: `# First ML Model Release 🎉

We are thrilled to announce the release of our first machine learning model, **version 1.10.30**!

## Model Details

This initial release focuses on **Ampalaya Bilog** (Round Bitter Gourd) detection and classification. Our team has trained this model using a comprehensive dataset to ensure accurate recognition and analysis.

### Dataset Information
- **Size**: 2.6GB of high-quality images
- **Focus**: Ampalaya Bilog (Round Bitter Gourd)
- **Training Duration**: Extensive training to achieve optimal accuracy
- **Image Variety**: Multiple growth stages, lighting conditions, and angles

## Key Features

✅ **Gourd Detection**: Accurately identify Ampalaya Bilog in images
✅ **Growth Stage Recognition**: Determine the maturity level of the gourd
✅ **Health Assessment**: Detect potential issues or diseases
✅ **Real-time Analysis**: Fast processing on mobile devices

## What This Means for You

With this first model release, you can now:
- Scan your Ampalaya Bilog plants
- Get instant feedback on plant health
- Track growth progress over time
- Receive cultivation recommendations

## Performance

Our model has been rigorously tested and shows excellent performance in real-world conditions. We will continue to improve and expand our model capabilities based on your feedback.

## What's Next?

This is just the beginning! We're already working on:
- Additional gourd varieties
- Enhanced detection accuracy
- More detailed health analysis
- Expanded disease recognition

Thank you for being part of our journey. Your feedback helps us improve!

**Happy Scanning! 🌱**`,
      
      category: 'model_update',
      
      version: {
        modelVersion: 'v1.10.30',
        appVersion: '1.0.0',
        versionNumber: '1.10.30'
      },
      
      metadata: {
        datasetSize: '2.6GB',
        datasetInfo: 'Ampalaya Bilog (Round Bitter Gourd)',
        improvements: [
          'Initial model release',
          'Accurate Ampalaya Bilog detection',
          'Growth stage classification',
          'Basic health assessment',
          'Optimized for mobile devices'
        ],
        technicalDetails: 'YOLOv8 architecture with custom training on 2.6GB Ampalaya Bilog dataset',
        affectedPlatforms: ['iOS', 'Android']
      },
      
      releaseDate: new Date('2024-10-30'),
      
      display: {
        isPinned: true,
        isHighlighted: true,
        showAsPopup: true,
        priority: 10
      },
      
      tags: [
        'model-update',
        'ampalaya',
        'bitter-gourd',
        'first-release',
        'ml-model',
        'v1.10.30'
      ],
      
      status: 'published',
      isPublic: true,
      
      seo: {
        metaTitle: 'First ML Model Release - Ampalaya Bilog v1.10.30',
        metaDescription: 'Introducing our first machine learning model for Ampalaya Bilog detection and classification, trained on 2.6GB of high-quality data.',
        keywords: ['ML model', 'Ampalaya', 'Bitter Gourd', 'Plant Detection', 'Machine Learning']
      }
    });

    console.log('✅ First news seeded successfully!');
    console.log('📰 News Title:', firstNews.title);
    console.log('🆔 News ID:', firstNews._id);
    console.log('📅 Release Date:', firstNews.releaseDate);
    
  } catch (error) {
    console.error('❌ Error seeding news:', error);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 Database connection closed');
  }
};

// Run the seed function
seedFirstNews();
