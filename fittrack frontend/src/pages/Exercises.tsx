import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen } from 'lucide-react';
import { useExercises } from '../hooks/useExercises';
import { ExerciseCard } from '../components/exercise/ExerciseCard';
import { ExerciseFilters } from '../components/exercise/ExerciseFilters';
import { CardSkeleton } from '../components/ui/Skeleton';
import { Category, MuscleGroup, Difficulty, Exercise } from '../types';
import { Modal } from '../components/ui/Modal';
import { useMyWorkouts, useUpdateWorkout } from '../hooks/useWorkouts';
import { useToast } from '../components/ui/Toast';

export const Exercises: React.FC = () => {
  const navigate = useNavigate();
  const { showSuccess, showError } = useToast();

  const [keyword, setKeyword] = useState('');
  const [category, setCategory] = useState<Category | 'ALL'>('ALL');
  const [muscleGroup, setMuscleGroup] = useState<MuscleGroup | 'ALL'>('ALL');
  const [difficulty, setDifficulty] = useState<Difficulty | 'ALL'>('ALL');
  const [page, setPage] = useState(0);

  // Add-to-workout modal state
  const [selectedExerciseForAdd, setSelectedExerciseForAdd] = useState<Exercise | null>(null);

  const { data, isLoading } = useExercises({
    keyword,
    category,
    muscleGroup,
    difficulty,
    page,
    size: 12
  });

  const { data: workoutsData } = useMyWorkouts(0, 50);
  const updateWorkoutMutation = useUpdateWorkout();

  const exercises = data?.content || [];
  const totalPages = data?.totalPages || 1;
  const workouts = workoutsData?.content || [];

  const handleResetFilters = () => {
    setKeyword('');
    setCategory('ALL');
    setMuscleGroup('ALL');
    setDifficulty('ALL');
    setPage(0);
  };

  const handleAddExerciseToWorkout = async (workoutId: number) => {
    if (!selectedExerciseForAdd) return;
    const targetWorkout = workouts.find((w) => w.id === workoutId);
    if (!targetWorkout) return;

    if (targetWorkout.exercises.some((e) => e.exerciseId === selectedExerciseForAdd.id)) {
      showError('This exercise is already in that workout routine');
      return;
    }

    const updatedExercises = [
      ...targetWorkout.exercises,
      {
        exerciseId: selectedExerciseForAdd.id,
        exerciseName: selectedExerciseForAdd.name,
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
      showSuccess(`Added ${selectedExerciseForAdd.name} to ${targetWorkout.title}!`);
      setSelectedExerciseForAdd(null);
    } catch (err: any) {
      showError(err?.message || 'Failed to add exercise to workout');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-orange-500" />
            <span>Exercise Library</span>
          </h2>
          <p className="text-sm text-zinc-400">
            Browse targeted movements by muscle group, category, or equipment requirements.
          </p>
        </div>
      </div>

      {/* Search and Filters */}
      <ExerciseFilters
        searchKeyword={keyword}
        onSearchChange={(val) => {
          setKeyword(val);
          setPage(0);
        }}
        selectedCategory={category}
        onCategoryChange={(cat) => {
          setCategory(cat);
          setPage(0);
        }}
        selectedMuscleGroup={muscleGroup}
        onMuscleGroupChange={(m) => {
          setMuscleGroup(m);
          setPage(0);
        }}
        selectedDifficulty={difficulty}
        onDifficultyChange={(d) => {
          setDifficulty(d);
          setPage(0);
        }}
        onReset={handleResetFilters}
      />

      {/* Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
        </div>
      ) : exercises.length === 0 ? (
        <div className="p-16 text-center border-2 border-dashed border-zinc-800 rounded-3xl bg-zinc-900/40 space-y-3">
          <p className="text-zinc-400 text-sm font-semibold">No exercises match your filter criteria</p>
          <button
            onClick={handleResetFilters}
            className="text-xs text-orange-400 font-bold hover:underline"
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {exercises.map((exercise) => (
            <ExerciseCard
              key={exercise.id}
              exercise={exercise}
              onClick={(ex) => navigate(`/exercises/${ex.id}`)}
              onAddToWorkout={(ex) => setSelectedExerciseForAdd(ex)}
            />
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 pt-6">
          <button
            disabled={page === 0}
            onClick={() => setPage((p) => Math.max(0, p - 1))}
            className="px-4 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-zinc-300 disabled:opacity-40"
          >
            Previous
          </button>
          <span className="text-xs text-zinc-400">
            Page {page + 1} of {totalPages}
          </span>
          <button
            disabled={page >= totalPages - 1}
            onClick={() => setPage((p) => p + 1)}
            className="px-4 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-zinc-300 disabled:opacity-40"
          >
            Next
          </button>
        </div>
      )}

      {/* Add-to-Workout Modal */}
      <Modal
        isOpen={!!selectedExerciseForAdd}
        onClose={() => setSelectedExerciseForAdd(null)}
        title={`Add "${selectedExerciseForAdd?.name}" to Workout`}
        maxWidth="max-w-md"
      >
        <div className="space-y-4">
          <p className="text-xs text-zinc-400">
            Select which of your active workout routines you would like to append this movement to:
          </p>

          {workouts.length === 0 ? (
            <div className="p-6 text-center text-xs text-zinc-500 border border-dashed border-zinc-800 rounded-xl">
              You haven't created any workouts yet. Create a workout first in the Workouts tab.
            </div>
          ) : (
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {workouts.map((w) => (
                <button
                  key={w.id}
                  onClick={() => handleAddExerciseToWorkout(w.id)}
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
