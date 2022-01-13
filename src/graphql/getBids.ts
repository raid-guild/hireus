import gql from 'fake-tag';
import { CLIENT } from './client';

const bidsQuery = gql`
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
