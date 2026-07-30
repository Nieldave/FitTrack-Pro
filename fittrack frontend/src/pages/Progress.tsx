import React, { useState } from 'react';
import { TrendingUp, Flame, Clock, Zap, Calendar, BarChart2 } from 'lucide-react';
import { useAllHistory } from '../hooks/useWorkouts';
import { ProgressChart } from '../components/progress/ProgressChart';
import { StatsCard } from '../components/progress/StatsCard';
import { Skeleton } from '../components/ui/Skeleton';

export const Progress: React.FC = () => {
  const { data: historyData, isLoading } = useAllHistory();
  const [chartType, setChartType] = useState<'calories' | 'duration'>('calories');

  const history = historyData?.content || [];

  // Sort history chronologically for charts
  const sortedHistory = [...history].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  const chartData = sortedHistory.map((h) => ({
    date: h.date,
    calories: h.calories || 0,
    duration: h.duration || 0
  }));

  // Aggregated totals
  const totalCalories = history.reduce((acc, h) => acc + (h.calories || 0), 0);
  const totalMinutes = history.reduce((acc, h) => acc + (h.duration || 0), 0);
  const totalHours = (totalMinutes / 60).toFixed(1);
  const totalWorkouts = history.length;

  // Compute Streak
  const completedDates = new Set(history.filter((h) => h.completed).map((h) => h.date));
  let streak = 0;
  const today = new Date();
  for (let i = 0; i < 60; i++) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];
    if (completedDates.has(dateStr)) {
      streak++;
    } else if (i === 0) {
      continue;
    } else {
      break;
    }
  }

  // Generate Calendar Heatmap Data for current month
  const generateCalendarDays = () => {
    const days = [];
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    for (let day = 1; day <= daysInMonth; day++) {
      const dateObj = new Date(year, month, day);
      const dateStr = dateObj.toISOString().split('T')[0];
      const isCompleted = completedDates.has(dateStr);
      const isToday = day === now.getDate();

      days.push({ day, dateStr, isCompleted, isToday });
    }
    return days;
  };

  const calendarDays = generateCalendarDays();

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
          <TrendingUp className="w-6 h-6 text-orange-500" />
          <span>Progress & Analytics</span>
        </h2>
        <p className="text-sm text-zinc-400">
          Visualize active calorie burn trajectories, session durations, and calendar consistency.
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Total Calories Burned"
          value={`${totalCalories} kcal`}
          subtitle="All-time history"
          icon={<Flame className="w-6 h-6 fill-orange-400" />}
        />
        <StatsCard
          title="Total Active Hours"
          value={`${totalHours} hrs`}
          subtitle={`${totalMinutes} total minutes`}
          icon={<Clock className="w-6 h-6" />}
        />
        <StatsCard
          title="Completed Sessions"
          value={totalWorkouts}
          subtitle="Logged workouts"
          icon={<BarChart2 className="w-6 h-6 text-amber-400" />}
        />
        <StatsCard
          title="Iron Streak"
          value={`${streak} Days`}
          subtitle="Active consecutive daily logs"
          icon={<Zap className="w-6 h-6 fill-amber-400" />}
        />
      </div>

      {/* Main Progress Chart */}
      <div className="p-6 md:p-8 rounded-3xl bg-zinc-900 border border-zinc-800 shadow-xl space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4 pb-2 border-b border-zinc-800">
          <div>
            <span className="text-xs font-bold text-orange-400 uppercase tracking-widest block mb-1">
              Performance Trends
            </span>
            <h3 className="text-xl font-bold text-white">
              {chartType === 'calories' ? 'Calories Burned Over Time' : 'Workout Duration Over Time'}
            </h3>
          </div>

          <div className="flex items-center gap-2 bg-zinc-950 p-1 rounded-xl border border-zinc-800">
            <button
              onClick={() => setChartType('calories')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                chartType === 'calories'
                  ? 'bg-orange-600 text-white'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              Calories (kcal)
            </button>
            <button
              onClick={() => setChartType('duration')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                chartType === 'duration'
                  ? 'bg-orange-600 text-white'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              Duration (mins)
            </button>
          </div>
        </div>

        {isLoading ? (
          <Skeleton className="h-64 w-full" />
        ) : (
          <ProgressChart data={chartData} type={chartType} />
        )}
      </div>

      {/* Monthly Calendar Heatmap (Phase 2 feature) */}
      <div className="p-6 md:p-8 rounded-3xl bg-zinc-900 border border-zinc-800 shadow-xl space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-zinc-800">
          <div>
            <span className="text-xs font-bold text-orange-400 uppercase tracking-widest block mb-1">
              Consistency Matrix
            </span>
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <Calendar className="w-5 h-5 text-orange-400" />
              <span>Monthly Activity Heatmap</span>
            </h3>
          </div>
          <div className="flex items-center gap-3 text-xs text-zinc-400">
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded bg-emerald-500 inline-block" /> Completed
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded bg-sky-500 inline-block" /> Today
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded bg-zinc-800 inline-block" /> Rest
            </span>
          </div>
        </div>

        <div className="grid grid-cols-7 sm:grid-cols-10 md:grid-cols-15 gap-2 pt-4">
          {calendarDays.map((item) => (
            <div
              key={item.day}
              className={`aspect-square rounded-xl p-1 flex flex-col items-center justify-center text-xs font-bold transition-all ${
                item.isCompleted
                  ? 'bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 shadow-sm shadow-emerald-500/20'
                  : item.isToday
                  ? 'bg-sky-500/20 border border-sky-500/40 text-sky-400'
                  : 'bg-zinc-950 border border-zinc-800/80 text-zinc-600'
              }`}
              title={`${item.dateStr}: ${item.isCompleted ? 'Workout Completed' : 'Rest Day'}`}
            >
              <span>{item.day}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
