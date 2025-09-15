// Google OAuth Configuration Status Check
// This file helps you verify your Google Sign-In setup

import { googleAuthService } from './googleAuthService';

export const checkGoogleAuthConfiguration = () => {
  const clientIds = {
    android: googleAuthService.clientId.android,
    ios: googleAuthService.clientId.ios,
    web: googleAuthService.clientId.web,
  };

  const isConfigured = !Object.values(clientIds).some(id => id.includes('YOUR_'));
  
  console.log('🔍 Google OAuth Configuration Status:');
  console.log('Android Client ID:', clientIds.android.includes('YOUR_') ? '❌ Not configured' : '✅ Configured');
  console.log('iOS Client ID:', clientIds.ios.includes('YOUR_') ? '❌ Not configured' : '✅ Configured');
  console.log('Web Client ID:', clientIds.web.includes('YOUR_') ? '❌ Not configured' : '✅ Configured');
  
  if (!isConfigured) {
    console.log('\n📋 To enable Google Sign-In:');
    console.log('1. Set up Google OAuth in Firebase Console');
    console.log('2. Get client IDs from Google Cloud Console');
    console.log('3. Update googleAuthService.js with real client IDs');
    console.log('4. See docs/google-auth-setup.md for detailed steps');
  }
  
  return isConfigured;
};

// For development/testing purposes
export const mockGoogleSignIn = async () => {
  return {
    success: false,
    error: 'Google Sign-In requires configuration. Please follow the setup guide in docs/google-auth-setup.md'
  };
};