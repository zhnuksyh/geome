import { useState, useRef, useCallback, useEffect } from 'react';
import type { ShapeType, OpType, ShapeObj, ToolMode } from './types/game';
import { useLocalStorage } from './hooks/useLocalStorage';
import { useHistory } from './hooks/useHistory';
import { LEVELS, CANVAS_SIZE, generateId } from './game/levels';
import { GameUI } from './components/GameUI';
import { CanvasWorkspace } from './components/CanvasWorkspace';
import { WinModal } from './components/WinModal';

export default function App() {
  // ─── Persisted State ────────────────────────────────────────────────
  const [currentLevel, setCurrentLevel] = useLocalStorage('geome_level', 0);
  const [shapes, setShapes] = useLocalStorage<ShapeObj[]>('geome_shapes', []);

  // ─── History (Undo / Redo) ─────────────────────────────────────────
  const { snapshot, undo, redo } = useHistory(shapes, setShapes);

  // ─── Local State ───────────────────────────────────────────────────
  const [activeTool, setActiveTool] = useState<ToolMode>('select');
  const [selectedOp, setSelectedOp] = useState<OpType>('source-over');
  const [activeShapeIds, setActiveShapeIds] = useState<string[]>([]);
  const [accuracy, setAccuracy] = useState<number>(0);
  const [isWinModalOpen, setIsWinModalOpen] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);

  // Seed an initial shape if canvas is empty (e.g. on first visit)
  useEffect(() => {
    if (shapes.length === 0) {
      const newShape: ShapeObj = {
        id: generateId(),
        type: 'circle',
        x: CANVAS_SIZE / 2,
        y: CANVAS_SIZE / 2,
        size: 90,
        rotation: 0,
        op: 'source-over',
      };
      setShapes([newShape]);
      setActiveShapeIds([newShape.id]);
    }
    // Only run on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ─── Game Actions ──────────────────────────────────────────────────
  const handleClear = useCallback(() => {
    snapshot();
    setShapes([]);
    setActiveShapeIds([]);
  }, [setShapes, snapshot]);

  const handleFinalize = useCallback(() => {
    // WIN THRESHOLD LOWERED TO 90%
    if (accuracy >= 90.0) {
      setIsWinModalOpen(true);
    } else {
      // Shake feedback
      if (containerRef.current) {
        containerRef.current.classList.add('animate-shake');
        setTimeout(() => containerRef.current?.classList.remove('animate-shake'), 300);
      }
    }
  }, [accuracy]);

  const handleNextLevel = useCallback(() => {
    setIsWinModalOpen(false);
    setShapes([]);
    setCurrentLevel((prev) => prev + 1);
  }, [setShapes, setCurrentLevel]);

  const handleSelectOp = useCallback(
    (op: OpType) => {
      setSelectedOp(op);
      if (activeShapeIds.length > 0) {
        snapshot();
        setShapes((prev) =>
          prev.map((s) => (activeShapeIds.includes(s.id) ? { ...s, op } : s))
        );
      }
    },
    [activeShapeIds, setShapes, snapshot]
  );

  return (
    <div
      className="flex items-center justify-center min-h-screen w-full bg-[#f8f8f8] font-sans overflow-hidden select-none"
      style={{
        backgroundImage: 'radial-gradient(#d1d1d1 1px, transparent 1px)',
        backgroundSize: '40px 40px',
      }}
    >
      {/* UI Overlay */}
      <GameUI
        currentLevel={currentLevel}
        accuracy={accuracy}
        activeTool={activeTool}
        selectedOp={selectedOp}
        onSelectTool={setActiveTool}
        onSelectOp={handleSelectOp}
        onClear={handleClear}
        onFinalize={handleFinalize}
      />

      {/* Canvas Workspace */}
      <CanvasWorkspace
        shapes={shapes}
        setShapes={setShapes}
        currentLevel={currentLevel}
        activeTool={activeTool}
        setActiveTool={setActiveTool}
        selectedOp={selectedOp}
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
      <WinModal isOpen={isWinModalOpen} onNextLevel={handleNextLevel} />
    </div>
  );
}
