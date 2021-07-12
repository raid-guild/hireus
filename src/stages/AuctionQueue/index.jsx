import React, { useEffect, useState } from 'react';
import './AuctionQueue.scss'

import { HiringBoard, OpenBounty } from './components';

const AuctionQueue = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [consultations, setConsultations] = useState([]);
  const [selectedConsultation, setSelectedConsultations] = useState(null);

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
    <div style={{ width: '100%' }}>
      {!selectedConsultation ? <HiringBoard
        isLoading={isLoading}
        consultations={consultations}
        setSelectedConsultations={setSelectedConsultations}
      /> : (
      <OpenBounty
        selectedConsultation={selectedConsultation}
        setSelectedConsultations={setSelectedConsultations}
        consultations={consultations}
      />
      )}
    </div>
  );
};

export default AuctionQueue;
