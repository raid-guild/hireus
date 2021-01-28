import React, { useContext } from 'react';

import { AppContext } from '../context/AppContext';

import signal_fire from '../assets/signal_fire.svg';

const Confirmation = () => {
  const context = useContext(AppContext);
  return (
    <div className='grid-container'>
      <div></div>
      <div className='confirmation-container'>
        <img src={signal_fire} width='250' alt='signal fire' />
        <h2 className='step-title'>The Fires Have Been Lit!</h2>
        <p>
          Your request is on its way. Expect a response from the Guild within 48
          hours. While you wait, your feedback can help us level up.
        </p>
        <div className='button-container'>
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
        </div>
      </div>
      <div></div>
    </div>
  );
};

export default Confirmation;
