require('./common');

mocha.setup('tdd');

suite('List', function () {
    this.timeout(3000);
    const
        suite = window.suite,
        test = window.test,
        dom = window.dom,
        on = window.on,
        expect = chai.expect,
        body = dom.byId('tests'),
        data = [
            {label: 'Orange', value: 'orange'},
            {label: 'Red', value: 'red'},
            {label: 'Blue', value: 'blue'},
            {label: 'Green', value: 'green'}
        ],
        data2 = [
            {label: 'Puppy', value: 'puppy'},
            {label: 'Birdy', value: 'birdy'},
            {label: 'Kitty', value: 'kitty'},
            {label: 'Snakey', value: 'snakey'}
        ],
        data3 = [
            dom('li', {html: 'Mike Wilcox', id: 1}),
            dom('li', {html: 'Lance Cox', id: 2}),
            dom('li', {html: 'Bob Byron', id: 3}),
            dom('li', {html: 'Ben Jones', id: 4})
        ],
        data4 = [
            dom('li', {
                value: 'boston',
                alias: 'Boston, Massachussetts',
                class: 'custom', html: [
                    dom('div', {html: 'Boston'}),
                    dom('div', {html: 'Massachussetts'})
                ]
            }),
            dom('li', {
                value: 'detroit',
                alias: 'Detroit, Michigan',
                class: 'custom', html: [
                    dom('div', {html: 'Detroit'}),
                    dom('div', {html: 'Michigan'})
                ]
            }),
            dom('li', {
                value: 'milwaukee',
                alias: 'Milwaukee, Wisconsin',
                class: 'custom', html: [
                    dom('div', {html: 'Milwaukee'}),
                    dom('div', {html: 'Wisconsin'})
                ]
            }),
            dom('li', {
                value: 'las-vegas',
                alias: 'Las Vegas, Nevada',
                class: 'custom', html: [
                    dom('div', {html: 'Las Vegas'}),
                    dom('div', {html: 'Nevada'})
                ]
            })
        ],
        dataL = [
            {label: 'Fruit', type: 'label'},
            {label: 'Oranges', value: 'oranges'},
            {label: 'Apples', value: 'apples'},
            {type: 'divider'},
            {label: 'Grapes', value: 'grapes'},
            {label: 'Prunes', value: 'prunes'},
            {label: 'Veggies', type: 'label'},
            {label: 'Corn', value: 'corn'},
            {label: 'Peas', value: 'peas'}
        ],
        dataD = [
            {label: 'Fruit', type: 'label'},
            {label: 'Oranges', value: 'oranges'},
            {label: 'Apples', value: 'apples', disabled: true},
            {label: 'Grapes', value: 'grapes'},
            {label: 'Prunes', value: 'prunes', selected: true},
            {label: 'Veggies', type: 'label'},
            {label: 'Corn', value: 'corn'},
            {label: 'Peas', value: 'peas', disabled: true}
        ],
        dataF = [
            dom('li', {
                value: 'Boston',
                class: 'custom', html: [
                    dom('div', {html: 'Boston'}),
                    dom('div', {html: 'Massachussetts'})
                ]
            }),
            dom('li', {
                value: 'Detroit',
                class: 'custom', html: [
                    dom('div', {html: 'Detroit'}),
                    dom('div', {html: 'Michigan'})
                ]
            }),
            dom('li', {
                value: 'Milwaukee',
                class: 'custom', html: [
                    dom('div', {html: 'Milwaukee'}),
                    dom('div', {html: 'Wisconsin'})
                ]
            }),
            dom('li', {
                value: 'Las Vega',
                class: 'custom', html: [
                    dom('div', {html: 'Las Vegas'}),
                    dom('div', {html: 'Nevada'})
                ]
            })
        ],
        data5 = function () {
            return [
                {label: 'Puppy', value: 'puppy'},
                {label: 'Birdy', value: 'birdy'},
                {label: 'Kitty', value: 'kitty'},
                {label: 'Snakey', value: 'snakey'}
            ];
        },
        data6 = [
            {label: 'Orange', value: 'orange'},
            {label: 'Red', value: 'red', selected: true},
            {label: 'Blue', value: 'blue', selected: true},
            {label: 'Green', value: 'green'}
        ];

    let node;

    const frag = dom.frag(dataF);

    function click(index) {
        const lis = dom.queryAll(node.popup, 'li');
        node.once('open', function () {
            on.emit(lis[index], 'click');
        });
        on.emit(node.button, 'click');
    }

    function key(k) {
        on.emit(node.list, 'keydown', {key: k});
    }

    function copy(d) {
        return JSON.parse(JSON.stringify(d));
    }

    let value;
    let items;
    let values;
    function setup(options) {
        node = dom('ui-list', options, body);
        node.onDomReady(function () {
            items = dom.queryAll(node, 'li');
            values = items.map(function (n) {
                return n.getAttribute('value');
            })
        });
        on(node, 'dom-update', () => {
            items = dom.queryAll(node, 'li');
        });
        value = false;
        on(node, 'change', function (e) {
            // console.log('change', e.value);
            value = e.value;
        });
    }

    function ready(cb) {
        onDomReady(node, function () {
            setTimeout(cb, 30);
        });
    }

    function update() {
        items = dom.queryAll(node, 'li');
    }

    function destroy() {
        node.destroy();
        value = false;
    }

    function testKeyNav() {
        node.list.focus();
        key('ArrowDown');
        expect(items[1].getAttribute('aria-current')).to.equal('true');
        key('ArrowDown');
        key('Enter');
        expect(items[2].getAttribute('aria-selected')).to.equal('true');
    }

    function expectMultiValue(expectValue, compareValue = node.value) {
        expect(expectValue.length).to.equal(compareValue.length);
        expectValue.forEach((v, i) => {
            expect(v).to.equal(compareValue[i]);
        })
    }

    suite('Single select', () => {
        test('should render a simple, selectable list', function (done) {
            setup({data: data, label: 'Simple List'});
            ready(function () {
                node.list.focus();
                key('ArrowDown');
                expect(items[0].getAttribute('aria-current')).to.equal('true');
                key('ArrowDown');
                key('Enter');
                expect(items[1].getAttribute('aria-selected')).to.equal('true');
                expect(value).to.equal('red');
                done();
            });
        });

        test('should sort by a property', function (done) {
            setup({data: data, label: 'Sort Default', sortdesc: 'label'});
            ready(function () {
                expect(JSON.stringify(values)).to.equal('["blue","green","orange","red"]')
                done();
            });
        });

        test('should sort asc by a property', function (done) {
            setup({data: data, label: 'Sort Ascending', sortasc: 'label'});
            ready(function () {
                expect(JSON.stringify(values)).to.equal('["red","orange","green","blue"]')
                done();
            });
        });

        test('should clear the selection', function (done) {
            setup({data: data, label: 'clear selection'});
            ready(function () {
                node.list.focus();
                key('ArrowDown');
                expect(items[0].getAttribute('aria-current')).to.equal('true');
                key('ArrowDown');
                key('Enter');
                expect(items[1].getAttribute('aria-selected')).to.equal('true');
                expect(value).to.equal('red');

                node.value = null;
                expect(node.value).to.equal(null);
                expect(items[1].getAttribute('aria-selected')).to.equal(null);
                done();
            });
        });

        test('should programmatically set a value', function (done) {
            setup({data: data, label: 'Programmatic Value'});
            node.value = 'blue';
            ready(function () {
                expect(items[2].getAttribute('aria-selected')).to.equal('true');
                node.value = 'red';
                expect(items[1].getAttribute('aria-selected')).to.equal('true');
                done();
            });
        });

        test('should render readonly and with a label', function (done) {
            setup({data: data, readonly: true, label: 'Read Only List'});
            ready(function () {

                node.list.focus();
                // expect(document.activeElement).to.equal(document.body);

                key('ArrowDown');
                expect(items[1].getAttribute('aria-current')).to.equal(null);
                key('ArrowDown');
                key('Enter');
                expect(items[2].getAttribute('aria-selected')).to.equal(null);
                expect(value).to.equal(false);
                destroy();
                done();
            });
        });

        test('should render disabled and with a label', function (done) {
            setup({data: data, disabled: true, label: 'Disabled List'});
            ready(function () {
                const items = dom.queryAll(node, 'li');
                node.list.focus();
                // expect(document.activeElement).to.equal(document.body);

                key('ArrowDown');
                expect(items[1].getAttribute('aria-current')).to.equal(null);
                key('ArrowDown');
                key('Enter');
                expect(items[2].getAttribute('aria-selected')).to.equal(null);
                expect(value).to.equal(false);
                destroy();
                done();
            });
        });

        test('should render simple custom items', function (done) {
            setup({data: data3, label: 'Simple Custom Items'});
            ready(function () {
                node.list.focus();
                key('ArrowDown');
                expect(items[0].getAttribute('aria-current')).to.equal('true');
                key('ArrowDown');
                key('Enter');
                expect(items[1].getAttribute('aria-selected')).to.equal('true');
                expect(value).to.equal('lance-cox');
                expect(items[1].innerHTML).to.equal('Lance Cox');
                // destroy();
                done();
            });
        });

        test('should render complex custom items', function (done) {
            setup({data: data4, label: 'Complex Custom Items'});
            ready(function () {
                node.list.focus();
                key('ArrowDown');
                expect(items[0].getAttribute('aria-current')).to.equal('true');
                key('ArrowDown');
                key('Enter');
                expect(items[1].getAttribute('aria-selected')).to.equal('true');
                expect(value).to.equal('detroit');
                expect(items[1].textContent).to.equal('DetroitMichigan');
                console.log('DONE');
                done();
            });
        });

        test('should handle a document fragment', function (done) {
            console.log('SETUP');
            setup({data: frag, label: 'Document Fragment'});
            // node = dom('ui-list', {data: frag, label: 'Document Fragment'}, body);

            ready(function () {
                expect(items[1].textContent).to.equal('DetroitMichigan');
                expect(items.length).to.equal(4);
                done();
            });
        });

        test('should use dom children declaratively', function (done) {
            const template = dom.byId('template-1');
            const clone = template.content.cloneNode(true);
            dom.byId('tests').appendChild(clone);
            node = dom.byId('declarative');
            ready(function () {
                expect(node.data.length).to.equal(3);
                items = dom.queryAll(node, 'li');
                node.list.focus();
                key('ArrowDown');
                expect(items[0].getAttribute('aria-current')).to.equal('true');
                key('ArrowDown');
                key('Enter');
                expect(items[1].getAttribute('aria-selected')).to.equal('true');
                expect(node.value).to.equal('2');
                done();
            });
        });

        test('should skip disabled items', function (done) {
            setup({data: dataD, label: 'Disabled Items'});
            done();
        });

        test('should add/remove rows', function (done) {
            const items = copy(data);
            setup({data: items, label: 'Add/Remove Rows', editable: true});
            ready(function () {
                node.on('remove', (e) => {
                    console.log('rem:', e.detail.value);
                    const index = items.findIndex(item => item.value === e.detail.value);
                    if (index > -1) {
                        items.splice(index, 1);
                        node.data = items;
                    }
                });
                node.on('add', (e) => {
                    console.log('add:', e.detail);
                    items.splice(e.detail.index, 0, e.detail.value);
                    node.data = items;
                });
                node.on('edit', (e) => {
                    const index = items.findIndex(item => item.value === e.detail.value.value);
                    if (index > -1) {
                        items[index] = e.detail.value;
                        node.data = [];
                        node.data = items;
                    }
                });
                // node.list.focus();
                // key('ArrowDown');
                // expect(items[0].getAttribute('aria-current')).to.equal('true');
                // key('ArrowDown');
                // key('Enter');
                // expect(items[1].getAttribute('aria-selected')).to.equal('true');
                // expect(value).to.equal('red');
                done();
            });
        });
    });

    suite('Lazy Data', function () {
        test('should render with lazy data', function (done) {
            setup({data: data5, label: 'Lazy data'});
            ready(function () {
                node.setLazyData();
                expect(items.length).to.equal(4);
                done();
            });
        });
    });

    suite('groups dividers labels', function () {
        test('should have dividers and labels', function (done) {
            setup({data: dataL, label: 'Dividers & Labels'});
            done();
        });
    });

    suite('Multi Select', function () {
        test('should select multiple items', function (done) {
            setup({data: data, label: 'select multiple items', multiple: true});
            key('ArrowDown');
            key('Enter');
            key('ArrowDown');
            key('Shift');
            key('Enter');
            expectMultiValue(['orange', 'red']);
            done();
        });
        test('should select one item with multiple option', function (done) {
            setup({data: data, label: 'select one item with multiple', multiple: true});
            key('ArrowDown');
            key('Enter');
            key('ArrowDown');
            key('Enter');
            expectMultiValue(['red']);
            done();
        });
        test('should have initial multiple values', function (done) {
            setup({data: data6, label: 'initial multiple values', multiple: true});
            ready(function () {
                expectMultiValue(['red', 'blue']);
                done();
            });
        });
        test('should programmatically set multiple values', function (done) {
            setup({data: data, label: 'select multiple items', multiple: true});
            ready(function () {
                node.value = ['red', 'blue'];
                expect(items[1].getAttribute('aria-selected')).to.equal('true');
                expect(items[2].getAttribute('aria-selected')).to.equal('true');
                done();
            });
        });
        test('should clear a multiple selection', function (done) {
            setup({data: data6, label: 'initial multiple values', multiple: true});
            ready(function () {
                expectMultiValue(['red', 'blue']);
                node.value = null;
                expectMultiValue([]);
                done();
            });
        });
    });

    suite('Modify List', function () {
        const getListValues = () => items.map(node => node.getAttribute('value'));

        test('should replace the data', function (done) {
            setup({data: data, label: 'replace data'});
            ready(function () {
                expectMultiValue(getListValues(), ["orange", "red", "blue", "green"]);
                node.data = data2;
                update();
                expectMultiValue(getListValues(), ["puppy", "birdy", "kitty", "snakey"]);
                done();
            });
        });
        test('should add an item', function (done) {
            setup({data: data, label: 'add an item'});
            ready(function () {
                expectMultiValue(getListValues(), ["orange", "red", "blue", "green"]);
                node.addData({
                    value: 'purple',
                    label: 'Purple'
                });
                update();
                expectMultiValue(getListValues(), ["orange", "red", "blue", "green", "purple"]);
                done();
            });
        });
        test('should add multiple items', function (done) {
            setup({data: data, label: 'add multiple items'});
            ready(function () {
                expectMultiValue(getListValues(), ["orange", "red", "blue", "green"]);
                node.addData([{
                    value: 'purple',
                    label: 'Purple'
                }, {
                    value: 'black',
                    label: 'Black'
                }]);
                update();
                expectMultiValue(getListValues(), ["orange", "red", "blue", "green", "purple", "black"]);
                done();
            });
        });
        test('should remove an item', function (done) {
            setup({data: data, label: 'remove an item'});
            ready(function () {
                expectMultiValue(getListValues(), ["orange", "red", "blue", "green"]);
                node.removeData('red');
                update();
                expectMultiValue(getListValues(), ["orange", "blue", "green"]);
                done();
            });
        });
        test('should remove items', function (done) {
            setup({data: data, label: 'remove items'});
            ready(function () {
                expectMultiValue(getListValues(), ["orange", "red", "blue", "green"]);
                node.removeData(['red', 'orange']);
                update();
                expectMultiValue(getListValues(), ["blue", "green"]);
                done();
            });
        });
    });
});

mocha.run();