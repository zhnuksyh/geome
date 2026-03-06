import { useRef, useEffect, useCallback, useState } from 'react';
import type { ToolMode, OpType, ShapeObj } from '../types/game';
import { CANVAS_SIZE, getShapePath, drawShape, LEVELS, generateId } from '../game/levels';
import { sfx } from '../game/audio';

interface CanvasWorkspaceProps {
  shapes: ShapeObj[];
  setShapes: (value: ShapeObj[] | ((val: ShapeObj[]) => ShapeObj[])) => void;
  currentLevel: number;
  activeTool: ToolMode;
  setActiveTool: (tool: ToolMode) => void;
  selectedOp: OpType;
  activeShapeIds: string[];
  setActiveShapeIds: (ids: string[] | ((prev: string[]) => string[])) => void;
  onAccuracyChange: (accuracy: number) => void;
  onSelectTool: (tool: ToolMode) => void;
  onSelectOp: (op: OpType) => void;
  containerRef: React.RefObject<HTMLDivElement | null>;
  snapshot: () => void;
  undo: () => void;
  redo: () => void;
  onClear: () => void;
  showGrid: boolean;
  setShowGrid: (val: boolean | ((prev: boolean) => boolean)) => void;
}

export function CanvasWorkspace({
  shapes,
  setShapes,
  currentLevel,
  activeTool,
  setActiveTool,
  selectedOp,
  activeShapeIds,
  setActiveShapeIds,
  onAccuracyChange,
  onSelectTool,
  onSelectOp,
  containerRef,
  snapshot,
  undo,
  redo,
  onClear,
  showGrid,
  setShowGrid,
}: CanvasWorkspaceProps) {
  const gameCanvasRef = useRef<HTMLCanvasElement>(null);
  const targetCanvasRef = useRef<HTMLCanvasElement>(null);
  const isDraggingShapesRef = useRef(false);
  const [selectionBox, setSelectionBox] = useState<{ x: number; y: number; w: number; h: number } | null>(null);
  const dragStartPosRef = useRef<{ x: number; y: number } | null>(null);
  const originalShapesRef = useRef<Map<string, { x: number; y: number }>>(new Map());
  const lastCalcTimeRef = useRef(0);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const [isPeeking, setIsPeeking] = useState(false);

  const targets = LEVELS[currentLevel % LEVELS.length].targetShapes;

  // ─── Responsive scaling ───────────────────────────────────────────
  useEffect(() => {
    const wrapper = wrapperRef.current;
    if (!wrapper) return;

    const computeScale = () => {
      const parent = wrapper.parentElement;
      if (!parent) return;
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
      targets.forEach(t => {
        drawShape(tCtx, t.type, t.op, t.x, t.y, t.size, t.rotation, "black");
      });
      setTimeout(() => calculateAccuracy(), 50);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentLevel, targets]);

  // ─── Render game canvas ────────────────────────────────────────────
  const renderGameCanvas = useCallback((offset: number = 0) => {
    const ctx = gameCanvasRef.current?.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;

    ctx.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);

    const buffer = document.createElement('canvas');
    buffer.width = CANVAS_SIZE;
    buffer.height = CANVAS_SIZE;
    const bCtx = buffer.getContext('2d');
    if (!bCtx) return;

    shapes.forEach((s, index) => {
      // Force the very first shape to always be source-over so it's never invisible
      const actualOp = index === 0 ? 'source-over' : s.op;
      
      // Handle Target Visibility Opacity for individual dragging
      if (isDraggingShapesRef.current && activeShapeIds.includes(s.id)) {
        bCtx.globalAlpha = 0.5; // Make only the dragged/scrolled item translucent to see target intersection
      } else {
        bCtx.globalAlpha = 1.0; 
      }

      drawShape(bCtx, s.type, actualOp, s.x, s.y, s.size, s.rotation, "black");
      bCtx.globalAlpha = 1.0; // Reset for standard operations
    });

    if (isPeeking) {
      ctx.globalAlpha = 0.15; // Ghost all accumulated player geometry flattening
    }
    ctx.drawImage(buffer, 0, 0);
    ctx.globalAlpha = 1.0;

    // Draw Grid overlay if toggled
    if (showGrid) {
      ctx.strokeStyle = 'rgba(0, 0, 0, 0.2)';
      ctx.lineWidth = 1;
      ctx.setLineDash([2, 4]); // Dotted grid
      ctx.beginPath();
      // Draw 60px interval lines mapping exactly to a 600px square
      for (let i = 0; i <= CANVAS_SIZE; i += 60) {
        ctx.moveTo(i, 0);
        ctx.lineTo(i, CANVAS_SIZE);
        ctx.moveTo(0, i);
        ctx.lineTo(CANVAS_SIZE, i);
      }
      ctx.stroke();
      ctx.setLineDash([]);
    }

    // Selection outlines for all active shapes
    activeShapeIds.forEach((id) => {
      const s = shapes.find(shape => shape.id === id);
      if (s) {
        ctx.strokeStyle = '#E63946';
        ctx.lineWidth = 2;
        ctx.setLineDash([6, 6]);
        ctx.lineDashOffset = -offset; // Marching ants animation
        ctx.beginPath();
        
        ctx.save();
        ctx.translate(s.x, s.y);
        ctx.rotate(s.rotation);
        const scaleF = (s.size + 4) / s.size;
        ctx.scale(scaleF, scaleF);
        ctx.stroke(getShapePath(s.type, s.size));
        ctx.restore();
        ctx.setLineDash([]);
        ctx.lineDashOffset = 0; // Reset for other draws
      }
    });

    // Render selection box
    if (selectionBox) {
      ctx.fillStyle = 'rgba(230, 57, 70, 0.1)';
      ctx.strokeStyle = '#E63946';
      ctx.lineWidth = 1;
      ctx.setLineDash([4, 4]);
      ctx.lineDashOffset = -offset; // Marching ants for bounding box
      ctx.fillRect(selectionBox.x, selectionBox.y, selectionBox.w, selectionBox.h);
      ctx.strokeRect(selectionBox.x, selectionBox.y, selectionBox.w, selectionBox.h);
      ctx.setLineDash([]);
      ctx.lineDashOffset = 0;
    }

  }, [shapes, activeShapeIds, selectionBox, showGrid, isPeeking]);

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

  useEffect(() => {
    let animationFrameId: number;

    const renderLoop = (time: number) => {
      // Create a marching ants animation effect natively in canvas
      // We animate at a speed of 0.02 pixels per ms
      const offset = time * 0.02; 
      renderGameCanvas(offset);
      animationFrameId = requestAnimationFrame(renderLoop);
    };

    // Start loop
    animationFrameId = requestAnimationFrame(renderLoop);

    // Initial accuracy calc
    const timer = setTimeout(() => {
      calculateAccuracy();
    }, 50);

    return () => {
      cancelAnimationFrame(animationFrameId);
      clearTimeout(timer);
    };
  }, [renderGameCanvas, calculateAccuracy]);

  // ─── Pointer events ────────────────────────────────────────────────
  const handleAddShape = (type: 'circle' | 'square' | 'triangle', rawX: number, rawY: number) => {
    snapshot();
    const x = Math.round(rawX / 30) * 30;
    const y = Math.round(rawY / 30) * 30;

    const newShape: ShapeObj = {
      id: generateId(),
      type,
      x,
      y,
      size: 90,
      rotation: 0,
      op: selectedOp,
    };

    sfx.playSpawn();
    setShapes((prev) => [...prev, newShape]);
    setActiveShapeIds([newShape.id]);
  };

  const toCanvasCoords = (clientX: number, clientY: number) => {
    const canvas = gameCanvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    return {
      x: ((clientX - rect.left) / rect.width) * CANVAS_SIZE,
      y: ((clientY - rect.top) / rect.height) * CANVAS_SIZE,
    };
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    const canvas = gameCanvasRef.current;
    if (!canvas) return;

    const { x: mouseX, y: mouseY } = toCanvasCoords(e.clientX, e.clientY);
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Drawing a shape instead of selecting
    if (activeTool !== 'select') {
      handleAddShape(activeTool, mouseX, mouseY);
      isDraggingShapesRef.current = true;
      dragStartPosRef.current = { x: mouseX, y: mouseY };
      return;
    }

    // Select Tool: hit test shapes (top to bottom)
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
      // Clicked a shape
      if (e.shiftKey) {
        // Toggle selection
        sfx.playClick();
        setActiveShapeIds(prev => 
          prev.includes(foundId!) ? prev.filter(id => id !== foundId) : [...prev, foundId!]
        );
      } else {
        // If it's already selected, don't clear the others (so we can drag the group)
        // If it's not selected, make it the only selection
        if (!activeShapeIds.includes(foundId)) {
          sfx.playClick();
          setActiveShapeIds([foundId]);
          const activeObj = shapes.find((s) => s.id === foundId);
          if (activeObj) onSelectOp(activeObj.op);
        }
      }
      isDraggingShapesRef.current = true;
      dragStartPosRef.current = { x: mouseX, y: mouseY };
      
      // Snapshot shapes immediately so continuous dragging scales fluidly directly from these exact origins
      const newOrig = new Map<string, { x: number; y: number }>();
      shapes.forEach(s => newOrig.set(s.id, { x: s.x, y: s.y }));
      originalShapesRef.current = newOrig;
    } else {
      // Clicked empty space
      if (!e.shiftKey) setActiveShapeIds([]); // Clear selection unless shift is held
      setSelectionBox({ x: mouseX, y: mouseY, w: 0, h: 0 });
      dragStartPosRef.current = { x: mouseX, y: mouseY };
    }
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const { x: mouseX, y: mouseY } = toCanvasCoords(e.clientX, e.clientY);

    // Box selection
    if (selectionBox && dragStartPosRef.current) {
      const startX = dragStartPosRef.current.x;
      const startY = dragStartPosRef.current.y;
      setSelectionBox({
        x: Math.min(startX, mouseX),
        y: Math.min(startY, mouseY),
        w: Math.abs(mouseX - startX),
        h: Math.abs(mouseY - startY),
      });
      return;
    }

    // Dragging shapes
    if (isDraggingShapesRef.current && activeShapeIds.length > 0 && dragStartPosRef.current) {
      const dx = mouseX - dragStartPosRef.current.x;
      const dy = mouseY - dragStartPosRef.current.y;

      setShapes((prev) =>
        prev.map((s) => {
          if (activeShapeIds.includes(s.id)) {
            const orig = originalShapesRef.current.get(s.id);
            if (!orig) return s;

            // Enforce rigid 30px interval lock-stepping
            const finalX = Math.round((orig.x + dx) / 30) * 30;
            const finalY = Math.round((orig.y + dy) / 30) * 30;

            return { ...s, x: finalX, y: finalY };
          }
          return s;
        })
      );

      const now = performance.now();
      if (now - lastCalcTimeRef.current > 100) {
        requestAnimationFrame(calculateAccuracy);
        lastCalcTimeRef.current = now;
      }
    }
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLCanvasElement>) => {
    e.currentTarget.releasePointerCapture(e.pointerId);

    if (selectionBox) {
      // Find all shapes whose center is inside the selection box
      const newlySelected = shapes
        .filter(s => 
          s.x >= selectionBox.x && 
          s.x <= selectionBox.x + selectionBox.w &&
          s.y >= selectionBox.y && 
          s.y <= selectionBox.y + selectionBox.h
        )
        .map(s => s.id);
        
      if (newlySelected.length > 0) {
        setActiveShapeIds(prev => {
          const combined = new Set([...prev, ...newlySelected]);
          return Array.from(combined);
        });
      }
      setSelectionBox(null);
    }

    if (isDraggingShapesRef.current) {
      snapshot(); // Record drag result
      isDraggingShapesRef.current = false;
    }
    
    dragStartPosRef.current = null;
    calculateAccuracy();
  };

  // ─── Wheel (resize / rotate) ──────────────────────────────────────
  useEffect(() => {
    const canvas = gameCanvasRef.current;
    if (!canvas) return;

    let wheelSnapshotted = false;

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      if (activeShapeIds.length > 0) {
        if (!wheelSnapshotted) {
          snapshot();
          wheelSnapshotted = true;
          // Reset after a pause in scrolling
          setTimeout(() => { wheelSnapshotted = false; }, 300);
        }

        setShapes((prev) => {
          return prev.map(s => {
            if (activeShapeIds.includes(s.id)) {
              sfx.playSnap();
              const activeShape = { ...s };
              if (e.shiftKey) {
                // Unconditionally snap to 15 degree increments to lock with 30px position constraints
                const snapAngle = Math.PI / 12; 
                const dir = e.deltaY > 0 ? 1 : -1;
                activeShape.rotation += dir * snapAngle;
              } else {
                // If grid is active, snap radius to 30 to lock onto 60 grid width
                const delta = e.deltaY > 0 ? (showGrid ? -30 : -4) : (showGrid ? 30 : 4);
                activeShape.size = Math.max(30, activeShape.size + delta);
              }
              return activeShape;
            }
            return s;
          });
        });
        calculateAccuracy();
      }
    };

    canvas.addEventListener('wheel', handleWheel, { passive: false });
    return () => canvas.removeEventListener('wheel', handleWheel);
  }, [activeShapeIds, calculateAccuracy, setShapes, snapshot, showGrid]);

  // ─── Keyboard shortcuts (Affinity-inspired) ────────────────────────
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      const ctrl = e.ctrlKey || e.metaKey;
      const shift = e.shiftKey;

      if (ctrl) {
        if (key === 'z' && !shift) { e.preventDefault(); undo(); return; }
        if (key === 'z' && shift) { e.preventDefault(); redo(); return; }
        if (key === 'd') {
          e.preventDefault();
          if (activeShapeIds.length > 0) {
            snapshot();
            const newIds: string[] = [];
            setShapes((prev) => {
              const shapesToDup = prev.filter(s => activeShapeIds.includes(s.id));
              const dups = shapesToDup.map(s => {
                const newShape = { ...s, id: generateId(), x: s.x + 20, y: s.y + 20 };
                newIds.push(newShape.id);
                return newShape;
              });
              return [...prev, ...dups];
            });
            setActiveShapeIds(newIds);
          }
          return;
        }
        if (key === 'x' && shift) { e.preventDefault(); onClear(); return; }
        return;
      }

      if (e.key === 'Escape') { setActiveShapeIds([]); return; }
      if (e.code === 'Space') { e.preventDefault(); setIsPeeking(true); return; }

      if (e.key === 'Delete' || e.key === 'Backspace') {
        if (e.key === 'Backspace') e.preventDefault();
        if (activeShapeIds.length > 0) {
          snapshot();
          sfx.playSlice();
          setShapes((prev) => prev.filter((s) => !activeShapeIds.includes(s.id)));
          setActiveShapeIds([]);
        }
        return;
      }

      if (key === 'v') { setActiveTool('select'); return; }
      if (key === 'c') { onSelectTool('circle'); return; }
      if (key === 's') { onSelectTool('square'); return; }
      if (key === 't') { onSelectTool('triangle'); return; }
      if (key === 'g') { setShowGrid(prev => !prev); return; }

      const applyOp = (op: OpType) => {
        onSelectOp(op);
      };

      if (key === '1') applyOp('source-over');
      if (key === '2') applyOp('destination-out');
      if (key === '3') applyOp('destination-in');
      if (key === '4') applyOp('xor');

      if (key === '[' || key === ']') {
        if (activeShapeIds.length === 0) return;
        snapshot();
        // Layering arrays properly is tricky with multi-select. Let's just do it for single selection for now, or group move
        if (activeShapeIds.length === 1) {
             setShapes((prev) => {
              const activeShapeIndex = prev.findIndex(s => s.id === activeShapeIds[0]);
              const newShapes = [...prev];
              if (key === '[' && activeShapeIndex > 0) {
                [newShapes[activeShapeIndex - 1], newShapes[activeShapeIndex]] = [newShapes[activeShapeIndex], newShapes[activeShapeIndex - 1]];
              } else if (key === ']' && activeShapeIndex < newShapes.length - 1) {
                [newShapes[activeShapeIndex], newShapes[activeShapeIndex + 1]] = [newShapes[activeShapeIndex + 1], newShapes[activeShapeIndex]];
              }
              return newShapes;
            });
        }
        return;
      }
    };
    
    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.code === 'Space') { setIsPeeking(false); }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [
    activeShapeIds, calculateAccuracy, setShapes, setActiveShapeIds, onSelectTool, onSelectOp,
    snapshot, undo, redo, onClear, shapes, setActiveTool, setShowGrid, setIsPeeking
  ]);

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
              className="absolute touch-none"
              style={{ cursor: "url('/cursor-crosshair.svg') 12 12, crosshair" }}
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              onPointerLeave={handlePointerUp}
              onPointerCancel={handlePointerUp}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
