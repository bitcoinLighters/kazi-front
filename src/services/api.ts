const API_BASE_URL = import.meta.env.VITE_API_URL ?? '/api/v1';

export class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

export type CreateInvoiceInput = {
  out: false;
  amount: number;
  memo?: string;
  webhook?: string;
  expiry?: number;
  extra?: Record<string, unknown>;
};

export type PayInvoiceInput = {
  out: true;
  bolt11: string;
};

export type LightningPayment = {
  checking_id: string;
  payment_hash?: string;
  payment_request?: string;
  amount: number;
  fee: number;
  memo?: string;
  status: 'pending' | 'success' | 'failed';
  time: number;
  bolt11?: string;
  extra?: Record<string, unknown>;
};

export type PaymentStatus = {
  paid: boolean;
  details: Pick<LightningPayment, 'checking_id' | 'amount' | 'fee' | 'memo' | 'status' | 'time'>;
};

export type PaginatedPayments = { data: LightningPayment[]; total: number };

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers
    },
    credentials: 'include'
  });

  if (!response.ok) {
    const body = await response.json().catch(() => null) as { message?: string } | null;
    throw new ApiError(body?.message ?? 'The request could not be completed.', response.status);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
}

function toQuery(params: Record<string, string | number | undefined>) {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined) query.set(key, String(value));
  });
  const encoded = query.toString();
  return encoded ? `?${encoded}` : '';
}

export const api = {
  dashboard: () => request('/dashboard'),
  users: (query = '') => request(`/users${query}`),
  user: (id: string) => request(`/users/${id}`),
  jobs: (query = '') => request(`/jobs${query}`),
  createJob: <T>(payload: T) => request('/jobs', { method: 'POST', body: JSON.stringify(payload) }),
  updateJob: <T>(id: string, payload: T) => request(`/jobs/${id}`, { method: 'PUT', body: JSON.stringify(payload) }),
  deleteJob: (id: string) => request(`/jobs/${id}`, { method: 'DELETE' }),
  applications: (query = '') => request(`/applications${query}`),
  updateApplicationStatus: (id: string, status: string) => request(`/applications/${id}/status`, { method: 'PUT', body: JSON.stringify({ status }) }),
  confirmedJobs: () => request('/confirmed-jobs'),
  posts: () => request('/posts'),
  createPost: <T>(payload: T) => request('/posts', { method: 'POST', body: JSON.stringify(payload) }),
  roles: () => request('/access/roles'),
  permissions: () => request('/access/permissions'),
  createInvoice: (payload: CreateInvoiceInput) => request<{ payment_hash: string; payment_request: string; checking_id: string }>('/payments', { method: 'POST', body: JSON.stringify(payload) }),
  payInvoice: (payload: PayInvoiceInput) => request<{ payment_hash: string; checking_id: string }>('/payments', { method: 'POST', body: JSON.stringify(payload) }),
  invoiceStatus: (checkingId: string) => request<PaymentStatus>(`/payments/${encodeURIComponent(checkingId)}`),
  payments: (params: { limit?: number; offset?: number; status?: PaymentStatus['details']['status'] } = {}) => request<LightningPayment[]>(`/payments${toQuery(params)}`),
  paginatedPayments: (params: { limit?: number; offset?: number; status?: PaymentStatus['details']['status'] } = {}) => request<PaginatedPayments>(`/payments/paginated${toQuery(params)}`),
  paymentHistory: (group: 'hour' | 'day' | 'month' = 'day') => request<{ date: string; income: number; spending: number }[]>(`/payments/history?group=${group}`),
  paymentCountByTag: () => request<{ tag: string; count: number }[]>('/payments/stats/count'),
  dailyPaymentStats: () => request<{ date: string; count: number; total: number }[]>('/payments/stats/daily'),
  settleHoldInvoice: (checkingId: string) => request<{ detail: string }>(`/payments/${encodeURIComponent(checkingId)}`, { method: 'PUT' }),
  cancelHoldInvoice: (checkingId: string) => request<{ detail: string }>(`/payments/${encodeURIComponent(checkingId)}`, { method: 'DELETE' }),
  kyc: (userId: string) => request(`/users/${userId}/kyc`),
  submitKyc: <T>(userId: string, payload: T) => request(`/users/${userId}/kyc`, { method: 'POST', body: JSON.stringify(payload) }),
  integrations: () => request('/integrations'),
  updateIntegration: <T>(provider: string, payload: T) => request(`/integrations/${provider}`, { method: 'PUT', body: JSON.stringify(payload) }),
  notifications: () => request('/notifications'),
  messages: () => request('/messages'),
  analytics: () => request('/analytics')
};