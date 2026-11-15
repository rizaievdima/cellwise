import { strings } from '@/strings';

function leaves(value: unknown): string[] {
  if (typeof value === 'string') return [value];
  return Object.values(value as Record<string, unknown>).flatMap(leaves);
}

describe('strings', () => {
  it('has no empty copy', () => {
    for (const text of leaves(strings)) {
      expect(text.trim()).not.toBe('');
    }
  });
});
