import { useContext, useState, useEffect } from 'react';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import { motion } from 'framer-motion';

import { AppContext } from './context/AppContext';

import HeadsUp from './stages/HeadsUp';
import PersonalInfo from './stages/PersonalInfo';
import ProjectInfo from './stages/ProjectInfo';
import RequiredServices from './stages/RequiredServices';
import AdditionalInfo from './stages/AdditionalInfo';
import Feedback from './stages/Feedback';

import './App.scss';

import raidguild__logo from './assets/raidguild__logo.png';

// Comment to trigger vercel deployment

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
            Please use your desktop or resize your window to more than 1000px to
            proceed.
          </motion.p>
        </div>
      )}
      {windowWidth > 1000 && (
        <>
          <motion.img
            id='raidguild-logo'
            src={raidguild__logo}
            alt='raidguild logo'
            initial={{ y: -250 }}
            animate={{ y: -10 }}
            transition={{ delay: 0.3 }}
          />
          <Router>
            <Switch>
              <Route path='/' exact>
                <>
                  {context.stage === 1 && <HeadsUp />}
                  {context.stage === 2 && <PersonalInfo />}
                  {context.stage === 3 && <ProjectInfo />}
                  {context.stage === 4 && <RequiredServices />}
                  {context.stage === 5 && <AdditionalInfo />}
                  {context.stage === 6 && <Feedback />}

                  {context.stage > 1 && (
                    <button
                      id='prev-stage-button'
                      onClick={() => context.updateStage('previous')}
                    >
                      <i className='fas fa-arrow-left'></i>
                    </button>
                  )}

                  {context.stage <= 6 && (
                    <motion.button
                      id='next-stage-button'
                      initial={{ x: '100vw' }}
                      animate={{ x: 0 }}
                      transition={{ delay: 1.3 }}
                      onClick={() => {
                        if (context.stage < 6) context.updateStage('next');
                      }}
                    >
                      {context.stage === 1 && 'Start'}
                      {context.stage < 5 && context.stage > 1 && 'Next'}
                      {context.stage === 6 && 'Done'}
                      {context.stage === 5
                        ? context.is_not_paid
                          ? 'Submit'
                          : 'Pay 300 DAI & Submit'
                        : null}
                    </motion.button>
                  )}

                  {context.stage !== 1 && (
                    <Link to='/faq'>
                      <p id='faq-stage-link'>Read FAQ</p>
                    </Link>
                  )}
                </>
              </Route>
              <Route path='/faq' exact>
                <div></div>
              </Route>
            </Switch>
          </Router>
        </>
      )}
    </div>
  );
};

export default App;
