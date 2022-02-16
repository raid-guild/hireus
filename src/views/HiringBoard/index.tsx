import './AuctionQueue.scss';

import { Box, Flex } from '@chakra-ui/react';
import Slider from 'components/Slider';
import { useWallet } from 'contexts/WalletContext';
import { utils } from 'ethers';
import { motion } from 'framer-motion';
import { useShares } from 'hooks/useShares';
import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { StyledBodyText, StyledPrimaryHeading } from 'themes/styled';
import { round, shortenAddress } from 'utils';
import { ICombinedBid } from 'utils/types';
import { MIN_NUMBER_OF_SHARES } from 'web3/constants';

const HiringBaord: React.FC = () => {
  const { bids, chainId, isLoadingBids } = useWallet();
  const { shares, isLoadingShares } = useShares();
  const { address, connectWallet } = useWallet();
  const [showMySubmissions, setShowMySubmissions] = useState(false);
  const [filteredBids, setFilteredBids] = useState<ICombinedBid[]>([]);

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
        <div className="hiringboard-card">
          <div
            style={{
              alignItems: 'center',
              display: 'flex',
              justifyContent: 'space-between',
            }}
          >
            <motion.h1
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7, duration: 0.5 }}
            >
              Open bids:
            </motion.h1>
            <div id="switch-container">
              <p>My submissions:</p>
              <Slider
                setToggleState={setShowMySubmissions}
                toggleState={showMySubmissions}
              />
            </div>
          </div>
          {isLoadingShares && <p>Checking RaidGuild membership...</p>}
          {!(address && chainId && shares) ? (
            <div>Connect wallet to view consultation queue</div>
          ) : isLoadingBids ? (
            <div className="spinner">Loading...</div>
          ) : filteredBids.length > 0 ? (
            <div className="bounty-list">
              {filteredBids.map((bid, index) => (
                <BidListItem
                  key={index}
                  account={address}
                  bid={bid}
                  chainId={chainId}
                  index={index}
                  shares={shares}
                />
              ))}
            </div>
          ) : (
            <p>There are no bounties.</p>
          )}
        </div>
      </Flex>
    </Box>
  );
};

export default HiringBaord;

type BidListItemProps = {
  account: string;
  bid: ICombinedBid;
  chainId: number;
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

  return (
    <div key={index}>
      {bid.from && (
        <div
          onClick={() => history.push(`/bids/${bid.consultation_hash}`)}
          className={`bounty-list-item bounty-list-item${
            index % 2 !== 0 && '--2'
          }`}
        >
          <div className="bounty-list-item-inner">
            <p
              style={{
                marginRight: '20px',
              }}
            >
              #{index < 9 ? `0${index + 1}` : index + 1}
            </p>
            <p className="bounty-detail">
              {new Date(bid.created).toLocaleDateString()}
            </p>
            <p>
              {bid.from === account ||
              BigInt(shares) >= BigInt(MIN_NUMBER_OF_SHARES[chainId])
                ? bid.project_name
                : shortenAddress(bid.from)}
            </p>
          </div>
          <div className="bounty-list-item-inner">
            <p className="bounty-detail">
              {round(utils.formatEther(bid.amount), 2)} $RAID
            </p>
            <button>open</button>
          </div>
        </div>
      )}
    </div>
  );
};
