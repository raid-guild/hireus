/* eslint-disable no-undef */

import React, { useContext, useState } from 'react';
import { motion } from 'framer-motion';
import { utils } from 'web3';
import { shortenAddress } from '../../../../utils';
import { AppContext } from '../../../../context/AppContext';

export const OpenBounty = ({
  consultations,
  selectedConsultation,
  setSelectedConsultations,
}) => {
  const { account, connectWallet } = useContext(AppContext);
  const [consultationDetails, setConsultationDetails] = useState(null);

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

  return (
    <div className="hiringboard-container">
      <motion.h1
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.5 }}
      >
        Open Bounty
      </motion.h1>
      {consultationDetails && <div className="hiringboard-card-container">
        <div
          className="hiringboard-card"
          style={{ overflow: 'auto', height: 'auto' }}
        >
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.5 }}
          >
            Project Name: {consultationDetails.project_name}
          </motion.p>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.5 }}
          >
            Submitted On: {new Date(consultationDetails.created).toLocaleDateString()}
          </motion.p>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.5 }}
          >
            Total Bounty: {utils.fromWei(consultationDetails.amount)} $RAID
          </motion.p>
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
              Connect a wallet to add or remove $RAID to this bounty
            </motion.p>
            <button
              className='consultation-button consultation-button--close'
              initial={{ x: '100vw' }}
              animate={{ x: 0 }}
              transition={{ delay: 1.3 }}
              onClick={() => {
                connectWallet()
              }}
              style={{
                width: '200px',
              }}
            >
              Connect
            </button>
          </div>
        ) : (
          <DepositWithdrawCared consultationDetails={consultationDetails} />
        )}
      </div>}
      <button
        className='consultation-button consultation-button--close'
        initial={{ x: '100vw' }}
        animate={{ x: 0 }}
        transition={{ delay: 1.3 }}
        onClick={() => {
          setSelectedConsultations(null);
        }}
      >
        Close
      </button>
    </div>
  )
}

const DepositWithdrawCared = ({ consultationDetails }) => {
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
    onWithdraw,
    isWithdrawPending,
  } = useContext(AppContext);

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
          <h2>{raidBalance} RAID</h2>
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
              isApproved ? onDeposit(consultationDetails.id) : onApprove();
            }}
          >
            {isDepositPending
            ? <div className="spinner">Loading...</div>
            : isApproved
            ? 'Deposit Bounty'
            : 'Approve Deposit'}
          </button>
        </div>
        <div className="deposit-withdraw-card">
        <p>You Deposited:</p>
          <h2>
            {consultationDetails.submitter === account 
            ? utils.fromWei(consultationDetails.amount) : '0'} RAID
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
              || isWithdrawPending}
            onClick={async () => {
              await onWithdraw(consultationDetails.bid_id)
              consultationDetails.amount = (BigInt(consultationDetails.amount) - BigInt(utils.toWei(withdrawalAmount))).toString()
            }}
          >
            {isWithdrawPending
            ? <div className="spinner">Loading...</div>
            : 'Withdraw Bounty'}
          </button>
        </div>
      </div>
    </div>
  )
}
