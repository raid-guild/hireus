import { ReactComponent as XDaiSvg } from 'assets/xdai.svg';
// import ConfirmCancel from 'components/ConfirmCancel';
// import Snackbar from 'components/Snackbar';
import { useWallet } from 'contexts/WalletContext';
import { motion } from 'framer-motion';
import { rootLocation } from 'locations';
import React, { useCallback, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { shortenAddress } from 'utils';
import type { ICombinedBid } from 'utils/types';
import web3 from 'web3';
import { BLOCK_EXPLORER_URL, LOCKUP_PERIOD } from 'web3/constants';

import ConsultationRequestCard from './ConsultationRequestCard';
// import DepositWithdrawCard from './DepositWithdrawCard';

type ICauseParams = {
  id: string;
};

const OpenBid: React.FC = () => {
  const { id } = useParams<ICauseParams>();
  const { address, bids } = useWallet();
  const history = useHistory();

  const [consultationDetails, setConsultationDetails] =
    useState<ICombinedBid | null>(null);

  const [isAccepting, setIsAccepting] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);

  const [lockupEnded, setLockupEnded] = useState(false);
  const [lockTime, setLockTime] = useState('');
  const [showCancelModal, setShowCancelModal] = useState(false);
  // const [showSnackbar, setShowSnackbar] = useState(false);
  // const [txConfirmed, setTxConfirmed] = useState(false);
  // const [hash, setHash] = useState('');
  // const [txFailed, setTxFailed] = useState(false);

  React.useEffect(() => {
    if (bids.length === 0 || !consultationDetails) return;
    const dateNow = Date.now();
    const lockupEnds =
      Number(consultationDetails.bidCreated) * 1000 + LOCKUP_PERIOD;
    if (dateNow > lockupEnds) {
      setLockupEnded(true);
    } else {
      setLockupEnded(false);
    }
  }, [bids.length, consultationDetails]);

  React.useEffect(() => {
    if (!consultationDetails) return;
    const dateNow = Date.now();
    const lockupEnds =
      Number(consultationDetails.bidCreated) * 1000 + LOCKUP_PERIOD;
    const timeRemaining = lockupEnds - dateNow;
    if (timeRemaining > 0) {
      const days = Math.floor(timeRemaining / (1000 * 60 * 60 * 24));
      const remainingSeconds = Math.floor(
        timeRemaining % (1000 * 60 * 60 * 24),
      );
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
    if (address && bids.length > 0) {
      const consultationDetails = bids.filter(consultation => {
        return consultation.consultation_hash === id;
      });
      setConsultationDetails(consultationDetails[0]);
    }
  }, [address, bids, id]);

  const onAccept = useCallback(async (id: string) => {
    // setTxConfirmed(false);
    // setShowSnackbar(true);
    // await onAccept(id);
    // setTxConfirmed(true);
    // refresh();
    console.log('Accept: ', id);
  }, []);

  return (
    <div className="hiringboard-container">
      <button
        className="consultation-button"
        style={{
          marginTop: '12px',
          position: 'absolute',
          right: '275px',
          top: '24px',
        }}
        onClick={() => {
          history.push(rootLocation);
        }}
      >
        Back
      </button>
      {consultationDetails && (
        <div className="hiringboard-card-container">
          <div
            style={{ display: 'flex', flexDirection: 'column', width: '100%' }}
          >
            <ConsultationRequestCard
              account={address || ''}
              consultationDetails={consultationDetails}
              isAccepting={isAccepting}
              isCancelling={isCancelling}
              lockTime={lockTime}
              lockupEnded={lockupEnded}
              onAccept={onAccept}
              openCancelModal={() => setShowCancelModal(true)}
            />
            {/* {address && (
              <DepositWithdrawCard
                setShowSnackbar={setShowSnackbar}
                setTxConfirmed={setTxConfirmed}
                consultationDetails={consultationDetails}
                lockTime={lockTime}
                lockupEnded={lockupEnded}
                refresh={refresh}
              />
            )} */}
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
            ) : (
              <p>
                No bid has been submitted for this consultation.{' '}
                {!address && 'Connect wallet to submit a bid.'}
              </p>
            )}
            {consultationDetails.changes.length > 0 && (
              <div className="bounty-list" style={{ marginTop: '20px' }}>
                {consultationDetails.changes.map((change, index) => (
                  <a
                    href={`${BLOCK_EXPLORER_URL}tx/${change.txHash}`}
                    target={'_blank'}
                    rel={'noopener noreferrer'}
                    key={index}
                    className={`bounty-list-item bounty-list-item${
                      index % 2 !== 0 && '--2'
                    }`}
                  >
                    <div className="bounty-list-item-inner">
                      <motion.div
                        className="etherscan-container"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.6, duration: 0.5 }}
                        style={{ marginRight: '16px' }}
                      >
                        <XDaiSvg />
                      </motion.div>
                      <p>
                        {new Date(
                          Number(change.changedAt) * 1000,
                        ).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="bounty-list-item-inner">
                      <p>
                        {shortenAddress(
                          change.increasedBy || consultationDetails.submitter,
                          8,
                        )}
                      </p>
                    </div>
                    <div className="bounty-list-item-inner">
                      <p
                        className={`withdraw-amount withdraw-amount--${
                          change.withdrawnAt ? 'red' : 'green'
                        }`}
                      >
                        {change.withdrawnAt ? '-' : '+'}
                        {web3.utils.fromWei(change.amount)} $RAID
                      </p>
                    </div>
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
      {/* {showSnackbar && hash !== '' && (
        <Snackbar
          setShowSnackbar={setShowSnackbar}
          message={
            txConfirmed
              ? txFailed
                ? 'Transaction Failed'
                : 'Transaction Confirmed!'
              : 'Transaction Pending...'
          }
          hash={hash}
        />
      )} */}
      {/* {consultationDetails && (
        <ConfirmCancel
          consultationDetails={consultationDetails}
          refresh={refresh}
          setTxConfirmed={setTxConfirmed}
          setShowSnackbar={setShowSnackbar}
        />
      )} */}
    </div>
  );
};

export default OpenBid;
