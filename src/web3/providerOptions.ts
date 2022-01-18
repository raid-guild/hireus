import WalletConnectProvider from '@walletconnect/web3-provider';
import { WalletLink } from 'walletlink';
import { IProviderOptions } from 'web3modal';

import CoinbaseLogo from './images/coinbase-wallet.svg';

interface ConnectorOptions {
  appName: string;
  networkUrl: string;
  chainId: number;
}

export const providerOptions: IProviderOptions = {
  walletconnect: {
    package: WalletConnectProvider,
    options: {
      rpc: {
        1: process.env.REACT_APP_MAINNET_RPC,
        4: process.env.REACT_APP_RINKEBY_RPC,
      },
    },
  },
  'custom-walletlink': {
    display: {
      logo: CoinbaseLogo,
      name: 'Coinbase',
      description: 'Scan with Coinbase wallet to connect',
    },
    options: {
      appName: 'Rigor',
    },
    package: WalletLink,
    connector: async (
      PackageObject: typeof WalletLink,
      options: ConnectorOptions,
    ) => {
      const { appName } = options;
      const walletLink = new PackageObject({
        appName,
      });
      // @ts-expect-error invalid types cannot assign {} to 'string'
      const provider = walletLink.makeWeb3Provider({}, 0);
      await provider.enable();
      return provider;
    },
  },
};
