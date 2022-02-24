import { ReactComponent as XDaiSvg } from 'assets/xdai.svg';
import { utils } from 'ethers';
import { motion } from 'framer-motion';
import { useMembership } from 'hooks/useMembership';
import React from 'react';
import { StyledBodyText, StyledCard } from 'themes/styled';
import { round, shortenAddress } from 'utils';
import type { ICombinedBid } from 'utils/types';
import {
  BLOCK_EXPLORER_URL,
  MIN_NUMBER_OF_SHARES,
  RAID_CONTRACT_ADDRESS,
} from 'web3/constants';

type ConsultationRequestCardProps = {
  address: string;
  chainId: number;
  consultationDetails: ICombinedBid;
  isAccepting: boolean;
  isCancelling: boolean;
  lockTime: string;
  lockupEnded: boolean;
  onAccept: (id: string) => Promise<void>;
  openCancelModal: () => void;
};

const ConsultationRequestCard: React.FC<ConsultationRequestCardProps> = ({
  address,
  chainId,
  consultationDetails,
  isAccepting,
  isCancelling,
  lockTime,
  lockupEnded,
  onAccept,
  openCancelModal,
}) => {
  const { shares, isLoadingShares } = useMembership();

  return (
    <>
      {consultationDetails.bid_id ? (
        <StyledCard>
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
              {round(utils.formatEther(consultationDetails.amount), 4)} $RAID
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
          {address && !isLoadingShares && (
            <div className="open-bounty-buttons-container">
              {BigInt(shares) >= BigInt(MIN_NUMBER_OF_SHARES[chainId]) &&
                consultationDetails?.bid_id && (
                  <motion.button
                    className="consultation-button"
                    style={{ marginTop: '20px' }}
                    initial={{ x: '100vw' }}
                    animate={{ x: 0 }}
                    transition={{ delay: 1.3 }}
                    disabled={isAccepting}
                    onClick={() => {
                      onAccept(consultationDetails.bid_id);
                    }}
                  >
                    {isAccepting ? (
                      <div className="spinner">Loading...</div>
                    ) : (
                      'Accept Request'
                    )}
                  </motion.button>
                )}
              {consultationDetails?.submitter === address && lockupEnded && (
                <div>
                  <motion.button
                    className="consultation-button"
                    style={{ marginTop: '20px' }}
                    initial={{ x: '100vw' }}
                    animate={{ x: 0 }}
                    transition={{ delay: 1.3 }}
                    disabled={isCancelling}
                    onClick={openCancelModal}
                  >
                    {isCancelling ? (
                      <div className="spinner">Loading...</div>
                    ) : (
                      'Cancel Bid'
                    )}
                  </motion.button>
                </div>
              )}
            </div>
          )}
        </StyledCard>
      ) : (
        <StyledCard mb={'32px'} p={'32px'}>
          <StyledBodyText>No bid details.</StyledBodyText>
        </StyledCard>
      )}
    </>
  );
};

export default ConsultationRequestCard;
