import React, { Component } from 'react';

// Assets
import leapDAO from './assets/images/logo.svg';
import './assets/stylesheets/App.scss';

class App extends Component {
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
