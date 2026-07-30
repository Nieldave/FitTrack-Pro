import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { LogOut, Sun, Moon, Flame } from 'lucide-react';
import { getStoredTheme, applyTheme } from '../../lib/theme';
import { useAllHistory } from '../../hooks/useWorkouts';

export const Header: React.FC = () => {
  const { user, logout } = useAuth();
  const [theme, setTheme] = React.useState(getStoredTheme());
  const { data: historyData } = useAllHistory();

  const history = historyData?.content || [];
  
  // Compute current streak (consecutive days with completed=true history)
  const computeStreak = () => {
    if (!history.length) return 0;
    const completedDates = new Set(
      history.filter(h => h.completed).map(h => h.date)
    );

    let streak = 0;
    const today = new Date();
    for (let i = 0; i < 60; i++) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      if (completedDates.has(dateStr)) {
        streak++;
      } else if (i === 0) {
        // If today not completed yet, allow checking yesterday before breaking streak
        continue;
      } else {
        break;
      }
    }
    return streak;
  };

  const streak = computeStreak();

  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    applyTheme(nextTheme);
  };

  return (
    <header className="h-16 border-b border-zinc-800 bg-[#050505]/80 backdrop-blur-md px-6 flex items-center justify-between sticky top-0 z-30 shrink-0">
      {/* Left title / mobile logo */}
      <div className="flex items-center gap-3 md:hidden">
        <div className="w-8 h-8 rounded-lg bg-orange-500 flex items-center justify-center font-black text-zinc-950">
          FP
        </div>
        <span className="font-bold text-white">FitTrack Pro</span>
      </div>

      {/* Streak badge */}
      <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400 text-xs font-semibold">
        <Flame className="w-4 h-4 fill-orange-500 text-orange-500 animate-pulse" />
        <span>{streak} Day Streak</span>
      </div>

      {/* Right controls */}
      <div className="flex items-center gap-3 ml-auto">
        {/* Theme toggle */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-800/60 transition-colors"
          title="Toggle Dark / Light Theme"
        >
          {theme === 'dark' ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-zinc-300" />}
        </button>

        {/* User profile dropdown pill */}
        {user && (
          <div className="flex items-center gap-3 pl-3 border-l border-zinc-800">
            <div className="text-right hidden sm:block">
              <div className="text-sm font-semibold text-zinc-200">{user.name}</div>
              <div className="text-[11px] text-zinc-400 font-mono">{user.role}</div>
            </div>
            <button
              onClick={logout}
              className="p-2 rounded-xl text-zinc-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
              title="Logout"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>
    </header>
  );
};
