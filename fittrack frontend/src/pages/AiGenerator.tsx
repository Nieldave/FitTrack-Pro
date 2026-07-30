import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bot, Sparkles, Dumbbell, Save, RefreshCw } from 'lucide-react';
import { aiService, AiGeneratedWorkout } from '../services/aiService';
import { useCreateWorkout } from '../hooks/useWorkouts';
import { useToast } from '../components/ui/Toast';

export const AiGenerator: React.FC = () => {
  const navigate = useNavigate();
  const { showSuccess, showError } = useToast();
  const createWorkoutMutation = useCreateWorkout();

  const [goal, setGoal] = useState('Muscle Hypertrophy');
  const [daysPerWeek, setDaysPerWeek] = useState(4);
  const [equipment, setEquipment] = useState('Full Gym (Barbell, Dumbbells, Cables)');
  const [experienceLevel, setExperienceLevel] = useState('Intermediate');

  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedRoutine, setGeneratedRoutine] = useState<AiGeneratedWorkout | null>(null);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsGenerating(true);

    try {
      const result = await aiService.generateWorkoutRoutine({
        goal,
        daysPerWeek,
        equipment,
        experienceLevel
      });
      setGeneratedRoutine(result);
      showSuccess('AI generated a custom workout split!');
    } catch (err: any) {
      showError(err?.message || 'Failed to generate AI routine');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSaveRoutine = async () => {
    if (!generatedRoutine) return;

    try {
      await createWorkoutMutation.mutateAsync({
        title: generatedRoutine.title,
        day: 'MONDAY',
        duration: generatedRoutine.duration,
        exercises: generatedRoutine.exercises.map((ex, idx) => ({
          exerciseId: idx + 1,
          exerciseName: ex.exerciseName,
          sets: ex.sets,
          reps: ex.reps,
          sequenceOrder: idx + 1
        }))
      });

      showSuccess(`Saved "${generatedRoutine.title}" to your custom workouts!`);
      navigate('/workouts');
    } catch (err: any) {
      showError(err?.message || 'Failed to save generated workout');
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="px-2.5 py-0.5 text-xs font-bold uppercase rounded-md bg-purple-500/10 text-purple-400 border border-purple-500/20">
            AI Engine
          </span>
        </div>
        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
          <Bot className="w-6 h-6 text-purple-400" />
          <span>AI Workout Generator</span>
        </h2>
        <p className="text-sm text-zinc-400">
          Specify your training parameters and let our intelligent engine structure a periodized workout routine tailored to your goals.
        </p>
      </div>

      {/* Parameter Input Form */}
      <div className="p-6 md:p-8 rounded-3xl bg-zinc-900 border border-zinc-800 shadow-xl space-y-6">
        <form onSubmit={handleGenerate} className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Goal */}
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1.5 uppercase">
                Primary Goal
              </label>
              <select
                value={goal}
                onChange={(e) => setGoal(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm text-zinc-100 focus:outline-none focus:border-purple-500"
              >
                <option value="Muscle Hypertrophy">Muscle Hypertrophy (Size)</option>
                <option value="Raw Strength & Powerlifting">Raw Strength & Powerlifting</option>
                <option value="Fat Loss & Conditioning">Fat Loss & Conditioning</option>
                <option value="Mobility & Functional Fitness">Mobility & Functional Fitness</option>
              </select>
            </div>

            {/* Days per week */}
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1.5 uppercase">
                Training Days / Week
              </label>
              <select
                value={daysPerWeek}
                onChange={(e) => setDaysPerWeek(Number(e.target.value))}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm text-zinc-100 focus:outline-none focus:border-purple-500"
              >
                <option value={2}>2 Days / Week</option>
                <option value={3}>3 Days / Week</option>
                <option value={4}>4 Days / Week</option>
                <option value={5}>5 Days / Week</option>
                <option value={6}>6 Days / Week</option>
              </select>
            </div>

            {/* Equipment */}
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1.5 uppercase">
                Available Equipment
              </label>
              <input
                type="text"
                value={equipment}
                onChange={(e) => setEquipment(e.target.value)}
                placeholder="e.g. Dumbbells, Resistance Bands"
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm text-zinc-100 focus:outline-none focus:border-purple-500"
              />
            </div>

            {/* Experience */}
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1.5 uppercase">
                Experience Level
              </label>
              <select
                value={experienceLevel}
                onChange={(e) => setExperienceLevel(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm text-zinc-100 focus:outline-none focus:border-purple-500"
              >
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced / Elite</option>
              </select>
            </div>
          </div>

          <button
            type="submit"
            disabled={isGenerating}
            className="w-full py-3.5 px-6 rounded-xl bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-purple-600/20 transition-all"
          >
            {isGenerating ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Analyzing & Generating Periodized Routine...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Generate Custom AI Workout Routine</span>
              </>
            )}
          </button>
        </form>
      </div>

      {/* Preview Result */}
      {generatedRoutine && (
        <div className="p-6 md:p-8 rounded-3xl bg-zinc-900 border border-purple-500/40 shadow-2xl space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-zinc-800">
            <div>
              <span className="text-xs font-bold text-purple-400 uppercase tracking-widest block mb-1">
                Generated Plan Preview
              </span>
              <h3 className="text-2xl font-black text-white">{generatedRoutine.title}</h3>
              <p className="text-xs text-zinc-400 mt-1">{generatedRoutine.summary}</p>
            </div>

            <button
              onClick={handleSaveRoutine}
              className="py-3 px-6 rounded-2xl bg-orange-500 hover:bg-orange-600 text-zinc-950 font-bold text-sm flex items-center gap-2 shadow-lg shadow-orange-500/20 transition-all"
            >
              <Save className="w-4 h-4 fill-zinc-950" />
              <span>Save to My Workouts</span>
            </button>
          </div>

          <div className="space-y-3">
            {generatedRoutine.exercises.map((ex, idx) => (
              <div
                key={idx}
                className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800 flex flex-wrap items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3">
                  <span className="w-7 h-7 rounded-lg bg-purple-500/20 text-purple-300 font-bold text-xs flex items-center justify-center">
                    {idx + 1}
                  </span>
                  <div>
                    <div className="font-bold text-sm text-white">{ex.exerciseName}</div>
                    <div className="text-xs text-zinc-400">{ex.notes}</div>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-xs font-bold">
                  <span className="px-3 py-1 rounded-lg bg-zinc-900 text-orange-400 border border-zinc-800">
                    {ex.sets} Sets
                  </span>
                  <span className="px-3 py-1 rounded-lg bg-zinc-900 text-amber-400 border border-zinc-800">
                    {ex.reps} Reps
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
