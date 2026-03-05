import { Button } from './ui/Button';

interface WinModalProps {
  isOpen: boolean;
  onNextLevel: () => void;
}

export function WinModal({ isOpen, onNextLevel }: WinModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center animate-in fade-in duration-300">
      <div
        className="bg-white border-[4px] border-black shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] p-12 max-w-sm text-center"
        style={{
          backgroundImage: 'radial-gradient(#FFB703 1px, transparent 1px)',
          backgroundSize: '10px 10px',
          backgroundColor: '#fffdf5',
        }}
      >
        <h2 className="text-5xl font-black mb-4 tracking-tighter bg-white inline-block px-4 border-2 border-black">
          HARMONY
        </h2>
        <p className="text-sm font-bold uppercase tracking-widest mb-8 text-black/80 bg-white inline-block px-2">
          Mathematical alignment confirmed.
        </p>
        <Button
          size="lg"
          className="w-full tracking-[0.2em] uppercase border-2 border-black rounded-none shadow-none hover:translate-y-1"
          onClick={onNextLevel}
        >
          Next Composition
        </Button>
      </div>
    </div>
  );
}
