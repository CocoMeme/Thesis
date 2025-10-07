/**
 * Test script for Google OAuth authentication
 * This script helps verify that your Google OAuth setup is working correctly
 */

const fetch = require('node-fetch');

const BACKEND_URL = 'http://localhost:5000/api';

// Test data for demo mode
const mockGoogleUser = {
  id: 'demo_' + Date.now(),
  email: 'test@gourdscanner.com',
  name: 'Test User',
  firstName: 'Test',
  lastName: 'User',
  picture: 'https://via.placeholder.com/150/4CAF50/FFFFFF?text=TU',
};

/**
 * Test Google OAuth authentication endpoint
 */
async function testGoogleAuth() {
  console.log('🧪 Testing Google OAuth authentication...\n');

  try {
    // Test 1: Demo mode authentication
    console.log('📋 Test 1: Demo Mode Authentication');
    const demoResponse = await fetch(`${BACKEND_URL}/auth/google`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        demoUser: mockGoogleUser,
      }),
    });

    const demoData = await demoResponse.json();
    
    if (demoResponse.ok && demoData.success) {
      console.log('✅ Demo authentication successful');
      console.log(`   User: ${demoData.user.email}`);
      console.log(`   Token: ${demoData.token.substring(0, 20)}...`);
      
      // Test user profile endpoint
      const profileResponse = await fetch(`${BACKEND_URL}/auth/me`, {
        headers: {
          'Authorization': `Bearer ${demoData.token}`,
        },
      });

      const profileData = await profileResponse.json();
      if (profileResponse.ok && profileData.success) {
        console.log('✅ Profile retrieval successful');
        console.log(`   Profile: ${profileData.user.firstName} ${profileData.user.lastName}`);
      } else {
        console.log('❌ Profile retrieval failed:', profileData.message);
      }

    } else {
      console.log('❌ Demo authentication failed:', demoData.message);
    }

    console.log('\n' + '='.repeat(50) + '\n');

    // Test 2: Invalid token handling
    console.log('📋 Test 2: Invalid Token Handling');
    const invalidResponse = await fetch(`${BACKEND_URL}/auth/google`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        idToken: 'invalid_token_12345',
      }),
    });

    const invalidData = await invalidResponse.json();
    
    if (!invalidResponse.ok && !invalidData.success) {
      console.log('✅ Invalid token properly rejected');
      console.log(`   Error: ${invalidData.message}`);
    } else {
      console.log('❌ Invalid token was accepted (this should not happen)');
    }

    console.log('\n' + '='.repeat(50) + '\n');

    // Test 3: Health check
    console.log('📋 Test 3: Backend Health Check');
    const healthResponse = await fetch(`${BACKEND_URL}/health`);
    const healthData = await healthResponse.json();
    
    if (healthResponse.ok && healthData.status === 'healthy') {
      console.log('✅ Backend is healthy');
      console.log(`   Database: ${healthData.database?.status || 'unknown'}`);
      console.log(`   Environment: ${healthData.environment}`);
    } else {
      console.log('❌ Backend health check failed');
    }

  } catch (error) {
    console.error('❌ Test failed with error:', error.message);
    console.log('\n💡 Make sure your backend server is running on http://localhost:5000');
  }
}

/**
 * Test local authentication endpoints
 */
async function testLocalAuth() {
  console.log('\n🧪 Testing Local Authentication...\n');

  const testUser = {
    firstName: 'Test',
    lastName: 'User',
    email: 'test@example.com',
    password: 'password123',
  };

  try {
    // Test 1: User registration
    console.log('📋 Test 1: User Registration');
    const registerResponse = await fetch(`${BACKEND_URL}/auth/local/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testUser),
    });

    const registerData = await registerResponse.json();
    
    if (registerResponse.ok && registerData.success) {
      console.log('✅ Registration successful');
      console.log(`   User: ${registerData.user.email}`);
      
      // Test 2: User login
      console.log('\n📋 Test 2: User Login');
      const loginResponse = await fetch(`${BACKEND_URL}/auth/local/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: testUser.email,
          password: testUser.password,
        }),
      });

      const loginData = await loginResponse.json();
      
      if (loginResponse.ok && loginData.success) {
        console.log('✅ Login successful');
        console.log(`   Token: ${loginData.token.substring(0, 20)}...`);
      } else {
        console.log('❌ Login failed:', loginData.message);
      }

    } else if (registerResponse.status === 409) {
      console.log('ℹ️  User already exists - this is expected if you ran the test before');
    } else {
      console.log('❌ Registration failed:', registerData.message);
    }

  } catch (error) {
    console.error('❌ Local auth test failed:', error.message);
  }
}

/**
 * Main test runner
 */
async function runTests() {
  console.log('🚀 Gourd Scanner Authentication Tests');
  console.log('=====================================\n');

  await testGoogleAuth();
  await testLocalAuth();

  console.log('\n🎉 Tests completed!');
  console.log('\n📚 Next Steps:');
  console.log('1. If demo mode works, your backend is properly configured');
  console.log('2. To enable real Google OAuth, follow docs/google-oauth-complete-setup.md');
  console.log('3. Test the mobile app with both local and Google authentication');
}

// Run tests if script is executed directly
if (require.main === module) {
  runTests().catch(console.error);
}

module.exports = {
  testGoogleAuth,
  testLocalAuth,
  runTests,
};