import React, { useState, useContext } from 'react';
import {
  FormControl,
  FormLabel,
  FormHelperText,
  Textarea,
  Stack,
  Checkbox
} from '@chakra-ui/react';

import { AppContext } from '../context/AppContext';

import RadioBox from '../components/RadioBox';
import { Link } from 'react-router-dom';

const AdditionalInfo = () => {
  const context = useContext(AppContext);
  const [priority, setPriority] = useState('Fast & Polished');

  console.log(priority);

  return (
    <div className='additional-info-container'>
      <FormControl mb={10} isRequired>
        <FormLabel>How can we help?</FormLabel>
        <Textarea placeholder='Describe how you think RaidGuild can help?' />
      </FormControl>

      <Stack mb={10} direction='row'>
        <FormControl isRequired>
          <FormLabel as='legend'>What's the priority?</FormLabel>
          <RadioBox
            options={['Fast & Polished', 'Fast & Cheap', 'Polished & Cheap']}
            updateRadio={setPriority}
            name='priority'
            defaultValue='Fast & Polished'
          />
        </FormControl>
      </Stack>

      <FormControl>
        <Checkbox
          colorScheme='red'
          onChange={() => context.updatePaymentChoice()}
        >
          Continue without paying
        </Checkbox>
        <FormHelperText>
          Note that unpaid submissions might lose our priority over other
          projects.
        </FormHelperText>
      </FormControl>

      {context.is_paid && (
        <Link to='/faq'>
          <p id='payment-info-link'>What am I paying for?</p>
        </Link>
      )}
    </div>
  );
};

export default AdditionalInfo;
