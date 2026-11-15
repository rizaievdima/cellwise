/** All user-facing copy lives here so i18n can be added later. */
export const strings = {
  appName: 'Cellwise',
  tagline: 'Every puzzle solvable by pure logic',
  screens: {
    home: 'Home',
    game: 'Game',
    stats: 'Stats',
    settings: 'Settings',
  },
  home: {
    newGame: 'New game',
    stats: 'Stats',
    settings: 'Settings',
  },
  settings: {
    sectionGame: 'Game',
    mistakeLimit: 'Mistake limit (3)',
    highlightPeers: 'Highlight row, column and box',
    highlightSameDigit: 'Highlight matching digits',
    sounds: 'Sounds',
    haptics: 'Haptics',
    sectionAppearance: 'Appearance',
    theme: 'Theme',
    themeLight: 'Light',
    themeDark: 'Dark',
    themeSystem: 'System',
  },
  common: {
    back: 'Back',
    comingSoon: 'Coming soon',
  },
} as const;
