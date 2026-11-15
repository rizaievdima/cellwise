import { digitsOf, indexOf, parseGrid, serializeGrid } from '../board';
import {
  applyStep,
  createSolverState,
  findHiddenSingle,
  findNakedSingle,
  nextStep,
  solveHuman,
} from '../human';
import { EASY, INKALA } from './fixtures';

const gridWith = (cells: [number, number, number][]) => {
  const grid = new Array<number>(81).fill(0);
  for (const [r, c, d] of cells) grid[indexOf(r, c)] = d;
  return grid;
};

/**
 * Naked single at (0, 0): row 0 has 1 2 3, column 0 has 4 5 6, box 0 has 7 8 → only 9 is left.
 * 9 itself can still go in many places of each unit, so it is not a hidden single.
 */
const NAKED_SINGLE = gridWith([
  [0, 3, 1],
  [0, 4, 2],
  [0, 5, 3],
  [3, 0, 4],
  [4, 0, 5],
  [5, 0, 6],
  [1, 1, 7],
  [2, 2, 8],
]);

/**
 * Hidden single at (0, 0) for 1 in box 0: the 1s in rows 1–2 and columns 1–2 rule out the
 * other eight cells of the box, while (0, 0) itself still has all nine candidates.
 */
const HIDDEN_SINGLE = gridWith([
  [1, 4, 1],
  [2, 7, 1],
  [4, 1, 1],
  [7, 2, 1],
]);

describe('candidates', () => {
  it('excludes digits used by peers', () => {
    const state = createSolverState(NAKED_SINGLE);
    expect(digitsOf(state.candidates[0])).toEqual([9]);
    expect(state.candidates[indexOf(0, 3)]).toBe(0); // filled
    expect(digitsOf(state.candidates[indexOf(8, 8)])).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9]);
  });

  it('updates peers when a digit is placed', () => {
    const state = createSolverState(HIDDEN_SINGLE);
    const next = applyStep(state, { technique: 'hiddenSingle', cells: [0], digit: 1 });
    expect(next.values[0]).toBe(1);
    expect(next.candidates[0]).toBe(0);
    expect(digitsOf(next.candidates[indexOf(0, 8)])).not.toContain(1);
    expect(digitsOf(next.candidates[indexOf(8, 0)])).not.toContain(1);
    expect(state.values[0]).toBe(0); // pure
  });
});

describe('naked single', () => {
  it('finds the only candidate of a cell', () => {
    const state = createSolverState(NAKED_SINGLE);
    expect(findNakedSingle(state)).toEqual({ technique: 'nakedSingle', cells: [0], digit: 9 });
    expect(findHiddenSingle(state)).toBeNull();
  });

  it('finds nothing in an empty grid', () => {
    expect(findNakedSingle(createSolverState('.'.repeat(81)))).toBeNull();
  });
});

describe('hidden single', () => {
  it('finds the only place for a digit in a box', () => {
    const state = createSolverState(HIDDEN_SINGLE);
    expect(findHiddenSingle(state)).toEqual({
      technique: 'hiddenSingle',
      cells: [0],
      digit: 1,
      unit: 18,
    });
    expect(findNakedSingle(state)).toBeNull();
    expect(digitsOf(state.candidates[0])).toHaveLength(9);
  });

  it('finds the last empty cell of a row (full house) and reports the row', () => {
    // Box and column scans have nothing; row 4 misses only 5 at (4, 8).
    const grid = parseGrid('.'.repeat(36) + '12346789.' + '.'.repeat(36));
    const step = findHiddenSingle(createSolverState(grid));
    expect(step).toEqual({ technique: 'hiddenSingle', cells: [indexOf(4, 8)], digit: 5, unit: 4 });
  });
});

describe('nextStep', () => {
  it('prefers hidden singles, then naked singles', () => {
    expect(nextStep(createSolverState(HIDDEN_SINGLE))?.technique).toBe('hiddenSingle');
    expect(nextStep(createSolverState(NAKED_SINGLE))?.technique).toBe('nakedSingle');
  });

  it('respects the allowed techniques', () => {
    expect(nextStep(createSolverState(NAKED_SINGLE), ['hiddenSingle'])).toBeNull();
  });
});

describe('solveHuman', () => {
  it('solves an easy puzzle with singles only, every step correct', () => {
    const solution = parseGrid(EASY.solution);
    const result = solveHuman(EASY.puzzle);
    expect(result.solved).toBe(true);
    expect(serializeGrid(result.values)).toBe(EASY.solution);
    expect(result.steps).toHaveLength(81 - 32);
    const placed = new Set<number>();
    for (const step of result.steps) {
      expect(['hiddenSingle', 'nakedSingle']).toContain(step.technique);
      expect(step.digit).toBe(solution[step.cells[0]]);
      expect(placed.has(step.cells[0])).toBe(false);
      placed.add(step.cells[0]);
    }
  });

  it('stops without guessing when singles are not enough', () => {
    const solution = parseGrid(INKALA.solution);
    const result = solveHuman(INKALA.puzzle);
    expect(result.solved).toBe(false);
    expect(result.values).toContain(0);
    for (const step of result.steps) expect(step.digit).toBe(solution[step.cells[0]]);
  });

  it('leaves the input untouched', () => {
    const grid = parseGrid(EASY.puzzle);
    const copy = [...grid];
    solveHuman(grid);
    expect(grid).toEqual(copy);
  });
});
