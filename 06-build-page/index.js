const fs = require('fs');
const path = require('path');

fs.mkdir(path.join(__dirname, 'project-dist'), { recursive: true }, function (err) {
  if (err)  {
    console.log(err.message);
  }
});

const writeStream = fs.createWriteStream(path.join(__dirname, 'project-dist', 'index.html'),'utf8');
let data = '';
let readStream = fs.createReadStream(path.join(__dirname, 'template.html',),'utf-8');
readStream.on('data', chunk => data += chunk);

readStream.on('end', function() {
  fs.readdir (path.join(__dirname, 'components'),function(err, files) {

    for (let i = 0; i < files.length; i++) {
      let file = files[i];
      let ext = path.extname(file).slice(1);
      let componentName = path.basename(file, ext).slice(0,-1);

      if (i !== files.length-1) {
        addComponent(componentName, file);
      } else {
        addLastComponent(componentName, file);
      }

    }
  });

  function addComponent(componentName, file) {
    if(data.includes('{{'+componentName+'}}')) {
      let dataComponent = '';
      let readStreamComponent = fs.createReadStream(path.join(__dirname,'components',file),'utf-8');
      readStreamComponent.on('data', chunk => dataComponent += chunk);
      readStreamComponent.on('end', function () {
        data = data.replace('{{'+componentName+'}}', dataComponent);
      });
    }
  }

  function addLastComponent(componentName,file) {
    let dataComponent = '';
    let readStreamComponent = fs.createReadStream(path.join(__dirname,'components',file),'utf-8');
    readStreamComponent.on('data', chunk => dataComponent += chunk);
    readStreamComponent.on('end', function () {
      data = data.replace('{{'+componentName+'}}', dataComponent);
      writeStream.write(data);
    });
  }

});


const writeStreamStyles = fs.createWriteStream(path.join(__dirname,'project-dist', 'style.css'));
fs.readdir (path.join(__dirname, 'styles'),function(err, files) {

  for (let file of files) {
    let ext = path.extname(file);

    fs.stat(path.join(__dirname, 'styles', file), function (err, stats) {
      if (stats.isFile() && (ext === '.css')) {
        let dataStyles = '';
        let readStreamStyles = fs.createReadStream(path.join(__dirname, 'styles', file),'utf-8');
        readStreamStyles.on('data', chunk => dataStyles += chunk);
        readStreamStyles.on('end', () =>  writeStreamStyles.write(dataStyles));
        readStreamStyles.on('error', error => console.log('Error', error.message));
      }
    });
  }
});


fs.stat(path.join(__dirname,'project-dist','assets'), function(err){

  if(!err){
    fs.readdir (path.join(__dirname,'project-dist','assets'),function(err, copyFiles) {

      for (let dataFile of copyFiles) {
        fs.stat(path.join(__dirname, 'project-dist','assets', dataFile), function (err, stats) {

          if (stats.isFile()) {
            fs.unlink(path.join(__dirname, 'project-dist','assets', dataFile), err => {

              if (err) {
                console.log(err.message);
              }
            });

          } else {

            fs.readdir (path.join(__dirname,'project-dist','assets', dataFile),function(err, copyFiles) {

              for (let file of copyFiles) {
                fs.stat(path.join(__dirname, 'project-dist','assets', dataFile, file), function (err, stats) {

                  if (stats.isFile()) {
                    fs.unlink(path.join(__dirname, 'project-dist','assets', dataFile,file), err => {

                      if (err) {
                        console.log(err.message);
                      }
                    });
                  }
                });
              }
            });
          }
        });
      }
    });
  }

  fs.mkdir(path.join(__dirname,'project-dist','assets'), { recursive: true }, function () {
    fs.readdir (path.join(__dirname,'assets'),function(err, dataAssets) {

      for (let dataAsset of dataAssets) {
        fs.stat(path.join(__dirname, 'assets', dataAsset), function (err, stats) {

          if (stats.isFile()) {
            fs.copyFile(path.join(__dirname, 'assets', dataAsset), path.join(__dirname, 'project-dist', 'assets', dataAsset), (err) => {

              if (err) {
                console.log(err.message);
              }
            });

          } else {

            fs.mkdir(path.join(__dirname, 'project-dist', 'assets', dataAsset), {recursive: true}, function () {
              fs.readdir(path.join(__dirname, 'assets', dataAsset), function (err, dataAssets) {

                for (let dataFile of dataAssets) {
                  fs.stat(path.join(__dirname, 'assets', dataAsset, dataFile), function (err, stats) {

                    if (stats.isFile()) {
                      fs.copyFile(path.join(__dirname, 'assets', dataAsset, dataFile), path.join(__dirname, 'project-dist', 'assets', dataAsset, dataFile), (err) => {

                        if (err) {
                          console.log(err.message);
                        }
                      });
                    }
                  });
                }
              });
            });
          }
        });
      }
    });
  });

});