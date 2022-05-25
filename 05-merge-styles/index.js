const path = require('path');

const { readdir } = require('fs/promises');

const fs = require('fs');
const fsPromises = fs.promises;

async function mergeStyles(folderPath) {
  try {
    const files = await readdir(folderPath, {withFileTypes: true});

    for (const file of files) {
      if (file.isFile() && path.extname(file.name) === '.css') {
        let streem = fs.createReadStream(path.resolve(__dirname, 'styles/' + file.name));

        streem.on('data', async (data) => {
          await fsPromises.appendFile(path.resolve(__dirname, 'project-dist/' + 'bundle.css'), data + '\n');
        });
      }
    }
  } catch (error) {
    console.error(error.message);
  }
}

fs.rm(path.resolve(__dirname, 'project-dist/' + 'bundle.css'), {recursive: true, force: true}, (error) => {
  if (error) {
    console.error(error.message);
    return;
  }
  
  mergeStyles(path.resolve(__dirname, 'styles'));
});
