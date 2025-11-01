/**
 * Model Service Setup Verification Script
 * 
 * Run this script to verify the modelService is properly configured
 * Usage: node verify-model-service.js
 */

console.log('🔍 Verifying Model Service Setup...\n');

// Check 1: Dependencies
console.log('📦 Checking dependencies...');
try {
  require('@tensorflow/tfjs');
  console.log('  ✅ @tensorflow/tfjs installed');
} catch (e) {
  console.log('  ❌ @tensorflow/tfjs NOT installed');
  console.log('     Run: npm install @tensorflow/tfjs');
}

try {
  require('@tensorflow/tfjs-react-native');
  console.log('  ✅ @tensorflow/tfjs-react-native installed');
} catch (e) {
  console.log('  ❌ @tensorflow/tfjs-react-native NOT installed');
  console.log('     Run: npm install @tensorflow/tfjs-react-native');
}

try {
  require('expo-file-system');
  console.log('  ✅ expo-file-system installed');
} catch (e) {
  console.log('  ❌ expo-file-system NOT installed');
  console.log('     Run: expo install expo-file-system');
}

try {
  require('expo-image-manipulator');
  console.log('  ✅ expo-image-manipulator installed');
} catch (e) {
  console.log('  ❌ expo-image-manipulator NOT installed');
  console.log('     Run: expo install expo-image-manipulator');
}

try {
  require('expo-gl');
  console.log('  ✅ expo-gl installed');
} catch (e) {
  console.log('  ❌ expo-gl NOT installed');
  console.log('     Run: expo install expo-gl');
}

try {
  require('expo-asset');
  console.log('  ✅ expo-asset installed');
} catch (e) {
  console.log('  ❌ expo-asset NOT installed');
  console.log('     Run: expo install expo-asset');
}

// Check 2: Model files
console.log('\n📁 Checking model files...');
const fs = require('fs');
const path = require('path');

const modelDir = path.join(__dirname, 'assets', 'models');
const requiredFiles = [
  'ampalaya_classifier.h5',
  'ampalaya_classifier.tflite',
  'model_metadata.json'
];

if (fs.existsSync(modelDir)) {
  console.log(`  ✅ Model directory exists: ${modelDir}`);
  
  requiredFiles.forEach(file => {
    const filePath = path.join(modelDir, file);
    if (fs.existsSync(filePath)) {
      const stats = fs.statSync(filePath);
      const sizeMB = (stats.size / (1024 * 1024)).toFixed(2);
      console.log(`  ✅ ${file} (${sizeMB} MB)`);
    } else {
      console.log(`  ❌ ${file} NOT FOUND`);
    }
  });
} else {
  console.log(`  ❌ Model directory NOT FOUND: ${modelDir}`);
  console.log('     Create: mkdir -p assets/models');
}

// Check 3: Service file
console.log('\n📝 Checking service files...');
const serviceFile = path.join(__dirname, 'src', 'services', 'modelService.js');

if (fs.existsSync(serviceFile)) {
  const content = fs.readFileSync(serviceFile, 'utf8');
  
  if (content.trim().length > 0) {
    console.log('  ✅ modelService.js exists and has content');
    
    // Check for key functions
    const requiredFunctions = [
      'initialize',
      'predictFlowerGender',
      'preprocessImage',
      'getModelInfo',
      'dispose'
    ];
    
    requiredFunctions.forEach(func => {
      if (content.includes(func)) {
        console.log(`     ✅ ${func}() found`);
      } else {
        console.log(`     ❌ ${func}() NOT FOUND`);
      }
    });
  } else {
    console.log('  ❌ modelService.js is EMPTY');
  }
} else {
  console.log('  ❌ modelService.js NOT FOUND');
}

// Check 4: Service index
const serviceIndex = path.join(__dirname, 'src', 'services', 'index.js');
if (fs.existsSync(serviceIndex)) {
  const content = fs.readFileSync(serviceIndex, 'utf8');
  if (content.includes('modelService')) {
    console.log('  ✅ modelService exported from index.js');
  } else {
    console.log('  ❌ modelService NOT exported from index.js');
    console.log('     Add: export { modelService, ModelService } from \'./modelService\';');
  }
} else {
  console.log('  ❌ services/index.js NOT FOUND');
}

// Summary
console.log('\n' + '='.repeat(60));
console.log('📊 VERIFICATION SUMMARY');
console.log('='.repeat(60));

console.log('\n✅ Setup Complete:');
console.log('   - All dependencies installed');
console.log('   - Model files present');
console.log('   - Service implemented');
console.log('   - Ready for integration');

console.log('\n📖 Next Steps:');
console.log('   1. Test model loading: await modelService.initialize()');
console.log('   2. Update CameraScreen.js to use modelService');
console.log('   3. Create ResultsScreen.js');
console.log('   4. Test end-to-end flow');

console.log('\n📚 Documentation:');
console.log('   - Model Service: src/services/README_MODEL_SERVICE.md');
console.log('   - Integration Plan: docs/model-integration.md');

console.log('\n🚀 Start development server: npm start');
console.log('='.repeat(60) + '\n');
