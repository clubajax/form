require('./common');

mocha.setup('tdd');
mocha.allowUncaught();

suite('CheckBox', function () {
    this.timeout(3000);
    const
        suite = window.suite,
        test = window.test,
        dom = window.dom,
        on = window.on,
        expect = chai.expect,
        body = dom.byId('tests'),
        UNCHK_CLR = '#000000',
        INT_CLR = '#ffffff',
        CHK_CLR = '#ffffff';

    function copy(item) {
        return JSON.parse(JSON.stringify(item));
    }

    function rgbToHex(color) {
        if (/#/.test(color)) {
            return color;
        }
        function componentToHex(c) {
            var hex = c.toString(16);
            return hex.length == 1 ? "0" + hex : hex;
        }
        color = color.replace(/rgba?\(/, '').replace(/\)/, '').split(/,\s*/);
        return "#" + componentToHex(parseInt(color[0])) + componentToHex(parseInt(color[1])) + componentToHex(parseInt(color[2]));
    }

    function getColor(node) {
        return rgbToHex(dom.style(dom.query(node, 'ui-icon'), 'color'));
    }

    function testOff(node) {
        const color = getColor(node);
        if (color === 'transparent') {
            // IE
            expect(color).to.equal('transparent');
            return;
        }
        expect(color).to.equal(UNCHK_CLR);
    }

    function testOn(node) {
        const color = getColor(node);
        expect(color).to.equal(CHK_CLR);
    }

    function testInt(node) {
        const color = getColor(node);
        expect(color).to.equal(INT_CLR);
    }

    function iconIs(node) {
        console.log('IS:', node.input.className.split('-')[1]);
        return node.input.className.split('-')[1];
    }

    function click(node) {
        node.focus();
        on.emit(node, 'click');
    }

    suite('ui-checkbox', function () {

        test('it should have an indeterminate setting', function (done) {
            const node = dom('ui-checkbox', {label: 'Set Intermediate Check', name: 'check-1', intermediate: true}, body);
            onDomReady(node, function () {
                expect(iconIs(node)).to.equal('minus');
                testInt(node);
                expect(node.value).to.equal(null);
                node.checked = false;
                expect(node.value).to.equal(false);
                expect(iconIs(node)).to.equal('check');
                testOff(node);
                // expect(iconIs(node)).to.equal('minus');
                done();
            });
        });

        test('it should display long labels correctly [VISUAL]', function () {
            const node = dom('ui-checkbox', {label: 'elements of type checkbox are rendered by default as square boxes that are checked (ticked) when activated, like you might see in an official government paper form', checked: true}, dom('section', {}, body));
        });

        test('it should get and set via `checked`', function (done) {
            const node = dom('ui-checkbox', {label: 'Set Check', name: 'check-1', checked: true}, body);
            onDomReady(node, function () {
                expect(node.value).to.equal(true);
                node.checked = false;
                expect(node.value).to.equal(false);
                testOff(node);
                node.checked = true;
                expect(node.checked).to.equal(true);
                expect(node.value).to.equal(true);
                done();
            });
        });

        test('it should get and set via `value`', function (done) {
            const node = dom('ui-checkbox', {label: 'Set by value', value: true}, body);
            onDomReady(node, function () {
                expect(node.value).to.equal(true);
                testOn(node);
                node.value = false;
                expect(node.value).to.equal(false);
                testOff(node);
                done();
            });
        });

        test('it should get and set via `click`', function (done) {
            const node = dom('ui-checkbox', {label: 'Set by click'}, body);
            onDomReady(node, function () {
                setTimeout(() => {
                    
                    console.log('node.value', node.value);
                    expect(node.value).to.equal(false);
                    testOff(node);
                    click(node);
                    expect(node.value).to.equal(true);
                    expect(getColor(node)).to.equal(CHK_CLR);
                    click(node);
                    expect(node.value).to.equal(false);
                    testOff(node);
                    done();
                }, 100)
            });
        });

        test('it should emit events', function (done) {
            const node = dom('ui-checkbox', {label: 'Emit events'}, body);
            onDomReady(node, function () {
                const events = [];
                node.on('change', function (e) {
                    events.push(e.value ? 1 : 0);
                });
                click(node);
                click(node);
                click(node);
                click(node);
                expect(events.join(',')).to.equal('1,0,1,0');
                done();
            });
        });

        test('it should emit custom events', function (done) {
            const node = dom('ui-checkbox', {label: 'Emit custom events', 'event-name': 'boffo'}, body);
            onDomReady(node, function () {
                const events = [];
                node.on('boffo', function (e) {
                    events.push(e.detail.value ? 1 : 0);
                });
                click(node);
                click(node);
                click(node);
                click(node);
                click(node);
                expect(events.join(',')).to.equal('1,0,1,0,1');
                done();
            });
        });

        test('it should render with no label', function () {
            const node = dom('ui-checkbox', {value: true}, body);
        });

        test('it should disable', function (done) {
            const node = dom('ui-checkbox', {label: 'Disable'}, body);
            onDomReady(node, function () {
                const events = [];
                node.on('change', function (e) {
                    events.push(e.value ? 1 : 0);
                });
                node.disabled = true;
                click(node);
                click(node);
                expect(events.join(',')).to.equal('');
                node.disabled = false;
                click(node);
                click(node);
                expect(events.join(',')).to.equal('1,0');
                node.disabled = true;
                done();
            });
        });

        test('it should be readonly', function (done) {
            const node = dom('ui-checkbox', {label: 'Readonly'}, body);
            onDomReady(node, function () {
                const events = [];
                node.on('change', function (e) {
                    events.push(e.value ? 1 : 0);
                });
                node.readonly = true;
                click(node);
                click(node);
                expect(node.getAttribute('checked')).to.equal(null);
                expect(events.join(',')).to.equal('');
                node.value = true;
                expect(node.getAttribute('checked')).to.equal('');
                node.readonly = false;
                click(node);
                click(node);
                expect(events.join(',')).to.equal('0,1');
                node.readonly = true;
                done();
            });
        });

        test('it should appear as a radio button', function (done) {
            const node = dom('ui-checkbox', {label: 'Radio Button', 'is-radio': true}, body);
            onDomReady(node, function () {
                const events = [];
                node.on('change', function (e) {
                    events.push(e.target.checked ? 1 : 0);
                });
                click(node);
                click(node);
                click(node);
                click(node);
                expect(events.join(',')).to.equal('1,0,1,0');
                done();
            });
        });

        test.only('it should appear as a smaller radio button (VISUAL)', function () {
            const node = dom('ui-checkbox', {label: 'Radio Button', 'is-radio': true, class: 'small'}, body);
        }); 
    });
});

mocha.run();