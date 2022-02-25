import abi from 'abi/QUEUE_ABI.json';
import { Contract, providers } from 'ethers';

export const submitBid = async (
  ethersProvider: providers.Web3Provider,
  contractAddress: string,
  // in wei format
  depositAmount: string,
  hexDetails: string,
): Promise<providers.TransactionResponse> => {
  if (!(ethersProvider && contractAddress && depositAmount && hexDetails)) {
    throw new Error('Could not validate bid input params');
  }
  const queueContract = new Contract(
    contractAddress,
    abi,
    ethersProvider.getSigner(),
  );

  return await queueContract.submitBid(depositAmount, hexDetails);
};
