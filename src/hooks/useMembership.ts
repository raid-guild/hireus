import { useWallet } from 'contexts/WalletContext';
import { BigNumber } from 'ethers';
import { getShares } from 'graphql/getShares';
import * as _ from 'lodash';
import { useEffect, useState } from 'react';
import { DAO_ADDRESS, MIN_NUMBER_OF_SHARES } from 'web3/constants';

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
      const shares = _.get(fetchedShares, 'shares');
      setShares(shares);
      setLoadingShares(false);
      if (
        BigNumber.from(shares).gt(BigNumber.from(MIN_NUMBER_OF_SHARES[chainId]))
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
