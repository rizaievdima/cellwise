// Nitro has no native module under Jest. react-native-mmkv switches to its in-memory
// mock when it detects Jest, so only the Nitro import needs stubbing.
jest.mock('react-native-nitro-modules', () => ({
  NitroModules: {
    createHybridObject: () => {
      throw new Error('Nitro hybrid objects are not available in Jest');
    },
  },
}));
