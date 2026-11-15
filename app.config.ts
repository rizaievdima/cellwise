import type { ExpoConfig } from 'expo/config';

const BUNDLE_ID = 'app.sudokucell.cellwise';

/**
 * EAS project id. `eas init` cannot write to a dynamic config, so paste the id it prints here
 * (it is not a secret). Can also come from the EAS_PROJECT_ID env var.
 */
const EAS_PROJECT_ID: string | undefined = process.env.EAS_PROJECT_ID;

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
  ...(EAS_PROJECT_ID ? { extra: { eas: { projectId: EAS_PROJECT_ID } } } : {}),
};

export default config;
