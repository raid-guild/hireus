import { Client, createClient, dedupExchange, fetchExchange } from 'urql';
import { MOLOCH_SUBGRAPH_URL, SUBGRAPH_URL } from 'web3/constants';

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

export const MOLOCH_CLIENT = createClient({
  url: MOLOCH_SUBGRAPH_URL,
  exchanges: [dedupExchange, fetchExchange],
});
