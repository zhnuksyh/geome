```
  ██████╗ ███████╗ ██████╗ ███╗   ███╗███████╗
 ██╔════╝ ██╔════╝██╔═══██╗████╗ ████║██╔════╝
 ██║  ███╗█████╗  ██║   ██║██╔████╔██║█████╗
 ██║   ██║██╔══╝  ██║   ██║██║╚██╔╝██║██╔══╝
 ╚██████╔╝███████╗╚██████╔╝██║ ╚═╝ ██║███████╗
  ╚═════╝ ╚══════╝ ╚═════╝ ╚═╝     ╚═╝╚══════╝
```

> **Construct the target. Precision is mandatory.**

A geometric Boolean puzzle game built on **Bauhaus** and **De Stijl** principles. Place primitives, apply Boolean logic, match the target silhouette with 95%+ pixel accuracy — or the form is rejected.

---

## Modes

```
┌─────────────┐  ┌─────────────┐  ┌─────────────┐
│  CAMPAIGN   │  │   SANDBOX   │  │   GALLERY   │
│             │  │             │  │             │
│ 10 curated  │  │ All tools.  │  │ Browse and  │
│ levels of   │  │ No target.  │  │ revisit all │
│ increasing  │  │ No scoring. │  │ saved work. │
│ complexity. │  │ Pure form.  │  │ Export JSON.│
└─────────────┘  └─────────────┘  └─────────────┘
```

---

## How It Works

1. A **target silhouette** appears faintly on the canvas
2. Place geometric primitives — circle, square, triangle, and more
3. Apply **Boolean operations** to add, subtract, intersect, or XOR shapes
4. Hit **Finalize** once your composition reaches **≥ 95% IoU match**
5. Fewer moves = more stars ★

Match quality is measured using pixel-accurate **Intersection-over-Union (IoU)** on a dual-canvas render.

---

## Primitives

| Shape | Key | Shape | Key |
|-------|-----|-------|-----|
| Circle | `C` | Pentagon | `P` |
| Square | `S` | Rhombus | `R` |
| Triangle | `T` | Ellipse | `L` |
| Hexagon | `H` | Semicircle | `E` |

---

## Boolean Operations

| # | Operation | Effect |
|---|-----------|--------|
| `1` | **Union** | Merge shape into composition |
| `2` | **Subtract** | Cut shape from layer below |
| `3` | **Intersect** | Keep only overlapping area |
| `4` | **XOR** | Keep everything except the overlap |

---

## Controls

| Action | Shortcut |
|--------|----------|
| Select / Move | `V` |
| Place shape | `C` `S` `T` `H` `E` `P` `R` `L` |
| Slicer tool | `X` |
| Delete selected | `Del` / `Backspace` |
| Duplicate | `Ctrl+D` |
| Undo / Redo | `Ctrl+Z` / `Ctrl+Shift+Z` |
| Clear canvas | `Ctrl+Shift+X` |
| Resize shape | `Scroll` |
| Rotate shape | `Shift+Scroll` |
| Layer order | `[` / `]` |
| Snap grid | `G` |
| Peek at target | `Space` (hold) |
| Boolean ops | `1` `2` `3` `4` |

---

## Star Rating

Each level has a move par. Efficiency earns stars:

```
★★★  Gold      Moves ≤ gold par
★★☆  Silver    Moves ≤ bronze par
★☆☆  Complete  Any valid finish
```

---

## Achievements

| Icon | Achievement | How to Unlock |
|------|-------------|---------------|
| 🌱 | First Composition | Complete your first level |
| 🏆 | Completionist | Complete all campaign levels |
| ⚡ | Speed Demon | Solve a level in under 10 seconds |
| 🥇 | Efficiency Expert | Earn Gold on any level |
| ✨ | Perfectionist | Hit 100% precision |
| ⬛ | Minimalist | Complete a level with only 1 shape |
| 🎯 | Boolean Pioneer | Apply your first Boolean operation |
| 🔀 | Boolean Master | Use all 4 operations in one level |
| 🏗️ | The Architect | Place 10+ shapes in a single level |
| 🖼️ | Gallery Artist | Save your first design to the Gallery |

---

## Snap Grid

Press `G` to toggle the **30 px snap grid**. All target shapes align to this grid — enabling it is the recommended path to precise solutions.

---

## Themes

Switch any time from the main menu or in-game:

```
○ Light   clean white, black ink
● Dark    deep charcoal palette
◈ Neon    high-contrast cyan on near-black
```

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| UI | React 19 + TypeScript 5.7 |
| Build | Vite 6 |
| Styling | Tailwind CSS v4 + CSS custom properties |
| Rendering | HTML5 Canvas API (dual-canvas, offscreen compositing) |
| Audio | Web Audio API — procedural oscillator SFX, no audio files |
| Persistence | LocalStorage (progress, ratings, gallery, theme) |
| Icons | Lucide React |
| Effects | canvas-confetti |

---

## Getting Started

```bash
npm install
npm run dev
```

Open `http://localhost:5173`

```bash
npm run build   # outputs to dist/
```

Configured for GitHub Pages deployment at `/geome/` base path.
