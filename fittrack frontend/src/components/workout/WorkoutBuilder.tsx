import React, { useState, useEffect } from 'react';
import { Plus, Trash2, ArrowUp, ArrowDown, Save, Dumbbell, Clock } from 'lucide-react';
import { WorkoutRequest, WorkoutResponse, WorkoutExercise, Exercise } from '../../types';
import { useExercises } from '../../hooks/useExercises';
import { DifficultyBadge } from '../ui/Badge';

interface WorkoutBuilderProps {
  initialWorkout?: WorkoutResponse | null;
  onSave: (data: WorkoutRequest) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

const DAYS = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'];

export const WorkoutBuilder: React.FC<WorkoutBuilderProps> = ({
  initialWorkout,
  onSave,
  onCancel,
  isLoading = false
}) => {
  const [title, setTitle] = useState(initialWorkout?.title || '');
  const [day, setDay] = useState(initialWorkout?.day || 'MONDAY');
  const [duration, setDuration] = useState(initialWorkout?.duration || 45);
  const [selectedExercises, setSelectedExercises] = useState<WorkoutExercise[]>(
    initialWorkout?.exercises || []
  );

  const [showPicker, setShowPicker] = useState(false);
  const [pickerSearch, setPickerSearch] = useState('');

  const { data: exercisesData } = useExercises({ keyword: pickerSearch, size: 50 });
  const allExercises = exercisesData?.content || [];

  const handleAddExercise = (exercise: Exercise) => {
    if (selectedExercises.some((e) => e.exerciseId === exercise.id)) return;

    const newEntry: WorkoutExercise = {
      exerciseId: exercise.id,
      exerciseName: exercise.name,
      sets: 3,
      reps: 10,
      sequenceOrder: selectedExercises.length + 1
    };

    setSelectedExercises([...selectedExercises, newEntry]);
    setShowPicker(false);
  };

  const handleRemoveExercise = (exerciseId: number) => {
    const updated = selectedExercises
      .filter((e) => e.exerciseId !== exerciseId)
      .map((e, idx) => ({ ...e, sequenceOrder: idx + 1 }));
    setSelectedExercises(updated);
  };

  const handleUpdateSetsReps = (exerciseId: number, sets: number, reps: number) => {
    setSelectedExercises(
      selectedExercises.map((e) =>
        e.exerciseId === exerciseId ? { ...e, sets: Math.max(1, sets), reps: Math.max(1, reps) } : e
      )
    );
  };

  const handleMove = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= selectedExercises.length) return;

    const items = [...selectedExercises];
    const [moved] = items.splice(index, 1);
    items.splice(targetIndex, 0, moved);

    const reordered = items.map((item, idx) => ({ ...item, sequenceOrder: idx + 1 }));
    setSelectedExercises(reordered);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    if (selectedExercises.length === 0) return;

