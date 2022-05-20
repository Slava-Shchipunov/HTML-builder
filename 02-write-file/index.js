const path = require('path');

const fs = require('fs');

const process = require('process');

const readline = require('readline').createInterface({
  input: process.stdin,
  output: process.stdout
});

let streemWrite = fs.createWriteStream(path.resolve(__dirname, 'places.txt'));

const checkInput = (input) => {
  if (input === 'exit') {
    console.log('Thanks for the reply, bye!');
    readline.close();
  } else {
    streemWrite.write(input + '\n');
  }
};

readline.question('Where are you from? \n', (answer) => {
  checkInput(answer);
  readline.on('line', (answer) => {
    checkInput(answer);
  });
});

readline.on('SIGINT', () => {
  console.log('Thanks for the reply, bye!');
  readline.close();
});
