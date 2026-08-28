import { apiRequest } from './apiClient';
import type { Payment } from '../types/api';

const useMockApi = import.meta.env.VITE_USE_MOCK_API !== 'false';

export const paymentService = {
  approveAndPay: (taskId: string | number) => useMockApi ? Promise.resolve({ id: `mock-${taskId}`, amount: 0, fee: 0, status: 'confirmed' }) : apiRequest<Payment>(`/api/tasks/${taskId}/approve-payment`, { method: 'POST' }),
  getPayment: (id: string | number) => apiRequest<Payment>(`/api/payments/${id}`),
};