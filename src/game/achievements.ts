import { useState, useEffect, useCallback } from 'react';

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
}

export const ACHIEVEMENTS: Achievement[] = [
  { id: 'first_boolean', title: 'Boolean Pioneer', description: 'Perform your first Boolean operation.', icon: '🎯' },
  { id: 'speed_demon', title: 'Speed Demon', description: 'Solve a level in under 10 seconds.', icon: '⚡' },
  { id: 'efficiency_expert', title: 'Efficiency Expert', description: 'Earn a Gold medal on any level.', icon: '🥇' },
  { id: 'perfectionist', title: 'Perfectionist', description: 'Achieve 100.0% visual precision.', icon: '✨' },
  { id: 'the_architect', title: 'The Architect', description: 'Place 10 geometric primitives in a single level.', icon: '🏗️' },
];

export function useAchievements() {
  const [unlockedIds, setUnlockedIds] = useState<string[]>(() => {
    try {
      const stored = window.localStorage.getItem('geome_achievements');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const [recentUnlock, setRecentUnlock] = useState<Achievement | null>(null);

  useEffect(() => {
    window.localStorage.setItem('geome_achievements', JSON.stringify(unlockedIds));
  }, [unlockedIds]);

  const unlock = useCallback((id: string) => {
    setUnlockedIds((prev) => {
      if (prev.includes(id)) return prev;
      const achievement = ACHIEVEMENTS.find(a => a.id === id);
      if (achievement) {
        setRecentUnlock(achievement);
        // Clear toast after 4s
        setTimeout(() => setRecentUnlock(null), 4000);
      }
      return [...prev, id];
    });
  }, []);

  return { unlockedIds, recentUnlock, unlock };
}
