import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import { persistStorage } from './storage';

export type ThemePreference = 'light' | 'dark' | 'system';

export interface Settings {
  /** End the game after 3 mistakes. */
  mistakeLimit: boolean;
  /** Highlight the row, column and box of the selected cell. */
  highlightPeers: boolean;
  /** Highlight cells that hold the same digit as the selected cell. */
  highlightSameDigit: boolean;
  sounds: boolean;
  haptics: boolean;
  theme: ThemePreference;
}

export type BooleanSetting = {
  [K in keyof Settings]: Settings[K] extends boolean ? K : never;
}[keyof Settings];

interface SettingsActions {
  toggle: (key: BooleanSetting) => void;
  setTheme: (theme: ThemePreference) => void;
  reset: () => void;
}

export type SettingsStore = Settings & SettingsActions;

/** Defaults follow docs/design/Settings.dc.html. */
export const defaultSettings: Settings = {
  mistakeLimit: true,
  highlightPeers: true,
  highlightSameDigit: true,
  sounds: false,
  haptics: true,
  theme: 'light',
};

export const useSettings = create<SettingsStore>()(
  persist(
    (set) => ({
      ...defaultSettings,
      toggle: (key) => set((state) => ({ [key]: !state[key] })),
      setTheme: (theme) => set({ theme }),
      reset: () => set(defaultSettings),
    }),
    {
      name: 'settings',
      version: 1,
      storage: persistStorage,
      partialize: ({
        mistakeLimit,
        highlightPeers,
        highlightSameDigit,
        sounds,
        haptics,
        theme,
      }) => ({
        mistakeLimit,
        highlightPeers,
        highlightSameDigit,
        sounds,
        haptics,
        theme,
      }),
    },
  ),
);
