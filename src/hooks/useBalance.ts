import { useWallet } from 'contexts/WalletContext';
import { useEffect, useState } from 'react';
import { getBalance } from 'web3/balance';

interface IBalance {
  balance: string;
  isLoadingBalances: boolean;
}

export const useBalance = (tokenAddress: string, refresh = 0): IBalance => {
  const { provider, address, chainId } = useWallet();

  const [balance, setBalance] = useState<string>('0');
  const [isLoadingBalances, setLoadingBalances] = useState(true);

  useEffect(() => {
    const fetchBalance = async () => {
      if (!provider || !address || !chainId || !tokenAddress) {
        return;
      }

      setLoadingBalances(true);
      const balance =
        (await getBalance(provider, tokenAddress, address)).toString() || '0';
      setBalance(balance);
      setLoadingBalances(false);
    };

    fetchBalance();
  }, [address, provider, refresh, tokenAddress, chainId]);

  return { balance, isLoadingBalances };
};
