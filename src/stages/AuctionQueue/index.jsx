import React, { useEffect, useState } from 'react';
import './AuctionQueue.scss'

import { useBids } from '../../hooks/useBids';

import { HiringBoard, OpenBounty } from './components';

const AuctionQueue = () => {
  const { bids } = useBids();
  const [isLoading, setIsLoading] = useState(false);
  const [consultations, setConsultations] = useState([]);
  const [selectedConsultation, setSelectedConsultations] = useState(null);
  console.log(bids);

  useEffect(() => {
    setIsLoading(true);
    fetch(`https://guild-keeper.herokuapp.com/hireus-v2/awaiting-raids`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        "key":process.env.REACT_APP_KEEPER_KEY
      })
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        data.sort(function(a,b){
          return new Date(b.created) - new Date(a.created);
        });
        setConsultations(data);
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
