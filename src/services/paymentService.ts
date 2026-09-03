import { apiRequest } from './apiClient';
import type { Payment } from '../types/api';

const useMockApi = import.meta.env.VITE_USE_MOCK_API === 'true';

export const paymentService = {
  approveAndPay: (submissionId: string | number) => useMockApi ? Promise.resolve({ id: `mock-${submissionId}`, amount: 0, fee: 0, status: 'confirmed' } as Payment) : apiRequest<{ payment: Payment }>(`/api/submissions/${submissionId}/approve`, { method: 'POST' }).then((response) => response.payment),
  getPayment: (id: string | number) => apiRequest<{ payment: Payment }>(`/api/payments/${id}`).then((response) => response.payment),
  getEmployerBalance: () => apiRequest<{ balance: { balanceSats: number } }>('/api/payments/balance').then((response) => response.balance),
};
