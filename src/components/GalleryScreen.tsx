import { useState, useEffect, useRef } from 'react';
import { ChevronLeft, Trash2, Calendar, LayoutGrid, Download, Upload, Trophy, Lock } from 'lucide-react';
import { Button } from './ui/Button';
import { getGalleryItems, GalleryItem } from '../utils/gallery';
import { CANVAS_SIZE, drawShape } from '../game/levels';
import { ACHIEVEMENTS } from '../game/achievements';

const THEME_FILL: Record<'light' | 'dark' | 'neon', string> = {
  light: '#111827',
  dark: '#e5e5e5',
  neon: '#66fcf1',
};

const THEME_BG: Record<'light' | 'dark' | 'neon', string> = {
  light: '#ffffff',
  dark: '#1f1f1f',
  neon: '#0b0c10',
};

function GalleryThumbnail({ item }: { item: GalleryItem }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.fillStyle = THEME_BG[item.theme];
    ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);

    item.shapes.forEach((s) => {
      drawShape(ctx, s.type, s.op, s.x, s.y, s.size, s.rotation, THEME_FILL[item.theme], s.clipPlanes);
    });
  }, [item]);

  return (
    <canvas
      ref={canvasRef}
      width={CANVAS_SIZE}
      height={CANVAS_SIZE}
      className="w-full h-full"
    />
  );
}

interface GalleryScreenProps {
  onBack: () => void;
  onSelect: (item: GalleryItem) => void;
  unlockedIds: string[];
}

type Tab = 'designs' | 'achievements';

