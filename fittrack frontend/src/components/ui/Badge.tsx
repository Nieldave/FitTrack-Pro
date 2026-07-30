import React from 'react';
import { Difficulty, Category } from '../../types';

export const DifficultyBadge: React.FC<{ difficulty: Difficulty }> = ({ difficulty }) => {
  const styles: Record<Difficulty, string> = {
    BEGINNER: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    INTERMEDIATE: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    ADVANCED: 'bg-rose-500/10 text-rose-400 border-rose-500/20'
  };

  return (
    <span className={`px-2.5 py-0.5 text-xs font-semibold rounded-full border whitespace-nowrap ${styles[difficulty]}`}>
      {difficulty}
    </span>
  );
};

export const CategoryBadge: React.FC<{ category: Category }> = ({ category }) => {
  const colors: Record<Category, string> = {
    STRENGTH: 'bg-orange-500/10 text-orange-400 border-orange-500/20',
    CARDIO: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
    FLEXIBILITY: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
    BALANCE: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    PLYOMETRIC: 'bg-pink-500/10 text-pink-400 border-pink-500/20'
  };

  return (
    <span className={`px-2.5 py-0.5 text-xs font-medium rounded-full border whitespace-nowrap ${colors[category] || 'bg-zinc-800 text-zinc-300 border-zinc-700'}`}>
      {category}
    </span>
  );
};
