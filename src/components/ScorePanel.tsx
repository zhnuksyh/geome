import { Progress } from './ui/Progress';
import { LEVELS } from '../game/levels';

interface ScorePanelProps {
  currentLevel: number;
  accuracy: number;
  onOpenLevelSelect: () => void;
}

export function ScorePanel({ currentLevel, accuracy, onOpenLevelSelect }: ScorePanelProps) {
  const levelIndex = currentLevel % LEVELS.length;
  const levelData = LEVELS[levelIndex];

  return (
    <div className="bg-white border-[3px] border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-6 w-full">
      <div className="flex items-center gap-3 mb-2">
        <div className="flex gap-1">
          <div className="w-3 h-3 bg-[#E63946]" />
          <div className="w-3 h-3 bg-[#FFB703]" />
          <div className="w-3 h-3 bg-[#1D3557]" />
        </div>
        <h1 className="text-xl font-black tracking-tighter uppercase">Geome</h1>
      </div>

      <button 
        onClick={onOpenLevelSelect}
        className="w-full flex justify-between items-center bg-[#f8f8f8] border-2 border-black p-2 text-[10px] font-bold uppercase tracking-widest mb-4 hover:bg-black hover:text-[#FFB703] transition-colors"
      >
        <span>Level {levelIndex + 1}: {levelData.title}</span>
        <span>▼</span>
      </button>

      <div className="flex flex-col gap-2">
        <div className="flex justify-between items-end">
          <span className="text-[10px] font-bold text-gray-500 uppercase">Match Precision</span>
          <span
            className={`font-mono text-xl font-bold ${
              accuracy >= 95 ? 'text-[#4CAF50] animate-pulse' : 'text-black'
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
