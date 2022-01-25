import { utils } from 'ethers';
import { motion } from 'framer-motion';
import React, { useMemo, useState } from 'react';
import { round } from 'utils';
import type { ICombinedBid } from 'utils/types';

type DepositWithdrawCardProps = {
  address: string;
  setShowSnackbar: React.Dispatch<React.SetStateAction<boolean>>;
  setTxConfirmed: React.Dispatch<React.SetStateAction<boolean>>;
  consultationDetails: ICombinedBid;
  lockTime: string;
  lockupEnded: boolean;
  refresh: () => void;
};

const DepositWithdrawCared: React.FC<DepositWithdrawCardProps> = ({
  address,
  setShowSnackbar,
  setTxConfirmed,
  consultationDetails,
  lockTime,
  lockupEnded,
  refresh,
}) => {
  const [depositAmount, setDepositAmount] = useState('');
  const [withdrawAmount, setWithdrawAmount] = useState('');

  const [isApproved] = useState(false);
  const [isDepositing] = useState(false);
  const [isWithdrawing] = useState(false);

  const onDepositAndUpdate = async (id: string) => {
    setTxConfirmed(false);
    setShowSnackbar(true);
    if (consultationDetails.bid_id) {
      // await onIncreaseBid(id);
    } else {
      // await onDeposit(id);
    }
    setTxConfirmed(true);
    refresh();
  };

  const onApproveAndUpdate = async () => {
    setTxConfirmed(false);
    setShowSnackbar(true);
    // await onApprove();
    setTxConfirmed(true);
    refresh();
  };

  const onWithdrawAndupdate = async (id: string) => {
    setTxConfirmed(false);
    setShowSnackbar(true);
    // await onWithdraw(id);
    setTxConfirmed(true);
    refresh();
  };

  const insufficientBalance = useMemo(() => false, []);

  // const insufficientBalance = useMemo(() => {
  //   if (!(depositAmount && raidBalance)) return false;
  //   try {
  //     return (
  //       BigInt(utils.parseEther(depositAmount || '0').toString()) >
  //       BigInt(utils.parseEther(raidBalance).toString())
  //     );
  //   } catch (e) {
  //     return false;
  //   }
  // }, [raidBalance, depositAmount]);

  return (
    <div id="deposit-withdraw-card">
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            width: '48%',
          }}
        >
          <div>
            <p>Wallet Balance:</p>
            {/* <h2>{round(raidBalance, 4)} $RAID</h2> */}
            <h2>{round('500', 4)} $RAID</h2>
          </div>
          <div>
            {insufficientBalance && (
              <p style={{ fontSize: '12px', marginBottom: '10px' }}>
                Insufficient balance
              </p>
            )}
            <input
              id={'deposit-amount'}
              placeholder={`0`}
              type={'number'}
              min={'0'}
              step={'0.01'}
              value={depositAmount}
              onChange={e => setDepositAmount(e.target.value)}
            />
            <motion.button
              className="consultation-button"
              style={{ margin: '0', width: '100%' }}
              initial={{ x: '100vw' }}
              animate={{ x: 0 }}
              transition={{ delay: 1.3 }}
              disabled={
                depositAmount === '0' ||
                depositAmount === '' ||
                insufficientBalance ||
                isDepositing
              }
              onClick={() => {
                isApproved
                  ? onDepositAndUpdate(
                      consultationDetails.bid_id
                        ? consultationDetails.bid_id
                        : consultationDetails.airtable_id,
                    )
                  : onApproveAndUpdate();
              }}
            >
              {isDepositing ? (
                <div className="spinner">Loading...</div>
              ) : isApproved ? (
                'Submit Bid'
              ) : (
                'Approve $RAID'
              )}
            </motion.button>
          </div>
        </div>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            width: '48%',
          }}
        >
          <div>
            <p>You deposited:</p>
            <h2>
              {consultationDetails.submitter === address
                ? round(utils.formatEther(consultationDetails.amount), 4)
                : '0'}{' '}
              $RAID
            </h2>
          </div>
          <div>
            <input
              id={'deposit-amount'}
              placeholder={`0`}
              type={'number'}
              min={'0'}
              step={'0.01'}
              value={withdrawAmount}
              onChange={e => setWithdrawAmount(e.target.value)}
            />
            <motion.button
              className="consultation-button"
              style={{ margin: '0', width: '100%' }}
              initial={{ x: '100vw' }}
              animate={{ x: 0 }}
              transition={{ delay: 1.3 }}
              disabled={
                withdrawAmount === '0' ||
                withdrawAmount === '' ||
                BigInt(utils.parseEther(withdrawAmount).toString()) >
                  BigInt(consultationDetails.amount) ||
                isWithdrawing ||
                !lockupEnded
              }
              onClick={() => {
                onWithdrawAndupdate(consultationDetails.bid_id);
              }}
            >
              {isWithdrawing ? (
                <div className="spinner">Loading...</div>
              ) : (
                'Withdraw Bid'
              )}
            </motion.button>
          </div>
        </div>
      </div>
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        {!!consultationDetails.bid_id && !lockupEnded && (
          <motion.p
            id="lock-time"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.5 }}
          >
            {lockTime}
          </motion.p>
        )}
      </div>
    </div>
  );
};

export default DepositWithdrawCared;
