const moment = require('moment');
const rlInterface = require('./rl-interface');
const greythrAPI = require('./greythr-api');

const login = {
  prompt(loginError = null) {
    console.clear();

    console.log('greytHR Login\n');

    if (loginError) {
      console.log(`Login Error: ${loginError}\n`);
    }

    rlInterface.question('Username: ', username => {
      rlInterface.question('Password: ', async password => {
        rlInterface.stdoutMuted = false;
        const { error } = await greythrAPI.login(username, password);

        if (!error) {
          swipes.get();
        } else {
          login.prompt(error);
        }
      });
      rlInterface.stdoutMuted = true;
    });
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
      process.exit(error);
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

    console.table(swipeTable);

    let time = calculator.calculate(swipePairs, lastSwipe);

    console.log(`\n${time}`);

    if (moment().diff(swipes.lastUpdated) > 60000) {
      console.clear();
      console.log('Refreshing swipes. Please wait ...');
      setTimeout(swipes.get, 1000);
      return;
    }

    if (lastSwipe && lastSwipe.type === 'In') {
      setTimeout(calculator.display.bind(null, swipeTable, swipePairs, lastSwipe), 1000);
    }
  },

  calculate(swipePairs = [], lastSwipe = null) {
    let time = 0;

    for (let pair of swipePairs) {
      time += pair.out.diff(pair.in);
    }

    if (lastSwipe && lastSwipe.type === 'In') {
      time += moment().valueOf() - lastSwipe.time.valueOf();
    }

    let hours = time / (1000 * 60 * 60);
    let minutes = (hours - parseInt(hours)) * 60;
    let seconds = (minutes - parseInt(minutes)) * 60;

    hours = parseInt(hours);
    minutes = parseInt(minutes);
    seconds = parseInt(seconds);

    hours = hours < 10 ? `0${hours}` : `${hours}`;
    minutes = minutes < 10 ? `0${minutes}` : `${minutes}`;
    seconds = seconds < 10 ? `0${seconds}` : `${seconds}`;

    return `${hours}:${minutes}:${seconds}`;
  }
};

login.prompt();
