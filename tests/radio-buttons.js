require('./common');

mocha.setup('tdd');

suite('Radios', function () {
    this.timeout(3000);
    const suite = window.suite,
        test = window.test,
        dom = window.dom,
        on = window.on,
        expect = chai.expect,
        body = dom.byId('tests'),
        UNCHK_CLR = 'rgba(0, 0, 0, 0)',
        CHK_CLR = 'rgb(0, 0, 0)';

    function copy(item) {
        return JSON.parse(JSON.stringify(item));
    }

    function getColor(node) {
        return dom.style(dom.query(node, 'ui-icon'), 'color');
    }

    function testTransparent(node) {
        const color = getColor(node);
        if (color === 'transparent') {
            // IE
            expect(color).to.equal('transparent');
            return;
        }
        expect(color).to.equal(UNCHK_CLR);
    }
    function click(node) {
        on.emit(node, 'click');
    }

    suite('ui-radio', function () {
        test('it should get and set values of a radio button', function (done) {
            const node = dom('ui-radio', { value: 'aaa', name: 'AAA', label: 'AAA', checked: true }, body);
            onDomReady(node, function () {
                console.log('node', node.value, node.name, node.checked);
                expect(node.value).to.equal('aaa');
                expect(node.name).to.equal('AAA');
                expect(node.checked).to.equal(true);
                node.checked = false;
                expect(node.checked).to.equal(false);
                done();
            });
        });

        test('it should appear as a radio group', function (done) {
            const data = [
                {
                    value: 'a',
                    label: 'Mother Russia',
                },
                {
                    value: 'b',
                    label: 'Ancient Greece',
                },
                {
                    value: 'c',
                    label: 'Modern Persia',
                },
            ];
            const node = dom(
                'ui-radio-buttons',
                { label: 'Radio Buttons', name: 'my-butts', data: data, value: 'c' },
                body
            );
            onDomReady(node, function () {
                const events = [];
                node.on('change', function (e) {
                    events.push(e.value);
                });
                const radios = dom.queryAll(node, 'ui-radio');
                function selected() {
                    return radios.map((rad) => (rad.checked ? 1 : 0)).join(',');
                }

                expect(selected()).to.equal('0,0,1');
                expect(node.value).to.equal('c');

                click(radios[0]);
                expect(selected()).to.equal('1,0,0');
                expect(node.value).to.equal('a');

                click(radios[0]);

                expect(selected()).to.equal('1,0,0');
                expect(node.value).to.equal('a');

                node['allow-unchecked'] = true;
                click(radios[0]);
                expect(selected()).to.equal('0,0,0');
                expect(node.value).to.equal(null);

                click(radios[1]);
                click(radios[2]);
                expect(events.join(',')).to.equal('a,,b,c');

                done();
            });
        });

        test('it should appear as a check group', function (done) {
            const data = [
                {
                    value: 'a',
                    label: 'Mother Russia',
                },
                {
                    value: 'b',
                    label: 'Ancient Greece',
                },
                {
                    value: 'c',
                    label: 'Modern Persia',
                },
            ];
            const node = dom(
                'ui-radio-buttons',
                { label: 'Check Buttons', name: 'my-butts', data: data, type: 'checks', value: 'a,c' },
                body
            );
            onDomReady(node, function () {
                const events = [];
                node.on('change', function (e) {
                    events.push(e.value.join(','));
                });

                const radios = dom.queryAll(node, 'ui-radio,ui-checkbox');
                function selected() {
                    return radios.map((rad) => (rad.checked ? 1 : 0)).join(',');
                }
                expect(selected()).to.equal('1,0,1');
                expect(node.value.join(',')).to.equal('a,c');

                click(radios[0]);
                expect(selected()).to.equal('0,0,1');
                expect(node.value.join(',')).to.equal('c');

                click(radios[0]);
                expect(selected()).to.equal('1,0,1');
                expect(node.value.join(',')).to.equal('a,c');

                click(radios[0]);
                click(radios[2]);
                expect(selected()).to.equal('0,0,0');
                expect(node.value.join(',')).to.equal('');
                //
                click(radios[1]);
                click(radios[2]);
                expect(events.join(' ')).to.equal('c a,c c  b b,c');

                done();
            });
        });

        test('it should appear as a buttons group; and set by index', function (done) {
            const data = [
                {
                    value: 'a',
                    label: 'Mother Russia',
                },
                {
                    value: 'b',
                    label: 'Ancient Greece',
                },
                {
                    value: 'c',
                    label: 'Modern Persia',
                },
            ];
            const node = dom(
                'ui-radio-buttons',
                {
                    label: 'Button Radios',
                    name: 'my-butts',
                    data: data,
                    index: 2,
                    type: 'buttons',
                },
                body
            );
            onDomReady(node, function () {
                const events = [];
                node.on('change', function (e) {
                    events.push(e.value);
                });

                const radios = dom.queryAll(node, 'button');
                function selected() {
                    return radios.map((rad) => (dom.attr(rad, 'checked') ? 1 : 0)).join(',');
                }
                expect(selected()).to.equal('0,0,1');
                expect(node.value).to.equal('c');

                node.index = 0;
                expect(selected()).to.equal('1,0,0');
                expect(node.value).to.equal('a');

                // should not duplicate events
                node.value = 'c';
                expect(events.join(',')).to.equal('a,c');
                node.value = 'c';
                expect(events.join(',')).to.equal('a,c');

                done();
            });
        });

        test('it should add and remove buttons', function (done) {
            const data = [
                {
                    value: 'a',
                    label: 'Mother Russia',
                },
                {
                    value: 'b',
                    label: 'Ancient Greece',
                },
            ];
            const item = {
                selected: true,
                value: 'c',
                label: 'Modern Persia',
            };

            const node = dom(
                'ui-radio-buttons',
                {
                    label: 'Button Radios',
                    name: 'my-butts',
                    data: data,
                    value: 'a',
                    type: 'buttons',
                },
                body
            );
            onDomReady(node, function () {
                function selected() {
                    const radios = dom.queryAll(node, 'button');
                    return radios.map((rad) => (rad.hasAttribute('checked') ? 1 : 0)).join(',');
                }
                expect(selected()).to.equal('1,0');
                expect(node.value).to.equal('a');

                node.add(item);
                expect(selected()).to.equal('0,0,1');
                expect(node.value).to.equal('c');

                done();
            });
        });
    });
});

mocha.run();
