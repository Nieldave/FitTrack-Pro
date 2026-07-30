import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Play,
  Plus,
  BookOpen,
  Flame,
  Dumbbell,
  Clock,
  Zap,
  TrendingUp,
  Sparkles,
  Bot
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useMyWorkouts, useAllHistory, useCreateWorkout } from '../hooks/useWorkouts';
import { StatsCard } from '../components/progress/StatsCard';
import { Modal } from '../components/ui/Modal';
import { WorkoutBuilder } from '../components/workout/WorkoutBuilder';
import { WorkoutRequest, WorkoutResponse } from '../types';
import { useToast } from '../components/ui/Toast';

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { showSuccess, showError } = useToast();

  const [isBuilderOpen, setIsBuilderOpen] = useState(false);
  const [selectedWorkoutId, setSelectedWorkoutId] = useState<number | null>(null);

  const { data: workoutsData, isLoading: isLoadingWorkouts } = useMyWorkouts(0, 20);
  const { data: historyData } = useAllHistory();
  const createWorkoutMutation = useCreateWorkout();

  const workouts = workoutsData?.content || [];
  const history = historyData?.content || [];

  // Compute Greeting from local time
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  // Compute Statistics from history
  const computeStats = () => {
    const now = new Date();
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay());
    startOfWeek.setHours(0, 0, 0, 0);

    const weekHistory = history.filter((h) => {
      const hDate = new Date(h.date);
      return hDate >= startOfWeek && h.completed;
    });

    const caloriesThisWeek = weekHistory.reduce((acc, curr) => acc + (curr.calories || 0), 0);
    const workoutsThisWeek = weekHistory.length;
    const totalMinutesThisWeek = weekHistory.reduce((acc, curr) => acc + (curr.duration || 0), 0);
    const hoursThisWeek = (totalMinutesThisWeek / 60).toFixed(1);

    // Compute Streak
    const completedDates = new Set(history.filter((h) => h.completed).map((h) => h.date));
    let streak = 0;
    for (let i = 0; i < 60; i++) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      if (completedDates.has(dateStr)) {
        streak++;
      } else if (i === 0) {
        continue; // if today not finished yet, check yesterday
      } else {
        break;
      }
    }

    return { caloriesThisWeek, workoutsThisWeek, hoursThisWeek, streak };
  };

  const { caloriesThisWeek, workoutsThisWeek, hoursThisWeek, streak } = computeStats();

  // Pick active workout for "Today's Workout" card
  const activeWorkout: WorkoutResponse | undefined =
    workouts.find((w) => w.id === selectedWorkoutId) || workouts[0];

  // Check today's history to calculate sets completed
  const todayStr = new Date().toISOString().split('T')[0];
  const loggedToday = history.find(
    (h) => h.date === todayStr && h.workoutId === activeWorkout?.id && h.completed
  );

  const totalSets = activeWorkout?.exercises.reduce((acc, ex) => acc + ex.sets, 0) || 0;
  const completedSets = loggedToday ? totalSets : 0;
  const progressPercent = totalSets > 0 ? Math.round((completedSets / totalSets) * 100) : 0;

  const handleSaveWorkout = async (data: WorkoutRequest) => {
    try {
      await createWorkoutMutation.mutateAsync(data);
      showSuccess('New workout created successfully!');
      setIsBuilderOpen(false);
    } catch (err: any) {
      showError(err?.message || 'Failed to create workout');
    }
  };

  return (
    <div className="space-y-8 p-4 md:p-8">
      {/* Welcome Hero Banner -> Header Style */}
      <header className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-white mb-2">
            {getGreeting()}, {user?.name || 'Athlete'} 👋
          </h1>
          <p className="text-zinc-400 mt-1">
            Ready to hit your fitness targets today?
          </p>
        </div>
        <div className="hidden md:flex gap-3">
          <div className="bg-zinc-900/80 px-4 py-2 rounded-xl border border-zinc-800 flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
            <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400">Server Live</span>
          </div>
        </div>
      </header>

      {/* Quick Action Buttons - using the Top Row Quick Actions style */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <button
          onClick={() => navigate('/workouts')}
          className="bg-zinc-100 text-zinc-950 rounded-2xl p-4 md:p-5 flex items-center gap-3 md:gap-4 group transition-all transform active:scale-95"
        >
          <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl bg-zinc-900 text-white flex items-center justify-center shrink-0">
            <Play className="w-5 h-5 md:w-6 md:h-6 fill-white" />
          </div>
          <div className="text-left">
            <p className="font-bold text-sm md:text-lg">Start Workout</p>
            <p className="hidden md:block text-xs md:text-sm opacity-60">Begin active session</p>
          </div>
        </button>

        <button
          onClick={() => setIsBuilderOpen(true)}
          className="bg-zinc-900 border border-zinc-800 text-zinc-100 rounded-2xl p-4 md:p-5 flex items-center gap-3 md:gap-4 hover:bg-zinc-800 transition-all transform active:scale-95"
        >
          <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl bg-orange-600/20 text-orange-500 flex items-center justify-center shrink-0">
            <Plus className="w-5 h-5 md:w-6 md:h-6" />
          </div>
          <div className="text-left">
            <p className="font-bold text-sm md:text-lg">Create Custom</p>
            <p className="hidden md:block text-xs md:text-sm text-zinc-500">Design a new plan</p>
          </div>
        </button>

        <button
          onClick={() => navigate('/exercises')}
          className="bg-zinc-900 border border-zinc-800 text-zinc-100 rounded-2xl p-4 md:p-5 flex items-center gap-3 md:gap-4 hover:bg-zinc-800 transition-all transform active:scale-95"
        >
          <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl bg-zinc-800 text-zinc-300 flex items-center justify-center shrink-0">
            <BookOpen className="w-5 h-5 md:w-6 md:h-6" />
          </div>
          <div className="text-left">
            <p className="font-bold text-sm md:text-lg">Exercise Library</p>
            <p className="hidden md:block text-xs md:text-sm text-zinc-500">Browse 250+ moves</p>
          </div>
        </button>

        <button
          onClick={() => navigate('/ai-generator')}
          className="bg-zinc-900 border border-zinc-800 text-zinc-100 rounded-2xl p-4 md:p-5 flex items-center gap-3 md:gap-4 hover:bg-zinc-800 transition-all transform active:scale-95"
        >
          <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl bg-purple-600/20 text-purple-400 flex items-center justify-center shrink-0">
            <Bot className="w-5 h-5 md:w-6 md:h-6" />
          </div>
          <div className="text-left">
            <p className="font-bold text-sm md:text-lg text-purple-400">AI Generator</p>
            <p className="hidden md:block text-xs md:text-sm text-zinc-500">Auto-create plans</p>
          </div>
        </button>
      </div>

      {/* Four Quick-Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-zinc-900/40 border border-zinc-800 p-5 rounded-2xl">
          <div className="flex items-center gap-2 mb-2 text-orange-400">
            <Flame className="w-4 h-4" />
            <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest">Calories Burned</p>
          </div>
          <p className="text-2xl font-bold">{caloriesThisWeek} <span className="text-xs text-zinc-500 font-normal">kcal</span></p>
          <div className="mt-3 w-full h-1 bg-zinc-800 rounded-full overflow-hidden">
            <div className="h-full bg-orange-500 w-[72%]"></div>
          </div>
        </div>
        <div className="bg-zinc-900/40 border border-zinc-800 p-5 rounded-2xl">
          <div className="flex items-center gap-2 mb-2 text-zinc-300">
            <Dumbbell className="w-4 h-4" />
            <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest">Workouts Done</p>
          </div>
          <p className="text-2xl font-bold">{workoutsThisWeek} <span className="text-xs text-zinc-500 font-normal">this week</span></p>
          <div className="mt-3 flex gap-1">
            <div className="h-1 flex-1 bg-orange-500 rounded-full"></div>
            <div className="h-1 flex-1 bg-orange-500 rounded-full"></div>
            <div className="h-1 flex-1 bg-zinc-800 rounded-full"></div>
            <div className="h-1 flex-1 bg-zinc-800 rounded-full"></div>
          </div>
        </div>
        <div className="bg-zinc-900/40 border border-zinc-800 p-5 rounded-2xl">
          <div className="flex items-center gap-2 mb-2 text-blue-400">
            <Clock className="w-4 h-4" />
            <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest">Active Time</p>
          </div>
          <p className="text-2xl font-bold">{hoursThisWeek} <span className="text-xs text-zinc-500 font-normal">hrs</span></p>
          <p className="text-[10px] text-green-500 font-semibold mt-3 uppercase tracking-tighter">↑ 12% from last week</p>
        </div>
        <div className="bg-zinc-900/40 border border-zinc-800 p-5 rounded-2xl">
          <div className="flex items-center gap-2 mb-2 text-amber-400">
            <Zap className="w-4 h-4" />
            <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest">Current Streak</p>
          </div>
          <div className="flex items-center gap-2">
            <p className="text-2xl font-bold">{streak} <span className="text-xs text-zinc-500 font-normal">days</span></p>
          </div>
          <p className="text-[10px] text-zinc-600 font-medium mt-3 uppercase">Next Milestone: 7 Days</p>
        </div>
      </div>

      {/* Today's Workout Card */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 md:p-8 relative overflow-hidden shadow-xl">
        <div className="absolute top-0 right-0 p-8 opacity-5">
           <Dumbbell className="w-48 h-48 -rotate-12" />
        </div>
        <div className="relative z-10 flex flex-col h-full">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 bg-orange-500/10 text-orange-500 text-xs font-bold rounded-full uppercase tracking-widest block">
                Recommended
              </span>
            </div>

            {workouts.length > 1 && (
              <div className="flex items-center gap-2">
                <span className="text-xs text-zinc-500">Select:</span>
                <select
                  value={activeWorkout?.id}
                  onChange={(e) => setSelectedWorkoutId(Number(e.target.value))}
                  className="bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-1.5 text-xs text-zinc-200 focus:outline-none focus:border-orange-500"
                >
                  {workouts.map((w) => (
                    <option key={w.id} value={w.id}>
                      {w.title} ({w.day})
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          {activeWorkout ? (
            <div className="space-y-6">
              <div>
                 <h2 className="text-3xl md:text-4xl font-black mt-2 uppercase text-white">
                   {activeWorkout.title}
                 </h2>
                 <p className="text-zinc-400 mt-2 max-w-md text-sm">
                   {activeWorkout.day} • {activeWorkout.duration} mins • {totalSets} Total Sets
                 </p>
              </div>

              {/* Progress bar */}
              <div>
                <div className="flex justify-between items-center text-xs text-zinc-500 mb-2">
                  <span className="font-bold">Today's Set Progress ({completedSets} / {totalSets} sets)</span>
                  <span className="font-bold text-orange-500">{progressPercent}%</span>
                </div>
                <div className="w-full h-2 bg-zinc-950 rounded-full overflow-hidden border border-zinc-800">
                  <div
                    className="h-full bg-orange-500 rounded-full transition-all duration-500"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>

              {/* Exercises preview list */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 pt-2">
                {activeWorkout.exercises.map((ex, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-2xl bg-zinc-950/60 border border-zinc-800 flex items-center gap-3"
                  >
                    <span className="w-8 h-8 rounded-xl bg-orange-500/10 text-orange-500 font-bold text-xs flex items-center justify-center shrink-0">
                      {idx + 1}
                    </span>
                    <div>
                      <div className="text-sm font-bold text-zinc-200 truncate max-w-[120px]">
                        {ex.exerciseName || `Exercise ${ex.exerciseId}`}
                      </div>
                      <div className="text-xs text-zinc-500 font-medium mt-0.5">
                        {ex.sets} sets × {ex.reps} reps
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-8 flex items-center gap-4">
                 <button
                   onClick={() => navigate(`/workouts/${activeWorkout.id}`)}
                   className="px-6 md:px-8 py-3 bg-orange-600 hover:bg-orange-500 text-white rounded-xl font-bold transition-all transform active:scale-95 shadow-lg shadow-orange-900/20"
                 >
                   START WORKOUT
                 </button>
                 <div className="hidden sm:flex -space-x-2">
                   <div className="w-8 h-8 rounded-full border-2 border-zinc-900 bg-zinc-700"></div>
                   <div className="w-8 h-8 rounded-full border-2 border-zinc-900 bg-zinc-600"></div>
                   <div className="w-8 h-8 rounded-full border-2 border-zinc-900 bg-zinc-500 flex items-center justify-center text-[10px] text-zinc-100">+12</div>
                 </div>
                 <span className="hidden sm:inline text-xs text-zinc-500">Joined by 14 others today</span>
              </div>
            </div>
          ) : (
            <div className="p-12 text-center border border-zinc-800 rounded-3xl bg-zinc-950/50 text-zinc-500">
              <p className="text-sm mb-4">No workouts created yet.</p>
              <button
                onClick={() => setIsBuilderOpen(true)}
                className="py-2.5 px-5 rounded-xl bg-orange-500 text-zinc-950 font-bold text-xs inline-flex items-center gap-2 transition-all transform hover:scale-105"
              >
                <Plus className="w-4 h-4" />
                <span>Create Your First Workout</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Modal for Workout Builder */}
      <Modal
        isOpen={isBuilderOpen}
        onClose={() => setIsBuilderOpen(false)}
        title="Create New Workout Routine"
        maxWidth="max-w-3xl"
      >
        <WorkoutBuilder
          onSave={handleSaveWorkout}
          onCancel={() => setIsBuilderOpen(false)}
          isLoading={createWorkoutMutation.isPending}
        />
      </Modal>
    </div>
  );
};
