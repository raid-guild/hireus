import { Client } from 'urql';

export const CLIENT = new Client({ url: 'https://api.thegraph.com/subgraphs/name/slgraham/guildauctionqueues-rinkeby' ?? '' });
