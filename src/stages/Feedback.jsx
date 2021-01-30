import React, { useState, useContext } from 'react';
import { FormControl, FormLabel, Textarea } from '@chakra-ui/react';

import { AppContext } from '../context/AppContext';

import RadioBox from '../components/RadioBox';

const Feedback = () => {
  const context = useContext(AppContext);
  const [rating, setRating] = useState('4');

  console.log(rating);

  return (
    <div className='personal-info-container'>
      <FormControl mb={10}>
        <FormLabel>How did you hear about us?</FormLabel>
        <Textarea placeholder='Let us know how you came to know us' />
      </FormControl>
      <FormControl mb={10}>
        <FormLabel>What could be better?</FormLabel>
        <Textarea placeholder='Based on your experience, what do you think' />
      </FormControl>
      <FormControl>
        <FormLabel as='legend'>Rate your experience so far</FormLabel>
        <RadioBox
          options={['1', '2', '3', '4', '5']}
          updateRadio={setRating}
          name='rating'
          defaultValue='4'
        />
      </FormControl>

      <button id='next-stage-button'>Submit</button>
    </div>
  );
};

export default Feedback;
