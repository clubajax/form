import '../src/ui-arrow';
import '../src/ui-searchbox';
import '../src/ui-form';
import on from '@clubajax/on';
import dom from '@clubajax/dom';
import '../src/styles/main.scss';
import './test.scss';

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

        if (current === 'date') {
            require('../src/date-picker/date-range-input');
        }
    }
});
