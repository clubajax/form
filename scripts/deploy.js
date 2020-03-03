const files = require('@clubajax/node-file-managment');
// require('./fixSourceMaps');

files.updateBuildPackage('./scripts', './build');
files.copyFile('./README.md', './build/README.md');
