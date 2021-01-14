import React, { useState, useEffect } from 'react';
import {
  FormControl,
  FormLabel,
  FormErrorMessage,
  FormHelperText,
  Input,
  Textarea,
  Stack,
  Checkbox
} from '@chakra-ui/react';

// import CheckBox from '../components/CheckBox';
import RadioBox from '../components/RadioBox';

const Requirement = () => {
  const [priority, setPriority] = useState('Fast');

  return (
    <div className='requirement-container'>
      {/* <CheckBox
        options={['$$5000 - $20000', '$20000 - $50000', '> $50000']}
        updateRadio={setBudgetRange}
        name='budget'
        defaultValue='$5000 - $20000'
      /> */}
      <FormControl mb={10} isRequired>
        <FormLabel>How can we help?</FormLabel>
        <Textarea placeholder='Describe how you think RaidGuild can help?' />
      </FormControl>

      <Stack mb={10} direction='row'>
        <FormControl isRequired>
          <FormLabel as='legend'>What's the priority?</FormLabel>
          <RadioBox
            options={['Fast', 'Good', 'Cheap']}
            updateRadio={setPriority}
            name='priority'
            defaultValue='Fast'
          />
        </FormControl>
      </Stack>

      <FormControl>
        <Checkbox colorScheme='red'>Continue without paying</Checkbox>
        <FormHelperText>
          Note that unpaid submissions might lose our priority over other
          projects.
        </FormHelperText>
      </FormControl>
    </div>
  );
};

export default Requirement;
