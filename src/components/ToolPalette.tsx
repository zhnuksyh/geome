import { Circle, Square, Triangle, Hexagon, PieChart, Combine, Minus, Target, Orbit, MousePointer2, Pentagon, Diamond, CircleDot } from 'lucide-react';
import type { ToolMode, OpType, ShapeType } from '../types/game';

interface ToolPaletteProps {
  activeTool: ToolMode;
  selectedOp: OpType;
  onSelectTool: (tool: ToolMode) => void;
  onSelectOp: (op: OpType) => void;
  onHoverOp: (op: OpType | null) => void;
  allowedTools: ShapeType[];
}

const PRIMITIVES = [
  { id: 'select' as ToolMode, icon: MousePointer2, label: 'Select', key: 'V' },
  { id: 'circle' as ToolMode, icon: Circle, label: 'Circle', key: 'C' },
  { id: 'square' as ToolMode, icon: Square, label: 'Square', key: 'S' },
  { id: 'triangle' as ToolMode, icon: Triangle, label: 'Triangle', key: 'T' },
  { id: 'hexagon' as ToolMode, icon: Hexagon, label: 'Hexagon', key: 'H' },
  { id: 'semicircle' as ToolMode, icon: PieChart, label: 'Semi', key: 'E' },
  { id: 'pentagon' as ToolMode, icon: Pentagon, label: 'Penta', key: 'P' },
  { id: 'rhombus' as ToolMode, icon: Diamond, label: 'Rhomb', key: 'R' },
  { id: 'ellipse' as ToolMode, icon: CircleDot, label: 'Ellipse', key: 'L' },
];

const OPERATIONS = [
  { id: 'source-over' as OpType, icon: Combine, label: 'Union', key: '1' },
  { id: 'destination-out' as OpType, icon: Minus, label: 'Subtra', key: '2' },
  { id: 'destination-in' as OpType, icon: Target, label: 'Inter', key: '3' },
  { id: 'xor' as OpType, icon: Orbit, label: 'XOR', key: '4' },
];

export function ToolPalette({ activeTool, selectedOp, onSelectTool, onSelectOp, onHoverOp, allowedTools }: ToolPaletteProps) {
  const visiblePrimitives = PRIMITIVES.filter(tool => tool.id === 'select' || allowedTools.includes(tool.id as ShapeType));
  
  return (
    <div className="mt-auto flex justify-center pointer-events-auto">
      <div className="bg-[var(--panel-bg)] border-[3px] border-[var(--panel-border)] shadow-[8px_8px_0px_0px_var(--shadow-color)] p-3 flex gap-6 items-center">
        {/* Primitives / Tools */}
        <div className="flex flex-col gap-2">
          <span className="text-[9px] font-bold text-[var(--text-color)] opacity-50 uppercase tracking-tighter text-center">
            Tools
          </span>
          <div className="flex gap-2">
            {visiblePrimitives.map((tool) => {
              const isActive = activeTool === tool.id;
              const Icon = tool.icon;
              return (
                <button
                  key={tool.id}
                  onClick={() => {
                    onSelectTool(tool.id);
                  }}
                  title={`${tool.label} (${tool.key})`}
                  className={`p-2 border-2 transition-all flex flex-col items-center justify-center text-[10px] font-bold tracking-widest uppercase w-[76px] h-[76px] shrink-0
                    ${
                      isActive
                        ? 'bg-[var(--accent-yellow)] text-black border-[var(--panel-border)] translate-x-1 translate-y-1'
                        : 'bg-[var(--panel-bg)] border-[var(--panel-border)] text-[var(--text-color)] hover:-translate-y-1 shadow-[4px_4px_0px_0px_var(--shadow-color)]'
                    }`}
                >
                  <Icon className="w-5 h-5 mb-1" />
                  <span>{tool.label}</span>
                  <span className="text-[8px] opacity-50 mt-0.5">{tool.key}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="h-12 w-[2px] bg-[var(--grid-color)]" />

        {/* Boolean Operations */}
        <div className="flex flex-col gap-2">
          <span className="text-[9px] font-bold text-[var(--text-color)] opacity-50 uppercase tracking-tighter text-center">
            Boolean Logic
          </span>
          <div className="flex gap-2">
            {OPERATIONS.map((op) => {
              const isActive = selectedOp === op.id;
              const Icon = op.icon;
              return (
                <button
                  key={op.id}
                  onClick={() => {
                    onSelectOp(op.id);
                  }}
                  onMouseEnter={() => onHoverOp(op.id)}
                  onMouseLeave={() => onHoverOp(null)}
                  title={`${op.label} (${op.key})`}
                  className={`p-2 border-2 transition-transform duration-200 flex flex-col items-center justify-center text-[10px] font-bold tracking-widest uppercase w-[76px] h-[76px] shrink-0
                    ${
                      isActive
                        ? 'bg-[var(--accent-yellow)] text-black border-[var(--panel-border)] translate-x-1 translate-y-1'
                        : 'bg-[var(--panel-bg)] border-[var(--panel-border)] text-[var(--text-color)] hover:-translate-y-1 shadow-[4px_4px_0px_0px_var(--shadow-color)]'
                    }`}
                >
                  <Icon className="w-5 h-5 mb-1 shrink-0" />
                  <span className="truncate w-full text-center">{op.label}</span>
                  <span className="text-[8px] opacity-50 mt-0.5">{op.key}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
