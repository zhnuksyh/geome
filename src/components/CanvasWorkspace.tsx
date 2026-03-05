import { useRef, useEffect, useCallback, useState } from 'react';
import type { ShapeType, OpType, ShapeObj } from '../types/game';
import { CANVAS_SIZE, getShapePath, LEVELS, generateId } from '../game/levels';

interface CanvasWorkspaceProps {
  shapes: ShapeObj[];
  setShapes: (value: ShapeObj[] | ((val: ShapeObj[]) => ShapeObj[])) => void;
  currentLevel: number;
  selectedShape: ShapeType;
  selectedOp: OpType;
  activeShapeId: string | null;
  setActiveShapeId: (id: string | null) => void;
  onAccuracyChange: (accuracy: number) => void;
  onSelectShape: (shape: ShapeType) => void;
  onSelectOp: (op: OpType) => void;
  containerRef: React.RefObject<HTMLDivElement | null>;
}

export function CanvasWorkspace({
  shapes,
  setShapes,
  currentLevel,
  selectedShape,
  selectedOp,
  activeShapeId,
  setActiveShapeId,
  onAccuracyChange,
  onSelectShape,
  onSelectOp,
  containerRef,
}: CanvasWorkspaceProps) {
  const gameCanvasRef = useRef<HTMLCanvasElement>(null);
  const targetCanvasRef = useRef<HTMLCanvasElement>(null);
  const isDraggingRef = useRef(false);
  const lastCalcTimeRef = useRef(0);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  const activeShapeIndex = shapes.findIndex((s) => s.id === activeShapeId);

  // ─── Responsive scaling ───────────────────────────────────────────
  useEffect(() => {
    const wrapper = wrapperRef.current;
    if (!wrapper) return;

    const computeScale = () => {
      const parent = wrapper.parentElement;
      if (!parent) return;
      // Compute how much space is available (accounting for padding)
      const availW = parent.clientWidth;
      const availH = parent.clientHeight;
      const newScale = Math.min(1, availW / (CANVAS_SIZE + 24), availH / (CANVAS_SIZE + 24));
      setScale(newScale);
    };

    computeScale();
    const ro = new ResizeObserver(computeScale);
    ro.observe(wrapper.parentElement || wrapper);
    return () => ro.disconnect();
  }, []);

  // ─── Draw target canvas on level change ────────────────────────────
  useEffect(() => {
    const tCtx = targetCanvasRef.current?.getContext('2d', { willReadFrequently: true });
    if (tCtx) {
      tCtx.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
      LEVELS[currentLevel % LEVELS.length].setup(tCtx);
      setTimeout(() => calculateAccuracy(), 50);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentLevel]);

  // ─── Render game canvas ────────────────────────────────────────────
  const renderGameCanvas = useCallback(() => {
    const ctx = gameCanvasRef.current?.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;

    ctx.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);

    // Offscreen buffer for correct boolean compositing
    const buffer = document.createElement('canvas');
    buffer.width = CANVAS_SIZE;
    buffer.height = CANVAS_SIZE;
    const bCtx = buffer.getContext('2d');
    if (!bCtx) return;

    shapes.forEach((s) => {
      bCtx.globalCompositeOperation = s.op;
      bCtx.fillStyle = 'black';
      bCtx.save();
      bCtx.translate(s.x, s.y);
      bCtx.rotate(s.rotation);
      bCtx.fill(getShapePath(s.type, s.size));
      bCtx.restore();
    });

    ctx.drawImage(buffer, 0, 0);

    // Selection outline
    if (activeShapeIndex !== -1) {
      const s = shapes[activeShapeIndex];
      ctx.strokeStyle = '#E63946';
      ctx.lineWidth = 2;
      ctx.setLineDash([6, 6]);
      ctx.save();
      ctx.translate(s.x, s.y);
      ctx.rotate(s.rotation);
      const scaleF = (s.size + 4) / s.size;
      ctx.scale(scaleF, scaleF);
      ctx.stroke(getShapePath(s.type, s.size));
      ctx.restore();
      ctx.setLineDash([]);
    }
  }, [shapes, activeShapeIndex]);

  useEffect(() => {
    renderGameCanvas();
  }, [renderGameCanvas]);

  // ─── Accuracy (IoU) ────────────────────────────────────────────────
  const calculateAccuracy = useCallback(() => {
    const ctx = gameCanvasRef.current?.getContext('2d', { willReadFrequently: true });
    const tCtx = targetCanvasRef.current?.getContext('2d', { willReadFrequently: true });
    if (!ctx || !tCtx) return;

    const userData = ctx.getImageData(0, 0, CANVAS_SIZE, CANVAS_SIZE).data;
    const targetData = tCtx.getImageData(0, 0, CANVAS_SIZE, CANVAS_SIZE).data;

    let intersection = 0;
    let union = 0;

    for (let i = 3; i < userData.length; i += 4) {
      const isUser = userData[i] > 128;
      const isTarget = targetData[i] > 128;
      if (isUser && isTarget) intersection++;
      if (isUser || isTarget) union++;
    }

    onAccuracyChange(union === 0 ? 0 : (intersection / union) * 100);
  }, [onAccuracyChange]);

  // ─── Pointer events ────────────────────────────────────────────────
  const handleAddShape = (x: number, y: number) => {
    const newShape: ShapeObj = {
      id: generateId(),
      type: selectedShape,
      x,
      y,
      size: 90,
      rotation: 0,
      op: selectedOp,
    };
    setShapes((prev) => [...prev, newShape]);
    setActiveShapeId(newShape.id);
  };

  const toCanvasCoords = (clientX: number, clientY: number) => {
    const canvas = gameCanvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    // Convert from CSS-space to the 600x600 logical space
    return {
      x: ((clientX - rect.left) / rect.width) * CANVAS_SIZE,
      y: ((clientY - rect.top) / rect.height) * CANVAS_SIZE,
    };
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = gameCanvasRef.current;
    if (!canvas) return;

    const { x: mouseX, y: mouseY } = toCanvasCoords(e.clientX, e.clientY);
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let foundId: string | null = null;

    for (let i = shapes.length - 1; i >= 0; i--) {
      const s = shapes[i];
      ctx.save();
      ctx.translate(s.x, s.y);
      ctx.rotate(s.rotation);
      if (ctx.isPointInPath(getShapePath(s.type, s.size), mouseX, mouseY)) {
        foundId = s.id;
      }
      ctx.restore();
      if (foundId) break;
    }

    if (foundId) {
      setActiveShapeId(foundId);
      const activeObj = shapes.find((s) => s.id === foundId);
      if (activeObj) {
        onSelectShape(activeObj.type);
        onSelectOp(activeObj.op);
      }
    } else {
      handleAddShape(mouseX, mouseY);
    }

    isDraggingRef.current = true;
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDraggingRef.current || !activeShapeId) return;

    const { x, y } = toCanvasCoords(e.clientX, e.clientY);

    setShapes((prev) =>
      prev.map((s) => (s.id === activeShapeId ? { ...s, x, y } : s))
    );

    const now = performance.now();
    if (now - lastCalcTimeRef.current > 100) {
      requestAnimationFrame(calculateAccuracy);
      lastCalcTimeRef.current = now;
    }
  };

  const handlePointerUp = () => {
    isDraggingRef.current = false;
    calculateAccuracy();
  };

  // ─── Wheel (resize / rotate) ──────────────────────────────────────
  useEffect(() => {
    const canvas = gameCanvasRef.current;
    if (!canvas) return;

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      if (activeShapeIndex !== -1) {
        setShapes((prev) => {
          const newShapes = [...prev];
          const activeShape = { ...newShapes[activeShapeIndex] };

          if (e.shiftKey) {
            activeShape.rotation += e.deltaY > 0 ? 0.08 : -0.08;
          } else {
            const delta = e.deltaY > 0 ? -4 : 4;
            activeShape.size = Math.max(10, activeShape.size + delta);
          }

          newShapes[activeShapeIndex] = activeShape;
          return newShapes;
        });
        calculateAccuracy();
      }
    };

    canvas.addEventListener('wheel', handleWheel, { passive: false });
    return () => canvas.removeEventListener('wheel', handleWheel);
  }, [activeShapeIndex, calculateAccuracy, setShapes]);

  // ─── Keyboard shortcuts ────────────────────────────────────────────
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();

      if (key === 'c') {
        setShapes([]);
        setActiveShapeId(null);
        setTimeout(calculateAccuracy, 10);
      }

      if (e.key === 'Delete' || e.key === 'Backspace') {
        if (e.key === 'Backspace') e.preventDefault();
        if (activeShapeId) {
          setShapes((prev) => prev.filter((s) => s.id !== activeShapeId));
          setActiveShapeId(null);
          setTimeout(calculateAccuracy, 10);
        }
      }

      if (key === '[' || key === ']') {
        if (activeShapeIndex === -1) return;
        setShapes((prev) => {
          const newShapes = [...prev];
          if (key === '[' && activeShapeIndex > 0) {
            [newShapes[activeShapeIndex - 1], newShapes[activeShapeIndex]] = [
              newShapes[activeShapeIndex],
              newShapes[activeShapeIndex - 1],
            ];
          } else if (key === ']' && activeShapeIndex < newShapes.length - 1) {
            [newShapes[activeShapeIndex], newShapes[activeShapeIndex + 1]] = [
              newShapes[activeShapeIndex + 1],
              newShapes[activeShapeIndex],
            ];
          }
          return newShapes;
        });
        setTimeout(calculateAccuracy, 10);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeShapeId, activeShapeIndex, calculateAccuracy, setShapes, setActiveShapeId]);

  return (
    <div className="flex items-center justify-center flex-1 min-h-0 min-w-0 p-4">
      <div
        ref={wrapperRef}
        style={{ transform: `scale(${scale})`, transformOrigin: 'center center' }}
      >
        <div ref={containerRef} className="relative transition-transform duration-75">
          <div className="absolute -inset-1 bg-black translate-x-3 translate-y-3" />
          <div
            className="relative bg-white border-[3px] border-black overflow-hidden"
            style={{ width: CANVAS_SIZE, height: CANVAS_SIZE }}
          >
            {/* Target Reference Layer */}
            <canvas
              ref={targetCanvasRef}
              width={CANVAS_SIZE}
              height={CANVAS_SIZE}
              className="absolute opacity-15 pointer-events-none"
            />
            {/* Interactive Player Layer */}
            <canvas
              ref={gameCanvasRef}
              width={CANVAS_SIZE}
              height={CANVAS_SIZE}
              className="absolute cursor-crosshair touch-none"
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              onPointerLeave={handlePointerUp}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
