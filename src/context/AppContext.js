/* eslint-disable no-undef */
import React, { Component, createContext } from 'react';
import Web3 from 'web3';
import Web3Modal from 'web3modal';
import WalletConnectProvider from '@walletconnect/web3-provider';
import {
  DAO_ADDRESS,
  QUEUE_CONTRACT_ADDRESS,
  RAID_CONTRACT_ADDRESS,
} from '../constants/index';

export const AppContext = createContext();

const axios = require('axios');

const providerOptions = {
  walletconnect: {
    package: WalletConnectProvider,
    options: {
      rpc: {
        1: process.env.REACT_APP_MAINNET_NODE_ENDPOINT,
      },
    },
  },
};

const web3Modal = new Web3Modal({
  network: 'mainnet',
  cacheProvider: true,
  providerOptions,
});

//MAINNET
const DAI_CONTRACT_ADDRESS = '0x6B175474E89094C44Da98b954EedeAC495271d0F';
const DAI_ABI = require('../abi/DAI_ABI.json');

// RINKEBY
const RAID_ABI = require('../abi/ERC20_ABI.json');
const QUEUE_ABI = require('../abi/QUEUE_ABI.json');
const MOLOCH_ABI = require('../abi/MOLOCH_ABI.json');

// KOVAN TESTNET
// const DAI_CONTRACT_ADDRESS = '0xff795577d9ac8bd7d90ee22b6c1703490b6512fd';
// const DAI_ABI = require('../abi/DAI_ABI.json');

let raidID = '';

class AppContextProvider extends Component {
  state = {
    // UX state
    stage: 1,
    account: '',
    chainID: '',
    web3: '',
    submitting: false,
    hash: '',
    notEnoughBalance: false,
    faqModalStatus: false,
    feePaid: false,
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
    servicesRequired: [],
    selectedDay: '',
    budgetRange: '',
    //Additional Info state
    specificInfo: '',
    priority: '',
    //Feedback Info state
    feedbackOne: '',
    feedbackTwo: '',
    rating: '',

    // Consultation Queue
    raidBalance: '0',
    shares: 0,
    raidAllowance: '0',
    depositAmount: '',
    withdrawalAmount: '',
    isApproved: false,
    isDepositPending: false,
    fundsSufficient: false,
    isWithdrawPending: false,
    isCancelPending: false,
    isAcceptPending: false,
    txFailed: false,
    cancelModalStatus: false,
  };

  inputChangeHandler = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  updateFaqModalStatus = status => {
    this.setState({ faqModalStatus: status });
  };

  updateStage = type => {
    this.setState(prevState => {
      return {
        stage: type === 'previous' ? prevState.stage - 1 : prevState.stage + 1,
      };
    });
  };

  setPersonalData = contactType => {
    this.setState({
      contactType,
    });
  };

  setProjectData = (projectType, projectSpecs) => {
    this.setState({
      projectType,
      projectSpecs,
    });
  };

  setRequiredServicesData = (servicesRequired, selectedDay, budgetRange) => {
    this.setState({
      servicesRequired,
      selectedDay,
      budgetRange,
    });
  };

  connectWallet = async () => {
    // web3Modal.clearCachedProvider();

    const provider = await web3Modal.connect();
    const web3 = new Web3(provider);
    const accounts = await web3.eth.getAccounts();
    const chainID = await web3.eth.net.getId();

    this.setState({ account: accounts[0], chainID, web3 });

    provider.on('accountsChanged', accounts => {
      this.setState({ account: accounts[0] });
    });

    provider.on('chainChanged', chainId => {
      this.setState({ chainID: chainId });
    });

    if (chainID === 100) {
      await this.getRaidBalance();
      await this.getShares();
    }
  };

  disconnectWallet = () => {
    web3Modal.clearCachedProvider();
    this.setState({
      account: '',
      chainID: '',
      web3: '',
    });
  };

  // Auction Queue Functions
  getRaidBalance = async () => {
    const RAID = new this.state.web3.eth.Contract(
      RAID_ABI,
      RAID_CONTRACT_ADDRESS,
    );
    const balance = await RAID.methods.balanceOf(this.state.account).call();
    const balanceConverted = this.state.web3.utils.fromWei(balance);
    const allowance = await RAID.methods
      .allowance(this.state.account, QUEUE_CONTRACT_ADDRESS)
      .call();
    const allowanceConverted = this.state.web3.utils.fromWei(allowance);
    this.setState({
      raidBalance: balanceConverted,
      raidAllowance: allowanceConverted,
    });
  };

