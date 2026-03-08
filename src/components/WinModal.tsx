import { Star } from 'lucide-react';

interface WinModalProps {
  isOpen: boolean;
  onNextLevel: () => void;
  moves: number;
  timeElapsed: number;
  par: { bronze: number; silver: number; gold: number; };
  isLastLevel?: boolean;
}

export function WinModal({ isOpen, onNextLevel, moves, timeElapsed, par, isLastLevel = false }: WinModalProps) {
  if (!isOpen) return null;

  const mins = Math.floor(timeElapsed / 60).toString().padStart(2, '0');
  const secs = (timeElapsed % 60).toString().padStart(2, '0');

  // 3 stars = gold, 2 stars = silver/bronze, 1 star = over par (any completion)
  const stars = moves <= par.gold ? 3 : moves <= par.bronze ? 2 : 1;

  let medal = "COMPLETED";
  let medalColor = "text-[var(--text-color)]";
  let message = "Mathematical alignment confirmed.";

  if (moves <= par.gold) {
    medal = "GOLD TIER";
    medalColor = "text-[var(--accent-yellow)]";
    message = "Absolute geometric perfection.";
  } else if (moves <= par.silver) {
    medal = "SILVER TIER";
    medalColor = "text-[#A8AADC]";
    message = "Highly efficient abstraction.";
  } else if (moves <= par.bronze) {
    medal = "BRONZE TIER";
    medalColor = "text-[#CD7F32]";
    message = "Within acceptable parameters.";
  } else {
    message = "Over par. Optimization recommended for future runs.";
  }

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center animate-in fade-in duration-300">
      <div
        className="bg-[var(--panel-bg)] border-[4px] border-[var(--panel-border)] shadow-[12px_12px_0px_0px_var(--shadow-color)] p-12 max-w-sm text-center"
        style={{
          backgroundImage: 'radial-gradient(var(--accent-yellow) 1px, transparent 1px)',
          backgroundSize: '10px 10px',
        }}
      >
        <h2 className={`text-4xl font-black mb-4 tracking-tighter bg-[var(--panel-bg)] inline-block px-4 border-2 border-[var(--panel-border)] ${medalColor}`}>
          {medal}
        </h2>

        {/* Star Rating */}
        <div className="flex gap-2 justify-center mb-4 bg-[var(--panel-bg)] py-2 px-4 border-2 border-[var(--panel-border)] inline-flex mx-auto">
          {[1, 2, 3].map(i => (
            <Star
              key={i}
              size={28}
              className={i <= stars ? 'text-[var(--accent-yellow)]' : 'text-[var(--text-color)] opacity-20'}
              fill={i <= stars ? 'currentColor' : 'none'}
              strokeWidth={2}
            />
          ))}
        </div>

        {/* Stats */}
        <div className="flex gap-3 justify-center mb-4">
          <span className="font-mono text-sm font-bold bg-[var(--panel-bg)] px-2 py-1 border-2 border-[var(--panel-border)] text-[var(--text-color)]">
            {moves} MOVES
          </span>
          <span className="font-mono text-sm font-bold bg-[var(--panel-bg)] px-2 py-1 border-2 border-[var(--panel-border)] text-[var(--text-color)]">
            {mins}:{secs}
          </span>
        </div>

        <p className="text-sm font-bold uppercase tracking-widest mb-8 text-[var(--text-color)] opacity-80 bg-[var(--panel-bg)] inline-block px-2">
          {message}
        </p>
        <button
          onClick={onNextLevel}
          className="w-full py-3 px-8 tracking-[0.2em] uppercase font-bold border-2 border-[var(--panel-border)] bg-[var(--accent-yellow)] text-black hover:brightness-110 hover:translate-y-0.5 transition-transform"
        >
          {isLastLevel ? 'Finish Campaign →' : 'Next Composition'}
        </button>
      </div>
    </div>
  );
}
