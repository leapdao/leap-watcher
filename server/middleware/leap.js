import { helpers } from "leap-core";
import Web3 from "web3";
const logger = require("pino")();

import bridgeABI from "../abis/bridge";
import exitHandlerABI from "../abis/exitHandler";
import config from "../config";

class Leap {
  constructor() {
    this.web3;
    this.bridge;
    this.exitHandler;

    // instantiate providers and contracts
    this.plasma = helpers.extendWeb3(
      new Web3(config.plasmaProviderUrl)
    );

    this.init();
  }

  init() {
    this.plasma.getConfig().then(async plasmaConfig => {
      // eth provider
      this.web3 = new Web3(plasmaConfig.rootNetwork);

      // bridge contract
      this.bridge = new this.web3.eth.Contract(bridgeABI, plasmaConfig.bridgeAddr);
      // exitHandler contract
      this.exitHandler = new this.web3.eth.Contract(
        exitHandlerABI,
        plasmaConfig.exitHandlerAddr
      );
    });
  }
}

// create a SINGLETON so we only have one instance of leap middleware
export let leap = new Leap();
