// require('../src/ui-checkbox');
// require('../src/ui-checklist');
// require('../src/ui-actionbutton');
// require('../src/ui-minitags');
// require('../src/ui-arrow');
// require('../src/ui-input');
// require('../src/ui-list');
// require('../src/ui-popup');
// require('../src/ui-dropdown');
// require('../src/ui-search');
// require('../src/ui-searchbox');
// require('../src/ui-tooltip');
// require('../src/ui-drawer');
// require('../src/ui-paginator');
// require('../src/ui-actionbutton');
// require('../src/ui-form');
// require('../src/date-picker/date-picker');
// require('../src/date-picker/date-input');
const dom = require('@clubajax/dom');
const on = require('@clubajax/on');

require('../src/styles/main.scss');

const components = ['checkbox', 'actionbutton'];
const nav = document.querySelector('nav');
components.forEach((name) => {
    dom('a', { html: name, href: '#' }, nav);
});
on(nav, 'click', function (e) {
    if (e.target.localName === 'a') {
        console.log('target', e.target);
        document.location.search = e.target.innerHTML;
    }
});

const current = document.location.search.replace('?', '');
console.log('current', current);

components.forEach((name) => {
    if (current === name) {
        require('../src/ui-' + name);
        require('./' + name);
    }
});
