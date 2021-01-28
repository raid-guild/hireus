import React, { useState } from 'react';
import {
  FormControl,
  FormLabel,
  Stack,
  Checkbox,
  CheckboxGroup,
  Tooltip
} from '@chakra-ui/react';

import { InfoIcon } from '@chakra-ui/icons';

import DayPickerInput from 'react-day-picker/DayPickerInput';
import 'react-day-picker/lib/style.css';

import RadioBox from '../components/RadioBox';

const checkbox_options = [
  'DAO (Design, Development)',
  'Development (Frontend, Backend)',
  'NFTs (contracts, art, tokenomics)',
  'Marketing (copy writing, strategy)',
  'Smart Contracts (Solidity, Audits)',
  'Strategy (product management, launch planning, agile/SCRUM)',
  'Tokenomics (incentives, distribution, rewards)',
  'UX (Research, Testing, User Stories)',
  'Visual Design (Branding, Illustration, etc)',
  'Help me figure out what I need'
];

const RequiredServices = () => {
  const [selectedDay, setSelectedDay] = useState('');
  const [budgetRange, setBudgetRange] = useState('$5000 - $20000');

  console.log(selectedDay, budgetRange);

  return (
    <div className='required-services-container'>
      <h2 className='step-title'>Step 3 of 4: Required Services</h2>
      <Stack direction='row'>
        <FormControl mb={10} isRequired>
          <FormLabel mb={5}>What services are needed?</FormLabel>
          <CheckboxGroup colorScheme='green' onChange={(e) => console.log(e)}>
            <Stack direction='column'>
              {checkbox_options.map((value, index) => {
                return (
                  <Checkbox key={index} value={value} colorScheme='red'>
                    {value}
                  </Checkbox>
                );
              })}
            </Stack>
          </CheckboxGroup>
        </FormControl>

        <Stack direction='column'>
          <FormControl mb='2rem'>
            <FormLabel>What's the expected deadline?</FormLabel>
            <DayPickerInput onDayChange={setSelectedDay} />
          </FormControl>

          <FormControl isRequired>
            <FormLabel as='legend'>
              What's your Budget Range?{' '}
              <Tooltip
                hasArrow
                placement='top'
                label='We know it’s hard to estimate budget in some cases. This is just so we get an idea of the amount of raiders we’ll be able to involve in the raid.'
                aria-label='disclaimer tooltip'
              >
                <InfoIcon />
              </Tooltip>
            </FormLabel>
            <RadioBox
              stack='vertical'
              options={['< $5k', '$5k - $20k', '> 20k', 'Not Sure']}
              updateRadio={setBudgetRange}
              name='budget'
              defaultValue='$5k - $20k'
            />
          </FormControl>
        </Stack>
      </Stack>
    </div>
  );
};

export default RequiredServices;
