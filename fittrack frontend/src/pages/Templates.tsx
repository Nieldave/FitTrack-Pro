import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Store, Copy, Dumbbell, Flame, Clock, Check } from 'lucide-react';
import { MOCK_WORKOUT_TEMPLATES } from '../services/mockData';
import { useCreateWorkout } from '../hooks/useWorkouts';
import { DifficultyBadge } from '../components/ui/Badge';
import { useToast } from '../components/ui/Toast';

export const Templates: React.FC = () => {
  const navigate = useNavigate();
  const { showSuccess, showError } = useToast();
  const createWorkoutMutation = useCreateWorkout();

  const [clonedIds, setClonedIds] = useState<number[]>([]);

  const handleCloneTemplate = async (template: typeof MOCK_WORKOUT_TEMPLATES[0]) => {
    try {
      await createWorkoutMutation.mutateAsync({
        title: template.title,
        day: template.day,
        duration: template.duration,
        exercises: template.exercises
      });

      setClonedIds([...clonedIds, template.id]);
      showSuccess(`Cloned "${template.title}" into your custom workouts!`);
    } catch (err: any) {
      showError(err?.message || 'Failed to clone template');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="px-2.5 py-0.5 text-xs font-bold uppercase rounded-md bg-orange-500/10 text-orange-400 border border-orange-500/20">
            Marketplace Catalog
          </span>
        </div>
        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
          <Store className="w-6 h-6 text-orange-500" />
          <span>Workout Templates Marketplace</span>
        </h2>
        <p className="text-sm text-zinc-400">
          Discover pre-designed routines crafted by elite strength coaches. Clone any template directly into your active workouts in one tap.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {(MOCK_WORKOUT_TEMPLATES as any[]).map((tmpl) => {

          const isCloned = clonedIds.includes(tmpl.id);
          return (
            <div
              key={tmpl.id}
              className="p-6 rounded-3xl bg-zinc-900 border border-zinc-800 hover:border-orange-500/40 transition-all shadow-xl flex flex-col justify-between group"
            >
              <div>
                <div className="flex justify-between items-start mb-3">
                  <h3 className="font-bold text-lg text-white group-hover:text-orange-400 transition-colors">
                    {tmpl.title}
                  </h3>
                  <span className="px-2.5 py-0.5 text-[11px] font-bold uppercase rounded-md bg-zinc-800 text-amber-400 border border-zinc-700">
                    {tmpl.category}
                  </span>
                </div>

                <p className="text-xs text-zinc-400 mb-4 line-clamp-2 leading-relaxed">
                  {tmpl.description}
                </p>

                <div className="flex items-center gap-4 text-xs text-zinc-400 mb-5">
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4 text-orange-400" />
                    {tmpl.duration} mins
                  </span>
                  <span className="flex items-center gap-1">
                    <Dumbbell className="w-4 h-4 text-amber-400" />
                    {tmpl.exercises.length} Movements
                  </span>
                </div>

                <div className="flex flex-wrap gap-1.5 mb-6">
                  {tmpl.exercises.map((ex, idx) => (
                    <span
                      key={idx}
                      className="text-[11px] bg-zinc-950 text-zinc-300 px-2.5 py-1 rounded-lg border border-zinc-800"
                    >
                      {ex.exerciseName} ({ex.sets}×{ex.reps})
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-zinc-800">
                <button
                  disabled={isCloned}
                  onClick={() => handleCloneTemplate(tmpl)}
                  className={`w-full py-3 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all ${
                    isCloned
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                      : 'bg-orange-500 hover:bg-orange-600 text-zinc-950 shadow-lg shadow-orange-500/20'
                  }`}
                >
                  {isCloned ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Cloned to My Workouts</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      <span>Clone to My Workouts</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
