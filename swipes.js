const moment = require('moment');
const screen = require('./screen');
const ticker = require('./ticker');

const swipes = {
  swipeData: [],
  swipePairData: [],

  save(swipeData = [], swipePairData = []) {
    swipes.swipeData = swipeData.map(swipe => {
      return {
        time: moment(swipe.punchdatetime),
        type: swipe.inoutindicator ? 'In' : 'Out',
        door: swipe.doorname
      }
    });

    swipes.swipePairData = swipePairData.map(pair => {
      return {
        in: moment(pair.inSwipe),
        out: moment(pair.outSwipe)
      }
    });

    const swipeTable = swipes.swipeData.map(swipe => {
      return {
        Time: swipe.time.format('DD-MM-YYYY, hh:mm:ss A'),
        Type: swipe.type,
        Door: swipe.door
      }
    });

    screen.clear().write(swipeTable, console.table).write(`\n`);
    ticker.emit('tick');
  },

  get last() {
    const { swipeData } = swipes;
    return swipeData[swipeData.length - 1] || null;
  }
};

module.exports = swipes;