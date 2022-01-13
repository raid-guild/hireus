import { useState, useEffect } from 'react';
import { GUILD_KEEPER_ENDPOINT } from 'constants/index';
import { combineBids } from 'utils';
import { ICombinedBid } from 'utils/types';

import { getBids } from 'graphql/getBids';

export const useBids = (refresh = 0) => {
  const [fetching, setFetching] = useState(true);
  const [consultations, setConsultations] = useState<ICombinedBid[] | null>(null);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let isSubscribed = true;
    getBids().then(bids => {
      if (isSubscribed && bids) {
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
            const combinedBids: ICombinedBid[] | undefined = await combineBids(data, bids);
            if (!combinedBids) {
              setError(new Error('No bids found'));
              return;
            }
            combinedBids.sort(function (a, b) {
              return new Date(b.created).getTime() - new Date(a.created).getTime();
            });
            combinedBids.sort((a, b) => Number(b.amount) - Number(a.amount));
            setConsultations(combinedBids);
          });
      } else {
        setError(new Error('Unable to fetch bids'));
      }
    });

    return () => {
      isSubscribed = false;
    };
  }, [refresh]);

  return { fetching, consultations, error };
};
