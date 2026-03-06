import { Progress } from './ui/Progress';
import { LEVELS } from '../game/levels';

interface ScorePanelProps {
  currentLevel: number;
  accuracy: number;
  moves: number;
  onOpenLevelSelect: () => void;
}

export function ScorePanel({ currentLevel, accuracy, moves, onOpenLevelSelect }: ScorePanelProps) {
  const levelIndex = currentLevel % LEVELS.length;
  const levelData = LEVELS[levelIndex];

  return (
    <div className="bg-[var(--panel-bg)] border-[3px] border-[var(--panel-border)] shadow-[8px_8px_0px_0px_var(--shadow-color)] p-6 w-full">
      <div className="flex items-center gap-3 mb-2">
        <div className="flex gap-1">
          <div className="w-3 h-3 bg-[var(--accent-red)]" />
          <div className="w-3 h-3 bg-[var(--accent-yellow)]" />
          <div className="w-3 h-3 bg-[var(--accent-blue)]" />
        </div>
        <h1 className="text-xl font-black tracking-tighter uppercase text-[var(--text-color)]">Geome</h1>
      </div>

      <button 
        onClick={onOpenLevelSelect}
        className="w-full flex justify-between items-center bg-[var(--bg-color)] border-2 border-[var(--panel-border)] p-2 text-[10px] font-bold uppercase tracking-widest mb-4 hover:bg-[var(--panel-border)] hover:text-[var(--accent-yellow)] transition-colors text-[var(--text-color)]"
      >
        <span>Level {levelIndex + 1}: {levelData.title}</span>
        <span>▼</span>
      </button>

      <div className="flex flex-col gap-2">
        <div className="flex justify-between items-end border-t-2 border-dashed border-[var(--grid-color)] pt-3 mt-1">
          <span className="text-[10px] font-bold text-[var(--text-color)] opacity-60 uppercase">Match Precision</span>
          <span
            className={`font-mono text-xl font-bold ${
              accuracy >= 95 ? 'text-[var(--accent-green)] animate-pulse' : 'text-[var(--text-color)]'
            }`}
          >
            {accuracy.toFixed(1)}%
          </span>
        </div>
        <Progress value={accuracy} target={95} />
      </div>
    </div>
  );
}
