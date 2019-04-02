const readline = require('readline');

const rlInterface = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rlInterface.stdoutMuted = false;

rlInterface._writeToOutput = function _writeToOutput(stringToWrite) {
  if (rlInterface.stdoutMuted)
    rlInterface.output.write("*");
  else
    rlInterface.output.write(stringToWrite);
};

module.exports = rlInterface;
