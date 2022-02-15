import { Flex } from '@chakra-ui/react';
import FAQ from 'components/Faq';
import { Footer } from 'components/Footer';
import { useEffect, useState } from 'react';
import { Router } from 'react-router-dom';
import Routes from 'Routes';
import history from 'utils/history';

const App: React.FC = () => {
  const [, setWindowWidth] = useState(window.innerWidth);
  const [isFaqOpen, setIsFaqOpen] = useState(false);

  useEffect(() => {
    window.addEventListener('resize', e => {
      setWindowWidth(window.innerWidth);
    });
  }, []);

  return (
    <Flex height="100%" width="100%" direction="column">
      <Router history={history}>
        <Routes />
      </Router>
      <Footer />
      <FAQ isOpen={isFaqOpen} onClose={() => setIsFaqOpen(false)} />
    </Flex>
  );
};

export default App;
