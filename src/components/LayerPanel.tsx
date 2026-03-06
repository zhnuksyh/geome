import { ArrowUp, ArrowDown, Copy, Trash2, Circle, Square, Triangle, Hexagon, PieChart, Combine, Minus, Target, Orbit } from 'lucide-react';
import type { ShapeObj, ShapeType, OpType } from '../types/game';
import { Button } from './ui/Button';

interface LayerPanelProps {
  shapes: ShapeObj[];
  activeShapeIds: string[];
  onSelectShape: (id: string, shiftKey: boolean) => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onDuplicate: () => void;
  onDelete: () => void;
}

const ShapeIcon = ({ type, className }: { type: ShapeType; className?: string }) => {
  if (type === 'circle') return <Circle className={className} />;
  if (type === 'square') return <Square className={className} />;
  if (type === 'triangle') return <Triangle className={className} />;
  if (type === 'hexagon') return <Hexagon className={className} />;
  if (type === 'semicircle') return <PieChart className={className} />;
  return null;
};

const OpIcon = ({ op, className }: { op: OpType; className?: string }) => {
  if (op === 'source-over') return <Combine className={className} />;
  if (op === 'destination-out') return <Minus className={className} />;
  if (op === 'destination-in') return <Target className={className} />;
  if (op === 'xor') return <Orbit className={className} />;
  return null;
};

const OpLabel = (op: OpType) => {
  if (op === 'source-over') return 'Union';
  if (op === 'destination-out') return 'Subtract';
  if (op === 'destination-in') return 'Intersect';
  if (op === 'xor') return 'XOR';
  return op;
};

export function LayerPanel({
  shapes,
  activeShapeIds,
  onSelectShape,
  onMoveUp,
  onMoveDown,
  onDuplicate,
  onDelete,
}: LayerPanelProps) {
  if (shapes.length === 0) return null;

  return (
    <div className="flex flex-col bg-[var(--panel-bg)] border-[3px] border-[var(--panel-border)] shadow-[8px_8px_0px_0px_var(--shadow-color)] w-[320px] max-h-[calc(100vh-320px)]">
      <div className="bg-[var(--text-color)] text-[var(--bg-color)] p-2 text-center text-[10px] font-bold tracking-widest uppercase">
        Layers
      </div>

      {/* Shapes List (Reversed visually so newest/top is at the top) */}
      <div className="flex-1 overflow-y-auto p-2 flex flex-col gap-1">
        {[...shapes].reverse().map((shape, reversedIndex) => {
          // Calculate the true index in the original array
          const trueIndex = shapes.length - 1 - reversedIndex;
          const isSelected = activeShapeIds.includes(shape.id);
          const isBaseLayer = trueIndex === 0;

          return (
            <button
              key={shape.id}
              onClick={(e) => onSelectShape(shape.id, e.shiftKey)}
              className={`flex items-center gap-3 p-2 text-left border-2 transition-colors cursor-pointer ${
                isSelected
                  ? 'bg-[var(--text-color)] text-[var(--panel-bg)] border-[var(--panel-border)]'
                  : 'bg-[var(--panel-bg)] border-transparent hover:border-[var(--text-color)] text-[var(--text-color)]'
              }`}
            >
              <ShapeIcon type={shape.type} className="w-4 h-4 shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="text-xs font-bold uppercase truncate">
                  {shape.type} {trueIndex + 1}
                </div>
                <div className="text-[9px] text-[var(--text-color)] opacity-70 flex items-center gap-1 uppercase tracking-wider">
                  <OpIcon op={isBaseLayer ? 'source-over' : shape.op} className="w-3 h-3" />
                  {isBaseLayer ? 'Base (Union)' : OpLabel(shape.op)}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Action Bar */}
      <div className="p-2 border-t-[3px] border-[var(--panel-border)] bg-[var(--bg-color)] flex justify-between gap-1 relative z-10">
        <div className="flex gap-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={onMoveUp}
            disabled={activeShapeIds.length === 0}
            title="Move Layer Up ([)"
            className="w-8 h-8 rounded-none border-2 border-transparent hover:border-[var(--text-color)] hover:bg-[var(--panel-bg)] text-[var(--text-color)]"
          >
            <ArrowUp size={14} />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={onMoveDown}
            disabled={activeShapeIds.length === 0}
            title="Move Layer Down (])"
            className="w-8 h-8 rounded-none border-2 border-transparent hover:border-[var(--text-color)] hover:bg-[var(--panel-bg)] text-[var(--text-color)]"
          >
            <ArrowDown size={14} />
          </Button>
        </div>
        <div className="flex gap-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={onDuplicate}
            disabled={activeShapeIds.length === 0}
            title="Duplicate Selected (Ctrl+D)"
            className="w-8 h-8 rounded-none border-2 border-transparent hover:border-[var(--text-color)] hover:bg-[var(--panel-bg)] text-[var(--accent-blue)]"
          >
            <Copy size={14} />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={onDelete}
            disabled={activeShapeIds.length === 0}
            title="Delete Selected (Del)"
            className="w-8 h-8 rounded-none border-2 border-transparent hover:border-[var(--text-color)] hover:bg-[var(--panel-bg)] text-[var(--accent-red)]"
          >
            <Trash2 size={14} />
          </Button>
        </div>
      </div>
    </div>
  );
}
