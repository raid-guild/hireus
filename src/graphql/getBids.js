import gql from 'fake-tag';
import { CLIENT } from './client';

const bidsQuery = gql`
  query {
    bids(first: 100, where: {queue: "0xD880b00877726c2B76173aCEc061b29C27D5d791"}) {
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

export const getBids = async () => {
  const { data, error } = await CLIENT.query(bidsQuery).toPromise();
  if (!data) {
    if (error) {
      throw error;
    }

    return [];
  }

  return data.bids;
};
