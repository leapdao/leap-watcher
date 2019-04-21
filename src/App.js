import React, { Component } from "react";
import { Main, Field, Button, TextInput } from "@aragon/ui";
// Assets
import leapDAO from "./assets/images/logo.svg";
import "./assets/stylesheets/App.scss";

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      address: null,
      tel: null
    };
  }
  
  render() {
    return (
      <Main>
        <div className="App">
          <header className="App-header">
            <div className="leapdao-logo">
              <img src={leapDAO} className="leapdao-logo" alt="logo" />
              <div className="leapdao-logo-text">
                LeapDAO
                <br />
                <span className="regular">WATCHTOWER</span>
              </div>

              <div style={{ width: "50%" }}>
                <h4>
                  Receive notifications of malicious activity on LeapDAO Plasma
                  chain via text message, so you can take action immediatly.
                </h4>

                <form onSubmit={this.addSubscription}>
                  <Field className="labels" label="Ethereum Address" />
                  <TextInput type="text" className="input-fields" placeholder="0x000000...."/>

                  <Field label="Phone Number"  />
                  <TextInput type="tel" className="input-fields" placeholder="998-988-9999"/>

                  <Button> Watch </Button>
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
