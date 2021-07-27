import React, { useContext, useState } from 'react';
import './AuctionQueue.scss'
import { combineBids } from '../../utils';

import { getBids } from '../../graphql/getBids';
import { AppContext } from '../../context/AppContext';

import { HiringBoard, OpenBounty } from './components';

const POLL_INTERVAL = 5000;

const AuctionQueue = () => {
  const {
    raidBalance,
  } = useContext(AppContext);
  const [consultations, setConsultations] = useState(null);
  const [selectedConsultation, setSelectedConsultations] = useState(null);

  React.useEffect(() => {
    let isSubscribed = true;
    const interval = setInterval(() => {
      getBids().then(bids => {
        if (isSubscribed && bids) {
          fetch(`https://guild-keeper.herokuapp.com/hireus-v2/awaiting-raids`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              "key":process.env.REACT_APP_ACCESS_KEY
            })
          })
          .then((res) => res.json())
          .then(async (data) => {
            const combinedBids = await combineBids(data, bids);
            combinedBids.sort(function(a,b){
              return new Date(b.created) - new Date(a.created);
            });
            combinedBids.sort((a,b) => Number(b.amount)-Number(a.amount));
            setConsultations(combinedBids);
            console.log(combinedBids);
          })
        }
      });
    }, POLL_INTERVAL);

    return () => {
      isSubscribed = false;
      clearInterval(interval);
    };
  }, []);

  return (
    <div style={{ width: '100%' }}>
      {!selectedConsultation ? <HiringBoard
        consultations={consultations}
        setSelectedConsultations={setSelectedConsultations}
      /> : (
      <OpenBounty
        consultations={consultations}
        selectedConsultation={selectedConsultation}
        setSelectedConsultations={setSelectedConsultations}
        setConsultations={setConsultations}
      />
      )}
    </div>
  );
};

export default AuctionQueue;
