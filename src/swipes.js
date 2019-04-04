const moment = require('moment');
const EventEmitter = require('events');
const greythrAPI = require('./greythr-api');

class Swipes extends EventEmitter {
  async get() {
    const { error, swipeData = [], swipePairData = [] } = await greythrAPI.getSwipes();
    let lastSwipe = null;

    if (error) {
      console.clear();
      console.log(`${error}\n\nReconnecting ...`);
      this.emit('reconnect', 1000);
      return;
    }

    const swipeTable = swipeData.map(swipe => {
      const momentObj = moment(swipe.punchdatetime);

      lastSwipe = {
        type: swipe.inoutindicator ? 'In' : 'Out',
        time: momentObj
      };

      return {
        Date: momentObj.format('dddd, DD MMMM YYYY'),
        Time: momentObj.format('hh:mm:ss A'),
        Type: swipe.inoutindicator ? 'In' : 'Out',
        Door: swipe.doorname
      };
    });

    const swipePairs = swipePairData.map(pair => {
      return {
        in: moment(pair.inSwipe),
        out: moment(pair.outSwipe)
      }
    });

    this.emit('display-calculator', 0, swipeTable, swipePairs, lastSwipe, moment());
  }
}

module.exports = new Swipes();
