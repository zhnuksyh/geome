# Geome

A geometric Boolean puzzle game inspired by **Bauhaus** and **De Stijl** aesthetics. Players use geometric primitives and Boolean logic to recreate target shapes.

## How It Works

Each level presents a **target shape** rendered as a faint ghost on the canvas. Your goal is to recreate it by placing, resizing, rotating, and combining geometric primitives using Boolean operations — achieving **95%+ match precision** to advance.

### Visual & Logical Precision
Match precision is calculated using an **Intersection-over-Union (IoU)** pixel reading algorithm.
Each level also challenges you to achieve the geometry within an **Action Par**. You can freely manipulate objects, but committing Boolean Logic counts towards your Action limit.

### Features
- **Dynamic Theming:** Instantly toggle between Light, Dark, and Neon Color Themes dynamically throughout gameplay.
- **Fluid Transformation:** Native affine Canvas transformations with friction-based physics interactions for free-movement dragging + dropping.
- **Procedural Logic Engine:** Canvas representations process nested Boolean masks (`source-over`, `destination-in`, `destination-out`, `xor`).

### Primitives
- **Circle** · **Square** · **Triangle** · **Hexagon** · **Semicircle**

### Boolean Operations
- **Union [1]** — combine shapes
- **Subtract [2]** — cut one shape from another
- **Intersect [3]** — keep only the overlap
- **XOR [4]** — keep everything except the overlap

### Controls

| Category | Shortcut | Action |
|----------|----------|--------|
| **Tools** | `V` | Select / Move (deselect tool) |
| | `C`, `S`, `T`, `H`, `E` | Primitive shapes |
| | `X` | Slicer Tool |
| **Editing** | `Delete` / `Backspace` | Delete selected shape |
| | `Ctrl+D` | Duplicate selected shape |
| | `Ctrl+Z` / `Ctrl+Shift+Z` | Undo / Redo |
| **Canvas** | `Ctrl+Shift+X` | Clear entire canvas |
| | Click / Drag | Select & Toss Geometry |
| **Transform** | Scroll | Resize selected shape |
| | `Shift+Scroll` | Rotate selected shape |
| **Layers** | `[` / `]` | Send backward / bring forward |

## Tech Stack

- **React 19** + **TypeScript**
- **Vite 6**
- **Tailwind CSS v4**
- **HTML5 Canvas API** (dual-canvas rendering with offscreen compositing)

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

## Built with
- [Lucide React](https://lucide.dev)
- [Canvas Confetti](https://www.npmjs.com/package/canvas-confetti)
