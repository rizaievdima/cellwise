import {
  BOXES,
  COLS,
  PEERS,
  ROWS,
  UNITS,
  UNITS_OF,
  bitCount,
  boxOf,
  colOf,
  countDigits,
  createBoard,
  digitBit,
  digitsOf,
  hasDigit,
  indexOf,
  isEntry,
  parseGrid,
  rowOf,
  serializeGrid,
} from '../board';
import { EASY } from './fixtures';

describe('indices', () => {
  it('maps cells to row, column and box', () => {
    expect([rowOf(0), colOf(0), boxOf(0)]).toEqual([0, 0, 0]);
    expect([rowOf(40), colOf(40), boxOf(40)]).toEqual([4, 4, 4]);
    expect([rowOf(80), colOf(80), boxOf(80)]).toEqual([8, 8, 8]);
    expect([rowOf(23), colOf(23), boxOf(23)]).toEqual([2, 5, 1]);
    expect(indexOf(2, 5)).toBe(23);
  });

  it('builds rows, columns and boxes', () => {
    expect(ROWS[1]).toEqual([9, 10, 11, 12, 13, 14, 15, 16, 17]);
    expect(COLS[2]).toEqual([2, 11, 20, 29, 38, 47, 56, 65, 74]);
    expect(BOXES[4]).toEqual([30, 31, 32, 39, 40, 41, 48, 49, 50]);
    expect(UNITS).toHaveLength(27);
    for (const unit of UNITS) expect(new Set(unit).size).toBe(9);
  });

  it('lists the three units of each cell', () => {
    expect(UNITS_OF[23]).toEqual([2, 9 + 5, 18 + 1]);
    for (let i = 0; i < 81; i++) {
      for (const u of UNITS_OF[i]) expect(UNITS[u]).toContain(i);
    }
  });

  it('gives every cell 20 distinct peers, never itself', () => {
    for (let i = 0; i < 81; i++) {
      expect(PEERS[i]).toHaveLength(20);
      expect(PEERS[i]).not.toContain(i);
      for (const j of PEERS[i]) {
        const shares = rowOf(i) === rowOf(j) || colOf(i) === colOf(j) || boxOf(i) === boxOf(j);
        expect(shares).toBe(true);
      }
    }
  });
});

describe('digit masks', () => {
  it('sets, reads and counts digit bits', () => {
    const mask = digitBit(1) | digitBit(5) | digitBit(9);
    expect(hasDigit(mask, 5)).toBe(true);
    expect(hasDigit(mask, 4)).toBe(false);
    expect(digitsOf(mask)).toEqual([1, 5, 9]);
    expect(bitCount(mask)).toBe(3);
    expect(bitCount(0x1ff)).toBe(9);
  });
});

describe('parse / serialize', () => {
  it('round-trips a puzzle string', () => {
    const grid = parseGrid(EASY.puzzle);
    expect(grid).toHaveLength(81);
    expect(grid.slice(0, 9)).toEqual([0, 0, 3, 0, 2, 0, 6, 0, 0]);
    expect(serializeGrid(grid, '0')).toBe(EASY.puzzle);
    expect(serializeGrid(grid)).toBe(EASY.puzzle.replace(/0/g, '.'));
  });

  it('accepts dots for empty cells', () => {
    expect(parseGrid(EASY.puzzle.replace(/0/g, '.'))).toEqual(parseGrid(EASY.puzzle));
  });

  it('rejects wrong length and characters', () => {
    expect(() => parseGrid('123')).toThrow('81 cells');
    expect(() => parseGrid('x' + EASY.puzzle.slice(1))).toThrow('Invalid character "x" at cell 0');
    expect(() => serializeGrid([1, 2, 3])).toThrow('81 cells');
  });

  it('counts digits', () => {
    const counts = countDigits(parseGrid(EASY.solution));
    expect(counts).toEqual([0, 9, 9, 9, 9, 9, 9, 9, 9, 9]);
    expect(countDigits(parseGrid(EASY.puzzle))[0]).toBe(81 - 32);
  });
});

describe('board', () => {
  it('marks givens and starts with no notes', () => {
    const board = createBoard(EASY.puzzle);
    expect(board.givens[2]).toBe(true);
    expect(board.givens[0]).toBe(false);
    expect(board.givens.filter(Boolean)).toHaveLength(32);
    expect(board.notes.every((n) => n === 0)).toBe(true);
  });

  it('tells entries from givens', () => {
    const board = createBoard(EASY.puzzle);
    const withEntry = { ...board, values: board.values.map((v, i) => (i === 0 ? 4 : v)) };
    expect(isEntry(withEntry, 0)).toBe(true);
    expect(isEntry(withEntry, 2)).toBe(false);
    expect(isEntry(withEntry, 1)).toBe(false);
  });

  it('copies an array input', () => {
    const grid = parseGrid(EASY.puzzle);
    const board = createBoard(grid);
    expect(board.values).toEqual(grid);
    expect(board.values).not.toBe(grid);
  });
});
