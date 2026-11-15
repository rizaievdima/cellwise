/**
 * Board model. A grid is an 81-cell array indexed `r * 9 + c`; `0` = empty.
 * Pure TypeScript: no React / React Native imports (runs in plain Node).
 */

export type Grid = readonly number[];

export const SIZE = 9;
export const CELLS = 81;

/** Bit mask with all nine digits set (bit `d - 1` stands for digit `d`). */
export const ALL_DIGITS = 0x1ff;

export const rowOf = (i: number): number => Math.floor(i / 9);
export const colOf = (i: number): number => i % 9;
export const boxOf = (i: number): number => Math.floor(rowOf(i) / 3) * 3 + Math.floor(colOf(i) / 3);
export const indexOf = (r: number, c: number): number => r * 9 + c;

const range9 = Array.from({ length: 9 }, (_, k) => k);

/** Cell indices of each row, column and box. */
export const ROWS: readonly (readonly number[])[] = range9.map((r) => range9.map((c) => r * 9 + c));
export const COLS: readonly (readonly number[])[] = range9.map((c) => range9.map((r) => r * 9 + c));
export const BOXES: readonly (readonly number[])[] = range9.map((b) =>
  range9.map((k) => indexOf(Math.floor(b / 3) * 3 + Math.floor(k / 3), (b % 3) * 3 + (k % 3))),
);

/** All 27 units: rows 0–8, columns 9–17, boxes 18–26. */
export const UNITS: readonly (readonly number[])[] = [...ROWS, ...COLS, ...BOXES];

/** The three unit ids (row, column, box) of every cell. */
export const UNITS_OF: readonly (readonly [number, number, number])[] = Array.from(
  { length: CELLS },
  (_, i) => [rowOf(i), 9 + colOf(i), 18 + boxOf(i)] as const,
);

/** The 20 peers of every cell: cells sharing its row, column or box. */
export const PEERS: readonly (readonly number[])[] = Array.from({ length: CELLS }, (_, i) => {
  const peers = new Set<number>();
  for (const u of UNITS_OF[i]) for (const j of UNITS[u]) if (j !== i) peers.add(j);
  return [...peers].sort((a, b) => a - b);
});

export const digitBit = (d: number): number => 1 << (d - 1);

export function hasDigit(mask: number, d: number): boolean {
  return (mask & digitBit(d)) !== 0;
}

/** Digits present in a mask, ascending. */
export function digitsOf(mask: number): number[] {
  const out: number[] = [];
  for (let d = 1; d <= 9; d++) if (mask & digitBit(d)) out.push(d);
  return out;
}

export function bitCount(mask: number): number {
  let n = 0;
  for (let m = mask; m; m &= m - 1) n++;
  return n;
}

/**
 * Parse an 81-char grid string. `.` or `0` = empty, `1`–`9` = digit.
 * Throws on any other length or character.
 */
export function parseGrid(text: string): number[] {
  if (text.length !== CELLS) {
    throw new Error(`Grid must have ${CELLS} cells, got ${text.length}`);
  }
  return Array.from(text, (ch, i) => {
    if (ch === '.' || ch === '0') return 0;
    if (ch >= '1' && ch <= '9') return ch.charCodeAt(0) - 48;
    throw new Error(`Invalid character "${ch}" at cell ${i}`);
  });
}

/** Serialize a grid to an 81-char string; empty cells become `empty` (default `.`). */
export function serializeGrid(grid: Grid, empty: '.' | '0' = '.'): string {
  if (grid.length !== CELLS) {
    throw new Error(`Grid must have ${CELLS} cells, got ${grid.length}`);
  }
  return grid.map((v) => (v === 0 ? empty : String(v))).join('');
}

/** How many times each digit appears; index 0 counts empty cells. */
export function countDigits(grid: Grid): number[] {
  const counts = new Array<number>(10).fill(0);
  for (const v of grid) counts[v]++;
  return counts;
}

/**
 * Playing surface: the digits, which of them are givens, and pencil notes.
 * Plain arrays so it serializes to JSON for autosave.
 */
export interface Board {
  /** 81 values, givens included; 0 = empty. */
  readonly values: readonly number[];
  /** `true` where the value is a given clue. */
  readonly givens: readonly boolean[];
  /** Pencil notes per cell as a digit mask (bit `d - 1`). */
  readonly notes: readonly number[];
}

export function createBoard(puzzle: string | Grid): Board {
  const values = typeof puzzle === 'string' ? parseGrid(puzzle) : [...puzzle];
  if (values.length !== CELLS) {
    throw new Error(`Grid must have ${CELLS} cells, got ${values.length}`);
  }
  return {
    values,
    givens: values.map((v) => v !== 0),
    notes: new Array<number>(CELLS).fill(0),
  };
}

/** A cell the player typed a digit into (not a given). */
export function isEntry(board: Board, i: number): boolean {
  return !board.givens[i] && board.values[i] !== 0;
}
