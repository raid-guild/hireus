import React from 'react';
import './snackbar.scss'

export default function Snackbar(props) {
  return (
    <div id="snackbar-position">
        <div id="snackbar-container">
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {props.message && <p id="snackbar-status">{props.message}</p>}
            {props.hash && <a
              id="snackbar-link"
              target="_blank"
              rel="noreferrer"
              href={`https://rinkeby.etherscan.io/tx/${props.hash}`}
            >
              View status
            </a>}
          </div>
          <div id="snackbar-close-container" onClick={() => props.setShowSnackbar(false)}>
            <div id="close-icon">&#10005;</div>
          </div>
        </div>
    </div>
  )
}
