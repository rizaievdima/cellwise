import { fontSources } from '../fonts';
import { colors, fonts } from '../theme';

describe('theme', () => {
  it('uses the paper palette from CLAUDE.md', () => {
    expect(colors).toMatchObject({
      paper: '#F5F1E8',
      sheet: '#FBF8F1',
      ink: '#1F1D1A',
      graphite: '#5E5850',
      rule: '#CBBFA8',
      accent: '#2B4C8C',
      error: '#A8372B',
      highlightSelected: '#E9D58C',
      highlightPeers: '#F1EAD3',
      highlightSameDigit: '#DCE3F0',
      highlightError: '#F2D9D3',
    });
  });

  it('has a font source for every font family', () => {
    expect(Object.keys(fontSources).sort()).toEqual(Object.values(fonts).sort());
  });
});
