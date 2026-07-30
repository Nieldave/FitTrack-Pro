import React from 'react';
import { motion } from 'motion/react';
import { Play, Edit2, Trash2, Clock, Dumbbell, Calendar } from 'lucide-react';
import { WorkoutResponse } from '../../types';

interface WorkoutCardProps {
  workout: WorkoutResponse;
  onStart: (id: number) => void;
  onEdit: (workout: WorkoutResponse) => void;
  onDelete: (id: number) => void;
}

export const WorkoutCard: React.FC<WorkoutCardProps> = ({
  workout,
  onStart,
  onEdit,
  onDelete
}) => {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      className="p-6 rounded-3xl bg-zinc-900 border border-zinc-800 hover:border-orange-500/30 transition-all shadow-lg flex flex-col justify-between group"
    >
      <div>
        <div className="flex justify-between items-start mb-3">
          <h3 className="font-bold text-lg text-white group-hover:text-orange-400 transition-colors">
            {workout.title}
          </h3>
          <span className="px-2.5 py-0.5 text-[11px] font-bold uppercase rounded-md bg-zinc-800 text-zinc-300 border border-zinc-700">
            {workout.day}
          </span>
        </div>

        <div className="flex items-center gap-4 text-xs text-zinc-400 mb-5">
          <div className="flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-orange-400" />
            <span>{workout.duration} mins</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Dumbbell className="w-4 h-4 text-amber-400" />
            <span>{workout.exercises.length} Exercises</span>
          </div>
        </div>

        {/* Exercise preview pills */}
        <div className="flex flex-wrap gap-1.5 mb-6">
          {workout.exercises.slice(0, 3).map((ex, idx) => (
            <span
              key={idx}
              className="text-[11px] bg-zinc-800 text-zinc-300 px-2.5 py-1 rounded-lg border border-zinc-700"
            >
              {ex.exerciseName || `Exercise ${ex.exerciseId}`} ({ex.sets}×{ex.reps})
            </span>
          ))}
          {workout.exercises.length > 3 && (
            <span className="text-[11px] text-zinc-400 self-center">
              +{workout.exercises.length - 3} more
            </span>
          )}
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex items-center gap-2 pt-4 border-t border-zinc-800">
        <button
          onClick={() => onStart(workout.id)}
          className="flex-1 py-2.5 px-4 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-md shadow-orange-900/20 transition-colors"
        >
          <Play className="w-4 h-4 fill-white" />
          <span>Start</span>
        </button>
        <button
          onClick={() => onEdit(workout)}
          className="p-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 transition-colors"
          title="Edit Workout"
        >
          <Edit2 className="w-4 h-4" />
        </button>
        <button
          onClick={() => onDelete(workout.id)}
          className="p-2.5 rounded-xl bg-zinc-800 hover:bg-rose-950 hover:text-rose-400 text-zinc-400 transition-colors"
          title="Delete Workout"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </motion.div>
  );
};
