import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Dumbbell, Flame, Plus, CheckCircle2 } from 'lucide-react';
import { useExercise } from '../hooks/useExercises';
import { useMyWorkouts, useUpdateWorkout } from '../hooks/useWorkouts';
import { DifficultyBadge, CategoryBadge } from '../components/ui/Badge';
import { Modal } from '../components/ui/Modal';
import { Skeleton } from '../components/ui/Skeleton';
import { useToast } from '../components/ui/Toast';

export const ExerciseDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const exerciseId = Number(id);
  const { showSuccess, showError } = useToast();

  const { data: exercise, isLoading } = useExercise(exerciseId);
  const { data: workoutsData } = useMyWorkouts(0, 50);
  const updateWorkoutMutation = useUpdateWorkout();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const workouts = workoutsData?.content || [];

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-40 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (!exercise) {
    return (
      <div className="text-center py-16 space-y-4">
        <h3 className="text-xl font-bold text-white">Exercise Not Found</h3>
        <button
          onClick={() => navigate('/exercises')}
          className="px-4 py-2 bg-orange-500 text-zinc-950 font-bold rounded-xl text-xs"
        >
          Back to Library
        </button>
      </div>
    );
  }

  const handleAddToWorkout = async (workoutId: number) => {
    const targetWorkout = workouts.find((w) => w.id === workoutId);
    if (!targetWorkout) return;

    if (targetWorkout.exercises.some((e) => e.exerciseId === exercise.id)) {
      showError('This exercise is already part of that workout routine');
      return;
    }

    const updatedExercises = [
      ...targetWorkout.exercises,
      {
        exerciseId: exercise.id,
        exerciseName: exercise.name,
        sets: 3,
        reps: 10,
        sequenceOrder: targetWorkout.exercises.length + 1
      }
    ];

    try {
      await updateWorkoutMutation.mutateAsync({
        id: targetWorkout.id,
        data: {
          title: targetWorkout.title,
          day: targetWorkout.day,
          duration: targetWorkout.duration,
          exercises: updatedExercises
        }
      });
      showSuccess(`Added ${exercise.name} to ${targetWorkout.title}!`);
      setIsAddModalOpen(false);
    } catch (err: any) {
      showError(err?.message || 'Failed to update workout');
    }
  };

  return (
    <div className="space-y-6">
      <button
        onClick={() => navigate('/exercises')}
        className="flex items-center gap-2 text-xs font-semibold text-zinc-400 hover:text-white transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Exercise Library</span>
      </button>

      {/* Hero Banner */}
      <div className="p-6 md:p-8 rounded-3xl bg-zinc-900 border border-zinc-800 shadow-xl space-y-6">
        {/* Placeholder Media Section */}
        <div className="w-full h-64 md:h-80 bg-zinc-800 rounded-2xl relative overflow-hidden flex items-center justify-center border border-zinc-700/50">
          <div className="absolute inset-0 flex items-center justify-center opacity-30">
            <Dumbbell className="w-24 h-24 text-zinc-500" />
          </div>
          <button className="relative z-10 w-16 h-16 rounded-full bg-orange-600/90 text-white flex items-center justify-center backdrop-blur-md shadow-lg shadow-orange-900/40 hover:scale-110 transition-transform">
             <svg className="w-8 h-8 ml-1" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" /></svg>
          </button>
        </div>

        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <CategoryBadge category={exercise.category} />
              <DifficultyBadge difficulty={exercise.difficulty} />
            </div>
            <h2 className="text-3xl font-black text-white">{exercise.name}</h2>
            <p className="text-sm text-zinc-400 mt-2 max-w-2xl">{exercise.description}</p>
          </div>

          <div className="flex items-center gap-3">
             <button
               onClick={() => { /* Mock Favorite */ }}
               className="w-12 h-12 rounded-2xl bg-zinc-800 border border-zinc-700 text-zinc-400 hover:text-orange-500 hover:bg-zinc-700 transition-all flex items-center justify-center shrink-0"
               title="Favorite"
             >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
             </button>
             <button
               onClick={() => setIsAddModalOpen(true)}
               className="py-3 px-6 rounded-2xl bg-orange-600 hover:bg-orange-500 text-white font-bold text-sm flex items-center gap-2 shadow-lg shadow-orange-900/20 transition-all shrink-0"
             >
               <Plus className="w-5 h-5" />
               <span>Add to Workout</span>
             </button>
          </div>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-zinc-800">
          <div className="p-4 rounded-xl bg-zinc-950/60 border border-zinc-800">
            <div className="text-xs text-zinc-500 font-semibold mb-1">TARGET MUSCLES</div>
            <div className="text-sm font-bold text-orange-400 flex items-center gap-1.5">
              <Dumbbell className="w-4 h-4" />
              {exercise.muscleGroup}
            </div>
          </div>

          <div className="p-4 rounded-xl bg-zinc-950/60 border border-zinc-800">
            <div className="text-xs text-zinc-500 font-semibold mb-1">EQUIPMENT</div>
            <div className="text-sm font-bold text-zinc-200">{exercise.equipment}</div>
          </div>

          <div className="p-4 rounded-xl bg-zinc-950/60 border border-zinc-800">
            <div className="text-xs text-zinc-500 font-semibold mb-1">CALORIES</div>
            <div className="text-sm font-bold text-amber-400 flex items-center gap-1.5">
              <Flame className="w-4 h-4 fill-amber-400" />
              {exercise.caloriesBurned} kcal/min
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Instructions */}
        <div className="lg:col-span-2 p-6 md:p-8 rounded-3xl bg-zinc-900 border border-zinc-800 shadow-xl space-y-4">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            <span>Execution Instructions</span>
          </h3>
          <div className="p-5 rounded-2xl bg-zinc-950/60 border border-zinc-800 text-sm text-zinc-300 leading-relaxed whitespace-pre-line">
            {exercise.instructions}
          </div>
        </div>

        {/* Tips & Mistakes & Alternatives */}
        <div className="space-y-6">
           <div className="p-6 rounded-3xl bg-zinc-900 border border-zinc-800 shadow-xl space-y-4">
             <h3 className="text-sm font-bold text-white uppercase tracking-wider">Pro Tips</h3>
             <ul className="space-y-2 text-sm text-zinc-400 list-disc pl-4">
               <li>Focus on the eccentric phase (lowering the weight slowly).</li>
               <li>Maintain a tight core throughout the movement.</li>
               <li>Breathe out during the concentric phase.</li>
             </ul>
           </div>

           <div className="p-6 rounded-3xl bg-zinc-900 border border-zinc-800 shadow-xl space-y-4">
             <h3 className="text-sm font-bold text-rose-400 uppercase tracking-wider">Common Mistakes</h3>
             <ul className="space-y-2 text-sm text-zinc-400 list-disc pl-4">
               <li>Using momentum instead of muscle control.</li>
               <li>Incomplete range of motion.</li>
               <li>Holding breath during the lift.</li>
             </ul>
           </div>

           <div className="p-6 rounded-3xl bg-zinc-900 border border-zinc-800 shadow-xl space-y-4">
             <h3 className="text-sm font-bold text-white uppercase tracking-wider">Alternatives</h3>
             <div className="space-y-2">
               <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-zinc-300 font-medium">Alternative Exercise 1</div>
               <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-zinc-300 font-medium">Alternative Exercise 2</div>
             </div>
           </div>
        </div>
      </div>

      {/* Add Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title={`Add "${exercise.name}" to Workout`}
        maxWidth="max-w-md"
      >
        <div className="space-y-4">
          <p className="text-xs text-zinc-400">
            Select an active workout routine to append this exercise:
          </p>

          {workouts.length === 0 ? (
            <div className="p-6 text-center text-xs text-zinc-500 border border-dashed border-zinc-800 rounded-xl">
              No workouts created yet. Create a workout first in the Workouts tab.
            </div>
          ) : (
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {workouts.map((w) => (
                <button
                  key={w.id}
                  onClick={() => handleAddToWorkout(w.id)}
                  className="w-full p-3.5 rounded-xl bg-zinc-950 border border-zinc-800 hover:border-orange-500/50 hover:bg-zinc-800/60 text-left transition-colors flex items-center justify-between"
                >
                  <div>
                    <div className="font-bold text-sm text-white">{w.title}</div>
                    <div className="text-[11px] text-zinc-400">{w.exercises.length} Exercises • {w.day}</div>
                  </div>
                  <span className="text-xs text-orange-400 font-bold">+ Select</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
};
