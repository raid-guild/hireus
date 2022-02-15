import { Flex, Link } from '@chakra-ui/react';
import React from 'react';
import {
  StyledBodyText,
  StyledPrimaryButton,
  StyledPrimaryHeading,
} from 'themes/styled';
import { theme } from 'themes/theme';
import { RAID_CONTRACT_ADDRESS } from 'web3/constants';

const Explainer: React.FC = () => {
  return (
    <Flex
      direction="column"
      py="2rem"
      px={{ base: '1rem', lg: '4rem' }}
      mx="1rem"
    >
      <StyledPrimaryHeading fontSize={{ base: '1.5rem', lg: '36px' }} mb="1rem">
        Consultation Queue
      </StyledPrimaryHeading>

      <StyledBodyText fontSize={{ base: '1rem', lg: '18px' }}>
        The first step to hiring Raid Guild is to submit a request for a
        consultation. During the consultation, we will discuss your needs,
        whether Raid Guild can meet them, and collectively determine how best to
        proceed.
      </StyledBodyText>
      <br />

      <StyledBodyText fontSize={{ base: '1rem', lg: '18px' }}>
        Since demand for our services is high, Raid Guild selects the next
        consultation to take from a queue (see right). To add your request to
        queue, you can submit a payment of 500{' '}
        <Link
          href={
            'https://etherscan.io/token/0x6b175474e89094c44da98b954eedeac495271d0f'
          }
          target={'_blank'}
          rel={'noopener noreferrer'}
          color={theme.colors.red}
        >
          DAI
        </Link>{' '}
        (on mainnet). Your request will be placed at the bottom of the queue.
      </StyledBodyText>
      <br />

      <StyledBodyText fontSize={{ base: '1rem', lg: '18px' }}>
        If you’d like to get prioritized access to our services, you can move
        your submission up in the queue by bidding{' '}
        <Link
          href={`https://blockscout.com/xdai/mainnet/address/${RAID_CONTRACT_ADDRESS}`}
          target={'_blank'}
          rel={'noopener noreferrer'}
          color={theme.colors.red}
        >
          $RAID
        </Link>{' '}
        tokens (on xDAI). Raid Guild will accept the consultation request with
        the highest bid in $RAID.
      </StyledBodyText>
      <br />

      <StyledBodyText fontSize={{ base: '1rem', lg: '18px' }}>
        If you’d like to get prioritized access to our services, you can move
        your submission up in the queue by bidding{' '}
        <Link
          href={`https://blockscout.com/xdai/mainnet/address/${RAID_CONTRACT_ADDRESS}`}
          target={'_blank'}
          rel={'noopener noreferrer'}
          color={theme.colors.red}
        >
          $RAID
        </Link>{' '}
        tokens (on xDAI). Raid Guild will accept the consultation request with
        the highest bid in $RAID.
      </StyledBodyText>
      <br />

      <StyledBodyText fontSize={{ base: '1rem', lg: '18px' }}>
        Your bid will be locked for 7 days. After 7 days, you may decrease or
        cancel your bid if you’d like. You are welcome to increase your bid at
        any time to move further up the queue.
      </StyledBodyText>
      <br />
      <br />

      <StyledPrimaryButton
        fontSize={{ base: '16px', lg: '18px' }}
        onClick={() => null}
      >
        Bid on Consultation
      </StyledPrimaryButton>
      <br />
    </Flex>
  );
};

export default Explainer;
