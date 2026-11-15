# Design mockups

Source files of the design canvas: https://claude.ai/artifact/Nrz26nQxXEDL5coZbZ36uH

Each `*.dc.html` is one 390×844 phone screen. They need the canvas runtime (`support.js`) to render,
so open the link above to view them. In code, treat the inline styles as the source of truth for
sizes, spacing and colors; the design tokens are summarized in `CLAUDE.md`.

| File | Screen |
| --- | --- |
| Main.dc.html | Home |
| Game.dc.html | Game (selected cell, notes, one mistake, 3×3 keypad) |
| Win.dc.html | Solved |
| Lose.dc.html | Three mistakes — bottom sheet over the game |
| Stats.dc.html | Stats |
| Settings.dc.html | Settings |
