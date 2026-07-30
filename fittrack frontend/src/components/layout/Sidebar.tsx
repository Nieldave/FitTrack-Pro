import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  Home,
  Dumbbell,
  BookOpen,
  TrendingUp,
  User,
  ShieldAlert,
  Sparkles,
  Trophy,
  Music,
  Bot
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const Sidebar: React.FC = () => {
  const { role } = useAuth();

  const navItems = [
    { to: '/', label: 'Home', icon: Home },
    { to: '/workouts', label: 'Workouts', icon: Dumbbell },
    { to: '/exercises', label: 'Exercises', icon: BookOpen },
    { to: '/progress', label: 'Progress', icon: TrendingUp },
    { to: '/templates', label: 'Templates', icon: Sparkles },
    { to: '/achievements', label: 'Badges', icon: Trophy },
    { to: '/ai-generator', label: 'AI Generator', icon: Bot },
    { to: '/spotify', label: 'Music', icon: Music },
    { to: '/profile', label: 'Profile', icon: User }
  ];

  if (role === 'ADMIN') {
    navItems.push({ to: '/admin', label: 'Admin Panel', icon: ShieldAlert });
  }

  return (
    <aside className="hidden md:flex flex-col w-64 bg-[#050505] border-r border-zinc-800 p-6 shrink-0 min-h-screen">
      {/* Brand logo */}
      <div className="flex items-center gap-3 px-2 mb-10">
        <div className="w-10 h-10 rounded-xl bg-orange-600 flex items-center justify-center text-white font-black shadow-lg shadow-orange-900/20">
          <Dumbbell className="w-6 h-6 stroke-[2.5]" />
        </div>
        <div>
          <h1 className="font-black text-xl tracking-tight text-white flex items-center">
            FitTrack<span className="text-orange-500">Pro</span>
          </h1>
        </div>
      </div>

      {/* Nav items */}
      <nav className="flex-1 space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-200 ${
                  isActive
                    ? 'bg-zinc-800/50 text-orange-500 border border-zinc-700/50'
                    : 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900'
                }`
              }
            >
              <Icon className="w-5 h-5 shrink-0" />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </nav>

      {/* Pro Badge footer -> Settings/User profile block from HTML */}
      <div className="mt-auto pt-4">
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-zinc-700 flex items-center justify-center font-bold text-sm text-zinc-300 shrink-0">
              U
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="text-sm font-semibold truncate text-zinc-100">User</p>
              <p className="text-xs text-zinc-500 truncate">Premium Member</p>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};
