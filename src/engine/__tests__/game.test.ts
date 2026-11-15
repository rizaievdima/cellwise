import { PEERS, digitBit, digitsOf } from '../board';
import {
  canUndo,
  erase,
  isLocked,
  isMistake,
  newGame,
  setDigit,
  toggleNote,
  undo,
  type GameState,
} from '../game';
import { EASY } from './fixtures';

// EASY: cell 0 is empty (answer 4), cell 1 is empty (answer 8), cell 2 is a given 3.
const start = () => newGame(EASY.puzzle, EASY.solution);

const withNotes = (state: GameState, cells: number[], digits: number[]) =>
  cells.reduce((s, i) => digits.reduce((acc, d) => toggleNote(acc, i, d), s), state);

describe('newGame', () => {
  it('starts with no mistakes and no history', () => {
    const game = start();
    expect(game.mistakes).toBe(0);
    expect(canUndo(game)).toBe(false);
    expect(game.solution[0]).toBe(4);
  });

  it('rejects an incomplete or mismatching solution', () => {
    expect(() => newGame(EASY.puzzle, EASY.puzzle)).toThrow('complete');
    const wrong = '5' + EASY.solution.slice(1, 2) + '4' + EASY.solution.slice(3);
    expect(() => newGame(EASY.puzzle, wrong)).toThrow('cell 2');
  });
});

describe('setDigit', () => {
  it('places a correct digit and locks the cell', () => {
    const game = setDigit(start(), 0, 4);
    expect(game.board.values[0]).toBe(4);
    expect(game.mistakes).toBe(0);
    expect(isLocked(game, 0)).toBe(true);
    expect(setDigit(game, 0, 5)).toBe(game);
    expect(erase(game, 0)).toBe(game);
  });

  it('counts a wrong digit as a mistake and keeps it in the cell', () => {
    const game = setDigit(start(), 0, 5);
    expect(game.board.values[0]).toBe(5);
    expect(game.mistakes).toBe(1);
    expect(isMistake(game, 0)).toBe(true);
    expect(isLocked(game, 0)).toBe(false);
  });

  it('does not count the same wrong digit twice', () => {
    const once = setDigit(start(), 0, 5);
    expect(setDigit(once, 0, 5)).toBe(once);
    const twice = setDigit(once, 0, 6);
    expect(twice.mistakes).toBe(2);
    const fixed = setDigit(twice, 0, 4);
    expect(fixed.mistakes).toBe(2);
    expect(isMistake(fixed, 0)).toBe(false);
  });

  it('ignores givens', () => {
    const game = start();
    expect(setDigit(game, 2, 5)).toBe(game);
    expect(isLocked(game, 2)).toBe(true);
  });

  it('clears the notes of the cell', () => {
    const noted = withNotes(start(), [0], [4, 5]);
    expect(setDigit(noted, 0, 5).board.notes[0]).toBe(0);
  });

  it('removes a correct digit from the notes of its peers only', () => {
    // Cell 1 is a peer of cell 0; cell 80 is not.
    const noted = withNotes(start(), [1, 80], [4, 7]);
    const game = setDigit(noted, 0, 4);
    expect(PEERS[0]).toContain(1);
    expect(digitsOf(game.board.notes[1])).toEqual([7]);
    expect(digitsOf(game.board.notes[80])).toEqual([4, 7]);
  });

  it('keeps peer notes when the digit is wrong', () => {
    const noted = withNotes(start(), [1], [5]);
    expect(setDigit(noted, 0, 5).board.notes[1]).toBe(digitBit(5));
  });

  it('rejects bad input', () => {
    expect(() => setDigit(start(), 81, 1)).toThrow(RangeError);
    expect(() => setDigit(start(), 0, 0)).toThrow(RangeError);
    expect(() => setDigit(start(), 0, 10)).toThrow(RangeError);
  });

  it('does not mutate the previous state', () => {
    const before = start();
    const snapshot = JSON.stringify(before);
    setDigit(withNotes(before, [1], [4]), 0, 4);
    expect(JSON.stringify(before)).toBe(snapshot);
  });
});

describe('erase', () => {
  it('clears a wrong digit', () => {
    const game = erase(setDigit(start(), 0, 5), 0);
    expect(game.board.values[0]).toBe(0);
    expect(game.mistakes).toBe(1);
  });

  it('clears notes', () => {
    expect(erase(withNotes(start(), [0], [1, 2]), 0).board.notes[0]).toBe(0);
  });

  it('is a no-op on an empty cell and on givens', () => {
    const game = start();
    expect(erase(game, 0)).toBe(game);
    expect(erase(game, 2)).toBe(game);
  });
});

describe('toggleNote', () => {
  it('turns a note on and off', () => {
    const on = toggleNote(start(), 0, 7);
    expect(on.board.notes[0]).toBe(digitBit(7));
    expect(toggleNote(on, 0, 7).board.notes[0]).toBe(0);
  });

  it('ignores filled cells', () => {
    const game = setDigit(start(), 0, 5);
    expect(toggleNote(game, 0, 1)).toBe(game);
    expect(toggleNote(game, 2, 1)).toBe(game);
  });
});

describe('undo', () => {
  it('does nothing without history', () => {
    const game = start();
    expect(undo(game)).toBe(game);
  });

  it('records one entry per real change', () => {
    let game = start();
    game = setDigit(game, 0, 5);
    game = setDigit(game, 0, 5); // no-op
    game = toggleNote(game, 1, 3);
    game = erase(game, 2); // given, no-op
    expect(game.history).toHaveLength(2);
  });

  it('reverts a placement together with the peer notes it cleared', () => {
    const noted = withNotes(start(), [1, 9], [4]);
    const placed = setDigit(noted, 0, 4);
    const reverted = undo(placed);
    expect(reverted.board.values).toEqual(noted.board.values);
    expect(reverted.board.notes).toEqual(noted.board.notes);
    expect(reverted.history).toHaveLength(noted.history.length);
  });

  it('restores notes wiped by a digit and keeps the mistake count', () => {
    const noted = withNotes(start(), [0], [2, 6]);
    const wrong = setDigit(noted, 0, 5);
    const reverted = undo(wrong);
    expect(reverted.board.values[0]).toBe(0);
    expect(digitsOf(reverted.board.notes[0])).toEqual([2, 6]);
    expect(reverted.mistakes).toBe(1);
  });

  it('walks back several moves in order', () => {
    let game = start();
    game = setDigit(game, 0, 5);
    game = setDigit(game, 0, 4);
    game = toggleNote(game, 1, 9);
    game = undo(game);
    expect(game.board.notes[1]).toBe(0);
    game = undo(game);
    expect(game.board.values[0]).toBe(5);
    game = undo(game);
    expect(game.board.values[0]).toBe(0);
    expect(canUndo(game)).toBe(false);
    expect(game.mistakes).toBe(1);
  });

  it('survives a JSON round trip (autosave)', () => {
    const game = toggleNote(setDigit(start(), 0, 5), 1, 2);
    const restored = JSON.parse(JSON.stringify(game)) as GameState;
    expect(undo(undo(restored)).board.values).toEqual(start().board.values);
  });
});
