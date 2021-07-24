import React, { useContext } from 'react';
import { motion } from 'framer-motion';
import { utils } from 'web3';

import { round, shortenAddress } from '../../../../utils';
import { AppContext } from '../../../../context/AppContext';

export const HiringBoard = ({
  consultations,
  setSelectedConsultations,
}) => {
  const context = useContext(AppContext);

  return (
    <div className="hiringboard-container">
      <button
        className='consultation-button'
        initial={{ x: '100vw' }}
        animate={{ x: 0 }}
        transition={{ delay: 1.3 }}
        onClick={() => {
          context.connectWallet()
        }}
        style={{
          marginTop: '20px',
          position: 'absolute',
          right: '60px',
          top: '24px',
          width: '200px',
        }}
      >
        {context.account ? shortenAddress(context.account) : 'Connect'}
      </button>
      <div className="hiringboard-card-container">
        <div className="hiringboard-description-container">
          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            Hiring Raid Guild
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.5 }}
          >
            Every consultation has a base fee of $500{' '}
            <a
              href="https://blockscout.com/xdai/mainnet/tokens/0xe91D153E0b41518A2Ce8Dd3D7944Fa863463a97d"
              target="_blank"
              rel="noopener noreferrer"
              className="hiringboard-link"
            >
              wxDai
            </a>
            {' '}(on the{' '}
            <a
              href="https://www.xdaichain.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="hiringboard-link"
            >
              xDai chain
            </a>
            ). 
          </motion.p>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.5 }}
          >
            The demand for our work has been often high, so we’ve created a bidding 
            system to prioritize consultations, for which we use{' '}
            <a
              href="https://rinkeby.etherscan.io/token/0x982e00b16c313e979c0947b85230907fce45d50e"
              target="_blank"
              rel="noopener noreferrer"
              className="hiringboard-link"
            >
              $RAID
            </a>.
          </motion.p>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 0.5 }}
          >
            Adding a bid to a consultation submission is not required, but in periods 
            of high demand it might take longer to respond to consultation requests 
            without bids. There is a 7-day lockup period before you can withraw your 
            bids and/or cancel the submission.
          </motion.p>
          <div id='hiringboard-button-container'>
            <div>
              <button
                id='raid-token-button'
                className='consultation-button'
                initial={{ x: '100vw' }}
                animate={{ x: 0 }}
                transition={{ delay: 1.3 }}
                onClick={() => {
                  console.log('Link to raid');
                }}
              >
                $RAID Token
              </button>
            </div>
            <div>
              <button
                className='consultation-button'
                initial={{ x: '100vw' }}
                animate={{ x: 0 }}
                transition={{ delay: 1.3 }}
                onClick={() => {
                  context.updateStage('next');
                }}
              >
                New Consultation
              </button>
            </div>
          </div>
        </div>
        <div className="hiringboard-card">
          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.5 }}
          >
            Open bids:
          </motion.h1>
          {!consultations ? <p>Loading...</p> : consultations.length > 0 ? (
            <div className="bounty-list">
              {consultations.map((consultation, index) => (
                <BidListItem
                  key={index}
                  context={context}
                  consultation={consultation}
                  index={index}
                  setSelectedConsultations={setSelectedConsultations}
                />
              ))}
            </div>
          ) : <p>There are no bounties.</p>}
        </div>
      </div>
    </div>
  )
}

const BidListItem = ({ context, consultation, index, setSelectedConsultations }) => {
  return (
    <div key={index}>
      {consultation.from && (
        <div onClick={() => setSelectedConsultations(consultation.project_name)} className={`bounty-list-item bounty-list-item${index % 2 !== 0 && '--2'}`}>
          <div className="bounty-list-item-inner">
            <p
              style={{
                marginRight: '20px',
              }}
            >
              #{index < 9 ? `0${index + 1}` : index + 1}
            </p>
            <p className="bounty-detail">{new Date(consultation.created).toLocaleDateString()}</p>
            <p>
              {consultation.from === context.account
              ? consultation.project_name
              : shortenAddress(consultation.from)}
            </p>
          </div>
          <div className="bounty-list-item-inner">
            <p className="bounty-detail">{round(utils.fromWei(consultation.amount), 4)} $RAID</p>
            <button>open</button>
          </div>
        </div>
      )}
    </div>
  )
}
