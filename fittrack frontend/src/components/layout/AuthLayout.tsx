import React from 'react';
import { Outlet } from 'react-router-dom';
import { Dumbbell } from 'lucide-react';

export const AuthLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col justify-center items-center p-4 relative overflow-hidden">
      {/* Subtle background gradient glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header logo */}
      <div className="flex items-center gap-3 mb-8 relative z-10">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-orange-500 to-amber-400 flex items-center justify-center text-zinc-950 shadow-xl shadow-orange-500/20">
          <Dumbbell className="w-7 h-7 stroke-[2.5]" />
        </div>
        <h1 className="text-2xl font-black tracking-tight">
          FitTrack <span className="text-orange-500">Pro</span>
        </h1>
      </div>

      <div className="w-full max-w-md relative z-10">
        <Outlet />
      </div>
    </div>
  );
};
