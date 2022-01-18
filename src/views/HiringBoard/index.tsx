import './AuctionQueue.scss';

import Slider from 'components/Slider';
import { useWallet } from 'contexts/WalletContext';
import { utils } from 'ethers';
import { motion } from 'framer-motion';
import { useShares } from 'hooks/useShares';
import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { round, shortenAddress } from 'utils';
import { ICombinedBid } from 'utils/types';
import { MIN_NUMBER_OF_SHARES, RAID_CONTRACT_ADDRESS } from 'web3/constants';

const HiringBaord: React.FC = () => {
  const { bids, isLoadingBids } = useWallet();
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
    <div style={{ width: '100%' }}>
      <div className="hiringboard-container hiringboard-respond">
        <div className="hiringboard-card-container">
          <div style={{ width: '35%' }}>
            <motion.h1
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.5 }}
            >
              Hiring Raid Guild
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.5 }}
            >
              The first step to hiring Raid Guild is to submit a request for a
              consultation. During the consultation, we will discuss your needs,
              whether Raid Guild can meet them, and collectively determine how
              best to proceed.
            </motion.p>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.5 }}
            >
              Since demand for our services is high, Raid Guild selects the next
              consultation to take from a queue (see right). To add your request
              to queue, you can submit a payment of 500{' '}
              <a
                href="https://etherscan.io/token/0x6b175474e89094c44da98b954eedeac495271d0f"
                target="_blank"
                rel="noopener noreferrer"
                className="hiringboard-link"
              >
                DAI
              </a>{' '}
              (on mainnet). Your request will be placed at the bottom of the
              queue.
            </motion.p>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1, duration: 0.5 }}
            >
              If you’d like to get prioritized access to our services, you can
              move your submission up in the queue by bidding{' '}
              <a
                href={`https://blockscout.com/xdai/mainnet/address/${RAID_CONTRACT_ADDRESS}`}
                target="_blank"
                rel="noopener noreferrer"
                className="hiringboard-link"
              >
                $RAID
              </a>{' '}
              tokens (on xDAI). Raid Guild will accept the consultation request
              with the highest bid in $RAID.
            </motion.p>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2, duration: 0.5 }}
            >
              Your bid will be locked for 7 days. After 7 days, you may decrease
              or cancel your bid if you’d like. You are welcome to increase your
              bid at any time to move further up the queue.
            </motion.p>
            <div id="hiringboard-button-container">
              <div>
                <a
                  href="https://app.honeyswap.org/#/swap?inputCurrency=0x18e9262e68cc6c6004db93105cc7c001bb103e49&chainId=100"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <motion.button
                    className="consultation-button"
                    initial={{ x: '100vw' }}
                    animate={{ x: 0 }}
                    transition={{ delay: 1.3 }}
                    onClick={() => null}
                  >
                    Get $RAID
                  </motion.button>
                </a>
              </div>
              <div>
                <motion.button
                  className="consultation-button"
                  initial={{ x: '100vw' }}
                  animate={{ x: 0 }}
                  transition={{ delay: 1.3 }}
                  onClick={() => () => console.log('Link to hireus')}
                >
                  New Consultation
                </motion.button>
              </div>
            </div>
          </div>
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
            {!(address && shares) ? (
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
                    index={index}
                    shares={shares}
                  />
                ))}
              </div>
            ) : (
              <p>There are no bounties.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HiringBaord;

type IBidListItem = {
  account: string;
  bid: ICombinedBid;
  index: number;
  shares: string;
};

const BidListItem: React.FC<IBidListItem> = ({
  account,
  bid,
  index,
  shares,
}) => {
  const history = useHistory();

  return (
    <div key={index}>
      {bid.from && (
        <div
          onClick={() => history.push(`/bids/${bid.createTxHash}`)}
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
              BigInt(shares) >= BigInt(MIN_NUMBER_OF_SHARES)
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
