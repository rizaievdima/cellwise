/** Rule checks that do not need the solution: conflicts and completion. */
import { CELLS, PEERS, UNITS, type Grid } from './board';
import type { GameState } from './game';

/** Peers of cell `i` that hold the same digit as `i`. Empty for an empty cell. */
export function conflictingPeers(grid: Grid, i: number): number[] {
  const v = grid[i];
  if (v === 0) return [];
  return PEERS[i].filter((j) => grid[j] === v);
}

/** Every cell whose digit repeats in its row, column or box, ascending. */
export function findConflicts(grid: Grid): number[] {
  const bad = new Set<number>();
  for (const unit of UNITS) {
    const seen = new Map<number, number>();
    for (const i of unit) {
      const v = grid[i];
      if (v === 0) continue;
      const first = seen.get(v);
      if (first === undefined) {
        seen.set(v, i);
      } else {
        bad.add(first);
        bad.add(i);
      }
    }
  }
  return [...bad].sort((a, b) => a - b);
}

export function hasConflicts(grid: Grid): boolean {
  return findConflicts(grid).length > 0;
}

export function isFilled(grid: Grid): boolean {
  return grid.length === CELLS && grid.every((v) => v >= 1 && v <= 9);
}

/** Every cell filled and no digit repeats in any unit — a valid finished sudoku. */
export function isComplete(grid: Grid): boolean {
  return isFilled(grid) && !hasConflicts(grid);
}

/** The board matches the solution in every cell. */
export function isSolved(state: GameState): boolean {
  return state.board.values.every((v, i) => v === state.solution[i]);
}