export function GalleryScreen({ onBack, onSelect, unlockedIds }: GalleryScreenProps) {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [activeTab, setActiveTab] = useState<Tab>('designs');

  useEffect(() => {
    setItems(getGalleryItems());
  }, []);

  const handleExport = () => {
    const stored = localStorage.getItem('geome_gallery');
    if (!stored) return;
    const blob = new Blob([stored], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `geome_gallery_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = event.target?.result as string;
        const decoded = JSON.parse(json);
        if (Array.isArray(decoded)) {
          const existing = getGalleryItems();
          const merged = [...decoded, ...existing].filter((v, i, a) => a.findIndex(t => t.id === v.id) === i);
          localStorage.setItem('geome_gallery', JSON.stringify(merged));
          setItems(merged);
        }
      } catch (err) {
        alert('Invalid gallery file');
      }
    };
    reader.readAsText(file);
  };

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const stored = localStorage.getItem('geome_gallery');
    if (stored) {
      const gallery: GalleryItem[] = JSON.parse(stored);
      const filtered = gallery.filter(item => item.id !== id);
      localStorage.setItem('geome_gallery', JSON.stringify(filtered));
      setItems(filtered);
    }
  };

  const unlockedCount = ACHIEVEMENTS.filter(a => unlockedIds.includes(a.id)).length;

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-[var(--bg-color)] font-sans overflow-auto p-12">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <Button variant="ghost" onClick={onBack} className="flex gap-2 items-center text-[var(--text-color)] uppercase font-bold tracking-widest hover:-translate-x-1 transition-transform">
          <ChevronLeft size={20} />
          Back to Menu
        </Button>
        <div className="flex flex-col items-end">
          <h2 className="text-5xl font-black tracking-tighter uppercase text-[var(--text-color)]">
            Gallery
          </h2>
          {activeTab === 'designs' && (
            <div className="flex gap-4 mt-2">
              <label className="cursor-pointer flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-[var(--text-color)] opacity-60 hover:opacity-100 transition-opacity">
                <Upload size={14} />
                Import JSON
                <input type="file" accept=".json" onChange={handleImport} className="hidden" />
              </label>
              <button onClick={handleExport} className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-[var(--text-color)] opacity-60 hover:opacity-100 transition-opacity">
                <Download size={14} />
                Export JSON
              </button>
              <span className="text-sm font-bold text-[var(--text-color)] opacity-40 uppercase tracking-[0.3em] ml-4">
                Your Saved Geometric Art
              </span>
            </div>
          )}
          {activeTab === 'achievements' && (
            <p className="text-sm font-bold text-[var(--text-color)] opacity-40 uppercase tracking-[0.3em] mt-2">
              {unlockedCount} / {ACHIEVEMENTS.length} Unlocked
            </p>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-0 mb-8 border-b-4 border-[var(--panel-border)]">
        {([
          { id: 'designs' as Tab, label: 'Designs', icon: LayoutGrid },
          { id: 'achievements' as Tab, label: 'Achievements', icon: Trophy },
        ]).map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className={`relative flex items-center gap-2 px-8 py-3 text-[11px] font-black uppercase tracking-widest transition-all
              ${activeTab === id
                ? 'bg-[var(--accent-yellow)] text-black border-4 border-b-0 border-[var(--panel-border)] -mb-[4px]'
                : 'bg-[var(--panel-bg)] text-[var(--text-color)] opacity-60 hover:opacity-100 border-4 border-transparent -mb-[4px]'
              }`}
          >
            <Icon size={14} />
            {label}
          </button>
        ))}
      </div>

      {/* Designs Tab */}
      {activeTab === 'designs' && (
        items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center border-4 border-dashed border-[var(--grid-color)] opacity-40">
            <LayoutGrid size={64} className="mb-4" />
            <p className="text-xl font-bold uppercase tracking-widest">No designs saved yet</p>
            <p className="text-sm uppercase tracking-widest mt-2">Enter Sandbox mode to create and save art!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {items.map((item) => (
              <div
                key={item.id}
                onClick={() => onSelect(item)}
                className="group relative bg-[var(--panel-bg)] border-4 border-[var(--panel-border)] p-4 cursor-pointer hover:-translate-y-2 transition-all duration-300 shadow-[8px_8px_0px_0px_var(--shadow-color)] hover:shadow-[12px_12px_0px_0px_var(--shadow-color)]"
              >
                <div className="aspect-square border-2 border-[var(--panel-border)] mb-4 overflow-hidden">
                  <GalleryThumbnail item={item} />
                </div>
                <div className="flex justify-between items-end">
                  <div className="flex flex-col">
                    <span className="text-[10px] font-bold text-[var(--text-color)] opacity-50 uppercase tracking-widest flex items-center gap-1">
                      <Calendar size={10} />
                      {new Date(item.timestamp).toLocaleDateString()}
                    </span>
                    <span className="text-sm font-black uppercase text-[var(--text-color)]">
                      Theme: {item.theme}
                    </span>
                  </div>
                  <button
                    onClick={(e) => handleDelete(item.id, e)}
                    className="p-2 text-[var(--text-color)] opacity-40 hover:text-[var(--accent-red)] hover:opacity-100 transition-colors"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )
      )}

      {/* Achievements Tab */}
      {activeTab === 'achievements' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
          {ACHIEVEMENTS.map((a) => {
            const unlocked = unlockedIds.includes(a.id);
            return (
              <div
                key={a.id}
                className={`relative border-4 border-[var(--panel-border)] p-6 flex flex-col items-center gap-3 text-center transition-all
                  ${unlocked
                    ? 'bg-[var(--panel-bg)] shadow-[8px_8px_0px_0px_var(--shadow-color)]'
                    : 'bg-[var(--bg-color)] opacity-50'
                  }`}
              >
                {/* Shadow offset for unlocked cards */}
                {unlocked && <div className="absolute inset-0 bg-[var(--panel-border)] translate-x-2 translate-y-2 -z-10" />}

                <div className={`text-5xl leading-none ${unlocked ? '' : 'grayscale'}`}>
                  {unlocked ? a.icon : <Lock size={40} className="text-[var(--text-color)] opacity-30" />}
                </div>

                <div className="text-sm font-black uppercase tracking-widest text-[var(--text-color)] leading-tight">
                  {a.title}
                </div>

                <div className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-color)] opacity-60 leading-relaxed">
                  {a.description}
                </div>

                {unlocked ? (
                  <span className="text-[9px] font-black uppercase tracking-widest bg-[var(--accent-yellow)] text-black px-3 py-1 mt-auto">
                    Earned
                  </span>
                ) : (
                  <span className="text-[9px] font-black uppercase tracking-widest border-2 border-[var(--panel-border)] text-[var(--text-color)] opacity-40 px-3 py-1 mt-auto">
                    Locked
                  </span>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
