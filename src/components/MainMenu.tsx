import { Play, LayoutGrid, PenLine, Volume2, VolumeX, Sun, Moon, Zap } from 'lucide-react';

interface MainMenuProps {
  onPlay: () => void;
  onSandbox: () => void;
  onGallery: () => void;
  isAudioOn: boolean;
  onToggleAudio: () => void;
  theme: 'light' | 'dark' | 'neon';
  onThemeChange: (theme: 'light' | 'dark' | 'neon') => void;
}

export function MainMenu({ onPlay, onSandbox, onGallery, isAudioOn, onToggleAudio, theme, onThemeChange }: MainMenuProps) {
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
          <div className="flex gap-3 mb-4 items-end">
            {/* Square */}
            <div className="w-8 h-8 bg-[var(--accent-red)] border-2 border-[var(--panel-border)]" />
            {/* Circle */}
            <div className="w-9 h-9 bg-[var(--accent-yellow)] border-2 border-[var(--panel-border)] rounded-full" />
            {/* Triangle */}
            <svg width="34" height="30" viewBox="0 0 34 30" fill="none">
              <polygon points="17,1 33,29 1,29" fill="var(--accent-blue)" stroke="var(--panel-border)" strokeWidth="2" strokeLinejoin="round" />
            </svg>
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
              <div className="relative flex flex-col items-center justify-center gap-2 bg-[var(--accent-yellow)] border-4 border-[var(--panel-border)] px-4 py-5 text-black font-black uppercase tracking-widest transition-transform group-active:translate-x-2 group-active:translate-y-2">
                <LayoutGrid size={22} />
                <span className="text-base">Gallery</span>
              </div>
            </button>
          </div>

          {/* Music + Theme Controls */}
          <div className="flex items-center justify-center gap-6 mt-4 pt-6 border-t-2 border-[var(--panel-border)]">
            <button
              onClick={onToggleAudio}
              className={`flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest transition-opacity ${isAudioOn ? 'text-[var(--accent-red)] opacity-100' : 'text-[var(--text-color)] opacity-40 hover:opacity-80'}`}
              title={isAudioOn ? 'Mute Music' : 'Play Music'}
            >
              {isAudioOn ? <Volume2 size={14} /> : <VolumeX size={14} />}
              <span>{isAudioOn ? 'Music On' : 'Music Off'}</span>
            </button>
            <button
              onClick={() => {
                if (theme === 'light') onThemeChange('dark');
                else if (theme === 'dark') onThemeChange('neon');
                else onThemeChange('light');
              }}
              className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-[var(--accent-yellow)] opacity-70 hover:opacity-100 transition-opacity"
              title="Toggle Theme"
            >
              {theme === 'light' ? <Sun size={14} /> : theme === 'dark' ? <Moon size={14} /> : <Zap size={14} />}
              <span>{theme === 'light' ? 'Light' : theme === 'dark' ? 'Dark' : 'Neon'}</span>
            </button>
          </div>
        </div>

        {/* Subtle credit */}
        <p className="text-[8px] font-bold uppercase tracking-[0.3em] text-[var(--text-color)] opacity-20 self-end -mt-8">
          Made by Daimon
        </p>
      </div>
    </div>
  );
}
