import React, { useState, useContext } from 'react';
import {
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Stack,
  Tooltip,
  useToast,
} from '@chakra-ui/react';

import { InfoIcon } from '@chakra-ui/icons';

import RadioBox from '../components/RadioBox';

import { AppContext } from '../context/AppContext';

const PersonalInfo = () => {
  const context = useContext(AppContext);
  const toast = useToast();

  const [contactType, setContactType] = useState(
    context.contactType || 'Discord',
  );

  const [buttonClick, setButtonClickStatus] = useState(false);

  return (
    <div className="personal-info-container">
      <h2 className="step-title">Step 1 of 4: Personal Information</h2>
      <Stack mb={10} direction="row">
        <FormControl
          isRequired
          isInvalid={context.name === '' && buttonClick ? true : false}
        >
          <FormLabel>Name</FormLabel>
          <Input
            placeholder="Your Name"
            onChange={context.inputChangeHandler}
            name="name"
            value={context.name}
          />
        </FormControl>

        <FormControl
          isRequired
          isInvalid={context.email === '' && buttonClick ? true : false}
        >
          <FormLabel>
            Email address{' '}
            <Tooltip
              hasArrow
              placement="top"
              label="Please use an email address that you check often."
              aria-label="disclaimer tooltip"
            >
              <InfoIcon />
            </Tooltip>
          </FormLabel>
          <Input
            type="email"
            placeholder="Your email address"
            onChange={context.inputChangeHandler}
            name="email"
            value={context.email}
          />
        </FormControl>
      </Stack>
      <FormControl
        mb={10}
        isRequired
        isInvalid={context.bio === '' && buttonClick ? true : false}
      >
        <FormLabel>Your Bio</FormLabel>
        <Textarea
          placeholder="It’s very helpful to know your background, how familiar you are with web3, and crypto in general."
          onChange={context.inputChangeHandler}
          name="bio"
          value={context.bio}
        />
      </FormControl>
      <Stack mb={10} direction="row">
        <FormControl>
          <FormLabel>
            Your Discord Handle{' '}
            <Tooltip
              hasArrow
              placement="top"
              label="Our main communications channel for work is Discord. In order to participate in the development process you will need to join our server."
              aria-label="disclaimer tooltip"
            >
              <InfoIcon />
            </Tooltip>
          </FormLabel>
          <Input
            placeholder="@handlename"
            onChange={context.inputChangeHandler}
            name="discordHandle"
            value={context.discordHandle}
          />
        </FormControl>
        <FormControl>
          <FormLabel>Your Telegram Handle</FormLabel>
          <Input
            placeholder="@handlename"
            name="telegramHandle"
            onChange={context.inputChangeHandler}
            value={context.telegramHandle}
          />
        </FormControl>
        <FormControl>
          <FormLabel>Your Twitter Handle</FormLabel>
          <Input
            placeholder="@handlename"
            name="twitterHandle"
            onChange={context.inputChangeHandler}
            value={context.twitterHandle}
          />
        </FormControl>
      </Stack>
      <FormControl isRequired>
        <FormLabel as="legend">Your Preferred Contact Channel</FormLabel>
        <RadioBox
          options={['Email', 'Discord', 'Telegram']}
          updateRadio={setContactType}
          name="contactType"
          defaultValue={context.contactType || contactType}
          value={context.contactType || contactType}
        />
      </FormControl>

      <button
        id="next-stage-button"
        onClick={() => {
          if (context.name && context.email && context.bio) {
            context.setPersonalData(contactType);
            setButtonClickStatus(false);
            context.updateStage('next');
          } else {
            setButtonClickStatus(true);
            toast({
              title: 'Please fill in all the required fields.',
              status: 'warning',
              duration: 3000,
              position: 'top',
            });
          }
        }}
      >
        Next
      </button>
    </div>
  );
};

export default PersonalInfo;
