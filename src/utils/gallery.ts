import type { ShapeObj } from '../types/game';

export interface GalleryItem {
  id: string;
  shapes: ShapeObj[];
  theme: 'light' | 'dark' | 'neon';
  timestamp: number;
}

const STORAGE_KEY = 'geome_gallery';

export const saveGalleryItem = (shapes: ShapeObj[], theme: 'light' | 'dark' | 'neon') => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    const gallery: GalleryItem[] = stored ? JSON.parse(stored) : [];
    
    const newItem: GalleryItem = {
      id: Math.random().toString(36).substr(2, 9),
      shapes,
      theme,
      timestamp: Date.now(),
    };
    
    gallery.unshift(newItem); // Add to front
    localStorage.setItem(STORAGE_KEY, JSON.stringify(gallery));
    return true;
  } catch (error) {
    console.error('Failed to save to gallery:', error);
    return false;
  }
};

export const getGalleryItems = (): GalleryItem[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};
