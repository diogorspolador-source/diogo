import { api } from './client';
import type { LaunchInput, LaunchFormData } from '../types/launch';

export const launchesApi = {
  list: () => api.get<LaunchInput[]>('/launches'),
  get: (id: string) => api.get<LaunchInput>(`/launches/${id}`),
  create: (data: LaunchFormData) => api.post<LaunchInput>('/launches', data),
  update: (id: string, data: Partial<LaunchFormData>) =>
    api.put<LaunchInput>(`/launches/${id}`, data),
  delete: (id: string) => api.delete<void>(`/launches/${id}`),
};
