const interface = require('./interface');
const api = require('./api');
const swipes = require('./swipes');

const attendance = {
  get() {
    api.getSwipes(swipes.save, attendance.fail);
  },

  fail() {
    interface.write(`\nFailed to get attendance data... Retrying in 5 seconds\n\n`);
    setTimeout(attendance.get, 5000);
  }
};

module.exports = attendance;
