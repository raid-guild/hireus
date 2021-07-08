import React, { useContext } from 'react';
import { motion } from 'framer-motion';

import { AppContext } from '../context/AppContext';

const dummyData = [
  {
    date: '2021-06-11',
    name: 'Alice project',
    amount: 500
  },
  {
    date: '2021-06-17',
    name: 'Charlie project',
    amount: 450
  },
  {
    date: '2021-06-16',
    name: 'Bob project',
    amount: 100
  },
  {
    date: '2021-06-17',
    name: 'Ellie project',
    amount: 1
  },
  {
    date: '2021-06-17',
    name: 'Dan project',
    amount: 0
  }
];

const HiringBoard = () => {
  const context = useContext(AppContext);

  return (
    <div className="hiringboard-container">
      <motion.h1
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.5 }}
      >
        Hiring Board
      </motion.h1>
      <div className="hiringboard-card-container">
        <div className="hiringboard-card">
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.5 }}
          >
            To hire RaidGuild, you must first request a consultation. 
            Consultations have a base cost of $500 xDai, and are initially 
            ordered by date (ascending). Anyone can add a bounty (in $RAID) 
            to an open consultation.
          </motion.p>
          <div id='consultation-button-container'>
            <button
              id='new-consultation-button'
              initial={{ x: '100vw' }}
              animate={{ x: 0 }}
              transition={{ delay: 1.3 }}
              onClick={() => {
                console.log('Link to raid');
              }}
            >
              Get $RAID
            </button>
            <button
              id='new-consultation-button'
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
        <div className="hiringboard-card">
          <motion.h2
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.5 }}
          >
            Highest bounties:
          </motion.h2>
          <div className="bounty-list">
            {dummyData.map((item, index) => (
              <div key={index} className={`bounty-list-item bounty-list-item${index % 2 !== 0 && '--2'}`}>
                <div className="bounty-list-item-inner">
                  <p>{item.date}</p>
                  <p>{item.name}</p>
                </div>
                <div className="bounty-list-item-inner">
                  <p>{item.amount} $RAID</p>
                  <button>open</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HiringBoard;
