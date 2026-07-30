import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { exerciseService, ExerciseFilterParams } from '../services/exerciseService';
import { Exercise } from '../types';

export function useExercises(params: ExerciseFilterParams = {}) {
  return useQuery({
    queryKey: ['exercises', params],
    queryFn: () => exerciseService.getExercises(params)
  });
}

export function useExercise(id: number | null) {
  return useQuery({
    queryKey: ['exercise', id],
    queryFn: () => (id ? exerciseService.getExerciseById(id) : null),
    enabled: !!id
  });
}

export function useCreateExercise() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Omit<Exercise, 'id'>) => exerciseService.createExercise(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['exercises'] });
    }
  });
}

export function useUpdateExercise() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<Exercise> }) =>
      exerciseService.updateExercise(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['exercises'] });
      queryClient.invalidateQueries({ queryKey: ['exercise', variables.id] });
    }
  });
}

export function useDeleteExercise() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => exerciseService.deleteExercise(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['exercises'] });
    }
  });
}
