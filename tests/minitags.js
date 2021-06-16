require('./common');

mocha.setup('tdd');

suite('UiMiniTags', function () {
    this.timeout(3000);
    var suite = window.suite,
        test = window.test,
        dom = window.dom,
        on = window.on,
        body = dom.byId('tests'),

        data = [
            { label: 'Orange', value: 'orange' },
            { label: 'Red', value: 'red' },
            { label: 'Blue', value: 'blue' },
            { label: 'Green', value: 'green' },
        ],
        data2 = [
            { label: 'Puppy', value: 'puppy' },
            { label: 'Birdy', value: 'birdy' },
            { label: 'Kitty', value: 'kitty' },
            { label: 'Snakey', value: 'snakey' },
            { label: 'Purple', value: 'purple' },
            { label: 'Yellow', value: 'yellow' },
            { label: 'Cyan', value: 'cyan' },
            { label: 'Indigo', value: 'indigo' },
            { label: 'Orange1', value: 'orange1' },
            { label: 'Red1', value: 'red1' },
            { label: 'Blue1', value: 'blue1' },
            { label: 'Green1', value: 'green1' },
            { label: 'Purple1', value: 'purple1' },
            { label: 'Yellow1', value: 'yellow1' },
            { label: 'Cyan1', value: 'cyan1' },
            { label: 'Indigo1', value: 'indigo1' },
        ];

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

    suite('ui-minitags', function () {
        test('it should render with no values', function (done) {
            const node = dom(
                'ui-minitags',
                {
                    data: data,
                },
                body
            );
            onDomReady(node, function () {
                node.on('change', (e) => {
                    console.log('change', e.value);
                });
                done();
            });
        });

        test('it should render with values', function (done) {
            done();

            setTimeout(() => {
                const node = dom(
                    'ui-minitags',
                    {
                        data: [...data, ...data2],
                        value: ['kitty', 'blue'],
                    },
                    body
                );
                onDomReady(node, function () {
                    node.on('change', (e) => {
                        console.log('change', e.value);
                    });
                });
            }, 100);
        });

        test.only('it should open in a popup', function () {
            setTimeout(() => {
                const buttonid = 'test-button';
                const button = dom('button', { id: buttonid, html: 'Open Tags' }, body);

                on(button, 'click', () => {
                    const node = dom('ui-minitags', {
                        noselfdestroy: true,
                        data: [...data, ...data2],
                        value: ['kitty', 'blue'],
                    });
                    const popup = dom(
                        'ui-popup',
                        {
                            buttonid,
                            html: node,
                        },
                        body
                    );

                    popup.onDomReady(() => {
                        popup.show();
                    });

                    node.on('popup-close', () => {
                        node.destroy();
                    });
                });
            }, 100);
        });
    });
});

mocha.run();
