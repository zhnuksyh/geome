import { Progress } from './ui/Progress';
import { LEVELS } from '../game/levels';

interface ScorePanelProps {
  currentLevel: number;
  accuracy: number;
  onSelectLevel: (levelIndex: number) => void;
}

export function ScorePanel({ currentLevel, accuracy, onSelectLevel }: ScorePanelProps) {
  const levelIndex = currentLevel % LEVELS.length;

  return (
    <div className="bg-white border-[3px] border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-6 w-[320px]">
      <div className="flex items-center gap-3 mb-2">
        <div className="flex gap-1">
          <div className="w-3 h-3 bg-[#E63946]" />
          <div className="w-3 h-3 bg-[#FFB703]" />
          <div className="w-3 h-3 bg-[#1D3557]" />
        </div>
        <h1 className="text-xl font-black tracking-tighter uppercase">Geome</h1>
      </div>

      <select 
        value={currentLevel} 
        onChange={(e) => onSelectLevel(Number(e.target.value))}
        className="w-full bg-[#f8f8f8] border-2 border-black p-2 text-xs font-bold uppercase tracking-widest mb-4 cursor-pointer outline-none hover:bg-gray-100 transition-colors focus:ring-0"
      >
        {LEVELS.map((lvl, index) => (
          <option key={index} value={index}>
            Level {index + 1}: {lvl.title}
          </option>
        ))}
      </select>

      <div className="flex flex-col gap-2">
        <div className="flex justify-between items-end">
          <span className="text-[10px] font-bold text-gray-500 uppercase">Match Precision</span>
          <span
            className={`font-mono text-xl font-bold ${
              accuracy >= 95 ? 'text-[#E63946] animate-pulse' : 'text-black'
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
