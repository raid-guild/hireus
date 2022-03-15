import { Flex, Spinner } from '@chakra-ui/react';
import { ReactComponent as XDaiSvg } from 'assets/xdai.svg';
import { BigNumber, utils } from 'ethers';
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
  consultationDetails: ICombinedBid | null;
  isAccepting: boolean;
  isCancelling: boolean;
  isLoadingShares: boolean;
  lockTime: string;
  lockupEnded: boolean;
  onAccept: () => Promise<void>;
  openCancelModal: () => void;
  shares: string;
};

const ConsultationRequestCard: React.FC<ConsultationRequestCardProps> = ({
  address,
  chainId,
  consultationDetails,
  isAccepting,
  isCancelling,
  isLoadingShares,
  lockTime,
  lockupEnded,
  onAccept,
  openCancelModal,
  shares,
}) => {
  return (
    <>
      {consultationDetails?.bid_id ? (
        <StyledCard p={'32px'} mb={address ? '32px' : '0px'}>
          <StyledBodyText fontSize={'20px'} mb={'20px'}>
            Consultation request:
          </StyledBodyText>
          <Flex
            align={{ base: 'flex-start', sm: 'center' }}
            direction={{ base: 'column', sm: 'row' }}
            mb={'12px'}
          >
            <StyledBodyText minW={{ base: '140px', xl: '160px' }}>
              Submitter:
            </StyledBodyText>
            <Flex>
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
          </Flex>
          <Flex
            align={{ base: 'flex-start', sm: 'center' }}
            direction={{ base: 'column', sm: 'row' }}
            mb={'12px'}
          >
            <StyledBodyText minW={{ base: '140px', xl: '160px' }}>
              Submitted On:
            </StyledBodyText>
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
          <Flex
            align={{ base: 'flex-start', sm: 'center' }}
            direction={{ base: 'column', sm: 'row' }}
            mb={'12px'}
          >
            <StyledBodyText minW={{ base: '140px', xl: '160px' }}>
              Status:
            </StyledBodyText>
            <StyledNumberText mr={'8px'}>{lockTime}</StyledNumberText>
          </Flex>
          <Flex
            align={{ base: 'flex-start', sm: 'center' }}
            direction={{ base: 'column', sm: 'row' }}
            mb={'12px'}
          >
            <StyledBodyText minW={{ base: '140px', xl: '160px' }}>
              Total Bounty:
            </StyledBodyText>
            <Flex>
              <StyledNumberText mr={'8px'}>
                {round(utils.formatEther(consultationDetails.amount), 4)} $RAID
              </StyledNumberText>
              <a
                href={`${BLOCK_EXPLORER_URL[chainId]}address/${RAID_CONTRACT_ADDRESS[chainId]}`}
                target={'_blank'}
                rel={'noopener noreferrer'}
              >
                <XDaiSvg />
              </a>
            </Flex>
          </Flex>
          {address && !isLoadingShares && (
            <Flex
              direction={{ base: 'column', sm: 'row' }}
              gap={'12px'}
              mt={'20px'}
            >
              {BigNumber.from(shares).gte(
                BigNumber.from(MIN_NUMBER_OF_SHARES[chainId]),
              ) &&
                consultationDetails?.bid_id && (
                  <StyledPrimaryButton
                    disabled={isAccepting}
                    onClick={onAccept}
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
        <StyledCard
          mb={address ? '32px' : '0px'}
          minH={address ? '200px' : '400px'}
          p={'32px'}
        >
          <StyledBodyText>No bid details.</StyledBodyText>
        </StyledCard>
      )}
    </>
  );
};

export default ConsultationRequestCard;
