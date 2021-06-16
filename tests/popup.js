require('./common');

mocha.setup('tdd');

suite('UiPopup', function () {
    this.timeout(3000);
    function getBigText() {
        return `Different scopes have different execution environments. This means that they have different built-ins (different global object, different constructors, etc.). This may result in unexpected results. For instance, [] instanceof window.frames[0].Array will return false, because Array.prototype !== window.frames[0].Array and arrays inherit from the former.

This may not make sense at first, but for scripts dealing with multiple frames or windows, and passing objects from one context to another via functions, this will be a valid and strong issue. For instance, you can securely check if a given object is, in fact, an Array using Array.isArray(myObj)

For example, checking if a Nodes is a SVGElement in a different context, you can use myNode instanceof myNode SVGElement.`;
    }
    const describe = window.describe,
        test = window.test,
        dom = window.dom,
        on = window.on,
        nodash = window.nodash,
        expect = chai.expect,
        body = dom.byId('tests');
    function getSizes(node) {
        const win = dom.box(window);
        const pop = dom.box(node);
        const btn = dom.box(node.button);
        const topSpace = btn.top;
        const botSpace = win.h - btn.top + btn.h;
        return {
            pop: pop,
            win: win,
            btn: btn,
            topSpace: topSpace,
            botSpace: botSpace,
        };
    }

    suite('ui-popup', function () {
        let node, btn;
        function popup() {
            node = dom(
                'ui-popup',
                {
                    buttonid: btn.id,
                    html: dom('div', {
                        class: 'popup-box',
                        html: [dom('h3', { html: 'My Popup' }), dom('button', { html: 'Close' })],
                    }),
                },
                body
            );
        }

        function bigPopup() {
            node = dom(
                'ui-popup',
                {
                    class: 'big-ui-popup',
                    buttonid: btn.id,
                    html: dom('div', {
                        class: 'bigtext-box',
                        html: getBigText(),
                    }),
                },
                body
            );
        }

        function ready(cb) {
            onDomReady(node, cb);
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

        // popup align
        function bottomSpace() {
            const box = getSizes(node);
            return box.pop.h < box.botSpace;
        }
        function topSpace() {
            const box = getSizes(node);
            return box.pop.h < box.topSpace;
        }
        function bottom() {
            const box = getSizes(node);
            return box.pop.y > box.btn.y + box.btn.h;
        }
        function top() {
            const box = getSizes(node);
            return box.pop.y + box.pop.h < box.btn.y;
        }
        function left() {
            const box = getSizes(node);
            return box.pop.x >= box.btn.x;
        }
        function right() {
            const box = getSizes(node);
            return box.pop.x < box.btn.x;
        }

        test('should render a popup left-aligned', function (done) {
            btn = dom('button', { id: 'b1', html: 'Left' }, body);
            popup(btn);
            ready(function () {
                click();
                expect(bottom()).to.equal(true);
                expect(left()).to.equal(true);
                clickoff(done);
            });
        });

        test('should render a popup right-aligned', function (done) {
            btn = dom('button', { id: 'b2', class: 'right', html: 'Right' }, body);
            popup(btn);
            ready(function () {
                click();
                expect(bottom()).to.equal(true);
                expect(right()).to.equal(true);
                clickoff(done);
            });
        });

        test('should render a popup bottom-aligned', function (done) {
            btn = dom('button', { id: 'b3', class: 'bottom', html: 'Bottom' }, body);
            popup(btn);
            ready(function () {
                click();
                expect(top()).to.equal(true);
                expect(left()).to.equal(true);
                clickoff(done);
            });
        });

        test('should render a popup bottom-right-aligned', function (done) {
            btn = dom('button', { id: 'b4', class: 'bottom-right', html: 'Bottom Right' }, body);
            popup(btn);
            ready(function () {
                click();
                expect(top()).to.equal(true);
                expect(right()).to.equal(true);
                clickoff(done);
            });
        });

        test('should render a big popup', function (done) {
            btn = dom('button', { id: 'b5', class: 'big-pop', html: 'Big Pop' }, body);
            bigPopup(btn);
            ready(function () {
                click();
                expect(bottom()).to.equal(true);
                expect(bottomSpace()).to.equal(true);
                expect(left()).to.equal(true);
                clickoff(done);
            });
        });

        test('should render a big popup bottom', function (done) {
            btn = dom('button', { id: 'b6', class: 'big-pop-bottom', html: 'Big Pop Bottom' }, body);
            bigPopup(btn);
            ready(function () {
                click();
                expect(top()).to.equal(true);
                expect(topSpace()).to.equal(true);
                expect(left()).to.equal(true);
                clickoff(done);
            });
        });
    });
});

mocha.run();
