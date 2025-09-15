const mongoose = require('mongoose');
require('dotenv').config();

async function fixUsernameIndex() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log('Connected to MongoDB');
    
    const db = mongoose.connection.db;
    const collection = db.collection('users');
    
    // Check existing indexes
    console.log('Existing indexes:');
    const indexes = await collection.indexes();
    console.log(JSON.stringify(indexes, null, 2));
    
    // Drop the existing username index if it exists
    try {
      await collection.dropIndex('username_1');
      console.log('Dropped existing username_1 index');
    } catch (error) {
      console.log('No existing username_1 index to drop (this is fine):', error.message);
    }
    
    // Create a proper sparse unique index on username
    await collection.createIndex(
      { username: 1 }, 
      { 
        unique: true, 
        sparse: true,  // This allows multiple documents with null/undefined username
        background: true 
      }
    );
    console.log('Created new sparse unique index on username');
    
    // Check users with null usernames
    const usersWithNullUsername = await collection.find({ username: null }).toArray();
    console.log(`Found ${usersWithNullUsername.length} users with null username`);
    
    // Remove null username fields from existing documents
    if (usersWithNullUsername.length > 0) {
      const result = await collection.updateMany(
        { username: null },
        { $unset: { username: "" } }
      );
      console.log(`Updated ${result.modifiedCount} documents to remove null username`);
    }
    
    console.log('Database fix completed successfully!');
    
  } catch (error) {
    console.error('Error fixing database:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

fixUsernameIndex();