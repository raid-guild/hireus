import { Box, Flex, Spinner } from '@chakra-ui/react';
import { useWallet } from 'contexts/WalletContext';
import { BigNumber, utils } from 'ethers';
import React, { useCallback, useMemo, useState } from 'react';
import { toast } from 'react-toastify';
import {
  StyledBodyText,
  StyledCard,
  StyledInput,
  StyledNumberText,
  StyledPrimaryButton,
} from 'themes/styled';
import { round } from 'utils';
import type { ICombinedBid } from 'utils/types';
import { onApprove } from 'web3/approve';
import { QUEUE_CONTRACT_ADDRESS, RAID_CONTRACT_ADDRESS } from 'web3/constants';
import { increaseBid, submitBid, withdrawBid } from 'web3/queue';

type DepositWithdrawCardProps = {
  address: string;
  allowance: string;
  balance: string;
  consultationDetails: ICombinedBid;
  fetchBids: () => void;
  lockTime: string;
  lockupEnded: boolean;
  refresh: () => void;
  setHash: React.Dispatch<React.SetStateAction<string>>;
  setShowSnackbar: React.Dispatch<React.SetStateAction<boolean>>;
  setTxConfirmed: React.Dispatch<React.SetStateAction<boolean>>;
  setTxFailed: React.Dispatch<React.SetStateAction<boolean>>;
};

