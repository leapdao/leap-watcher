import React, { Component } from 'react';
import Web3 from 'web3';
import { helpers } from 'leap-core';

// Assets
import leapDAO from './assets/images/logo.svg';
import './assets/stylesheets/App.scss';

import bridgeABI from './abis/bridge';
import exitHandlerABI from './abis/exitHandler';

class App extends Component {
  constructor(props) {
    super(props);

    this.getExitSum = this.getExitSum.bind(this);
    this.getPlasmaBalance = this.getPlasmaBalance.bind(this);
    this.getUtxoSum = this.getUtxoSum.bind(this);
    this.initialize = this.initialize.bind(this);
    this.plasma = null;
    this.web3 = null;

    this.state = {
      leap: {
        balance: 0,
        config: {},
        exitSum: 0,
        contractWrapper: {},
        utxoSum: 0,
      }
    }
  }

  componentDidMount() {
    this.initialize();
  }

  async getExitSum() {
    // const { bridge, exitHandler } = this.state.leap.contractWrapper;
    //
    // const exits = [];
    // const uTxo = await this.plasma.getUnspentAll();
    //
    // const fromBlock = await bridge.methods.genesisBlockNumber().call();
    // const events = await exitHandler.getPastEvents({fromBlock});
  }

  getPlasmaBalance() {

  }

  async getUtxoSum() {

  }

  initialize() {
    this.plasma = helpers.extendWeb3(new Web3('https://mainnet-node1.leapdao.org'));
    this.plasma.getConfig().then((config) => {
      this.web3 = new Web3(config.rootNetwork);

      const bridgeContractInstance = new this.web3.eth.Contract(bridgeABI, config.bridgeAddr);
      const exitHandlerContractInstance = new this.web3.eth.Contract(exitHandlerABI, config.exitHandlerAddr);

      this.setState({
        leap: {
          config: config,
          contractWrapper: {
            bridge: bridgeContractInstance,
            exitHandler: exitHandlerContractInstance
          }
        },
      });
    })
    .then(() => {
      // this.getUtxoSum();
      // this.getPlasmaBalance();
      this.getExitSum();
    });
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <div className="leapdao-logo">
            <img src={leapDAO} className="leapdao-logo" alt="logo" />
            <div className="leapdao-logo-text">
              LeapDAO<br/>
              <span className="regular">
                WATCHTOWER
              </span>
            </div>

            <div>

            </div>
          </div>
        </header>
      </div>
    );
  }
}

export default App;
