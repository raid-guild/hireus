/* eslint-disable no-undef */
import { Component, createContext } from 'react';
import Web3 from 'web3';
import Web3Modal from 'web3modal';
import WalletConnectProvider from '@walletconnect/web3-provider';
import { QUEUE_CONTRACT_ADDRESS, RAID_CONTRACT_ADDRESS } from 'web3/constants';

export const AppContext = createContext();

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

// RINKEBY
const RAID_ABI = require('../abi/ERC20_ABI.json');
const QUEUE_ABI = require('../abi/QUEUE_ABI.json');

// KOVAN TESTNET
// const DAI_CONTRACT_ADDRESS = '0xff795577d9ac8bd7d90ee22b6c1703490b6512fd';
// const DAI_ABI = require('../abi/DAI_ABI.json');

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

    // Consultation Queue
    raidBalance: '0',
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
        }}
      >
        {this.props.children}
      </AppContext.Provider>
    );
  }
}

export default AppContextProvider;
