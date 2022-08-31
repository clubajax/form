const { on, dom } = require('../src/libs');
window.dom = dom;
window.on = on;

mocha.allowUncaught();
