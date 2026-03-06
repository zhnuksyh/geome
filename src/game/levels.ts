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
    } else if (type === 'semicircle') {
        path.arc(0, 0, size, 0, Math.PI);
        path.closePath();
    } else if (type === 'hexagon') {
        const r = size;
        for (let i = 0; i < 6; i++) {
            const angle = (Math.PI / 3) * i - (Math.PI / 2); // Start at top
            const x = r * Math.cos(angle);
            const y = r * Math.sin(angle);
            if (i === 0) path.moveTo(x, y);
            else path.lineTo(x, y);
        }
        path.closePath();
    } else if (type === 'pentagon') {
        const r = size;
        for (let i = 0; i < 5; i++) {
            const angle = (Math.PI * 2 / 5) * i - (Math.PI / 2); // Start at top
            const x = r * Math.cos(angle);
            const y = r * Math.sin(angle);
            if (i === 0) path.moveTo(x, y);
            else path.lineTo(x, y);
        }
        path.closePath();
    } else if (type === 'rhombus') {
        const r = size;
        path.moveTo(0, -r);
        path.lineTo(r * 0.7, 0);
        path.lineTo(0, r);
        path.lineTo(-r * 0.7, 0);
        path.closePath();
    } else if (type === 'ellipse') {
        path.ellipse(0, 0, size, size * 0.6, 0, 0, Math.PI * 2);
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
    fillStyle: string = 'black',
    clipPlanes?: { px: number, py: number, nx: number, ny: number }[]
) => {
    ctx.globalCompositeOperation = op;
    ctx.fillStyle = fillStyle;
    ctx.save();

    if (clipPlanes && clipPlanes.length > 0) {
        clipPlanes.forEach(plane => {
            ctx.beginPath();
            ctx.translate(plane.px, plane.py);
            const angle = Math.atan2(plane.ny, plane.nx);
            ctx.rotate(angle);
            // Normal points +X, so valid region is X >= 0
            ctx.rect(0, -9999, 9999, 19998);
            ctx.rotate(-angle);
            ctx.translate(-plane.px, -plane.py);
            ctx.clip();
        });
    }

    ctx.translate(x, y);
    ctx.rotate(rotation);
    ctx.fill(getShapePath(type, size));
    ctx.restore();
};

export const LEVELS: LevelDef[] = [
    {
        title: "The Solitary Dot",
        par: { bronze: 3, silver: 2, gold: 1 },
        allowedTools: ['circle'],
        targetShapes: [
            { type: 'circle', op: 'source-over', x: 300, y: 300, size: 100, rotation: 0 }
        ]
    },
    {
        title: "Vesica Piscis",
        par: { bronze: 5, silver: 3, gold: 2 },
        allowedTools: ['circle'],
        targetShapes: [
            { type: 'circle', op: 'source-over', x: 270, y: 300, size: 90, rotation: 0 },
            { type: 'circle', op: 'destination-in', x: 330, y: 300, size: 90, rotation: 0 }
        ]
    },
    {
        title: "Lunar Eclipse",
        par: { bronze: 5, silver: 3, gold: 2 },
        allowedTools: ['circle'],
        targetShapes: [
            { type: 'circle', op: 'source-over', x: 300, y: 300, size: 120, rotation: 0 },
            { type: 'circle', op: 'destination-out', x: 340, y: 260, size: 90, rotation: 0 }
        ]
    },
    {
        title: "The XOR Eye",
        par: { bronze: 5, silver: 3, gold: 2 },
        allowedTools: ['circle', 'square'],
        targetShapes: [
            { type: 'square', op: 'source-over', x: 300, y: 300, size: 120, rotation: Math.PI / 4 },
            { type: 'circle', op: 'xor', x: 300, y: 300, size: 60, rotation: 0 }
        ]
    },
    {
        title: "Constructivist Gate",
        par: { bronze: 6, silver: 4, gold: 3 },
        allowedTools: ['circle', 'square', 'triangle'],
        targetShapes: [
            { type: 'square', op: 'source-over', x: 300, y: 300, size: 150, rotation: 0 },
            { type: 'triangle', op: 'source-over', x: 300, y: 150, size: 150, rotation: 0 },
            { type: 'circle', op: 'destination-out', x: 300, y: 360, size: 60, rotation: 0 }
        ]
    },
    {
        title: "Archway",
        par: { bronze: 5, silver: 3, gold: 2 },
        allowedTools: ['square', 'semicircle'],
        targetShapes: [
            { type: 'square', op: 'source-over', x: 300, y: 350, size: 100, rotation: 0 },
            { type: 'semicircle', op: 'source-over', x: 300, y: 250, size: 100, rotation: -Math.PI / 2 },
            { type: 'square', op: 'destination-out', x: 300, y: 380, size: 60, rotation: 0 },
            { type: 'semicircle', op: 'destination-out', x: 300, y: 320, size: 60, rotation: -Math.PI / 2 }
        ]
    },
    {
        title: "Hexagonal Ring",
        par: { bronze: 6, silver: 4, gold: 2 },
        allowedTools: ['hexagon', 'circle'],
        targetShapes: [
            { type: 'hexagon', op: 'source-over', x: 300, y: 300, size: 150, rotation: 0 },
            { type: 'circle', op: 'destination-out', x: 300, y: 300, size: 90, rotation: 0 }
        ]
    },
    {
        title: "The Gemstone",
        par: { bronze: 6, silver: 4, gold: 3 },
        allowedTools: ['rhombus', 'triangle', 'square'],
        targetShapes: [
            { type: 'rhombus', op: 'source-over', x: 300, y: 300, size: 160, rotation: 0 },
            { type: 'triangle', op: 'destination-out', x: 300, y: 180, size: 60, rotation: 0 },
            { type: 'triangle', op: 'destination-out', x: 300, y: 420, size: 60, rotation: Math.PI }
        ]
    },
    {
        title: "Saturn's Orbit",
        par: { bronze: 7, silver: 5, gold: 3 },
        allowedTools: ['ellipse', 'circle', 'square'],
        targetShapes: [
            { type: 'circle', op: 'source-over', x: 300, y: 300, size: 80, rotation: 0 },
            { type: 'ellipse', op: 'xor', x: 300, y: 300, size: 200, rotation: Math.PI / 6 },
            { type: 'ellipse', op: 'destination-out', x: 300, y: 300, size: 180, rotation: Math.PI / 6 }
        ]
    },
    {
        title: "Bauhaus Crown",
        par: { bronze: 10, silver: 7, gold: 5 },
        allowedTools: ['pentagon', 'semicircle', 'rhombus', 'triangle'],
        targetShapes: [
            { type: 'pentagon', op: 'source-over', x: 300, y: 280, size: 140, rotation: 0 },
            { type: 'rhombus', op: 'source-over', x: 300, y: 360, size: 120, rotation: Math.PI / 2 },
            { type: 'semicircle', op: 'destination-out', x: 300, y: 460, size: 100, rotation: -Math.PI / 2 },
            { type: 'triangle', op: 'xor', x: 300, y: 160, size: 80, rotation: Math.PI }
        ]
    }
];
