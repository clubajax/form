const fs = require('fs');
const path = require('path');

const CSS = '/*# sourceMappingURL=@clubajax/form/form.css.map*/';
const JS = '//# sourceMappingURL=@clubajax/form/index.js.map';

const cssPath = './build/form.css';
const css = fs.readFileSync(cssPath).toString().split('\n');
css.pop();
css.push(CSS);
fs.writeFileSync(cssPath, css.join('\n'));

const jsPath = './build/index.js';
const js = fs.readFileSync(jsPath).toString().split('\n');
js.pop();
js.push(JS);
fs.writeFileSync(jsPath, js.join('\n'));