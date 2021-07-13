import React, { useEffect, useState } from 'react';
import { utils } from 'web3';
import './AuctionQueue.scss'

import { useBids } from '../../hooks/useBids';

import { HiringBoard, OpenBounty } from './components';

const AuctionQueue = () => {
  const { bids } = useBids();
  const [isLoading, setIsLoading] = useState(false);
  const [consultations, setConsultations] = useState([]);
  const [selectedConsultation, setSelectedConsultations] = useState(null);

  useEffect(() => {
    setIsLoading(true);
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
        if (!bids) return;
        const combinedBids = await combineBids(data, bids);
        console.log(combinedBids);
        combinedBids.sort(function(a,b){
          return new Date(b.created) - new Date(a.created);
        });
        combinedBids.sort((a,b) => Number(b.amount)-Number(a.amount));
        setConsultations(combinedBids);
      })
      .catch((error) => {
        console.log(error);
      });
    setIsLoading(false);
  }, [bids]);

  const combineBids = async (consultations, bids) => {
    const combinedBids = [];
    consultations.forEach((consultation) => {
      const combinedBid = {
        project_name: consultation.project_name,
        created: consultation.created,
        airtable_id: consultation.id,
        bid_id: null,
        amount: '0',
        submitter: '',
      }
      bids.forEach((bid) => {
        let airtableId = utils.hexToAscii(bid.details);
        airtableId =  airtableId.replace(/\0.*$/g,'');
        if (consultation.id === airtableId) {
          combinedBid.bid_id = utils.hexToNumber(bid.id.replace('0x3a9f3147742e51efba1f04ff26e8dc95978dccb4-', ''));
          combinedBid.amount = bid.amount;
          combinedBid.submitter = utils.toChecksumAddress(bid.submitter.id);
        }
      })
      combinedBids.push(combinedBid);
    })

    return combinedBids;
  }

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
