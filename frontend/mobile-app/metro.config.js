// Learn more https://docs.expo.io/guides/customizing-metro
const { getDefaultConfig } = require('expo/metro-config');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

// Add support for .bin files as assets (TensorFlow.js weights)
config.resolver.assetExts.push('bin');

// Add support for .tflite files as assets (TensorFlow Lite models)
config.resolver.assetExts.push('tflite');

module.exports = config;
