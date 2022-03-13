import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from '@chakra-ui/react';
import React from 'react';
import { StyledPrimaryButton } from 'themes/styled';

const faq_items = [
  {
    q: 'Where can I get $RAID?',
    a: 'The easiest place to get $RAID is through Honeyswap on Gnosis chain.  You can follow a link to Honeyswap by going to the Home page and selecting the $RAID button marked in red.',
  },
  {
    q: 'What does bidding on my consultation request do?',
    a: 'Bidding on your consultation request both shows your alignment with RaidGuild and boosts your request higher in the queue. The higher your bid, the sooner you will be considered for a consultation.',
  },
  {
    q: 'How long is my bid locked up?',
    a: 'To prevent people from "gaming" the queue, a lockup period of 7 days is placed on the initial bid date.',
  },
  {
    q: 'Does canceling my bid return the amount of $RAID I initially bid?',
    a: 'Yes. After canceling a bid, all $RAID is returned to the user who submitted the initial bid.',
  },
  {
    q: 'Can anyone increase my bid?',
    a: `Technically, yes. However, if you choose to increase someone else's bid, be aware that only the person who submitted the initial bid can cancel and withdraw from the bid.`,
  },
  {
    q: 'How long does it take for a bid to be accepted?',
    a: `Due to both demand and fluctuations in guild members’ bandwidth, it’s difficult to predict bid acceptance time frames.  Please visit our Discord to ask questions about your bid.`,
  },
];

type FAQProps = {
  isOpen: boolean;
  onClose: () => void;
};

export const FAQ: React.FC<FAQProps> = ({ isOpen, onClose }) => {
  return (
    <Modal onClose={onClose} isOpen={isOpen} isCentered scrollBehavior="inside">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>FAQs</ModalHeader>
        <ModalBody>
          <Accordion defaultIndex={[0]}>
            {faq_items.map((item, index) => {
              return (
                <AccordionItem key={index} fontFamily="spaceMono">
                  <AccordionButton color="purple" textTransform="uppercase">
                    <Box flex="1" textAlign="left">
                      {item.q}
                    </Box>
                    <AccordionIcon />
                  </AccordionButton>
                  <AccordionPanel pb={4}>{item.a}</AccordionPanel>
                </AccordionItem>
              );
            })}
          </Accordion>
        </ModalBody>
        <ModalFooter>
          <StyledPrimaryButton onClick={onClose}>Close</StyledPrimaryButton>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
