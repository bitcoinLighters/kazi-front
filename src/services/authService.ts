import { apiRequest, tokenStorage } from './apiClient';
import type { AuthResponse, UserRole } from '../types/api';

export const authService = {
  async login(credentials: { email: string; password: string }) {
    const raw = await apiRequest<AuthResponse | { user: AuthResponse['user']; token: string }>('/api/auth/login', { method: 'POST', body: JSON.stringify(credentials) });
    const result = raw as AuthResponse;
    tokenStorage.set(result.token); return result;
  },
  async signup(data: { name: string; email: string; password: string; role: UserRole }) {
    const payload = data.role === 'youth' ? { ...data, skills: ['general'] } : data;
    const raw = await apiRequest<AuthResponse | { user: AuthResponse['user']; token: string }>('/api/auth/signup', { method: 'POST', body: JSON.stringify(payload) });
    const result = raw as AuthResponse;
    tokenStorage.set(result.token); return result;
  },
  async me() {
    const raw = await apiRequest<{ user: AuthResponse['user']; wallet?: unknown }>('/api/auth/me');
    return 'user' in raw ? raw.user : raw;
  },
  logout: () => tokenStorage.clear(),
};
