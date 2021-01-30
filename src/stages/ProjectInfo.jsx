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

import { AppContext } from '../context/AppContext';

import RadioBox from '../components/RadioBox';

const ProjectInfo = () => {
  const context = useContext(AppContext);
  const [projectType, setProjectType] = useState('New');
  const [projectSpecs, setProjectSpecs] = useState('Yes');
  const [specsLink, setSpecsLink] = useState('');
  const [projectName, setProjectName] = useState('');
  const [projectDescription, setProjectDescription] = useState('');

  const [buttonClick, setButtonClickStatus] = useState(false);

  return (
    <div className='project-info-container'>
      <h2 className='step-title'>Step 2 of 4: Project Information</h2>
      <Stack mb={10} direction='row'>
        <FormControl isRequired>
          <FormLabel as='legend'>
            New or Existing Project?{' '}
            <Tooltip
              hasArrow
              placement='top'
              label='By existing, we mean a project that has already launched.'
              aria-label='disclaimer tooltip'
            >
              <InfoIcon />
            </Tooltip>
          </FormLabel>
          <RadioBox
            options={['New', 'Existing']}
            updateRadio={setProjectType}
            name='project-type'
            defaultValue='New'
          />
        </FormControl>

        <FormControl isRequired>
          <FormLabel as='legend'>
            Do you have project specs ready?{' '}
            <Tooltip
              hasArrow
              placement='top'
              label='You should choose “Yes” if you know exactly what needs to be done and have it written down, or “Partial” if you have some things written down but no complete specifications of the work needed.'
              aria-label='disclaimer tooltip'
            >
              <InfoIcon />
            </Tooltip>
          </FormLabel>
          <RadioBox
            options={['Yes', 'Partial', 'None']}
            updateRadio={setProjectSpecs}
            name='project-specs'
            defaultValue='Yes'
          />
        </FormControl>
      </Stack>

      <Stack mb={10} direction='row'>
        <FormControl
          isRequired
          isInvalid={projectName === '' && buttonClick ? true : false}
        >
          <FormLabel>Project Name</FormLabel>
          <Input
            placeholder='Project Name'
            onChange={(e) => setProjectName(e.target.value)}
          />
        </FormControl>

        <FormControl>
          <FormLabel>
            Link to Specs{' '}
            <Tooltip
              hasArrow
              placement='top'
              label='This is the main resource or reference we should be looking at.'
              aria-label='disclaimer tooltip'
            >
              <InfoIcon />
            </Tooltip>
          </FormLabel>
          <Input
            placeholder='Any link related to the project'
            isDisabled={projectSpecs === 'None' ? true : false}
            onChange={(e) => setSpecsLink(e.target.value)}
          />
        </FormControl>
      </Stack>

      <FormControl
        mb={10}
        isRequired
        isInvalid={projectDescription === '' && buttonClick ? true : false}
      >
        <FormLabel>Project Description</FormLabel>
        <Textarea
          placeholder='Describe your project, goals, vision. Feel free to put as many links to resources as you can. (docs, specs, prototypes, etc)'
          onChange={(e) => setProjectDescription(e.target.value)}
        />
      </FormControl>

      <button
        id='next-stage-button'
        onClick={() => {
          if (projectName && projectDescription) {
            setButtonClickStatus(false);
            context.setProjectData(
              projectType,
              projectSpecs,
              specsLink,
              projectName,
              projectDescription
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

export default ProjectInfo;
