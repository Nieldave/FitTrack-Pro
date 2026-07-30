import { api } from '../lib/axios';
import {
  WorkoutRequest,
  WorkoutResponse,
  WorkoutHistoryRequest,
  WorkoutHistoryResponse,
  PageResponse,
  Achievement
} from '../types';

export const workoutService = {
  async createWorkout(data: WorkoutRequest): Promise<WorkoutResponse> {
    const response = await api.post<WorkoutResponse>('/workouts', data);
    return response.data;
  },

  async getMyWorkouts(page = 0, size = 20): Promise<PageResponse<WorkoutResponse>> {
    const response = await api.get<PageResponse<WorkoutResponse>>(`/workouts?page=${page}&size=${size}`);
    return response.data;
  },

  async getWorkoutById(id: number): Promise<WorkoutResponse> {
    const response = await api.get<WorkoutResponse>(`/workouts/${id}`);
    return response.data;
  },

  async updateWorkout(id: number, data: WorkoutRequest): Promise<WorkoutResponse> {
    const response = await api.put<WorkoutResponse>(`/workouts/${id}`, data);
    return response.data;
  },

  async deleteWorkout(id: number): Promise<void> {
    await api.delete(`/workouts/${id}`);
  },

  async logWorkoutHistory(id: number, data: WorkoutHistoryRequest): Promise<WorkoutHistoryResponse> {
    const response = await api.post<WorkoutHistoryResponse>(`/workouts/${id}/history`, data);
    return response.data;
  },

  async getWorkoutHistory(id: number, page = 0, size = 20): Promise<PageResponse<WorkoutHistoryResponse>> {
    const response = await api.get<PageResponse<WorkoutHistoryResponse>>(`/workouts/${id}/history?page=${page}&size=${size}`);
    return response.data;
  },

  async getAllMyHistory(page = 0, size = 50): Promise<PageResponse<WorkoutHistoryResponse>> {
    const response = await api.get<PageResponse<WorkoutHistoryResponse>>(`/workouts/history/me?page=${page}&size=${size}`);
    return response.data;
  },

  // Phase 2 Stand-in Services
  async getTemplates(): Promise<PageResponse<WorkoutResponse>> {
    const response = await api.get<PageResponse<WorkoutResponse>>('/templates');
    return response.data;
  },

  async copyTemplate(id: number): Promise<WorkoutResponse> {
    const response = await api.post<WorkoutResponse>(`/templates/${id}/copy`);
    return response.data;
  },

  async getAchievements(): Promise<Achievement[]> {
    const response = await api.get<Achievement[]>('/achievements');
    return response.data;
  }
};
