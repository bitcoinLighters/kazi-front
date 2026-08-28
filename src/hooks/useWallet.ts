import { useCallback, useEffect, useState } from 'react';
import { walletService } from '../services/walletService';
import type { Earning, Wallet } from '../types/api';

const mockWallet: Wallet = { balanceSats: 23450, currency: 'sats' };
const useMockApi = import.meta.env.VITE_USE_MOCK_API === 'true';

export function useWallet() {
  const [wallet, setWallet] = useState<Wallet | null>(null);
  const [earnings, setEarnings] = useState<Earning[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const loadWallet = useCallback(async () => {
    setLoading(true); setError('');
    try { setWallet(useMockApi ? mockWallet : await walletService.getWallet()); if (!useMockApi) setEarnings(await walletService.getEarnings()); }
    catch (cause) { setError(cause instanceof Error ? cause.message : 'Unable to load wallet.'); } finally { setLoading(false); }
  }, []);
  useEffect(() => { void loadWallet(); }, [loadWallet]);
  return { wallet, earnings, loading, error, reload: loadWallet };
}
