import { apiRequest } from './apiClient';
import type { CreateTaskData, Task } from '../types/api';

const mockTasks: Task[] = [
  { id: 1, title: 'Translate product FAQ to Kinyarwanda', category: 'Translation', rewardSats: 4200, submittedBy: 'Amina K.', status: 'reviewing' },
  { id: 2, title: 'Write 3 short product reviews', category: 'Copywriting', rewardSats: 2100, submittedBy: 'Claude N.', status: 'paid' },
  { id: 3, title: 'Record 10 phrases in Kinyarwanda', category: 'Voice Data', rewardSats: 3500, submittedBy: 'Eric M.', status: 'open' },
];
const useMockApi = import.meta.env.VITE_USE_MOCK_API !== 'false';

export const taskService = {
  getTasks: async (): Promise<Task[]> => useMockApi ? [...mockTasks] : apiRequest<Task[]>('/api/tasks'),
  getTask: async (id: string | number): Promise<Task> => useMockApi ? mockTasks.find((task) => String(task.id) === String(id)) || Promise.reject(new Error('Task not found.')) : apiRequest<Task>(`/api/tasks/${id}`),
  createTask: async (data: CreateTaskData): Promise<Task> => useMockApi ? { ...data, id: Date.now(), status: 'open' } : apiRequest<Task>('/api/tasks', { method: 'POST', body: JSON.stringify(data) }),
  acceptTask: async (id: string | number): Promise<Task> => useMockApi ? { ...mockTasks.find((task) => String(task.id) === String(id))!, status: 'in_progress' } : apiRequest<Task>(`/api/tasks/${id}/accept`, { method: 'POST' }),
};