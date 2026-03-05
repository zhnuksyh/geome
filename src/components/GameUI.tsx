import { Orbit, Layers, RotateCw, Trash2, Undo2, Copy, Keyboard } from 'lucide-react';
import { Button } from './ui/Button';
import { ScorePanel } from './ScorePanel';
import { ToolPalette } from './ToolPalette';
import { LayerPanel } from './LayerPanel';
import type { ToolMode, OpType, ShapeObj } from '../types/game';

interface GameUIProps {
  currentLevel: number;
  accuracy: number;
  activeTool: ToolMode;
  selectedOp: OpType;
  shapes: ShapeObj[];
  activeShapeIds: string[];
  onSelectTool: (tool: ToolMode) => void;
  onSelectOp: (op: OpType) => void;
  onClear: () => void;
  onFinalize: () => void;
  onSelectLevel: (levelIndex: number) => void;
  onSelectShape: (id: string, shiftKey: boolean) => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onDuplicate: () => void;
  onDelete: () => void;
}

export function GameUI({
  currentLevel,
  accuracy,
  activeTool,
  selectedOp,
  shapes,
  activeShapeIds,
  onSelectTool,
  onSelectOp,
  onClear,
  onFinalize,
  onSelectLevel,
  onSelectShape,
  onMoveUp,
  onMoveDown,
  onDuplicate,
  onDelete,
}: GameUIProps) {
  return (
    <div className="fixed inset-0 z-10 flex flex-col p-8 pointer-events-none">
      {/* Top Header */}
      <div className="flex justify-between items-start pointer-events-auto">
        {/* Status Panel */}
        <ScorePanel 
          currentLevel={currentLevel} 
          accuracy={accuracy} 
          onSelectLevel={onSelectLevel} 
        />

        {/* Action Buttons */}
        <div className="flex flex-col gap-3">
          <button onClick={onFinalize} className="relative group block">
            <div className="absolute inset-0 bg-black translate-x-1.5 translate-y-1.5 transition-transform group-hover:translate-x-2 group-hover:translate-y-2" />
            <div className="relative bg-[#E63946] text-white border-2 border-black px-8 py-4 font-bold tracking-widest uppercase transition-transform group-active:translate-x-1.5 group-active:translate-y-1.5">
              Finalize Form
            </div>
          </button>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClear}
            className="self-end text-[10px] font-bold uppercase tracking-widest hover:text-[#E63946]"
          >
            Clear Canvas [Ctrl+Shift+X]
          </Button>
        </div>
      </div>

      {/* Layer Panel (Left Side) */}
      <LayerPanel 
        shapes={shapes}
        activeShapeIds={activeShapeIds}
        onSelectShape={onSelectShape}
        onMoveUp={onMoveUp}
        onMoveDown={onMoveDown}
        onDuplicate={onDuplicate}
        onDelete={onDelete}
      />

      {/* Instructions Panel (Right Side) */}
      <div className="absolute right-8 top-48 flex flex-col gap-3 text-right">
        <div className="text-[10px] leading-relaxed text-gray-400 uppercase font-bold">
          <p className="flex items-center justify-end gap-2 mb-1">
            <Keyboard size={12} /> V Select · C S T Tools
          </p>
          <p className="flex items-center justify-end gap-2 mb-1">
            <Keyboard size={12} /> 1 2 3 4 Operations
          </p>
          <p className="flex items-center justify-end gap-2 mb-1">
            <Orbit size={12} /> Drag to Select/Move
          </p>
          <p className="flex items-center justify-end gap-2 mb-1">
            <Layers size={12} /> Scroll to Resize
          </p>
          <p className="flex items-center justify-end gap-2 mb-1">
            <RotateCw size={12} /> Shift+Scroll to Rotate
          </p>
          <p className="flex items-center justify-end gap-2 mb-1">
            <Layers size={12} /> [ ] Reorder Layers
          </p>
          <p className="flex items-center justify-end gap-2 mb-1">
            <Copy size={12} /> Ctrl+D Duplicate
          </p>
          <p className="flex items-center justify-end gap-2 mb-1">
            <Undo2 size={12} /> Ctrl+Z / Ctrl+Shift+Z
          </p>
          <p className="flex items-center justify-end gap-2">
            <Trash2 size={12} /> Del to Remove · Esc Deselect
          </p>
        </div>
      </div>

      {/* Bottom Tool Palette */}
      <ToolPalette
        activeTool={activeTool}
        selectedOp={selectedOp}
        onSelectTool={onSelectTool}
        onSelectOp={onSelectOp}
      />
    </div>
  );
}
