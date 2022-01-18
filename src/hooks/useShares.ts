import { useWallet } from 'contexts/WalletContext';
import { useEffect, useState } from 'react';
import { DAO_ADDRESS } from 'web3/constants';
import { getShares } from 'web3/moloch';

interface IBalances {
  shares: string;
  isLoadingShares: boolean;
}

export const useShares = (refresh = 0): IBalances => {
  const { provider, address, chainId } = useWallet();

  const [shares, setShares] = useState<string>('0');
  const [isLoadingShares, setLoadingShares] = useState(false);

  useEffect(() => {
    const fetchShares = async () => {
      if (!provider || !address || !chainId) {
        return;
      }
      setLoadingShares(true);
      const shares = await getShares(provider, DAO_ADDRESS, address);
      setShares(shares);
      setLoadingShares(false);
    };

    fetchShares();
  }, [address, provider, refresh, chainId]);

  return { shares, isLoadingShares };
};
