const readlineSync = require('readline-sync');
const EventEmitter = require('events');
const greythrAPI = require('./greythr-api');
const config = require('./../config.json');

class Login extends EventEmitter {
  constructor() {
    super();
    this.username = '';
    this.password = '';
  }

  prompt(loginError = null) {
    console.clear();

    console.log(`greytHR Login\nOrigin: ${config.origin || ''}\n`);

    if (loginError) {
      console.log(`Login Error: ${loginError}\n`);
    }

    const username = (!loginError && config.username && config.username.trim()) || readlineSync.question('Username: ');
    const password = (!loginError && config.password && config.password.trim()) || readlineSync.question('Password: ', { hideEchoBack: true });

    this.handler(username, password);
  }

  async handler(username, password) {
    this.username = username;
    this.password = password;

    const { error } = await greythrAPI.login(username, password);

    if (!error) {
      // Cache username and password for reconnecting if needed
      this.username = username;
      this.password = password;
      this.emit('get-swipes');
    } else {
      this.prompt(error);
    }
  }
}

module.exports = new Login();
