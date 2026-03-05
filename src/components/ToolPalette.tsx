import { Circle, Square, Triangle, Combine, Minus, Target, Orbit } from 'lucide-react';
import type { ShapeType, OpType } from '../types/game';

interface ToolPaletteProps {
  selectedShape: ShapeType;
  selectedOp: OpType;
  onSelectShape: (shape: ShapeType) => void;
  onSelectOp: (op: OpType) => void;
}

const PRIMITIVES = [
  { id: 'circle' as ShapeType, icon: Circle, label: 'Circle' },
  { id: 'square' as ShapeType, icon: Square, label: 'Square' },
  { id: 'triangle' as ShapeType, icon: Triangle, label: 'Triangle' },
];

const OPERATIONS = [
  { id: 'source-over' as OpType, icon: Combine, label: 'Union' },
  { id: 'destination-out' as OpType, icon: Minus, label: 'Subtract' },
  { id: 'destination-in' as OpType, icon: Target, label: 'Intersect' },
  { id: 'xor' as OpType, icon: Orbit, label: 'XOR' },
];

export function ToolPalette({ selectedShape, selectedOp, onSelectShape, onSelectOp }: ToolPaletteProps) {
  return (
    <div className="mt-auto flex justify-center pointer-events-auto">
      <div className="bg-white border-[3px] border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-3 flex gap-6 items-center">
        {/* Primitives */}
        <div className="flex flex-col gap-2">
          <span className="text-[9px] font-bold text-gray-400 uppercase tracking-tighter text-center">
            Primitives
          </span>
          <div className="flex gap-2">
            {PRIMITIVES.map((tool) => {
              const isActive = selectedShape === tool.id;
              const Icon = tool.icon;
              return (
                <button
                  key={tool.id}
                  onClick={() => onSelectShape(tool.id)}
                  className={`p-3 border-2 transition-all flex flex-col items-center justify-center text-[10px] font-bold tracking-widest uppercase min-w-[70px]
                    ${
                      isActive
                        ? 'bg-black text-white border-black'
                        : 'bg-white border-black text-black hover:-translate-y-1 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]'
                    }`}
                >
                  <Icon className="w-5 h-5 mb-1" /> {tool.label}
                </button>
              );
            })}
          </div>
        </div>

        <div className="h-12 w-[2px] bg-gray-200" />

        {/* Boolean Operations */}
        <div className="flex flex-col gap-2">
          <span className="text-[9px] font-bold text-gray-400 uppercase tracking-tighter text-center">
            Boolean Logic
          </span>
          <div className="flex gap-2">
            {OPERATIONS.map((op) => {
              const isActive = selectedOp === op.id;
              const Icon = op.icon;
              return (
                <button
                  key={op.id}
                  onClick={() => onSelectOp(op.id)}
                  title={op.label}
                  className={`p-3 border-2 transition-all flex flex-col items-center justify-center text-[10px] font-bold tracking-widest uppercase min-w-[75px]
                    ${
                      isActive
                        ? 'bg-black text-white border-black'
                        : 'bg-white border-black text-black hover:-translate-y-1 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]'
                    }`}
                >
                  <Icon className="w-5 h-5 mb-1" /> {op.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
