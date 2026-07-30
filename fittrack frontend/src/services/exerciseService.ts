import { api } from '../lib/axios';
import { Exercise, PageResponse, Category, MuscleGroup, Difficulty } from '../types';

export interface ExerciseFilterParams {
  category?: Category | 'ALL';
  muscleGroup?: MuscleGroup | 'ALL';
  difficulty?: Difficulty | 'ALL';
  keyword?: string;
  page?: number;
  size?: number;
}

export const exerciseService = {
  async getExercises(params: ExerciseFilterParams = {}): Promise<PageResponse<Exercise>> {
    const query = new URLSearchParams();
    if (params.category && params.category !== 'ALL') query.append('category', params.category);
    if (params.muscleGroup && params.muscleGroup !== 'ALL') query.append('muscleGroup', params.muscleGroup);
    if (params.difficulty && params.difficulty !== 'ALL') query.append('difficulty', params.difficulty);
    if (params.keyword) query.append('keyword', params.keyword);
    query.append('page', String(params.page ?? 0));
    query.append('size', String(params.size ?? 20));

    const response = await api.get<PageResponse<Exercise>>(`/exercises?${query.toString()}`);
    return response.data;
  },

  async getExerciseById(id: number): Promise<Exercise> {
    const response = await api.get<Exercise>(`/exercises/${id}`);
    return response.data;
  },

  // Admin endpoints
  async createExercise(data: Omit<Exercise, 'id'>): Promise<Exercise> {
    const response = await api.post<Exercise>('/exercises', data);
    return response.data;
  },

  async updateExercise(id: number, data: Partial<Exercise>): Promise<Exercise> {
    const response = await api.put<Exercise>(`/exercises/${id}`, data);
    return response.data;
  },

  async deleteExercise(id: number): Promise<void> {
    await api.delete(`/exercises/${id}`);
  }
};
