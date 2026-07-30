import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Play, CheckCircle2, Clock, Dumbbell, Flame, RotateCcw } from 'lucide-react';
import { useWorkout, useLogWorkoutHistory } from '../hooks/useWorkouts';
import { RestTimer } from '../components/workout/RestTimer';
import { Skeleton } from '../components/ui/Skeleton';
import { useToast } from '../components/ui/Toast';

export const WorkoutDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const workoutId = Number(id);
  const { showSuccess, showError } = useToast();

  const { data: workout, isLoading } = useWorkout(workoutId);
  const logHistoryMutation = useLogWorkoutHistory();

  // Active workout execution step state
  const [isExecuting, setIsExecuting] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [completedExercises, setCompletedExercises] = useState<number[]>([]);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-40 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (!workout) {
    return (
      <div className="text-center py-16 space-y-4">
        <h3 className="text-xl font-bold text-white">Workout Not Found</h3>
        <button
          onClick={() => navigate('/workouts')}
          className="px-4 py-2 bg-orange-500 text-zinc-950 font-bold rounded-xl text-xs"
        >
          Back to Workouts
        </button>
      </div>
    );
  }

  const currentExercise = workout.exercises[currentStep];
  const isLastExercise = currentStep === workout.exercises.length - 1;

  const handleNextStep = () => {
    if (!completedExercises.includes(currentStep)) {
      setCompletedExercises([...completedExercises, currentStep]);
    }

    if (isLastExercise) {
      handleCompleteWorkout();
    } else {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handleCompleteWorkout = async () => {
    try {
      const today = new Date().toISOString().split('T')[0];
      const estimatedCalories = Math.round(workout.duration * 8.5);

      await logHistoryMutation.mutateAsync({
        id: workout.id,
        data: {
          date: today,
          duration: workout.duration,
          calories: estimatedCalories,
          completed: true
        }
      });

      showSuccess(`Workout completed! Logged ${estimatedCalories} kcal burned.`);
      navigate('/progress');
    } catch (err: any) {
      showError(err?.message || 'Failed to log workout session');
    }
  };

  return (
    <div className="space-y-6">
      {/* Top back button */}
      <button
        onClick={() => navigate('/workouts')}
        className="flex items-center gap-2 text-xs font-semibold text-zinc-400 hover:text-white transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Workouts</span>
      </button>

      {/* Header Info Banner */}
      <div className="p-6 md:p-8 rounded-3xl bg-zinc-900 border border-zinc-800 flex flex-wrap items-center justify-between gap-6 shadow-xl">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2.5 py-0.5 text-xs font-bold uppercase rounded-md bg-orange-500/10 text-orange-400 border border-orange-500/20">
              {workout.day}
            </span>
            <span className="text-xs text-zinc-500">•</span>
            <span className="text-xs text-zinc-400 font-mono">{workout.exercises.length} Exercises</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-black text-white">{workout.title}</h2>
          <div className="flex items-center gap-4 text-xs text-zinc-400 mt-2">
            <span className="flex items-center gap-1">
              <Clock className="w-4 h-4 text-orange-400" />
              {workout.duration} mins
            </span>
            <span className="flex items-center gap-1">
              <Flame className="w-4 h-4 text-amber-400" />
              Est. ~{Math.round(workout.duration * 8.5)} kcal
            </span>
          </div>
        </div>

        {!isExecuting ? (
          <button
            onClick={() => {
              setIsExecuting(true);
              setCurrentStep(0);
            }}
            className="py-3.5 px-6 rounded-2xl bg-orange-500 hover:bg-orange-600 text-zinc-950 font-bold text-sm flex items-center gap-2 shadow-xl shadow-orange-500/20 transition-all"
          >
            <Play className="w-5 h-5 fill-zinc-950" />
            <span>Start Active Session</span>
          </button>
        ) : (
          <button
            onClick={() => setIsExecuting(false)}
            className="py-2.5 px-4 rounded-xl bg-zinc-800 text-zinc-300 font-semibold text-xs flex items-center gap-2 hover:bg-zinc-700"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Exit Active Mode</span>
          </button>
        )}
      </div>

      {/* Active Mode Stepper View vs Static Overview List */}
      {isExecuting ? (
        <div className="p-6 md:p-8 rounded-3xl bg-zinc-900/90 border border-orange-500/30 shadow-2xl space-y-6">
          <div className="flex justify-between items-center pb-4 border-b border-zinc-800">
            <div className="text-xs font-bold text-orange-400 uppercase tracking-widest">
              Exercise {currentStep + 1} of {workout.exercises.length}
            </div>
            <div className="text-xs text-zinc-400">
              Completed: {completedExercises.length} / {workout.exercises.length}
            </div>
          </div>

          <div className="text-center py-6 space-y-3">
            <h3 className="text-3xl font-black text-white">
              {currentExercise?.exerciseName || `Exercise ${currentExercise?.exerciseId}`}
            </h3>
            <div className="flex justify-center gap-4 text-sm font-bold">
              <span className="px-4 py-2 rounded-xl bg-zinc-950 text-orange-400 border border-zinc-800">
                {currentExercise?.sets} SETS
              </span>
              <span className="px-4 py-2 rounded-xl bg-zinc-950 text-amber-400 border border-zinc-800">
                {currentExercise?.reps} REPS
              </span>
            </div>
          </div>

          {/* Rest Timer helper */}
          <RestTimer defaultSeconds={60} />

          {/* Stepper Buttons */}
          <div className="flex justify-between items-center pt-4">
            <button
              disabled={currentStep === 0}
              onClick={() => setCurrentStep((p) => p - 1)}
              className="py-2.5 px-5 rounded-xl bg-zinc-800 text-zinc-300 font-semibold text-xs disabled:opacity-30"
            >
              Previous Exercise
            </button>

            <button
              onClick={handleNextStep}
              className="py-3.5 px-8 rounded-2xl bg-orange-500 hover:bg-orange-600 text-zinc-950 font-bold text-base flex items-center gap-2 shadow-lg shadow-orange-500/20"
            >
              {isLastExercise ? (
                <>
                  <CheckCircle2 className="w-5 h-5 fill-zinc-950 text-orange-500" />
                  <span>Mark Completed & Log Session</span>
                </>
              ) : (
                <span>Next Exercise →</span>
              )}
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Dumbbell className="w-5 h-5 text-orange-400" />
            <span>Exercise Routine Overview</span>
          </h3>

          <div className="space-y-3">
            {workout.exercises.map((ex, index) => (
              <div
                key={index}
                className="p-5 rounded-2xl bg-zinc-900 border border-zinc-800 flex flex-wrap items-center justify-between gap-4 shadow-sm"
              >
                <div className="flex items-center gap-4">
                  <span className="w-8 h-8 rounded-xl bg-orange-500/10 text-orange-400 font-bold text-sm flex items-center justify-center shrink-0">
                    {index + 1}
                  </span>
                  <div>
                    <h4 className="font-bold text-white text-base">
                      {ex.exerciseName || `Exercise ${ex.exerciseId}`}
                    </h4>
                    <span className="text-xs text-zinc-400 font-mono">
                      Static Rest Suggestion: Rest 60s
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <span className="px-3 py-1 rounded-lg bg-zinc-950 text-orange-400 text-xs font-bold border border-zinc-800">
                    {ex.sets} Sets
                  </span>
                  <span className="px-3 py-1 rounded-lg bg-zinc-950 text-amber-400 text-xs font-bold border border-zinc-800">
                    {ex.reps} Reps
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-4 flex justify-end">
            <button
              onClick={handleCompleteWorkout}
              className="py-3 px-6 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-zinc-950 font-bold text-sm flex items-center gap-2 shadow-lg shadow-emerald-500/20"
            >
              <CheckCircle2 className="w-4 h-4 fill-zinc-950 text-emerald-500" />
              <span>Log Quick Completion ({workout.duration} mins)</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
