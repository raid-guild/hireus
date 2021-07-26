import React from 'react';
import { motion } from 'framer-motion';
import { utils } from 'web3';
import { shortenAddress, round } from '../../../../utils';
import { RAID_CONTRACT_ADDRESS } from '../../../../constants/index';

import { ReactComponent as EtherscanSvg } from '../../../../assets/etherscan.svg';

const ConsultationRequestCard = ({
  account,
  consultationDetails,
  lockTime,
  lockupEnded,
  shares,
  isAcceptPending,
  onAcceptAndUpdate,
  updateCancelModalStatus,
  isCancelPending,
}) => {
  return (
    <>
      {consultationDetails.bid_id ? <div id="consultation-request-card">
        <motion.h2
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          Consultation request:
        </motion.h2>
        <div className="open-bid-details-flex">
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.5 }}
          >
            <span>Submitter:</span>
          </motion.p>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.5 }}
          >
            {shortenAddress(consultationDetails.submitter)}
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
            <span>Submitted On:</span>
          </motion.p>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.5 }}
          >
            {new Date(Number(consultationDetails.bidCreated) * 1000).toLocaleString()}
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
            <span>Status:</span>
          </motion.p>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.5 }}
          >
            {lockTime}
          </motion.p>
        </div>
        <div className="open-bid-details-flex">
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.5 }}
          >
            <span>Total Bounty:</span>
          </motion.p>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.5 }}
          >
            {round(utils.fromWei(consultationDetails.amount), 4)} $RAID
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
        </div>
        {account && <div className="open-bounty-buttons-container">
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
            : 'Accept Request'}
          </button>}
          {(consultationDetails?.submitter === account && lockupEnded) && <div>
          <button
            className='consultation-button'
            initial={{ x: '100vw' }}
            animate={{ x: 0 }}
            transition={{ delay: 1.3 }}
            disabled={isCancelPending}
            onClick={() => {
              updateCancelModalStatus(true);
            }}
          >
            {isCancelPending
            ? <div className="spinner">Loading...</div>
            : 'Cancel Bid'}
          </button>
        </div>}
        </div>}
      </div>
      : (
      <div id="consultation-request-card">
        <motion.h2
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          No bid details.
        </motion.h2>
      </div>
      )}
    </>
  )
}

export default ConsultationRequestCard;
