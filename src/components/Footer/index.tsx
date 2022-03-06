import {
  Flex,
  HStack,
  Image,
  Link,
  SimpleGrid,
  Text,
  VStack,
} from '@chakra-ui/react';
import { StyledFooterHeaderText } from 'themes/styled';
import { theme } from 'themes/theme';

export const Footer: React.FC = () => {
  return (
    <Flex
      direction={{ base: 'column-reverse', md: 'row', lg: 'row' }}
      alignItems="flex-start"
      justifyContent="space-between"
      px={{ base: '2rem', lg: '5rem' }}
      py="2rem"
      w="100%"
      bg="black"
    >
      <Image
        src={theme.images.raidguild}
        alt="raidguild logo"
        width={{ base: '150px', lg: '168px' }}
        mr="auto"
        mt="2rem"
      />

      <SimpleGrid
        columns={{ base: 1, md: 3, lg: 3 }}
        spacing={{ base: '2rem', lg: '5rem' }}
        fontFamily="spaceMono"
        fontSize="1rem"
        color="greyLight"
      >
        <VStack alignItems="flex-start">
          <StyledFooterHeaderText fontSize="1.2rem">
            For Clients
          </StyledFooterHeaderText>
          <Link
            href={'https://www.raidguild.org/#services'}
            target={'_blank'}
            rel={'noopener noreferrer'}
          >
            Hire Us
          </Link>
          <Link
            href={'https://www.raidguild.org/#portfolio'}
            target={'_blank'}
            rel={'noopener noreferrer'}
          >
            Our Portfolio
          </Link>
        </VStack>
        <VStack alignItems="flex-start">
          <StyledFooterHeaderText fontSize="1.2rem">
            For Raiders
          </StyledFooterHeaderText>
          <Link
            href={'https://www.raidguild.org/#culture'}
            target={'_blank'}
            rel={'noopener noreferrer'}
          >
            Join Us
          </Link>
          <Link
            href="https://handbook.raidguild.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Our Handbook
          </Link>
        </VStack>
        <VStack alignItems="flex-start">
          <StyledFooterHeaderText fontSize="1.2rem">
            For All
          </StyledFooterHeaderText>
          <Link
            href="https://twitter.com/RaidGuild"
            target="_blank"
            rel="noopener noreferrer"
          >
            <HStack>
              <span style={{ width: '15px', marginRight: '5px' }}>
                <i className="fab fa-twitter"></i>
              </span>
              <Text>Twitter</Text>
            </HStack>
          </Link>

          <Link
            href="https://github.com/orgs/raid-guild/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <HStack>
              <span style={{ width: '15px', marginRight: '5px' }}>
                <i className="fab fa-github"></i>
              </span>
              <Text>Github</Text>
            </HStack>
          </Link>

          <Link
            href="https://discord.gg/rGFpfQf"
            target="_blank"
            rel="noopener noreferrer"
          >
            <HStack>
              <span style={{ width: '15px', marginRight: '5px' }}>
                <i className="fab fa-discord"></i>
              </span>
              <Text>Discord</Text>
            </HStack>
          </Link>

          <Link
            href="https://raidguild.substack.com/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <HStack>
              <span style={{ width: '15px', marginRight: '5px' }}>
                <i className="fas fa-newspaper"></i>
              </span>
              <Text>Newsletter</Text>
            </HStack>
          </Link>
        </VStack>
      </SimpleGrid>
    </Flex>
  );
};
