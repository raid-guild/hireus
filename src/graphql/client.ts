import jwt from 'jsonwebtoken';
import { Client, createClient, dedupExchange, fetchExchange } from 'urql';
import {
  DUNGEON_MASTER_API_URL,
  MOLOCH_SUBGRAPH_URL,
  SUBGRAPH_URL,
} from 'web3/constants';

const EXPIRATION_TIME = '150000'; // 150 seconds

const TEMP_TOKEN = () =>
  jwt.sign({ test: 'test' }, process.env.REACT_APP_JWT_SECRET || 'nosecret', {
    expiresIn: EXPIRATION_TIME,
  });

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

export const DUNGEON_MASTER_CLIENT = createClient({
  url: `${DUNGEON_MASTER_API_URL}/graphql`,
  fetchOptions: {
    headers: {
      Authorization: `Bearer ${TEMP_TOKEN()}`,
    },
  },
  exchanges: [dedupExchange, fetchExchange],
});
