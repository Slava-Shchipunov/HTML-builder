const path = require('path');

const fs = require('fs');

let streem = fs.createReadStream(path.resolve(__dirname, 'text.txt'));

streem.on('data', (data) => console.log(data.toString()));