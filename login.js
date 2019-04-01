const api = require('./api');
const attendance = require('./attendance');
const screen = require('./screen');

const login = {
  ask(error = '') {
    screen.clear();

    if (error) {
      screen.write(`Login Failed: ${error}\n\n`);
    }
    
    screen.input('Username: ', (username) => {
      screen.input('Password: ', (password) => {
        api.login(username, password, attendance.get, login.fail);
      }, true);
    });
  },

  fail(error) {
    login.ask(error);
  }
};

module.exports = login;
