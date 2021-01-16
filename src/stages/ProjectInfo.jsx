import React, { useState } from 'react';
import {
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Stack
} from '@chakra-ui/react';

import RadioBox from '../components/RadioBox';

const ProjectInfo = () => {
  const [projectType, setProjectType] = useState('New');
  const [projectSpecs, setProjectSpecs] = useState('Yes');
  const [budgetRange, setBudgetRange] = useState('$5000 - $20000');

  console.log(projectType, projectSpecs, budgetRange);

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

      <FormControl isRequired>
        <FormLabel as='legend'>What's your Budget Range?</FormLabel>
        <RadioBox
          options={[
            '$1000 - $5000',
            '$5000 - $20000',
            '$20000 - $50000',
            '> $50000',
            'Not Sure'
          ]}
          updateRadio={setBudgetRange}
          name='budget'
          defaultValue='$5000 - $20000'
        />
      </FormControl>
    </div>
  );
};

export default ProjectInfo;
