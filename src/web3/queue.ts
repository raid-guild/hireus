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

export const increaseBid = async (
  ethersProvider: providers.Web3Provider,
  contractAddress: string,
  // in wei format
  depositAmount: string,
  bidId: string,
): Promise<providers.TransactionResponse> => {
  if (!(ethersProvider && contractAddress && depositAmount && bidId)) {
    throw new Error('Could not validate bid input params');
  }
  const queueContract = new Contract(
    contractAddress,
    abi,
    ethersProvider.getSigner(),
  );

  return await queueContract.increaseBid(depositAmount, bidId);
};

export const withdrawBid = async (
  ethersProvider: providers.Web3Provider,
  contractAddress: string,
  // in wei format
  withdrawalAmount: string,
  bidId: string,
): Promise<providers.TransactionResponse> => {
  if (!(ethersProvider && contractAddress && withdrawalAmount && bidId)) {
    throw new Error('Could not validate bid input params');
  }
  const queueContract = new Contract(
    contractAddress,
    abi,
    ethersProvider.getSigner(),
  );

  return await queueContract.withdrawBid(withdrawalAmount, bidId);
};

export const cancelBid = async (
  ethersProvider: providers.Web3Provider,
  contractAddress: string,
  bidId: string,
): Promise<providers.TransactionResponse> => {
  if (!(ethersProvider && contractAddress && bidId)) {
    throw new Error('Could not validate bid input params');
  }
  const queueContract = new Contract(
    contractAddress,
    abi,
    ethersProvider.getSigner(),
  );

  return await queueContract.cancelBid(bidId);
};

export const acceptBid = async (
  ethersProvider: providers.Web3Provider,
  contractAddress: string,
  bidId: string,
): Promise<providers.TransactionResponse> => {
  if (!(ethersProvider && contractAddress && bidId)) {
    throw new Error('Could not validate bid input params');
  }
  const queueContract = new Contract(
    contractAddress,
    abi,
    ethersProvider.getSigner(),
  );

  return await queueContract.acceptBid(bidId);
};
