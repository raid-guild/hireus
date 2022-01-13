import { useContext } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
} from '@chakra-ui/react';
import type { ICombinedBid } from 'utils/types';

import { AppContext } from 'context/AppContext';

type IConfirmCancel = {
  consultationDetails: ICombinedBid;
  refresh: () => void;
  setTxConfirmed: React.Dispatch<React.SetStateAction<boolean>>;
  setShowSnackbar: React.Dispatch<React.SetStateAction<boolean>>;
}

const ConfirmCancel: React.FC<IConfirmCancel> = ({
  consultationDetails,
  refresh,
  setTxConfirmed,
  setShowSnackbar,
}) => {
  const context = useContext(AppContext);

  const onCancelAndUpdate = async (id: string) => {
    context.updateCancelModalStatus(false);
    setTxConfirmed(false);
    setShowSnackbar(true);
    await context.onCancel(id);
    setTxConfirmed(true);
    refresh();
  };

  return (
    <Modal
      onClose={() => context.updateCancelModalStatus(false)}
      isOpen={context.cancelModalStatus}
      isCentered
      scrollBehavior="inside"
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Are you sure you want to cancel this bid?</ModalHeader>
        <ModalBody>
          Canceling a bid will withdraw all $RAID in this contract and remove it
          from the list. Get in touch with us to receive your initial deposit
          back.
        </ModalBody>
        <ModalFooter>
          <Button
            style={{
              marginRight: '20px',
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
