require('./common');
const paginate = require('../src/lib/paginate');

mocha.setup('tdd');

suite('UiPaginator', function () {
    this.timeout(3000);

    const suite = window.suite,
        test = window.test,
        dom = window.dom,
        expect = chai.expect,
        body = dom.byId('tests');

    suite('ui-paginator', function () {
        suite('util', function () {
            function check(p, desc, btns) {
                console.log(p.status, p.buttons.join(','));
                expect(p.status).to.equal(desc);
                expect(p.buttons.join(',')).to.equal(btns);
            }
            test('should calculate small totals', function () {
                check(paginate(0, 10, 21), '1-10 of 21', '1,2,3');
                check(paginate(0, 10, 17), '1-10 of 17', '1,2');
            });

            test('should calculate 10/100 based', function () {
                check(paginate(0, 10, 100), '1-10 of 100', '1,2,3,0,10');
                check(paginate(10, 10, 100), '11-20 of 100', '1,2,3,4,0,10');
                check(paginate(20, 10, 100), '21-30 of 100', '1,2,3,4,5,0,10');
                check(paginate(30, 10, 100), '31-40 of 100', '1,2,3,4,5,6,0,10');
                check(paginate(40, 10, 100), '41-50 of 100', '1,0,3,4,5,6,7,0,10');
                check(paginate(50, 10, 100), '51-60 of 100', '1,0,4,5,6,7,8,0,10');
                check(paginate(60, 10, 100), '61-70 of 100', '1,0,5,6,7,8,9,10');
                check(paginate(70, 10, 100), '71-80 of 100', '1,0,6,7,8,9,10');
                check(paginate(80, 10, 100), '81-90 of 100', '1,0,7,8,9,10');
                check(paginate(90, 10, 100), '91-100 of 100', '1,0,8,9,10');
            });
            test('should calculate 10/1000 based', function () {
                check(paginate(0, 10, 1000), '1-10 of 1000', '1,2,3,0,100');
                check(paginate(10, 10, 1000), '11-20 of 1000', '1,2,3,4,0,100');
                check(paginate(20, 10, 1000), '21-30 of 1000', '1,2,3,4,5,0,100');
                //
                check(paginate(300, 10, 1000), '301-310 of 1000', '1,0,29,30,31,32,33,0,100');
                check(paginate(400, 10, 1000), '401-410 of 1000', '1,0,39,40,41,42,43,0,100');
                check(paginate(500, 10, 1000), '501-510 of 1000', '1,0,49,50,51,52,53,0,100');
                check(paginate(600, 10, 1000), '601-610 of 1000', '1,0,59,60,61,62,63,0,100');
                check(paginate(700, 10, 1000), '701-710 of 1000', '1,0,69,70,71,72,73,0,100');
                //
                check(paginate(970, 10, 1000), '971-980 of 1000', '1,0,96,97,98,99,100');
                check(paginate(980, 10, 1000), '981-990 of 1000', '1,0,97,98,99,100');
                check(paginate(990, 10, 1000), '991-1000 of 1000', '1,0,98,99,100');
            });

            test('should calculate odd totals', function () {
                check(paginate(80, 10, 91), '81-90 of 91', '1,0,7,8,9,10');
                check(paginate(90, 10, 91), '91-91 of 91', '1,0,8,9,10');
                check(paginate(100, 10, 101), '101-101 of 101', '1,0,9,10,11');
            });

            test('should not allow an odd start', function () {
                let error;
                try {
                    paginate(20, 15, 90);
                } catch (e) {
                    error = e;
                }
                expect(error).to.be.ok;
            });

            test('should calculate odd limits', function () {
                check(paginate(30, 15, 90), '31-45 of 90', '1,2,3,4,5,6');
            });

            test('should navigate', function () {
                let p;

                p = paginate(0, 10, 100);
                expect(p.prev()).to.equal(0);
                expect(p.next()).to.equal(10);
                expect(p.goto(4)).to.equal(40);

                p = paginate(80, 10, 100);
                expect(p.next()).to.equal(90);
                expect(p.prev()).to.equal(70);
                expect(p.goto(4)).to.equal(40);
                expect(p.goto(9)).to.equal(90);

                p = paginate(90, 10, 100);
                expect(p.next()).to.equal(90);
                expect(p.prev()).to.equal(80);

                p = paginate(0, 5, 100);
                expect(p.prev()).to.equal(0);
                expect(p.next()).to.equal(5);
                expect(p.goto(4)).to.equal(20);

                p = paginate(0, 20, 100);
                expect(p.prev()).to.equal(0);
                expect(p.next()).to.equal(20);
                expect(p.goto(4)).to.equal(80);

                p = paginate(0, 25, 200);
                expect(p.prev()).to.equal(0);
                expect(p.next()).to.equal(25);
                expect(p.goto(4)).to.equal(100);
                expect(p.goto(7)).to.equal(175);
                expect(p.goto(8)).to.equal(0);
            });
        });

        let node, events;

        function ready(cb) {
            events = [];
            onDomReady(node, function () {
                node.on('change', (e) => {
                    console.log('change', e.value);
                    events.push(e.value);
                });
                cb();
            });
        }

        function getEvent() {
            return events[events.length - 1];
        }

        function extraStatusShowing() {
            return dom.style(dom.query(node, '.extra-status'), 'display') !== 'none';
        }
        function getStatusText() {
            return dom.query(node, '.main-status').textContent;
        }
        function dropShowing() {
            return dom.style(node.limitDrop, 'display') !== 'none';
        }
        function getDropText() {
            if (!dropShowing()) {
                return '';
            }
            const label = dom.query(node, '.dropdown-label').textContent;
            return `${label} ${node.limitDrop.value} `;
        }
        function getTextContent() {
            const extra = extraStatusShowing() ? dom.query(node, '.extra-status').textContent : '';
            const leftText = leftShowing() ? '<' : '';
            const rightText = rightShowing() ? '>' : '';
            return `${extra}${getDropText()}${getStatusText()}${leftText}${node.pageNumbers.textContent}${rightText}`;
        }
        function leftShowing() {
            return dom.style(getButton('left'), 'display') !== 'none';
        }
        function rightShowing() {
            return dom.style(getButton('right'), 'display') !== 'none';
        }
        function getButton(index) {
            if (index === 'left') {
                return dom.query(node, '.ui-button.left');
            }
            if (index === 'right') {
                return dom.query(node, '.ui-button.right');
            }
            return dom.query(node, `.ui-button.page-number[data-value="${index}"]`);
        }

        suite('render', function () {
            test('should render a paginator - first page', function (done) {
                node = dom(
                    'ui-paginator',
                    {
                        data: {
                            start: 0,
                            limit: 10,
                            total: 100,
                        },
                        limits: '10, 25',
                    },
                    body
                );
                ready(function () {
                    expect(node.textContent).to.equal(
                        'Rows per page:Select One...Showing results:1-10 of 100123...10'
                    );
                    expect(getButton(1).disabled).to.equal(true);
                    expect(getButton('left').disabled).to.equal(true);
                    done();
                });
            });
            test('should render a paginator - last page', function (done) {
                node = dom(
                    'ui-paginator',
                    {
                        data: {
                            start: 90,
                            limit: 10,
                            total: 100,
                        },
                        limits: '10, 25',
                    },
                    body
                );
                ready(function () {
                    expect(node.textContent).to.equal(
                        'Rows per page:Select One...Showing results:91-100 of 1001...8910'
                    );
                    expect(getButton(10).disabled).to.equal(true);
                    expect(getButton('right').disabled).to.equal(true);
                    done();
                });
            });
            test('should emit events [MANUAL]', function (done) {
                node = dom(
                    'ui-paginator',
                    {
                        data: {
                            start: 10,
                            limit: 10,
                            total: 100,
                        },
                        limits: '10, 25',
                    },
                    body
                );
                ready(function () {
                    done();
                });
            });
            test('should rerender when receiving new data', function (done) {
                node = dom(
                    'ui-paginator',
                    {
                        data: {
                            start: 0,
                            limit: 10,
                            total: 100,
                        },
                        limits: '10, 25',
                    },
                    body
                );
                ready(function () {
                    expect(getButton('left').disabled).to.equal(true);
                    expect(getButton('right').disabled).to.equal(false);
                    expect(getButton(1).disabled).to.equal(true);
                    expect(extraStatusShowing()).to.equal(false);
                    expect(getStatusText()).to.equal('1-10 of 100');

                    node.data = {
                        start: 20,
                        limit: 10,
                        total: 100,
                    };
                    expect(getButton('left').disabled).to.equal(false);
                    expect(getButton('right').disabled).to.equal(false);
                    expect(getButton(1).disabled).to.equal(false);
                    expect(getButton(3).disabled).to.equal(true);
                    expect(extraStatusShowing()).to.equal(false);
                    expect(getStatusText()).to.equal('21-30 of 100');

                    node.data = {
                        start: 90,
                        limit: 10,
                        total: 100,
                    };
                    expect(getButton('left').disabled).to.equal(false);
                    expect(getButton('right').disabled).to.equal(true);
                    expect(getButton(3)).to.equal(null);
                    expect(getButton(10).disabled).to.equal(true);
                    expect(extraStatusShowing()).to.equal(false);
                    expect(getStatusText()).to.equal('91-100 of 100');

                    done();
                });
            });
            test('should disable', function (done) {
                node = dom(
                    'ui-paginator',
                    {
                        data: {
                            start: 0,
                            limit: 10,
                            total: 100,
                        },
                        limits: '10, 25',
                        disabled: true,
                    },
                    body
                );
                ready(function () {
                    expect(dom.style(node, 'opacity')).to.equal(0.4);
                    expect(dom.style(getButton('right'), 'pointer-events')).to.equal('none');
                    done();
                });
            });
            test('should render only the status', function (done) {
                node = dom(
                    'ui-paginator',
                    {
                        data: {
                            start: 0,
                            limit: 10,
                            total: 8,
                        },
                        limits: '10, 25',
                    },
                    body
                );
                ready(function () {
                    expect(getTextContent()).to.equal('8 Results');
                    done();
                });
            });
            test('should render partial status', function (done) {
                node = dom(
                    'ui-paginator',
                    {
                        data: {
                            start: 0,
                            limit: 25,
                            total: 24,
                        },
                        limits: '10, 25',
                    },
                    body
                );
                ready(function () {
                    expect(getTextContent()).to.equal('Rows per page: 25 24 Results');
                    done();
                });
            });
        });
    });
});

mocha.run();
