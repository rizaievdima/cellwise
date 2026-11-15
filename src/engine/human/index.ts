/**
 * Human-style solver: applies logical techniques one step at a time, easiest first.
 * Never guesses — if no technique applies, it stops.
 */
import type { Grid } from '../board';
import { isFilled } from '../validate';
import { findHiddenSingle, findNakedSingle } from './singles';
import { applyStep, createSolverState } from './state';
import type { SolverState, Step, Technique } from './types';

export type { SolverState, Step, Technique } from './types';
export { applyStep, createSolverState } from './state';
export { findHiddenSingle, findNakedSingle } from './singles';

/** Techniques in the order they are tried (easiest first). */
export const TECHNIQUES: readonly {
  technique: Technique;
  find: (s: SolverState) => Step | null;
}[] = [
  { technique: 'hiddenSingle', find: findHiddenSingle },
  { technique: 'nakedSingle', find: findNakedSingle },
];

/** The easiest next step, or `null` when no allowed technique applies. */
export function nextStep(
  state: SolverState,
  allowed: readonly Technique[] = TECHNIQUES.map((t) => t.technique),
): Step | null {
  for (const { technique, find } of TECHNIQUES) {
    if (!allowed.includes(technique)) continue;
    const step = find(state);
    if (step) return step;
  }
  return null;
}

export interface HumanSolveResult {
  steps: Step[];
  /** The grid after the last step. */
  values: number[];
  /** Every cell filled. */
  solved: boolean;
}

/** Apply steps until the grid is full or no technique applies. */
export function solveHuman(input: Grid | string, allowed?: readonly Technique[]): HumanSolveResult {
  let state = createSolverState(input);
  const steps: Step[] = [];
  for (let step = nextStep(state, allowed); step; step = nextStep(state, allowed)) {
    steps.push(step);
    state = applyStep(state, step);
  }
  const values = [...state.values];
  return { steps, values, solved: isFilled(values) };
}
