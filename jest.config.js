const alias = { '^@/(.*)$': '<rootDir>/src/$1' };

/** @type {import('jest').Config} */
module.exports = {
  projects: [
    {
      // Pure TypeScript (engine, generator): plain Node, no React Native preset.
      displayName: 'node',
      testEnvironment: 'node',
      testMatch: ['<rootDir>/src/engine/**/*.test.ts', '<rootDir>/tools/**/*.test.ts'],
      transform: { '^.+\\.ts$': ['babel-jest', { presets: ['babel-preset-expo'] }] },
      moduleNameMapper: alias,
    },
    {
      displayName: 'app',
      preset: 'jest-expo',
      testMatch: ['<rootDir>/{app,src}/**/*.test.{ts,tsx}'],
      testPathIgnorePatterns: ['/node_modules/', '<rootDir>/src/engine/'],
      transformIgnorePatterns: [
        'node_modules/(?!((jest-)?react-native|@react-native(-community)?)|expo(nent)?|@expo(nent)?/.*|@expo-google-fonts/.*|react-navigation|@react-navigation/.*|@sentry/react-native|native-base|react-native-svg)',
      ],
      moduleNameMapper: alias,
    },
  ],
};
