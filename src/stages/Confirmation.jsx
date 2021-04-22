import React, { useContext } from 'react';
import { motion } from 'framer-motion';

import { AppContext } from '../context/AppContext';

import signal_fire from '../assets/signal_fire.svg';

const Confirmation = () => {
  const context = useContext(AppContext);

  return (
    <div className='grid-container'>
      <div></div>
      <div className='confirmation-container'>
        <motion.img
          src={signal_fire}
          width='250'
          alt='signal fire'
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        />

        <motion.h2
          className='step-title'
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
        >
          The Fires Have Been Lit!
        </motion.h2>

        {context.hash && (
          <motion.p
            id='hash-text'
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.5 }}
          >
            <a
              href={`https://etherscan.io/tx/${context.hash}`}
              target='_blank'
              rel='noopener noreferrer'
            >
              {context.hash}
            </a>
            <i class='fas fa-link'></i>
          </motion.p>
        )}

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.5 }}
        >
          Your request is on its way. Expect a response from the Guild within 48
          hours. While we work, your feedback can help us level up.
        </motion.p>

        <motion.div
          className='button-container'
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9, duration: 0.5 }}
        >
          <button
            id='feedback-button'
            onClick={() => {
              context.updateStage('next');
            }}
          >
            Provide Feedback
          </button>
          <a
            href='https://discord.gg/rGFpfQf'
            target='_blank'
            rel='noopener noreferrer'
          >
            Join Discord
          </a>
        </motion.div>
      </div>
      <div></div>
    </div>
  );
};

export default Confirmation;
