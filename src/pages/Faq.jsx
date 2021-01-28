import React from 'react';
import {
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Box
} from '@chakra-ui/react';

const faq_items = [
  {
    q: 'What happens after I pay and submit?',
    a:
      'After you pay and submit, we’ll receive a notification of your submission and a Raider will get in touch with you within 48 hours (business days) to schedule a Consultation.'
  },
  {
    q: 'What is the consultation?',
    a:
      'The consultation is an online call, usually through Discord or Google Meet, with one of our project managers and possibly some extra Raiders. The consultation itself lasts around 45 minutes and in it we will assess the challenges and discuss possible solution paths for your project.'
  },
  {
    q: 'What are the deliverables?',
    a:
      'In most cases, our clients know exactly what they need. In this case, the time of the consultation is used to understand requirements and gather information to create the proposal. We usually deliver a quote including a timeline, the work required, and total cost a few days after the consultation.' +
      '\nHowever, the huge variety of projects we review made us realize that we can’t promise a fixed deliverable to everyone that goes through this process. For some people, the consultation serves as the initial discussion on the viability of an idea, with clear next steps defined. For others, consultation itself might become a round of troubleshooting or tech support.' +
      '\nWhat we can promise is that we’ll use every resource we have available to help you, your product, and your vision.'
  },
  {
    q: 'What happens after the consultation?',
    a:
      'In most cases we figure out the next steps forward and give you a quote. If we don’t feel RaidGuild is the best fit for your needs at the time, we may instead offer you alternative paths forward.'
  },
  {
    q: 'Why should I pay?',
    a:
      'We believe in fairly compensating everyone at the Guild for their time. Payment ensures that our project managers are incentivized to marshall our best Raiders quickly, so you get the best consultation possible.' +
      'You can submit this form without paying, but we can’t guarantee that we will have available people to pick it up. Submissions without payment usually are non-profit, open source, or otherwise directly for the good of the Ethereum community and ecosystem.'
  }
];

const FAQ = () => {
  return (
    <div className='grid-container'>
      <div></div>
      <div className='faq-container'>
        <Accordion defaultIndex={[0]}>
          {faq_items.map((item, index) => {
            return (
              <AccordionItem key={index}>
                <AccordionButton>
                  <Box flex='1' textAlign='left'>
                    {item.q}
                  </Box>
                  <AccordionIcon />
                </AccordionButton>
                <AccordionPanel pb={4}>{item.a}</AccordionPanel>
              </AccordionItem>
            );
          })}
          <AccordionItem>
            <AccordionButton>
              <Box flex='1' textAlign='left'>
                How do I get DAI?
              </Box>
              <AccordionIcon />
            </AccordionButton>
            <AccordionPanel pb={4}>
              <p>
                First, you need <a href='https://metamask.io/'>Metamask</a>.
              </p>
              <p>Second, you need ETH. Here are a few good onramps.</p>
              <p>Third, you need to swap that ETH for DAI.</p>
            </AccordionPanel>
          </AccordionItem>
        </Accordion>
      </div>
      <div></div>
    </div>
  );
};

export default FAQ;
