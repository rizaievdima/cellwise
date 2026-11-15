import { indexOf, parseGrid, serializeGrid } from '../board';
import { countSolutions, hasUniqueSolution, solve } from '../solver';
import { isComplete } from '../validate';
import { EASY, EMPTY, INKALA } from './fixtures';

/** Small deterministic PRNG for repeatable tests. */
function mulberry32(seed: number) {
  let a = seed;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function keepsGivens(puzzle: number[], solution: number[]) {
  return puzzle.every((v, i) => v === 0 || v === solution[i]);
}

describe('solve', () => {
  it('solves an easy puzzle', () => {
    expect(serializeGrid(solve(EASY.puzzle)!)).toBe(EASY.solution);
  });

  it('solves a very hard puzzle', () => {
    expect(serializeGrid(solve(INKALA.puzzle)!)).toBe(INKALA.solution);
  });

  it('accepts a number grid and does not mutate it', () => {
    const grid = parseGrid(EASY.puzzle);
    const copy = [...grid];
    expect(serializeGrid(solve(grid)!)).toBe(EASY.solution);
    expect(grid).toEqual(copy);
  });

  it('returns a solved grid unchanged', () => {
    expect(serializeGrid(solve(EASY.solution)!)).toBe(EASY.solution);
  });

  it('returns null when givens clash', () => {
    const grid = parseGrid(EASY.puzzle);
    grid[0] = 3; // 3 is already a given at cell 2
    expect(solve(grid)).toBeNull();
  });

  it('returns null when a cell has no candidates', () => {
    // Row 0 holds 1–8; the 9 in column 8 leaves cell (0, 8) with nothing.
    const grid = parseGrid('12345678.' + '.'.repeat(36) + '........9' + '.'.repeat(27));
    expect(solve(grid)).toBeNull();
    expect(countSolutions(grid)).toBe(0);
  });

  it('rejects malformed input', () => {
    expect(() => solve([1, 2, 3])).toThrow('81 cells');
    expect(() => solve(new Array(81).fill(10))).toThrow(RangeError);
  });

  it('fills an empty grid with a random but repeatable valid solution', () => {
    const a = solve(EMPTY, { random: mulberry32(1) })!;
    const b = solve(EMPTY, { random: mulberry32(1) })!;
    const c = solve(EMPTY, { random: mulberry32(2) })!;
    expect(isComplete(a)).toBe(true);
    expect(isComplete(c)).toBe(true);
    expect(a).toEqual(b);
    expect(a).not.toEqual(c);
  });

  it('keeps the givens of a puzzle when shuffling', () => {
    const solution = solve(EASY.puzzle, { random: mulberry32(7) })!;
    expect(serializeGrid(solution)).toBe(EASY.solution);
    expect(keepsGivens(parseGrid(EASY.puzzle), solution)).toBe(true);
  });
});

describe('countSolutions', () => {
  it('finds exactly one solution for proper puzzles', () => {
    expect(countSolutions(EASY.puzzle)).toBe(1);
    expect(countSolutions(INKALA.puzzle)).toBe(1);
    expect(hasUniqueSolution(EASY.puzzle)).toBe(true);
    expect(hasUniqueSolution(INKALA.puzzle)).toBe(true);
  });

  it('stops at the limit', () => {
    expect(countSolutions(EMPTY)).toBe(2);
    expect(countSolutions(EMPTY, 5)).toBe(5);
    expect(countSolutions(EMPTY, 0)).toBe(0);
    expect(hasUniqueSolution(EMPTY)).toBe(false);
  });

  it('sees two solutions in a deadly rectangle', () => {
    // In EASY's solution, rows 0–1 × columns 1, 6 hold 8 6 / 6 8 across two boxes:
    // blanking those four cells leaves exactly two ways to fill them.
    const grid = parseGrid(EASY.solution);
    for (const [r, c] of [
      [0, 1],
      [0, 6],
      [1, 1],
      [1, 6],
    ]) {
      grid[indexOf(r, c)] = 0;
    }
    expect(countSolutions(grid, 10)).toBe(2);
    expect(hasUniqueSolution(grid)).toBe(false);
  });

  it('loses uniqueness when a needed clue is removed from a minimal-ish puzzle', () => {
    // Removing clues one at a time from INKALA (21 clues) must eventually break uniqueness.
    const grid = parseGrid(INKALA.puzzle);
    const clues = grid.flatMap((v, i) => (v ? [i] : []));
    const broken = clues.some((i) => {
      const copy = [...grid];
      copy[i] = 0;
      return countSolutions(copy) === 2;
    });
    expect(broken).toBe(true);
  });

  it('returns 0 when givens clash', () => {
    const grid = parseGrid(EASY.puzzle);
    grid[0] = 3;
    expect(countSolutions(grid)).toBe(0);
  });
});
