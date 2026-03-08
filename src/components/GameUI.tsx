import { useState } from 'react';
import { Orbit, Layers, RotateCw, Trash2, Undo2, Copy, Keyboard, Grid, Volume2, VolumeX, Moon, Sun, Zap, ChevronLeft } from 'lucide-react';
import { Button } from './ui/Button';
import { ScorePanel } from './ScorePanel';
import { ToolPalette } from './ToolPalette';
import { LayerPanel } from './LayerPanel';
import { LevelSelectModal } from './LevelSelectModal';
import { LEVELS } from '../game/levels';
import type { ToolMode, OpType, ShapeObj, ShapeType } from '../types/game';

interface GameUIProps {
  currentLevel: number;
  maxUnlockedLevel: number;
  accuracy: number;
  moves: number;
  timeElapsed: number;
  showGrid: boolean;
  allowedTools: ShapeType[];
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
  isSandbox?: boolean;
  onMenuBack?: () => void;
  levelRatings?: Record<number, number>;
}

export function GameUI({
  currentLevel,
  maxUnlockedLevel,
  accuracy,
  moves,
  timeElapsed,
  showGrid,
  allowedTools,
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
  isSandbox = false,
  onMenuBack,
  levelRatings = {},
}: GameUIProps) {
  const [isLevelSelectOpen, setIsLevelSelectOpen] = useState(false);

  // Parse time
  const mins = Math.floor(timeElapsed / 60).toString().padStart(2, '0');
  const secs = (timeElapsed % 60).toString().padStart(2, '0');

  // Par logic
  const levelIndex = currentLevel % LEVELS.length;
  const levelData = LEVELS[levelIndex];
  const { bronze, silver, gold } = levelData.par || { bronze: 99, silver: 99, gold: 99 };
  
  let medalColor = "text-[var(--text-color)] opacity-60";
  if (moves <= gold) medalColor = "text-[var(--accent-yellow)]";
  else if (moves <= silver) medalColor = "text-[#A8AADC]";
  else if (moves <= bronze) medalColor = "text-[#CD7F32]";
  else medalColor = "text-[var(--accent-red)]";

  return (
    <>
      <div className="fixed inset-0 z-10 flex flex-col p-8 pointer-events-none">
        
        {/* Top Section */}
        <div className="flex justify-between items-start w-full relative">
          
          {/* Left Column (Score Panel + Layers) */}
          <div className="flex flex-col gap-4 w-80 pointer-events-auto">
            {onMenuBack && (
              <button
                onClick={onMenuBack}
                className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest text-[var(--text-color)] opacity-60 hover:opacity-100 transition-opacity self-start"
              >
                <ChevronLeft size={12} /> Menu
              </button>
            )}
            {isSandbox ? (
              <div className="bg-[var(--panel-bg)] border-[3px] border-[var(--panel-border)] shadow-[8px_8px_0px_0px_var(--shadow-color)] p-4 w-full">
                <div className="flex items-center gap-3 mb-1">
                  <div className="flex gap-1">
                    <div className="w-3 h-3 bg-[var(--accent-red)]" />
                    <div className="w-3 h-3 bg-[var(--accent-yellow)]" />
                    <div className="w-3 h-3 bg-[var(--accent-blue)]" />
                  </div>
                  <h1 className="text-xl font-black tracking-tighter uppercase text-[var(--text-color)]">Geome</h1>
                </div>
                <p className="text-[10px] font-bold uppercase tracking-widest opacity-60 text-[var(--text-color)]">Sandbox — Free Composition</p>
              </div>
            ) : (
              <ScorePanel
                currentLevel={currentLevel}
                accuracy={accuracy}
                moves={moves}
                onOpenLevelSelect={() => setIsLevelSelectOpen(true)}
              />
            )}
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

          {/* Center Action Par & Timer — hidden in sandbox */}
          <div className={`absolute left-1/2 -translate-x-1/2 pointer-events-auto ${isSandbox ? 'hidden' : ''}`}>
            <div className="flex bg-[var(--panel-bg)] border-4 border-[var(--panel-border)] shadow-[8px_8px_0px_0px_var(--shadow-color)] items-center h-16">
              
              {/* Timer */}
              <div className="flex flex-col items-center justify-center px-6 min-w-[100px]">
                <span className="text-[10px] font-bold text-[var(--text-color)] opacity-60 uppercase tracking-widest mb-0.5">Time</span>
                <span className="font-mono text-xl font-black text-[var(--text-color)] leading-none">{mins}:{secs}</span>
              </div>

              {/* Divider */}
              <div className="w-[4px] h-full bg-[var(--panel-border)]" />

              {/* Action Par */}
              <div className="flex flex-col items-center justify-center px-6 min-w-[140px]">
                <div className="flex justify-between w-full items-end gap-4">
                  <div className="flex flex-col text-left">
                    <span className="text-[10px] font-bold text-[var(--text-color)] opacity-60 uppercase tracking-widest leading-none mb-1">
                      {isSandbox ? "Freeplay" : "Action Par"}
                    </span>
                    {isSandbox ? (
                      <span className="text-xs font-mono font-bold text-[var(--text-color)] opacity-60">No Limit</span>
                    ) : (
                      <div className="flex gap-3 text-sm font-mono font-bold tracking-tighter leading-none mt-1">
                        <span className="text-[var(--accent-yellow)]">G:{gold}</span>
                        <span className="text-[#A8AADC]">S:{silver}</span>
                        <span className="text-[#CD7F32]">B:{bronze}</span>
                      </div>
                    )}
                  </div>
                  <span className={`font-mono text-xl font-black leading-none ${medalColor}`}>
                    {moves}
                  </span>
                </div>
              </div>

            </div>
          </div>

      {/* Right Column (Actions + Instructions) */}
      <div className="flex flex-col gap-6 items-end pointer-events-auto">
        <div className="flex flex-col gap-3 w-[260px]">
          <button onClick={onFinalize} className="relative group block pointer-events-auto w-full">
            <div className="absolute inset-0 bg-[var(--text-color)] translate-x-1.5 translate-y-1.5 transition-transform group-hover:translate-x-2 group-hover:translate-y-2" />
            <div className={`relative border-2 border-[var(--panel-border)] px-8 py-4 font-bold tracking-widest uppercase transition-transform group-active:translate-x-1.5 group-active:translate-y-1.5
              ${isSandbox ? 'bg-[var(--accent-blue)] text-[var(--bg-color)]' : 'bg-[var(--accent-red)] text-[var(--bg-color)]'}`}>
              {isSandbox ? 'Save to Gallery' : 'Finalize Form'}
            </div>
              </button>
              <div className="flex justify-between w-full mt-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onToggleGrid}
                  className={`text-[10px] font-bold uppercase tracking-widest transition-transform duration-200 hover:-translate-y-0.5 ${showGrid ? "text-[var(--accent-red)]" : "text-[var(--text-color)]"} opacity-100 flex-1`}
                >
                  {showGrid ? "[G] GRID ON" : "[G] GRID OFF"}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onToggleAudio}
                  className={`text-[10px] font-bold uppercase tracking-widest transition-transform duration-200 hover:-translate-y-0.5 ${isAudioOn ? "text-[var(--accent-red)]" : "text-[var(--text-color)]"} opacity-100 flex-1 flex justify-center items-center`}
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
                  className="text-[10px] text-[var(--text-color)] opacity-100 font-bold uppercase tracking-widest transition-transform duration-200 hover:-translate-y-0.5 hover:text-[var(--accent-red)] flex-1"
                >
                  Clear All
                </Button>
              </div>
            </div>

            {/* Instructions Panel Card */}
            <div className="bg-[var(--panel-bg)] border-[3px] border-[var(--panel-border)] shadow-[8px_8px_0px_0px_var(--shadow-color)] p-4 flex flex-col gap-3 text-left mt-2 w-[260px]">
              <div className="text-[10px] leading-relaxed text-[var(--text-color)] opacity-80 uppercase font-bold">
                <p className="flex items-center justify-start gap-3 mb-2">
                  <Keyboard size={12} className="text-[var(--text-color)]" /> V Select · C S T H E P R L
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
                {isSandbox && (
                  <p className="flex items-center justify-start gap-3 mb-2 text-[var(--accent-blue)]">
                    <Orbit size={12} /> Sandbox: All Tools Unlocked
                  </p>
                )}
                <p className="flex items-center justify-start gap-3">
                  <Trash2 size={12} className="text-[var(--text-color)]" /> Del to Remove · Esc Deselect
                </p>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Bottom Tool Palette — fixed independently so it never gets pushed by panel content */}
      <div className="fixed bottom-8 left-0 right-0 z-10 flex justify-center pointer-events-none">
        <ToolPalette
          activeTool={activeTool}
          selectedOp={selectedOp}
          onSelectTool={onSelectTool}
          onSelectOp={onSelectOp}
          onHoverOp={onHoverOp}
          allowedTools={allowedTools}
        />
      </div>

      <LevelSelectModal
        isOpen={isLevelSelectOpen}
        currentLevelIndex={currentLevel}
        maxUnlockedLevel={maxUnlockedLevel}
        levelRatings={levelRatings}
        onSelectLevel={onSelectLevel}
        onClose={() => setIsLevelSelectOpen(false)}
      />
    </>
  );
}
