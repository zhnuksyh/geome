import type { ShapeType, LevelDef } from '../types/game';

/** Internal canvas resolution (logical pixels) */
export const CANVAS_SIZE = 600;

/** Generates a unique ID for new shapes */
export const generateId = () => Math.random().toString(36).substr(2, 9);

/**
 * Returns a standard Path2D for exact hit detection and rendering.
 * Works perfectly with ctx.isPointInPath() for rotated shapes.
 */
export const getShapePath = (type: ShapeType, size: number): Path2D => {
    const path = new Path2D();
    if (type === 'circle') {
        path.arc(0, 0, size, 0, Math.PI * 2);
    } else if (type === 'square') {
        path.rect(-size, -size, size * 2, size * 2);
    } else if (type === 'triangle') {
        const r = size;
        path.moveTo(0, -r);
        path.lineTo(r * Math.sqrt(3) / 2, r / 2);
        path.lineTo(-r * Math.sqrt(3) / 2, r / 2);
        path.closePath();
    }
    return path;
};

/**
 * Helper to draw a shape directly (used primarily for rendering targets).
 */
export const drawShape = (
    ctx: CanvasRenderingContext2D,
    type: ShapeType,
    op: GlobalCompositeOperation,
    x: number,
    y: number,
    size: number,
    rotation: number = 0,
    fillStyle: string = 'black'
) => {
    ctx.globalCompositeOperation = op;
    ctx.fillStyle = fillStyle;
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(rotation);
    ctx.fill(getShapePath(type, size));
    ctx.restore();
};

export const LEVELS: LevelDef[] = [
    {
        title: "Vesica Piscis",
        targetShapes: [
            { type: 'circle', op: 'source-over', x: 270, y: 300, size: 90, rotation: 0 },
            { type: 'circle', op: 'destination-in', x: 330, y: 300, size: 90, rotation: 0 }
        ]
    },
    {
        title: "Lunar Subtract",
        targetShapes: [
            { type: 'circle', op: 'source-over', x: 300, y: 300, size: 120, rotation: 0 },
            { type: 'circle', op: 'destination-out', x: 330, y: 270, size: 90, rotation: 0 }
        ]
    },
    {
        title: "The XOR Eye",
        targetShapes: [
            { type: 'square', op: 'source-over', x: 300, y: 300, size: 120, rotation: Math.PI / 4 },
            { type: 'circle', op: 'xor', x: 300, y: 300, size: 60, rotation: 0 }
        ]
    },
    {
        title: "Constructivist Gate",
        targetShapes: [
            { type: 'square', op: 'source-over', x: 300, y: 300, size: 150, rotation: 0 },
            { type: 'triangle', op: 'source-over', x: 300, y: 150, size: 150, rotation: 0 },
            { type: 'circle', op: 'destination-out', x: 300, y: 360, size: 60, rotation: 0 }
        ]
    }
];
