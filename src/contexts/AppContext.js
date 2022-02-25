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

  // Auction Queue Functions
  // getRaidBalance = async () => {
  //   const RAID = new this.state.web3.eth.Contract(
  //     RAID_ABI,
  //     RAID_CONTRACT_ADDRESS,
  //   );
  //   const balance = await RAID.methods.balanceOf(this.state.account).call();
  //   const balanceConverted = this.state.web3.utils.fromWei(balance);
  //   const allowance = await RAID.methods
  //     .allowance(this.state.account, QUEUE_CONTRACT_ADDRESS)
  //     .call();
  //   const allowanceConverted = this.state.web3.utils.fromWei(allowance);
  //   this.setState({
  //     raidBalance: balanceConverted,
  //     raidAllowance: allowanceConverted,
  //   });
  // };

  // onChangeDepositAmount = amount => {
  //   this.setState({ depositAmount: amount });
  //   if (amount === '') {
  //     this.setState({ isApproved: false });
  //   } else if (
  //     BigInt(this.state.web3.utils.toWei(amount)) >
  //     BigInt(this.state.web3.utils.toWei(this.state.raidAllowance))
  //   ) {
  //     this.setState({ isApproved: false });
  //   } else {
  //     this.setState({ isApproved: true });
  //   }
  // };

  // onDeposit = async consultationId => {
  //   const hex = this.state.web3.utils.asciiToHex(consultationId);
  //   this.setState({ isDepositPending: true, hash: '' });
  //   try {
  //     const QUEUE_CONTRACT = new this.state.web3.eth.Contract(
  //       QUEUE_ABI,
  //       QUEUE_CONTRACT_ADDRESS,
  //     );
  //     await QUEUE_CONTRACT.methods
  //       .submitBid(this.state.web3.utils.toWei(this.state.depositAmount), hex)
  //       .send({
  //         from: this.state.account,
  //       })
  //       .once('transactionHash', async hash => {
  //         this.setState({ hash: hash });
  //       })
  //       .on('confirmation', async () => {
  //         await this.getRaidBalance();
  //         this.onChangeDepositAmount('');
  //       })
  //       .on('error', async error => {
  //         this.setState({ txFailed: true });
  //         console.error('Could not submit bid', error);
  //       });
  //   } catch (err) {
  //     console.error('Could not submit bid', err);
  //   }
  //   this.setState({ isDepositPending: false });
  // };

  // onIncreaseBid = async bidId => {
  //   this.setState({ isDepositPending: true, hash: '' });
  //   try {
  //     const QUEUE_CONTRACT = new this.state.web3.eth.Contract(
  //       QUEUE_ABI,
  //       QUEUE_CONTRACT_ADDRESS,
  //     );
  //     await QUEUE_CONTRACT.methods
  //       .increaseBid(
  //         this.state.web3.utils.toWei(this.state.depositAmount),
  //         bidId,
  //       )
  //       .send({
  //         from: this.state.account,
  //       })
  //       .once('transactionHash', async hash => {
  //         this.setState({ hash: hash });
  //       })
  //       .on('confirmation', async () => {
  //         await this.getRaidBalance();
  //         this.onChangeDepositAmount('');
  //       })
  //       .on('error', async error => {
  //         this.setState({ txFailed: true });
  //         console.error('Could not submit bid', error);
  //       });
  //   } catch (err) {
  //     console.error('Could not submit bid', err);
  //   }
  //   this.setState({ isDepositPending: false });
  // };

  // onWithdraw = async consultationId => {
  //   this.setState({ isWithdrawPending: true, hash: '' });
  //   try {
  //     const QUEUE_CONTRACT = new this.state.web3.eth.Contract(
  //       QUEUE_ABI,
  //       QUEUE_CONTRACT_ADDRESS,
  //     );
  //     await QUEUE_CONTRACT.methods
  //       .withdrawBid(
  //         this.state.web3.utils.toWei(this.state.withdrawalAmount),
  //         consultationId,
  //       )
  //       .send({
  //         from: this.state.account,
  //       })
  //       .once('transactionHash', async hash => {
  //         this.setState({ hash: hash });
  //       })
  //       .on('confirmation', async () => {
  //         await this.getRaidBalance();
  //         this.onChangeWithdrawalAmount('');
  //       })
  //       .on('error', async error => {
  //         this.setState({ txFailed: true });
  //         console.error('Could not withdraw tokens', error);
  //       });
  //   } catch (err) {
  //     console.error('Could not withdraw tokens', err);
  //   }
  //   this.setState({ isWithdrawPending: false });
  // };

  // onCancel = async id => {
  //   this.setState({ isCancelPending: true, hash: '' });
  //   try {
  //     const QUEUE_CONTRACT = new this.state.web3.eth.Contract(
  //       QUEUE_ABI,
  //       QUEUE_CONTRACT_ADDRESS,
  //     );
  //     await QUEUE_CONTRACT.methods
  //       .cancelBid(id)
  //       .send({
  //         from: this.state.account,
  //       })
  //       .once('transactionHash', async hash => {
  //         this.setState({ hash: hash });
  //       })
  //       .on('confirmation', async () => {
  //         await this.getRaidBalance();
  //         this.onChangeWithdrawalAmount('');
  //       })
  //       .on('error', async error => {
  //         this.setState({ txFailed: true });
  //         console.error('Could not withdraw tokens', error);
  //       });
  //   } catch (err) {
  //     console.error('Could not withdraw tokens', err);
  //   }
  //   this.setState({ isCancelPending: false });
  // };

  // onAccept = async id => {
  //   this.setState({ isAcceptPending: true, hash: '' });
  //   try {
  //     const QUEUE_CONTRACT = new this.state.web3.eth.Contract(
  //       QUEUE_ABI,
  //       QUEUE_CONTRACT_ADDRESS,
  //     );
  //     await QUEUE_CONTRACT.methods
  //       .acceptBid(id)
  //       .send({
  //         from: this.state.account,
  //       })
  //       .once('transactionHash', async hash => {
  //         this.setState({ hash: hash });
  //       })
  //       .on('confirmation', async () => {
  //         await this.getRaidBalance();
  //         this.onChangeWithdrawalAmount('');
  //       })
  //       .on('error', async error => {
  //         this.setState({ txFailed: true });
  //         console.error('Could not withdraw tokens', error);
  //       });
  //   } catch (err) {
  //     console.error('Could not withdraw tokens', err);
  //   }
  //   this.setState({ isAcceptPending: false });
  // };

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
