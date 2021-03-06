const request = require('request').defaults({ jar: true });
const moment = require('moment');

const { origin = '' } = require('./../config.json');

if (!origin.trim()) {
  console.log('Add origin in config.json\n');
  process.exit();
}

module.exports = {
  login(username = '', password = '') {
    return new Promise(resolve => {
      if (!username || !password) {
        resolve({ error: 'Username or Password cannot be empty' });
      }

      const config = {
        url: `${origin}/j_spring_security_check`,
        form: { j_username: username, j_password: password }
      };

      request.post(config, function (err, httpResponse) {
        if (err) {
          resolve({ error: err });
          return;
        }

        const { statusCode, headers: { location } } = httpResponse;

        if (statusCode === 302) {
          // Redirection
          if (location.includes('home.do')) {
            resolve({ error: null });
          } else if (location.includes('login.do')) {
            resolve({ error: 'Invalid username or password' });
          } else {
            resolve({ error: `Uncaught error: ${location}` });
          }
        } else {
          resolve({ error: statusCode });
        }
      });
    });
  },

  getSwipes() {
    return new Promise(resolve => {
      const today = moment().format('DD MMM YYYY');

      const config = {
        url: `${origin}/v2/attendance/info/loadDaywiseAttendanceData`,
        qs: {
          attDate: today,
          startDate: today,
          _: moment().valueOf()
        }
      };

      request.get(config, function (err, httpResponse, body) {
        if (err) {
          resolve({ error: err });
          return;
        }

        try {
          const { swipeData, swipePairData } = JSON.parse(body);
          resolve({ error: null, swipeData, swipePairData });
        } catch (parseError) {
          resolve({ error: parseError });
        }
      });
    });
  }
};
