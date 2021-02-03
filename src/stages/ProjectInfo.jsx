import React, { useState, useContext } from 'react';
import {
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Stack,
  Tooltip,
  useToast
} from '@chakra-ui/react';

import { InfoIcon } from '@chakra-ui/icons';

import { AppContext } from '../context/AppContext';

import RadioBox from '../components/RadioBox';

const ProjectInfo = () => {
  const context = useContext(AppContext);
  const toast = useToast();

  const [projectType, setProjectType] = useState(context.projectType || 'New');
  const [projectSpecs, setProjectSpecs] = useState(
    context.projectSpecs || 'Yes'
  );

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
            name='projectType'
            defaultValue={context.projectType || projectType}
            value={context.projectType || projectType}
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
            name='projectSpecs'
            defaultValue={context.projectSpecs || projectSpecs}
            value={context.projectSpecs || projectSpecs}
          />
        </FormControl>
      </Stack>

      <Stack mb={10} direction='row'>
        <FormControl
          isRequired
          isInvalid={context.projectName === '' && buttonClick ? true : false}
        >
          <FormLabel>Project Name</FormLabel>
          <Input
            placeholder='Project Name'
            name='projectName'
            onChange={context.inputChangeHandler}
            value={context.projectName}
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
            onChange={context.inputChangeHandler}
            name='specsLink'
            value={context.specsLink}
          />
        </FormControl>
      </Stack>

      <FormControl
        mb={10}
        isRequired
        isInvalid={
          context.projectDescription === '' && buttonClick ? true : false
        }
      >
        <FormLabel>Project Description</FormLabel>
        <Textarea
          placeholder='Describe your project, goals, vision. Feel free to put as many links to resources as you can. (docs, specs, prototypes, etc)'
          onChange={context.inputChangeHandler}
          name='projectDescription'
          value={context.projectDescription}
        />
      </FormControl>

      <button
        id='next-stage-button'
        onClick={() => {
          if (context.projectName && context.projectDescription) {
            setButtonClickStatus(false);
            context.setProjectData(projectType, projectSpecs);
            context.updateStage('next');
          } else {
            setButtonClickStatus(true);
            toast({
              title: 'Please fill in all the required fields.',
              status: 'warning',
              duration: 3000,
              position: 'top'
            });
          }
        }}
      >
        Next
      </button>
    </div>
  );
};

export default ProjectInfo;
