import { Lock, Goal, X } from 'lucide-react';
import { LEVELS } from '../game/levels';

interface LevelSelectModalProps {
  isOpen: boolean;
  currentLevelIndex: number;
  maxUnlockedLevel: number;
  onSelectLevel: (index: number) => void;
  onClose: () => void;
}

export function LevelSelectModal({
  isOpen,
  currentLevelIndex,
  maxUnlockedLevel,
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
      <div className="relative bg-[#f8f8f8] border-[4px] border-black shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] w-full max-w-3xl max-h-[85vh] flex flex-col">
        {/* Header */}
        <div className="bg-black text-white p-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <Goal className="w-6 h-6 text-[#FFB703]" />
            <h2 className="text-xl font-black tracking-widest uppercase">Select Level</h2>
          </div>
          <button 
            onClick={onClose}
            className="hover:bg-white hover:text-black transition-colors rounded-none p-1"
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
              
              if (isLocked) {
                return (
                  <div 
                    key={index}
                    className="relative bg-gray-200 border-2 border-gray-400 p-6 flex flex-col items-center justify-center aspect-square opacity-60 pointer-events-none"
                  >
                    <Lock className="w-8 h-8 text-gray-500 mb-2" />
                    <span className="text-xs font-bold text-gray-500 tracking-widest uppercase">Locked</span>
                  </div>
                );
              }

              return (
                <div key={index} className="relative aspect-square group">
                  {/* Fake background for shadow impression without actually moving layout */}
                  <div className="absolute inset-0 bg-black left-1 top-1" />
                  <button
                    onClick={() => {
                      onSelectLevel(index);
                      onClose();
                    }}
                    className={`absolute inset-0 flex flex-col items-center justify-center p-4 text-center transition-all border-2 border-black
                      ${
                        isActive
                          ? 'bg-black text-[#FFB703] border-black translate-x-1 translate-y-1'
                          : 'bg-white text-black hover:bg-gray-50 hover:-translate-y-1 hover:-translate-x-1 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] group-hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]'
                      }`}
                  >
                    <div className={`text-base font-black tracking-widest uppercase mb-1 ${isActive ? "text-white" : ""}`}>
                      Level {index + 1}
                    </div>
                    <div className="text-[10px] font-bold tracking-widest uppercase opacity-70">
                      {lvl.title}
                    </div>
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
