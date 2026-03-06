import { Button } from './ui/Button';

interface WinModalProps {
  isOpen: boolean;
  onNextLevel: () => void;
  moves: number;
  par: { bronze: number; silver: number; gold: number; };
}

export function WinModal({ isOpen, onNextLevel, moves, par }: WinModalProps) {
  if (!isOpen) return null;

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
        <h2 className={`text-4xl font-black mb-2 tracking-tighter bg-[var(--panel-bg)] inline-block px-4 border-2 border-[var(--panel-border)] ${medalColor}`}>
          {medal}
        </h2>
        <div className="mb-4">
          <span className="font-mono text-xl font-bold bg-[var(--panel-bg)] px-2 border-2 border-[var(--panel-border)] border-t-0 text-[var(--text-color)]">
            {moves} MOVES
          </span>
        </div>
        <p className="text-sm font-bold uppercase tracking-widest mb-8 text-[var(--text-color)] opacity-80 bg-[var(--panel-bg)] inline-block px-2">
          {message}
        </p>
        <Button
          size="lg"
          className="w-full tracking-[0.2em] uppercase border-2 border-[var(--panel-border)] bg-[var(--panel-bg)] text-[var(--text-color)] rounded-none shadow-none hover:translate-y-1 hover:bg-[var(--accent-yellow)] hover:text-black hover:border-[var(--panel-border)]"
          onClick={onNextLevel}
        >
          Next Composition
        </Button>
      </div>
    </div>
  );
}
