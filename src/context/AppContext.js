import React, { Component, createContext } from 'react';

import Web3 from 'web3';
import Web3Modal from 'web3modal';
import WalletConnectProvider from '@walletconnect/web3-provider';

export const AppContext = createContext();

const axios = require('axios');

const providerOptions = {
  walletconnect: {
    package: WalletConnectProvider,
    options: {
      infuraId: process.env.REACT_APP_KOVAN_NODE_ENDPOINT
    }
  }
};

const web3Modal = new Web3Modal({
  network: 'kovan',
  cacheProvider: false,
  providerOptions
});

//MAINNET
// const DAI_CONTRACT_ADDRESS = '0x6B175474E89094C44Da98b954EedeAC495271d0F';
// const DAI_ABI = require('../abi/DAI_ABI.json');

// KOVAN TESTNET
const DAI_CONTRACT_ADDRESS = '0xff795577d9ac8bd7d90ee22b6c1703490b6512fd';
const DAI_ABI = require('../abi/DAI_ABI.json');

let raidID = '';

class AppContextProvider extends Component {
  state = {
    // UX state
    stage: 1,
    account: '',
    chainID: '',
    web3: '',
    submitting: false,
    // Personal Info state
    name: '',
    email: '',
    bio: '',
    discordHandle: '',
    telegramHandle: '',
    twitterHandle: '',
    contactType: '',
    // Project Info state
    projectType: '',
    projectSpecs: '',
    specsLink: '',
    projectName: '',
    projectDescription: '',
    // Services Info state
    servicesRequired: '',
    selectedDay: '',
    budgetRange: '',
    //Additional Info state
    specificInfo: '',
    priority: '',
    //Feedback Info state
    feedbackOne: '',
    feedbackTwo: '',
    rating: ''
  };

  updateStage = (type) => {
    this.setState((prevState) => {
      return {
        stage: type === 'previous' ? prevState.stage - 1 : prevState.stage + 1
      };
    });
  };

  setPersonalData = (
    name,
    email,
    bio,
    discordHandle,
    telegramHandle,
    twitterHandle,
    contactType
  ) => {
    this.setState({
      name,
      email,
      bio,
      discordHandle,
      telegramHandle,
      twitterHandle,
      contactType
    });
  };

  setProjectData = (
    projectType,
    projectSpecs,
    specsLink,
    projectName,
    projectDescription
  ) => {
    this.setState({
      projectType,
      projectSpecs,
      specsLink,
      projectName,
      projectDescription
    });
  };

  setRequiredServicesData = (servicesRequired, selectedDay, budgetRange) => {
    this.setState({
      servicesRequired,
      selectedDay,
      budgetRange
    });
  };

  connectWallet = async () => {
    web3Modal.clearCachedProvider();

    const provider = await web3Modal.connect();
    const web3 = new Web3(provider);
    const accounts = await web3.eth.getAccounts();
    const chainID = await web3.eth.net.getId();

    this.setState({ account: accounts[0], chainID, web3 });

    provider.on('accountsChanged', (accounts) => {
      this.setState({ account: accounts[0] });
    });

    provider.on('chainChanged', (chainId) => {
      this.setState({ chainID: chainId });
    });
  };

  sendData = async (hash = 'not paid') => {
    await axios
      .post('https://guild-keeper.herokuapp.com/hireus-v2/consultation', {
        key: process.env.REACT_APP_ACCESS_KEY,
        name: this.state.name,
        email: this.state.email,
        bio: this.state.bio,
        telegramHandle: this.state.telegramHandle,
        discordHandle: this.state.discordHandle,
        twitterHandle: this.state.twitterHandle,
        contactType: this.state.contactType,
        projectType: this.state.projectType,
        projectSpecs: this.state.projectSpecs,
        specsLink: this.state.specsLink,
        projectName: this.state.projectName,
        projectDescription: this.state.projectDescription,
        servicesRequired: this.state.servicesRequired,
        selectedDay: this.state.selectedDay,
        budgetRange: this.state.budgetRange,
        specificInfo: this.state.specificInfo,
        priority: this.state.priority,
        transaction_hash: hash
      })
      .then(function (response) {
        if (response.data !== 'ERROR') raidID = response.data;
      })
      .catch(function (error) {
        console.log(error);
      });

    this.setState({ submitting: false }, () => this.updateStage('next'));
  };

  processPayment = async () => {
    const DAI = new this.state.web3.eth.Contract(DAI_ABI, DAI_CONTRACT_ADDRESS);
    const balance = await DAI.methods.balanceOf(this.state.account).call();

    if (this.state.web3.utils.fromWei(balance) < 1) {
      return alert('Insufficient DAI Balance!');
    }

    try {
      await DAI.methods
        .transfer(
          '0xbeb3e32355a933501c247e2dbde6e6ca2489bf3d',
          this.state.web3.utils.toWei('1')
        )
        .send({
          from: this.state.account
        })
        .once('transactionHash', async (hash) => {
          await this.sendData(hash);
        });
    } catch (err) {}
  };

  submitAll = async (specificInfo, priority, paymentStatus) => {
    this.setState({ specificInfo, priority }, async () => {
      if (paymentStatus) {
        await this.connectWallet();

        this.setState({ submitting: true });
        if (this.state.chainID === 42 || this.state.chainID === '0x2a') {
          await this.processPayment();
        }
      } else {
        this.setState({ submitting: true });
        await this.sendData();
      }
    });
  };

  submitFeedback = async (feedbackOne, feedbackTwo, rating) => {
    this.setState({ feedbackOne, feedbackTwo, rating }, async () => {
      this.setState({ submitting: true });

      await axios
        .post('https://guild-keeper.herokuapp.com/hireus-v2/feedback', {
          key: process.env.REACT_APP_ACCESS_KEY,
          raidID: raidID,
          feedbackOne: this.state.feedbackOne,
          feedbackTwo: this.state.feedbackTwo,
          rating: this.state.rating
        })
        .then(function (response) {
          if (response.data !== 'ERROR') window.location.reload();
        })
        .catch(function (error) {
          console.log(error);
        });

      this.setState({ submitting: false });
    });
  };

  render() {
    return (
      <AppContext.Provider
        value={{
          ...this.state,
          updateStage: this.updateStage,
          setPersonalData: this.setPersonalData,
          setProjectData: this.setProjectData,
          setRequiredServicesData: this.setRequiredServicesData,
          submitAll: this.submitAll,
          submitFeedback: this.submitFeedback
        }}
      >
        {this.props.children}
      </AppContext.Provider>
    );
  }
}

export default AppContextProvider;
