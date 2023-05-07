const fs = require('fs');
const path = require('path');
fs.readdir (path.join(__dirname, 'secret-folder'),function(err, files) {

  for (let file of files) {
    let ext = path.extname(file).slice(1);
    let base = path.basename(file, ext).slice(0,-1);

    fs.stat(path.join(__dirname, 'secret-folder', file), function (err, stats) {
      if (stats.isFile()) {
        console.log (base + ' - ' + ext + ' - ' + stats.size +' байт');
      }
    });
  }
});