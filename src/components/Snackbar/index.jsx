import React from 'react';
import { motion } from 'framer-motion';
import './snackbar.scss'
import { ReactComponent as EtherscanSvg } from '../../assets/etherscan.svg';

export default function Snackbar(props) {
  return (
    <div id="snackbar-position">
        <div id="snackbar-container">
          <div style={{ display: 'flex' }}>
            <motion.a
              href={`https://rinkeby.etherscan.io/tx/${props.hash}`}
              target={'_blank'}
              rel={'noopener noreferrer'}
              id="snackbar-link"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.5 }}
            >
              <EtherscanSvg />
            </motion.a>
            {props.message && (
              <motion.p
                id="snackbar-status"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6, duration: 0.5 }}
              >
                {props.message}
              </motion.p>
            )}
          </div>
          <div id="snackbar-close-container" onClick={() => props.setShowSnackbar(false)}>
            <div id="close-icon">&#10005;</div>
          </div>
        </div>
    </div>
  )
}
