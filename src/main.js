require('./polyfills');

const login = require('./login');
const swipes = require('./swipes');
const calculator = require('./calculator');
const delay = require('./delay');

login.on('get-swipes', async (delayTime = 0) => {
  await delay(delayTime);
  swipes.get();
});

swipes.on('reconnect', async (delayTime = 0) => {
  await delay(delayTime);
  login.handler(login.username, login.password);
});

swipes.on('display-calculator', async (delayTime = 0, ...data) => {
  await delay(delayTime);
  calculator.display(...data);
});

calculator.on('get-swipes', async (delayTime = 0) => {
  await delay(delayTime);
  swipes.get();
});

login.prompt();
