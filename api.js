const request = require('request').defaults({ jar: true });
const config = require('./config.json');

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const origin = config.origin;

function noop() { }

module.exports = {
  login(username = '', password = '', fnSuccess = noop, fnFailure = noop) {
    if (!username || !password) {
      fnFailure('Username or Password cannot be empty');
      return;
    }

    const config = {
      url: `${origin}/j_spring_security_check`,
      form: { j_username: username, j_password: password }
    };

    request.post(config, function (err, httpResponse) {
      if (err) {
        fnFailure(err);
        return;
      }

      const { statusCode, headers: { location } } = httpResponse;

      if (statusCode === 302 && location === `${origin}/home.do`) {
        fnSuccess();
      } else {
        fnFailure(statusCode);
      }
    });
  },

  getSwipes(fnSuccess = noop, fnFailure = noop) {
    const today = new Date();

    const day = today.getDay();
    const month = months[today.getMonth()];
    const year = today.getFullYear();

    const config = {
      url: `${origin}/v2/attendance/info/loadDaywiseAttendanceData`,
      qs: {
        attDate: `${day} ${month} ${year}`,
        startDate: `${day} ${month} ${year}`,
        _: Date.now()
      }
    };

    request.get(config, function (err, httpResponse, body) {
      if (err) {
        fnFailure();
        return;
      }

      const response = JSON.parse(body);

      fnSuccess(response.swipeData, response.swipePairData);
    });
  }
};
