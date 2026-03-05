// ============================================================================
// Type Definitions for Geome
// ============================================================================

/** Available geometric primitive types */
export type ShapeType = 'circle' | 'square' | 'triangle';

/** Canvas composite operations used for Boolean logic */
export type OpType = 'source-over' | 'destination-out' | 'destination-in' | 'xor';

/** A shape placed on the game canvas */
export interface ShapeObj {
    id: string;
    type: ShapeType;
    x: number;
    y: number;
    size: number;
    rotation: number;
    op: OpType;
}

/** A level definition with a title and a setup function that draws the target */
export interface LevelDef {
    title: string;
    setup: (ctx: CanvasRenderingContext2D) => void;
}
