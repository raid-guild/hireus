import ethIcon from 'assets/eth.png';
import xdaiIcon from 'assets/xdai.png';

import { Token } from './types';

const {
  REACT_APP_RINKEBY_RPC: RINKEBY_RPC,
  REACT_APP_XDAI_RPC: XDAI_RPC,
  REACT_APP_DEFAULT_NETWORK,
} = process.env;

type StringInfo = {
  [chainId: number]: string;
};

type CurrencyInfo = {
  [chainId: number]: Token;
};

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
