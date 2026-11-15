# Cellwise — Sudoku Logic

Offline sudoku for iOS and Android, built with Expo. Monetized with AdMob ads and a one-time "Remove ads" purchase.
Store title: **Cellwise: Sudoku Logic**. Bundle ID / Android package: `app.sudokucell.cellwise`.

- Product spec (Ukrainian): `docs/SPEC.md`
- Step-by-step plan with progress: `docs/ROADMAP.md`
- Design reference (HTML mockups, 390×844): `docs/design/`

## Working agreement

- Talk to Dmytro in **Ukrainian**. Code, comments, commit messages and all UI copy are **English**.
- Every task maps to an item ID in `docs/ROADMAP.md` (e.g. `2.4`). Before starting, read the item. After finishing, change `[ ]` to `[x]` and, if something deviated from the plan, add a short note under the item. Tick only when its "Done when" is met (tests green, runs on device where stated).
- Items marked **(manual)** are Dmytro's (accounts, payments, store consoles). Don't tick them; remind him when a coding item is blocked by one.
- Small steps: one roadmap item per commit where possible. Commit message starts with the item ID: `2.4: backtracking solver with solution count`.
- Ask before adding a dependency that is not in the Stack below.
- Never commit secrets. Real AdMob unit IDs and RevenueCat keys come from EAS env vars; dev builds use AdMob `TestIds` only.

## Stack

- Expo (latest stable SDK) + TypeScript `strict`, expo-router
- State: Zustand with `persist` → react-native-mmkv
- Animation / feedback: react-native-reanimated, expo-haptics
- Fonts: Literata + Inter (`@expo-google-fonts/*`)
- Ads: react-native-google-mobile-ads (AdMob; consent via `AdsConsent` / UMP; ATT on iOS)
- Purchases: RevenueCat (`react-native-purchases`), non-consumable `remove_ads`
- Firebase via `@react-native-firebase`: Analytics, Crashlytics, Remote Config
- Tests: Jest (`jest-expo` preset); engine and generator tests must also run in plain Node
- Builds: EAS Build / EAS Submit. Native modules mean a **development build**, not Expo Go.
- Continuous Native Generation: `ios/` and `android/` are generated, never committed (keep them in `.gitignore`) and never edited by hand. Native settings go only through `app.config.ts` and config plugins (AdMob, Firebase, expo-build-properties). Don't run `expo prebuild` as part of a task unless Dmytro asks; EAS runs it during the build.
- No backend in MVP. UI is English only; keep every user-facing string in `src/strings.ts` so i18n can be added later.

## Structure

```
app/                expo-router screens: index (home), game, stats, settings
src/engine/         pure TS: board, moves, notes, undo, validation, solvers, rater — no React / RN imports
src/puzzles/        bundled puzzle bank JSON + loader (picks unplayed ids)
src/store/          Zustand stores: game, stats, settings, wallet
src/ads/            AdMob wrappers: banner, interstitial policy, rewarded
src/purchases/      RevenueCat wrapper (remove ads)
src/ui/             shared components, theme.ts (tokens)
src/strings.ts      all UI copy
tools/generator/    Node script: generate → uniqueness check → rate → write bank
docs/               SPEC.md, ROADMAP.md, design/
```

## Engine rules

- Board is an 81-cell array indexed `r * 9 + c`; `0` = empty.
- Puzzle bank: per difficulty, an array of `{ id, p, s }` where `p` (puzzle, `.` = empty) and `s` (solution) are 81-char strings.
- Every puzzle has exactly one solution (backtracking solver counts solutions, stops at 2).
- Difficulty = the hardest technique the human-style solver needs:
  - Easy: naked / hidden singles
  - Medium: + naked / hidden pairs, pointing pairs
  - Hard: + triples, box/line reduction, X-Wing
  - Expert: + XY-Wing, Swordfish, simple chains
  - Needs guessing → rejected.
- The human-style solver returns steps `{ technique, cells, digit }`; hints with explanations (v1.1) reuse it.
- Engine functions are pure and unit-tested, including at least one known grid per technique.

## Game rules (MVP)

- Mistake limit 3 (can be turned off in Settings). On the third mistake a **bottom sheet** slides over the board: *Second chance* (rewarded ad), *Restart this puzzle*, *New game*.
- *Hint* (rewarded ad) reveals the correct digit in the selected cell.
- Autosave the current game after every move. Stats per difficulty: played, won, best / average time, current / best streak.
- Hints and second chances go through the **wallet** store (`balance`, `earn`, `spend`) so a coin currency can be added later (RevenueCat virtual currency) without touching game code.

## Ads rules

- **Rewarded**: only after an explicit tap; the button is disabled until an ad is loaded.
- **Interstitial**: only between a completed board and the win screen — never on a tap that does something else. Driven by Remote Config: `interstitial_first_after_games` = 2, `interstitial_every_n_games` = 3, `interstitial_min_interval_sec` = 180. Preload the next one after close.
- **Banner** (adaptive): Home and Stats only. A game-screen banner exists in code behind Remote Config `banner_on_game_screen` (default `false`); the game layout must shrink to fit it when on.
- No app-open ads. Owning `remove_ads` removes banners and interstitials; rewarded stays available.
- Audience 13+, not designed for children.

## Design — paper style

Mockups in `docs/design/*.dc.html` (they need the design-canvas runtime to render, but the inline styles are the source of truth for sizes and colors). Put tokens in `src/ui/theme.ts`:

| Token | Value |
| --- | --- |
| paper (background, subtle dot grain) | `#F5F1E8` |
| sheet / cells / keys | `#FBF8F1` |
| ink (text, thick lines, borders) | `#1F1D1A` |
| graphite (secondary text, notes) | `#5E5850` |
| rule (thin grid lines, dividers) | `#CBBFA8` |
| accent ink-blue (user digits, primary buttons) | `#2B4C8C` |
| error red pencil (wavy underline) | `#A8372B` |
| highlight: selected / peers / same digit / error cell | `#E9D58C` / `#F1EAD3` / `#DCE3F0` / `#F2D9D3` |

- Fonts: Literata for headings and digits (givens 600, user entries 400 in accent), Inter for UI.
- Grid: 2px ink outer and box lines, 1px rule lines. Keypad is **3×3** (mirrors a box), each key shows the digit and how many are left.
- Radius 4px, borders 1.5px ink, no shadows. Touch targets ≥ 44px. No fake status bars.
- Dark theme: derived later from the same token names.

## Commands

Update this section as scripts are added.

- `npm test` — all tests
- `npm run generate` — rebuild the puzzle bank
- `npx expo start --dev-client`
- `eas build --profile development --platform android`
