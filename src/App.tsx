import { Box, Flex } from '@chakra-ui/react';
import FAQ from 'components/Faq';
import { Footer } from 'components/Footer';
import { Header } from 'components/Header';
import { useEffect, useState } from 'react';
import { Router } from 'react-router-dom';
import Routes from 'Routes';
import history from 'utils/history';

const App: React.FC = () => {
  const [isFaqOpen, setIsFaqOpen] = useState(false);

  const [windowWidth, setWindowWidth] = useState(0);

  useEffect(() => {
    setWindowWidth(window.innerWidth);
    window.removeEventListener('resize', () => null);
    window.addEventListener('resize', e => {
      setWindowWidth(window.innerWidth);
    });
  }, []);

  return (
    <Flex
      width="100vw"
      minHeight="100vh"
      direction="column"
      justifyContent="space-between"
      alignItems="center"
    >
      <Box px={{ base: '2rem', lg: '5rem' }} w="100%">
        <Header windowWidth={windowWidth} />
      </Box>
      <Router history={history}>
        <Routes />
      </Router>
      <Footer />
      <FAQ isOpen={isFaqOpen} onClose={() => setIsFaqOpen(false)} />
    </Flex>
  );
};

export default App;
