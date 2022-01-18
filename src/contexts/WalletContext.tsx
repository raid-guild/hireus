import { SafeAppWeb3Modal as Web3Modal } from '@gnosis.pm/safe-apps-web3modal';
import { providers } from 'ethers';
import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';
import { toast } from 'react-toastify';
import { DEFAULT_NETWORK, NETWORK_NAMES } from 'web3/constants';
import { switchChainOnMetaMask } from 'web3/metamask';
import { providerOptions } from 'web3/providerOptions';

const web3Modal = new Web3Modal({
  cacheProvider: true,
  providerOptions,
  theme: 'dark',
});

export type WalletContextType = {
  provider: providers.Web3Provider | null | undefined;
  chainId: number | null | undefined;
  address: string | null | undefined;
  connectWallet: () => Promise<void>;
  disconnect: () => void;
  isConnecting: boolean;
  isConnected: boolean;
  isMetamask: boolean;
  isGnosisSafe: boolean;
};

export const WalletContext = createContext<WalletContextType>({
  provider: null,
  chainId: null,
  address: null,
  connectWallet: async () => {
    return;
  },
  disconnect: () => undefined,
  isConnecting: true,
  isConnected: false,
  isGnosisSafe: false,
  isMetamask: false,
});

type WalletStateType = {
  provider?: providers.Web3Provider | null;
  chainId?: number | null;
  address?: string | null;
};

const isMetamaskProvider = (
  provider: providers.Web3Provider | null | undefined,
) => provider?.connection?.url === 'metamask';

export const WalletProvider: React.FC = ({ children }) => {
  const [{ provider, chainId, address }, setWalletState] =
    useState<WalletStateType>({});
  const [isGnosisSafe, setIsGnosisSafe] = useState(false);

  const isConnected: boolean = useMemo(
    () => !!provider && !!address && !!chainId,
    [provider, address, chainId],
  );

  const [isConnecting, setConnecting] = useState<boolean>(true);
  const isMetamask = useMemo(() => isMetamaskProvider(provider), [provider]);

  const disconnect = useCallback(async () => {
    web3Modal.clearCachedProvider();
    setWalletState({});
    setIsGnosisSafe(false);
    window.localStorage.clear();
    window.sessionStorage.clear();
  }, []);

  const setWalletProvider = useCallback(async (prov, isSafe) => {
    const ethersProvider = new providers.Web3Provider(prov);

    let network = Number(prov.chainId);
    if (network !== DEFAULT_NETWORK) {
      const success = isMetamaskProvider(ethersProvider)
        ? await switchChainOnMetaMask(DEFAULT_NETWORK)
        : false;
      if (!success) {
        const errorMsg = `Network not supported, please switch to ${NETWORK_NAMES[DEFAULT_NETWORK]}`;
        toast.error(errorMsg);
        throw new Error(errorMsg);
      }
      network = DEFAULT_NETWORK;
      window.location.reload();
    }

    const signerAddress = await ethersProvider.getSigner().getAddress();
    setWalletState({
      provider: ethersProvider,
      chainId: network,
      address: signerAddress.toLowerCase(),
    });
  }, []);

  const connectWallet = useCallback(async () => {
    try {
      setConnecting(true);

      const modalProvider = await web3Modal.requestProvider();

      const gnosisSafe = await web3Modal.isSafeApp();
      setIsGnosisSafe(gnosisSafe);

      await setWalletProvider(modalProvider, gnosisSafe);

      if (!gnosisSafe) {
        modalProvider.on('accountsChanged', () => {
          disconnect();
          window.location.reload();
        });
        modalProvider.on('chainChanged', () => {
          disconnect();
          window.location.reload();
        });
      }
    } catch (web3Error) {
      // eslint-disable-next-line no-console
      console.error(web3Error);
      disconnect();
    } finally {
      setConnecting(false);
    }
  }, [setWalletProvider, disconnect]);

  // useEffect(() => {
  //   const load = async () => {
  //     if ((await web3Modal.isSafeApp()) || web3Modal.cachedProvider) {
  //       await connectWallet();
  //     } else {
  //       setConnecting(false);
  //     }
  //   };
  //   load();
  // }, [connectWallet]);

  return (
    <WalletContext.Provider
      value={{
        provider,
        address,
        chainId,
        isGnosisSafe,
        connectWallet,
        isConnected,
        isConnecting,
        disconnect,
        isMetamask,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};

export const useWallet = (): WalletContextType => useContext(WalletContext);
