import React, { useContext, useEffect, useState } from 'react';
import { motion } from 'framer-motion';

import { AppContext } from '../context/AppContext';

const HiringBoard = () => {
  const context = useContext(AppContext);
  const [isLoading, setIsLoading] = useState(false);
  const [consultations, setConsultations] = useState([]);

  useEffect(() => {
    setIsLoading(true);
    fetch(`https://api.airtable.com/v0/${process.env.REACT_APP_AIRTABLE_BASE}/${process.env.REACT_APP_AIRTABLE_TABLE}?api_key=${process.env.REACT_APP_AIRTABLE_KEY}`)
      .then((res) => res.json())
      .then((data) => {
        const records = data.records;
        const consultations = records.filter((record) => {
          return record.fields['Raid Status'] === "Awaiting";
        });
        console.log(consultations);
        setConsultations(consultations);
      })
      .catch((error) => {
        console.log(error);
      });
    setIsLoading(false);
  }, []);

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
          {isLoading ? <p>Loading...</p> : consultations.length > 0 ? (
            <div className="bounty-list">
              {consultations.map((consultation, index) => (
                <div key={index} className={`bounty-list-item bounty-list-item${index % 2 !== 0 && '--2'}`}>
                  <div className="bounty-list-item-inner">
                    <p id="bounty-detail">{new Date(consultation.fields['Created']).toLocaleDateString()}</p>
                    <p>
                      {consultation.fields['Project Name'].length > 18
                        ? consultation.fields['Project Name'].slice(0, 17) + '...'
                        : consultation.fields['Project Name']
                      }
                    </p>
                  </div>
                  <div className="bounty-list-item-inner">
                    <p id="bounty-detail">0 $RAID</p>
                    <button>open</button>
                  </div>
                </div>
              ))}
            </div>
          ) : <p>There are no bounties.</p>}
        </div>
      </div>
    </div>
  );
};

export default HiringBoard;
