import React, { useState } from 'react';
import gql from 'graphql-tag';
import { Client } from 'urql';
import './AuctionQueue.scss'
import { combineBids } from '../../utils';

import { HiringBoard, OpenBounty } from './components';

const graphqlClient = new Client({ url: 'https://api.thegraph.com/subgraphs/name/slgraham/guildauctionqueues-rinkeby' ?? '' });

const BIDS_QUERY = gql`
  query{
    bids(first: 100) {
      id
      amount
      createdAt
      details
      submitter {
        id
      }
    }
  }
`;

const AuctionQueue = () => {
  const [consultations, setConsultations] = useState([]);
  const [selectedConsultation, setSelectedConsultations] = useState(null);

  React.useEffect(() => {
    const fetchBids = async () => {
      try {
        const result = await graphqlClient.query(BIDS_QUERY).toPromise();
        if (!result?.data) {
          return;
        }
        const contractBids = result.data.bids;
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
          console.log(error);
        });
      } catch (err) {
        console.error(err);
      }
    }
    fetchBids();
  }, []);

  return (
    <div style={{ width: '100%' }}>
      {!selectedConsultation ? <HiringBoard
        consultations={consultations}
        setSelectedConsultations={setSelectedConsultations}
      /> : (
      <OpenBounty
        selectedConsultation={selectedConsultation}
        setSelectedConsultations={setSelectedConsultations}
        consultations={consultations}
        setConsultations={setConsultations}
      />
      )}
    </div>
  );
};

export default AuctionQueue;
