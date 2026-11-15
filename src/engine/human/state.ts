import { ALL_DIGITS, CELLS, PEERS, digitBit, parseGrid, type Grid } from '../board';
import type { SolverState, Step } from './types';

/** Candidates of every empty cell: digits not used by any of its peers. */
export function createSolverState(input: Grid | string): SolverState {
  const values = typeof input === 'string' ? parseGrid(input) : [...input];
  if (values.length !== CELLS)
    throw new Error(`Grid must have ${CELLS} cells, got ${values.length}`);
  const candidates = values.map((v, i) => {
    if (v !== 0) return 0;
    let used = 0;
    for (const j of PEERS[i]) if (values[j]) used |= digitBit(values[j]);
    return ALL_DIGITS & ~used;
  });
  return { values, candidates };
}

/** Apply a placement step: fill the cell and drop the digit from its peers' candidates. */
export function applyStep(state: SolverState, step: Step): SolverState {
  const [cell] = step.cells;
  const values = [...state.values];
  const candidates = [...state.candidates];
  const bit = digitBit(step.digit);
  values[cell] = step.digit;
  candidates[cell] = 0;
  for (const j of PEERS[cell]) candidates[j] &= ~bit;
  return { values, candidates };
}
