const moment = require('moment');
const EventEmitter = require('events');
const timeUtil = require('./time-util');
const delay = require('./delay');
const { sessions } = require('./../config.json');

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

    console.log(`\n Time Completed: ${timeUtil.msecsToHHMMSS(time)} \n`);

    if (Array.isArray(sessions)) {
      const sessionTable = sessions.map(session => {
        const remainingTime = session.time - time;
        return {
          'Session Name': session.name,
          'Session Time': timeUtil.msecsToHHMMSS(session.time),
          'Remaining Time': remainingTime <= 0 ? 'Session Complete' : timeUtil.msecsToHHMMSS(remainingTime),
          'Completes On': remainingTime <= 0 ? 'Session Complete' : moment(moment.now() + remainingTime).format('hh:mm:ss A')
        }
      });
      console.table(sessionTable);
    }

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

    return msecs;
  }
}

module.exports = new Calculator();
