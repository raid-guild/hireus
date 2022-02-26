import { Flex, Spinner } from '@chakra-ui/react';
import { ReactComponent as XDaiSvg } from 'assets/xdai.svg';
import { BigNumber, utils } from 'ethers';
import { useMembership } from 'hooks/useMembership';
import React from 'react';
import {
  StyledBodyText,
  StyledCard,
  StyledNumberText,
  StyledPrimaryButton,
} from 'themes/styled';
import { round, shortenAddress } from 'utils';
import type { ICombinedBid } from 'utils/types';
import {
  BLOCK_EXPLORER_URL,
  MIN_NUMBER_OF_SHARES,
  RAID_CONTRACT_ADDRESS,
} from 'web3/constants';

type ConsultationRequestCardProps = {
  address: string;
  chainId: number;
  consultationDetails: ICombinedBid;
  isAccepting: boolean;
  isCancelling: boolean;
  lockTime: string;
  lockupEnded: boolean;
  onAccept: (id: string) => Promise<void>;
  openCancelModal: () => void;
};

const ConsultationRequestCard: React.FC<ConsultationRequestCardProps> = ({
  address,
  chainId,
  consultationDetails,
  isAccepting,
  isCancelling,
  lockTime,
  lockupEnded,
  onAccept,
  openCancelModal,
}) => {
  const { shares, isLoadingShares } = useMembership();

  return (
    <>
      {consultationDetails.bid_id ? (
        <StyledCard p={'32px'}>
          <StyledBodyText fontSize={'20px'} mb={'20px'}>
            Consultation request:
          </StyledBodyText>
          <Flex align={'center'} mb={'12px'}>
            <StyledBodyText w={'160px'}>Submitter:</StyledBodyText>
            <StyledNumberText mr={'8px'}>
              {shortenAddress(consultationDetails.submitter)}
            </StyledNumberText>
            <a
              href={`${BLOCK_EXPLORER_URL[chainId]}address/${consultationDetails.submitter}`}
              target={'_blank'}
              rel={'noopener noreferrer'}
            >
              <XDaiSvg />
            </a>
          </Flex>
          <Flex align={'center'} mb={'12px'}>
            <StyledBodyText w={'160px'}>Submitted On:</StyledBodyText>
            <StyledNumberText mr={'8px'}>
              {new Date(
                Number(consultationDetails.bidCreated) * 1000,
              ).toLocaleString()}
            </StyledNumberText>
            <a
              href={`${BLOCK_EXPLORER_URL[chainId]}tx/${consultationDetails.createTxHash}`}
              target={'_blank'}
              rel={'noopener noreferrer'}
            >
              <XDaiSvg />
            </a>
          </Flex>
          <Flex align={'center'} mb={'12px'}>
            <StyledBodyText w={'160px'}>Status:</StyledBodyText>
            <StyledNumberText mr={'8px'}>{lockTime}</StyledNumberText>
          </Flex>
          <Flex align={'center'} mb={'12px'}>
            <StyledBodyText w={'160px'}>Total Bounty:</StyledBodyText>
            <StyledNumberText mr={'8px'}>
              {round(utils.formatEther(consultationDetails.amount), 4)} $RAID
            </StyledNumberText>
            <a
              href={`${BLOCK_EXPLORER_URL[chainId]}address/${RAID_CONTRACT_ADDRESS}`}
              target={'_blank'}
              rel={'noopener noreferrer'}
            >
              <XDaiSvg />
            </a>
          </Flex>
          {address && !isLoadingShares && (
            <Flex gap={'12px'} mt={'20px'}>
              {BigNumber.from(shares).gte(
                BigNumber.from(MIN_NUMBER_OF_SHARES[chainId]),
              ) &&
                consultationDetails?.bid_id && (
                  <StyledPrimaryButton
                    disabled={isAccepting}
                    onClick={() => {
                      onAccept(consultationDetails.bid_id);
                    }}
                  >
                    {isAccepting ? (
                      <Spinner color={'#fff'} />
                    ) : (
                      'Accept Request'
                    )}
                  </StyledPrimaryButton>
                )}
              {consultationDetails?.submitter === address && (
                <StyledPrimaryButton
                  disabled={isCancelling || !lockupEnded}
                  onClick={openCancelModal}
                >
                  {isCancelling ? <Spinner color={'#fff'} /> : 'Cancel Bid'}
                </StyledPrimaryButton>
              )}
            </Flex>
          )}
        </StyledCard>
      ) : (
        <StyledCard mb={'32px'} p={'32px'}>
          <StyledBodyText>No bid details.</StyledBodyText>
        </StyledCard>
      )}
    </>
  );
};

export default ConsultationRequestCard;
