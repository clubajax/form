require('./common');

mocha.setup('tdd');

suite('UiDropdown', function () {
    this.timeout(3000);

    const suite = window.suite,
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
        ],
        dataStrings = [
            { label: 'Orange', value: '1' },
            { label: 'Red', value: '2' },
            { label: 'Blue', value: '3' },
            { label: 'Green', value: '4' },
        ],
        dataNums = [
            { label: 'Uno', value: 1 },
            { label: 'Dos', value: 2 },
            { label: 'Tre', value: 3 },
            { label: 'Qua', value: 4 },
        ],
        dataS = [
            { label: 'Orange', value: 'orange' },
            { label: 'Red', value: 'red' },
            { label: 'Blue', value: 'blue', selected: true },
            { label: 'Green', value: 'green' },
        ],
        dataV = [
            { label: 'An extremely long label that affects the width', value: 'a' },
            { label: 'Red', value: 'b' },
            { label: 'A medium length label', value: 'c' },
            { label: "This one doesn't matter", value: 'd' },
        ],
        data4 = [
            { label: '<span>&spades;</span> Spades', value: 'spades', class: 'spades' },
            { label: '<span>&clubs;</span> Clubs', value: 'clubs', selected: true, class: 'clubs' },
            { label: '<span>&diams;</span> Diamonds', value: 'diamonds', class: 'diamonds' },
            { label: 'Joker', value: 'joker', class: 'joker' },
            { label: '<span>&hearts;</span> Hearts', value: 'hearts', class: 'hearts' },
        ],
        dataQnA = [
            {
                value: 1,
                label: 'What is a potential pitfall with using typeof bar === "object" to determine if bar is an object? How can this pitfall be avoided?',
            },
            {
                value: 2,
                label: 'What is the significance of, and reason for, wrapping the entire content of a JavaScript source file in a function block?',
            },
            {
                value: 3,
                label: "What is the significance, and what are the benefits, of including 'use strict' at the beginning of a JavaScript source file?",
            },
            {
                value: 4,
                label: 'Consider the two functions below. Will they both return the same thing? Why or why not?',
            },
            {
                value: 5,
                label: 'Write a simple function (less than 160 characters) that returns a boolean indicating whether or not a string is a palindrome.',
            },
        ],
        dataAlias = [
            {
                value: 1,
                alias: 'Q1',
                label: 'What is a potential pitfall with using typeof bar === "object" to determine if bar is an object? How can this pitfall be avoided?',
            },
            {
                value: 2,
                alias: 'Q2',
                label: 'What is the significance of, and reason for, wrapping the entire content of a JavaScript source file in a function block?',
            },
            {
                value: 3,
                alias: 'Q3',
                label: "What is the significance, and what are the benefits, of including 'use strict' at the beginning of a JavaScript source file?",
            },
            {
                value: 4,
                alias: 'Q4',
                label: 'Consider the two functions below. Will they both return the same thing? Why or why not?',
            },
            {
                value: 5,
                alias: 'Q5',
                label: 'Write a simple function (less than 160 characters) that returns a boolean indicating whether or not a string is a palindrome.',
            },
        ];

    const alpha = 'abcdefgh'.toUpperCase().split('');

    function makeLongList() {
        const list = [];
        alpha.forEach(function (a) {
            alpha.forEach(function (b) {
                list.push({
                    label: a + b,
                    value: (a + b).toLowerCase(),
                });
            });
        });
        return list.splice(0, 100);
    }

    const dataLongList = makeLongList();

    suite('ui-dropdown', function () {
        let node, btn, items, lis, events;

        function ready(cb) {
            events = [];
            onDomReady(node, function () {
                btn = dom.query(node, 'button');
                if (node.popup) {
                    lis = dom.queryAll(node.popup, 'li');
                    items = lis.map(function (n) {
                        return {
                            value: n.getAttribute('value'),
                            label: n.textContent,
                        };
                    });
                }
                node.on('change', (e) => {
                    console.log('test.change', e.value, typeof e.value);
                    events.push(e.value);
                });
                setTimeout(cb, 1);
            });
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

        function select(index) {
            return new Promise(function (resolve) {
                node.once('open', function () {
                    on.emit(node.list.list.children[index], 'mousedown');
                });
                node.once('close', function () {
                    setTimeout(function () {
                        resolve(node.value);
                    }, 30);
                });
                on.emit(node.button, 'click');
            });
        }

        suite('render', function () {
            test('should render a dropdown', function (done) {
                node = dom(
                    'ui-dropdown',
                    { data: data, label: 'Simple drop', placeholder: 'Select', class: 'xmax-test' },
                    body,
                );
                ready(function () {
                    expect(lis.length).to.equal(4);
                    done();
                });
            });
            test.only('should handle an "all" option', function (done) {
                data.unshift({
                    label: 'All',
                    value: -1,
                });
                node = dom(
                    'ui-dropdown',
                    { data: data, label: 'Simple drop', placeholder: 'Select', class: 'xmax-test' },
                    body,
                );
                ready(function () {
                    expect(lis.length).to.equal(5);
                    done();
                });
            });
            test('should should handle integer values', function (done) {
                node = dom('ui-dropdown', { data: dataNums, label: 'Simple drop', placeholder: 'Select' }, body);
                ready(function () {
                    expect(lis.length).to.equal(4);
                    done();
                });
            });
            test('should should minimal items', function (done) {
                const data = dataNums.splice(0, 2);
                node = dom('ui-dropdown', { data: data, label: 'Minimal Items', placeholder: 'Select' }, body);
                ready(function () {
                    expect(lis.length).to.equal(2);
                    done();
                });
            });
            test('should render a disabled dropdown', function (done) {
                node = dom(
                    'ui-dropdown',
                    { data: data, label: 'Disabled drop', disabled: true, value: 'red', placeholder: 'Select' },
                    body,
                );
                ready(function () {
                    expect(lis.length).to.equal(4);
                    done();
                });
            });
            test('should handle no data', function (done) {
                node = dom('ui-dropdown', { data: [], label: 'No Data' }, body);
                ready(function () {
                    expect(lis.length).to.equal(0);
                    done();
                });
            });
            test('should sort items', function (done) {
                node = dom('ui-dropdown', { data: data, label: 'Sorted', sortdesc: 'value' }, body);
                ready(function () {
                    expect(items[0].value).to.equal('blue');
                    expect(items[1].value).to.equal('green');
                    expect(items[2].value).to.equal('orange');
                    expect(items[3].value).to.equal('red');
                    done();
                });
            });
            test('should sort items asc', function (done) {
                node = dom('ui-dropdown', { data: data, label: 'Sorted Ascending', sortasc: 'value' }, body);
                ready(function () {
                    expect(items[0].value).to.equal('red');
                    expect(items[1].value).to.equal('orange');
                    expect(items[2].value).to.equal('green');
                    expect(items[3].value).to.equal('blue');
                    done();
                });
            });
            test('should render emojis', function (done) {
                node = dom('ui-dropdown', { data: data4, label: 'Emojis', placeholder: 'Select an option' }, body);
                ready(function () {
                    expect(lis.length).to.equal(5);
                    done();
                });
            });
            test('should handle very long options', function (done) {
                node = dom(
                    'ui-dropdown',
                    { data: dataQnA, label: 'Long Options', placeholder: 'Select a long option..' },
                    body,
                );
                ready(function () {
                    expect(lis.length).to.equal(5);
                    done();
                });
            });
            test('should use an alias', function (done) {
                node = dom('ui-dropdown', { data: dataAlias, label: 'Alias', placeholder: 'Doit' }, body);
                ready(function () {
                    expect(lis.length).to.equal(5);
                    done();
                });
            });
            test('should handle long lists', function (done) {
                node = dom(
                    'ui-dropdown',
                    { data: dataLongList, label: 'Long List', placeholder: 'Pick...', class: 'top-right' },
                    body,
                );
                ready(function () {
                    expect(lis.length).to.equal(64);
                    done();
                });
            });
            test('should restrict the height of long lists', function (done) {
                node = dom(
                    'ui-dropdown',
                    {
                        data: dataLongList,
                        label: 'Long List',
                        placeholder: 'Pick...',
                        class: 'top-middle',
                        xmaxheight: 200,
                    },
                    body,
                );
                ready(function () {
                    console.log('node', node);
                    expect(lis.length).to.equal(64);
                    done();
                });
            });
            test('should initialize selection from data', function (done) {
                node = dom(
                    'ui-dropdown',
                    { data: dataS, label: 'Initial Data Selection', placeholder: 'Select' },
                    body,
                );
                ready(function () {
                    expect(lis.length).to.equal(4);
                    done();
                });
            });
            test('should initialize selection from parent value', function (done) {
                node = dom(
                    'ui-dropdown',
                    { data: data, value: 'blue', label: 'Initial Parent Value', placeholder: 'Select' },
                    body,
                );
                done();
            });
            test('should size the input to the popup', function (done) {
                // open first
                node = dom('ui-dropdown', { data: [], label: 'Sized to Popup', 'size-to-popup': true }, body);
                done();
                // setTimeout(async () => {
                //     node.data = dataV;
                //     const w = () => {
                //         return Math.ceil(dom.box(node.popup).w);
                //     }
                //     expect(w()).to.equal(300);
                //     await select(1)
                //     expect(w()).to.equal(300);
                //     await select(0)
                //     expect(w()).to.equal(300);
                //     done();
                // }, 100)
            });
        });

        suite('events', function () {
            test('should emit one event when selecting', (done) => {
                node = dom('ui-dropdown', { data: data, label: 'Events', placeholder: 'Select' }, body);
                ready(async function () {
                    await select(1);
                    expect(events.length).to.equal(1);
                    expect(events[0]).to.equal('red');
                    done();
                });
            });

            test('should emit one event even when starting with a selection', (done) => {
                node = dom('ui-dropdown', { data: dataS, label: 'Event - Selected', placeholder: 'Select' }, body);
                ready(async function () {
                    await select(1);
                    expect(events.length).to.equal(1);
                    expect(events[0]).to.equal('red');
                    done();
                });
            });

            test('should not emit events without setting a value', (done) => {
                node = dom('ui-dropdown', { data: data, label: 'Event - Value', value: 'orange' }, body);
                const events = [];
                node.on('change', function (e) {
                    console.log('CHANGE', e.value);
                    events.push(e.value);
                });
                ready(async function () {
                    expect(events.length).to.equal(0);
                    done();
                });
            });

            test('should not emit events when not setting data', (done) => {
                node = dom('ui-dropdown', { data: [], label: 'No Data No Event' }, body);
                ready(async function () {
                    expect(events.length).to.equal(0);
                    done();
                });
            });

            test('should not emit events when loading data later', (done) => {
                node = dom('ui-dropdown', { data: [], label: 'Late Events' }, body);
                ready(async function () {
                    const time = 30;
                    expect(events.length).to.equal(0);
                    setTimeout(() => {
                        node.data = data;
                        expect(events.length).to.equal(0);
                        done();
                    }, time);
                });
            });

            test('should not emit events when loading data and value later', (done) => {
                node = dom('ui-dropdown', { data: [], label: 'Late Events' }, body);
                ready(async function () {
                    const time = 30;
                    expect(events.length).to.equal(0);
                    setTimeout(() => {
                        node.data = data;
                        expect(events.length).to.equal(0);
                        setTimeout(() => {
                            node.value = 'blue';
                            expect(events.length).to.equal(0);
                            done();
                        }, time);
                    }, time);
                });
            });

            test('should emit one event even when starting with a value', (done) => {
                node = dom('ui-dropdown', { data: data, label: 'Event - Value', value: 'orange' }, body);
                ready(async function () {
                    await select(2);
                    expect(events.length).to.equal(1);
                    expect(events[0]).to.equal('blue');
                    done();
                });
            });

            test('should emit one event even when re-setting data', (done) => {
                node = dom('ui-dropdown', { data: data, label: 'Event - Value Reset', value: 'orange' }, body);
                ready(function () {
                    const TIME = 1;
                    setTimeout(() => {
                        node.data = data;
                        setTimeout(() => {
                            node.data = data;
                            setTimeout(() => {
                                node.data = data;
                                expect(events.length).to.equal(0);
                                done();
                            }, TIME);
                        }, TIME);
                    }, TIME);
                });
            });

            test('should emit numbers', (done) => {
                node = dom('ui-dropdown', { data: [], label: 'Numeric Values' }, body);
                ready(async function () {
                    node.data = dataNums;
                    const time = 10;
                    setTimeout(() => {
                        expect(events.length).to.equal(0);
                        node.value = 3;
                        setTimeout(() => {
                            expect(events.length).to.equal(0);
                            done();
                            // setTimeout(() => {
                            //     select(1).then(() => {
                            //         expect(events.length).to.equal(1);
                            //         expect(events[0]).to.equal(2);
                            //         done();
                            //     });
                            // }, time);
                        }, time);
                    }, time);
                });
            });
        });

        suite('positioning', function () {
            test('should handle very long options, middle button', function (done) {
                node = dom('ui-dropdown', { data: dataQnA, label: 'Long Options Middle', class: 'abs-mid' }, body);
                done();
            });
            test('should truncate display, right-bottom button', function (done) {
                const container = dom('section', { class: 'abs-bot' }, body);
                node = dom('ui-dropdown', { data: dataQnA, label: 'Long Options Bottom Right' }, container);
                done();
            });
        });

        suite('lazy loading', function () {
            test('should lazy load options', function (done) {
                node = dom(
                    'ui-dropdown',
                    { data: () => dataQnA, label: 'Lazy Long Options Middle', class: 'abs-mid' },
                    body,
                );
                done();
            });

            test('should set a value with lazy loaded options', function (done) {
                const data = copy(data4);
                data[1].selected = false;
                node = dom(
                    'ui-dropdown',
                    { data: () => data, value: 'spades', label: 'Lazy Options With Value', class: '' },
                    body,
                );
                ready(() => {
                    expect(node.popup).to.equal(undefined);
                    click();
                    expect(!!node.popup).to.equal(true);
                });
                done();
            });
        });

        suite('destroying', function () {
            test('should should destroy ropdowns without errors', function (done) {
                [
                    dom('ui-dropdown', { data: data, label: 'Destroy' }, body),
                    dom('ui-dropdown', { data: data, label: 'Destroy' }, body),
                    dom('ui-dropdown', { data: data, label: 'Destroy' }, body),
                    dom('ui-dropdown', { data: data, label: 'Destroy' }, body),
                    dom('ui-dropdown', { data: data, label: 'Destroy' }, body),
                ].forEach((node) => {
                    dom.destroy(node);
                });

                done();
            });
        });
    });
});

function copy(o) {
    return JSON.parse(JSON.stringify(o));
}

mocha.run();
