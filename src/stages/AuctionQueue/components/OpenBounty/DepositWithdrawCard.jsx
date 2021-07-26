/* eslint-disable no-undef */
import React, { useContext } from 'react';
import { motion } from 'framer-motion';
import { utils } from 'web3';
import { BIDS_QUERY, graphqlClient } from '../../../../constants/index';
import { combineBids, round } from '../../../../utils';
import { AppContext } from '../../../../context/AppContext';

const DepositWithdrawCared = ({
  setShowSnackbar,
  setTxConfirmed,
  consultationDetails,
  setConsultations,
  lockTime,
  lockupEnded,
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

  const fetchBids = async () => {
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

  const onDepositAndUpdate = async (id) => {
    setTxConfirmed(false);
    setShowSnackbar(true);
    if (consultationDetails.bid_id) {
      await onIncreaseBid(id);
    } else {
      await onDeposit(id);
    }
    await fetchBids();
    setTxConfirmed(true);
  }

  const onApproveAndUpdate = async () => {
    setTxConfirmed(false);
    setShowSnackbar(true);
    await onApprove();
    setTxConfirmed(true);
  }

  const onWithdrawAndupdate = async (id) => {
    setTxConfirmed(false);
    setShowSnackbar(true);
    await onWithdraw(id);
    await fetchBids();
    setTxConfirmed(true);
  }

  return (
    <div id="deposit-withdraw-card">
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <div style={{ width: '48%' }}>
          <p>Wallet Balance:</p>
          <h2>{round(raidBalance, 4)} $RAID</h2>
          <div>
            <input
              id={'deposit-amount'}
              placeholder={`0`}
              type={'number'}
              min={'0'}
              step={'0.01'}
              value={depositAmount}
              onChange={(e) => onChangeDepositAmount(e.target.value)}
            />
            <button
              className='consultation-button'
              style={{ margin: '0', width: '100%' }}
              initial={{ x: '100vw' }}
              animate={{ x: 0 }}
              transition={{ delay: 1.3 }}
              disabled={depositAmount === '0' || depositAmount === '' || isDepositPending}
              onClick={() => {
                isApproved
                  ? onDepositAndUpdate(consultationDetails.bid_id
                  ? consultationDetails.bid_id
                  : consultationDetails.airtable_id)
                  : onApproveAndUpdate();
              }}
            >
              {isDepositPending
              ? <div className="spinner">Loading...</div>
              : isApproved
              ? 'Submit Bid'
              : 'Approve $RAID'}
            </button>
          </div>
        </div>
        <div style={{ width: '48%' }}>
          <p>You deposited:</p>
          <h2>
            {consultationDetails.submitter === account 
            ? round(utils.fromWei(consultationDetails.amount), 4) : '0'} $RAID
          </h2>
          <div>
            <input
              id={'deposit-amount'}
              placeholder={`0`}
              type={'number'}
              min={'0'}
              step={'0.01'}
              value={withdrawalAmount}
              onChange={(e) => onChangeWithdrawalAmount(e.target.value)}
            />
            <button
              className='consultation-button'
              style={{ margin: '0', width: '100%' }}
              initial={{ x: '100vw' }}
              animate={{ x: 0 }}
              transition={{ delay: 1.3 }}
              disabled={
                withdrawalAmount === '0' 
                || withdrawalAmount === '' 
                || BigInt(utils.toWei(withdrawalAmount)) > BigInt(consultationDetails.amount)
                || isWithdrawPending
                || !lockupEnded}
              onClick={() => {
                onWithdrawAndupdate(consultationDetails.bid_id)
              }}
            >
              {isWithdrawPending
              ? <div className="spinner">Loading...</div>
              : 'Withdraw Bid'}
            </button>
          </div>
        </div>
      </div>
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        {(consultationDetails.bid_id && !lockupEnded) && <motion.p
          id="lock-time"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
        >
          {lockTime}
        </motion.p>}
      </div>
    </div>
  )
}

export default DepositWithdrawCared;
