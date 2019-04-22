const logger = require("pino")();
import BN from "bn.js";

import Poller from "../lib/poller";
import { leap } from "../middleware/leap";
import { twilioClient } from "../middleware/twilio";

import config from "../../src/config";
import ERC20Abi from "../abis/ERC20";
import redis from "redis";

class Watcher {
  constructor() {
    this.state = {
      uTxoSum: 0,
      exitSum: 0,
      plasmaBalance: 0
    };

    this.init = this.init.bind(this);
    this.redis = redis.createClient();
  }

  async init() {
    const poller = new Poller();

    poller.onPoll(async () => {
      logger.info("##### STARTING PLASMA CHECK #####");
      logger.info("");
      logger.info(await this.validateLeapPlasma());
      logger.info("##### FINISHED PLASMA CHECK #####");
      poller.poll(config.pollingDelay);
    });

    if (leap.web3) {
      poller.poll();
    } else {
      setTimeout(this.init, 500);
    }
  }

  async getUnspentTransactionSum() {
    const { bridge, exitHandler, plasma, web3 } = leap;
    const exits = [];

    const uTxos = await plasma.getUnspentAll();
    logger.info(`UNSPENT TRANSACTIONS: ${uTxos.length}`);

    const addresses = await plasma.getColors();
    logger.info(`ADDRESSES: ${addresses.length}`);

    const colors = await Promise.all(
      addresses.map(async address => {
        return plasma.getColor(address);
      })
    );
    logger.info(`COLORS: ${colors.length}`);

    const uTxoSums = await Promise.all(
      colors.map(async color => {
        return uTxos.reduce((hexValue, uTxo) => {
          if (uTxo.output.color === color) {
            const value = new BN(uTxo.output.value).add(hexValue);

            return value;
          } else {
            return hexValue;
          }
        }, new BN(0));
      })
    );

    let utxs = 0;

    for (let i = 0; i < uTxoSums.length; i++) {
      const numberAmount = parseFloat(
        web3.utils.fromWei(uTxoSums[i].toString(), "ether")
      );

      utxs += numberAmount;
    }

    this.state.uTxoSum = utxs;
    logger.info(`PLASMA UTXO SUM: ${this.state.uTxoSum}`);
  }

  async getExitSum() {
    const { bridge, exitHandler, web3, plasma } = leap;

    const fromBlock = await bridge.methods.genesisBlockNumber().call();
    const events = await exitHandler.getPastEvents("ExitStarted", {
      fromBlock
    });
    let exits = [];

    await Promise.all(
      events.map(async event => {
        const transactionId = event.id;
        const exit = await exitHandler.methods
          .exits(web3.utils.toHex(transactionId))
          .call();

        exits.push({ event, exit });

        const exitSum = exits.reduce((acc, e) => {
          return !e.exit.finalized ? new BN(e.exit.amount).add(acc) : acc;
        }, new BN(0));

        this.state.exitSum = parseFloat(web3.utils.fromWei(exitSum, "ether"));
      })
    );

    logger.info(`PLASMA EXITS SUM: ${this.state.exitSum}`);
  }

  async getPlasmaBalance() {
    const { plasma, web3, exitHandler, bridge } = leap;

    const addresses = await plasma.getColors();
    let plasmaBalance = 0;

    await Promise.all(
      addresses.map(async address => {
        const contractInstance = await new web3.eth.Contract(ERC20Abi, address);
        const exitHandlerBalance = await contractInstance.methods
          .balanceOf(exitHandler.options.address)
          .call();
        const bridgeBalance = await contractInstance.methods
          .balanceOf(bridge.options.address)
          .call();
        const totalBalance = new BN(exitHandlerBalance)
          .add(new BN(bridgeBalance))
          .toString();
        const numberBalance = web3.utils.fromWei(totalBalance, "ether");

        plasmaBalance += parseFloat(numberBalance);
      })
    );

    this.state.plasmaBalance = plasmaBalance;
    logger.info(`PLASMA BALANCE: ${this.state.plasmaBalance}`);
  }

  async isPlasmaValid() {
    const { exitSum, uTxoSum, plasmaBalance } = this.state;

    if (exitSum + uTxoSum === plasmaBalance) {
      logger.info(`VALID PLASMA: true`);
      this.redis.set("leapPlasmaValid", true);
    } else {
      logger.error(`VALID PLASMA: false`);
      await this.redis.get("leapPlasmaValid", async (err, isValid) => {
        if(isValid === 'true') {
          await this.redis.hgetall("subscriptions", async (err, response) => {
            this.redis.set("leapPlasmaValid", false);

            for (const prop in response) {
              const phoneNumber = response[prop];

              logger.info(`SENDING MESSAGE TO: ${phoneNumber}`);
              const date = new Date();

              await twilioClient.sendNotifications({
                body: `ALERT: LEAP PLASMA IS UNDER ATTACK! YOU HAVE 7 DAYS TO EXIT STARTING NOW! ${date.toString("dddd, dd MMMM yyyy")}`,
                to: phoneNumber
              });
            }
          });
        }
      });
    }
  }

  async validateLeapPlasma() {
    await this.getUnspentTransactionSum();
    await this.getExitSum();
    await this.getPlasmaBalance();
    await this.isPlasmaValid();
  }
}

export default Watcher;
