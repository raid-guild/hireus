import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
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
          To hire RaidGuild, the first step is to schedule a paid consultation.
          After paying, our raiders will study any info, specs, docs, and assets
          sent through this form and get in touch within 48 hours to schedule
          the date and time for a call.
        </motion.p>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7, duration: 0.5 }}
        >
          In most cases, we use this time (and some time after) to understand
          your needs and deliver a work proposal a few days after the consult.
          In all cases, we strive to understand how is it that RaidGuild — with
          all the expertise available — can better help you solve problems and
          push your idea forward.
        </motion.p>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.5 }}
        >
          The consultation costs 300 DAI and requires a web3 enabled browser.
          For more info about the consultation, value and process, check our{' '}
          <Link id='faq' target='_blank' rel='noopener noreferrer' to='/faq'>
            FAQ
          </Link>
        </motion.p>
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
