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
  AlertDialogOverlay
} from '@chakra-ui/react';

import { AppContext } from '../context/AppContext';

import RadioBox from '../components/RadioBox';
import { Link } from 'react-router-dom';

const AdditionalInfo = () => {
  const context = useContext(AppContext);
  const [priority, setPriority] = useState('Fast & Polished');

  const onClose = () => context.updateDialogState();
  const cancelRef = React.useRef();

  console.log(priority);

  return (
    <div className='additional-info-container'>
      <h2 className='step-title'>Step 4 of 4: Additional Information</h2>
      <FormControl mb={10} isRequired>
        <FormLabel>How can we help?</FormLabel>
        <Textarea placeholder='Describe how you think RaidGuild can help?' />
      </FormControl>

      <Stack mb={10} direction='row'>
        <FormControl isRequired>
          <FormLabel as='legend'>What's the priority?</FormLabel>
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
          isChecked={context.is_not_paid}
          colorScheme='red'
          onChange={() => context.updateDialogState()}
        >
          Continue without paying
        </Checkbox>
      </FormControl>

      <AlertDialog
        isOpen={context.is_dialog_open}
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
              Note that submissions without payment might not be picked up. Are
              you sure?
            </AlertDialogBody>

            <AlertDialogFooter>
              <button
                className='dialog-button-cancel'
                ref={cancelRef}
                onClick={() => context.updatePaymentChoice(false)}
              >
                Cancel
              </button>
              <button
                className='dialog-button-select'
                colorScheme='red'
                onClick={() => context.updatePaymentChoice(true)}
                ml={3}
              >
                {context.is_not_paid ? 'Uncheck' : 'Continue'}
              </button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>

      {context.is_paid && (
        <Link to='/faq'>
          <p id='payment-info-link'>What am I paying for?</p>
        </Link>
      )}
    </div>
  );
};

export default AdditionalInfo;
