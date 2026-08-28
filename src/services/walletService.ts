import { apiRequest } from './apiClient';
import type { Earning, Wallet } from '../types/api';

export const walletService = {
  getWallet: () => apiRequest<Wallet>('/api/wallet'),
  getEarnings: () => apiRequest<Earning[]>('/api/wallet/earnings'),
};