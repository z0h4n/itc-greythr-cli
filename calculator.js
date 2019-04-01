const moment = require('moment');
const swipes = require('./swipes');
const screen = require('./screen');
const ticker = require('./ticker');

const calculator = {
  calculate() {
    let time = 0;
    const { swipePairData, last } = swipes;

    for (let pair of swipePairData) {
      time += pair.out.diff(pair.in);
    }

    if (last && last.type === 'In') {
      time += moment().valueOf() - last.time.valueOf();
      setTimeout(calculator.calculate, 1000);
    }

    const hours = time / (1000 * 60 * 60);
    const minutes = (hours - parseInt(hours)) * 60;
    const seconds = (minutes - parseInt(minutes)) * 60;

    screen.clearLine().write(`${parseInt(hours)}:${parseInt(minutes)}:${parseInt(seconds)}`);
  }
};

module.exports = calculator;
