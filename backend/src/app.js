const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');

// Import configurations
const database = require('./config/database');
const { configureCloudinary } = require('./config/cloudinary');

class App {
  constructor() {
    this.app = express();
    this.configureMiddleware();
    this.configureRoutes();
    this.configureErrorHandling();
  }

  configureMiddleware() {
    // Security middleware
    this.app.use(helmet({
      crossOriginResourcePolicy: { policy: "cross-origin" }
    }));

    // CORS configuration
    const corsOptions = {
      origin: process.env.CORS_ORIGIN?.split(',') || [
        'http://localhost:3000',
        'http://192.168.1.66:3000',
        'http://localhost:19006', // Expo dev server
        'http://192.168.1.66:19006', // Expo dev server with IP
      ],
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
      credentials: true,
      optionsSuccessStatus: 200
    };
    
    // For development, allow all origins from React Native
    if (process.env.NODE_ENV === 'development') {
      corsOptions.origin = true; // Allow all origins in development
    }
    
    this.app.use(cors(corsOptions));

    // Logging middleware
    if (process.env.NODE_ENV === 'development') {
      this.app.use(morgan('dev'));
    } else {
      this.app.use(morgan('combined'));
    }

    // Body parsing middleware
    this.app.use(express.json({ 
      limit: process.env.MAX_FILE_SIZE || '5mb' 
    }));
    this.app.use(express.urlencoded({ 
      extended: true, 
      limit: process.env.MAX_FILE_SIZE || '5mb' 
    }));

    // Serve static files
    this.app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

    // Request timestamp middleware
    this.app.use((req, res, next) => {
      req.requestTime = new Date().toISOString();
      next();
    });

    console.log('⚙️  Middleware configured successfully');
  }

  configureRoutes() {
    // Health check endpoint
    this.app.get('/api/health', async (req, res) => {
      try {
        const dbHealth = await database.healthCheck();
        const health = {
          status: 'healthy',
          timestamp: new Date().toISOString(),
          environment: process.env.NODE_ENV || 'development',
          database: dbHealth,
          uptime: process.uptime(),
          memory: process.memoryUsage(),
          version: process.version
        };
        
        res.status(200).json(health);
      } catch (error) {
        res.status(500).json({
          status: 'unhealthy',
          timestamp: new Date().toISOString(),
          error: error.message
        });
      }
    });

    // API documentation endpoint
    this.app.get('/api', (req, res) => {
      res.json({
        name: 'Gourd Classification API',
        version: '1.0.0',
        description: 'Backend API for the Gourd Classification mobile application',
        endpoints: {
          health: '/api/health',
          auth: '/api/auth',
          users: '/api/users',
          scans: '/api/scans',
          uploads: '/api/uploads'
        },
        documentation: '/api/docs'
      });
    });

    // Import and use route modules
    this.app.use('/api/auth/firebase', require('./routes/firebaseAuth'));
    // TODO: Add these when other route modules are created
    // this.app.use('/api/auth', require('./routes/auth'));
    // this.app.use('/api/users', require('./routes/users'));
    // this.app.use('/api/scans', require('./routes/scans'));
    // this.app.use('/api/uploads', require('./routes/uploads'));

    // Catch-all route for undefined endpoints
    this.app.use((req, res) => {
      res.status(404).json({
        status: 'error',
        message: `Route ${req.originalUrl} not found`,
        timestamp: new Date().toISOString()
      });
    });

    console.log('🛣️  Routes configured successfully');
  }

  configureErrorHandling() {
    // Global error handling middleware
    this.app.use((err, req, res, next) => {
      // Log error
      console.error('❌ Error:', err.stack);

      // Handle different error types
      let error = { ...err };
      error.message = err.message;

      // Mongoose bad ObjectId
      if (err.name === 'CastError') {
        const message = 'Invalid ID format';
        error = { message, statusCode: 400 };
      }

      // Mongoose duplicate key
      if (err.code === 11000) {
        const message = 'Duplicate field value entered';
        error = { message, statusCode: 400 };
      }

      // Mongoose validation error
      if (err.name === 'ValidationError') {
        const message = Object.values(err.errors).map(val => val.message).join(', ');
        error = { message, statusCode: 400 };
      }

      // JWT errors
      if (err.name === 'JsonWebTokenError') {
        const message = 'Invalid token';
        error = { message, statusCode: 401 };
      }

      if (err.name === 'TokenExpiredError') {
        const message = 'Token expired';
        error = { message, statusCode: 401 };
      }

      // Send error response
      res.status(error.statusCode || 500).json({
        status: 'error',
        message: error.message || 'Internal server error',
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
        timestamp: new Date().toISOString()
      });
    });

    console.log('🛡️  Error handling configured successfully');
  }

  async initialize() {
    try {
      // Connect to database
      await database.connect();
      
      // Configure Cloudinary
      configureCloudinary();

      console.log('🚀 Application initialized successfully');
      return this.app;
    } catch (error) {
      console.error('❌ Application initialization failed:', error);
      throw error;
    }
  }

  getApp() {
    return this.app;
  }
}

module.exports = App;