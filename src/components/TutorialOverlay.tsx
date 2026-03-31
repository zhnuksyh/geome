import { useState } from 'react';

interface TutorialOverlayProps {
  onComplete: () => void;
}

const STEPS = [
  {
    num: '01',
    title: 'Welcome to Geome',
    body: 'A geometric puzzle game built on Bauhaus principles. Place primitives, apply boolean logic, and reconstruct the target silhouette.',
    detail: 'You need 95%+ pixel-accurate match to finalize each level.',
  },
  {
    num: '02',
    title: 'The Target Silhouette',
    body: 'A faint shape on the canvas is your goal. Your job is to reconstruct it exactly using shapes and boolean operations.',
    detail: 'Hold Space to briefly hide your shapes and peek at the raw target.',
  },
  {
    num: '03',
    title: 'Place Shapes',
    body: 'Select a shape from the bottom dock, then click anywhere on the canvas to place it. Only unlocked shapes appear per level.',
    detail: 'C Circle  ·  S Square  ·  T Triangle  ·  H Hexagon\nE Semi  ·  P Penta  ·  R Rhomb  ·  L Ellipse',
  },
  {
    num: '04',
    title: 'Boolean Operations',
    body: 'Operations define how each new shape interacts with existing layers below it. Select the operation before placing.',
    detail: '1 Union — add\n2 Subtract — cut away\n3 Intersect — keep overlap only\n4 XOR — remove the overlap',
  },
  {
    num: '05',
    title: 'Move · Resize · Rotate',
    body: 'Drag shapes to reposition. Scroll wheel to resize. Shift+Scroll to rotate in 15° steps.',
    detail: 'Press G to toggle the 30px snap grid.\nAll target shapes align to it — use it for precision.',
  },
  {
    num: '06',
    title: 'Stars & Finalize',
    body: 'Once your match precision hits 95%+, hit Finalize Form. Fewer moves earns more stars.',
    detail: 'Ctrl+D duplicate  ·  [ ] reorder layers\nCtrl+Z undo  ·  Del delete  ·  Ctrl+= zoom in',
  },
];

export function TutorialOverlay({ onComplete }: TutorialOverlayProps) {
  const [step, setStep] = useState(0);
  const current = STEPS[step];
  const isLast = step === STEPS.length - 1;

  const advance = () => {
    if (isLast) {
      onComplete();
    } else {
      setStep(s => s + 1);
    }
  };

  const skip = () => {
    onComplete();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-[var(--bg-color)] opacity-90" />

      {/* Card */}
      <div className="relative z-10 w-full max-w-md mx-6">
        <div className="absolute inset-0 bg-[var(--shadow-color)] translate-x-3 translate-y-3" />
        <div className="relative bg-[var(--panel-bg)] border-[3px] border-[var(--panel-border)] p-8">

          {/* Header row */}
          <div className="flex items-center justify-between mb-6">
            <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-color)] opacity-40">
              {current.num} / {STEPS.length.toString().padStart(2, '0')}
            </span>
            <button
              onClick={skip}
              className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-color)] opacity-40 hover:opacity-100 transition-opacity"
            >
              Skip Tutorial
            </button>
          </div>

          {/* Title */}
          <h2 className="text-2xl font-black uppercase tracking-tighter text-[var(--text-color)] mb-3 leading-tight">
            {current.title}
          </h2>

          {/* Body */}
          <p className="text-sm font-bold text-[var(--text-color)] opacity-80 leading-relaxed mb-5">
            {current.body}
          </p>

          {/* Detail block */}
          <div className="border-l-4 border-[var(--accent-yellow)] bg-[var(--bg-color)] px-4 py-3 mb-8">
            <p className="text-[11px] font-mono font-bold uppercase tracking-wider text-[var(--text-color)] opacity-70 leading-relaxed whitespace-pre-line">
              {current.detail}
            </p>
          </div>

          {/* Footer: dots + next button */}
          <div className="flex items-center justify-between">
            {/* Step dots */}
            <div className="flex gap-1.5 items-center">
              {STEPS.map((_, i) => (
                <div
                  key={i}
                  className={`h-2 transition-all duration-200 ${
                    i === step
                      ? 'w-5 bg-[var(--accent-yellow)]'
                      : i < step
                      ? 'w-2 bg-[var(--text-color)] opacity-40'
                      : 'w-2 bg-[var(--text-color)] opacity-20'
                  }`}
                />
              ))}
            </div>

            {/* Next / Start button */}
            <button onClick={advance} className="relative group">
              <div className="absolute inset-0 bg-[var(--text-color)] translate-x-1.5 translate-y-1.5 transition-transform group-hover:translate-x-2 group-hover:translate-y-2" />
              <div className="relative bg-[var(--accent-yellow)] text-black border-2 border-[var(--panel-border)] px-6 py-2.5 text-[11px] font-black uppercase tracking-widest transition-transform group-active:translate-x-1.5 group-active:translate-y-1.5">
                {isLast ? 'Start Playing →' : 'Next →'}
              </div>
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
