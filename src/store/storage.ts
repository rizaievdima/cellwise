import { createMMKV, type MMKV } from 'react-native-mmkv';
import { createJSONStorage, type StateStorage } from 'zustand/middleware';

let instance: MMKV | undefined;

/** The app's single MMKV instance, created on first use. */
export function getStorage(): MMKV {
  instance ??= createMMKV({ id: 'cellwise' });
  return instance;
}

const mmkvStateStorage: StateStorage = {
  getItem: (name) => getStorage().getString(name) ?? null,
  setItem: (name, value) => getStorage().set(name, value),
  removeItem: (name) => {
    getStorage().remove(name);
  },
};

/** JSON storage for Zustand `persist`, backed by MMKV (synchronous, so stores hydrate on creation). */
export const persistStorage = createJSONStorage(() => mmkvStateStorage);
