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

        test('should render a Tooltip component', function (done) {
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
                align: 'B',
                class: 'large-tooltip',
                'use-click': true,
                'y-pos': -10
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

            setTimeout(() => { 
                on.emit(node, 'click')
            }, 300)
            done();
        });

        test.only('should render a Tooltip top aligned', () => { 
            const btn = dom(
                'button',
                {
                    id: 'tip-top',
                    class: 'ui-button btn-top',
                    html: 'Tip Top',
                },
                body
            );
            const tip = dom('ui-tooltip', {
                value: 'This is top aligned',
                align: 'T',
                class: 'large-tooltip',
                'use-click': true,
                buttonid: 'tip-top'
                // 'y-pos': -10
            }, document.body);
            

            setTimeout(() => { 
                on.emit(btn, 'click')
            }, 300)
        })

        test.only('should render a Tooltip right aligned', () => { 
            const btn = dom(
                'button',
                {
                    id: 'right',
                    class: 'ui-button btn-right',
                    html: 'Right',
                },
                body
            );
            const tip = dom('ui-tooltip', {
                value: 'This is right aligned',
                align: 'R',
                class: 'large-tooltip',
                'use-click': true,
                buttonid: 'right'
                // 'y-pos': -10
            }, document.body);
            

            setTimeout(() => { 
                on.emit(btn, 'click')
            }, 300)
        })
    });
});

mocha.run();
