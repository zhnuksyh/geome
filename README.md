# Geome

A geometric Boolean puzzle game inspired by **Bauhaus** and **De Stijl** aesthetics. Players use geometric primitives and Boolean logic to recreate target compositions with mathematical precision.

## Modes

### Campaign
10 handcrafted levels of increasing complexity. Each level presents a **target shape** rendered as a faint ghost on the canvas. Recreate it by placing, resizing, rotating, and combining primitives using Boolean operations — you need **95%+ match precision** to advance. Levels unlock sequentially.

### Sandbox
A free-composition mode with all tools unlocked and no target or scoring. Build anything you want, then save it to your personal gallery.

### Gallery
Browse and revisit all designs you've saved from Sandbox mode. Supports **export and import** as JSON so you can back up or share your collection. Click any saved piece to reopen it in Sandbox.

## Scoring

### Action Par
Each level has a move budget. Finalize attempts and Boolean operations count as moves. Beat the target within par to earn medals:

| Medal | Threshold |
|-------|-----------|
| ★★★ Gold | Moves ≤ gold par |
| ★★☆ Silver/Bronze | Moves ≤ bronze par |
| ★☆☆ Completed | Any valid completion |

Stars are saved per level and shown in the level select screen.

### IoU Precision
Match quality is calculated using a pixel-accurate **Intersection-over-Union (IoU)** algorithm on the dual canvas. 95% match is required to finalize a level.

## Primitives

| Shape | Key |
|-------|-----|
| Circle | `C` |
| Square | `S` |
| Triangle | `T` |
| Hexagon | `H` |
| Semicircle | `E` |
| Pentagon | — |
| Rhombus | — |
| Ellipse | — |

## Boolean Operations

| Operation | Key | Effect |
|-----------|-----|--------|
| Union | `1` | Add shape to composition |
| Subtract | `2` | Cut shape from layer below |
| Intersect | `3` | Keep only overlapping area |
| XOR | `4` | Keep everything except the overlap |

## Controls

| Category | Shortcut | Action |
|----------|----------|--------|
| **Tools** | `V` | Select / Move |
| | `C S T H E` | Place primitive shape |
| | `X` | Slicer Tool |
| **Editing** | `Delete` / `Backspace` | Delete selected |
| | `Ctrl+D` | Duplicate selected |
| | `Ctrl+Z` / `Ctrl+Shift+Z` | Undo / Redo |
| | `Ctrl+Shift+X` | Clear canvas |
| **Transform** | Scroll | Resize selected (30px steps with grid on) |
| | `Shift+Scroll` | Rotate selected (15° steps) |
| **Layers** | `[` / `]` | Send backward / bring forward |
| **View** | `G` | Toggle snap grid |
| | `Space` (hold) | Peek at target shape |

## Snap Grid

Press `G` to toggle the **30px snap grid**. All target shapes are aligned to this grid — enabling the grid is the recommended way to achieve precise level solutions.

## Themes

Three visual themes, switchable at any time from the main menu or in-game:
- **Light** — clean white background
- **Dark** — deep charcoal palette
- **Neon** — high-contrast cyan on near-black

## Achievements

Hidden achievements unlock based on play patterns (speed, efficiency, precision, exploration). An animated toast appears when one triggers.

## Tech Stack

- **React 19** + **TypeScript 5.7**
- **Vite 6** — dev server and production bundler
- **Tailwind CSS v4** — utility-first styling with CSS custom properties for theming
- **HTML5 Canvas API** — dual-canvas rendering (game layer + target reference), offscreen compositing
- **Web Audio API** — procedural SFX engine with oscillators, no audio files for SFX
- **LocalStorage** — persists level progress, ratings, theme, grid state, and gallery

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

## Build

```bash
npm run build
```

Outputs to `dist/`. Configured for GitHub Pages deployment at `/geome/` base path.

## Dependencies

- [Lucide React](https://lucide.dev) — icon library
- [Canvas Confetti](https://www.npmjs.com/package/canvas-confetti) — celebration effects

---

*Made by Daimon*
