require('./common');

let nameData;
fetch('./assets/src/names.json')
    .then((data) => data.json())
    .then((data) => {
        nameData = data;
        on.fire(document, 'data-ready');
    });

mocha.setup('tdd');

suite('UiSearch', function () {
    this.timeout(3000);

    const describe = window.describe,
        test = window.test,
        dom = window.dom,
        on = window.on,
        nodash = window.nodash,
        expect = chai.expect,
        body = dom.byId('tests'),
        data = [
            { label: 'Orange', value: 'orange' },
            { label: 'Red', value: 'red' },
            { label: 'Blue', value: 'blue' },
            { label: 'Green', value: 'green' },
        ];

    function search(value) {
        if (!value) {
            return [];
        }
        function label(item) {
            return `${item.firstName} ${item.lastName}`;
        }
        function val(item) {
            return `${item.firstName.toLowerCase()}-${item.lastName.toLowerCase()}`;
        }
        value = value.toLowerCase();
        return nameData
            .filter((item) => {
                return (
                    item.firstName.toLowerCase().indexOf(value) === 0 ||
                    item.lastName.toLowerCase().indexOf(value) === 0
                );
            })
            .map((item) => {
                return {
                    value: val(item),
                    label: label(item),
                    // alias: item.firstName,
                    display: item.firstName,
                };
            });
    }
    function setSearch(items) {
        function label(item) {
            return `${item.firstName} ${item.lastName}`;
        }
        function val(item) {
            return `${item.firstName.toLowerCase()}-${item.lastName.toLowerCase()}`;
        }
        dom.clean(searchNode);
        const frag = document.createDocumentFragment();
        items.forEach((item) => {
            dom('li', { html: label(item), value: val(item), alias: item.firstName }, frag);
        });
        searchNode.appendChild(frag);
    }

    suite('ui-Search', function () {
        let node, btn;

        function ready(cb) {
            onDomReady(node, cb);
        }

        function click() {
            on.emit(btn, 'click');
        }

        function clickoff(cb) {
            setTimeout(function () {
                on.emit(document.body, 'click');
                cb();
            }, 110);
        }

        function onSearch(e) {
            node.busy = true;
            setTimeout(function () {
                node.busy = false;
                node.data = search(e.detail.value);
            }, 500);
        }

        test('should render a Search', function (done) {
            on(document, 'data-ready', () => {
                node = dom(
                    'ui-search',
                    { data: [], label: 'Simple Search', autoselect: true, placeholder: 'Type to search!' },
                    body
                );
                node.on('search', onSearch);
                node.on('change', (e) => {
                    console.log('CHANGE', e);
                });
                done();
            });
        });

        test('should use a callback for Search', function (done) {
            on(document, 'data-ready', () => {
                setTimeout(() => {
                    node = dom(
                        'ui-search',
                        {
                            data: [],
                            label: 'Simple Search',
                            autoselect: true,
                            placeholder: 'Type to search!',
                            maxheight: 100,
                        },
                        body
                    );
                    node.on('search', onSearch);
                    done();
                }, 100);
            });
        });

        test('should render a simple search box', function (done) {
            on(document, 'data-ready', () => {
                setTimeout(() => {
                    node = dom(
                        'ui-searchbox',
                        { label: 'Simple Box', autoselect: true, placeholder: 'Type to search!' },
                        body
                    );
                    // node.on('search', onSearch);
                    node.on('search', (e) => {
                        console.log('search', e);
                    });
                    done();
                }, 100);
            });
        });
    });
});

mocha.run();
