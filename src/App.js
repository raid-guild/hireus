import { useContext } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { motion } from 'framer-motion';

import { AppContext } from './context/AppContext';

import HeadsUp from './stages/HeadsUp';
import PersonalInfo from './stages/PersonalInfo';
import ProjectInfo from './stages/ProjectInfo';
import Requirement from './stages/Requirement';
import Feedback from './stages/Feedback';

import './App.scss';

import raidguild__logo from './assets/raidguild__logo.png';

const App = () => {
  const context = useContext(AppContext);

  return (
    <div className='app'>
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
              {context.stage === 4 && <Requirement />}
              {context.stage === 5 && <Feedback />}
              {context.stage > 1 && (
                <button
                  id='prev-stage-button'
                  onClick={() => context.updateStage('previous')}
                >
                  <i className='fas fa-arrow-left'></i>
                </button>
              )}
              <motion.button
                id='next-stage-button'
                initial={{ x: '100vw' }}
                animate={{ x: 0 }}
                transition={{ delay: 1.3 }}
                onClick={() => context.updateStage('next')}
              >
                <i className='fas fa-arrow-right'></i>
              </motion.button>
            </>
          </Route>
          <Route path='/faq' exact>
            <div></div>
          </Route>
        </Switch>
      </Router>
    </div>
  );
};

export default App;
