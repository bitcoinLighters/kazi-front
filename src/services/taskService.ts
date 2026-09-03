import { apiRequest } from './apiClient';
import type { CreateTaskData, Task } from '../types/api';

const mockTasks: Task[] = [
  { id: 1, title: 'Translate product FAQ to Kinyarwanda', category: 'Translation', rewardSats: 4200, submittedBy: 'Amina K.', status: 'reviewing' },
  { id: 2, title: 'Write 3 short product reviews', category: 'Copywriting', rewardSats: 2100, submittedBy: 'Claude N.', status: 'paid' },
  { id: 3, title: 'Record 10 phrases in Kinyarwanda', category: 'Voice Data', rewardSats: 3500, submittedBy: 'Eric M.', status: 'open' },
];
const useMockApi = import.meta.env.VITE_USE_MOCK_API === 'true';
const normalizeTask = (task: Task & { _id?: string }): Task => ({ ...task, id: task.id || task._id || '' });

export const taskService = {
  getTasks: async (role: 'youth' | 'client' = 'youth'): Promise<Task[]> => {
    if (useMockApi) return [...mockTasks];
    const response = await apiRequest<{ tasks: Task[] }>(role === 'client' ? '/api/tasks/client/mine' : '/api/tasks');
    return response.tasks.map(normalizeTask);
  },
  getMyTasks: async (): Promise<Task[]> => {
    if (useMockApi) return [...mockTasks].filter((task) => task.status !== 'open');
    const response = await apiRequest<{ tasks: (Task & { _id?: string })[] }>('/api/tasks/youth/mine');
    return response.tasks.map(normalizeTask);
  },
  getTask: async (id: string | number): Promise<Task> => {
    if (useMockApi) return mockTasks.find((task) => String(task.id) === String(id)) || Promise.reject(new Error('Task not found.'));
    return normalizeTask(await apiRequest<{ task: Task & { _id?: string } }>(`/api/tasks/${id}`).then((response) => response.task));
  },
  createTask: async (data: CreateTaskData): Promise<Task> => {
    if (useMockApi) return { ...data, id: Date.now(), status: 'open' } as Task;
    return normalizeTask(await apiRequest<{ task: Task & { _id?: string } }>('/api/tasks', { method: 'POST', body: JSON.stringify(data) }).then((response) => response.task));
  },
  acceptTask: async (id: string | number): Promise<Task> => {
    if (useMockApi) return { ...mockTasks.find((task) => String(task.id) === String(id))!, status: 'in_progress' };
    return normalizeTask(await apiRequest<{ task: Task & { _id?: string } }>(`/api/tasks/${id}/accept`, { method: 'POST' }).then((response) => response.task));
  },
};
