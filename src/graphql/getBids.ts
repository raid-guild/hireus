import gql from 'fake-tag';
import type { IBid } from 'utils/types';
import { DEFAULT_NETWORK, QUEUE_CONTRACT_ADDRESS } from 'web3/constants';

import { CLIENTS } from './client';

const rinkebyBidsQuery = gql`
  query RinkebyBidsQuery($molochAddress: String) {
    bids(first: 100, where: { queue: $molochAddress }) {
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
  query GnosisBidsQuery($molochAddress: String) {
    bids(first: 100, where: { queue: $molochAddress }) {
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
    .query(chainId === 100 ? gnosisBidsQuery : rinkebyBidsQuery, {
      molochAddress: QUEUE_CONTRACT_ADDRESS[chainId || DEFAULT_NETWORK],
    })
    .toPromise();
  if (!data) {
    if (error) {
      throw error;
    }

    return [];
  }

  return data.bids;
};
