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
          To hire RaidGuild, the first step is to book a paid consultation. The
          consultation costs 300 DAI and requires a web3 enabled browser. After
          receiving your request, our raiders will study any info, specs, docs
          and assets sent along with your proposal. A Cleric of the Guild will
          reach out to confirm a time and date for the first call within 48
          hours.
        </motion.p>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7, duration: 0.5 }}
        >
          In most cases, we use this time (and some time after) to understand
          your needs and deliver a comprehensive statement of work, ensuring the
          key points and timeline are locked in before we begin. In all cases,
          we strive to deeply understand how RaidGuild — with all the expertise
          available — can better help you solve problems and bring your visions
          into reality.
        </motion.p>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.5 }}
        >
          For more info about the consultation, value and process, check our{' '}
          <button id='faq' onClick={() => context.updateFaqModalStatus(true)}>
            FAQ.
          </button>{' '}
          We look forward to raiding with you.
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
