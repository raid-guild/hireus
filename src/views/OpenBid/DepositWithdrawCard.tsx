import { Box, Flex, Spinner } from '@chakra-ui/react';
import { useWallet } from 'contexts/WalletContext';
import { BigNumber, utils } from 'ethers';
import { useAllowance } from 'hooks/useAllowance';
import { useBalance } from 'hooks/useBalance';
import { useRefresh } from 'hooks/useRefresh';
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
import {
  DEFAULT_NETWORK,
  QUEUE_CONTRACT_ADDRESS,
  RAID_CONTRACT_ADDRESS,
} from 'web3/constants';

type DepositWithdrawCardProps = {
  address: string;
  setHash: React.Dispatch<React.SetStateAction<string>>;
  setShowSnackbar: React.Dispatch<React.SetStateAction<boolean>>;
  setTxConfirmed: React.Dispatch<React.SetStateAction<boolean>>;
  setTxFailed: React.Dispatch<React.SetStateAction<boolean>>;
  consultationDetails: ICombinedBid;
  lockTime: string;
  lockupEnded: boolean;
  fetchBids: () => void;
};

const DepositWithdrawCared: React.FC<DepositWithdrawCardProps> = ({
  address,
  setHash,
  setShowSnackbar,
  setTxConfirmed,
  setTxFailed,
  consultationDetails,
  lockTime,
  lockupEnded,
  fetchBids,
}) => {
  const { chainId, provider } = useWallet();
  const [refreshCount, refresh] = useRefresh();
  const allowance = useAllowance(
    QUEUE_CONTRACT_ADDRESS[chainId || DEFAULT_NETWORK],
    RAID_CONTRACT_ADDRESS[chainId || DEFAULT_NETWORK],
    refreshCount,
  );
  const { balance } = useBalance(
    RAID_CONTRACT_ADDRESS[chainId || DEFAULT_NETWORK],
    refreshCount,
  );

  const [depositAmount, setDepositAmount] = useState('');
  const [withdrawAmount, setWithdrawAmount] = useState('');

  const [isApproving, setIsApproving] = useState(false);
  const [isDepositing] = useState(false);
  const [isWithdrawing] = useState(false);

  const isApproved = useMemo(() => {
    if (!depositAmount) return false;
    return utils.parseEther(depositAmount).lte(BigNumber.from(allowance));
  }, [allowance, depositAmount]);

  const onDepositAndUpdate = async (id: string) => {
    setTxConfirmed(false);
    setShowSnackbar(true);
    if (consultationDetails.bid_id) {
      // await onIncreaseBid(id);
    } else {
      // await onDeposit(id);
    }
    setTxConfirmed(true);
    fetchBids();
  };

  const onApproveRaid = useCallback(async () => {
    if (!(provider && chainId)) return;
    setIsApproving(true);
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
        setTxConfirmed(true);
        refresh();
        setIsApproving(false);
      } else {
        setTxFailed(false);
        setIsApproving(false);
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log(error);
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

  const onWithdrawAndupdate = async (id: string) => {
    setTxConfirmed(false);
    setShowSnackbar(true);
    // await onWithdraw(id);
    setTxConfirmed(true);
    refresh();
  };

  const insufficientBalance = useMemo(() => false, []);

  // const insufficientBalance = useMemo(() => {
  //   if (!(depositAmount && raidBalance)) return false;
  //   try {
  //     return (
  //       BigInt(utils.parseEther(depositAmount || '0').toString()) >
  //       BigInt(utils.parseEther(raidBalance).toString())
  //     );
  //   } catch (e) {
  //     return false;
  //   }
  // }, [raidBalance, depositAmount]);

  return (
    <StyledCard p={'32px'}>
      <Flex justify={'space-between'}>
        <Flex direction={'column'} justify={'space-between'} w={'48%'}>
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
            />
            <StyledPrimaryButton
              disabled={
                depositAmount === '0' ||
                depositAmount === '' ||
                insufficientBalance ||
                isDepositing
              }
              onClick={() => {
                isApproved
                  ? onDepositAndUpdate(
                      consultationDetails.bid_id
                        ? consultationDetails.bid_id
                        : consultationDetails.airtable_id,
                    )
                  : onApproveRaid();
              }}
              mt={'20px'}
              w={'100%'}
            >
              {isDepositing || isApproving ? (
                <Spinner color={'#fff'} />
              ) : isApproved ? (
                'Submit Bid'
              ) : (
                'Approve $RAID'
              )}
            </StyledPrimaryButton>
          </Box>
        </Flex>
        <Flex direction={'column'} justify={'space-between'} w={'48%'}>
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
            />
            <StyledPrimaryButton
              disabled={
                withdrawAmount === '0' ||
                withdrawAmount === '' ||
                BigInt(utils.parseEther(withdrawAmount).toString()) >
                  BigInt(consultationDetails.amount) ||
                isWithdrawing ||
                !lockupEnded
              }
              onClick={() => {
                onWithdrawAndupdate(consultationDetails.bid_id);
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
          <StyledBodyText>{lockTime}</StyledBodyText>
        )}
      </Flex>
    </StyledCard>
  );
};

export default DepositWithdrawCared;
