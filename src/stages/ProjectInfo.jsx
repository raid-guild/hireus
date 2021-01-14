import React, { useState, useEffect } from 'react';
import {
  FormControl,
  FormLabel,
  FormErrorMessage,
  FormHelperText,
  Input,
  Textarea,
  Stack
} from '@chakra-ui/react';
import DayPickerInput from 'react-day-picker/DayPickerInput';
import 'react-day-picker/lib/style.css';

import RadioBox from '../components/RadioBox';

const ProjectInfo = () => {
  const [projectType, setProjectType] = useState('New');
  const [projectSpecs, setProjectSpecs] = useState('Yes');
  const [budgetRange, setBudgetRange] = useState('$5000 - $20000');
  const [selectedDay, setSelectedDay] = useState('');

  return (
    <div className='project-info-container'>
      <Stack mb={10} direction='row'>
        <FormControl isRequired>
          <FormLabel as='legend'>New or Existing Project?</FormLabel>
          <RadioBox
            options={['New', 'Existing']}
            updateRadio={setProjectType}
            name='project-type'
            defaultValue='New'
          />
        </FormControl>
        <FormControl isRequired>
          <FormLabel as='legend'>Do you have project specs ready?</FormLabel>
          <RadioBox
            options={['Yes', 'No', 'Need Help']}
            updateRadio={setProjectSpecs}
            name='project-specs'
            defaultValue='Yes'
          />
        </FormControl>
      </Stack>
      <Stack mb={10} direction='row'>
        <FormControl isRequired>
          <FormLabel>Project Name</FormLabel>
          <Input placeholder='Project Name' />
        </FormControl>
        <FormControl isRequired>
          <FormLabel>Relevant Project Link if any</FormLabel>
          <Input placeholder='Any link related to the project' />
        </FormControl>
      </Stack>
      <FormControl mb={10} isRequired>
        <FormLabel>Project Description</FormLabel>
        <Textarea placeholder='Tell us about your project' />
      </FormControl>

      <Stack direction='row'>
        <FormControl isRequired>
          <FormLabel as='legend'>What's your Budget Range?</FormLabel>
          <RadioBox
            options={['$$5000 - $20000', '$20000 - $50000', '> $50000']}
            updateRadio={setBudgetRange}
            name='budget'
            defaultValue='$5000 - $20000'
          />
        </FormControl>
        <FormControl isRequired>
          <FormLabel>What's the expected deadline?</FormLabel>
          <DayPickerInput onDayChange={setSelectedDay} />
        </FormControl>
      </Stack>
    </div>
  );
};

export default ProjectInfo;
