import { Client } from 'urql';
import gql from 'graphql-tag';

export const LOCKUP_PERIOD = 600000;
export const RAID_CONTRACT_ADDRESS = '0x982e00b16c313e979c0947b85230907fce45d50e';
export const QUEUE_CONTRACT_ADDRESS = '0x3a9F3147742E51EFBa1F04ff26E8DC95978dccB4';
export const DAO_ADDRESS = '0xE189A9C5AcFD2e53C4663150b2703b9fFAd224ff';

export const graphqlClient = new Client({ url: 'https://api.thegraph.com/subgraphs/name/slgraham/guildauctionqueues-rinkeby' ?? '' });
export const BIDS_QUERY = gql`
  query {
    bids(first: 100) {
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