  getShares = async () => {
    const DAO = new this.state.web3.eth.Contract(MOLOCH_ABI, DAO_ADDRESS);
    const members = await DAO.methods.members(this.state.account).call();
    this.setState({ shares: Number(members['1'] || 0) });
  };

  onChangeDepositAmount = amount => {
    this.setState({ depositAmount: amount });
    if (amount === '') {
      this.setState({ isApproved: false });
    } else if (
      BigInt(this.state.web3.utils.toWei(amount)) >
      BigInt(this.state.web3.utils.toWei(this.state.raidAllowance))
    ) {
      this.setState({ isApproved: false });
    } else {
      this.setState({ isApproved: true });
    }
  };

  onChangeWithdrawalAmount = amount => {
    this.setState({ withdrawalAmount: amount });
  };

  onApprove = async () => {
    this.setState({ isDepositPending: true, hash: '' });
    try {
      const RAID = new this.state.web3.eth.Contract(
        RAID_ABI,
        RAID_CONTRACT_ADDRESS,
      );
      await RAID.methods
        .approve(
          QUEUE_CONTRACT_ADDRESS,
          this.state.web3.utils.toWei(this.state.depositAmount),
        )
        .send({
          from: this.state.account,
        })
        .once('transactionHash', async hash => {
          this.setState({ hash: hash });
        })
        .on('confirmation', async () => {
          await this.getRaidBalance();
          this.onChangeDepositAmount(this.state.depositAmount);
        })
        .on('error', async error => {
          this.setState({ txFailed: true });
          console.error('Could not approve token', error);
        });
    } catch (err) {
      console.error('Could not approve token', err);
    }
    this.setState({ isDepositPending: false });
  };

  onDeposit = async consultationId => {
    const hex = this.state.web3.utils.asciiToHex(consultationId);
    this.setState({ isDepositPending: true, hash: '' });
    try {
      const QUEUE_CONTRACT = new this.state.web3.eth.Contract(
        QUEUE_ABI,
        QUEUE_CONTRACT_ADDRESS,
      );
      await QUEUE_CONTRACT.methods
        .submitBid(this.state.web3.utils.toWei(this.state.depositAmount), hex)
        .send({
          from: this.state.account,
        })
        .once('transactionHash', async hash => {
          this.setState({ hash: hash });
        })
        .on('confirmation', async () => {
          await this.getRaidBalance();
          this.onChangeDepositAmount('');
        })
        .on('error', async error => {
          this.setState({ txFailed: true });
          console.error('Could not submit bid', error);
        });
    } catch (err) {
      console.error('Could not submit bid', err);
    }
    this.setState({ isDepositPending: false });
  };

  onIncreaseBid = async bidId => {
    this.setState({ isDepositPending: true, hash: '' });
    try {
      const QUEUE_CONTRACT = new this.state.web3.eth.Contract(
        QUEUE_ABI,
        QUEUE_CONTRACT_ADDRESS,
      );
      await QUEUE_CONTRACT.methods
        .increaseBid(
          this.state.web3.utils.toWei(this.state.depositAmount),
          bidId,
        )
        .send({
          from: this.state.account,
        })
        .once('transactionHash', async hash => {
          this.setState({ hash: hash });
        })
        .on('confirmation', async () => {
          await this.getRaidBalance();
          this.onChangeDepositAmount('');
        })
        .on('error', async error => {
          this.setState({ txFailed: true });
          console.error('Could not submit bid', error);
        });
    } catch (err) {
      console.error('Could not submit bid', err);
    }
    this.setState({ isDepositPending: false });
  };

  onWithdraw = async consultationId => {
    this.setState({ isWithdrawPending: true, hash: '' });
    try {
      const QUEUE_CONTRACT = new this.state.web3.eth.Contract(
        QUEUE_ABI,
        QUEUE_CONTRACT_ADDRESS,
      );
      await QUEUE_CONTRACT.methods
        .withdrawBid(
          this.state.web3.utils.toWei(this.state.withdrawalAmount),
          consultationId,
        )
        .send({
          from: this.state.account,
        })
        .once('transactionHash', async hash => {
          this.setState({ hash: hash });
        })
        .on('confirmation', async () => {
          await this.getRaidBalance();
          this.onChangeWithdrawalAmount('');
        })
        .on('error', async error => {
          this.setState({ txFailed: true });
          console.error('Could not withdraw tokens', error);
        });
    } catch (err) {
      console.error('Could not withdraw tokens', err);
    }
    this.setState({ isWithdrawPending: false });
  };

