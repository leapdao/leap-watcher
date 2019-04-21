const EventEmitter = require('events');

class Poller extends EventEmitter {
  constructor() {
    super();

    this.timeout = 100;
  }

  poll(timeout) {
    setTimeout(() => this.emit('poll'), timeout ? timeout : this.timeout);
  }

  onPoll(callback) {
    this.on('poll', callback);
  }
}

export default Poller;
