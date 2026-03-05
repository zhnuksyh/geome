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
 * Draws a single shape on the target canvas with the given composite operation.
 * Used to build multi-shape target compositions.
 */
export const drawTargetShape = (
    tCtx: CanvasRenderingContext2D,
    op: GlobalCompositeOperation,
    type: ShapeType,
    x: number,
    y: number,
    size: number,
    rotation = 0
) => {
    tCtx.globalCompositeOperation = op;
    tCtx.save();
    tCtx.translate(x, y);
    tCtx.rotate(rotation);
    tCtx.fill(getShapePath(type, size));
    tCtx.restore();
};

/** Game level definitions */
export const LEVELS: LevelDef[] = [
    {
        title: "Vesica Piscis",
        setup: (ctx) => {
            ctx.fillStyle = "black";
            drawTargetShape(ctx, 'source-over', 'circle', 250, 300, 100);
            drawTargetShape(ctx, 'destination-in', 'circle', 350, 300, 100);
        }
    },
    {
        title: "Lunar Subtract",
        setup: (ctx) => {
            ctx.fillStyle = "black";
            drawTargetShape(ctx, 'source-over', 'circle', 300, 300, 130);
            drawTargetShape(ctx, 'destination-out', 'circle', 360, 260, 110);
        }
    },
    {
        title: "The XOR Eye",
        setup: (ctx) => {
            ctx.fillStyle = "black";
            drawTargetShape(ctx, 'source-over', 'square', 300, 300, 120, Math.PI / 4);
            drawTargetShape(ctx, 'xor', 'circle', 300, 300, 90);
        }
    },
    {
        title: "Constructivist Gate",
        setup: (ctx) => {
            ctx.fillStyle = "black";
            drawTargetShape(ctx, 'source-over', 'square', 300, 300, 140);
            drawTargetShape(ctx, 'source-over', 'triangle', 300, 160, 140);
            drawTargetShape(ctx, 'destination-out', 'circle', 300, 340, 80);
        }
    }
];
