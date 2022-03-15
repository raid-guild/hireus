import { constants, Contract, providers, utils } from 'ethers';

export const onApprove = async (
  ethersProvider: providers.Web3Provider,
  contractAddress: string,
  spenderAddress: string,
  amount?: string,
): Promise<providers.TransactionResponse> => {
  if (!(ethersProvider && contractAddress && spenderAddress)) {
    throw new Error('Could not validate balance input params');
  }

  const abi = new utils.Interface(['function approve(address, uint256)']);
  const tokenContract = new Contract(
    contractAddress,
    abi,
    ethersProvider.getSigner(),
  );
  return tokenContract.approve(spenderAddress, amount || constants.MaxUint256);
};
