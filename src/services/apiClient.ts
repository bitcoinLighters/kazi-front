const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/$/, '');
const TOKEN_KEY = 'kazi_auth_token';

export class ApiError extends Error {
  constructor(message: string, public status: number) { super(message); this.name = 'ApiError'; }
}

export const tokenStorage = {
  get: () => sessionStorage.getItem(TOKEN_KEY),
  set: (token: string) => sessionStorage.setItem(TOKEN_KEY, token),
  clear: () => sessionStorage.removeItem(TOKEN_KEY),
};

function friendlyMessage(status: number, message?: string) {
  if (status === 400 && message?.toLowerCase().includes('invoice')) return 'Payment could not be completed. Please check the invoice and try again.';
  if (status === 409 && message?.toLowerCase().includes('claim')) return 'Sorry, this task has already been claimed.';
  if (status === 409) return 'Payment cannot be processed yet.';
  if (status === 502) return 'Payment failed. The task is still under review.';
  return message || 'Something went wrong. Please try again.';
}

export async function apiRequest<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = tokenStorage.get();
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}), ...options.headers },
  });
  const body = await response.json().catch(() => undefined) as { data?: T; message?: string } | T | undefined;
  if (!response.ok) {
    const message = body && typeof body === 'object' && 'message' in body ? body.message : undefined;
    throw new ApiError(friendlyMessage(response.status, message), response.status);
  }
  if (body && typeof body === 'object' && 'data' in body && body.data !== undefined) return body.data;
  return body as T;
}

export const apiConfig = { baseUrl: API_BASE_URL };