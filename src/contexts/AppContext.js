/* eslint-disable no-undef */
import { Component, createContext } from 'react';

export const AppContext = createContext();

// RINKEBY
// const RAID_ABI = require('../abi/ERC20_ABI.json');
// const QUEUE_ABI = require('../abi/QUEUE_ABI.json');

// KOVAN TESTNET
// const DAI_CONTRACT_ADDRESS = '0xff795577d9ac8bd7d90ee22b6c1703490b6512fd';
// const DAI_ABI = require('../abi/DAI_ABI.json');

class AppContextProvider extends Component {
  state = {};

  render() {
    return (
      <AppContext.Provider
        value={{
          ...this.state,
        }}
      >
        {this.props.children}
      </AppContext.Provider>
    );
  }
}

export default AppContextProvider;
