/**
 * Backtracking solver with bit masks and the "fewest candidates first" heuristic.
 * Used for the uniqueness check: `countSolutions` stops as soon as it reaches the limit.
 */
import {
  ALL_DIGITS,
  CELLS,
  bitCount,
  boxOf,
  colOf,
  digitBit,
  parseGrid,
  rowOf,
  type Grid,
} from './board';

const ROW = Array.from({ length: CELLS }, (_, i) => rowOf(i));
const COL = Array.from({ length: CELLS }, (_, i) => colOf(i));
const BOX = Array.from({ length: CELLS }, (_, i) => boxOf(i));

interface Search {
  grid: number[];
  rows: number[];
  cols: number[];
  boxes: number[];
}

export interface SolveOptions {
  /** Shuffle the digit order with this RNG (0 ≤ x < 1) — for generating random full grids. */
  random?: () => number;
}

function toGrid(input: Grid | string): number[] {
  const grid = typeof input === 'string' ? parseGrid(input) : [...input];
  if (grid.length !== CELLS) throw new Error(`Grid must have ${CELLS} cells, got ${grid.length}`);
  for (const v of grid) {
    if (!Number.isInteger(v) || v < 0 || v > 9) throw new RangeError(`Bad cell value ${v}`);
  }
  return grid;
}

/** Set up the masks; `null` when two givens already clash. */
function prepare(grid: number[]): Search | null {
  const s: Search = {
    grid,
    rows: Array(9).fill(0),
    cols: Array(9).fill(0),
    boxes: Array(9).fill(0),
  };
  for (let i = 0; i < CELLS; i++) {
    const v = grid[i];
    if (v === 0) continue;
    const bit = digitBit(v);
    if ((s.rows[ROW[i]] | s.cols[COL[i]] | s.boxes[BOX[i]]) & bit) return null;
    s.rows[ROW[i]] |= bit;
    s.cols[COL[i]] |= bit;
    s.boxes[BOX[i]] |= bit;
  }
  return s;
}

function shuffle(items: number[], random: () => number): void {
  for (let k = items.length - 1; k > 0; k--) {
    const j = Math.floor(random() * (k + 1));
    [items[k], items[j]] = [items[j], items[k]];
  }
}

/**
 * Depth-first search. Calls `onSolution` for every full grid; stops when it returns `true`.
 * Returns `true` if the search was stopped.
 */
function search(
  s: Search,
  onSolution: (grid: number[]) => boolean,
  random?: () => number,
): boolean {
  let best = -1;
  let bestMask = 0;
  let bestCount = 10;
  for (let i = 0; i < CELLS; i++) {
    if (s.grid[i] !== 0) continue;
    const mask = ALL_DIGITS & ~(s.rows[ROW[i]] | s.cols[COL[i]] | s.boxes[BOX[i]]);
    const n = bitCount(mask);
    if (n < bestCount) {
      best = i;
      bestMask = mask;
      bestCount = n;
      if (n <= 1) break;
    }
  }
  if (best === -1) return onSolution(s.grid);
  if (bestCount === 0) return false;

  const digits: number[] = [];
  for (let d = 1; d <= 9; d++) if (bestMask & digitBit(d)) digits.push(d);
  if (random) shuffle(digits, random);

  const r = ROW[best];
  const c = COL[best];
  const b = BOX[best];
  for (const d of digits) {
    const bit = digitBit(d);
    s.grid[best] = d;
    s.rows[r] |= bit;
    s.cols[c] |= bit;
    s.boxes[b] |= bit;
    const stop = search(s, onSolution, random);
    s.grid[best] = 0;
    s.rows[r] &= ~bit;
    s.cols[c] &= ~bit;
    s.boxes[b] &= ~bit;
    if (stop) return true;
  }
  return false;
}

/** Number of solutions, counting no further than `limit` (default 2: enough for uniqueness). */
export function countSolutions(input: Grid | string, limit = 2): number {
  const s = prepare(toGrid(input));
  if (!s || limit <= 0) return 0;
  let count = 0;
  search(s, () => ++count >= limit);
  return count;
}

export function hasUniqueSolution(input: Grid | string): boolean {
  return countSolutions(input, 2) === 1;
}

/** The first solution found, or `null` when there is none. Never mutates the input. */
export function solve(input: Grid | string, options: SolveOptions = {}): number[] | null {
  const s = prepare(toGrid(input));
  if (!s) return null;
  let result: number[] | null = null;
  search(
    s,
    (grid) => {
      result = [...grid];
      return true;
    },
    options.random,
  );
  return result;
}
