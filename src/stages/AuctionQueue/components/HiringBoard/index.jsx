import React, { useContext, useEffect } from 'react';
import { motion } from 'framer-motion';
import { utils } from 'web3';

import {
  MIN_NUMBER_OF_SHARES,
  RAID_CONTRACT_ADDRESS,
} from '../../../../constants';
import { round, shortenAddress } from '../../../../utils';
import { AppContext } from '../../../../context/AppContext';
import Slider from '../../../../components/Slider';

export const HiringBoard = ({ consultations, setSelectedConsultations }) => {
  const { account, connectWallet, updateStage, shares } =
    useContext(AppContext);
  const [showMySubmissions, setShowMySubmissions] = React.useState(false);
  const [filteredConsultations, setFilteredConsultations] = React.useState(
    consultations || [],
  );

  useEffect(() => {
    if (!consultations) return;
    if (showMySubmissions) {
      if (!account) {
        connectWallet();
      }
      const filteredConsultations = consultations.filter(consultation => {
        return consultation.from === account;
      });
      setFilteredConsultations(filteredConsultations);
    } else {
      setFilteredConsultations(consultations);
    }
  }, [account, connectWallet, consultations, showMySubmissions]);

  return (
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
                href="https://medium.com/raid-guild/why-token-why-now-4c0b8e8ea45"
                target="_blank"
                rel="noopener noreferrer"
              >
                <button
                  className="consultation-button"
                  initial={{ x: '100vw' }}
                  animate={{ x: 0 }}
                  transition={{ delay: 1.3 }}
                  onClick={() => {
                    console.log('Link to raid');
                  }}
                >
                  About $RAID
                </button>
              </a>
            </div>
            <div>
              <button
                className="consultation-button"
                initial={{ x: '100vw' }}
                animate={{ x: 0 }}
                transition={{ delay: 1.3 }}
                onClick={() => {
                  updateStage('next');
                }}
              >
                New Consultation
              </button>
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
          {!consultations ? (
            <div className="spinner">Loading...</div>
          ) : filteredConsultations.length > 0 ? (
            <div className="bounty-list">
              {filteredConsultations.map((consultation, index) => (
                <BidListItem
                  key={index}
                  account={account}
                  consultation={consultation}
                  index={index}
                  setSelectedConsultations={setSelectedConsultations}
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
  );
};

const BidListItem = ({
  account,
  consultation,
  index,
  setSelectedConsultations,
  shares,
}) => {
  return (
    <div key={index}>
      {consultation.from && (
        <div
          onClick={() => setSelectedConsultations(consultation.project_name)}
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
              {new Date(consultation.created).toLocaleDateString()}
            </p>
            <p>
              {consultation.from === account || shares >= MIN_NUMBER_OF_SHARES
                ? consultation.project_name
                : shortenAddress(consultation.from)}
            </p>
          </div>
          <div className="bounty-list-item-inner">
            <p className="bounty-detail">
              {round(utils.fromWei(consultation.amount), 4)} $RAID
            </p>
            <button>open</button>
          </div>
        </div>
      )}
    </div>
  );
};
