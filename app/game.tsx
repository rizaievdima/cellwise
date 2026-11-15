import { Link } from 'expo-router';
import { StyleSheet, Text } from 'react-native';

import { strings } from '@/strings';
import { Screen } from '@/ui/Screen';
import { colors, layout, type } from '@/ui/theme';

export default function GameScreen() {
  return (
    <Screen>
      <Text style={type.title}>{strings.screens.game}</Text>
      <Text style={[type.body, styles.body]}>{strings.common.comingSoon}</Text>
      <Link href="/" dismissTo style={[type.button, styles.link]}>
        {strings.common.back}
      </Link>
    </Screen>
  );
}

const styles = StyleSheet.create({
  body: { marginTop: 8 },
  link: {
    marginTop: 24,
    alignSelf: 'flex-start',
    minHeight: layout.touchTarget,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderWidth: layout.border,
    borderColor: colors.ink,
    borderRadius: layout.radius,
    backgroundColor: colors.sheet,
    color: colors.accent,
  },
});