  onCancel = async id => {
    this.setState({ isCancelPending: true, hash: '' });
    try {
      const QUEUE_CONTRACT = new this.state.web3.eth.Contract(
        QUEUE_ABI,
        QUEUE_CONTRACT_ADDRESS,
      );
      await QUEUE_CONTRACT.methods
        .cancelBid(id)
        .send({
          from: this.state.account,
        })
        .once('transactionHash', async hash => {
          this.setState({ hash: hash });
        })
        .on('confirmation', async () => {
          await this.getRaidBalance();
          this.onChangeWithdrawalAmount('');
        })
        .on('error', async error => {
          this.setState({ txFailed: true });
          console.error('Could not withdraw tokens', error);
        });
    } catch (err) {
      console.error('Could not withdraw tokens', err);
    }
    this.setState({ isCancelPending: false });
  };

  onAccept = async id => {
    this.setState({ isAcceptPending: true, hash: '' });
    try {
      const QUEUE_CONTRACT = new this.state.web3.eth.Contract(
        QUEUE_ABI,
        QUEUE_CONTRACT_ADDRESS,
      );
      await QUEUE_CONTRACT.methods
        .acceptBid(id)
        .send({
          from: this.state.account,
        })
        .once('transactionHash', async hash => {
          this.setState({ hash: hash });
        })
        .on('confirmation', async () => {
          await this.getRaidBalance();
          this.onChangeWithdrawalAmount('');
        })
        .on('error', async error => {
          this.setState({ txFailed: true });
          console.error('Could not withdraw tokens', error);
        });
    } catch (err) {
      console.error('Could not withdraw tokens', err);
    }
    this.setState({ isAcceptPending: false });
  };

  updateCancelModalStatus = status => {
    this.setState({ cancelModalStatus: status });
  };
  // End of Auction Queue Functionality

  sendData = async (hash = 'not paid') => {
    await axios
      .post(`${process.env.REACT_APP_HIREUS_BASE_ENDPOINT}/consultation`, {
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
        transaction_hash: hash,
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

    if (this.state.web3.utils.fromWei(balance) < 500) {
      this.setState({ notEnoughBalance: true, submitting: false });
      return;
    } else {
      this.setState({ notEnoughBalance: false });
    }

    this.setState({ submitting: true });

    try {
      await DAI.methods
        .transfer(
          '0x3C3692681cD1c0F42FA68A2521719Cc24CEc3AF3',
          this.state.web3.utils.toWei('500'),
        )
        .send({
          from: this.state.account,
        })
        .once('transactionHash', async hash => {
          this.setState({ hash: hash });
          await this.sendData(hash);
        });
    } catch (err) {
      this.setState({ submitting: false });
    }
  };

  submitAll = async (specificInfo, priority, paymentStatus) => {
    this.setState({ specificInfo, priority }, async () => {
      if (paymentStatus) {
        console.log('processing');
        await this.connectWallet();
        console.log('connected');
        if (this.state.chainID === 1 || this.state.chainID === '0x1') {
          await this.processPayment();
          this.setState({ feePaid: true });
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
        .post(`${process.env.REACT_APP_HIREUS_BASE_ENDPOINT}/feedback`, {
          key: process.env.REACT_APP_ACCESS_KEY,
          raidID: raidID,
          feedbackOne: this.state.feedbackOne,
          feedbackTwo: this.state.feedbackTwo,
          rating: this.state.rating,
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
          connectWallet: this.connectWallet,
          disconnectWallet: this.disconnectWallet,
          onChangeDepositAmount: this.onChangeDepositAmount,
          onChangeWithdrawalAmount: this.onChangeWithdrawalAmount,
          onApprove: this.onApprove,
          onDeposit: this.onDeposit,
          onIncreaseBid: this.onIncreaseBid,
          onWithdraw: this.onWithdraw,
          onCancel: this.onCancel,
          onAccept: this.onAccept,
          updateCancelModalStatus: this.updateCancelModalStatus,
          updateStage: this.updateStage,
          setPersonalData: this.setPersonalData,
          setProjectData: this.setProjectData,
          setRequiredServicesData: this.setRequiredServicesData,
          submitAll: this.submitAll,
          submitFeedback: this.submitFeedback,
          inputChangeHandler: this.inputChangeHandler,
          updateFaqModalStatus: this.updateFaqModalStatus,
        }}
      >
        {this.props.children}
      </AppContext.Provider>
    );
  }
}

export default AppContextProvider;
