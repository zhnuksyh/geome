import { useState } from 'react';
import { Orbit, Layers, RotateCw, Trash2, Undo2, Copy, Keyboard, Grid, Volume2, VolumeX, Scissors, Moon, Sun, Zap } from 'lucide-react';
import { Button } from './ui/Button';
import { ScorePanel } from './ScorePanel';
import { ToolPalette } from './ToolPalette';
import { LayerPanel } from './LayerPanel';
import { LevelSelectModal } from './LevelSelectModal';
import type { ToolMode, OpType, ShapeObj } from '../types/game';

interface GameUIProps {
  currentLevel: number;
  maxUnlockedLevel: number;
  accuracy: number;
  moves: number;
  showGrid: boolean;
  activeTool: ToolMode;
  selectedOp: OpType;
  shapes: ShapeObj[];
  activeShapeIds: string[];
  theme: 'light' | 'dark' | 'neon';
  onThemeChange: (theme: 'light' | 'dark' | 'neon') => void;
  isAudioOn: boolean;
  onToggleAudio: () => void;
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
  onToggleGrid: () => void;
  onHoverOp: (op: OpType | null) => void;
}

export function GameUI({
  currentLevel,
  maxUnlockedLevel,
  accuracy,
  moves,
  showGrid,
  activeTool,
  selectedOp,
  shapes,
  activeShapeIds,
  theme,
  onThemeChange,
  isAudioOn,
  onToggleAudio,
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
  onToggleGrid,
  onHoverOp,
}: GameUIProps) {
  const [isLevelSelectOpen, setIsLevelSelectOpen] = useState(false);

  return (
    <>
      <div className="fixed inset-0 z-10 flex flex-col p-8 pointer-events-none justify-between">
        
        {/* Top Section */}
        <div className="flex justify-between items-start w-full">
          
          {/* Left Column (Score Panel + Layers) */}
          <div className="flex flex-col gap-6 w-80 pointer-events-auto">
            <ScorePanel 
              currentLevel={currentLevel} 
              accuracy={accuracy}
              moves={moves}
              onOpenLevelSelect={() => setIsLevelSelectOpen(true)} 
            />
            {shapes.length > 0 && (
              <div className="relative">
                <LayerPanel 
                  shapes={shapes}
                  activeShapeIds={activeShapeIds}
                  onSelectShape={onSelectShape}
                  onMoveUp={onMoveUp}
                  onMoveDown={onMoveDown}
                  onDuplicate={onDuplicate}
                  onDelete={onDelete}
                />
              </div>
            )}
          </div>

          {/* Right Column (Actions + Instructions) */}
          <div className="flex flex-col gap-6 items-end pointer-events-auto">
            <div className="flex flex-col gap-3 w-[260px]">
              <button onClick={onFinalize} className="relative group block pointer-events-auto w-full">
                <div className="absolute inset-0 bg-[var(--text-color)] translate-x-1.5 translate-y-1.5 transition-transform group-hover:translate-x-2 group-hover:translate-y-2" />
                <div className="relative bg-[var(--accent-red)] text-[var(--bg-color)] border-2 border-[var(--panel-border)] px-8 py-4 font-bold tracking-widest uppercase transition-transform group-active:translate-x-1.5 group-active:translate-y-1.5">
                  Finalize Form
                </div>
              </button>
              <div className="flex justify-between w-full mt-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onToggleGrid}
                  className={`text-[10px] font-bold uppercase tracking-widest transition-transform duration-200 hover:-translate-y-0.5 ${showGrid ? "text-[#E63946] opacity-100" : "opacity-50"} hover:opacity-100 flex-1`}
                >
                  {showGrid ? "[G] GRID ON" : "[G] GRID OFF"}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onToggleAudio}
                  className={`text-[10px] font-bold uppercase tracking-widest transition-transform duration-200 hover:-translate-y-0.5 ${isAudioOn ? "text-[var(--accent-red)] opacity-100" : "opacity-50"} hover:opacity-100 flex-1 flex justify-center items-center`}
                  title={isAudioOn ? "Mute Music" : "Play Ambient Music"}
                >
                  {isAudioOn ? <Volume2 size={14} /> : <VolumeX size={14} />}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    if (theme === 'light') onThemeChange('dark');
                    else if (theme === 'dark') onThemeChange('neon');
                    else onThemeChange('light');
                  }}
                  className={`text-[10px] font-bold uppercase tracking-widest transition-transform duration-200 hover:-translate-y-0.5 opacity-100 text-[var(--accent-yellow)] hover:opacity-100 flex-1 flex justify-center items-center`}
                  title="Toggle Theme"
                >
                  {theme === 'light' ? <Sun size={14} /> : theme === 'dark' ? <Moon size={14} /> : <Zap size={14} />}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onClear}
                  className="text-[10px] font-bold uppercase tracking-widest transition-transform duration-200 hover:-translate-y-0.5 hover:text-[var(--accent-red)] flex-1"
                >
                  Clear All
                </Button>
              </div>
            </div>

            {/* Instructions Panel Card */}
            <div className="bg-[var(--panel-bg)] border-[3px] border-[var(--panel-border)] shadow-[8px_8px_0px_0px_var(--shadow-color)] p-4 flex flex-col gap-3 text-left mt-2 w-[260px]">
              <div className="text-[10px] leading-relaxed text-[var(--text-color)] opacity-80 uppercase font-bold">
                <p className="flex items-center justify-start gap-3 mb-2">
                  <Keyboard size={12} className="text-[var(--text-color)]" /> V Select · C S T Tools
                </p>
                <p className="flex items-center justify-start gap-3 mb-2">
                  <Keyboard size={12} className="text-[var(--text-color)]" /> 1 2 3 4 Operations
                </p>
                <p className="flex items-center justify-start gap-3 mb-2">
                  <Grid size={12} className="text-[var(--text-color)]" /> G Toggle Snap Grid
                </p>
                <p className="flex items-center justify-start gap-3 mb-2">
                  <Orbit size={12} className="text-[var(--accent-red)]" /> Drag to Select/Move
                </p>
                <p className="flex items-center justify-start gap-3 mb-2">
                  <Layers size={12} className="text-[var(--accent-red)]" /> Scroll to Resize
                </p>
                <p className="flex items-center justify-start gap-3 mb-2">
                  <RotateCw size={12} className="text-[var(--accent-red)]" /> Shift+Scroll to Rotate
                </p>
                <p className="flex items-center justify-start gap-3 mb-2">
                  <Layers size={12} className="text-[var(--accent-yellow)]" /> [ ] Reorder Layers
                </p>
                <p className="flex items-center justify-start gap-3 mb-2">
                  <Copy size={12} className="text-[var(--accent-yellow)]" /> Ctrl+D Duplicate
                </p>
                <p className="flex items-center justify-start gap-3 mb-2">
                  <Undo2 size={12} className="text-[var(--accent-blue)]" /> Ctrl+Z / Ctrl+Shift+Z
                </p>
                <p className="flex items-center justify-start gap-3 mb-2">
                  <Orbit size={12} className="text-[var(--accent-blue)]" /> [Space] Peek Target
                </p>
                <p className="flex items-center justify-start gap-3 mb-2">
                  <Scissors size={12} className="text-[var(--accent-red)]" /> [X] Slicer Tool
                </p>
                <p className="flex items-center justify-start gap-3">
                  <Trash2 size={12} className="text-[var(--text-color)]" /> Del to Remove · Esc Deselect
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Tool Palette */}
        <ToolPalette
          activeTool={activeTool}
          selectedOp={selectedOp}
          onSelectTool={onSelectTool}
          onSelectOp={onSelectOp}
          onHoverOp={onHoverOp}
        />
      </div>

      <LevelSelectModal 
        isOpen={isLevelSelectOpen}
        currentLevelIndex={currentLevel}
        maxUnlockedLevel={maxUnlockedLevel}
        onSelectLevel={onSelectLevel}
        onClose={() => setIsLevelSelectOpen(false)}
      />
    </>
  );
}