const DepositWithdrawCared: React.FC<DepositWithdrawCardProps> = ({
  address,
  allowance,
  balance,
  fetchBids,
  consultationDetails,
  lockTime,
  lockupEnded,
  refresh,
  setHash,
  setShowSnackbar,
  setTxConfirmed,
  setTxFailed,
}) => {
  const { chainId, provider } = useWallet();

  const [depositAmount, setDepositAmount] = useState('');
  const [withdrawAmount, setWithdrawAmount] = useState('');

  const [isApproving, setIsApproving] = useState(false);
  const [isSubmittingOrIncreasingBid, setIsSubmittingOrIncreasingBid] =
    useState(false);
  const [isWithdrawing, setIsWithdrawing] = useState(false);

  const isApproved = useMemo(() => {
    if (!depositAmount) return false;
    return utils.parseEther(depositAmount).lte(BigNumber.from(allowance));
  }, [allowance, depositAmount]);

  const onSubmitBid = useCallback(
    async (dbId: string) => {
      if (!(chainId && isApproved && provider)) return;
      setIsSubmittingOrIncreasingBid(true);
      setHash('');
      setTxConfirmed(false);
      setShowSnackbar(true);
      // Turning recordID into bytes is no longer necessary
      // const hex = utils.formatBytes32String(dbId);
      try {
        const tx = await submitBid(
          provider,
          QUEUE_CONTRACT_ADDRESS[chainId],
          utils.parseEther(depositAmount).toString(),
          dbId,
        );
        if (!tx) {
          toast.error('Transaction failed');
          setTxFailed(false);
          setIsSubmittingOrIncreasingBid(false);
          return;
        }
        setHash(tx.hash);
        const { status } = await tx.wait(2);
        if (status === 1) {
          toast.success('Bid successfully submitted');
          setTxConfirmed(true);
          refresh();
          fetchBids();
          setIsSubmittingOrIncreasingBid(false);
        } else {
          setTxFailed(false);
          setIsSubmittingOrIncreasingBid(false);
        }
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error(error);
        toast.error('Error submitting bid');
        setIsSubmittingOrIncreasingBid(false);
      }
    },
    [
      chainId,
      depositAmount,
      fetchBids,
      isApproved,
      provider,
      refresh,
      setHash,
      setShowSnackbar,
      setTxConfirmed,
      setTxFailed,
    ],
  );

  const onIncreaseBid = useCallback(
    async (bidId: string) => {
      if (!(chainId && isApproved && provider)) return;
      setIsSubmittingOrIncreasingBid(true);
      setHash('');
      setTxConfirmed(false);
      setShowSnackbar(true);
      try {
        const tx = await increaseBid(
          provider,
          QUEUE_CONTRACT_ADDRESS[chainId],
          utils.parseEther(depositAmount).toString(),
          bidId,
        );
        if (!tx) {
          toast.error('Transaction failed');
          setTxFailed(false);
          setIsSubmittingOrIncreasingBid(false);
          return;
        }
        setHash(tx.hash);
        const { status } = await tx.wait(2);
        if (status === 1) {
          toast.success('Bid successfully increased');
          setTxConfirmed(true);
          refresh();
          fetchBids();
          setIsSubmittingOrIncreasingBid(false);
        } else {
          setTxFailed(false);
          setIsSubmittingOrIncreasingBid(false);
        }
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error(error);
        toast.error('Error increasing bid');
        setIsSubmittingOrIncreasingBid(false);
      }
    },
    [
      chainId,
      depositAmount,
      fetchBids,
      isApproved,
      provider,
      refresh,
      setHash,
      setShowSnackbar,
      setTxConfirmed,
      setTxFailed,
    ],
  );

  const onDepositOrIncrease = useCallback(async () => {
    setTxConfirmed(false);
    setShowSnackbar(true);
    if (consultationDetails.bid_id) {
      await onIncreaseBid(consultationDetails.bid_id);
    } else {
      await onSubmitBid(consultationDetails.submission_hash);
    }
    setTxConfirmed(true);
  }, [
    consultationDetails,
    onSubmitBid,
    onIncreaseBid,
    setTxConfirmed,
    setShowSnackbar,
  ]);

  const onApproveRaid = useCallback(async () => {
    if (!(provider && chainId)) return;
    setIsApproving(true);
    setHash('');
    setTxConfirmed(false);
    setShowSnackbar(true);
    try {
      const tx = await onApprove(
        provider,
        RAID_CONTRACT_ADDRESS[chainId],
        QUEUE_CONTRACT_ADDRESS[chainId],
        utils.parseEther(depositAmount).toString(),
      );
      if (!tx) {
        toast.error('Transaction failed');
        setTxFailed(false);
        setIsApproving(false);
        return;
      }
      setHash(tx.hash);
      const { status } = await tx.wait(2);
      if (status === 1) {
        toast.success('$RAID successfully approved');
        setTxConfirmed(true);
        refresh();
        setIsApproving(false);
      } else {
        setTxFailed(false);
        setIsApproving(false);
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error);
      toast.error('Error approving $RAID');
      setIsApproving(false);
    }
  }, [
    refresh,
    chainId,
    depositAmount,
    provider,
    setHash,
    setShowSnackbar,
    setTxConfirmed,
    setTxFailed,
  ]);

  const onWithdraw = useCallback(
    async (bidId: string) => {
      if (!(chainId && provider && withdrawAmount)) return;
      setIsWithdrawing(true);
      setHash('');
      setTxConfirmed(false);
      setShowSnackbar(true);
      try {
        const tx = await withdrawBid(
          provider,
          QUEUE_CONTRACT_ADDRESS[chainId],
          utils.parseEther(withdrawAmount).toString(),
          bidId,
        );
        if (!tx) {
          toast.error('Transaction failed');
          setTxFailed(false);
          setIsWithdrawing(false);
          return;
        }
        setHash(tx.hash);
        const { status } = await tx.wait(2);
        if (status === 1) {
          toast.success('Bid successfully withdrawn');
          setTxConfirmed(true);
          refresh();
          fetchBids();
          setIsWithdrawing(false);
        } else {
          setTxFailed(false);
          setIsWithdrawing(false);
        }
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error(error);
        toast.error('Error withdrawing bid');
        setIsWithdrawing(false);
      }
    },
    [
      chainId,
      fetchBids,
      provider,
      refresh,
      setHash,
      setShowSnackbar,
      setTxConfirmed,
      setTxFailed,
      withdrawAmount,
    ],
  );

  const insufficientBalance = useMemo(() => {
    if (!(depositAmount && balance)) return false;
    try {
      return BigNumber.from(utils.parseEther(depositAmount || '0')).gt(
        BigNumber.from(balance),
      );
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error(e);
      return false;
    }
  }, [balance, depositAmount]);

  return (
    <StyledCard p={'32px'} mb={{ base: '32px', lg: '0px' }}>
      <Flex
        direction={{ base: 'column', sm: 'row' }}
        gap={{ base: '32px', sm: '0px' }}
        justify={'space-between'}
      >
        <Flex
          direction={'column'}
          justify={'space-between'}
          w={{ base: '100%', sm: '48%' }}
        >
          <Box>
            <StyledBodyText>Wallet Balance:</StyledBodyText>
            <StyledNumberText fontSize={'20px'} mb={'16px'}>
              {round(utils.formatEther(balance).toString(), 4)} $RAID
            </StyledNumberText>
          </Box>
          <Box>
            {insufficientBalance && (
              <StyledBodyText fontSize={'12px'} mb={'10px'}>
                Insufficient balance
              </StyledBodyText>
            )}
            <StyledInput
              color={'#fff'}
              id={'deposit-amount'}
              placeholder={`0`}
              type={'number'}
              min={'0'}
              step={'0.01'}
              value={depositAmount}
              onChange={e => setDepositAmount(e.target.value)}
              onWheel={() => (document?.activeElement as HTMLElement).blur()}
            />
            <StyledPrimaryButton
              disabled={
                depositAmount === '0' ||
                depositAmount === '' ||
                insufficientBalance ||
                isSubmittingOrIncreasingBid
              }
              onClick={() => {
                isApproved ? onDepositOrIncrease() : onApproveRaid();
              }}
              mt={'20px'}
              w={'100%'}
            >
              {isSubmittingOrIncreasingBid || isApproving ? (
                <Spinner color={'#fff'} />
              ) : isApproved ? (
                `${consultationDetails.bid_id ? 'Increase' : 'Submit'} Bid`
              ) : (
                'Approve $RAID'
              )}
            </StyledPrimaryButton>
          </Box>
        </Flex>
        <Flex
          direction={'column'}
          justify={'space-between'}
          w={{ base: '100%', sm: '48%' }}
        >
          <Box>
            <StyledBodyText>You deposited:</StyledBodyText>
            <StyledNumberText fontSize={'20px'} mb={'16px'}>
              {consultationDetails.submitter === address
                ? round(utils.formatEther(consultationDetails.amount), 4)
                : '0'}{' '}
              $RAID
            </StyledNumberText>
          </Box>
          <Box>
            <StyledInput
              id={'deposit-amount'}
              placeholder={`0`}
              type={'number'}
              min={'0'}
              step={'0.01'}
              value={withdrawAmount}
              onChange={e => setWithdrawAmount(e.target.value)}
              onWheel={() => (document?.activeElement as HTMLElement).blur()}
            />
            <StyledPrimaryButton
              disabled={
                withdrawAmount === '0' ||
                withdrawAmount === '' ||
                utils
                  .parseEther(withdrawAmount)
                  .gt(BigNumber.from(consultationDetails.amount)) ||
                isWithdrawing ||
                !lockupEnded
              }
              onClick={() => {
                onWithdraw(consultationDetails.bid_id);
              }}
              mt={'20px'}
              w={'100%'}
            >
              {isWithdrawing ? <Spinner color={'#fff'} /> : 'Withdraw Bid'}
            </StyledPrimaryButton>
          </Box>
        </Flex>
      </Flex>
      <Flex justify={'center'}>
        {!!consultationDetails.bid_id && !lockupEnded && (
          <StyledBodyText mt={'20px'}>{lockTime}</StyledBodyText>
        )}
      </Flex>
    </StyledCard>
  );
};

export default DepositWithdrawCared;
