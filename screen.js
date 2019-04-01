const interface = require('./interface');
const config = require('./config.json');

const screen = {
  clear() {
    interface.stdoutMuted = false;
    interface.write('\033c\n');
    interface.write(`${config.company_name || ''}\n\n`);
    return screen;
  },

  clearLine() {
    interface.output.clearLine();
    interface.output.cursorTo(0);
    return screen;
  },

  write(msg, printFn) {
    interface.stdoutMuted = false;
    if (typeof printFn === 'function') {
      printFn(msg);
    } else {
      interface.write(msg);
    }
    return screen;
  },

  input(question, onSubmit, isPassword = false) {
    interface.question(question, onSubmit);
    interface.stdoutMuted = isPassword;
    return screen;
  }
};

module.exports = screen;