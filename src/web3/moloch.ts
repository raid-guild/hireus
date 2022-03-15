import abi from 'abi/MOLOCH_ABI.json';
import { BigNumber, Contract, providers } from 'ethers';

export const getShares = async (
  ethersProvider: providers.Web3Provider,
  contractAddress: string,
  accountAddress: string,
): Promise<string> => {
  if (!(ethersProvider && contractAddress && accountAddress)) {
    throw new Error('Could not validate shares input params');
  }
  const molochContract = new Contract(contractAddress, abi, ethersProvider);

  try {
    const members = await molochContract.members(accountAddress);
    const shares = members['1'] || BigNumber.from(0);
    return shares.toString();
  } catch (e) {
    return '0';
  }
};
