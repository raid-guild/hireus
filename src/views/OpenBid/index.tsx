import { Box, Flex } from '@chakra-ui/react';
import { ReactComponent as XDaiSvg } from 'assets/xdai.svg';
import ConfirmCancel from 'components/ConfirmCancel';
import Snackbar from 'components/Snackbar';
import { useWallet } from 'contexts/WalletContext';
import { BigNumber, utils } from 'ethers';
import { useAllowance } from 'hooks/useAllowance';
import { useBalance } from 'hooks/useBalance';
import { useMembership } from 'hooks/useMembership';
import { useRefresh } from 'hooks/useRefresh';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import {
  StyledBodyText,
  StyledBountyRow,
  StyledCard,
  StyledNumberText,
  StyledPrimaryHeading,
} from 'themes/styled';
import { shortenAddress } from 'utils';
import type { ICombinedBid } from 'utils/types';
import {
  BLOCK_EXPLORER_URL,
  DEFAULT_NETWORK,
  LOCKUP_PERIOD,
  MIN_NUMBER_OF_SHARES,
  QUEUE_CONTRACT_ADDRESS,
  RAID_CONTRACT_ADDRESS,
} from 'web3/constants';
import { acceptBid, cancelBid } from 'web3/queue';

import ConsultationRequestCard from './ConsultationRequestCard';
import DepositWithdrawCard from './DepositWithdrawCard';

type ICauseParams = {
  id: string;
};

