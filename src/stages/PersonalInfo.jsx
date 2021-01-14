import React, { useState } from 'react';
import {
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Stack
} from '@chakra-ui/react';

import RadioBox from '../components/RadioBox';

const PersonalInfo = () => {
  const [contactType, setContactType] = useState('Email');

  console.log(contactType);

  return (
    <div className='personal-info-container'>
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
        <FormControl isRequired>
          <FormLabel>Your Discord Handle</FormLabel>
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
