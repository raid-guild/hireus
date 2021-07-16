/* eslint-disable no-undef */

import React, { useContext, useState } from 'react';
import { motion } from 'framer-motion';
import { utils } from 'web3';
import gql from 'graphql-tag';
import { Client } from 'urql';
import { shortenAddress, combineBids, round } from '../../../../utils';
import { LOCKUP_PERIOD } from '../../../../constants/index';
import { AppContext } from '../../../../context/AppContext';

import { ReactComponent as EtherscanSvg } from '../../../../assets/etherscan.svg';

import DepositWithdrawCard from './DepositWithdrawCard';
import Snackbar from '../../../../components/Snackbar';

const graphqlClient = new Client({ url: 'https://api.thegraph.com/subgraphs/name/slgraham/guildauctionqueues-rinkeby' ?? '' });

const BIDS_QUERY = gql`
  query {
    bids(first: 100) {
      id
      amount
      createdAt
      details
      createTxHash
      status
      submitter {
        id
      }
      increases {
        increasedAt
        amount
        increasedBy
      }
      withdraws {
        withdrawnAt
        amount
      }
    }
  }
`;

export const OpenBounty = ({
  consultations,
  selectedConsultation,
  setSelectedConsultations,
  setConsultations,
}) => {
  const {
    account,
    connectWallet,
    hash,
    onCancel,
    onAccept,
    isCancelPending,
    isAcceptPending,
    shares
  } = useContext(AppContext);
  const [consultationDetails, setConsultationDetails] = useState(null);
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [txConfirmed, setTxConfirmed] = useState(false);
  const [lockTime, setLockTime] = useState('');

  React.useEffect(() => {
    if (!consultationDetails) return;
    const dateNow = Date.now();
    const lockupEnds = (Number(consultationDetails.bidCreated) * 1000) + LOCKUP_PERIOD;
    const timeRemaining = lockupEnds - dateNow;
    if (timeRemaining > 0) {
      const days = Math.floor(timeRemaining / (1000 * 60 * 60 * 24));
      const remainingSeconds = Math.floor(timeRemaining % (1000 * 60 * 60 * 24));
      const hours = Math.floor(remainingSeconds / (1000 * 60 * 60));
      setLockTime(`${days} days, ${hours} hours left`);
    } else {
      setLockTime('Lockup period has ended');
    }
  }, [consultationDetails]);

  React.useEffect(() => {
    if (selectedConsultation && consultations.length > 0) {
      const consultationDetails = consultations.filter(consultation => {
        return consultation.project_name === selectedConsultation;
      })
      setConsultationDetails(consultationDetails[0]);
    } else {
      setSelectedConsultations(null);
    }
  }, [consultations, selectedConsultation, setSelectedConsultations]);

  const fetchBids = async () => {
    console.log('Fetching...');
    try {
      const result = await graphqlClient.query(BIDS_QUERY).toPromise();
      if (!result?.data) {
        return;
      }
      const contractBids = result.data.bids;
      fetch(`https://guild-keeper.herokuapp.com/hireus-v2/awaiting-raids`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        "key":process.env.REACT_APP_ACCESS_KEY
      })
    })
      .then((res) => res.json())
      .then(async (data) => {
        if (!contractBids) return;
        const combinedBids = await combineBids(data, contractBids);
        combinedBids.sort(function(a,b){
          return new Date(b.created) - new Date(a.created);
        });
        combinedBids.sort((a,b) => Number(b.amount)-Number(a.amount));
        setConsultations(combinedBids);
      })
      .catch((error) => {
        console.error(error);
      });
    } catch (err) {
      console.error(err);
    }
  }

  const onCancelAndUpdate = async (id) => {
    setTxConfirmed(false);
    setShowSnackbar(true);
    await onCancel(id);
    await fetchBids();
    setTxConfirmed(true);
  }

  const onAcceptAndUpdate = async (id) => {
    setTxConfirmed(false);
    setShowSnackbar(true);
    await onAccept(id);
    await fetchBids();
    setTxConfirmed(true);
  }

  return (
    <div className="hiringboard-container">
      <motion.h1
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.5 }}
      >
        Open Bid: {consultationDetails?.project_name}
      </motion.h1>
      {consultationDetails && <div className="hiringboard-card-container">
        <div
          className="hiringboard-card"
        >
          {consultationDetails.bid_id ? (<>
          <div className="open-bid-details-flex">
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.5 }}
            >
              <span>Submitter:</span>{shortenAddress(consultationDetails.submitter)}
            </motion.p>
            <motion.a
              href={`https://rinkeby.etherscan.io/address/${consultationDetails.submitter}`}
              target={'_blank'}
              rel={'noopener noreferrer'}
              className="etherscan-container"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.5 }}
            >
              <EtherscanSvg />
            </motion.a>
          </div>
          <div className="open-bid-details-flex">
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.5 }}
            >
              <span>Submitted On:</span>{new Date(Number(consultationDetails.bidCreated) * 1000).toLocaleString()}
            </motion.p>
            <motion.a
              href={`https://rinkeby.etherscan.io/tx/${consultationDetails.createTxHash}`}
              target={'_blank'}
              rel={'noopener noreferrer'}
              className="etherscan-container"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.5 }}
            >
              <EtherscanSvg />
            </motion.a>
          </div>
          <div className="open-bid-details-flex">
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.5 }}
            >
              <span>Lock Time:</span>{lockTime}
            </motion.p>
          </div>
          <div className="open-bid-details-flex">
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.5 }}
            >
              <span>Total Bounty:</span>{round(utils.fromWei(consultationDetails.amount), 4)} $RAID
            </motion.p>
          </div></>) : <p>No bid has been submitted for this consultation.</p>}
          {consultationDetails.changes.length > 0 && (
            <div className="bounty-list" style={{ marginTop: '20px' }}>
              {consultationDetails.changes.map((change, index) => (
                <div key={index} className={`increase-withdraw-list-item increase-withdraw-list-item${index % 2 !== 0 && '--2'}`}>
                  <div className="bounty-list-item-inner">
                    <p className="bounty-detail">{new Date(Number(change.changedAt ) * 1000).toLocaleDateString()}</p>
                  </div>
                  <div className="bounty-list-item-inner">
                    <p className="bounty-detail">
                      {shortenAddress(change.increasedBy || consultationDetails.submitter)}
                    </p>
                  </div>
                  <div className="bounty-list-item-inner">
                    <p className={`withdraw-amount withdraw-amount--${change.withdrawnAt ? 'red' : 'green'}`}>
                      {change.withdrawnAt ? '-' : '+'}{utils.fromWei(change.amount)} $RAID
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        {!account ? (
          <div
            className="hiringboard-card"
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.5 }}
            >
              Connect a wallet to add or remove $RAID to this bid
            </motion.p>
            <button
              className='consultation-button'
              initial={{ x: '100vw' }}
              animate={{ x: 0 }}
              transition={{ delay: 1.3 }}
              onClick={() => {
                connectWallet()
              }}
              style={{
                marginTop: '20px',
                width: '200px',
              }}
            >
              Connect
            </button>
          </div>
        ) : (
          <DepositWithdrawCard
            setShowSnackbar={setShowSnackbar}
            setTxConfirmed={setTxConfirmed}
            consultationDetails={consultationDetails}
            setConsultations={setConsultations}
            lockTime={lockTime}
          />
        )}
      </div>}
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <div className="open-bounty-buttons-container">
          <button
            className='consultation-button consultation-button--close'
            onClick={() => {
              setSelectedConsultations(null);
            }}
          >
            Close
          </button>
          {(shares >= 10 && consultationDetails?.bid_id) && <button
            className='consultation-button'
            initial={{ x: '100vw' }}
            animate={{ x: 0 }}
            transition={{ delay: 1.3 }}
            disabled={isAcceptPending}
            onClick={() => {
              onAcceptAndUpdate(consultationDetails.bid_id);
            }}
          >
            {isAcceptPending
            ? <div className="spinner">Loading...</div>
            : 'Accept'}
          </button>}
        </div>
        {consultationDetails?.submitter === account && <div className="open-bounty-buttons-container">
          <button
            className='consultation-button'
            initial={{ x: '100vw' }}
            animate={{ x: 0 }}
            transition={{ delay: 1.3 }}
            disabled={isCancelPending}
            onClick={() => {
              onCancelAndUpdate(consultationDetails.bid_id);
            }}
          >
            {isCancelPending
            ? <div className="spinner">Loading...</div>
            : 'Cancel'}
          </button>
        </div>}
      </div>
      {(showSnackbar && hash !== '') && <Snackbar
        setShowSnackbar={setShowSnackbar}
        message={txConfirmed ? 'Transaction Confirmed!' : 'Transaction Pending...'}
        hash={hash}
      />}
    </div>
  )
}
