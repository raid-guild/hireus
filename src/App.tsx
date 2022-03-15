import 'react-toastify/dist/ReactToastify.css';

import { Box, Flex } from '@chakra-ui/react';
import { Footer } from 'components/Footer';
import { Header } from 'components/Header';
import { useEffect, useState } from 'react';
import { Router } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import Routes from 'Routes';
import history from 'utils/history';

const App: React.FC = () => {
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
      <ToastContainer
        position="top-center"
        autoClose={3000}
        style={{ zIndex: 10000000000 }}
      />
      <Router history={history}>
        <Box px={{ base: '2rem', lg: '5rem' }} w="100%">
          <Header windowWidth={windowWidth} />
        </Box>
        <Routes />
        <Footer />
      </Router>
    </Flex>
  );
};

export default App;
