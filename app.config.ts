import type { ExpoConfig } from 'expo/config';

const BUNDLE_ID = 'app.sudokucell.cellwise';

/** EAS project id from `eas init` (not a secret). */
const EAS_PROJECT_ID = 'd4d1c9f6-5441-4c56-afb8-0453f9a4a476';

const config: ExpoConfig = {
  name: 'Cellwise',
  slug: 'cellwise',
  scheme: 'cellwise',
  version: '1.0.0',
  orientation: 'portrait',
  icon: './assets/icon.png',
  userInterfaceStyle: 'light',
  ios: {
    bundleIdentifier: BUNDLE_ID,
    supportsTablet: false,
    config: {
      usesNonExemptEncryption: false,
    },
  },
  android: {
    package: BUNDLE_ID,
    adaptiveIcon: {
      backgroundColor: '#F5F1E8',
      foregroundImage: './assets/android-icon-foreground.png',
      backgroundImage: './assets/android-icon-background.png',
      monochromeImage: './assets/android-icon-monochrome.png',
    },
    predictiveBackGestureEnabled: false,
  },
  plugins: ['expo-router'],
  experiments: {
    typedRoutes: true,
  },
  extra: {
    eas: { projectId: EAS_PROJECT_ID },
  },
};

export default config;
