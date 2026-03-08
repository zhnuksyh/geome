import { useState, useEffect } from 'react';
import { ChevronLeft, Trash2, Calendar, LayoutGrid, Download, Upload } from 'lucide-react';
import { Button } from './ui/Button';
import { getGalleryItems, GalleryItem } from '../utils/gallery';

interface GalleryScreenProps {
  onBack: () => void;
  onSelect: (item: GalleryItem) => void;
}

export function GalleryScreen({ onBack, onSelect }: GalleryScreenProps) {
  const [items, setItems] = useState<GalleryItem[]>([]);

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

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-[var(--bg-color)] font-sans overflow-auto p-12">
      <div className="flex items-center justify-between mb-12">
        <Button variant="ghost" onClick={onBack} className="flex gap-2 items-center text-[var(--text-color)] uppercase font-bold tracking-widest hover:-translate-x-1 transition-transform">
          <ChevronLeft size={20} />
          Back to Menu
        </Button>
        <div className="flex flex-col items-end">
          <h2 className="text-5xl font-black tracking-tighter uppercase text-[var(--text-color)]">
            Design Gallery
          </h2>
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
            <span className="text-sm font-bold text-gray-400 uppercase tracking-[0.3em] ml-4">
              Your Saved Geometric Art
            </span>
          </div>
        </div>
      </div>

      {items.length === 0 ? (
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
              className="group relative bg-[var(--panel-bg)] border-4 border-black p-4 cursor-pointer hover:-translate-y-2 transition-all duration-300 shadow-[8px_8px_0px_0px_var(--shadow-color)] hover:shadow-[12px_12px_0px_0px_var(--shadow-color)]"
            >
              {/* Thumbnail Placeholder - in a real app we'd render a mini canvas */}
              <div className="aspect-square bg-white border-2 border-black mb-4 flex items-center justify-center overflow-hidden relative">
                 <div className="absolute inset-0 opacity-10" style={{
                    backgroundImage: 'radial-gradient(var(--grid-color) 1px, transparent 1px)',
                    backgroundSize: '10px 10px',
                 }} />
                 <span className="text-4xl font-black text-black/10 group-hover:scale-110 transition-transform">{item.shapes.length} SHAPES</span>
              </div>

              <div className="flex justify-between items-end">
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1">
                    <Calendar size={10} />
                    {new Date(item.timestamp).toLocaleDateString()}
                  </span>
                  <span className="text-sm font-black uppercase text-[var(--text-color)]">
                    Theme: {item.theme}
                  </span>
                </div>
                <button
                  onClick={(e) => handleDelete(item.id, e)}
                  className="p-2 text-gray-400 hover:text-[var(--accent-red)] transition-colors"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
