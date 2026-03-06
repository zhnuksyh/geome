// ============================================================================
// Type Definitions for Geome
// ============================================================================

/** Available geometric primitive types */
export type ShapeType = 'circle' | 'square' | 'triangle' | 'semicircle' | 'hexagon';

/** Active tool selection (select mode vs primitive mode) */
export type ToolMode = 'select' | 'slice' | ShapeType;

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
    clipPlanes?: { px: number, py: number, nx: number, ny: number }[];
}

/** 
 * A level definition with a title and an array of target shapes. 
 * targetShapes are used for rendering the goal and distance-based snapping.
 */
export interface LevelDef {
    title: string;
    targetShapes: Omit<ShapeObj, "id">[];
}
