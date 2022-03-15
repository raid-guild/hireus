import { Contract, providers, utils } from 'ethers';

export const getAllowance = async (
  ethersProvider: providers.Web3Provider,
  contractAddress: string,
  accountAddress: string,
  spenderAddress: string,
): Promise<string> => {
  if (
    !(ethersProvider && contractAddress && accountAddress && spenderAddress)
  ) {
    throw new Error('Could not validate balance input params');
  }

  const abi = new utils.Interface([
    'function allowance(address, address) view returns (uint256)',
  ]);
  const tokenContract = new Contract(contractAddress, abi, ethersProvider);

  try {
    const allowance = await tokenContract.allowance(
      accountAddress,
      spenderAddress,
    );
    return allowance.toString();
  } catch (e) {
    return '0';
  }
};
