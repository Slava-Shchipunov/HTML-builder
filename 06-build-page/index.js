const path = require('path');

const { readdir, readFile } = require('fs/promises');

const fs = require('fs');
const fsPromises = fs.promises;

async function mergeHtmlComponents(componentsFolderPath) {
  try {
    let streemRead = fs.createReadStream(path.join(__dirname, 'template.html'));
    let steamWrite = fs.createWriteStream(path.join(__dirname, 'project-dist', 'index.html'));

    let template = '';

    streemRead.on('data', (dataHtml) => {
      template += dataHtml;
    });

    streemRead.on('end', async () => {
      const files = await readdir(componentsFolderPath, {withFileTypes: true});

      for (const file of files) {
        if (file.isFile() && path.extname(file.name) === '.html') {
          const htmlData = await readFile(path.join(componentsFolderPath, file.name));
          const re = new RegExp('{{' + file.name.split('.')[0] + '}}', 'g');
          template = template.replace(re, htmlData);
        }
      }
      steamWrite.write(template);
    });
  }
  catch (error) {
    console.error(error.message);
  }
}

async function mergeStyles(folderPath) {
  try {
    let files = await readdir(folderPath, {withFileTypes: true});
    files = files.sort((a, b) => {
      if (a.name < b.name) {
        return 1;
      }
      if (a.name > b.name) {
        return -1;
      }
      return 0;
    });

    for (const file of files) {
      if (file.isFile() && path.extname(file.name) === '.css') {
        let streem = fs.createReadStream(path.join(__dirname, 'styles', file.name));

        streem.on('data', async (data) => {
          await fsPromises.appendFile(path.join(__dirname, 'project-dist', 'style.css'), data + '\n');
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
    let dirCopyPath = folderPath.split('assets');
    dirCopyPath = path.join(dirCopyPath[0], 'project-dist', 'assets', dirCopyPath[1]);

    await fsPromises.mkdir(dirCopyPath, {recursive: true});

    for (const file of files) {
      if (file.isFile()) {
        const filePath = path.join(folderPath, file.name);
        const fileCopyPath = path.join(dirCopyPath, file.name);
        await fsPromises.copyFile(filePath, fileCopyPath);
      } else if (file.isDirectory()) {
        copyDir(path.join(folderPath, file.name));
      }
    }
  } catch (error) {
    console.error(error.message);
  }
}

function buildPage(dirPath) {
  fs.rm(dirPath, {recursive: true, force: true, maxRetries: 100}, (error) => {
    if (error) {
      console.error(error.message);
      return;
    }
    
    fs.mkdir(dirPath, {recursive: true}, (error) => {
      if (error) {
        console.error(error.message);
        return;
      }

      mergeHtmlComponents(path.join(__dirname, 'components'));
  
      mergeStyles(path.join(__dirname, 'styles'));
  
      copyDir(path.join(__dirname, 'assets'));
    });
  });
}

buildPage(path.join(__dirname, 'project-dist'));
