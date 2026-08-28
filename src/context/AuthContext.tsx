import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';
import { authService } from '../services/authService';
import { tokenStorage } from '../services/apiClient';
import type { User, UserRole } from '../types/api';

type AuthContextValue = {
  user: User | null;
  role: UserRole | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (credentials: { email: string; password: string }) => Promise<void>;
  signup: (data: { name: string; email: string; password: string; role: UserRole }) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState(tokenStorage.get());
  const value = useMemo(() => ({
    user, role: user?.role || null, token, isAuthenticated: Boolean(token && user),
    async login(credentials: { email: string; password: string }) { const result = await authService.login(credentials); setUser(result.user); setToken(result.token); },
    async signup(data: { name: string; email: string; password: string; role: UserRole }) { const result = await authService.signup(data); setUser(result.user); setToken(result.token); },
    logout() { authService.logout(); setUser(null); setToken(null); },
  }), [token, user]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used inside AuthProvider');
  return context;
}