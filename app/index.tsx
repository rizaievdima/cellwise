import { Link } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { strings } from '@/strings';

export default function HomeScreen() {
  return (
    <SafeAreaView style={styles.screen}>
      <Text style={styles.title}>{strings.appName}</Text>
      <Text style={styles.subtitle}>{strings.tagline}</Text>
      <View style={styles.links}>
        <Link href="/game" style={styles.link}>
          {strings.home.newGame}
        </Link>
        <Link href="/stats" style={styles.link}>
          {strings.home.stats}
        </Link>
        <Link href="/settings" style={styles.link}>
          {strings.home.settings}
        </Link>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, paddingHorizontal: 24, paddingTop: 40 },
  title: { fontSize: 40 },
  subtitle: { fontSize: 14, marginTop: 6 },
  links: { marginTop: 32, gap: 8 },
  link: { fontSize: 19, paddingVertical: 12 },
});
