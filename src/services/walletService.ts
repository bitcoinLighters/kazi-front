import { apiRequest } from './apiClient';
import type { Earning, Wallet } from '../types/api';

export const walletService = {
  getWallet: async () => (await apiRequest<{ wallet: Wallet }>('/api/wallet')).wallet,
  getEarnings: async () => {
    const response = await apiRequest<{ earnings: (Earning & { _id?: string; rewardSats?: number; taskId?: { title?: string } })[] }>('/api/wallet/earnings');
    return response.earnings.map((earning) => ({ ...earning, id: earning.id || earning._id || '', amountSats: earning.amountSats ?? earning.rewardSats ?? 0, description: earning.description || earning.taskId?.title }));
  },
};
