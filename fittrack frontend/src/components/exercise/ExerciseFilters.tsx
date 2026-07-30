import React from 'react';
import { Search, Filter, X } from 'lucide-react';
import { Category, MuscleGroup, Difficulty } from '../../types';

interface ExerciseFiltersProps {
  searchKeyword: string;
  onSearchChange: (value: string) => void;
  selectedCategory: Category | 'ALL';
  onCategoryChange: (cat: Category | 'ALL') => void;
  selectedMuscleGroup: MuscleGroup | 'ALL';
  onMuscleGroupChange: (muscle: MuscleGroup | 'ALL') => void;
  selectedDifficulty: Difficulty | 'ALL';
  onDifficultyChange: (diff: Difficulty | 'ALL') => void;
  onReset: () => void;
}

const CATEGORIES: Array<Category | 'ALL'> = ['ALL', 'STRENGTH', 'CARDIO', 'FLEXIBILITY', 'BALANCE', 'PLYOMETRIC'];
const MUSCLE_GROUPS: Array<MuscleGroup | 'ALL'> = ['ALL', 'CHEST', 'BACK', 'SHOULDERS', 'ARMS', 'LEGS', 'CORE', 'FULL_BODY', 'CARDIO'];
const DIFFICULTIES: Array<Difficulty | 'ALL'> = ['ALL', 'BEGINNER', 'INTERMEDIATE', 'ADVANCED'];

export const ExerciseFilters: React.FC<ExerciseFiltersProps> = ({
  searchKeyword,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  selectedMuscleGroup,
  onMuscleGroupChange,
  selectedDifficulty,
  onDifficultyChange,
  onReset
}) => {
  const hasActiveFilters =
    searchKeyword !== '' ||
    selectedCategory !== 'ALL' ||
    selectedMuscleGroup !== 'ALL' ||
    selectedDifficulty !== 'ALL';

  return (
    <div className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-4 md:p-5 mb-6 space-y-4 shadow-lg">
      {/* Search Input */}
      <div className="relative">
        <Search className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
        <input
          type="text"
          value={searchKeyword}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search exercise by name or keyword..."
          className="w-full bg-zinc-950 border border-zinc-800 rounded-xl pl-10 pr-4 py-3 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-orange-500 transition-colors"
        />
        {searchKeyword && (
          <button
            onClick={() => onSearchChange('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Filter chips / selects */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {/* Category */}
        <div>
          <label className="block text-xs font-semibold text-zinc-400 mb-1.5 uppercase tracking-wider">
            Category
          </label>
          <select
            value={selectedCategory}
            onChange={(e) => onCategoryChange(e.target.value as Category | 'ALL')}
            className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-sm text-zinc-200 focus:outline-none focus:border-orange-500"
          >
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat === 'ALL' ? 'All Categories' : cat}
              </option>
            ))}
          </select>
        </div>

        {/* Muscle Group */}
        <div>
          <label className="block text-xs font-semibold text-zinc-400 mb-1.5 uppercase tracking-wider">
            Muscle Group
          </label>
          <select
            value={selectedMuscleGroup}
            onChange={(e) => onMuscleGroupChange(e.target.value as MuscleGroup | 'ALL')}
            className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-sm text-zinc-200 focus:outline-none focus:border-orange-500"
          >
            {MUSCLE_GROUPS.map((m) => (
              <option key={m} value={m}>
                {m === 'ALL' ? 'All Muscle Groups' : m}
              </option>
            ))}
          </select>
        </div>

        {/* Difficulty */}
        <div>
          <label className="block text-xs font-semibold text-zinc-400 mb-1.5 uppercase tracking-wider">
            Difficulty
          </label>
          <select
            value={selectedDifficulty}
            onChange={(e) => onDifficultyChange(e.target.value as Difficulty | 'ALL')}
            className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-sm text-zinc-200 focus:outline-none focus:border-orange-500"
          >
            {DIFFICULTIES.map((d) => (
              <option key={d} value={d}>
                {d === 'ALL' ? 'All Difficulties' : d}
              </option>
            ))}
          </select>
        </div>
      </div>

      {hasActiveFilters && (
        <div className="flex justify-end pt-2">
          <button
            onClick={onReset}
            className="text-xs text-orange-400 hover:text-orange-300 font-semibold flex items-center gap-1.5"
          >
            <X className="w-3.5 h-3.5" />
            <span>Reset All Filters</span>
          </button>
        </div>
      )}
    </div>
  );
};
