import React, { useState, useContext } from 'react';
import {
  FormControl,
  FormLabel,
  Textarea,
  Stack,
  Checkbox,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  Tooltip,
  useToast,
  Button
} from '@chakra-ui/react';

import { InfoIcon } from '@chakra-ui/icons';

import { AppContext } from '../context/AppContext';

import RadioBox from '../components/RadioBox';

const AdditionalInfo = () => {
  const context = useContext(AppContext);
  const toast = useToast();

  const [specificInfo, setSpecificInfo] = useState('');
  const [priority, setPriority] = useState('Fast & Polished');

  const [buttonClick, setButtonClickStatus] = useState(false);

  const [checkBoxStatus, setCheckBoxStatus] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState(true);
  const [dialogStatus, setDialogStatus] = useState(false);

  const onClose = () => setDialogStatus(false);
  const cancelRef = React.useRef();

  const modalConfirmHandler = () => {
    setPaymentStatus(false);
    setCheckBoxStatus(true);
    onClose();
  };

  const checkBoxChangeHandler = () => {
    if (checkBoxStatus) {
      setPaymentStatus(true);
      setCheckBoxStatus(false);
    }
    if (!checkBoxStatus) {
      setDialogStatus(true);
    }
  };

  return (
    <div className='additional-info-container'>
      <h2 className='step-title'>Step 4 of 4: Additional Information</h2>
      <FormControl
        mb={10}
        isRequired
        isInvalid={specificInfo === '' && buttonClick ? true : false}
      >
        <FormLabel>Do you need something very specific?</FormLabel>
        <Textarea
          placeholder='In plain words, tell us how you think we can best help you.'
          onChange={(e) => setSpecificInfo(e.target.value)}
        />
      </FormControl>

      <Stack mb={10} direction='row'>
        <FormControl isRequired>
          <FormLabel as='legend'>
            What are your priorities?{' '}
            <Tooltip
              hasArrow
              placement='top'
              label='It can be fast, polished, or inexpensive.'
              aria-label='disclaimer tooltip'
            >
              <InfoIcon />
            </Tooltip>
          </FormLabel>
          <RadioBox
            options={[
              'Fast & Polished',
              'Fast & Inexpensive',
              'Polished & Inexpensive'
            ]}
            updateRadio={setPriority}
            name='priority'
            defaultValue='Fast & Polished'
          />
        </FormControl>
      </Stack>

      <FormControl>
        <Checkbox
          isChecked={checkBoxStatus}
          colorScheme='red'
          onChange={checkBoxChangeHandler}
        >
          Continue without paying
        </Checkbox>
      </FormControl>

      <AlertDialog
        isOpen={dialogStatus}
        leastDestructiveRef={cancelRef}
        onClose={onClose}
        isCentered
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize='lg' fontWeight='bold'>
              Disclaimer
            </AlertDialogHeader>

            <AlertDialogBody>
              You may submit this form without paying, but we can’t guarantee
              that you will receive a response.
              <br />
              <br />
              There’s currently a long waitlist for paid submissions, so it’s
              highly unlikely you will receive a response without paying the
              fee.
            </AlertDialogBody>

            <AlertDialogFooter>
              <button
                className='dialog-button-cancel'
                ref={cancelRef}
                onClick={onClose}
              >
                Cancel
              </button>
              <button
                className='dialog-button-select'
                colorScheme='red'
                onClick={modalConfirmHandler}
                ml={3}
              >
                Continue
              </button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>

      {paymentStatus && (
        <button
          id='payment-info-link'
          onClick={() => context.updateFaqModalStatus(true)}
        >
          What am I paying for?
        </button>
      )}

      {context.chainID === '' ||
      context.chainID === 1 ||
      context.chainID === '0x1' ? (
        <Button
          isLoading={context.submitting}
          loadingText='Submitting'
          id='chakra-button'
          onClick={() => {
            if (specificInfo !== '') {
              setButtonClickStatus(false);
              context.submitAll(specificInfo, priority, paymentStatus);
              if (context.notEnoughBalance) {
                toast({
                  title: 'Your wallet has insufficient DAI balance.',
                  status: 'warning',
                  duration: 3000,
                  position: 'top'
                });
              }
            } else {
              setButtonClickStatus(true);
              toast({
                title: 'Please fill in all the required fields.',
                status: 'warning',
                duration: 3000,
                position: 'top'
              });
            }
          }}
        >
          {paymentStatus ? 'Pay 500 DAI & Submit' : 'Submit'}
        </Button>
      ) : (
        <p id='wrong-network-text'>Switch to Mainnet</p>
      )}
    </div>
  );
};

export default AdditionalInfo;
