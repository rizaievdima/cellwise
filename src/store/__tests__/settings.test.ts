import { defaultSettings, useSettings } from '../settings';
import { getStorage } from '../storage';

function stored() {
  const raw = getStorage().getString('settings');
  return raw ? JSON.parse(raw) : undefined;
}

beforeEach(() => {
  useSettings.getState().reset();
});

describe('settings store', () => {
  it('starts with the defaults', () => {
    const { mistakeLimit, highlightPeers, highlightSameDigit, sounds, haptics, theme } =
      useSettings.getState();
    expect({ mistakeLimit, highlightPeers, highlightSameDigit, sounds, haptics, theme }).toEqual(
      defaultSettings,
    );
  });

  it('toggles a setting and writes it to MMKV', () => {
    useSettings.getState().toggle('mistakeLimit');
    expect(useSettings.getState().mistakeLimit).toBe(false);
    expect(stored()).toEqual({
      state: { ...defaultSettings, mistakeLimit: false },
      version: 1,
    });
  });

  it('persists only data, not actions', () => {
    useSettings.getState().setTheme('dark');
    expect(Object.keys(stored().state).sort()).toEqual(Object.keys(defaultSettings).sort());
  });

  it('restores saved settings on rehydrate (app restart)', async () => {
    getStorage().set(
      'settings',
      JSON.stringify({
        state: { ...defaultSettings, haptics: false, theme: 'system' },
        version: 1,
      }),
    );
    await useSettings.persist.rehydrate();
    expect(useSettings.getState().haptics).toBe(false);
    expect(useSettings.getState().theme).toBe('system');
  });
});
