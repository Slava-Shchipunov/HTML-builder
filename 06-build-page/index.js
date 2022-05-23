const path = require('path');

const { readdir } = require('fs/promises');

const fs = require('fs');
const fsPromises = fs.promises;

function mergeHtmlComponents(componentsFolderPath) {
  let streem = fs.createReadStream(path.resolve(__dirname, 'project-dist/index.html'));
  streem.on('data', (dataIndexHtml) => {
    fs.readdir(componentsFolderPath, {withFileTypes: true}, (error, files) => {
      if (error) {
        console.error(error.message);
        return;
      }
    
      for (const file of files) {
        if (file.isFile() && path.extname(file.name) === '.html') {
          let streem = fs.createReadStream(path.resolve(componentsFolderPath + '/' + file.name));
    
          streem.on('data', (data) => {
            const re = new RegExp('{{' + file.name.split('.')[0] + '}}', 'g');
            dataIndexHtml = dataIndexHtml.toString().replace(re, data);
            let streemWrite = fs.createWriteStream(path.resolve(__dirname, 'project-dist/index.html'));
            streemWrite.write(dataIndexHtml);
          });
        }
      }
    });
  });
}

async function mergeStyles(folderPath) {
  try {
    let files = await readdir(folderPath, {withFileTypes: true});
    files = files.sort((a, b) => {
      if (a.name < b.name) {
        return -1;
      }

      if (a.name > b.name) {
        return 1;
      }
      return 0;
    }).reverse();

    for (const file of files) {
      if (file.isFile() && path.extname(file.name) === '.css') {
        let streem = fs.createReadStream(path.resolve(__dirname, 'styles/' + file.name));

        streem.on('data', (data) => {
          fsPromises.appendFile(path.resolve(__dirname, 'project-dist/' + 'style.css'), data + '\n');
        });
      }
    }
  } catch (error) {
    console.error(error.message);
  }
}

async function copyDir(folderPath) {
  try {
    const files = await readdir(folderPath, {withFileTypes: true});
    const dirCopyPath = folderPath.split('assets').join('project-dist/assets');

    fsPromises.mkdir(path.resolve(dirCopyPath), {recursive: true});

    for (const file of files) {
      if (file.isFile()) {
        const filePath = path.resolve(folderPath + '/' + file.name);
        const fileCopyPath = path.resolve(dirCopyPath + '/' + file.name);
        fsPromises.copyFile(filePath, fileCopyPath);
      } else if (file.isDirectory()) {
        copyDir(path.resolve(folderPath + '/' + file.name));
      }
    }
  } catch (error) {
    console.error(error.message);
  }
}

fs.rm(path.resolve(__dirname, 'project-dist'), {recursive: true, force: true}, (error) => {
  if (error) {
    console.error(error.message);
    return;
  }
  
  fsPromises.mkdir(path.resolve(__dirname, 'project-dist'), {recursive: true});

  fsPromises.copyFile(path.resolve(__dirname, 'template.html'), path.resolve(__dirname, 'project-dist/index.html'));
  
  mergeStyles(path.resolve(__dirname, 'styles'));

  copyDir(path.resolve(__dirname, 'assets'));

  mergeHtmlComponents(path.resolve(__dirname, 'components'));
});
