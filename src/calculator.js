const moment = require('moment');
const EventEmitter = require('events');
const timeUtil = require('./time-util');
const delay = require('./delay');

class Calculator extends EventEmitter {
  async display(swipeTable = [], swipePairs = [], lastSwipe = null, lastUpdated = moment()) {
    console.clear();
    console.log(`Swipes last updated: ${lastUpdated.format('hh:mm:ss A')}\n`);

    if (!swipeTable.length) {
      // Retry every 5 seconds to get swipes if not found
      console.log('No swipes found. Retrying ...');
      this.emit('get-swipes', 5000);
      return;
    }

    const inCount = swipeTable.filter(swipe => swipe.Type === 'In').length;
    const outCount = swipeTable.filter(swipe => swipe.Type === 'Out').length;

    if (Math.abs(inCount - outCount) > 1) {
      console.log('WARNING: Swipe errors detected\n');
    }

    console.table(swipeTable);

    let time = this.calculate(swipePairs, lastSwipe);

    console.log(`\nTime Completed: ${time}`);

    if (moment().diff(lastUpdated) > 30000) {
      // Get new swipes after every 30 seconds to prevent session timeout
      // and to keep swipes updated
      console.clear();
      console.log('Refreshing swipes. Please wait ...');
      this.emit('get-swipes', 1000);
      return;
    }

    // Recalculate time after every 1 second
    await delay(1000);
    this.display(swipeTable, swipePairs, lastSwipe, lastUpdated);
  }

  calculate(swipePairs = [], lastSwipe = null) {
    let msecs = 0;

    for (let pair of swipePairs) {
      msecs += pair.out.diff(pair.in);
    }

    if (lastSwipe && lastSwipe.type === 'In') {
      msecs += moment().valueOf() - lastSwipe.time.valueOf();
    }

    return timeUtil.msecsToHHMMSS(msecs);
  }
}

module.exports = new Calculator();
