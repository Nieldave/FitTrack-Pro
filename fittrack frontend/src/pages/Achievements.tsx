import React from 'react';
import confetti from 'canvas-confetti';
import { Award, Lock, Sparkles, CheckCircle2, Zap, Flame, Trophy } from 'lucide-react';
import { MOCK_ACHIEVEMENTS } from '../services/mockData';
import { useAllHistory } from '../hooks/useWorkouts';
import { useToast } from '../components/ui/Toast';

export const Achievements: React.FC = () => {
  const { data: historyData } = useAllHistory();
  const { showSuccess } = useToast();

  const history = historyData?.content || [];
  const totalCompleted = history.filter((h) => h.completed).length;

  const triggerConfetti = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });
  };

  const handleBadgeClick = (achievement: typeof MOCK_ACHIEVEMENTS[0], isUnlocked: boolean) => {
    if (isUnlocked) {
      triggerConfetti();
      showSuccess(`🎉 Celebration! You earned the "${achievement.title}" badge!`);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="px-2.5 py-0.5 text-xs font-bold uppercase rounded-md bg-amber-500/10 text-amber-400 border border-amber-500/20">
            Gamification & Badges
          </span>
        </div>
        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
          <Award className="w-6 h-6 text-amber-400" />
          <span>Milestones & Trophy Room</span>
        </h2>
        <p className="text-sm text-zinc-400">
          Unlock prestige fitness badges by hitting session volume targets, logging consecutive days, or burning calorie milestones.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {MOCK_ACHIEVEMENTS.map((badge) => {
          // Dynamic calculation based on history vs threshold
          const currentProgress = Math.min(totalCompleted, badge.maxProgress);
          const isUnlocked = badge.unlocked || currentProgress >= badge.maxProgress;
          const progressPercent = Math.round((currentProgress / badge.maxProgress) * 100);

          return (
            <div
              key={badge.id}
              onClick={() => handleBadgeClick(badge, isUnlocked)}
              className={`p-6 rounded-3xl border transition-all cursor-pointer relative overflow-hidden shadow-xl ${
                isUnlocked
                  ? 'bg-gradient-to-b from-amber-500/10 via-zinc-900 to-zinc-900 border-amber-500/40 hover:border-amber-400'
                  : 'bg-zinc-900/60 border-zinc-800 opacity-60 hover:opacity-80'
              }`}
            >
              {isUnlocked && (
                <div className="absolute top-4 right-4 text-amber-400">
                  <Sparkles className="w-5 h-5 animate-spin-slow" />
                </div>
              )}

              <div className="flex items-center gap-4 mb-4">
                <div
                  className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl shadow-lg ${
                    isUnlocked
                      ? 'bg-gradient-to-tr from-amber-500 to-orange-400 text-zinc-950 shadow-amber-500/20'
                      : 'bg-zinc-800 text-zinc-600'
                  }`}
                >
                  {isUnlocked ? <Trophy className="w-7 h-7 stroke-[2]" /> : <Lock className="w-6 h-6" />}
                </div>

                <div>
                  <h3 className="font-bold text-base text-white">{badge.title}</h3>
                  <span className="text-xs text-zinc-400 font-medium">{badge.category}</span>
                </div>
              </div>

              <p className="text-xs text-zinc-400 leading-relaxed mb-4">{badge.description}</p>

              {/* Progress Bar */}
              <div>
                <div className="flex justify-between items-center text-[11px] text-zinc-400 mb-1.5 font-mono">
                  <span>Progress ({currentProgress} / {badge.maxProgress})</span>
                  <span className="font-bold text-amber-400">{progressPercent}%</span>
                </div>
                <div className="w-full h-2 bg-zinc-950 rounded-full overflow-hidden border border-zinc-800">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      isUnlocked ? 'bg-amber-400' : 'bg-zinc-700'
                    }`}
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>

              {isUnlocked && (
                <div className="mt-4 pt-3 border-t border-amber-500/20 text-center">
                  <span className="text-[11px] font-bold text-amber-400 inline-flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Tap to celebrate!
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
