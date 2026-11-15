import { BOXES, COLS, ROWS, bitCount, digitBit, digitsOf } from '../board';
import type { SolverState, Step } from './types';

/** Boxes first, then rows, then columns — the order people usually scan. */
const SCAN_ORDER: readonly { unit: number; cells: readonly number[] }[] = [
  ...BOXES.map((cells, k) => ({ unit: 18 + k, cells })),
  ...ROWS.map((cells, k) => ({ unit: k, cells })),
  ...COLS.map((cells, k) => ({ unit: 9 + k, cells })),
];

/** A digit that fits in only one cell of some row, column or box. */
export function findHiddenSingle(state: SolverState): Step | null {
  const { values, candidates } = state;
  for (const { unit, cells } of SCAN_ORDER) {
    for (let d = 1; d <= 9; d++) {
      const bit = digitBit(d);
      let place = -1;
      let count = 0;
      for (const i of cells) {
        if (values[i] === d) {
          count = -1;
          break;
        }
        if (values[i] === 0 && candidates[i] & bit) {
          place = i;
          count++;
        }
      }
      if (count === 1) return { technique: 'hiddenSingle', cells: [place], digit: d, unit };
    }
  }
  return null;
}

/** A cell with only one candidate left. */
export function findNakedSingle(state: SolverState): Step | null {
  const { values, candidates } = state;
  for (let i = 0; i < values.length; i++) {
    if (values[i] === 0 && bitCount(candidates[i]) === 1) {
      return { technique: 'nakedSingle', cells: [i], digit: digitsOf(candidates[i])[0] };
    }
  }
  return null;
}
