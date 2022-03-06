import { Box, Flex, Spinner } from '@chakra-ui/react';
import Slider from 'components/Slider';
import { useWallet } from 'contexts/WalletContext';
import { BigNumber, utils } from 'ethers';
import { useMembership } from 'hooks/useMembership';
import React, { useEffect, useMemo, useState } from 'react';
import { useHistory } from 'react-router-dom';
import {
  StyledBodyText,
  StyledBountyRow,
  StyledCard,
  StyledNumberText,
  StyledPrimaryHeading,
  StyledSmallPrimaryButton,
  StyledSmallSecondaryButton,
} from 'themes/styled';
import { round, shortenAddress } from 'utils';
import { ICombinedBid } from 'utils/types';
import { MIN_NUMBER_OF_SHARES } from 'web3/constants';

const HiringBaord: React.FC = () => {
  const { bids, chainId, fetchBids, isLoadingBids } = useWallet();
  const { shares, isLoadingShares } = useMembership();
  const { address, connectWallet } = useWallet();
  const [showMySubmissions, setShowMySubmissions] = useState(false);
  const [filteredBids, setFilteredBids] = useState<ICombinedBid[]>([]);

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
    if (bids.length === 0) return;
    if (showMySubmissions) {
      if (!address) {
        connectWallet();
      }
      const filteredConsultations = bids.filter(bid => {
        return bid.from === address || bid.submitter === address;
      });
      setFilteredBids(filteredConsultations);
    } else {
      setFilteredBids(bids);
    }
  }, [address, connectWallet, bids, showMySubmissions]);

  return (
    <Box px={{ base: '10px', md: '20px', lg: '50px' }} w="100%">
      <Flex direction={'column'} mb={'60px'} justify={'center'} w={'100%'}>
        <StyledPrimaryHeading
          textAlign={'left'}
          fontSize={{ base: '1.5rem', lg: '36px' }}
          mt={'40px'}
          mb={'20px'}
        >
          Consultation Queue
        </StyledPrimaryHeading>
        <StyledBodyText fontSize={{ base: '1rem', lg: '18px' }} mb={'40px'}>
          Select a consultation request from the queue to add or increase your
          bid.
        </StyledBodyText>
        <StyledCard p={{ base: '10px', sm: '32px' }}>
          <Flex align={'center'} justify={'space-between'} mb={'12px'}>
            <StyledBodyText fontSize={{ base: '18px', md: '24px' }}>
              Open bids:
            </StyledBodyText>
            <Slider
              label={'My submissions:'}
              setToggleState={setShowMySubmissions}
              toggleState={showMySubmissions}
            />
          </Flex>
          {isLoadingShares && (
            <StyledBodyText>Checking RaidGuild membership...</StyledBodyText>
          )}
          {isLoadingBids ? (
            <Spinner color={'#fff'} />
          ) : filteredBids.length > 0 ? (
            filteredBids.map((bid, index) => (
              <BidListItem
                key={index}
                account={address}
                bid={bid}
                chainId={chainId}
                index={index}
                shares={shares}
                windowWidth={windowWidth}
              />
            ))
          ) : (
            <StyledBodyText>There are no bounties.</StyledBodyText>
          )}
        </StyledCard>
      </Flex>
    </Box>
  );
};

export default HiringBaord;

type BidListItemProps = {
  account?: string | null;
  bid: ICombinedBid;
  chainId?: number | null;
  index: number;
  shares: string;
  windowWidth: number;
};

const BidListItem: React.FC<BidListItemProps> = ({
  account,
  bid,
  chainId,
  index,
  shares,
  windowWidth,
}) => {
  const history = useHistory();

  const showProjectName = useMemo(() => {
    if (!account || !chainId) return false;
    if (
      bid.from === account ||
      bid.submitter === account ||
      BigNumber.from(shares).gte(BigNumber.from(MIN_NUMBER_OF_SHARES[chainId]))
    ) {
      return true;
    } else {
      return false;
    }
  }, [account, bid, chainId, shares]);

  return (
    <div key={index}>
      {bid.from && (
        <StyledBountyRow
          justify={'space-between'}
          onClick={() => history.push(`/bids/${bid.submission_hash}`)}
          secondary={index % 2 !== 0 ? 1 : 0}
          p={{ base: '4px', md: '10px' }}
        >
          <Flex
            align={{ base: 'flex-start', sm: 'center' }}
            direction={{ base: 'column', sm: 'row' }}
          >
            <StyledBodyText
              fontSize={{ base: '12px', md: '14px' }}
              mr={{ base: '12px', md: '20px' }}
            >
              #{index < 9 ? `0${index + 1}` : index + 1}
            </StyledBodyText>
            <StyledBodyText
              fontSize={{ base: '12px', md: '14px' }}
              w={{ base: '88px', md: '100px' }}
            >
              {new Date(Number(bid.created)).toLocaleDateString()}
            </StyledBodyText>
            <StyledBodyText fontSize={{ base: '12px', md: '14px' }}>
              {showProjectName
                ? bid.project_name
                : windowWidth > 1026
                ? bid.from
                : shortenAddress(bid.from)}
            </StyledBodyText>
          </Flex>
          <Flex align={'center'}>
            <StyledNumberText
              fontSize={{ base: '12px', md: '14px' }}
              w={{ base: '88px', md: '110px' }}
            >
              {round(utils.formatEther(bid.amount), 2)} $RAID
            </StyledNumberText>
            {showProjectName ? (
              <StyledSmallPrimaryButton
                fontSize={{ base: '12px', md: '14px' }}
                w={{ base: '60px', md: '80px' }}
              >
                open
              </StyledSmallPrimaryButton>
            ) : (
              <StyledSmallSecondaryButton
                fontSize={{ base: '12px', md: '14px' }}
                w={{ base: '60px', md: '80px' }}
              >
                open
              </StyledSmallSecondaryButton>
            )}
          </Flex>
        </StyledBountyRow>
      )}
    </div>
  );
};
