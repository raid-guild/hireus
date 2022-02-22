import './AuctionQueue.scss';

import { Box, Flex, Spinner } from '@chakra-ui/react';
import Slider from 'components/Slider';
import { useWallet } from 'contexts/WalletContext';
import { utils } from 'ethers';
import { useShares } from 'hooks/useShares';
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
import { round } from 'utils';
import { ICombinedBid } from 'utils/types';
import { MIN_NUMBER_OF_SHARES } from 'web3/constants';

const HiringBaord: React.FC = () => {
  const { bids, chainId, fetchBids, isLoadingBids } = useWallet();
  const { shares, isLoadingShares } = useShares();
  const { address, connectWallet } = useWallet();
  const [showMySubmissions, setShowMySubmissions] = useState(false);
  const [filteredBids, setFilteredBids] = useState<ICombinedBid[]>([]);

  useEffect(() => {
    if (bids.length === 0) {
      fetchBids();
    }
  }, [bids, fetchBids]);

  useEffect(() => {
    if (bids.length === 0) return;
    if (showMySubmissions) {
      if (!address) {
        connectWallet();
      }
      const filteredConsultations = bids.filter(bid => {
        return bid.from === address;
      });
      setFilteredBids(filteredConsultations);
    } else {
      setFilteredBids(bids);
    }
  }, [address, connectWallet, bids, showMySubmissions]);

  return (
    <Box px={{ base: '2rem', lg: '5rem' }} w="100%">
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
        <StyledCard>
          <Flex align={'center'} justify={'space-between'} mb={'12px'}>
            <StyledBodyText fontSize={'24px'}>Open bids:</StyledBodyText>
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
};

const BidListItem: React.FC<BidListItemProps> = ({
  account,
  bid,
  chainId,
  index,
  shares,
}) => {
  const history = useHistory();

  const showProjectName = useMemo(() => {
    if (!account || !chainId) return false;
    if (
      bid.from === account ||
      BigInt(shares) >= BigInt(MIN_NUMBER_OF_SHARES[chainId])
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
          onClick={() => history.push(`/bids/${bid.consultation_hash}`)}
          secondary={index % 2 !== 0}
        >
          <Flex align={'center'}>
            <StyledBodyText fontSize={'14px'} mr={'20px'}>
              #{index < 9 ? `0${index + 1}` : index + 1}
            </StyledBodyText>
            <StyledBodyText fontSize={'14px'} w={'100px'}>
              {new Date(bid.created).toLocaleDateString()}
            </StyledBodyText>
            <StyledBodyText fontSize={'14px'}>
              {showProjectName ? bid.project_name : bid.from}
            </StyledBodyText>
          </Flex>
          <Flex align={'center'}>
            <StyledNumberText fontSize={'14px'} w={'110px'}>
              {round(utils.formatEther(bid.amount), 2)} $RAID
            </StyledNumberText>
            {showProjectName ? (
              <StyledSmallPrimaryButton fontSize={'14px'} p={'0px'}>
                open
              </StyledSmallPrimaryButton>
            ) : (
              <StyledSmallSecondaryButton fontSize={'14px'} p={'0px'}>
                open
              </StyledSmallSecondaryButton>
            )}
          </Flex>
        </StyledBountyRow>
      )}
    </div>
  );
};
