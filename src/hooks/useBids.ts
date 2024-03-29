import { useWallet } from 'contexts/WalletContext';
import { getBids } from 'graphql/getBids';
import { useEffect, useState } from 'react';
import { combineBids } from 'utils';
import { ICombinedBid } from 'utils/types';
import { GUILD_KEEPER_ENDPOINT } from 'web3/constants';

export const useBids = (
  refresh = 0,
): {
  fetching: boolean;
  consultations: ICombinedBid[] | null;
  error: Error | null;
} => {
  const { chainId } = useWallet();
  const [fetching, setFetching] = useState(true);
  const [consultations, setConsultations] = useState<ICombinedBid[] | null>(
    null,
  );
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!chainId) return;
    getBids(chainId).then(bids => {
      if (bids) {
        setFetching(true);
        fetch(`${GUILD_KEEPER_ENDPOINT}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            key: process.env.REACT_APP_ACCESS_KEY,
          }),
        })
          .then(res => res.json())
          .then(async data => {
            const combinedBids = await combineBids(chainId, data, bids);
            if (!combinedBids) {
              setError(new Error('No bids found'));
              return;
            }
            combinedBids.sort(function (a, b) {
              return (
                new Date(b.created).getTime() - new Date(a.created).getTime()
              );
            });
            combinedBids.sort((a, b) => Number(b.amount) - Number(a.amount));
            setConsultations(combinedBids);
          });
      } else {
        setError(new Error('Unable to fetch bids'));
      }
    });
  }, [chainId, refresh]);

  return { fetching, consultations, error };
};
