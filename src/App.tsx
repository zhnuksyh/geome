import { useState, useRef, useCallback, useEffect } from 'react';
import type { ShapeType, OpType, ShapeObj, ToolMode } from './types/game';
import { useLocalStorage } from './hooks/useLocalStorage';
import { useHistory } from './hooks/useHistory';
import { LEVELS, CANVAS_SIZE, generateId } from './game/levels';
import { GameUI } from './components/GameUI';
import { CanvasWorkspace } from './components/CanvasWorkspace';
import { WinModal } from './components/WinModal';
import { MainMenu } from './components/MainMenu';
import { sfx } from './game/audio';
import confetti from 'canvas-confetti';
import { useAchievements } from './game/achievements';

export default function App() {
  // ─── Persisted State ────────────────────────────────────────────────
  const [currentLevel, setCurrentLevel] = useLocalStorage('geome_level', 0);
  const [maxUnlockedLevel, setMaxUnlockedLevel] = useLocalStorage('geome_max_level', 0);
  const [shapes, setShapes] = useLocalStorage<ShapeObj[]>('geome_shapes', []);
  const [showGrid, setShowGrid] = useLocalStorage('geome_grid', false);
  const [moves, setMoves] = useLocalStorage('geome_moves', 0);
  const [theme, setTheme] = useLocalStorage<'light' | 'dark' | 'neon'>('geome_theme', 'light');

  // ─── History (Undo / Redo) ─────────────────────────────────────────
  const { snapshot, undo, redo } = useHistory(shapes, setShapes);

  // ─── Local State ───────────────────────────────────────────────────
  const [gameState, setGameState] = useState<'menu' | 'playing' | 'rejected' | 'won'>('menu');
  const [activeTool, setActiveTool] = useState<ToolMode>('select');
  const [selectedOp, setSelectedOp] = useState<OpType>('source-over');
  const [activeHoverOp, setActiveHoverOp] = useState<OpType | null>(null);
  const [activeShapeIds, setActiveShapeIds] = useState<string[]>([]);
  const [accuracy, setAccuracy] = useState<number>(0);
  const [timeElapsed, setTimeElapsed] = useState<number>(0);
  const [isWinModalOpen, setIsWinModalOpen] = useState(false);
  const [isAudioOn, setIsAudioOn] = useState(false);

  const { recentUnlock, unlock } = useAchievements();

  const containerRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  // Seed an initial shape if canvas is empty (e.g. on first visit)
  useEffect(() => {
    if (shapes.length === 0) {
      const newShape: ShapeObj = {
        id: generateId(),
        type: 'circle',
        x: CANVAS_SIZE / 2,
        y: CANVAS_SIZE / 2,
        size: 100,
        rotation: 0,
        op: 'source-over',
      };
      setShapes([newShape]);
      setActiveShapeIds([newShape.id]);
    }
    // Only run on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ─── Theme Sync ────────────────────────────────────────────────────
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // ─── Timer ─────────────────────────────────────────────────────────
  useEffect(() => {
    let timer: number;
    if (gameState === 'playing') {
      timer = window.setInterval(() => {
        setTimeElapsed((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [gameState]);

  // ─── Achievement Hooks ─────────────────────────────────────────────
  useEffect(() => {
    if (shapes.length >= 10) unlock('the_architect');
    if (shapes.some(s => s.op !== 'source-over')) unlock('first_boolean');
  }, [shapes, unlock]);

  // ─── Audio Control ─────────────────────────────────────────────────
  useEffect(() => {
    sfx.setEnabled(isAudioOn);
    if (audioRef.current) {
      if (isAudioOn) {
        audioRef.current.play().catch(e => console.log("Audio play blocked by browser:", e));
      } else {
        audioRef.current.pause();
      }
    }
  }, [isAudioOn]);

  // ─── Game Actions ──────────────────────────────────────────────────
  const handleClear = useCallback(() => {
    snapshot();
    setShapes([]);
    setActiveShapeIds([]);
    setMoves(0);
    sfx.playSlice();
  }, [setShapes, snapshot, setMoves]);

  const handleFinalize = useCallback(() => {
    if (accuracy >= 95.0) {
      setGameState('won');
      sfx.playSuccess();
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#E63946', '#FFB703', '#1D3557', '#000000']
      });

      const levelData = LEVELS[currentLevel % LEVELS.length];
      const { gold } = levelData.par || { bronze: 99, silver: 99, gold: 99 };
      
      if (timeElapsed <= 10) unlock('speed_demon');
      if (moves <= gold) unlock('efficiency_expert');
      if (accuracy >= 99.9) unlock('perfectionist');

      setTimeout(() => setIsWinModalOpen(true), 1500);
      // Unlock the next level if we beat the current peak
      setMaxUnlockedLevel(prev => Math.max(prev, currentLevel + 1));
    } else {
      // Shake feedback
      if (containerRef.current) {
        containerRef.current.classList.add('animate-shake');
        setTimeout(() => containerRef.current?.classList.remove('animate-shake'), 300);
      }
    }
  }, [accuracy, currentLevel, setMaxUnlockedLevel]);

  const handleNextLevel = useCallback(() => {
    setIsWinModalOpen(false);
    setShapes([]);
    setTimeElapsed(0);
    setCurrentLevel((prev) => prev + 1);
    setGameState('playing');
  }, [setShapes, setCurrentLevel]);

  const handleSelectLevel = useCallback((levelIndex: number) => {
    snapshot();
    setShapes([]);
    setActiveShapeIds([]);
    setMoves(0);
    setTimeElapsed(0);
    setCurrentLevel(levelIndex);
    setGameState('playing');
  }, [setShapes, setActiveShapeIds, setCurrentLevel, snapshot, setMoves]);

  const handleSelectOp = useCallback(
    (op: OpType) => {
      setSelectedOp(op);
      if (activeShapeIds.length > 0) {
        snapshot();
        sfx.playSlice();
        if (containerRef.current) {
          containerRef.current.classList.add('animate-shake');
          setTimeout(() => containerRef.current?.classList.remove('animate-shake'), 200);
        }
        setShapes((prev) =>
          prev.map((s) => (activeShapeIds.includes(s.id) ? { ...s, op } : s))
        );
        setMoves(m => m + 1);
      }
    },
    [activeShapeIds, setShapes, snapshot, setMoves]
  );
  
  // ─── Shape Panel Actions ───────────────────────────────────────────
  const handleSelectShape = useCallback((id: string, shiftKey: boolean) => {
    setActiveShapeIds(prev => {
      if (shiftKey) {
        return prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id];
      }
      return [id];
    });
  }, []);

  const handleMoveUpSelected = useCallback(() => {
    if (activeShapeIds.length !== 1) return;
    snapshot();
    setShapes(prev => {
      const idx = prev.findIndex(s => s.id === activeShapeIds[0]);
      if (idx < prev.length - 1) {
        const next = [...prev];
        [next[idx], next[idx + 1]] = [next[idx + 1], next[idx]];
        return next;
      }
      return prev;
    });
  }, [activeShapeIds, setShapes, snapshot]);

  const handleMoveDownSelected = useCallback(() => {
    if (activeShapeIds.length !== 1) return;
    snapshot();
    setShapes(prev => {
      const idx = prev.findIndex(s => s.id === activeShapeIds[0]);
      if (idx > 0) {
        const next = [...prev];
        [next[idx - 1], next[idx]] = [next[idx], next[idx - 1]];
        return next;
      }
      return prev;
    });
  }, [activeShapeIds, setShapes, snapshot]);

  const handleDuplicateSelected = useCallback(() => {
    if (activeShapeIds.length === 0) return;
    snapshot();
    const newIds: string[] = [];
    setShapes(prev => {
      const shapesToDup = prev.filter(s => activeShapeIds.includes(s.id));
      const dups = shapesToDup.map(s => {
        const newShape = { ...s, id: generateId(), x: s.x + 20, y: s.y + 20 };
        newIds.push(newShape.id);
        return newShape;
      });
      return [...prev, ...dups];
    });
    setActiveShapeIds(newIds);
  }, [activeShapeIds, setShapes, snapshot]);

  const handleDeleteSelected = useCallback(() => {
    if (activeShapeIds.length === 0) return;
    snapshot();
    setShapes(prev => prev.filter(s => !activeShapeIds.includes(s.id)));
    setActiveShapeIds([]);
    setMoves(m => m + 1);
  }, [activeShapeIds, setShapes, snapshot, setMoves]);

  return (
    <div
      className="flex items-center justify-center min-h-screen w-full bg-[var(--bg-color)] font-sans overflow-hidden select-none"
      style={{
        backgroundImage: 'radial-gradient(var(--grid-color) 1px, transparent 1px)',
        backgroundSize: '40px 40px',
      }}
    >
      {gameState === 'menu' && (
        <MainMenu onPlay={() => setGameState('playing')} />
      )}

      {/* Rejection Modal */
      gameState === 'rejected' && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center animate-in fade-in zoom-in duration-300">
          <div className="bg-[var(--panel-bg)] border-4 border-[var(--accent-red)] shadow-[12px_12px_0px_0px_var(--accent-red)] p-12 max-w-sm text-center">
            <h2 className="text-4xl font-black mb-4 tracking-tighter text-[var(--accent-red)] uppercase">
              Form Rejected
            </h2>
            <p className="text-sm font-bold uppercase tracking-widest mb-8 text-[var(--text-color)] opacity-80">
              Geometric alignment is insufficient. Required precision: 95.0%. Current: {accuracy.toFixed(1)}%.
            </p>
            <button
              onClick={() => setGameState('playing')}
              className="w-full tracking-[0.2em] font-bold py-4 uppercase border-2 border-[var(--accent-red)] bg-[var(--accent-red)] text-white hover:bg-[var(--bg-color)] hover:text-[var(--accent-red)] transition-colors"
            >
              Resume Assembly
            </button>
          </div>
        </div>
      )}

      {/* Achievement Toast */}
      {recentUnlock && (
        <div className="fixed bottom-8 right-8 z-50 animate-in slide-in-from-bottom-5 fade-in duration-300">
          <div className="bg-[var(--panel-bg)] border-2 border-[#A8AADC] shadow-[4px_4px_0px_0px_#A8AADC] p-4 flex items-center gap-4 w-80">
            <div className="text-3xl">{recentUnlock.icon}</div>
            <div className="flex flex-col text-left">
              <span className="text-[10px] uppercase font-bold text-[#A8AADC] tracking-widest leading-none mb-1">Achievement Unlocked</span>
              <span className="text-sm font-black text-[var(--text-color)] leading-snug truncate">{recentUnlock.title}</span>
              <span className="text-[10px] text-[var(--text-color)] opacity-70 leading-tight mt-0.5">{recentUnlock.description}</span>
            </div>
          </div>
        </div>
      )}

      {/* UI Overlay */}
      <GameUI
        currentLevel={currentLevel}
        maxUnlockedLevel={maxUnlockedLevel}
        accuracy={accuracy}
        moves={moves}
        timeElapsed={timeElapsed}
        showGrid={showGrid}
        allowedTools={LEVELS[currentLevel % LEVELS.length].allowedTools}
        activeTool={activeTool}
        selectedOp={selectedOp}
        shapes={shapes}
        activeShapeIds={activeShapeIds}
        onSelectTool={setActiveTool}
        onSelectOp={handleSelectOp}
        onClear={handleClear}
        onFinalize={handleFinalize}
        onSelectLevel={handleSelectLevel}
        onSelectShape={handleSelectShape}
        onMoveUp={handleMoveUpSelected}
        onMoveDown={handleMoveDownSelected}
        onDuplicate={handleDuplicateSelected}
        onDelete={handleDeleteSelected}
        onToggleGrid={() => setShowGrid(!showGrid)}
        isAudioOn={isAudioOn}
        onToggleAudio={() => setIsAudioOn(!isAudioOn)}
        onHoverOp={setActiveHoverOp}
        theme={theme}
        onThemeChange={setTheme}
      />

      {/* Canvas Workspace */}
      <CanvasWorkspace
        shapes={shapes}
        setShapes={setShapes}
        currentLevel={currentLevel}
        showGrid={showGrid}
        setShowGrid={setShowGrid}
        activeTool={activeTool}
        setActiveTool={setActiveTool}
        selectedOp={selectedOp}
        activeHoverOp={activeHoverOp}
        activeShapeIds={activeShapeIds}
        setActiveShapeIds={setActiveShapeIds}
        onAccuracyChange={setAccuracy}
        onSelectTool={setActiveTool}
        onSelectOp={setSelectedOp}
        containerRef={containerRef}
        snapshot={snapshot}
        undo={undo}
        redo={redo}
        onClear={handleClear}
      />

      {/* Win Modal */}
      <WinModal 
        isOpen={isWinModalOpen} 
        onNextLevel={handleNextLevel} 
        moves={moves}
        par={LEVELS[currentLevel % LEVELS.length].par}
      />

      {/* Ambient Audio Player */}
      <audio ref={audioRef} loop src="/audio/ambient-loop.m4a" />
    </div>
  );
}
