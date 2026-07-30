import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Dumbbell, Home } from 'lucide-react';

export const NotFound: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center p-6 space-y-6">
      <div className="w-20 h-20 rounded-3xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-orange-500 shadow-xl">
        <Dumbbell className="w-10 h-10" />
      </div>

      <div className="space-y-2 max-w-md">
        <h1 className="text-4xl font-black text-white tracking-tight">404 — Out of Bounds</h1>
        <p className="text-sm text-zinc-400 leading-relaxed">
          The requested page routine could not be located in our application index.
        </p>
      </div>

      <button
        onClick={() => navigate('/')}
        className="py-3 px-6 rounded-2xl bg-orange-500 hover:bg-orange-600 text-zinc-950 font-bold text-sm flex items-center gap-2 shadow-lg shadow-orange-500/20 transition-all"
      >
        <Home className="w-4 h-4 fill-zinc-950" />
        <span>Return to Dashboard</span>
      </button>
    </div>
  );
};