const OpenBid: React.FC = () => {
  const { id } = useParams<ICauseParams>();
  const { address, bids, chainId, fetchBids, provider } = useWallet();
  const { shares, isLoadingShares } = useMembership();
  const [refreshCount, refresh] = useRefresh();
  const { balance } = useBalance(
    RAID_CONTRACT_ADDRESS[chainId || DEFAULT_NETWORK],
    refreshCount,
  );
  const allowance = useAllowance(
    QUEUE_CONTRACT_ADDRESS[chainId || DEFAULT_NETWORK],
    RAID_CONTRACT_ADDRESS[chainId || DEFAULT_NETWORK],
    refreshCount,
  );

  const [consultationDetails, setConsultationDetails] =
    useState<ICombinedBid | null>(null);

  const [isAccepting, setIsAccepting] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);

  const [lockupEnded, setLockupEnded] = useState(false);
  const [lockTime, setLockTime] = useState('');
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [txConfirmed, setTxConfirmed] = useState(false);
  const [hash, setHash] = useState('');
  const [txFailed, setTxFailed] = useState(false);

  const [windowWidth, setWindowWidth] = useState(0);

  useEffect(() => {
    setWindowWidth(window.innerWidth);
    window.addEventListener('resize', e => {
      setWindowWidth(window.innerWidth);
    });
    return () => {
      window.removeEventListener('resize', () => null);
    };
  }, []);

  useEffect(() => {
    if (bids.length === 0) {
      fetchBids();
    }
    // Check only once on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!(bids.length !== 0 && consultationDetails && chainId)) return;
    const dateNow = Date.now();
    const lockupEnds =
      Number(consultationDetails.bidCreated) * 1000 + LOCKUP_PERIOD[chainId];
    if (dateNow > lockupEnds) {
      setLockupEnded(true);
    } else {
      setLockupEnded(false);
    }
  }, [bids.length, chainId, consultationDetails]);

  useEffect(() => {
    if (!consultationDetails) return;
    const dateNow = Date.now();
    const lockupEnds =
      Number(consultationDetails.bidCreated) * 1000 +
      LOCKUP_PERIOD[chainId || DEFAULT_NETWORK];
    const timeRemaining = lockupEnds - dateNow;
    if (timeRemaining > 0) {
      const days = Math.floor(timeRemaining / (1000 * 60 * 60 * 24));
      const remainingSeconds = Math.floor(
        timeRemaining % (1000 * 60 * 60 * 24),
      );
      const hours = Math.floor(remainingSeconds / (1000 * 60 * 60));
      if (days === 0 && hours === 0) {
        setLockTime(`$RAID locked for < 1 hour`);
      } else {
        setLockTime(`$RAID locked for ${days} days, ${hours} hours`);
      }
    } else {
      setLockTime('Bid can be withdrawn or canceled');
    }
  }, [chainId, consultationDetails]);

  useEffect(() => {
    if (bids.length > 0) {
      const consultationDetails = bids.filter(consultation => {
        return (
          consultation.submission_hash === id ||
          consultation.consultation_hash === id
        );
      });
      setConsultationDetails(consultationDetails[0]);
    }
  }, [address, bids, id]);

  const onAccept = useCallback(async () => {
    if (
      !(
        chainId &&
        consultationDetails &&
        consultationDetails.bid_id &&
        provider
      )
    )
      return;
    setIsAccepting(true);
    setHash('');
    setTxConfirmed(false);
    setShowSnackbar(true);
    try {
      const tx = await acceptBid(
        provider,
        QUEUE_CONTRACT_ADDRESS[chainId],
        consultationDetails.bid_id,
      );
      if (!tx) {
        toast.error('Transaction failed');
        setTxFailed(false);
        setIsAccepting(false);
        return;
      }
      setHash(tx.hash);
      const { status } = await tx.wait(2);
      if (status === 1) {
        toast.success('Bid successfully accepted');
        setTxConfirmed(true);
        fetchBids();
        setIsAccepting(false);
      } else {
        setTxFailed(false);
        setIsAccepting(false);
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error);
      toast.error('Error accepting bid');
      setIsAccepting(false);
    }
  }, [
    chainId,
    consultationDetails,
    fetchBids,
    provider,
    setHash,
    setShowSnackbar,
    setTxConfirmed,
    setTxFailed,
  ]);

  const onCancel = useCallback(async () => {
    if (
      !(
        chainId &&
        consultationDetails &&
        consultationDetails.bid_id &&
        provider
      )
    )
      return;
    setIsCancelling(true);
    setHash('');
    setTxConfirmed(false);
    setShowSnackbar(true);
    try {
      const tx = await cancelBid(
        provider,
        QUEUE_CONTRACT_ADDRESS[chainId],
        consultationDetails.bid_id,
      );
      if (!tx) {
        toast.error('Transaction failed');
        setTxFailed(false);
        setIsCancelling(false);
        return;
      }
      setHash(tx.hash);
      const { status } = await tx.wait(2);
      if (status === 1) {
        toast.success('Bid successfully cancelled');
        setTxConfirmed(true);
        fetchBids();
        setIsCancelling(false);
      } else {
        setTxFailed(false);
        setIsCancelling(false);
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error);
      toast.error('Error cancelling bid');
      setIsCancelling(false);
    }
  }, [
    chainId,
    consultationDetails,
    fetchBids,
    provider,
    setHash,
    setShowSnackbar,
    setTxConfirmed,
    setTxFailed,
  ]);

  const showProjectName = useMemo(() => {
    if (!(address && consultationDetails && chainId)) return false;
    if (
      consultationDetails.from === address ||
      consultationDetails.submitter === address ||
      BigNumber.from(shares).gte(BigNumber.from(MIN_NUMBER_OF_SHARES[chainId]))
    ) {
      return true;
    } else {
      return false;
    }
  }, [address, consultationDetails, chainId, shares]);

  return (
    <Box
      mb={'60px'}
      mt={showProjectName ? '0px' : '60px'}
      px={{ base: '10px', md: '20px', lg: '50px' }}
      w="100%"
    >
      {consultationDetails && showProjectName && (
        <StyledPrimaryHeading
          textAlign={'left'}
          fontSize={{ base: '1.5rem', lg: '36px' }}
          my={'40px'}
        >
          {consultationDetails.project_name}
        </StyledPrimaryHeading>
      )}
      <Flex direction={{ base: 'column', lg: 'row' }} justify={'space-between'}>
        <Box w={{ base: '100%', lg: '49%' }}>
          <Flex direction={'column'}>
            <ConsultationRequestCard
              address={address || ''}
              chainId={chainId || DEFAULT_NETWORK}
              consultationDetails={consultationDetails}
              isAccepting={isAccepting}
              isCancelling={isCancelling}
              isLoadingShares={isLoadingShares}
              lockTime={lockTime}
              lockupEnded={lockupEnded}
              onAccept={onAccept}
              openCancelModal={() => setShowCancelModal(true)}
              shares={shares}
            />
            {address && consultationDetails && (
              <DepositWithdrawCard
                address={address}
                allowance={allowance}
                balance={balance}
                consultationDetails={consultationDetails}
                fetchBids={fetchBids}
                lockTime={lockTime}
                lockupEnded={lockupEnded}
                refresh={refresh}
                setHash={setHash}
                setShowSnackbar={setShowSnackbar}
                setTxConfirmed={setTxConfirmed}
                setTxFailed={setTxFailed}
              />
            )}
          </Flex>
        </Box>
        <StyledCard minH={'400px'} p={'32px'} w={{ base: '100%', lg: '49%' }}>
          {consultationDetails?.bid_id ? (
            <Flex>
              <StyledBodyText fontSize={'20px'}>Bid History:</StyledBodyText>
            </Flex>
          ) : (
            <StyledBodyText>
              No bid has been submitted for this consultation.{' '}
              {!address && 'Connect wallet to submit a bid.'}
            </StyledBodyText>
          )}
          {consultationDetails && consultationDetails.changes?.length > 0 && (
            <Flex direction={'column'} mt={'20px'}>
              {consultationDetails?.changes.map((change, index) => (
                <Flex w={'100%'} key={index}>
                  <a
                    href={`${
                      BLOCK_EXPLORER_URL[chainId || DEFAULT_NETWORK]
                    }tx/${change.txHash}`}
                    target={'_blank'}
                    rel={'noopener noreferrer'}
                    style={{ width: '100%' }}
                  >
                    <StyledBountyRow
                      direction={{ base: 'column', sm: 'row' }}
                      justify={'space-between'}
                      secondary={index % 2 !== 0 ? 1 : 0}
                      p={{ base: '4px', md: '10px' }}
                    >
                      <Flex>
                        <Box mr={'16px'}>
                          <XDaiSvg />
                        </Box>
                        <StyledNumberText>
                          {new Date(
                            Number(change.changedAt) * 1000,
                          ).toLocaleDateString()}
                        </StyledNumberText>
                      </Flex>
                      <Flex justify={'space-between'} gap={'16px'}>
                        <StyledNumberText
                          fontSize={{ base: '14px', sm: '16px' }}
                        >
                          {windowWidth > 1800
                            ? change.increasedBy ||
                              consultationDetails.submitter
                            : shortenAddress(
                                change.increasedBy ||
                                  consultationDetails.submitter,
                                4,
                              )}
                        </StyledNumberText>
                        <StyledNumberText
                          color={change.withdrawnAt ? 'red' : 'green'}
                        >
                          {change.withdrawnAt ? '-' : '+'}
                          {utils.formatEther(change.amount)} $RAID
                        </StyledNumberText>
                      </Flex>
                    </StyledBountyRow>
                  </a>
                </Flex>
              ))}
            </Flex>
          )}
        </StyledCard>
      </Flex>
      {showSnackbar && hash !== '' && (
        <Snackbar
          chainId={chainId || DEFAULT_NETWORK}
          setShowSnackbar={setShowSnackbar}
          message={
            txConfirmed
              ? txFailed
                ? 'Transaction Failed'
                : 'Transaction Confirmed!'
              : 'Transaction Pending...'
          }
          hash={hash}
        />
      )}
      {consultationDetails && (
        <ConfirmCancel
          onCancel={onCancel}
          isCancelling={isCancelling}
          isOpen={showCancelModal}
          onClose={() => setShowCancelModal(false)}
        />
      )}
    </Box>
  );
};

export default OpenBid;
