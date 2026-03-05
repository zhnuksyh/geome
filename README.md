# Geome

A geometric Boolean puzzle game inspired by **Bauhaus** and **De Stijl** aesthetics. Players use geometric primitives and Boolean logic to recreate target shapes.

## How It Works

Each level presents a **target shape** rendered as a faint ghost on the canvas. Your goal is to recreate it by placing, resizing, rotating, and combining geometric primitives using Boolean operations — achieving **95%+ match precision** to advance.

### Primitives
- **Circle** · **Square** · **Triangle**

### Boolean Operations
- **Union** — combine shapes
- **Subtract** — cut one shape from another
- **Intersect** — keep only the overlap
- **XOR** — keep everything except the overlap

### Controls
| Action | Input |
|--------|-------|
| Add / Select & Drag | Click on canvas |
| Resize | Scroll wheel |
| Rotate | Shift + Scroll wheel |
| Reorder layers | `[` / `]` keys |
| Delete shape | `Delete` / `Backspace` |
| Clear canvas | `C` key |

## Tech Stack

- **React 19** + **TypeScript**
- **Vite 6** (build & dev server)
- **Tailwind CSS v4**
- **HTML5 Canvas API** (dual-canvas rendering with offscreen compositing)
- **lucide-react** (icons)

## Accuracy Scoring

Match precision is calculated using an **Intersection-over-Union (IoU)** algorithm that reads raw pixel data across the target and game canvases. Reach **95%** to complete a level.

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

## License

MIT
