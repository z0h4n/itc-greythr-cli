const calculator = require('./calculator');
const ticker = require('./ticker');
const login = require('./login');
const screen = require('./screen');

ticker.on('tick', calculator.calculate);
login.ask();
