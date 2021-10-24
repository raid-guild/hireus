import React from 'react';
import { GUILD_KEEPER_ENDPOINT } from '../constants';
import { combineBids } from '../utils';

import { getBids } from '../graphql/getBids';

export const useBids = (refresh = 0) => {
  const [fetching, setFetching] = React.useState(true);
  const [consultations, setConsultations] = React.useState(null);
  const [error, setError] = React.useState(null);

  React.useEffect(() => {
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
            const combinedBids = await combineBids(data, bids);
            if (!combinedBids) {
              setError(new Error('No bids found'));
            }
            combinedBids.sort(function (a, b) {
              return new Date(b.created) - new Date(a.created);
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
