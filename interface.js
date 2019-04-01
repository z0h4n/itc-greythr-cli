const readline = require('readline');

const interface = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

interface.stdoutMuted = false;

interface._writeToOutput = function _writeToOutput(stringToWrite) {
  if (interface.stdoutMuted)
    interface.output.write("*");
  else
    interface.output.write(stringToWrite);
};

module.exports = interface;
