import { Link } from 'expo-router';
import { StyleSheet, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { strings } from '@/strings';

export default function GameScreen() {
  return (
    <SafeAreaView style={styles.screen}>
      <Text style={styles.title}>{strings.screens.game}</Text>
      <Text style={styles.body}>{strings.common.comingSoon}</Text>
      <Link href="/" dismissTo style={styles.link}>
        {strings.common.back}
      </Link>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, paddingHorizontal: 24, paddingTop: 40 },
  title: { fontSize: 28 },
  body: { fontSize: 15, marginTop: 8 },
  link: { fontSize: 17, paddingVertical: 12, marginTop: 24 },
});
