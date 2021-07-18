/* eslint-disable no-undef */

import React, { useContext, useState } from 'react';
import { motion } from 'framer-motion';
import { utils } from 'web3';
import { BIDS_QUERY, graphqlClient } from '../../../../constants/index';
import { shortenAddress, combineBids, round } from '../../../../utils';
import { LOCKUP_PERIOD, RAID_CONTRACT_ADDRESS } from '../../../../constants/index';
import { AppContext } from '../../../../context/AppContext';

import { ReactComponent as EtherscanSvg } from '../../../../assets/etherscan.svg';

import ConfirmCancel from '../../../../components/ConfirmCancel';
import DepositWithdrawCard from './DepositWithdrawCard';
import Snackbar from '../../../../components/Snackbar';

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
    onAccept,
    isAcceptPending,
    shares,
    txFailed,
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
      if (days === 0 && hours === 0) {
        setLockTime(`$RAID locked for < 1 hour`);
      } else {
        setLockTime(`$RAID locked for ${days} days, ${hours} hours`);
      }
    } else {
      setLockTime('Bid can be withdrawn or canceled');
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
        Bid Details
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
              <span>Status:</span>{lockTime}
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
            <motion.a
              href={`https://rinkeby.etherscan.io/address/${RAID_CONTRACT_ADDRESS}`}
              target={'_blank'}
              rel={'noopener noreferrer'}
              className="etherscan-container"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.5 }}
            >
              <EtherscanSvg />
            </motion.a>
          </div></>) : <p>No bid has been submitted for this consultation.</p>}
          {consultationDetails.changes.length > 0 && (
            <div className="bounty-list" style={{ marginTop: '20px' }}>
              {consultationDetails.changes.map((change, index) => (
                <a
                  href={`https://rinkeby.etherscan.io/tx/${change.txHash}`}
                  target={'_blank'}
                  rel={'noopener noreferrer'}
                  key={index}
                  className={`bounty-list-item bounty-list-item${index % 2 !== 0 && '--2'}`}
                >
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
                </a>
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
            Back
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
      </div>
      {(showSnackbar && hash !== '') && <Snackbar
        setShowSnackbar={setShowSnackbar}
        message={txConfirmed ? txFailed ? 'Transaction Failed' : 'Transaction Confirmed!' : 'Transaction Pending...'}
        hash={hash}
      />}
      <ConfirmCancel
        consultationDetails={consultationDetails}
        setTxConfirmed={setTxConfirmed}
        setShowSnackbar={setShowSnackbar}
        setConsultations={setConsultations}
      />
    </div>
  )
}
