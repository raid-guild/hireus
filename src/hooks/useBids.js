import React from 'react';
import gql from 'graphql-tag';
import { Client } from 'urql';

const RETRY_EVERY = 3000;

const graphqlClient = new Client({ url: process.env.REACT_APP_AUCTION_SUBGRAPH_URL ?? '' });

const BIDS_QUERY = gql`
  query{
    bids {
      id
      amount
      details
    }
  }
`;

export const useBids = () => {
  const [bids, setBids] = React.useState(null);

  React.useEffect(() => {
    let cancelled = false;
    let retryTimer;

    async function fetchBids() {
      try {
        const result = await graphqlClient.query(BIDS_QUERY).toPromise();
        if (!result?.data) {
          return;
        }
        const bids = result.data.bids;

        if (!cancelled) {
          setBids(bids);
        }
      } catch (err) {
        retryTimer = setTimeout(fetchBids, RETRY_EVERY);
      }
    }

    fetchBids();

    return () => {
      cancelled = true;
      clearTimeout(retryTimer);
    };
  }, []);

  return { bids };
}
