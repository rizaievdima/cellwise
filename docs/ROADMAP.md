# Cellwise — Roadmap

`[ ]` todo · `[x]` done. **(manual)** = Dmytro does it (accounts, payments, consoles).
Claude Code ticks coding items after their "Done when" is met and adds a one-line note if anything changed.

Progress: stage 0 — 0/8 · 1 — 0/6 · 2 — 0/9 · 3 — 0/4 · 4 — 0/11 · 5 — 0/7 · 6 — 0/4 · 7 — 0/4

## 0. Accounts and admin (manual, in parallel with code)

- [ ] 0.1 **(manual)** Choose Google Play account type: personal (closed test, 12+ testers for 14 days in a row) or organization (needs D-U-N-S, no closed-test rule).
- [ ] 0.2 **(manual)** Register Google Play Console ($25) and pass identity verification.
- [ ] 0.3 **(manual)** Join Apple Developer Program ($99/year).
- [ ] 0.4 **(manual)** Create AdMob account and the Android + iOS app entries.
- [ ] 0.5 **(manual)** Domain (e.g. `sudokucell.app`) with a privacy policy page and `app-ads.txt` at the root.
- [ ] 0.6 **(manual)** Search "Cellwise" in App Store and Google Play; confirm the name is free.
- [ ] 0.7 **(manual)** Create GitHub repo `cellwise`, commit this starter (CLAUDE.md + docs/).
- [ ] 0.8 **(manual)** Personal account only: start recruiting 15–20 closed testers.

## 1. Scaffold

- [ ] 1.1 Expo + TypeScript strict + expo-router with routes `index`, `game`, `stats`, `settings` (placeholder screens).
  Done when: `npx expo start` runs and navigation between all four works.
- [ ] 1.2 Tooling: ESLint + Prettier, Jest (`jest-expo`), path aliases, `npm test` and `npm run lint` scripts.
  Done when: `npm test` passes with a sample test.
- [ ] 1.3 Theme: `src/ui/theme.ts` with the tokens from CLAUDE.md; Literata + Inter loaded.
  Done when: a placeholder screen renders with paper background and both fonts.
- [ ] 1.4 Zustand + MMKV `persist`, first used by the settings store.
  Done when: a toggled setting survives an app restart on device.
- [ ] 1.5 EAS: `eas.json` (development / preview / production), bundle ID `app.sudokucell.cellwise`, development build on a real phone. Claude Code prepares the config; **(manual)** Dmytro runs the build.
  Done when: the dev client opens the app on a device.
- [ ] 1.6 GitHub Actions: lint + tests on every push / PR.
  Done when: CI is green on main.

## 2. Engine (pure TypeScript, tests first)

- [ ] 2.1 Board model: parse / serialize 81-char strings, peers (row / column / box), givens vs entries.
- [ ] 2.2 Moves: set digit, erase, toggle notes, undo history; mistake counting against the solution.
- [ ] 2.3 Validation: conflicts, completion check.
- [ ] 2.4 Backtracking solver + solution counter (stops at 2) for the uniqueness check.
- [ ] 2.5 Human-style solver, step 1: naked and hidden singles; returns steps `{ technique, cells, digit }`.
- [ ] 2.6 Naked / hidden pairs, pointing pairs.
- [ ] 2.7 Triples, box/line reduction, X-Wing.
- [ ] 2.8 XY-Wing, Swordfish, simple chains.
- [ ] 2.9 Rater: difficulty = hardest technique used; needs guessing → rejected.

Done when (each item): unit tests pass, including at least one known grid per technique.

## 3. Puzzle bank

- [ ] 3.1 `tools/generator`: random full grid (randomized backtracking) + symmetric clue removal with uniqueness check.
- [ ] 3.2 Rate and bucket into Easy / Medium / Hard / Expert, 2000 each; dedupe by canonical form.
- [ ] 3.3 Write `src/puzzles/*.json` (about 1.4 MB in total) + loader that picks an unplayed puzzle id.
- [ ] 3.4 Validation script re-checks every puzzle: unique solution and its rated level.
  Done when: the script passes on the full bank and runs in CI.

## 4. Screens (match docs/design)

- [ ] 4.1 Game screen: grid, highlights, notes, header (timer, mistakes, pause), actions row, 3×3 keypad with remaining counts.
- [ ] 4.2 Game store: new / continue game, autosave after every move, timer pauses in background.
- [ ] 4.3 Pause overlay that hides the grid.
- [ ] 4.4 Win screen: time, mistakes, hints, previous best, "New best" stamp.
- [ ] 4.5 Three-mistakes bottom sheet: Second chance / Restart this puzzle / New game (rewarded stubbed for now).
- [ ] 4.6 Home: Continue card, difficulty list, Stats / Settings / Remove ads, banner slot.
- [ ] 4.7 Stats per difficulty: played, won %, best and average time, current and best streak.
- [ ] 4.8 Settings: mistake limit, highlights, sounds, haptics, theme, purchases, privacy rows.
- [ ] 4.9 Wallet store (`balance`, `earn`, `spend`) used by Hint and Second chance.
- [ ] 4.10 Haptics and small animations (digit placed, row / column / box completed).
- [ ] 4.11 Dark theme.

Done when (stage): a full game can be played from Home to Win screen offline on a device.

## 5. Monetization

- [ ] 5.1 AdMob SDK init, UMP consent form on first launch, ATT prompt on iOS, config plugin set up.
- [ ] 5.2 Adaptive banner on Home and Stats; game-screen banner behind the `banner_on_game_screen` flag.
- [ ] 5.3 Rewarded ads for Hint and Second chance through the wallet; buttons disabled until loaded.
- [ ] 5.4 Interstitial policy service driven by Remote Config; shown only between a completed board and the win screen; preloaded.
- [ ] 5.5 Firebase: Analytics events (`game_start`, `game_complete`, `mistake_limit`, `hint_used`, `ad_*`), Crashlytics, Remote Config defaults.
- [ ] 5.6 RevenueCat: `remove_ads` non-consumable, Restore purchases, ads gated by the entitlement.
- [ ] 5.7 Verified on device: sandbox purchase turns off banners and interstitials; rewarded still works.

## 6. Pre-release

- [ ] 6.1 App icon, splash screen, store screenshots and description (English).
- [ ] 6.2 **(manual)** Data safety (Play) and App Privacy (Apple) forms; privacy policy URL; `app-ads.txt` verified in AdMob.
- [ ] 6.3 Target API level meets the current Google Play requirement; production builds via EAS.
- [ ] 6.4 QA pass: offline, background / resume, small screens, dark theme, accessibility labels.

## 7. Test and release

- [ ] 7.1 **(manual)** Closed test track with 15–20 testers for 14 consecutive days (personal account).
- [ ] 7.2 Fix feedback; **(manual)** apply for production access.
- [ ] 7.3 TestFlight build; **(manual)** App Store review.
- [ ] 7.4 Release: real AdMob units on; watch Crashlytics and the AdMob policy center.

## Later (v1.1+)

Daily challenge and streaks · auto-notes · hints that explain the technique · Killer / Diagonal · accounts, sync, leaderboards · ad mediation (AppLovin MAX) · coins via RevenueCat virtual currency.
