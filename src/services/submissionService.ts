import { apiRequest } from './apiClient';
import type { SubmitWorkData } from '../types/api';

export const submissionService = {
  getSubmissions: () => apiRequest<unknown[]>('/api/submissions'),
  getSubmission: (id: string | number) => apiRequest<unknown>(`/api/submissions/${id}`),
  submitWork: (taskId: string | number, data: SubmitWorkData) => apiRequest<unknown>(`/api/tasks/${taskId}/submissions`, { method: 'POST', body: JSON.stringify(data) }),
  requestChanges: (id: string | number) => apiRequest<unknown>(`/api/submissions/${id}/request-changes`, { method: 'POST' }),
};