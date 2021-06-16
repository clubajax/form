require('./common');

mocha.setup('bdd');

describe('UiInput', function () {
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

    describe('ui-input', function () {
        let node, btn;

        function ready(cb) {
            onDomReady(node, cb);
        }

        function click() {
            on.emit(btn, 'click');
        }

        it('should render an input with an icon', function (done) {
            node = dom('ui-input', { label: 'Books label', value: 'I read books!', icon: 'books' }, body);
            done();
        });

        it('should select-all on focus', function (done) {
            node = dom('ui-input', { label: 'Autoselect', value: 'I auto select', autoselect: true }, body);
            done();
        });

        it('should render readonly', function (done) {
            node = dom('ui-input', { value: 'I read books!', readonly: true }, body);
            done();
        });
    });
});

mocha.run();
