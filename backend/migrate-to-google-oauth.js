/**
 * Migration script to update User model from Firebase to Google OAuth
 * This script will:
 * 1. Add googleId field based on existing firebaseUid
 * 2. Update provider field from 'firebase' to 'google'
 * 3. Remove firebaseUid field (optional - can be kept for reference)
 */

const mongoose = require('mongoose');
const User = require('../models/User');
require('dotenv').config();

async function migrateUsersToGoogleOAuth() {
  try {
    console.log('🔄 Starting Firebase to Google OAuth migration...');
    
    // Connect to database
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to database');

    // Find all users with firebaseUid
    const usersWithFirebaseUid = await User.find({
      firebaseUid: { $exists: true, $ne: null }
    });

    console.log(`📊 Found ${usersWithFirebaseUid.length} users with Firebase UID`);

    let migratedCount = 0;
    let errors = [];

    for (const user of usersWithFirebaseUid) {
      try {
        // Update user document
        const updateData = {
          googleId: user.firebaseUid, // Copy firebaseUid to googleId
          provider: user.provider === 'firebase' ? 'google' : user.provider
        };

        await User.updateOne(
          { _id: user._id },
          { 
            $set: updateData,
            $unset: { firebaseUid: "" } // Remove firebaseUid field
          }
        );

        migratedCount++;
        console.log(`✅ Migrated user: ${user.email}`);

      } catch (error) {
        errors.push({
          userId: user._id,
          email: user.email,
          error: error.message
        });
        console.error(`❌ Error migrating user ${user.email}:`, error.message);
      }
    }

    console.log('\n📋 Migration Summary:');
    console.log(`   • Total users found: ${usersWithFirebaseUid.length}`);
    console.log(`   • Successfully migrated: ${migratedCount}`);
    console.log(`   • Errors: ${errors.length}`);

    if (errors.length > 0) {
      console.log('\n❌ Errors encountered:');
      errors.forEach(error => {
        console.log(`   • ${error.email}: ${error.error}`);
      });
    }

    console.log('\n✅ Migration completed successfully!');

  } catch (error) {
    console.error('❌ Migration failed:', error);
    throw error;
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from database');
  }
}

// Add a rollback function in case something goes wrong
async function rollbackMigration() {
  try {
    console.log('🔄 Starting rollback migration...');
    
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to database');

    // Find all users with googleId but no firebaseUid
    const usersWithGoogleId = await User.find({
      googleId: { $exists: true, $ne: null },
      firebaseUid: { $exists: false }
    });

    console.log(`📊 Found ${usersWithGoogleId.length} users to rollback`);

    let rollbackCount = 0;

    for (const user of usersWithGoogleId) {
      try {
        await User.updateOne(
          { _id: user._id },
          { 
            $set: {
              firebaseUid: user.googleId,
              provider: user.provider === 'google' ? 'firebase' : user.provider
            },
            $unset: { googleId: "" }
          }
        );

        rollbackCount++;
        console.log(`✅ Rolled back user: ${user.email}`);

      } catch (error) {
        console.error(`❌ Error rolling back user ${user.email}:`, error.message);
      }
    }

    console.log(`\n✅ Rollback completed. ${rollbackCount} users rolled back.`);

  } catch (error) {
    console.error('❌ Rollback failed:', error);
    throw error;
  } finally {
    await mongoose.disconnect();
  }
}

// Command line interface
const command = process.argv[2];

if (command === 'migrate') {
  migrateUsersToGoogleOAuth()
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
} else if (command === 'rollback') {
  rollbackMigration()
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
} else {
  console.log('Usage:');
  console.log('  node migrate-to-google-oauth.js migrate   - Migrate from Firebase to Google OAuth');
  console.log('  node migrate-to-google-oauth.js rollback  - Rollback the migration');
  process.exit(1);
}

module.exports = {
  migrateUsersToGoogleOAuth,
  rollbackMigration
};