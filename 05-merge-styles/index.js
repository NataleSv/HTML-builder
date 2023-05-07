const fs = require('fs');
const path = require('path');

const writeStream = fs.createWriteStream(path.join(__dirname,'project-dist', 'bundle.css'));
fs.readdir (path.join(__dirname, 'styles'),function(err, files) {

  for (let file of files) {
    let ext = path.extname(file);

    fs.stat(path.join(__dirname, 'styles', file), function (err, stats) {
      if (stats.isFile() && (ext === '.css')) {
        console.log (file);
        let data = '';
        let readStream = fs.createReadStream(path.join(__dirname, 'styles', file),'utf-8');
        readStream.on('data', chunk => data += chunk);
        readStream.on('end', () =>  writeStream.write(data));
        readStream.on('error', error => console.log('Error', error.message));
      }
    });
  }
});