    onSave({
      title: title.trim(),
      day,
      duration: Number(duration),
      exercises: selectedExercises
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Title */}
        <div className="md:col-span-2">
          <label className="block text-xs font-semibold text-zinc-400 mb-1">
            Workout Title *
          </label>
          <input
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Upper Body Hypertrophy"
            className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm text-zinc-100 focus:outline-none focus:border-orange-500"
          />
        </div>

        {/* Day */}
        <div>
          <label className="block text-xs font-semibold text-zinc-400 mb-1">
            Target Day
          </label>
          <select
            value={day}
            onChange={(e) => setDay(e.target.value)}
            className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm text-zinc-100 focus:outline-none focus:border-orange-500"
          >
            {DAYS.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
        </div>

        {/* Duration */}
        <div>
          <label className="block text-xs font-semibold text-zinc-400 mb-1">
            Est. Duration (mins)
          </label>
          <div className="relative">
            <Clock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
            <input
              type="number"
              min="5"
              max="180"
              value={duration}
              onChange={(e) => setDuration(Number(e.target.value))}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl pl-9 pr-4 py-2 text-sm text-zinc-100 focus:outline-none focus:border-orange-500"
            />
          </div>
        </div>
      </div>

      {/* Selected exercises list */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h4 className="font-bold text-sm text-zinc-200 flex items-center gap-2">
            <Dumbbell className="w-4 h-4 text-orange-400" />
            <span>Workout Exercises ({selectedExercises.length})</span>
          </h4>
          <button
            type="button"
            onClick={() => setShowPicker(!showPicker)}
            className="py-2 px-3 rounded-xl bg-orange-500/10 text-orange-400 border border-orange-500/20 text-xs font-semibold flex items-center gap-1.5 hover:bg-orange-500 hover:text-zinc-950 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add Exercise</span>
          </button>
        </div>

        {/* Exercise picker slide-down */}
        {showPicker && (
          <div className="p-4 bg-zinc-950 border border-zinc-800 rounded-2xl mb-4 space-y-3 max-h-60 overflow-y-auto">
            <input
              type="text"
              value={pickerSearch}
              onChange={(e) => setPickerSearch(e.target.value)}
              placeholder="Search exercise catalog..."
              className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-1.5 text-xs text-zinc-100 focus:outline-none focus:border-orange-500 mb-2"
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {allExercises.map((ex) => {
                const isAlreadySelected = selectedExercises.some(
                  (s) => s.exerciseId === ex.id
                );
                return (
                  <div
                    key={ex.id}
                    onClick={() => !isAlreadySelected && handleAddExercise(ex)}
                    className={`p-2.5 rounded-xl border flex items-center justify-between cursor-pointer transition-colors text-xs ${
                      isAlreadySelected
                        ? 'opacity-40 bg-zinc-900 border-zinc-800 cursor-not-allowed'
                        : 'bg-zinc-900 border-zinc-800 hover:border-orange-500/50 hover:bg-zinc-800/80'
                    }`}
                  >
                    <div>
                      <div className="font-bold text-zinc-200">{ex.name}</div>
                      <div className="text-[10px] text-zinc-400">{ex.muscleGroup}</div>
                    </div>
                    <DifficultyBadge difficulty={ex.difficulty} />
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* List of chosen exercises with sets / reps inputs & sequence ordering */}
        {selectedExercises.length === 0 ? (
          <div className="p-8 text-center border-2 border-dashed border-zinc-800 rounded-2xl text-zinc-500 text-xs">
            No exercises added yet. Click "+ Add Exercise" above to select from catalog.
          </div>
        ) : (
          <div className="space-y-3">
            {selectedExercises.map((ex, index) => (
              <div
                key={ex.exerciseId}
                className="p-3.5 bg-zinc-950 border border-zinc-800 rounded-xl flex flex-wrap sm:flex-nowrap items-center justify-between gap-3 text-sm"
              >
                <div className="flex items-center gap-3 min-w-[160px]">
                  <span className="w-6 h-6 rounded-full bg-zinc-800 text-zinc-400 text-xs font-bold flex items-center justify-center">
                    {index + 1}
                  </span>
                  <div>
                    <div className="font-semibold text-zinc-100">
                      {ex.exerciseName || `Exercise ${ex.exerciseId}`}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  {/* Sets */}
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs text-zinc-400">Sets:</span>
                    <input
                      type="number"
                      min="1"
                      max="20"
                      value={ex.sets}
                      onChange={(e) =>
                        handleUpdateSetsReps(ex.exerciseId, Number(e.target.value), ex.reps)
                      }
                      className="w-14 bg-zinc-900 border border-zinc-800 rounded-lg px-2 py-1 text-center text-xs font-bold text-orange-400 focus:outline-none focus:border-orange-500"
                    />
                  </div>

                  {/* Reps */}
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs text-zinc-400">Reps:</span>
                    <input
                      type="number"
                      min="1"
                      max="100"
                      value={ex.reps}
                      onChange={(e) =>
                        handleUpdateSetsReps(ex.exerciseId, ex.sets, Number(e.target.value))
                      }
                      className="w-14 bg-zinc-900 border border-zinc-800 rounded-lg px-2 py-1 text-center text-xs font-bold text-amber-400 focus:outline-none focus:border-orange-500"
                    />
                  </div>

                  {/* Ordering arrows */}
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      disabled={index === 0}
                      onClick={() => handleMove(index, 'up')}
                      className="p-1 rounded bg-zinc-900 text-zinc-400 hover:text-white disabled:opacity-20"
                    >
                      <ArrowUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      disabled={index === selectedExercises.length - 1}
                      onClick={() => handleMove(index, 'down')}
                      className="p-1 rounded bg-zinc-900 text-zinc-400 hover:text-white disabled:opacity-20"
                    >
                      <ArrowDown className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Delete */}
                  <button
                    type="button"
                    onClick={() => handleRemoveExercise(ex.exerciseId)}
                    className="p-1.5 rounded-lg text-zinc-500 hover:text-rose-400 hover:bg-rose-950/40"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer buttons */}
      <div className="flex items-center justify-end gap-3 pt-4 border-t border-zinc-800">
        <button
          type="button"
          onClick={onCancel}
          className="px-5 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-sm font-semibold transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isLoading || selectedExercises.length === 0}
          className="px-6 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-zinc-950 text-sm font-bold flex items-center gap-2 shadow-lg shadow-orange-500/20 transition-colors"
        >
          <Save className="w-4 h-4 fill-zinc-950" />
          <span>{isLoading ? 'Saving...' : 'Save Workout'}</span>
        </button>
      </div>
    </form>
  );
};
