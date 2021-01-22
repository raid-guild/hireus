import React, { useState } from 'react';
import {
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Stack,
  Tooltip
} from '@chakra-ui/react';

import { InfoIcon } from '@chakra-ui/icons';

import RadioBox from '../components/RadioBox';

const PersonalInfo = () => {
  const [contactType, setContactType] = useState('Email');

  console.log(contactType);

  return (
    <div className='personal-info-container'>
      <h2 className='step-title'>Step 1 of 4: Personal Infomation</h2>
      <Stack mb={10} direction='row'>
        <FormControl isRequired>
          <FormLabel>Name</FormLabel>
          <Input placeholder='Your Name' />
        </FormControl>
        <FormControl isRequired>
          <FormLabel>Email address</FormLabel>
          <Input type='email' placeholder='Your email address' />
        </FormControl>
      </Stack>
      <FormControl mb={10} isRequired>
        <FormLabel>Your Bio</FormLabel>
        <Textarea placeholder='Tell us about yourself' />
      </FormControl>
      <Stack mb={10} direction='row'>
        <FormControl>
          <FormLabel>
            Your Discord Handle{' '}
            <Tooltip
              hasArrow
              placement='top'
              label='Our main communications channel for work is Discord. In order to participate in the development process you will need to join our server.'
              aria-label='disclaimer tooltip'
            >
              <InfoIcon />
            </Tooltip>
          </FormLabel>
          <Input placeholder='@handlename' />
        </FormControl>
        <FormControl>
          <FormLabel>Your Telegram Handle</FormLabel>
          <Input placeholder='@handlename' />
        </FormControl>
        <FormControl>
          <FormLabel>Your Twitter Handle</FormLabel>
          <Input placeholder='@handlename' />
        </FormControl>
      </Stack>
      <FormControl isRequired>
        <FormLabel as='legend'>Your Preferred Contact Channel</FormLabel>
        <RadioBox
          options={['Email', 'Discord', 'Telegram']}
          updateRadio={setContactType}
          name='contact-type'
          defaultValue='Email'
        />
      </FormControl>
    </div>
  );
};

export default PersonalInfo;
