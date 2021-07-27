import React, { useState } from 'react';
import './AuctionQueue.scss'
import { combineBids } from '../../utils';

import { useBids } from '../../hooks/useBids';

import { HiringBoard, OpenBounty } from './components';

const AuctionQueue = () => {
  const { contractBids } = useBids();
  const [consultations, setConsultations] = useState(null);
  const [selectedConsultation, setSelectedConsultations] = useState(null);

  const fetchBids = async () => {
    try {
      if (!contractBids) {
        return;
      }
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
        if (!contractBids) return;
        const combinedBids = await combineBids(data, contractBids);
        combinedBids.sort(function(a,b){
          return new Date(b.created) - new Date(a.created);
        });
        combinedBids.sort((a,b) => Number(b.amount)-Number(a.amount));
        setConsultations(combinedBids);
        console.log(combinedBids);
      })
      .catch((error) => {
        console.error(error);
      });
    } catch (err) {
      console.error(err);
    }
  }

  React.useEffect(() => {
    const fetchBids = async () => {
      try {
        if (!contractBids) {
          return;
        }
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
          if (!contractBids) return;
          const combinedBids = await combineBids(data, contractBids);
          combinedBids.sort(function(a,b){
            return new Date(b.created) - new Date(a.created);
          });
          combinedBids.sort((a,b) => Number(b.amount)-Number(a.amount));
          setConsultations(combinedBids);
          console.log(combinedBids);
        })
        .catch((error) => {
          console.error(error);
        });
      } catch (err) {
        console.error(err);
      }
    }

    fetchBids();
  }, [contractBids]);

  return (
    <div style={{ width: '100%' }}>
      {!selectedConsultation ? <HiringBoard
        consultations={consultations}
        setSelectedConsultations={setSelectedConsultations}
      /> : (
      <OpenBounty
        consultations={consultations}
        fetchBids={fetchBids}
        selectedConsultation={selectedConsultation}
        setSelectedConsultations={setSelectedConsultations}
        setConsultations={setConsultations}
      />
      )}
    </div>
  );
};

export default AuctionQueue;
