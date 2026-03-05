import { useRef, useCallback } from 'react';
import type { ShapeObj } from '../types/game';

const MAX_HISTORY = 50;

/**
 * Undo/redo history hook for shape state.
 * Wraps around the existing setShapes function to track changes.
 */
export function useHistory(
    shapes: ShapeObj[],
    setShapes: (value: ShapeObj[] | ((val: ShapeObj[]) => ShapeObj[])) => void
) {
    const undoStack = useRef<ShapeObj[][]>([]);
    const redoStack = useRef<ShapeObj[][]>([]);
    const lastSnapshot = useRef<string>(JSON.stringify(shapes));

    /** Push current state to undo stack before making a change */
    const pushHistory = useCallback(() => {
        const current = JSON.stringify(shapes);
        if (current !== lastSnapshot.current) {
            undoStack.current.push(JSON.parse(lastSnapshot.current));
            if (undoStack.current.length > MAX_HISTORY) {
                undoStack.current.shift();
            }
            redoStack.current = []; // Clear redo on new action
            lastSnapshot.current = current;
        }
    }, [shapes]);

    /** Snapshot the current state — call this after each meaningful user action */
    const snapshot = useCallback(() => {
        const current = JSON.stringify(shapes);
        if (current !== lastSnapshot.current) {
            undoStack.current.push(JSON.parse(lastSnapshot.current));
            if (undoStack.current.length > MAX_HISTORY) {
                undoStack.current.shift();
            }
            redoStack.current = [];
            lastSnapshot.current = current;
        }
    }, [shapes]);

    const undo = useCallback(() => {
        if (undoStack.current.length === 0) return;
        const prev = undoStack.current.pop()!;
        redoStack.current.push(JSON.parse(lastSnapshot.current));
        lastSnapshot.current = JSON.stringify(prev);
        setShapes(prev);
    }, [setShapes]);

    const redo = useCallback(() => {
        if (redoStack.current.length === 0) return;
        const next = redoStack.current.pop()!;
        undoStack.current.push(JSON.parse(lastSnapshot.current));
        lastSnapshot.current = JSON.stringify(next);
        setShapes(next);
    }, [setShapes]);

    const canUndo = undoStack.current.length > 0;
    const canRedo = redoStack.current.length > 0;

    return { snapshot, pushHistory, undo, redo, canUndo, canRedo };
}
