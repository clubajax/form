window.dom = require('@clubajax/dom');
window.on = require('@clubajax/on');
require('@clubajax/base-component');

mocha.setup('tdd');

suite('ActionButton', function () {
    this.timeout(3000);
    var
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

    suite('ui-actionbutton', function () {

        test('it should use custom events', function (done) {
            const node = dom('ui-actionbutton', {
                // label: 'Test Custom Events',
                icon: 'gear',
                'event-name': 'test-action',
                data: data,
                class: 'icon-only small-test'
            }, body);
            onDomReady(node, function () {
                select(node, 0, 'test-action').then(function (e) {
                    console.log('e', e);
                    // expect(e.detail.value).to.equal('orange');
                });
                done();
            });
        });

        test('it should fire events on click', function (done) {
            const node = dom.byId('act1');
            onDomReady(node, function () {
                const lis = dom.queryAll(node.popup, 'li');
                const h = on(node, 'change', function (e) {
                    expect(e.value).to.equal('two');
                    setTimeout(function () {
                        expect(node.classList.contains('show')).to.equal(false);
                        h.remove();
                        h2.remove();
                        done();
                    }, 500);
                });
                on.emit(node.button, 'click');
                const h2 = node.on('open', function () {
                    on.emit(lis[1], 'click');
                });
            });
        });

        test('it should align right', function (done) {
            const data = [
                {
                    label: 'Long label name',
                    value: 'aaa'
                }, {
                    label: 'Should align right',
                    value: 'bbb'
                }
            ];
            const node = dom('ui-actionbutton', {data: data, align: 'right'}, body);
            onDomReady(node, function () {
                done();
            });
        });

        test.only('it should indicate when busy', function (done) {

            let aaa_called = false;
            let bbb_called = false;
            function call_aaa() {
                console.log('call a');
                aaa_called = true;
            }
            function call_bbb() {
                console.log('call b');
                bbb_called = true;
            }

            const data = [
                {
                    label: 'Download Thing One',
                    value: 'aaa',
                    callback: call_aaa
                }, {
                    label: 'Download Thing Two',
                    value: 'bbb',
                    callback: call_bbb
                }
            ];
            const node = dom('ui-actionbutton', {data: data, label: 'Download Options', icon:"gear", 'btn-class': 'btn blue drop'}, body);
            onDomReady(node, function () {
                expect(dom.style(node.button, 'padding-left')).to.equal(10);
                expect(node.button.getAttribute('disabled')).to.equal(null);
                setTimeout(() => {
                    console.log('SET');
                    data[0].disabled = true;
                    node.data = [...data];
                    done();
                }, 1000)
                // select(node, 0).then(function (e) {
                //     console.log('s1');
                // 	expect(e.value).to.equal('aaa');
                // 	node.busy = true;
                // 	expect(dom.style(node.button, 'padding-left')).to.equal(25);
                // 	expect(node.button.getAttribute('disabled')).to.equal('true');
                // 	expect(aaa_called).to.equal(true);
                // 	setTimeout(function () {
                // 		node.busy = false;
                // 		expect(node.button.getAttribute('disabled')).to.equal(null);

                // 		select(node, 1).then(function (e) {
                // 			console.log('s2');
                //             expect(e.value).to.equal('bbb');
                // 			expect(bbb_called).to.equal(true);
                // 			done();
                // 		});

                // 	}, 100);
                // });

            });
        });
    });
});


if (!/puppeteer/.test(location.hash)) {
    mocha.run();
}