import React, { useState, useContext } from 'react';
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

import { AppContext } from '../context/AppContext';

const PersonalInfo = () => {
  const context = useContext(AppContext);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [bio, setBio] = useState('');
  const [discordHandle, setDiscordHandle] = useState('');
  const [telegramHandle, setTelegramHandle] = useState('');
  const [twitterHandle, setTwitterHandle] = useState('');
  const [contactType, setContactType] = useState('Email');

  const [buttonClick, setButtonClickStatus] = useState(false);

  return (
    <div className='personal-info-container'>
      <h2 className='step-title'>Step 1 of 4: Personal Information</h2>
      <Stack mb={10} direction='row'>
        <FormControl
          isRequired
          isInvalid={name === '' && buttonClick ? true : false}
        >
          <FormLabel>Name</FormLabel>
          <Input
            placeholder='Your Name'
            onChange={(e) => setName(e.target.value)}
          />
        </FormControl>

        <FormControl
          isRequired
          isInvalid={email === '' && buttonClick ? true : false}
        >
          <FormLabel>
            Email address{' '}
            <Tooltip
              hasArrow
              placement='top'
              label='Please use an email address that you check often.'
              aria-label='disclaimer tooltip'
            >
              <InfoIcon />
            </Tooltip>
          </FormLabel>
          <Input
            type='email'
            placeholder='Your email address'
            onChange={(e) => setEmail(e.target.value)}
          />
        </FormControl>
      </Stack>
      <FormControl
        mb={10}
        isRequired
        isInvalid={bio === '' && buttonClick ? true : false}
      >
        <FormLabel>Your Bio</FormLabel>
        <Textarea
          placeholder='It’s very helpful to know your background, how familiar you are with web3, and crypto in general.'
          onChange={(e) => setBio(e.target.value)}
        />
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
          <Input
            placeholder='@handlename'
            onChange={(e) => setDiscordHandle(e.target.value)}
          />
        </FormControl>
        <FormControl>
          <FormLabel>Your Telegram Handle</FormLabel>
          <Input
            placeholder='@handlename'
            onChange={(e) => setTelegramHandle(e.target.value)}
          />
        </FormControl>
        <FormControl>
          <FormLabel>Your Twitter Handle</FormLabel>
          <Input
            placeholder='@handlename'
            onChange={(e) => setTwitterHandle(e.target.value)}
          />
        </FormControl>
      </Stack>
      <FormControl isRequired>
        <FormLabel as='legend'>Your Preferred Contact Channel</FormLabel>
        <RadioBox
          options={['Email', 'Discord', 'Telegram']}
          updateRadio={setContactType}
          name='contact-type'
          defaultValue='Discord'
        />
      </FormControl>

      <button
        id='next-stage-button'
        onClick={() => {
          if (name && email && bio) {
            context.setPersonalData(
              name,
              email,
              bio,
              discordHandle,
              telegramHandle,
              twitterHandle,
              contactType
            );
            setButtonClickStatus(false);
            context.updateStage('next');
          } else {
            setButtonClickStatus(true);
            alert('Please fill in all the required fields!');
          }
        }}
      >
        Next
      </button>
    </div>
  );
};

export default PersonalInfo;
