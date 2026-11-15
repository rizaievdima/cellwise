import type { TextStyle } from 'react-native';

/**
 * Paper-style design tokens (see CLAUDE.md → Design).
 * The dark theme will provide the same keys with different values.
 */
export const colors = {
  /** Background (the mockups add a subtle dot grain on top). */
  paper: '#F5F1E8',
  /** Sheets, cells, keys. */
  sheet: '#FBF8F1',
  /** Text, thick grid lines, borders. */
  ink: '#1F1D1A',
  /** Secondary text, notes. */
  graphite: '#5E5850',
  /** Thin grid lines, dividers. */
  rule: '#CBBFA8',
  /** User digits, primary buttons. */
  accent: '#2B4C8C',
  /** Mistakes (red pencil, wavy underline). */
  error: '#A8372B',
  highlightSelected: '#E9D58C',
  highlightPeers: '#F1EAD3',
  highlightSameDigit: '#DCE3F0',
  highlightError: '#F2D9D3',
} as const;

export type ColorToken = keyof typeof colors;
export type Palette = Record<ColorToken, string>;

/**
 * Font family names. Custom fonts on Android ignore `fontWeight`,
 * so every weight is its own family. Keys of `fontSources` match these names.
 */
export const fonts = {
  serif: 'Literata_400Regular',
  serifMedium: 'Literata_500Medium',
  serifSemiBold: 'Literata_600SemiBold',
  serifBold: 'Literata_700Bold',
  sans: 'Inter_400Regular',
  sansMedium: 'Inter_500Medium',
  sansSemiBold: 'Inter_600SemiBold',
} as const;

export const layout = {
  radius: 4,
  border: 1.5,
  gridThick: 2,
  gridThin: 1,
  touchTarget: 44,
  screenPadding: 24,
} as const;

/** Type scale taken from the mockups in docs/design. */
export const type = {
  display: { fontFamily: fonts.serifSemiBold, fontSize: 40, lineHeight: 44, color: colors.ink },
  title: { fontFamily: fonts.serifSemiBold, fontSize: 28, lineHeight: 34, color: colors.ink },
  heading: { fontFamily: fonts.serifSemiBold, fontSize: 20, lineHeight: 26, color: colors.ink },
  item: { fontFamily: fonts.serifSemiBold, fontSize: 19, lineHeight: 24, color: colors.ink },
  body: { fontFamily: fonts.sans, fontSize: 14, lineHeight: 20, color: colors.graphite },
  caption: { fontFamily: fonts.sans, fontSize: 13, lineHeight: 18, color: colors.graphite },
  label: {
    fontFamily: fonts.sansSemiBold,
    fontSize: 12,
    lineHeight: 16,
    letterSpacing: 1.44,
    textTransform: 'uppercase',
    color: colors.graphite,
  },
  button: { fontFamily: fonts.sansSemiBold, fontSize: 15, lineHeight: 20, color: colors.ink },
} as const satisfies Record<string, TextStyle>;
