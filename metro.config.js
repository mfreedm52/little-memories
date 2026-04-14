// Learn more https://docs.expo.io/guides/customizing-metro
const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

// react-native-calendars depends on xdate, which Metro fails to resolve
// from its package.json "main" field. We point it to the file directly.
config.resolver.extraNodeModules = {
  ...config.resolver.extraNodeModules,
  xdate: path.resolve(__dirname, 'node_modules/xdate/src/xdate.js'),
};

module.exports = config;
