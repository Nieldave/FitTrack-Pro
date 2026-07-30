import { api } from '../lib/axios';
import { User, PageResponse } from '../types';

export const userService = {
  async getMe(): Promise<User> {
    const response = await api.get<User>('/users/me');
    return response.data;
  },

  async updateMe(data: { name: string }): Promise<User> {
    const response = await api.put<User>('/users/me', data);
    return response.data;
  },

  async changePassword(data: { currentPassword: string; newPassword: string }): Promise<void> {
    await api.put('/users/me/password', data);
  },

  async deleteMe(): Promise<void> {
    await api.delete('/users/me');
  },

  // Admin endpoints
  async getUsers(page = 0, size = 20): Promise<PageResponse<User>> {
    const response = await api.get<PageResponse<User>>(`/users?page=${page}&size=${size}`);
    return response.data;
  },

  async getUserById(id: number): Promise<User> {
    const response = await api.get<User>(`/users/${id}`);
    return response.data;
  },

  async disableUser(id: number): Promise<void> {
    await api.put(`/users/${id}/disable`);
  },

  async enableUser(id: number): Promise<void> {
    await api.put(`/users/${id}/enable`);
  }
};
