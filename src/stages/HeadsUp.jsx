import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

import rg__crest from '../assets/rg__crest.png';

const HeadsUp = () => {
  return (
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
        After paying, our raiders will study any info, specs, docs and assets
        sent through this form and get in touch within 48 hours to schedule a
        date and time. The consultation itself lasts around 45 minutes and in it
        we will assess the challenges and discuss possible solution paths for
        your project.
      </motion.p>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7, duration: 0.5 }}
      >
        The amazing variety of projects that get in touch made us realize that
        we can’t promise a defined deliverable from this process. For some, the
        consultation itself can be a round of troubleshooting. For others, it
        can be an initial discussion on the viability of an idea.
      </motion.p>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8, duration: 0.5 }}
      >
        In all cases we strive to understand how is it that RaidGuild, with all
        the expertise available, can better help your vision. And when possible
        deliver a proposal for at least a milestone, with clear timeline, work
        and cost involved.
      </motion.p>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.9, duration: 0.5 }}
      >
        The funds go, in a small part, to the DAO, and the rest goes to the
        consultant(s).
      </motion.p>

      <Link to='/faq'>
        <motion.p
          id='faq'
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.5 }}
        >
          Read FAQ
        </motion.p>
      </Link>
    </div>
  );
};

export default HeadsUp;
