// https://docs.expo.dev/guides/using-eslint/
const { defineConfig } = require('eslint/config');
const expoConfig = require('eslint-config-expo/flat');
const eslintPluginPrettierRecommended = require('eslint-plugin-prettier/recommended');

module.exports = defineConfig([
  expoConfig,
  eslintPluginPrettierRecommended,
  {
    // The engine and the generator stay pure TypeScript so they run in plain Node.
    files: ['src/engine/**', 'tools/**'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['react', 'react-*', 'react/*'],
              message: 'Engine code must not import React.',
            },
            { group: ['expo', 'expo-*', '@expo/*'], message: 'Engine code must not import Expo.' },
            { group: ['@/*'], message: 'Use relative imports so plain Node can resolve them.' },
          ],
        },
      ],
    },
  },
  {
    ignores: ['dist/*', 'coverage/*', '.expo/*', 'ios/*', 'android/*'],
  },
]);
