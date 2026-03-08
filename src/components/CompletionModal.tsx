import { Star } from 'lucide-react';
import { LEVELS } from '../game/levels';

interface CompletionModalProps {
  levelRatings: Record<number, number>;
  onMenu: () => void;
  onGallery: () => void;
  onReplay: () => void;
}

export function CompletionModal({ levelRatings, onMenu, onGallery, onReplay }: CompletionModalProps) {
  const totalLevels = LEVELS.length;
  const maxStars = totalLevels * 3;
  const earnedStars = Object.values(levelRatings).reduce((sum, s) => sum + s, 0);
  const goldCount = Object.values(levelRatings).filter(s => s === 3).length;

  let rank = 'ARCHITECT';
  let rankMessage = 'The form has been mastered.';
  if (earnedStars >= maxStars) {
    rank = 'GRAND MASTER';
    rankMessage = 'Absolute geometric perfection. Every level: gold.';
  } else if (goldCount >= 7) {
    rank = 'MASTER BUILDER';
    rankMessage = 'Exceptional efficiency across all compositions.';
  } else if (earnedStars >= maxStars * 0.7) {
    rank = 'ARCHITECT';
    rankMessage = 'A strong command of form and logic.';
  } else {
    rank = 'APPRENTICE';
    rankMessage = 'All forms constructed. Refine your efficiency.';
  }

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center animate-in fade-in duration-500">
      <div className="relative max-w-lg w-full mx-6">
        {/* Shadow */}
        <div className="absolute inset-0 bg-[var(--accent-yellow)] translate-x-4 translate-y-4" />

        <div
          className="relative bg-[var(--panel-bg)] border-[4px] border-[var(--panel-border)] p-10 text-center"
          style={{
            backgroundImage: 'radial-gradient(var(--accent-yellow) 1px, transparent 1px)',
            backgroundSize: '12px 12px',
          }}
        >
          {/* Badge */}
          <div className="inline-block bg-[var(--panel-bg)] border-2 border-[var(--accent-yellow)] px-4 py-1 mb-6">
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[var(--accent-yellow)]">
              Campaign Complete
            </span>
          </div>

          {/* Rank title */}
          <h2 className="text-4xl font-black uppercase tracking-tighter text-[var(--text-color)] bg-[var(--panel-bg)] inline-block px-4 mb-2 leading-tight">
            {rank}
          </h2>

          {/* Message */}
          <p className="text-[11px] font-bold uppercase tracking-widest text-[var(--text-color)] opacity-60 bg-[var(--panel-bg)] inline-block px-2 mb-8">
            {rankMessage}
          </p>

          {/* Stars summary */}
          <div className="bg-[var(--panel-bg)] border-2 border-[var(--panel-border)] p-5 mb-6 mx-auto max-w-xs">
            <div className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-color)] opacity-50 mb-3">
              Total Stars
            </div>
            {/* Star grid — 10 levels × 3 stars = 30 max */}
            <div className="grid grid-cols-10 gap-1 mb-3">
              {Array.from({ length: maxStars }).map((_, i) => {
                const levelIdx = Math.floor(i / 3);
                const starIdx = (i % 3) + 1;
                const earned = (levelRatings[levelIdx] ?? 0) >= starIdx;
                return (
                  <Star
                    key={i}
                    size={14}
                    className={earned ? 'text-[var(--accent-yellow)]' : 'text-[var(--text-color)] opacity-15'}
                    fill={earned ? 'currentColor' : 'none'}
                    strokeWidth={2}
                  />
                );
              })}
            </div>
            <div className="font-mono text-2xl font-black text-[var(--text-color)]">
              {earnedStars}
              <span className="text-sm opacity-40 font-bold"> / {maxStars}</span>
            </div>
          </div>

          {/* Level breakdown */}
          <div className="bg-[var(--panel-bg)] border-2 border-[var(--panel-border)] p-4 mb-8 mx-auto max-w-xs">
            <div className="grid grid-cols-5 gap-2">
              {LEVELS.map((lvl, i) => {
                const stars = levelRatings[i] ?? 0;
                return (
                  <div key={i} className="flex flex-col items-center gap-0.5">
                    <span className="text-[8px] font-bold uppercase tracking-widest text-[var(--text-color)] opacity-40">
                      {(i + 1).toString().padStart(2, '0')}
                    </span>
                    <div className="flex gap-0.5">
                      {[1, 2, 3].map(s => (
                        <Star
                          key={s}
                          size={8}
                          className={s <= stars ? 'text-[var(--accent-yellow)]' : 'text-[var(--text-color)] opacity-15'}
                          fill={s <= stars ? 'currentColor' : 'none'}
                          strokeWidth={2}
                        />
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Buttons */}
          <div className="flex flex-col gap-3">
            {/* Primary: Gallery */}
            <button onClick={onGallery} className="relative group block w-full">
              <div className="absolute inset-0 bg-[var(--text-color)] translate-x-1.5 translate-y-1.5 transition-transform group-hover:translate-x-2 group-hover:translate-y-2" />
              <div className="relative bg-[var(--accent-yellow)] text-black border-2 border-[var(--panel-border)] py-3 font-black uppercase tracking-widest text-[11px] transition-transform group-active:translate-x-1.5 group-active:translate-y-1.5">
                View Gallery & Achievements
              </div>
            </button>

            <div className="flex gap-3">
              <button onClick={onReplay} className="relative group flex-1">
                <div className="absolute inset-0 bg-[var(--text-color)] translate-x-1 translate-y-1 transition-transform group-hover:translate-x-1.5 group-hover:translate-y-1.5" />
                <div className="relative bg-[var(--panel-bg)] text-[var(--text-color)] border-2 border-[var(--panel-border)] py-2.5 font-bold uppercase tracking-widest text-[10px] transition-transform group-active:translate-x-1 group-active:translate-y-1">
                  Replay Campaign
                </div>
              </button>
              <button onClick={onMenu} className="relative group flex-1">
                <div className="absolute inset-0 bg-[var(--text-color)] translate-x-1 translate-y-1 transition-transform group-hover:translate-x-1.5 group-hover:translate-y-1.5" />
                <div className="relative bg-[var(--panel-bg)] text-[var(--text-color)] border-2 border-[var(--panel-border)] py-2.5 font-bold uppercase tracking-widest text-[10px] transition-transform group-active:translate-x-1 group-active:translate-y-1">
                  Main Menu
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
