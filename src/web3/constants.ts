import ethIcon from 'assets/eth.png';
import xdaiIcon from 'assets/xdai.png';

import { Token } from './types';

const {
  REACT_APP_RINKEBY_RPC: RINKEBY_RPC,
  REACT_APP_XDAI_RPC: XDAI_RPC,
  REACT_APP_DEFAULT_NETWORK,
  REACT_APP_HIREUS_BASE_ENDPOINT,
} = process.env;

type StringInfo = {
  [chainId: number]: string;
};

type NumberInfo = {
  [chainId: number]: number;
};

type CurrencyInfo = {
  [chainId: number]: Token;
};

export const LOCKUP_PERIOD: NumberInfo = {
  4: 120000,
  100: 7 * 24 * 60 * 60 * 1000, // 7 days
};
export const RAID_CONTRACT_ADDRESS: StringInfo = {
  4: '0x662FDEB6A9421fAab224DA88AF75E6D8830CF3a2',
  100: '0x18e9262e68cc6c6004db93105cc7c001bb103e49',
};
export const QUEUE_CONTRACT_ADDRESS: StringInfo = {
  4: '0x6FE12999D11e02423fb57Cc75566BCDd4EB98DD2',
  100: '0xD880b00877726c2B76173aCEc061b29C27D5d791',
};
export const DAO_ADDRESS: StringInfo = {
  4: '0x26ff888b86d18793fb1420f2a4108c19bfc65a6e',
  100: '0xfe1084bc16427e5eb7f13fc19bcd4e641f7d571f',
};
export const MIN_NUMBER_OF_SHARES: StringInfo = { 4: '1', 100: '100' };
export const SUBGRAPH_URL: StringInfo = {
  4: 'https://api.thegraph.com/subgraphs/name/slgraham/guildauctionqueues-rinkeby',
  100: 'https://api.thegraph.com/subgraphs/name/slgraham/guildauctionqueues-xdai',
};
export const BLOCK_EXPLORER_URL: StringInfo = {
  4: 'https://rinkeby.etherscan.io/',
  100: 'https://blockscout.com/xdai/mainnet/',
};
export const GUILD_KEEPER_ENDPOINT = `${REACT_APP_HIREUS_BASE_ENDPOINT}/awaiting-raids`;

export const NETWORK_CURRENCIES: CurrencyInfo = {
  4: {
    name: 'Ethereum',
    symbol: 'ETH',
    decimals: 18,
    address: '',
    iconUri: ethIcon,
  },
  100: {
    name: 'xDai',
    symbol: 'xDai',
    decimals: 18,
    address: '',
    iconUri: xdaiIcon,
  },
};

export const DEFAULT_NETWORK = Number(REACT_APP_DEFAULT_NETWORK || 4);

export const NETWORK_NAMES: StringInfo = {
  4: 'https://rinkeby.etherscan.io',
  100: 'xDai Chain',
};

export const EXPLORER_URLS: StringInfo = {
  4: 'https://rinkeby.etherscan.io',
  100: 'https://blockscout.com/xdai/mainnet',
};

export const RPC_URLS: StringInfo = {
  4: RINKEBY_RPC || 'https://rinkeby-light.eth.linkpool.io',
  100: XDAI_RPC || 'https://rpc.xdaichain.com',
};
