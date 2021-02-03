import React, { useState, useContext } from 'react';
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

import { AppContext } from '../context/AppContext';

import RadioBox from '../components/RadioBox';

const checkbox_options = [
  'DAO (Design, Deployment)',
  'Development (Frontend, Backend)',
  'Marketing (Social Media, Copywriting, Memes/GIFs)',
  'Motion Design (Video, Explainers, Sticker Packs)',
  'NFTs (Contracts, Art, Tokenomics)',
  'Smart Contracts (Solidity, Audits)',
  'Strategy (Product, Launch Planning, Agile)',
  'Tokenomics (Incentives, Distribution, Rewards)',
  'UX (Research, Testing, User Stories)',
  'UI (Interface Design, Interaction Design)',
  'Visual Design (Branding, Illustration, Graphics)',
  'Help me figure out what I need'
];

const RequiredServices = () => {
  const context = useContext(AppContext);
  const [servicesRequired, setServicesRequired] = useState([]);
  const [selectedDay, setSelectedDay] = useState('');
  const [budgetRange, setBudgetRange] = useState('$5k - $20k');

  const [buttonClick, setButtonClickStatus] = useState(false);

  return (
    <div className='required-services-container'>
      <h2 className='step-title'>Step 3 of 4: Required Services</h2>
      <Stack direction='row'>
        <FormControl
          mb={10}
          isRequired
          isInvalid={
            servicesRequired.length === 0 && buttonClick ? true : false
          }
        >
          <FormLabel mb={5}>What services are needed?</FormLabel>
          <CheckboxGroup
            colorScheme='green'
            onChange={(e) => setServicesRequired(e)}
          >
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
                label='We know it’s hard to estimate in many cases. This is just so we get an idea of the amount of raiders we’ll be able to involve in the raid.'
                aria-label='disclaimer tooltip'
              >
                <InfoIcon />
              </Tooltip>
            </FormLabel>
            <RadioBox
              stack='vertical'
              options={['< $5k', '$5k - $20k', '$20k-$50k', '$50k+', 'Not Sure']}
              updateRadio={setBudgetRange}
              name='budget'
              defaultValue='$5k - $20k'
            />
          </FormControl>
        </Stack>
      </Stack>

      <button
        id='next-stage-button'
        onClick={() => {
          if (servicesRequired.length !== 0) {
            setButtonClickStatus(false);
            context.setRequiredServicesData(
              servicesRequired,
              selectedDay,
              budgetRange
            );
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

export default RequiredServices;
