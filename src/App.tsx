import 'App.scss';

import raidguild__logo from 'assets/raidguild__logo.png';
import FAQ from 'components/Faq';
import { useWallet } from 'contexts/WalletContext';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { shortenAddress } from 'utils';
import AuctionQueue from 'views/AuctionQueue';

// uses ga4

const App: React.FC = () => {
  const { address, connectWallet } = useWallet();
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [isFaqOpen, setIsFaqOpen] = useState(false);

  useEffect(() => {
    window.addEventListener('resize', e => {
      setWindowWidth(window.innerWidth);
    });
  }, []);

  return (
    <div className="app">
      <div className="main">
        {windowWidth < 1000 && (
          <div className="window">
            <motion.h1
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.5 }}
            >
              Hiring RaidGuild
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7, duration: 0.5 }}
            >
              Please use your desktop or resize your window to more than 1000px
              to proceed.
            </motion.p>
          </div>
        )}
        {windowWidth > 1000 && (
          <>
            <div id="raidguild-navbar">
              <a
                href="https://raidguild.org/"
                target="_blank"
                rel="noopener noreferrer"
                id="raidguild-logo"
              >
                <motion.img
                  src={raidguild__logo}
                  alt="raidguild logo"
                  initial={{ y: -250 }}
                  animate={{ y: -10 }}
                  transition={{ delay: 0.3 }}
                />
              </a>
              <motion.button
                className="consultation-button"
                initial={{ x: '100vw' }}
                animate={{ x: 0 }}
                transition={{ delay: 1.3 }}
                onClick={() => {
                  connectWallet();
                }}
              >
                {address ? shortenAddress(address) : 'Connect'}
              </motion.button>
            </div>
            <Router>
              <Switch>
                <Route path="/" exact>
                  <AuctionQueue />

                  {/* {stage !== 1 && (
                    <button
                      id="prev-stage-button"
                      onClick={() => console.log('Next stage')}
                    >
                      <i className="fas fa-arrow-left"></i>
                    </button>
                  )} */}

                  <button onClick={() => setIsFaqOpen(true)} id="faq-button">
                    Read FAQ
                  </button>
                </Route>
              </Switch>
            </Router>
            <FAQ isOpen={isFaqOpen} onClose={() => setIsFaqOpen(false)} />
          </>
        )}
      </div>
    </div>
  );
};

export default App;
