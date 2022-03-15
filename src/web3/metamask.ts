import { utils } from 'ethers';

import {
  DEFAULT_NETWORK,
  EXPLORER_URLS,
  NETWORK_CURRENCIES,
  NETWORK_NAMES,
  RPC_URLS,
} from './constants';

type ISwitchError = {
  code: number;
};

export const switchChainOnMetaMask = async (
  chainId: number,
): Promise<boolean> => {
  if (chainId !== DEFAULT_NETWORK) return false;

  const { name, symbol } = NETWORK_CURRENCIES[chainId] || {};
  const networkName = NETWORK_NAMES[chainId];
  const rpcUrl = RPC_URLS[chainId];
  const explorerUrl = EXPLORER_URLS[chainId];

  if (
    !(name && symbol && networkName && rpcUrl && explorerUrl && window.ethereum)
  )
    return false;

  try {
    await window.ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [
        {
          chainId: utils.hexValue(chainId),
        },
      ],
    });
    return true;
  } catch (switchError) {
    // This error code indicates that the chain has not been added to MetaMask.
    if ((switchError as ISwitchError).code === 4902) {
      try {
        await window.ethereum.request({
          method: 'wallet_addEthereumChain',
          params: [
            {
              chainId: utils.hexValue(chainId),
              chainName: networkName,
              nativeCurrency: {
                name,
                symbol,
                decimals: 18,
              },
              rpcUrls: [rpcUrl],
              blockExplorerUrls: [explorerUrl],
            },
          ],
        });
        return true;
      } catch (addError) {
        // eslint-disable-next-line no-console
        console.error('Unable to add chain to metamask', addError);
      }
    } else {
      // eslint-disable-next-line no-console
      console.error('Unable to switch to chain on metamask', switchError);
    }
  }
  return false;
};
