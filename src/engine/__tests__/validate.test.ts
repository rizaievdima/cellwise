import { indexOf, parseGrid } from '../board';
import { newGame, setDigit } from '../game';
import {
  conflictingPeers,
  findConflicts,
  hasConflicts,
  isComplete,
  isFilled,
  isSolved,
} from '../validate';
import { EASY } from './fixtures';

const put = (grid: number[], cells: [number, number][]) => {
  const out = [...grid];
  for (const [i, v] of cells) out[i] = v;
  return out;
};
const empty = () => new Array<number>(81).fill(0);

describe('conflicts', () => {
  it('finds none in a valid puzzle or solution', () => {
    expect(findConflicts(parseGrid(EASY.puzzle))).toEqual([]);
    expect(hasConflicts(parseGrid(EASY.solution))).toBe(false);
  });

  it('reports both cells of a row duplicate', () => {
    const grid = put(empty(), [
      [indexOf(3, 0), 7],
      [indexOf(3, 8), 7],
    ]);
    expect(findConflicts(grid)).toEqual([indexOf(3, 0), indexOf(3, 8)]);
  });

  it('reports a column duplicate', () => {
    const grid = put(empty(), [
      [indexOf(0, 4), 2],
      [indexOf(8, 4), 2],
    ]);
    expect(findConflicts(grid)).toEqual([indexOf(0, 4), indexOf(8, 4)]);
  });

  it('reports a box-only duplicate', () => {
    // Different row and column, same box 8.
    const grid = put(empty(), [
      [indexOf(6, 6), 9],
      [indexOf(8, 7), 9],
    ]);
    expect(findConflicts(grid)).toEqual([indexOf(6, 6), indexOf(8, 7)]);
  });

  it('reports every repeat of a digit in a unit once', () => {
    const grid = put(empty(), [
      [0, 5],
      [4, 5],
      [8, 5],
    ]);
    expect(findConflicts(grid)).toEqual([0, 4, 8]);
  });

  it('lists the conflicting peers of one cell', () => {
    const grid = put(parseGrid(EASY.puzzle), [[0, 3]]); // 3 is a given at cell 2, same row and box
    expect(conflictingPeers(grid, 0)).toEqual([2]);
    expect(conflictingPeers(grid, 1)).toEqual([]);
  });
});

describe('completion', () => {
  it('accepts a solved grid', () => {
    const grid = parseGrid(EASY.solution);
    expect(isFilled(grid)).toBe(true);
    expect(isComplete(grid)).toBe(true);
  });

  it('rejects a grid with empty cells', () => {
    const grid = parseGrid(EASY.puzzle);
    expect(isFilled(grid)).toBe(false);
    expect(isComplete(grid)).toBe(false);
  });

  it('rejects a filled grid with conflicts', () => {
    const grid = parseGrid(EASY.solution);
    [grid[0], grid[9]] = [grid[9], grid[0]]; // swap within column 0: rows break
    expect(isFilled(grid)).toBe(true);
    expect(isComplete(grid)).toBe(false);
  });

  it('knows when a game is solved', () => {
    let game = newGame(EASY.puzzle, EASY.solution);
    expect(isSolved(game)).toBe(false);
    const solution = parseGrid(EASY.solution);
    game.board.values.forEach((v, i) => {
      if (v === 0) game = setDigit(game, i, solution[i]);
    });
    expect(isSolved(game)).toBe(true);
    expect(isComplete(game.board.values)).toBe(true);
  });
});
