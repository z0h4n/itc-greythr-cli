require('./polyfills');

const moment = require('moment');
const greythrAPI = require('./greythr-api');
const config = require('./config.json');
const readlineSync = require('readline-sync');

const login = {
  username: '',
  password: '',

  async prompt(loginError = null) {
    console.clear();

    console.log('greytHR Login\n');

    if (loginError) {
      console.log(`Login Error: ${loginError}\n`);
    }

    const username = (!loginError && config.username && config.username.trim()) || readlineSync.question('Username: ');
    const password = (!loginError && config.password && config.password.trim()) || readlineSync.question('Password: ', { hideEchoBack: true });

    login.handler(username, password);
  },

  async handler(username, password) {
    const { error } = await greythrAPI.login(username, password);

    if (!error) {
      // Cache username and password for reconnecting if needed
      login.username = username;
      login.password = password;

      swipes.get();
    } else {
      login.prompt(error);
    }
  }
};

const swipes = {
  lastUpdated: moment(),

  async get() {
    const { error, swipeData = [], swipePairData = [] } = await greythrAPI.getSwipes();
    let lastSwipe = null;

    if (error) {
      console.clear();
      console.log(error);
      console.log(`\nReconnecting ...`);
      setTimeout(login.handler.bind(null, login.username, login.password), 1000);
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

    swipes.lastUpdated = moment();

    calculator.display(swipeTable, swipePairs, lastSwipe);
  }
};

const calculator = {
  display(swipeTable = [], swipePairs = [], lastSwipe = null) {
    console.clear();
    console.log(`Swipes last updated: ${swipes.lastUpdated.format('hh:mm:ss A')}\n`);

    if (!swipeTable.length) {
      console.log('No swipes found. Retrying ...');
      setTimeout(swipes.get, 5000);
      return;
    }

    const inCount = swipeTable.filter(swipe => swipe.Type === 'In').length;
    const outCount = swipeTable.filter(swipe => swipe.Type === 'Out').length;

    if (Math.abs(inCount - outCount) > 1) {
      console.log('WARNING: Swipe errors detected\n');
    }

    console.table(swipeTable);

    let time = calculator.calculate(swipePairs, lastSwipe);

    console.log(`\nTime Completed: ${time}`);

    if (moment().diff(swipes.lastUpdated) > 30000) {
      console.clear();
      console.log('Refreshing swipes. Please wait ...');
      setTimeout(swipes.get, 1000);
      return;
    }

    setTimeout(calculator.display.bind(null, swipeTable, swipePairs, lastSwipe), 1000);
  },

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
};

const timeUtil = {
  msecsToHHMMSS(msecs = 0) {
    let hours = msecs / (1000 * 60 * 60);
    let minutes = (hours - parseInt(hours)) * 60;
    let seconds = (minutes - parseInt(minutes)) * 60;

    hours = parseInt(hours);
    minutes = parseInt(minutes);
    seconds = parseInt(seconds);

    hours = hours < 10 ? `0${hours}` : `${hours}`;
    minutes = minutes < 10 ? `0${minutes}` : `${minutes}`;
    seconds = seconds < 10 ? `0${seconds}` : `${seconds}`;

    return `${hours}:${minutes}:${seconds}`;
  },

  msecsToSS(msecs = 0) {
    let secs = parseInt(msecs / 1000);
    secs = Math.max(0, secs);
    return secs < 10 ? `0${secs}` : `${secs}`;
  }
};

login.prompt();
