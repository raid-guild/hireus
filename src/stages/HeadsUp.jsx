import React, { useContext } from 'react';
import { motion } from 'framer-motion';

import { RAID_CONTRACT_ADDRESS } from '../constants';
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
          To request a consultation, please fill out the form starting on 
          the next screen (click Start). The more information you can 
          provide about the work you want to hire Raid Guild for, the 
          better. The form will have space for information about you / 
          your team, background and description for your project, specs 
          for the work, as well as a few questions to give us an initial 
          feel for your needs.
        </motion.p>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7, duration: 0.5 }}
        >
          Once you’ve filled out the form, you will also have an 
          opportunity to add the 500{' '}
          <a
            href="https://etherscan.io/token/0x6b175474e89094c44da98b954eedeac495271d0f"
            target="_blank"
            rel="noopener noreferrer"
            className="hiringboard-link"
          >
            DAI
          </a>
          {' '} fee 
          to be added to the consultation queue. After that, you can 
          return to the queue page itself to add a{' '}
          <a
            href={`https://blockscout.com/xdai/mainnet/address/${RAID_CONTRACT_ADDRESS}`}
            target="_blank"
            rel="noopener noreferrer"
            className="hiringboard-link"
          >
            $RAID
          </a>
          {' '}bid to move 
          up in the queue.
        </motion.p>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.5 }}
        >
          For more info about the consultation process, please refer to our{' '}
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
