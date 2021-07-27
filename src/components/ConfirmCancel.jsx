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

import { AppContext } from '../context/AppContext';

const ConfirmCancel = ({
  consultationDetails,
  setTxConfirmed,
  setShowSnackbar,
}) => {
  const context = useContext(AppContext);

  const onCancelAndUpdate = async (id) => {
    context.updateCancelModalStatus(false);
    setTxConfirmed(false);
    setShowSnackbar(true);
    await context.onCancel(id);
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
