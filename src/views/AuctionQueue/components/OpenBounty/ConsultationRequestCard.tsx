import React from 'react';
import { motion } from 'framer-motion';
import { utils } from 'ethers';
import { shortenAddress, round } from 'utils';
import type { ICombinedBid } from 'utils/types';
import {
  BLOCK_EXPLORER_URL,
  MIN_NUMBER_OF_SHARES,
  RAID_CONTRACT_ADDRESS,
} from 'constants/index';

import { ReactComponent as XDaiSvg } from 'assets/xdai.svg';

type IConsultationRequestCard = {
  account: string;
  consultationDetails: ICombinedBid;
  lockTime: string;
  lockupEnded: boolean;
  shares: number;
  isAcceptPending: boolean;
  onAcceptAndUpdate: (id: string) => void;
  updateCancelModalStatus: (status: boolean) => void;
  isCancelPending: boolean;
};

const ConsultationRequestCard: React.FC<IConsultationRequestCard> = ({
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
      {consultationDetails.bid_id ? (
        <div id="consultation-request-card">
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
              style={{ marginBottom: 0 }}
            >
              <span>Submitter:</span>
            </motion.p>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.5 }}
              style={{ marginBottom: 0 }}
            >
              {shortenAddress(consultationDetails.submitter)}
            </motion.p>
            <motion.a
              href={`${BLOCK_EXPLORER_URL}address/${consultationDetails.submitter}`}
              target={'_blank'}
              rel={'noopener noreferrer'}
              className="etherscan-container"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.5 }}
            >
              <XDaiSvg />
            </motion.a>
          </div>
          <div className="open-bid-details-flex">
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.5 }}
              style={{ marginBottom: 0 }}
            >
              <span>Submitted On:</span>
            </motion.p>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.5 }}
              style={{ marginBottom: 0 }}
            >
              {new Date(
                Number(consultationDetails.bidCreated) * 1000,
              ).toLocaleString()}
            </motion.p>
            <motion.a
              href={`${BLOCK_EXPLORER_URL}tx/${consultationDetails.createTxHash}`}
              target={'_blank'}
              rel={'noopener noreferrer'}
              className="etherscan-container"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.5 }}
            >
              <XDaiSvg />
            </motion.a>
          </div>
          <div className="open-bid-details-flex">
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.5 }}
              style={{ marginBottom: 0 }}
            >
              <span>Status:</span>
            </motion.p>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.5 }}
              style={{ marginBottom: 0 }}
            >
              {lockTime}
            </motion.p>
          </div>
          <div className="open-bid-details-flex">
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.5 }}
              style={{ marginBottom: 0 }}
            >
              <span>Total Bounty:</span>
            </motion.p>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.5 }}
              style={{ marginBottom: 0 }}
            >
              {round(utils.parseEther(consultationDetails.amount), 4)} $RAID
            </motion.p>
            <motion.a
              href={`${BLOCK_EXPLORER_URL}address/${RAID_CONTRACT_ADDRESS}`}
              target={'_blank'}
              rel={'noopener noreferrer'}
              className="etherscan-container"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.5 }}
            >
              <XDaiSvg />
            </motion.a>
          </div>
          {account && (
            <div className="open-bounty-buttons-container">
              {shares >= MIN_NUMBER_OF_SHARES && consultationDetails?.bid_id && (
                <motion.button
                  className="consultation-button"
                  style={{ marginTop: '20px' }}
                  initial={{ x: '100vw' }}
                  animate={{ x: 0 }}
                  transition={{ delay: 1.3 }}
                  disabled={isAcceptPending}
                  onClick={() => {
                    onAcceptAndUpdate(consultationDetails.bid_id);
                  }}
                >
                  {isAcceptPending ? (
                    <div className="spinner">Loading...</div>
                  ) : (
                    'Accept Request'
                  )}
                </motion.button>
              )}
              {consultationDetails?.submitter === account && lockupEnded && (
                <div>
                  <motion.button
                    className="consultation-button"
                    style={{ marginTop: '20px' }}
                    initial={{ x: '100vw' }}
                    animate={{ x: 0 }}
                    transition={{ delay: 1.3 }}
                    disabled={isCancelPending}
                    onClick={() => {
                      updateCancelModalStatus(true);
                    }}
                  >
                    {isCancelPending ? (
                      <div className="spinner">Loading...</div>
                    ) : (
                      'Cancel Bid'
                    )}
                  </motion.button>
                </div>
              )}
            </div>
          )}
        </div>
      ) : (
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
  );
};

export default ConsultationRequestCard;
