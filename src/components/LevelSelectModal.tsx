import { Lock, Goal, X, Star } from 'lucide-react';
import { LEVELS } from '../game/levels';

interface LevelSelectModalProps {
  isOpen: boolean;
  currentLevelIndex: number;
  maxUnlockedLevel: number;
  levelRatings?: Record<number, number>;
  onSelectLevel: (index: number) => void;
  onClose: () => void;
}

export function LevelSelectModal({
  isOpen,
  currentLevelIndex,
  maxUnlockedLevel,
  levelRatings = {},
  onSelectLevel,
  onClose,
}: LevelSelectModalProps) {
  if (!isOpen) return null;

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center pointer-events-auto">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-[var(--bg-color)] border-[4px] border-[var(--panel-border)] shadow-[12px_12px_0px_0px_var(--shadow-color)] w-full max-w-3xl max-h-[85vh] flex flex-col">
        {/* Header */}
        <div className="bg-[var(--text-color)] text-[var(--bg-color)] p-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <Goal className="w-6 h-6 text-[var(--accent-yellow)]" />
            <h2 className="text-xl font-black tracking-widest uppercase text-[var(--bg-color)]">Select Level</h2>
          </div>
          <button
            onClick={onClose}
            className="hover:opacity-75 transition-opacity rounded-none p-1 text-[var(--bg-color)]"
          >
            <X size={24} strokeWidth={3} />
          </button>
        </div>

        {/* Content */}
        <div className="p-8 overflow-y-auto">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
            {LEVELS.map((lvl, index) => {
              const isLocked = index > maxUnlockedLevel;
              const isActive = index === (currentLevelIndex % LEVELS.length);
              const rating = levelRatings[index] || 0;

              if (isLocked) {
                return (
                  <div
                    key={index}
                    className="relative bg-[var(--bg-color)] border-2 border-[var(--panel-border)] p-6 flex flex-col items-center justify-center aspect-square opacity-50 pointer-events-none"
                  >
                    <Lock className="w-8 h-8 text-[var(--text-color)] opacity-50 mb-2" />
                    <span className="text-xs font-bold text-[var(--text-color)] opacity-50 tracking-widest uppercase">Locked</span>
                  </div>
                );
              }

              return (
                <div key={index} className="relative aspect-square group">
                  {/* Fake background for shadow impression without actually moving layout */}
                  <div className="absolute inset-0 bg-[var(--text-color)] left-1 top-1" />
                  <button
                    onClick={() => {
                      onSelectLevel(index);
                      onClose();
                    }}
                    className={`absolute inset-0 flex flex-col items-center justify-center p-4 text-center transition-all border-2 border-[var(--panel-border)]
                      ${
                        isActive
                          ? 'bg-[var(--text-color)] text-[var(--accent-yellow)] border-[var(--panel-border)] translate-x-1 translate-y-1'
                          : 'bg-[var(--panel-bg)] text-[var(--text-color)] hover:opacity-90 hover:-translate-y-1 hover:-translate-x-1 shadow-[4px_4px_0px_0px_var(--shadow-color)] group-hover:shadow-[8px_8px_0px_0px_var(--shadow-color)]'
                      }`}
                  >
                    <div className={`text-base font-black tracking-widest uppercase mb-1 ${isActive ? "text-[var(--bg-color)]" : "text-[var(--text-color)]"}`}>
                      Level {index + 1}
                    </div>
                    <div className="text-[10px] font-bold tracking-widest uppercase opacity-70 mb-2">
                      {lvl.title}
                    </div>
                    {rating > 0 && (
                      <div className="flex gap-0.5">
                        {[1, 2, 3].map(i => (
                          <Star
                            key={i}
                            size={12}
                            className={i <= rating ? 'text-[var(--accent-yellow)]' : 'text-[var(--text-color)] opacity-20'}
                            fill={i <= rating ? 'currentColor' : 'none'}
                            strokeWidth={2}
                          />
                        ))}
                      </div>
                    )}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
