import { Client, createClient, dedupExchange, fetchExchange } from 'urql';
import { SUBGRAPH_URL } from 'web3/constants';

type GraphQLClients = {
  [chainId: number]: Client;
};

export const CLIENTS: GraphQLClients = Object.entries(SUBGRAPH_URL).reduce(
  (o, [chainId, url]) => ({
    ...o,
    [chainId]: createClient({
      url,
      exchanges: [dedupExchange, fetchExchange],
    }),
  }),
  {},
);
