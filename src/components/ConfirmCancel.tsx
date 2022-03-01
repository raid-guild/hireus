import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from '@chakra-ui/react';

type IConfirmCancel = {
  onCancel: () => void;
  isCancelling: boolean;
  isOpen: boolean;
  onClose: () => void;
};

const ConfirmCancel: React.FC<IConfirmCancel> = ({
  onCancel,
  isCancelling,
  isOpen,
  onClose,
}) => {
  return (
    <Modal onClose={onClose} isOpen={isOpen} isCentered scrollBehavior="inside">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Are you sure you want to cancel this bid?</ModalHeader>
        <ModalBody>
          Canceling a bid will withdraw all $RAID in this contract and remove it
          from the list.
        </ModalBody>
        <ModalFooter>
          <Button
            style={{
              marginRight: '20px',
            }}
            onClick={onClose}
          >
            Close
          </Button>
          <Button
            disabled={isCancelling}
            onClick={() => {
              onCancel();
              onClose();
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
