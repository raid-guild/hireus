import React, { useState, useContext } from 'react';
import { FormControl, FormLabel, Textarea, Button } from '@chakra-ui/react';

import { AppContext } from '../context/AppContext';

import RadioBox from '../components/RadioBox';

const Feedback = () => {
  const context = useContext(AppContext);
  const [feedbackOne, setFeedbackOne] = useState('');
  const [feedbackTwo, setFeedbackTwo] = useState('');
  const [rating, setRating] = useState('4');

  return (
    <div className="feedback-container">
      <FormControl mb={10}>
        <FormLabel>How did you hear about us?</FormLabel>
        <Textarea
          placeholder="Let us know how you came to know us"
          onChange={e => setFeedbackOne(e.target.value)}
        />
      </FormControl>
      <FormControl mb={10}>
        <FormLabel>What could be better?</FormLabel>
        <Textarea
          placeholder="Based on your experience, what do you think"
          onChange={e => setFeedbackTwo(e.target.value)}
        />
      </FormControl>
      <FormControl>
        <FormLabel as="legend">Rate your experience so far</FormLabel>
        <RadioBox
          options={['1', '2', '3', '4', '5']}
          updateRadio={setRating}
          name="rating"
          defaultValue="4"
        />
      </FormControl>

      <Button
        isLoading={context.submitting}
        loadingText="Submitting"
        id="chakra-button"
        onClick={() => {
          context.submitFeedback(feedbackOne, feedbackTwo, rating);
        }}
      >
        Submit
      </Button>
    </div>
  );
};

export default Feedback;
