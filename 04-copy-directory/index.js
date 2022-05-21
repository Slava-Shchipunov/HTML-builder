const path = require('path');

const { readdir } = require('fs/promises');

const fs = require('fs');
const fsPromises = fs.promises;

async function copyDir(folderPath) {
  try {
    const files = await readdir(folderPath, {withFileTypes: true});

    for (const file of files) {
      if (file.isFile()) {
        const filePath = path.resolve(__dirname, 'files/' + file.name);
        const fileCopyPath = path.resolve(__dirname, 'files-copy/' + file.name);
        fsPromises.copyFile(filePath, fileCopyPath);
      }
    }
  } catch (error) {
    console.error(error.message);
  }
}

fs.rm(path.resolve(__dirname, 'files-copy'), {recursive: true, force: true}, (error) => {
  if (error) {
    console.error(error.message);
    return;
  }

  fsPromises.mkdir(path.resolve(__dirname, 'files-copy'), {recursive: true});
  
  copyDir(path.resolve(__dirname, 'files'));
});
