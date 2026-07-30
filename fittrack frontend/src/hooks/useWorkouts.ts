import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { workoutService } from '../services/workoutService';
import { WorkoutRequest, WorkoutHistoryRequest } from '../types';

export function useMyWorkouts(page = 0, size = 20) {
  return useQuery({
    queryKey: ['workouts', 'mine', page, size],
    queryFn: () => workoutService.getMyWorkouts(page, size)
  });
}

export function useWorkout(id: number | null) {
  return useQuery({
    queryKey: ['workout', id],
    queryFn: () => (id ? workoutService.getWorkoutById(id) : null),
    enabled: !!id
  });
}

export function useCreateWorkout() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: WorkoutRequest) => workoutService.createWorkout(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workouts'] });
    }
  });
}

export function useUpdateWorkout() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: WorkoutRequest }) =>
      workoutService.updateWorkout(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['workouts'] });
      queryClient.invalidateQueries({ queryKey: ['workout', variables.id] });
    }
  });
}

export function useDeleteWorkout() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => workoutService.deleteWorkout(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workouts'] });
    }
  });
}

export function useLogWorkoutHistory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: WorkoutHistoryRequest }) =>
      workoutService.logWorkoutHistory(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['history'] });
      queryClient.invalidateQueries({ queryKey: ['workouts'] });
    }
  });
}

export function useAllHistory() {
  return useQuery({
    queryKey: ['history', 'all'],
    queryFn: () => workoutService.getAllMyHistory(0, 100)
  });
}

export function useTemplates() {
  return useQuery({
    queryKey: ['templates'],
    queryFn: () => workoutService.getTemplates()
  });
}

export function useCopyTemplate() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => workoutService.copyTemplate(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workouts'] });
    }
  });
}

export function useAchievements() {
  return useQuery({
    queryKey: ['achievements'],
    queryFn: () => workoutService.getAchievements()
  });
}
