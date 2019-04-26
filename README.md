# Leap Watcher
A blockchain validation tool for subscribing to notifications and monitoring the validity of the LeapDAO implementation of More Viable Plasma, but should work with slight tweaks for any implementation that follows the MV Plasma standards. Created for the Ethereal Virtual Hackathon.

# Requirements
- Twilio Account(Paid)
- Redis Server

# Installation
`git clone https://github.com/travisdmathis/leap-watcher.git`

`npm install`

# Edit Config
Update the config file in `src/config`

```
module.exports = {
  plasmaProviderUrl: "https://mainnet-node1.leapdao.org",
  pollingDelay: 60000, // in ms
  twilioAuthToken: '',
  twilioId: '',
  twilioNumber: '',
  web3ProviderUrl: "https://mainnet.infura.io/v3/{yourkey}"
};
```

# Running app
`npm run dev`

Subscription UI @ http://localhost:3000

Watchtower/API @ http://localhost:3001
