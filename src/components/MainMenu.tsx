import { Play, LayoutGrid, PenLine } from 'lucide-react';

interface MainMenuProps {
  onPlay: () => void;
  onSandbox: () => void;
  onGallery: () => void;
}

export function MainMenu({ onPlay, onSandbox, onGallery }: MainMenuProps) {
  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-[var(--bg-color)] font-sans"
      style={{
        backgroundImage: 'radial-gradient(var(--grid-color) 1px, transparent 1px)',
        backgroundSize: '40px 40px',
      }}
    >
      <div className="flex flex-col items-center gap-12 bg-[var(--panel-bg)] border-4 border-[var(--panel-border)] shadow-[16px_16px_0px_0px_var(--shadow-color)] p-16 rotate-1 hover:rotate-0 transition-transform duration-300">
        
        {/* Logo and Concept Art */}
        <div className="flex flex-col items-center gap-6">
          <div className="flex gap-2 mb-4">
            <div className="w-8 h-8 bg-[var(--accent-red)] border-2 border-[var(--panel-border)] rotate-12" />
            <div className="w-8 h-8 bg-[var(--accent-yellow)] border-2 border-[var(--panel-border)] -rotate-12 rounded-full" />
            <div className="w-8 h-8 bg-[var(--accent-blue)] border-2 border-[var(--panel-border)] rotate-45" />
          </div>
          
          <h1 className="text-8xl font-black tracking-tighter uppercase text-center text-[var(--text-color)]">
            GEOME
          </h1>
          <p className="text-xl font-bold tracking-widest text-[var(--text-color)] opacity-40 uppercase">
            Construct The Target
          </p>
        </div>

        {/* Buttons */}
        <div className="flex flex-col gap-4 mt-8 w-full max-w-sm">
          <button 
            onClick={onPlay}
            className="relative group w-full"
          >
            <div className="absolute inset-0 bg-[var(--text-color)] translate-x-2 translate-y-2 transition-transform group-hover:translate-x-3 group-hover:translate-y-3" />
            <div className="relative flex items-center justify-center gap-4 bg-[var(--accent-red)] border-4 border-[var(--panel-border)] px-12 py-6 text-[var(--bg-color)] text-3xl font-black uppercase tracking-widest transition-transform group-active:translate-x-2 group-active:translate-y-2">
              <Play size={32} strokeWidth={3} fill="currentColor" />
              <span>Campaign</span>
            </div>
          </button>

          <div className="flex gap-4 w-full">
            <button
              onClick={onSandbox}
              className="relative group flex-1"
            >
              <div className="absolute inset-0 bg-[var(--text-color)] translate-x-2 translate-y-2 transition-transform group-hover:translate-x-3 group-hover:translate-y-3" />
              <div className="relative flex flex-col items-center justify-center gap-2 bg-[var(--accent-blue)] border-4 border-[var(--panel-border)] px-4 py-5 text-[var(--bg-color)] font-black uppercase tracking-widest transition-transform group-active:translate-x-2 group-active:translate-y-2">
                <PenLine size={22} strokeWidth={3} />
                <span className="text-base">Sandbox</span>
              </div>
            </button>

            <button
              onClick={onGallery}
              className="relative group flex-1"
            >
              <div className="absolute inset-0 bg-[var(--text-color)] translate-x-2 translate-y-2 transition-transform group-hover:translate-x-3 group-hover:translate-y-3" />
              <div className="relative flex flex-col items-center justify-center gap-2 bg-[var(--panel-bg)] border-4 border-[var(--panel-border)] px-4 py-5 text-[var(--text-color)] font-black uppercase tracking-widest transition-transform group-active:translate-x-2 group-active:translate-y-2 hover:bg-[var(--accent-yellow)] hover:text-black transition-colors">
                <LayoutGrid size={22} />
                <span className="text-base">Gallery</span>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
