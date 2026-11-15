const path = require('node:path');

const alias = { '^@/(.*)$': '<rootDir>/src/$1' };

// babel-preset-expo is nested under expo/, and babel-jest must be the Jest 30 copy jest-expo uses.
const dirOf = (pkg) => path.dirname(require.resolve(`${pkg}/package.json`));
const babelPresetExpo = require.resolve('babel-preset-expo', { paths: [dirOf('expo')] });
const babelJest = require.resolve('babel-jest', { paths: [dirOf('jest-expo')] });

/** @type {import('jest').Config} */
module.exports = {
  projects: [
    {
      // Pure TypeScript (engine, generator): plain Node, no React Native preset.
      displayName: 'node',
      testEnvironment: 'node',
      testMatch: ['<rootDir>/src/engine/**/*.test.ts', '<rootDir>/tools/**/*.test.ts'],
      transform: {
        '^.+\\.ts$': [babelJest, { presets: [babelPresetExpo], babelrc: false, configFile: false }],
      },
      moduleNameMapper: alias,
    },
    {
      displayName: 'app',
      preset: 'jest-expo',
      setupFiles: ['<rootDir>/jest.setup.app.js'],
      testMatch: ['<rootDir>/{app,src}/**/*.test.{ts,tsx}'],
      testPathIgnorePatterns: ['/node_modules/', '<rootDir>/src/engine/'],
      transformIgnorePatterns: [
        'node_modules/(?!((jest-)?react-native|@react-native(-community)?)|expo(nent)?|@expo(nent)?/.*|@expo-google-fonts/.*|react-navigation|@react-navigation/.*|@sentry/react-native|native-base|react-native-svg|nitro-core)',
      ],
      moduleNameMapper: alias,
    },
  ],
};
