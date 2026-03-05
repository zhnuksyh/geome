import { useState, useRef, useCallback, useEffect } from 'react';
import type { ShapeType, OpType, ShapeObj } from './types/game';
import { useLocalStorage } from './hooks/useLocalStorage';
import { LEVELS, CANVAS_SIZE, generateId } from './game/levels';
import { GameUI } from './components/GameUI';
import { CanvasWorkspace } from './components/CanvasWorkspace';
import { WinModal } from './components/WinModal';

export default function App() {
  // ─── Persisted State ────────────────────────────────────────────────
  const [currentLevel, setCurrentLevel] = useLocalStorage('geome_level', 0);
  const [shapes, setShapes] = useLocalStorage<ShapeObj[]>('geome_shapes', []);

  // ─── Local State ───────────────────────────────────────────────────
  const [selectedShape, setSelectedShape] = useState<ShapeType>('circle');
  const [selectedOp, setSelectedOp] = useState<OpType>('source-over');
  const [activeShapeId, setActiveShapeId] = useState<string | null>(null);
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
      setActiveShapeId(newShape.id);
    }
    // Only run on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ─── Game Actions ──────────────────────────────────────────────────
  const handleClear = useCallback(() => {
    setShapes([]);
    setActiveShapeId(null);
  }, [setShapes]);

  const handleFinalize = useCallback(() => {
    if (accuracy >= 95.0) {
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

  const handleSelectShape = useCallback((shape: ShapeType) => {
    setSelectedShape(shape);
    setActiveShapeId(null);
  }, []);

  const handleSelectOp = useCallback(
    (op: OpType) => {
      setSelectedOp(op);
      if (activeShapeId) {
        setShapes((prev) =>
          prev.map((s) => (s.id === activeShapeId ? { ...s, op } : s))
        );
      }
    },
    [activeShapeId, setShapes]
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
        selectedShape={selectedShape}
        selectedOp={selectedOp}
        onSelectShape={handleSelectShape}
        onSelectOp={handleSelectOp}
        onClear={handleClear}
        onFinalize={handleFinalize}
      />

      {/* Canvas Workspace */}
      <CanvasWorkspace
        shapes={shapes}
        setShapes={setShapes}
        currentLevel={currentLevel}
        selectedShape={selectedShape}
        selectedOp={selectedOp}
        activeShapeId={activeShapeId}
        setActiveShapeId={setActiveShapeId}
        onAccuracyChange={setAccuracy}
        onSelectShape={setSelectedShape}
        onSelectOp={setSelectedOp}
        containerRef={containerRef}
      />

      {/* Win Modal */}
      <WinModal isOpen={isWinModalOpen} onNextLevel={handleNextLevel} />
    </div>
  );
}
