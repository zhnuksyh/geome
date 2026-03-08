import { useState, useEffect, useCallback } from 'react';

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
}

export const ACHIEVEMENTS: Achievement[] = [
  // Progression
  { id: 'first_level',        title: 'First Composition',  description: 'Complete your very first level.',                     icon: '🌱' },
  { id: 'completionist',      title: 'Completionist',      description: 'Complete every campaign level.',                      icon: '🏆' },
  // Skill
  { id: 'speed_demon',        title: 'Speed Demon',        description: 'Solve a level in under 10 seconds.',                  icon: '⚡' },
  { id: 'efficiency_expert',  title: 'Efficiency Expert',  description: 'Earn a Gold rating on any level.',                    icon: '🥇' },
  { id: 'perfectionist',      title: 'Perfectionist',      description: 'Achieve 100% visual precision on any level.',         icon: '✨' },
  { id: 'minimalist',         title: 'Minimalist',         description: 'Complete a level using only 1 shape.',                icon: '⬛' },
  // Boolean mastery
  { id: 'first_boolean',      title: 'Boolean Pioneer',    description: 'Apply your first Boolean operation to a shape.',      icon: '🎯' },
  { id: 'boolean_master',     title: 'Boolean Master',     description: 'Use all 4 Boolean operations in a single level.',     icon: '🔀' },
  // Exploration
  { id: 'the_architect',      title: 'The Architect',      description: 'Place 10 or more shapes in a single level.',         icon: '🏗️' },
  { id: 'gallery_artist',     title: 'Gallery Artist',     description: 'Save your first design to the Gallery.',             icon: '🖼️' },
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
        setTimeout(() => setRecentUnlock(null), 4000);
      }
      return [...prev, id];
    });
  }, []);

  return { unlockedIds, recentUnlock, unlock };
}
