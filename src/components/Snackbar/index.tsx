import './snackbar.scss';

import { ReactComponent as EtherscanSvg } from 'assets/etherscan.svg';
import { motion } from 'framer-motion';
import React from 'react';
import { BLOCK_EXPLORER_URL } from 'web3/constants';

type ISnackbar = {
  hash: string;
  message: string;
  setShowSnackbar: React.Dispatch<React.SetStateAction<boolean>>;
};

const Snackbar: React.FC<ISnackbar> = ({ hash, message, setShowSnackbar }) => {
  return (
    <div id="snackbar-position">
      <div id="snackbar-container">
        <div style={{ display: 'flex' }}>
          <motion.a
            href={`${BLOCK_EXPLORER_URL}tx/${hash}`}
            target={'_blank'}
            rel={'noopener noreferrer'}
            id="snackbar-link"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.5 }}
          >
            <EtherscanSvg />
          </motion.a>
          {message && (
            <motion.p
              id="snackbar-status"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.5 }}
            >
              {message}
            </motion.p>
          )}
        </div>
        <div
          id="snackbar-close-container"
          onClick={() => setShowSnackbar(false)}
        >
          <div id="close-icon">&#10005;</div>
        </div>
      </div>
    </div>
  );
};

export default Snackbar;
