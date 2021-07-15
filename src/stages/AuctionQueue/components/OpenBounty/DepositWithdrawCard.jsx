/* eslint-disable no-undef */

import React, { useContext, useState } from 'react';
import { motion } from 'framer-motion';
import { utils } from 'web3';
import gql from 'graphql-tag';
import { Client } from 'urql';
import { shortenAddress, combineBids } from '../../../../utils';
import { AppContext } from '../../../../context/AppContext';
import { LOCKUP_PERIOD } from '../../../../constants/index';

const graphqlClient = new Client({ url: 'https://api.thegraph.com/subgraphs/name/slgraham/guildauctionqueues-rinkeby' ?? '' });

const BIDS_QUERY = gql`
  query {
    bids(first: 100) {
      id
      amount
      createdAt
      details
      createTxHash
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

const DepositWithdrawCared = ({
  setShowSnackbar,
  setTxConfirmed,
  consultationDetails,
  setConsultations,
  lockTime,
}) => {
  const [lockupEnded, setLockupEnded] = useState(false);
  const {
    account,
    disconnectWallet,
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

  React.useEffect(() => {
    const dateNow = Date.now();
    const lockupEnds = (Number(consultationDetails.bidCreated) * 1000) + LOCKUP_PERIOD;
    if (dateNow > lockupEnds) {
      setLockupEnded(true);
    } else {
      setLockupEnded(false);
    }
  }, [consultationDetails]);

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
        console.log(error);
      });
    } catch (err) {
      console.error(err);
    }
  }

  const onDepositAndUpdate = async (id) => {
    await setTxConfirmed(false);
    await setShowSnackbar(true);
    if (consultationDetails.bid_id) {
      await onIncreaseBid(id);
    } else {
      await onDeposit(id);
    }
    await fetchBids();
    setTxConfirmed(true);
  }

  const onApproveAndUpdate = async () => {
    await setTxConfirmed(false);
    await setShowSnackbar(true);
    await onApprove();
    setTxConfirmed(true);
  }

  const onWithdrawAndupdate = async (id) => {
    await setTxConfirmed(false);
    await setShowSnackbar(true);
    await onWithdraw(id);
    await fetchBids();
    setTxConfirmed(true);
  }

  return (
    <div
      className="hiringboard-card"
      style={{ overflow: 'auto', height: 'auto' }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <div>
          <motion.p
            className="connected-account"
            style={{
              margin: 0,
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.5 }}
          >
            connected as:
          </motion.p>
          <motion.p
            className="connected-account"
            style={{
              margin: 0,
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.5 }}
          >
            {shortenAddress(account)}
          </motion.p>
        </div>
        <button
          className='consultation-button consultation-button--disconnect'
          initial={{ x: '100vw' }}
          animate={{ x: 0 }}
          transition={{ delay: 1.3 }}
          onClick={() => {
            disconnectWallet()
          }}
        >
          Disconnect
        </button>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <div
          className="deposit-withdraw-card"
        >
          <p>Wallet Balance:</p>
          <h2>{raidBalance} $RAID</h2>
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
              isApproved ? onDepositAndUpdate(consultationDetails.bid_id) : onApproveAndUpdate();
            }}
          >
            {isDepositPending
            ? <div className="spinner">Loading...</div>
            : isApproved
            ? 'Submit Bid'
            : 'Approve Bid'}
          </button>
        </div>
        <div className="deposit-withdraw-card">
        <p>Your bid:</p>
          <h2>
            {consultationDetails.submitter === account 
            ? utils.fromWei(consultationDetails.amount) : '0'} $RAID
          </h2>
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
      <motion.p
        id="lock-time"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.5 }}
      >
        {lockTime}
      </motion.p>
    </div>
  )
}

export default DepositWithdrawCared;
