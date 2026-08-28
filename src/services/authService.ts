import { apiRequest, tokenStorage } from './apiClient';
import type { AuthResponse, UserRole } from '../types/api';

export const authService = {
  async login(credentials: { email: string; password: string }) {
    const result = await apiRequest<AuthResponse>('/api/auth/login', { method: 'POST', body: JSON.stringify(credentials) });
    tokenStorage.set(result.token); return result;
  },
  async signup(data: { name: string; email: string; password: string; role: UserRole }) {
    const result = await apiRequest<AuthResponse>('/api/auth/signup', { method: 'POST', body: JSON.stringify(data) });
    tokenStorage.set(result.token); return result;
  },
  logout: () => tokenStorage.clear(),
};