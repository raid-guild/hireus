import { Contract, providers, utils } from 'ethers';

export const getBalance = async (
  ethersProvider: providers.Web3Provider,
  contractAddress: string,
  accountAddress: string,
): Promise<string> => {
  if (!(ethersProvider && contractAddress && accountAddress)) {
    throw new Error('Could not validate balance input params');
  }
  const abi = new utils.Interface([
    'function balanceOf(address) view returns (uint256)',
  ]);
  const tokenContract = new Contract(contractAddress, abi, ethersProvider);

  try {
    const balance = await tokenContract.balanceOf(accountAddress);
    return balance.toString();
  } catch (e) {
    return '0';
  }
};
