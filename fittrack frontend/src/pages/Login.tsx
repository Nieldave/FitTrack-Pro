import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { LogIn, Mail, Lock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { authService } from '../services/authService';
import { parseApiError } from '../lib/axios';
import { useToast } from '../components/ui/Toast';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters')
});

type LoginFormData = z.infer<typeof loginSchema>;

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { showError, showSuccess } = useToast();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting }
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema)
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      const response = await authService.login(data);
      login(response);
      showSuccess(`Welcome back, ${response.name}!`);
      navigate('/');
    } catch (err) {
      const parsed = parseApiError(err);
      if (parsed.fieldErrors) {
        Object.entries(parsed.fieldErrors).forEach(([field, msg]) => {
          setError(field as keyof LoginFormData, { message: msg });
        });
      }
      showError(parsed.message || 'Login failed. Please check your credentials.');
    }
  };

  return (
    <div className="bg-zinc-900/90 border border-zinc-800 rounded-3xl p-8 shadow-2xl backdrop-blur-xl">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-white mb-2">Sign in to your account</h2>
        <p className="text-sm text-zinc-400">
          Enter your enterprise credentials to access FitTrack Pro
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {/* Email */}
        <div>
          <label className="block text-xs font-semibold text-zinc-300 mb-1.5 uppercase tracking-wider">
            Email Address
          </label>
          <div className="relative">
            <Mail className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500" />
            <input
              type="email"
              {...register('email')}
              placeholder="user@fittrack.com"
              className={`w-full bg-zinc-950 border rounded-xl pl-11 pr-4 py-3 text-sm text-zinc-100 placeholder-zinc-600 focus:outline-none transition-colors ${
                errors.email
                  ? 'border-rose-500/80 focus:border-rose-500'
                  : 'border-zinc-800 focus:border-orange-500'
              }`}
            />
          </div>
          {errors.email && (
            <p className="text-xs text-rose-400 mt-1.5">{errors.email.message}</p>
          )}
        </div>

        {/* Password */}
        <div>
          <label className="block text-xs font-semibold text-zinc-300 mb-1.5 uppercase tracking-wider">
            Password
          </label>
          <div className="relative">
            <Lock className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500" />
            <input
              type="password"
              {...register('password')}
              placeholder="••••••••"
              className={`w-full bg-zinc-950 border rounded-xl pl-11 pr-4 py-3 text-sm text-zinc-100 placeholder-zinc-600 focus:outline-none transition-colors ${
                errors.password
                  ? 'border-rose-500/80 focus:border-rose-500'
                  : 'border-zinc-800 focus:border-orange-500'
              }`}
            />
          </div>
          {errors.password && (
            <p className="text-xs text-rose-400 mt-1.5">{errors.password.message}</p>
          )}
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-3.5 px-4 rounded-xl bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-zinc-950 font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-orange-500/20 transition-all mt-2"
        >
          <LogIn className="w-4 h-4 fill-zinc-950" />
          <span>{isSubmitting ? 'Signing in...' : 'Sign In'}</span>
        </button>
      </form>

      <div className="mt-8 text-center text-xs text-zinc-400 border-t border-zinc-800 pt-6">
        Don't have an account?{' '}
        <Link to="/register" className="text-orange-400 hover:text-orange-300 font-bold">
          Create one now
        </Link>
      </div>
    </div>
  );
};
