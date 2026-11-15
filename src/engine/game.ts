/**
 * Game moves on top of the board model: set digit, erase, notes, undo, mistakes.
 * Every function is pure and returns a new state (or the same object when nothing changes).
 */
import { CELLS, PEERS, createBoard, digitBit, parseGrid, type Board, type Grid } from './board';

/** Contents of one cell before a move changed it. */
export interface CellSnapshot {
  readonly i: number;
  readonly value: number;
  readonly notes: number;
}

/** One undoable move: the previous contents of every cell it changed. */
export type UndoEntry = readonly CellSnapshot[];

export interface GameState {
  readonly board: Board;
  readonly solution: Grid;
  /** Wrong digits placed so far. Undo never gives mistakes back. */
  readonly mistakes: number;
  readonly history: readonly UndoEntry[];
}

export function newGame(puzzle: string, solution: string): GameState {
  const board = createBoard(puzzle);
  const solved = parseGrid(solution);
  if (solved.includes(0)) throw new Error('Solution must be complete');
  board.values.forEach((v, i) => {
    if (v !== 0 && v !== solved[i]) throw new Error(`Given at cell ${i} does not match solution`);
  });
  return { board, solution: solved, mistakes: 0, history: [] };
}

/** Givens and correctly placed digits cannot be changed. */
export function isLocked(state: GameState, i: number): boolean {
  return state.board.givens[i] || state.board.values[i] === state.solution[i];
}

/** A cell holding a digit that does not match the solution. */
export function isMistake(state: GameState, i: number): boolean {
  const v = state.board.values[i];
  return v !== 0 && v !== state.solution[i];
}

export function canUndo(state: GameState): boolean {
  return state.history.length > 0;
}

function assertCell(i: number): void {
  if (!Number.isInteger(i) || i < 0 || i >= CELLS) throw new RangeError(`Bad cell index ${i}`);
}

function assertDigit(d: number): void {
  if (!Number.isInteger(d) || d < 1 || d > 9) throw new RangeError(`Bad digit ${d}`);
}

/** Write cell changes, recording what they replaced as one undo entry. */
function commit(
  state: GameState,
  changes: readonly CellSnapshot[],
  mistakeDelta: number,
): GameState {
  const values = [...state.board.values];
  const notes = [...state.board.notes];
  const previous: CellSnapshot[] = [];
  for (const { i, value, notes: mask } of changes) {
    previous.push({ i, value: values[i], notes: notes[i] });
    values[i] = value;
    notes[i] = mask;
  }
  return {
    ...state,
    board: { ...state.board, values, notes },
    mistakes: state.mistakes + mistakeDelta,
    history: [...state.history, previous],
  };
}

/**
 * Place digit `d` in cell `i`. Clears the cell's notes. A wrong digit counts a mistake and
 * stays in the cell; a correct digit locks the cell and removes `d` from the notes of its peers.
 */
export function setDigit(state: GameState, i: number, d: number): GameState {
  assertCell(i);
  assertDigit(d);
  const { values, notes } = state.board;
  if (isLocked(state, i) || values[i] === d) return state;

  const changes: CellSnapshot[] = [{ i, value: d, notes: 0 }];
  const correct = d === state.solution[i];
  if (correct) {
    const bit = digitBit(d);
    for (const j of PEERS[i]) {
      if (values[j] === 0 && notes[j] & bit)
        changes.push({ i: j, value: 0, notes: notes[j] & ~bit });
    }
  }
  return commit(state, changes, correct ? 0 : 1);
}

/** Clear a wrong digit or the notes of cell `i`. Locked cells are left alone. */
export function erase(state: GameState, i: number): GameState {
  assertCell(i);
  const { values, notes } = state.board;
  if (isLocked(state, i) || (values[i] === 0 && notes[i] === 0)) return state;
  return commit(state, [{ i, value: 0, notes: 0 }], 0);
}

/** Toggle pencil note `d` in an empty cell. */
export function toggleNote(state: GameState, i: number, d: number): GameState {
  assertCell(i);
  assertDigit(d);
  if (state.board.values[i] !== 0) return state;
  return commit(state, [{ i, value: 0, notes: state.board.notes[i] ^ digitBit(d) }], 0);
}

/** Revert the last move. The mistake count stays as it is. */
export function undo(state: GameState): GameState {
  const last = state.history[state.history.length - 1];
  if (!last) return state;
  const values = [...state.board.values];
  const notes = [...state.board.notes];
  for (const { i, value, notes: mask } of last) {
    values[i] = value;
    notes[i] = mask;
  }
  return {
    ...state,
    board: { ...state.board, values, notes },
    history: state.history.slice(0, -1),
  };
}
