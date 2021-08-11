/* eslint-disable no-undef */
import React, { useContext, useState } from 'react';
import { motion } from 'framer-motion';
import { utils } from 'web3';
import { shortenAddress } from '../../../../utils';
import { BLOCK_EXPLORER_URL, LOCKUP_PERIOD } from '../../../../constants/index';
import { AppContext } from '../../../../context/AppContext';

import { ReactComponent as XDaiSvg } from '../../../../assets/xdai.svg';

import ConfirmCancel from '../../../../components/ConfirmCancel';
import DepositWithdrawCard from './DepositWithdrawCard';
import ConsultationRequestCard from './ConsultationRequestCard';
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
    isCancelPending,
    updateCancelModalStatus,
    shares,
    txFailed,
  } = useContext(AppContext);
  const [lockupEnded, setLockupEnded] = useState(false);
  const [consultationDetails, setConsultationDetails] = useState(null);
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [txConfirmed, setTxConfirmed] = useState(false);
  const [lockTime, setLockTime] = useState('');

  React.useEffect(() => {
    if (!consultationDetails) return;
    const dateNow = Date.now();
    const lockupEnds = (Number(consultationDetails.bidCreated) * 1000) + LOCKUP_PERIOD;
    if (dateNow > lockupEnds) {
      setLockupEnded(true);
    } else {
      setLockupEnded(false);
    }
  }, [consultationDetails]);

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

  const onAcceptAndUpdate = async (id) => {
    setTxConfirmed(false);
    setShowSnackbar(true);
    await onAccept(id);
    setTxConfirmed(true);
  }

  return (
    <div className="hiringboard-container">
       <button
        className='consultation-button'
        style={{
          marginTop: '20px',
          position: 'absolute',
          right: '275px',
          top: '24px',
        }}
        onClick={() => {
          setSelectedConsultations(null);
        }}
      >
        Back
      </button>
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
          position: 'absolute',
          right: '60px',
          top: '24px',
          width: '200px',
        }}
      >
        {account ? shortenAddress(account) : 'Connect'}
      </button>
      {consultationDetails && (
        <div className="hiringboard-card-container">
          <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
            <ConsultationRequestCard 
              account={account}
              consultationDetails={consultationDetails}
              lockTime={lockTime}
              lockupEnded={lockupEnded}
              shares={shares}
              isAcceptPending={isAcceptPending}
              onAcceptAndUpdate={onAcceptAndUpdate}
              updateCancelModalStatus={updateCancelModalStatus}
              isCancelPending={isCancelPending}
            />
            {account && <DepositWithdrawCard
              setShowSnackbar={setShowSnackbar}
              setTxConfirmed={setTxConfirmed}
              consultationDetails={consultationDetails}
              setConsultations={setConsultations}
              lockTime={lockTime}
              lockupEnded={lockupEnded}
            />}
          </div>
          <div className="hiringboard-card">
            {consultationDetails.bid_id ? (
              <div className="open-bid-details-flex">
                <motion.h2
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4, duration: 0.5 }}
                >
                  Bid History:
                </motion.h2>
              </div>
            ) : <p>No bid has been submitted for this consultation. {!account && 'Connect wallet to submit a bid.'}</p>}
            {consultationDetails.changes.length > 0 && (
              <div className="bounty-list" style={{ marginTop: '20px' }}>
                {consultationDetails.changes.map((change, index) => (
                  <a
                    href={`${BLOCK_EXPLORER_URL}tx/${change.txHash}`}
                    target={'_blank'}
                    rel={'noopener noreferrer'}
                    key={index}
                    className={`bounty-list-item bounty-list-item${index % 2 !== 0 && '--2'}`}
                  >
                    <div className="bounty-list-item-inner">
                      <div
                        className="etherscan-container"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.6, duration: 0.5 }}
                        style={{ marginRight: '16px' }}
                      >
                        <XDaiSvg />
                      </div>
                      <p>{new Date(Number(change.changedAt ) * 1000).toLocaleDateString()}</p>
                    </div>
                    <div className="bounty-list-item-inner">
                      <p>
                        {shortenAddress(change.increasedBy || consultationDetails.submitter, 8)}
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
        </div>
      )}
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
