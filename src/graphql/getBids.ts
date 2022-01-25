import gql from 'fake-tag';
import type { IBid } from 'utils/types';

import { CLIENTS } from './client';

const rinkebyBidsQuery = gql`
  query {
    bids(
      first: 100
      where: { queue: "0x3a9f3147742e51efba1f04ff26e8dc95978dccb4" }
    ) {
      id
      amount
      createdAt
      details
      createTxHash
      status
      submitter {
        id
      }
      increases {
        increasedAt
        amount
        increasedBy
        increaseTxHash
      }
      withdraws {
        withdrawnAt
        amount
        withdrawTxHash
      }
    }
  }
`;

const gnosisBidsQuery = gql`
  query {
    bids(
      first: 100
      where: { queue: "0xd880b00877726c2b76173acec061b29c27d5d791" }
    ) {
      id
      amount
      createdAt
      details
      createTxHash
      status
      submitter {
        id
      }
      increases {
        increasedAt
        amount
        increasedBy
        increaseTxHash
      }
      withdraws {
        withdrawnAt
        amount
        withdrawTxHash
      }
    }
  }
`;

export const getBids = async (chainId: number): Promise<IBid[]> => {
  const { data, error } = await CLIENTS[chainId]
    .query(chainId === 100 ? gnosisBidsQuery : rinkebyBidsQuery)
    .toPromise();
  if (!data) {
    if (error) {
      throw error;
    }

    return [];
  }

  return data.bids;
};
