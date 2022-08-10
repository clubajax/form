require('./common');

mocha.setup('tdd');

suite('UiMonthPicker', function () {
    this.timeout(3000);

    const data = [];
    var suite = window.suite,
        test = window.test,
        dom = window.dom,
        on = window.on,
        body = dom.byId('tests');

    function click(node, index) {
        const lis = dom.queryAll(node.popup, 'li');
        node.once('open', function () {
            on.emit(lis[index], 'click');
        });
        on.emit(node.button, 'click');
    }

    function select(node, index, eventName) {
        eventName = eventName || 'change';
        return new Promise(function (resolve) {
            node.once(eventName, function (e) {
                resolve(e);
            });
            node.once('open', function () {
                on.emit(node.popup.children[index], 'click');
            });
            on.emit(node.button, 'click');
        });
    }

    suite('ui-month-picker', function () {
        test('it should render with a value', function (done) {
            const node = dom(
                'ui-month-picker',
                {
                    value: '11/2018',
                    'years-next': 10,
                },
                body,
            );
            onDomReady(node, function () {
                node.on('change', (e) => {
                    console.log('change', e.value);
                });
                done();
            });
        });
    });

    suite('ui-month-input', function () {
        test('it should render an input', function (done) {
            const node = dom(
                'ui-month-input',
                {
                    value: '11/2018',
                    'years-next': 10,
                    class: 'top-middle',
                },
                body,
            );
            onDomReady(node, function () {
                node.on('change', (e) => {
                    console.log('change', e.value);
                });
                done();
            });
        });

        test.only('it should handle min and max', function (done) {
            const node = dom(
                'ui-month-input',
                {
                    value: '11/2018',
                    min: '09/2018',
                    max: '03/2019',
                    class: 'top-middle',
                },
                body,
            );
            onDomReady(node, function () {
                node.on('change', (e) => {
                    console.log('change', e.value);
                });
                done();
            });
        });
    });
});

mocha.run();
