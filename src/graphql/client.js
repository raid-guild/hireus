import { createClient, dedupExchange, fetchExchange } from 'urql';
import { SUBGRAPH_URL } from '../constants';

export const CLIENT = createClient({
  url: SUBGRAPH_URL ?? '',
  exchanges: [dedupExchange, fetchExchange],
});