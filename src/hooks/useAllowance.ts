import { useWallet } from 'contexts/WalletContext';
import { useCallback, useEffect, useState } from 'react';
import { getAllowance } from 'web3/allowance';

export const useAllowance = (
  spenderAddress: string,
  tokenAddress: string,
  refreshCount = 0,
): string => {
  const { provider, address } = useWallet();
  const [allowance, setAllowance] = useState<string>('0');

  const fetchAllowance = useCallback(async () => {
    if (!provider || !address || !spenderAddress) return;
    const allowance = await getAllowance(
      provider,
      tokenAddress,
      address,
      spenderAddress,
    );
    setAllowance(allowance);
  }, [address, provider, spenderAddress, tokenAddress]);

  useEffect(() => {
    if (address && provider) {
      fetchAllowance();
    }
    const refreshInterval = setInterval(fetchAllowance, 10000);
    return () => clearInterval(refreshInterval);
  }, [address, provider, fetchAllowance, refreshCount]);

  return allowance;
};
