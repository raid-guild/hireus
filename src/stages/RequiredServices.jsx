import React, { useState } from 'react';
import {
  FormControl,
  FormLabel,
  Stack,
  Checkbox,
  CheckboxGroup
} from '@chakra-ui/react';
import DayPickerInput from 'react-day-picker/DayPickerInput';
import 'react-day-picker/lib/style.css';

// import CheckBox from '../components/CheckBox';

const checkbox_options = [
  'Consulting',
  'DAO Design / Deployment',
  'Development (Frontend, Backend)',
  'Marketing (copy writing, strategy)',
  'Smart Contracts (Solidity, Audits)',
  'Visual Design (Branding, Illustration, etc)',
  'UX/UI Design',
  'Other / Not Sure'
];

const RequiredServices = () => {
  const [selectedDay, setSelectedDay] = useState('');

  console.log(selectedDay);

  return (
    <div className='required-services-container'>
      {/* <CheckBox
        options={['$$5000 - $20000', '$20000 - $50000', '> $50000']}
        updateRadio={setBudgetRange}
        name='budget'
        defaultValue='$5000 - $20000'
      /> */}
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

        <FormControl isRequired>
          <FormLabel>What's the expected deadline?</FormLabel>
          <DayPickerInput onDayChange={setSelectedDay} />
        </FormControl>
      </Stack>
    </div>
  );
};

export default RequiredServices;
