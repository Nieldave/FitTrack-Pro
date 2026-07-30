import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from './lib/queryClient';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ToastProvider } from './components/ui/Toast';

import { MainLayout } from './components/layout/MainLayout';
import { AuthLayout } from './components/layout/AuthLayout';

import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Dashboard } from './pages/Dashboard';
import { Workouts } from './pages/Workouts';
import { WorkoutDetails } from './pages/WorkoutDetails';
import { Exercises } from './pages/Exercises';
import { ExerciseDetails } from './pages/ExerciseDetails';
import { Progress } from './pages/Progress';
import { Profile } from './pages/Profile';
import { Admin } from './pages/Admin';
import { Templates } from './pages/Templates';
import { Achievements } from './pages/Achievements';
import { SpotifyPage } from './pages/SpotifyPage';
import { AiGenerator } from './pages/AiGenerator';
import { AiChat } from './pages/AiChat';
import { NotFound } from './pages/NotFound';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center text-zinc-400 font-semibold text-sm">
        Loading FitTrack Pro session...
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ToastProvider>
          <BrowserRouter>
            <Routes>
              {/* Public Auth Routes */}
              <Route element={<AuthLayout />}>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
              </Route>

              {/* Protected Main Application Routes */}
              <Route
                element={
                  <ProtectedRoute>
                    <MainLayout />
                  </ProtectedRoute>
                }
              >
                <Route path="/" element={<Dashboard />} />
                <Route path="/workouts" element={<Workouts />} />
                <Route path="/workouts/:id" element={<WorkoutDetails />} />
                <Route path="/exercises" element={<Exercises />} />
                <Route path="/exercises/:id" element={<ExerciseDetails />} />
                <Route path="/progress" element={<Progress />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/admin" element={<Admin />} />
                <Route path="/templates" element={<Templates />} />
                <Route path="/achievements" element={<Achievements />} />
                <Route path="/spotify" element={<SpotifyPage />} />
                <Route path="/ai-generator" element={<AiGenerator />} />
                <Route path="/ai-chat" element={<AiChat />} />
                <Route path="*" element={<NotFound />} />
              </Route>
            </Routes>
          </BrowserRouter>
        </ToastProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
