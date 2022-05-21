const path = require('path');

const { readdir } = require('fs/promises');
const fs = require('fs');

async function getData(folderPath) {
  try {
    const files = await readdir(folderPath, {withFileTypes: true});
    
    for (const file of files) {
      if (file.isFile()) {
        const data = file.name.split('.');
        const filePath = path.resolve(__dirname, 'secret-folder/' + file.name);

        fs.stat(filePath, (error, stats) => {
          if (error) {
            console.error(error.message);
            return;
          }

          const fileSize = stats.size.toString() + ' bytes';
          data.push(fileSize);
          console.log(data.join(' - '));
        });
      }
    }
  } catch (error) {
    console.error(error.message);
  }
}

getData(path.resolve(__dirname, 'secret-folder'));
