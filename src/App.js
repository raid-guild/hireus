import { useContext, useState, useEffect } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { motion } from 'framer-motion';

import { AppContext } from './context/AppContext';

import HiringBoard from './stages/HiringBoard';
import HeadsUp from './stages/HeadsUp';
import PersonalInfo from './stages/PersonalInfo';
import ProjectInfo from './stages/ProjectInfo';
import RequiredServices from './stages/RequiredServices';
import AdditionalInfo from './stages/AdditionalInfo';
import Confirmation from './stages/Confirmation';
import Feedback from './stages/Feedback';

import FAQ from './components/Faq';

import './App.scss';

import raidguild__logo from './assets/raidguild__logo.png';

// uses ga4

const App = () => {
  const context = useContext(AppContext);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    window.addEventListener('resize', (e) => {
      setWindowWidth(window.innerWidth);
    });
  }, []);

  return (
    <div className='app'>
      <div className='main'>
        {windowWidth < 1000 && (
          <div className='window'>
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
            <a
              href='https://raidguild.org/'
              target='_blank'
              rel='noopener noreferrer'
              id='raidguild-logo'
            >
              <motion.img
                src={raidguild__logo}
                alt='raidguild logo'
                initial={{ y: -250 }}
                animate={{ y: -10 }}
                transition={{ delay: 0.3 }}
              />
            </a>
            <Router>
              <Switch>
                <Route path='/' exact>
                  <>
                    {context.stage === 1 && <HiringBoard />}
                    {context.stage === 2 && <HeadsUp />}
                    {context.stage === 3 && <PersonalInfo />}
                    {context.stage === 4 && <ProjectInfo />}
                    {context.stage === 5 && <RequiredServices />}
                    {context.stage === 6 && <AdditionalInfo />}
                    {context.stage === 7 && <Confirmation />}
                    {context.stage === 8 && <Feedback />}

                    {context.stage !== 1 && context.stage !== 6 && (
                      <button
                        id='prev-stage-button'
                        onClick={() => context.updateStage('previous')}
                      >
                        <i className='fas fa-arrow-left'></i>
                      </button>
                    )}

                    {context.stage !== 1 && (
                      <button
                        onClick={() => context.updateFaqModalStatus(true)}
                        id='faq-button'
                      >
                        Read FAQ
                      </button>
                    )}
                  </>
                </Route>
              </Switch>
            </Router>
            <FAQ />
          </>
        )}
      </div>
    </div>
  );
};

export default App;
