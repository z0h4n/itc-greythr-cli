const EventEmitter = require('events');

class Ticker extends EventEmitter {
  constructor() {
    super();
    this.paused = true;
  }

  start() {
    this.paused = false;
  }

  stop() {
    this.paused = true;
  }

  tick() {
    if (this.paused) return;
    setTimeout(() => {
      if (!this.paused) this.emit('tick');
    }, 1000)
  }
}

module.exports = new Ticker();