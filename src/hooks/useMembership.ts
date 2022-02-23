import { useWallet } from 'contexts/WalletContext';
import { getShares } from 'graphql/getShares';
import * as _ from 'lodash';
import { useEffect, useState } from 'react';
import { DAO_ADDRESS } from 'web3/constants';

interface IMembershipDetails {
  shares: string;
  isLoadingShares: boolean;
  isMember: boolean;
}

export const useMembership = (refresh = 0): IMembershipDetails => {
  const { address, chainId } = useWallet();

  const [shares, setShares] = useState<string>('0');
  const [isLoadingShares, setLoadingShares] = useState(false);
  const [isMember, setIsMember] = useState(false);

  useEffect(() => {
    const fetchShares = async () => {
      if (!(address && chainId)) return;
      setLoadingShares(true);
      const fetchedShares = await getShares(address, DAO_ADDRESS[chainId]);
      setShares(_.get(fetchedShares, 'shares'));
      setLoadingShares(false);
      if (
        _.gte(
          Number(_.get(fetchedShares, 'shares')),
          _.get(DAO_ADDRESS[chainId], _.get(fetchedShares, 'molochAddress')),
        )
      ) {
        setIsMember(true);
      }
    };

    if (address) {
      fetchShares();
    }
  }, [address, chainId, refresh]);

  return { shares, isLoadingShares, isMember };
};
