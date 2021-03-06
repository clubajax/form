require('../src/ui-arrow');
require('../src/ui-searchbox');
require('../src/ui-form');
const dom = require('@clubajax/dom');
const on = require('@clubajax/on');

require('../src/styles/main.scss');

const components = ['checkbox', 'radio-buttons', 'actionbutton', 'checklist', 'drawer', 'dropdown', 'minitags', 'input', 'list', 'popup', 'search', 'tooltip', 'paginator', 'date'];

const nav = document.querySelector('nav');
components.forEach((name) => {
    dom('a', { html: name, href: '#' }, nav);
});
on(nav, 'click', function (e) {
    if (e.target.localName === 'a') {
        document.location.search = e.target.innerHTML;
    }
});

const current = document.location.search.replace('?', '');

components.forEach((name) => {
    if (current === name) {
        require('../src/ui-' + name);
        require('./' + name);
    }
});