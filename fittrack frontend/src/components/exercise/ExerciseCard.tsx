import React from 'react';
import { motion } from 'motion/react';
import { Flame, Dumbbell, ChevronRight, Plus } from 'lucide-react';
import { Exercise } from '../../types';
import { DifficultyBadge, CategoryBadge } from '../ui/Badge';

interface ExerciseCardProps {
  exercise: Exercise;
  onClick: (exercise: Exercise) => void;
  onAddToWorkout?: (exercise: Exercise) => void;
}

export const ExerciseCard: React.FC<ExerciseCardProps> = ({
  exercise,
  onClick,
  onAddToWorkout
}) => {
  return (
    <motion.div
      whileHover={{ y: -3 }}
      transition={{ duration: 0.15 }}
      onClick={() => onClick(exercise)}
      className="rounded-2xl bg-zinc-900 border border-zinc-800 hover:border-orange-500/40 cursor-pointer transition-all flex flex-col group shadow-lg overflow-hidden"
    >
      {/* Placeholder Image Section */}
      <div className="h-40 w-full bg-zinc-800 relative">
        <div className="absolute inset-0 flex items-center justify-center opacity-30">
          <Dumbbell className="w-12 h-12 text-zinc-500" />
        </div>
        <div className="absolute top-3 right-3 flex gap-2">
           <DifficultyBadge difficulty={exercise.difficulty} />
        </div>
        <button
           onClick={(e) => { e.stopPropagation(); /* mock favorite toggle */ }}
           className="absolute bottom-3 right-3 w-8 h-8 rounded-full bg-zinc-950/60 backdrop-blur-sm flex items-center justify-center text-zinc-400 hover:text-orange-500 hover:bg-zinc-950/90 transition-all border border-zinc-800"
        >
           <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
        </button>
      </div>

      <div className="p-5 flex-1 flex flex-col">
        <div>
          <h3 className="font-bold text-base text-white group-hover:text-orange-400 transition-colors mb-2">
            {exercise.name}
          </h3>

          <p className="text-xs text-zinc-400 line-clamp-2 mb-4 leading-relaxed">
            {exercise.description}
          </p>

          <div className="flex flex-wrap gap-2 mb-4">
            <CategoryBadge category={exercise.category} />
            <span className="px-2.5 py-0.5 text-xs rounded-full bg-zinc-800 text-zinc-300 border border-zinc-700">
              {exercise.muscleGroup}
            </span>
          </div>
        </div>

        <div className="pt-3 border-t border-zinc-800 flex items-center justify-between text-xs text-zinc-400 mt-auto">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <Dumbbell className="w-3.5 h-3.5 text-zinc-400" />
              {exercise.equipment}
            </span>
            <span className="flex items-center gap-1 text-orange-400 font-semibold">
              <Flame className="w-3.5 h-3.5 fill-orange-400" />
              {exercise.caloriesBurned} kcal
            </span>
          </div>

          {onAddToWorkout ? (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onAddToWorkout(exercise);
              }}
              className="px-3 py-1.5 rounded-lg bg-orange-600 hover:bg-orange-500 text-white font-medium transition-colors flex items-center gap-1.5 shadow-md shadow-orange-900/20"
              title="Add to Workout"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add</span>
            </button>
          ) : (
            <ChevronRight className="w-4 h-4 text-zinc-400 group-hover:translate-x-1 transition-transform" />
          )}
        </div>
      </div>
    </motion.div>
  );
};
