import React, { useContext } from 'react';
import { motion } from 'framer-motion';

import { AppContext } from '../context/AppContext';

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
          <div>
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
          Right card.
        </div>
      </div>
    </div>
  );
};

export default HiringBoard;
