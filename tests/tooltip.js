require('./common');

mocha.setup('tdd');

suite('UiTooltip', function () {
    this.timeout(3000);

    const suite = window.suite,
        test = window.test,
        dom = window.dom,
        on = window.on,
        nodash = window.nodash,
        expect = chai.expect,
        body = dom.byId('tests');

    suite('ui-tooltip', function () {
        let node, btn;

        function ready(cb) {
            onDomReady(node, cb);
        }

        test('should render a Tooltip', function (done) {
            const btn = dom('button', { class: 'ui-button', html: 'Ok' });
            on(btn, 'click', () => {
                tip.close();
            });
            const component = dom('div', {
                class: 'component',
                html: [
                    dom('ui-input', { label: 'Enter Code', value: '321' }),
                    dom('div', {
                        // class: 'ui-button-row',
                        html: btn,
                    }),
                ],
            });
            const tip = dom('ui-tooltip', {
                value: component,
                // align: 'T',
                class: 'large-tooltip',
                'use-click': true,
            });
            node = dom(
                'ui-icon',
                {
                    type: 'calPlus',
                    class: 'dyn-icon',
                    html: tip,
                },
                body
            );
            done();
        });
    });
});

mocha.run();
