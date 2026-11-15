import { Link } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Switch, Text, View } from 'react-native';

import { strings } from '@/strings';
import { useSettings, type BooleanSetting, type ThemePreference } from '@/store/settings';
import { Screen } from '@/ui/Screen';
import { colors, fonts, layout, type } from '@/ui/theme';

const toggles: { key: BooleanSetting; label: string }[] = [
  { key: 'mistakeLimit', label: strings.settings.mistakeLimit },
  { key: 'highlightPeers', label: strings.settings.highlightPeers },
  { key: 'highlightSameDigit', label: strings.settings.highlightSameDigit },
  { key: 'sounds', label: strings.settings.sounds },
  { key: 'haptics', label: strings.settings.haptics },
];

const themes: { value: ThemePreference; label: string }[] = [
  { value: 'light', label: strings.settings.themeLight },
  { value: 'dark', label: strings.settings.themeDark },
  { value: 'system', label: strings.settings.themeSystem },
];

function ToggleRow({ setting, label }: { setting: BooleanSetting; label: string }) {
  const value = useSettings((s) => s[setting]);
  const toggle = useSettings((s) => s.toggle);
  return (
    <View style={styles.row}>
      <Text style={styles.rowLabel}>{label}</Text>
      <Switch
        value={value}
        onValueChange={() => toggle(setting)}
        accessibilityLabel={label}
        trackColor={{ false: colors.rule, true: colors.accent }}
        thumbColor={colors.sheet}
        ios_backgroundColor={colors.rule}
      />
    </View>
  );
}

function ThemePicker() {
  const theme = useSettings((s) => s.theme);
  const setTheme = useSettings((s) => s.setTheme);
  return (
    <View style={styles.row}>
      <Text style={styles.rowLabel}>{strings.settings.theme}</Text>
      <View style={styles.segments}>
        {themes.map(({ value, label }) => {
          const selected = value === theme;
          return (
            <Pressable
              key={value}
              onPress={() => setTheme(value)}
              accessibilityRole="button"
              accessibilityState={{ selected }}
              style={[styles.segment, selected && styles.segmentSelected]}
            >
              <Text style={[styles.segmentText, selected && styles.segmentTextSelected]}>
                {label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

export default function SettingsScreen() {
  return (
    <Screen>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={type.title}>{strings.screens.settings}</Text>

        <Text style={[type.label, styles.section]}>{strings.settings.sectionGame}</Text>
        <View style={styles.group}>
          {toggles.map(({ key, label }) => (
            <ToggleRow key={key} setting={key} label={label} />
          ))}
        </View>

        <Text style={[type.label, styles.section]}>{strings.settings.sectionAppearance}</Text>
        <View style={styles.group}>
          <ThemePicker />
        </View>

        <Link href="/" dismissTo style={[type.button, styles.back]}>
          {strings.common.back}
        </Link>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: { paddingBottom: 32 },
  section: { marginTop: 28, marginBottom: 8 },
  group: { borderTopWidth: 1, borderTopColor: colors.rule },
  row: {
    minHeight: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.rule,
  },
  rowLabel: { flex: 1, fontFamily: fonts.sans, fontSize: 15, color: colors.ink },
  segments: { flexDirection: 'row' },
  segment: {
    minHeight: layout.touchTarget,
    justifyContent: 'center',
    paddingHorizontal: 12,
    borderWidth: layout.border,
    borderColor: colors.ink,
    marginLeft: -layout.border,
    backgroundColor: colors.sheet,
  },
  segmentSelected: { backgroundColor: colors.ink },
  segmentText: { fontFamily: fonts.sansMedium, fontSize: 13, color: colors.ink },
  segmentTextSelected: { color: colors.sheet },
  back: {
    marginTop: 32,
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
