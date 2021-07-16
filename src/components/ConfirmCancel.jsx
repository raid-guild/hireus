import React, { useContext } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button
} from '@chakra-ui/react';
import gql from 'graphql-tag';
import { Client } from 'urql';
import { combineBids } from '../utils'

import { AppContext } from '../context/AppContext';


const graphqlClient = new Client({ url: 'https://api.thegraph.com/subgraphs/name/slgraham/guildauctionqueues-rinkeby' ?? '' });

const BIDS_QUERY = gql`
  query {
    bids(first: 100) {
      id
      amount
      createdAt
      details
      createTxHash
      status
      submitter {
        id
      }
      increases {
        increasedAt
        amount
        increasedBy
        increaseTxHash
      }
      withdraws {
        withdrawnAt
        amount
        withdrawTxHash
      }
    }
  }
`;

const ConfirmCancel = ({
  consultationDetails,
  setTxConfirmed,
  setShowSnackbar,
  setConsultations,
}) => {
  const context = useContext(AppContext);

  const fetchBids = async () => {
    console.log('Fetching...');
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
      })
      .catch((error) => {
        console.error(error);
      });
    } catch (err) {
      console.error(err);
    }
  }

  const onCancelAndUpdate = async (id) => {
    context.updateCancelModalStatus(false);
    setTxConfirmed(false);
    setShowSnackbar(true);
    await context.onCancel(id);
    await fetchBids();
    setTxConfirmed(true);
  }

  return (
    <Modal
      onClose={() => context.updateCancelModalStatus(false)}
      isOpen={context.cancelModalStatus}
      isCentered
      scrollBehavior='inside'
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          Are you sure you want to cancel this bid?
        </ModalHeader>
        <ModalBody>
          Canceling a bid will withdraw all $RAID in this contract and remove it from the list. Get in touch with us to receive your initial deposit back.
        </ModalBody>
        <ModalFooter>
          <Button
            style={{
              marginRight: '20px'
            }}
            onClick={() => {
              context.updateCancelModalStatus(false);
            }}
          >
            Close
          </Button>
          <Button
            onClick={() => {
              onCancelAndUpdate(consultationDetails.bid_id);
            }}
          >
            Cancel Bid
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default ConfirmCancel;
