/** Techniques the human-style solver knows, easiest first. */
export type Technique = 'hiddenSingle' | 'nakedSingle';

/**
 * One logical step. Hints (v1.1) explain these to the player.
 * Later techniques (2.6+) that remove candidates instead of placing a digit
 * will add an `eliminations` list.
 */
export interface Step {
  technique: Technique;
  /** Cells the step is about. For a single: the one cell that gets `digit`. */
  cells: number[];
  /** For a single: the digit placed. */
  digit: number;
  /** Hidden single: the unit where `digit` has one place (0–8 rows, 9–17 columns, 18–26 boxes). */
  unit?: number;
}

/** Grid plus pencil-mark candidates (digit masks; 0 for filled cells). */
export interface SolverState {
  readonly values: readonly number[];
  readonly candidates: readonly number[];
}
