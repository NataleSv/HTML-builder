const fs = require('fs');
const path = require('path');

fs.stat(path.join(__dirname, 'files-copy'), function(err){
  if (!err) {
    fs.readdir (path.join(__dirname, 'files-copy'),function(err, copyFiles) {
      for (let file of copyFiles) {
        fs.unlink(path.join(__dirname, 'files-copy', file), err => {
          if (err)  {
            console.log(err.message);
          }
        });
      }
    });
  }

  fs.mkdir(path.join(__dirname, 'files-copy'), { recursive: true }, function () {

    fs.readdir (path.join(__dirname, 'files'),function(err, files) {
      for (let file of files) {

        fs.copyFile(path.join(__dirname, 'files', file), path.join(__dirname, 'files-copy', file), (err) => {
          if (err)  {
            console.log(err.message);
          }
        });
      }
    });
  });
});

