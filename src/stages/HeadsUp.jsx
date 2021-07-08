import React, { useContext } from 'react';
import { motion } from 'framer-motion';

import { AppContext } from '../context/AppContext';

import rg__crest from '../assets/rg__crest.png';

const HeadsUp = () => {
  const context = useContext(AppContext);
  return (
    <div className='grid-container'>
      <div></div>
      <div className='headsup-container'>
        <motion.img
          id='rg-crest'
          src={rg__crest}
          alt='raidguild crest'
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        />

        <motion.h1
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          Hiring RaidGuild
        </motion.h1>

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

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7, duration: 0.5 }}
        >
          Raid Guild will prioritize the highest bounties when time and 
          specialists become available for new consultations. In times of 
          high demand, this might mean consultations with low or no bounty 
          have a longer turnaround.
        </motion.p>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.5 }}
        >
          For more info about the consultation check our{' '}
          <button id='faq' onClick={() => context.updateFaqModalStatus(true)}>
            docs
          </button>{'.'}
        </motion.p>
        <motion.a
          id='alchemy-badge'
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9, duration: 0.5 }}
          href={`https://alchemyapi.io/?r=${process.env.REACT_APP_ALCHEMY_AMPLIFY_ID}`}
          target='_blank'
          rel='noopener noreferrer'
        >
          <img
            style={{ width: '200px', height: '45px' }}
            src='https://res.cloudinary.com/saimano/image/upload/v1616692584/RaidGuild/alchemy_badge_chromatic.png'
            alt='Alchemy Supercharged'
          />
        </motion.a>
      </div>
      <div></div>
      <motion.button
        id='next-stage-button'
        initial={{ x: '100vw' }}
        animate={{ x: 0 }}
        transition={{ delay: 1.3 }}
        onClick={() => {
          context.updateStage('next');
        }}
      >
        Start
      </motion.button>
    </div>
  );
};

export default HeadsUp;
