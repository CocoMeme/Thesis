const { getDefaultConfig } = require('expo/metro-config');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

// Ensure fonts are properly resolved
config.resolver.assetExts.push('ttf', 'otf', 'woff', 'woff2');

module.exports = config;