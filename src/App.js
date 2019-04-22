import React, { Component } from "react";
import { Main, Field, Button, TextInput } from "@aragon/ui";
import Web3 from "web3";
import {
  AsYouType as FormatPhoneNumber,
} from "libphonenumber-js";

// Assets
import leapDAO from "./assets/images/logo.svg";
import "./assets/stylesheets/App.scss";

// Config
import config from "./config";

class App extends Component {
  constructor(props) {
    super(props);

    this.addSubscription = this.addSubscription.bind(this);
    this.updateAddress = this.updateAddress.bind(this);
    this.updatePhoneNumber = this.updatePhoneNumber.bind(this);
    this.resetMessage = this.resetMessage.bind(this);

    this.state = {
      address: "",
      tel: "",
      web3: new Web3(config.web3ProviderUrl),
      message: {
        body: "",
        type: ""
      }
    };
  }

  async addSubscription() {
    const { tel, address } = this.state;

    const subscription = {
      phoneNumber: tel,
      address: address,
    }

    await fetch("http://localhost:3001/subscribe", {
      method: "POST",
      body: JSON.stringify(subscription),
      headers: {
        "Content-Type": "application/json"
      }
    })
    .then((response) => {
      console.log('RESPONSE', response);

      if(!response.ok) {
        this.setState({
          message: {
            body: 'This phone number is already subscribed.',
            type: 'error'
          }
        });
      } else {
        this.setState({
          message: {
            body: 'You have successfully subscribed to LeapDAO notifications',
            type: 'success'
          }
        });
      }

      this.resetMessage();
    })
    .catch((error) => {
      this.setState({
        message: {
          body: error.message,
          type: 'error'
        }
      });
    });
  }

  resetMessage(delay) {
    setTimeout(
      () => {
        this.setState({
          message: {
            body: "",
            type: ""
          }
        });
      },
      delay ? delay : 5000
    );
  }

  updateAddress(event) {
    const { web3 } = this.state;

    if (event.target.value === "") {
      this.resetMessage(1);
      return;
    }

    if (web3.utils.isAddress(event.target.value)) {
      this.setState({
        address: event.target.value
      });
    } else {
      this.setState({
        message: {
          body: "Not a valid Ethereum address.",
          type: "error"
        }
      });
    }
  }

  updatePhoneNumber(event) {
    this.setState({
      tel: new FormatPhoneNumber().input(event.target.value)
    });
  }

  render() {
    const validSubscriptionData =
      this.state.tel !== "" && this.state.address !== "";

    return (
      <Main>
        <div className="App">
          <header className="App-header">
            <div className="leapdao-container">
              <div className="messages">
                <div className={this.state.message.type}>
                  <p>{this.state.message.body}</p>
                </div>
              </div>

              <img src={leapDAO} className="leapdao-logo" alt="logo" />
              <div className="leapdao-logo-text">
                LeapDAO
                <br />
                <span className="regular">WATCHTOWER</span>
              </div>

              <div style={{ width: "50%" }}>
                <h4>
                  Receive notifications of malicious activity on LeapDAO Plasma
                  Chain via text message, so you can take action immediatly.
                </h4>

                <form>
                  <Field className="labels" label="Ethereum Address" />
                  <TextInput
                    type="text"
                    onChange={this.updateAddress}
                    className="input-fields"
                    placeholder="0x000000...."
                  />

                  <Field className="labels" label="Phone Number" />
                  <TextInput
                    type="tel"
                    value={this.state.tel}
                    onChange={this.updatePhoneNumber}
                    className="input-fields"
                    placeholder="19989889999"
                    name="usrtel"
                    pattern="\d*"
                  />

                  <Button
                    onClick={this.addSubscription}
                    disabled={!validSubscriptionData}
                    className={
                      validSubscriptionData
                        ? "watch-button enabled"
                        : "watch-button disabled"
                    }
                  >
                    {" "}
                    Subscribe to Notifications{" "}
                  </Button>
                </form>
              </div>
            </div>
          </header>
        </div>
      </Main>
    );
  }
}

export default App;
