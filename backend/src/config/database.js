const mongoose = require('mongoose');

class Database {
  constructor() {
    this.connection = null;
  }

  async connect() {
    try {
      const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/gourd_classification_db';
      
      // MongoDB connection options
      const options = {
        maxPoolSize: 10, // Maintain up to 10 socket connections
        serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
        socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
        family: 4 // Use IPv4, skip trying IPv6
      };

      this.connection = await mongoose.connect(mongoUri, options);

      console.log('✅ MongoDB Connected Successfully');
      console.log(`📊 Database: ${this.connection.connection.name}`);
      console.log(`🌐 Host: ${this.connection.connection.host}:${this.connection.connection.port}`);

      // Handle connection events
      mongoose.connection.on('error', (err) => {
        console.error('❌ MongoDB connection error:', err);
      });

      mongoose.connection.on('disconnected', () => {
        console.log('⚠️  MongoDB disconnected');
      });

      mongoose.connection.on('reconnected', () => {
        console.log('🔄 MongoDB reconnected');
      });

      // Graceful shutdown
      process.on('SIGINT', async () => {
        await this.disconnect();
        process.exit(0);
      });

      return this.connection;
    } catch (error) {
      console.error('❌ MongoDB connection failed:', error.message);
      process.exit(1);
    }
  }

  async disconnect() {
    try {
      if (this.connection) {
        await mongoose.connection.close();
        console.log('🔌 MongoDB connection closed');
      }
    } catch (error) {
      console.error('❌ Error closing MongoDB connection:', error.message);
    }
  }

  getConnectionState() {
    const states = {
      0: 'disconnected',
      1: 'connected',
      2: 'connecting',
      3: 'disconnecting'
    };
    return states[mongoose.connection.readyState];
  }

  async healthCheck() {
    try {
      const state = this.getConnectionState();
      if (state === 'connected') {
        // Test the connection
        await mongoose.connection.db.admin().ping();
        return {
          status: 'healthy',
          state: state,
          database: mongoose.connection.name,
          host: mongoose.connection.host,
          port: mongoose.connection.port
        };
      } else {
        return {
          status: 'unhealthy',
          state: state
        };
      }
    } catch (error) {
      return {
        status: 'error',
        error: error.message
      };
    }
  }
}

// Create singleton instance
const database = new Database();

module.exports = database;