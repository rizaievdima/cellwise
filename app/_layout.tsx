import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { View } from 'react-native';

import { fontSources } from '@/ui/fonts';
import { colors } from '@/ui/theme';

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts(fontSources);

  if (!fontsLoaded && !fontError) {
    return <View style={{ flex: 1, backgroundColor: colors.paper }} />;
  }

  return (
    <>
      <StatusBar style="dark" />
      <Stack
        screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.paper } }}
      />
    </>
  );
}
