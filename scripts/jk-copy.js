const files = require('@clubajax/node-file-managment');
files.copyFile('./build/index.js', '../../janiking-international/jk-gink/node_modules/@clubajax/form/index.js');
files.copyFile('./build/index.js.map', '../../janiking-international/jk-gink/node_modules/@clubajax/form/index.js.map');
files.copyFile('./build/form.css', '../../janiking-international/jk-gink/node_modules/@clubajax/form/form.css');
files.copyFile('./build/form.css.map', '../../janiking-international/jk-gink/node_modules/@clubajax/form/form.css.map');
console.log('\nfiles copied to JK Gink\n');
