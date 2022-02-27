import { Box, Flex } from '@chakra-ui/react';
import { ReactComponent as XDaiSvg } from 'assets/xdai.svg';
// import ConfirmCancel from 'components/ConfirmCancel';
import Snackbar from 'components/Snackbar';
import { useWallet } from 'contexts/WalletContext';
import { BigNumber } from 'ethers';
import { useMembership } from 'hooks/useMembership';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  StyledBodyText,
  StyledBountyRow,
  StyledCard,
  StyledNumberText,
  StyledPrimaryHeading,
} from 'themes/styled';
import { shortenAddress } from 'utils';
import type { ICombinedBid } from 'utils/types';
import web3 from 'web3';
import {
  BLOCK_EXPLORER_URL,
  DEFAULT_NETWORK,
  LOCKUP_PERIOD,
  MIN_NUMBER_OF_SHARES,
} from 'web3/constants';

import ConsultationRequestCard from './ConsultationRequestCard';
import DepositWithdrawCard from './DepositWithdrawCard';

type ICauseParams = {
  id: string;
};

const OpenBid: React.FC = () => {
  const { id } = useParams<ICauseParams>();
  const { address, bids, chainId, fetchBids } = useWallet();
  const { shares, isLoadingShares } = useMembership();

  const [consultationDetails, setConsultationDetails] =
    useState<ICombinedBid | null>(null);

  const [isAccepting] = useState(false);
  const [isCancelling] = useState(false);

  const [lockupEnded, setLockupEnded] = useState(false);
  const [lockTime, setLockTime] = useState('');
  const [, setShowCancelModal] = useState(false);
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [txConfirmed, setTxConfirmed] = useState(false);
  const [hash, setHash] = useState('');
  const [txFailed, setTxFailed] = useState(false);

  useEffect(() => {
    if (bids.length === 0) {
      fetchBids();
    }
  }, [bids, fetchBids]);

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
        return consultation.consultation_hash === id;
      });
      setConsultationDetails(consultationDetails[0]);
    }
  }, [address, bids, id]);

  const onAccept = useCallback(async (id: string) => {
    // setTxConfirmed(false);
    // setShowSnackbar(true);
    // await onAccept(id);
    // setTxConfirmed(true);
    // refresh();
    // eslint-disable-next-line no-console
    console.log('Accept: ', id);
  }, []);

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
      <Flex justify={'space-between'}>
        <Box w={'49%'}>
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
                setHash={setHash}
                setShowSnackbar={setShowSnackbar}
                setTxConfirmed={setTxConfirmed}
                setTxFailed={setTxFailed}
                consultationDetails={consultationDetails}
                lockTime={lockTime}
                lockupEnded={lockupEnded}
                fetchBids={fetchBids}
              />
            )}
          </Flex>
        </Box>
        <StyledCard minH={'400px'} p={'32px'} width={'49%'}>
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
                      <StyledNumberText>
                        {shortenAddress(
                          change.increasedBy || consultationDetails.submitter,
                          8,
                        )}
                      </StyledNumberText>
                      <StyledNumberText
                        color={change.withdrawnAt ? 'red' : 'green'}
                      >
                        {change.withdrawnAt ? '-' : '+'}
                        {web3.utils.fromWei(change.amount)} $RAID
                      </StyledNumberText>
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
      {/* {consultationDetails && (
        <ConfirmCancel
          consultationDetails={consultationDetails}
          refresh={refresh}
          setTxConfirmed={setTxConfirmed}
          setShowSnackbar={setShowSnackbar}
        />
      )} */}
    </Box>
  );
};

export default OpenBid;
