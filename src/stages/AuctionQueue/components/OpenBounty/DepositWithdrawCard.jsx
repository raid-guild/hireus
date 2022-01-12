/* eslint-disable no-undef */
import React, { useContext, useMemo } from 'react';
import { motion } from 'framer-motion';
import { utils } from 'web3';
import { round } from '../../../../utils';
import { AppContext } from '../../../../context/AppContext';

const DepositWithdrawCared = ({
  setShowSnackbar,
  setTxConfirmed,
  consultationDetails,
  lockTime,
  lockupEnded,
  refresh,
}) => {
  const {
    account,
    raidBalance,
    isApproved,
    depositAmount,
    withdrawalAmount,
    onChangeDepositAmount,
    onChangeWithdrawalAmount,
    onApprove,
    isDepositPending,
    onDeposit,
    onIncreaseBid,
    onWithdraw,
    isWithdrawPending,
  } = useContext(AppContext);

  const onDepositAndUpdate = async id => {
    setTxConfirmed(false);
    setShowSnackbar(true);
    if (consultationDetails.bid_id) {
      await onIncreaseBid(id);
    } else {
      await onDeposit(id);
    }
    setTxConfirmed(true);
    refresh();
  };

  const onApproveAndUpdate = async () => {
    setTxConfirmed(false);
    setShowSnackbar(true);
    await onApprove();
    setTxConfirmed(true);
    refresh();
  };

  const onWithdrawAndupdate = async id => {
    setTxConfirmed(false);
    setShowSnackbar(true);
    await onWithdraw(id);
    setTxConfirmed(true);
    refresh();
  };

  const insufficientBalance = useMemo(() => {
    if (!(depositAmount && raidBalance)) return false;
    try {
      return BigInt(utils.toWei(depositAmount || '0')) > BigInt(utils.toWei(raidBalance));
    } catch (e) {
      return false;
    }
  }, [raidBalance, depositAmount]);

  return (
    <div id="deposit-withdraw-card">
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', width: '48%' }}>
          <div>
            <p>Wallet Balance:</p>
            <h2>{round(raidBalance, 4)} $RAID</h2>
          </div>
          <div>
            {insufficientBalance && <p style={{ fontSize: '12px', marginBottom: '10px' }}>Insufficient balance</p>}
            <input
              id={'deposit-amount'}
              placeholder={`0`}
              type={'number'}
              min={'0'}
              step={'0.01'}
              value={depositAmount}
              onChange={e => onChangeDepositAmount(e.target.value)}
            />
            <button
              className="consultation-button"
              style={{ margin: '0', width: '100%' }}
              initial={{ x: '100vw' }}
              animate={{ x: 0 }}
              transition={{ delay: 1.3 }}
              disabled={
                depositAmount === '0' ||
                depositAmount === '' ||
                insufficientBalance ||
                isDepositPending
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
              {isDepositPending ? (
                <div className="spinner">Loading...</div>
              ) : isApproved ? (
                'Submit Bid'
              ) : (
                'Approve $RAID'
              )}
            </button>
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', width: '48%' }}>
          <div>
          <p>You deposited:</p>
            <h2>
              {consultationDetails.submitter === account
                ? round(utils.fromWei(consultationDetails.amount), 4)
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
              value={withdrawalAmount}
              onChange={e => onChangeWithdrawalAmount(e.target.value)}
            />
            <button
              className="consultation-button"
              style={{ margin: '0', width: '100%' }}
              initial={{ x: '100vw' }}
              animate={{ x: 0 }}
              transition={{ delay: 1.3 }}
              disabled={
                withdrawalAmount === '0' ||
                withdrawalAmount === '' ||
                BigInt(utils.toWei(withdrawalAmount)) >
                  BigInt(consultationDetails.amount) ||
                isWithdrawPending ||
                !lockupEnded
              }
              onClick={() => {
                onWithdrawAndupdate(consultationDetails.bid_id);
              }}
            >
              {isWithdrawPending ? (
                <div className="spinner">Loading...</div>
              ) : (
                'Withdraw Bid'
              )}
            </button>
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
