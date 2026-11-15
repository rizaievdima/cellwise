import { Link } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import { strings } from '@/strings';
import { Screen } from '@/ui/Screen';
import { colors, layout, type } from '@/ui/theme';

export default function HomeScreen() {
  return (
    <Screen>
      <Text style={type.display}>{strings.appName}</Text>
      <Text style={[type.body, styles.tagline]}>{strings.tagline}</Text>
      <View style={styles.doubleRule} accessibilityElementsHidden importantForAccessibility="no">
        <View style={styles.ruleThick} />
        <View style={styles.ruleThin} />
      </View>
      <View style={styles.links}>
        <Link href="/game" style={[type.item, styles.link]}>
          {strings.home.newGame}
        </Link>
        <Link href="/stats" style={[type.item, styles.link]}>
          {strings.home.stats}
        </Link>
        <Link href="/settings" style={[type.item, styles.link]}>
          {strings.home.settings}
        </Link>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  tagline: { marginTop: 6 },
  doubleRule: { marginTop: 16, gap: 3 },
  ruleThick: { height: 2, backgroundColor: colors.ink },
  ruleThin: { height: 1, backgroundColor: colors.ink },
  links: { marginTop: 24, borderTopWidth: 1, borderTopColor: colors.rule },
  link: {
    minHeight: layout.touchTarget,
    paddingVertical: 18,
    borderBottomWidth: 1,
    borderBottomColor: colors.rule,
  },
});
