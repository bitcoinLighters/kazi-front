import { apiRequest } from './apiClient';
import type { SubmitWorkData } from '../types/api';

export const submissionService = {
  async getSubmissions() { return (await apiRequest<{ submissions: unknown[] }>('/api/submissions')).submissions; },
  async getSubmission(id: string | number) { return (await apiRequest<{ submission: unknown }>(`/api/submissions/${id}`)).submission; },
  submitWork: (taskId: string | number, data: SubmitWorkData) => apiRequest<{ submission: unknown }>(`/api/tasks/${taskId}/submissions`, { method: 'POST', body: JSON.stringify({ ...data, text: data.description, lightningInvoice: data.invoice }) }),
  requestChanges: (id: string | number, feedback = 'Please revise your submission') => apiRequest<{ submission: unknown }>(`/api/submissions/${id}/request-changes`, { method: 'POST', body: JSON.stringify({ feedback }) }),
};
