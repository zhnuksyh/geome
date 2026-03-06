import { Play } from 'lucide-react';

interface MainMenuProps {
  onPlay: () => void;
}

export function MainMenu({ onPlay }: MainMenuProps) {
  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#f8f8f8] font-sans"
      style={{
        backgroundImage: 'radial-gradient(#d1d1d1 1px, transparent 1px)',
        backgroundSize: '40px 40px',
      }}
    >
      <div className="flex flex-col items-center gap-12 bg-white border-4 border-black shadow-[16px_16px_0px_0px_rgba(0,0,0,1)] p-16 rotate-1 hover:rotate-0 transition-transform duration-300">
        
        {/* Logo and Concept Art */}
        <div className="flex flex-col items-center gap-6">
          <div className="flex gap-2 mb-4">
            <div className="w-8 h-8 bg-[#E63946] border-2 border-black rotate-12" />
            <div className="w-8 h-8 bg-[#FFB703] border-2 border-black -rotate-12 rounded-full" />
            <div className="w-8 h-8 bg-[#1D3557] border-2 border-black rotate-45" />
          </div>
          
          <h1 className="text-8xl font-black tracking-tighter uppercase text-center">
            GEOME
          </h1>
          <p className="text-xl font-bold tracking-widest text-gray-400 uppercase">
            Construct The Target
          </p>
        </div>

        {/* Play Button */}
        <button 
          onClick={onPlay}
          className="relative group mt-8"
        >
          <div className="absolute inset-0 bg-black translate-x-2 translate-y-2 transition-transform group-hover:translate-x-3 group-hover:translate-y-3" />
          <div className="relative flex items-center gap-4 bg-[#E63946] border-4 border-black px-12 py-6 text-white text-3xl font-black uppercase tracking-widest transition-transform group-active:translate-x-2 group-active:translate-y-2">
            <Play size={32} strokeWidth={3} fill="currentColor" />
            <span>Play Now</span>
          </div>
        </button>
      </div>
    </div>
  );
}
