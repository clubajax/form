require('./common');

window.mocha.setup('tdd');

suite('DatePicker', function () {
    this.timeout(3000);

    const suite = window.suite,
        util = window.getDatePickerUtil(),
        // dates = window.dates,
        dom = window.dom,
        on = window.on,
        expect = chai.expect,
        body = dom.byId('tests');

    function ready(node, cb) {
        node.onDomReady(function () {
            setTimeout(cb, 30);
        });
    }

    function key(node, value, pos) {
        pos = pos || node.input.value.length;
        node.input.selectionStart = pos;
        node.input.selectionEnd = pos;
        on.emit(node.input, 'keyup', { key: value });
    }

    function backspace(node) {
        select(node, 0, 20);
        // on.emit(node.input, 'keyup', {key: '9'});
        // console.log('BK');
        on.emit(node.input, 'keypress', { key: 'Backspace' });
        // on.emit(node.input, 'keyup', {key: 'Backspace'});
    }

    function clear(node) {
        node.input.value = '';
    }

    function select(node, beg, end) {
        node.focus();
        end = end === undefined ? beg : end;
        node.input.selectionStart = beg;
        node.input.selectionEnd = end;
    }

    function edit(node, beg, end, text) {
        return new Promise(function (resolve) {
            const input = node.input;
            select(node, beg, end);
            text.split('').forEach(function (char, i) {
                setTimeout(function () {
                    on.emit(input, 'keyup', { key: char });
                    if (i === text.length - 1) {
                        resolve();
                    }
                }, 1);
            });
        });
    }

    function arrow(node, sel, inc) {
        select(node, sel);
        if (inc > 0) {
            on.emit(node.input, 'keyup', { key: 'ArrowUp' });
        } else {
            on.emit(node.input, 'keyup', { key: 'ArrowDown' });
        }
    }

    function clickDate(node, date) {
        const day = util.toDateAriaLabel(date);
        const n = dom.query(node.picker, '[aria-label="' + day + '"]');
        if (n) {
            on.emit(n, 'click');
            node.blur();
        } else {
            console.log(`could not find: "${day}"`);
        }
    }

    function showing(node) {
        return node.popup.classList.contains('open') && dom.style(node.popup, 'display') !== 'none';
    }

    function focus(node) {
        node.focus();
        on.emit(node.input, 'focus');
    }

    function open(node) {
        on.emit(node.icon, 'click');
    }

    function trackFocus() {
        on(document, 'keyup', (e) => {
            console.log('key', e.key);
            if (e.key === 'Tab') {
                console.log('focus:', document.activeElement);
            }
        });
    }
    // FIXME:
    //  time-input blur does not close calendar

    suite('tests', function () {
        // return
        suite('utils', function () {
            test('should validate date and time strings', function () {
                const DATE = '12/25/2017';
                const TIME = '02:30 am';
                const DATETIME = DATE + ' ' + TIME;
                expect(util.is(DATE).date()).to.equal(true);
                expect(util.is(TIME).time()).to.equal(true);
                expect(util.is(DATETIME).dateAndTime()).to.equal(true);

                expect(util.is(DATE).time()).to.equal(false);
                expect(util.is(TIME).date()).to.equal(false);
                expect(util.is(DATETIME).type()).to.equal('datetime');
                expect(util.is(DATE).type()).to.equal('date');
                expect(util.is(TIME).type()).to.equal('time');
            });

            test('should convert a time string to seconds', function () {
                expect(util.timeToSeconds('12:01 am')).to.equal(60);
                expect(util.timeToSeconds('12:01 pm')).to.equal(43260);
                expect(util.timeToSeconds('01:01 am')).to.equal(3660);
                expect(util.timeToSeconds('01:01 pm')).to.equal(46860);
                expect(util.timeToSeconds('11:30 am')).to.equal(41400);
                expect(util.timeToSeconds('11:30 pm')).to.equal(84600);
            });

            test('should compare times', function () {
                expect(util.is('12:01 am').less('12:02 am')).to.equal(true);
                expect(util.is('12:01 am').less('12:01 pm')).to.equal(true);
                expect(util.is('12:03 am').greater('12:02 am')).to.equal(true);
                expect(util.is('12:01 pm').greater('12:01 am')).to.equal(true);
            });

            test('should round', function () {
                // round up
                expect(util.round(1, 15)).to.equal(15);
                expect(util.round(9, 15)).to.equal(15);
                expect(util.round(11, 15)).to.equal(15);
                expect(util.round(21, 15)).to.equal(30);
                expect(util.round(4, 10)).to.equal(10);
                expect(util.round(11, 10)).to.equal(20);
                // round down
                expect(util.round(1, 15, true)).to.equal(0);
                expect(util.round(9, 15, true)).to.equal(0);
                expect(util.round(11, 15, true)).to.equal(0);
                expect(util.round(21, 15, true)).to.equal(15);
                expect(util.round(4, 10, true)).to.equal(0);
                expect(util.round(11, 10, true)).to.equal(10);
            });

            test('should increment minutes', function () {
                // no rounding
                expect(util.incMinutes('00:00 am', 1)).to.equal('00:01 am');
                expect(util.incMinutes('00:30 am', -1)).to.equal('00:29 am');
                expect(util.incMinutes('00:00 am', -1)).to.equal('00:45 am');
                expect(util.incMinutes('00:59 am', 1)).to.equal('00:00 am');

                // even rounding am
                expect(util.incMinutes('00:00 am', 1, 15)).to.equal('00:15 am');
                expect(util.incMinutes('00:30 am', -1, 15)).to.equal('00:15 am');
                expect(util.incMinutes('00:45 am', 1, 15)).to.equal('00:00 am');
                expect(util.incMinutes('00:00 am', -1, 15)).to.equal('00:45 am');

                // odd rounding am
                expect(util.incMinutes('00:05 am', 1, 15)).to.equal('00:15 am');
                expect(util.incMinutes('00:14 am', 1, 15)).to.equal('00:15 am');
                expect(util.incMinutes('00:16 am', 1, 15)).to.equal('00:30 am');
                expect(util.incMinutes('00:29 am', 1, 15)).to.equal('00:30 am');
                expect(util.incMinutes('00:47 am', 1, 15)).to.equal('00:00 am');
            });
        });

        suite('input keys', function () {
            test('should edit a selection - date', function (done) {
                const value = '12/25/2017 2:00 pm';
                const node = dom('date-input', { value: value }, body);
                onDomReady(node, function () {
                    edit(node, 3, 5, '13').then(function () {
                        expect(node.value).to.equal('12/13/2017');
                        edit(node, 0, 2, '07').then(function () {
                            expect(node.value).to.equal('07/13/2017');
                            done();
                        });
                    });
                });
            });

            test('should edit a selection - time', function (done) {
                const value = '12/25/2017 2:00 pm';
                const node = dom('time-input', { value: value }, body);
                onDomReady(node, function () {
                    edit(node, 3, 5, '13').then(function () {
                        expect(node.value).to.equal('02:13 pm');
                        edit(node, 0, 2, '11').then(function () {
                            expect(node.value).to.equal('11:13 pm');
                            done();
                        });
                    });
                });
            });

            test('should edit a selection - date/time', function (done) {
                const value = '12/25/2017 1:11 pm';
                const node = dom('date-time-input', { value: value }, body);
                onDomReady(node, function () {
                    edit(node, 14, 16, '22').then(function () {
                        //expect(node.value).to.equal('12/13/2017 11:00 pm');
                        // edit(node, 14, 16, '22');
                        done();
                    });

                    // edit(node, 3, 5, '13').then(function () {
                    // 	expect(node.value).to.equal('12/13/2017 02:22 pm');
                    // 	edit(node, 0, 2, '07').then(function () {
                    // 		expect(node.value).to.equal('07/13/2017 02:22 pm');
                    // 		edit(node, 11, 13, '11').then(function () {
                    // 			//expect(node.value).to.equal('12/13/2017 11:00 pm');
                    // 			// edit(node, 14, 16, '22');
                    // 		});
                    // 	});
                    // });
                    // done();
                });
            });

            test('should increment and decrement values - date', function (done) {
                const value = '12/25/2017 2:00 pm';
                const dateInput = dom('date-input', { value: value }, body);
                onDomReady(dateInput, function () {
                    expect(dateInput.value).to.equal('12/25/2017');
                    arrow(dateInput, 0, 1);
                    arrow(dateInput, 4, 1);
                    arrow(dateInput, 8, -1);
                    expect(dateInput.value).to.equal('01/26/2016');
                    done();
                });
            });

            test('should increment and decrement values - time', function (done) {
                const value = '12/25/2017 2:00 pm';
                const timeInput = dom('time-input', { value: value }, body);
                onDomReady(timeInput, function () {
                    expect(timeInput.value).to.equal('02:00 pm');
                    arrow(timeInput, 0, 1);
                    arrow(timeInput, 5, 1);
                    arrow(timeInput, 5, 1);
                    arrow(timeInput, 7, 1);
                    expect(timeInput.value).to.equal('03:30 am');
                    done();
                });
            });

            test.skip('should increment and decrement values - date-time', function (done) {
                const value = '12/25/2017 2:00 pm';
                const dateTimeInput = dom('date-time-input', { value: value }, body);
                onDomReady(dateTimeInput, function () {
                    // dateTime - time
                    expect(dateTimeInput.value).to.equal('12/25/2017 02:00 pm');
                    arrow(dateTimeInput, 11, 1);
                    arrow(dateTimeInput, 14, 1);
                    arrow(dateTimeInput, 18, 1);
                    expect(dateTimeInput.value).to.equal('12/25/2017 03:15 am');

                    // dateTime - date
                    arrow(dateTimeInput, 0, -1);
                    arrow(dateTimeInput, 4, -1);
                    arrow(dateTimeInput, 8, 1);
                    expect(dateTimeInput.value).to.equal('11/24/2018 03:15 am');

                    done();
                });
            });
        });

        suite('date input', function () {
            test.only('should render', function () {
                const node = dom(
                    'date-input',
                    {
                        label: 'min and max',
                        value: '12/25/2017',
                    },
                    body,
                );
            });

            test('should pop up', function () {
                const node = dom(
                    'date-input',
                    { label: 'Opens with ui-popup', min: null, max: null, value: '11/20/1964' },
                    body,
                );
                expect(dom.isNode(node)).to.equal(true);
                // node.on('blur', () => {
                //     console.log('test.blur');
                // });
                node.on('change', (e) => {
                    console.log('change', e.value);
                });

                ready(node, () => {
                    // const btn = dom.query(node, 'button');
                    // console.log('btn', btn);
                    // on.emit(btn, 'click');
                });
            });

            test('should disable', function () {
                const node = dom('date-input', { label: 'Is Disabled', disabled: true }, body);
                expect(dom.isNode(node)).to.equal(true);
            });

            test('should handle arrow keys', function (done) {
                const node = dom(
                    'date-input',
                    {
                        label: 'handle arrow keys',
                        value: '12/25/2017',
                        min: '12/24/2017',
                    },
                    body,
                );

                ready(node, function () {
                    expect(node.value).to.equal('12/25/2017');

                    arrow(node, 1, 1);
                    expect(node.value).to.equal('12/25/2017'); // validation error
                    expect(node.valid).to.equal(false);

                    arrow(node, 1, -1);
                    arrow(node, 4, 1);
                    expect(node.value).to.equal('12/26/2017');

                    arrow(node, 8, 1);
                    expect(node.value).to.equal('12/26/2018');

                    done();
                });
            });

            test('should handle input starting blank', function (done) {
                const node = dom(
                    'date-input',
                    {
                        label: 'input starting blank',
                    },
                    body,
                );
                ready(node, function () {
                    key(node, 1, 0);
                    key(node, 2);
                    key(node, 2);
                    key(node, 5);
                    key(node, 2);
                    key(node, 0);
                    key(node, 1);
                    key(node, 7);
                    expect(node.valid).to.equal(true);
                    done();
                });
            });

            test('should handle min and max', function (done) {
                const node = dom(
                    'date-input',
                    {
                        label: 'min and max',
                        value: '12/25/2017',
                        min: '12/24/2017',
                        max: '12/26/2017',
                    },
                    body,
                );

                ready(node, function () {
                    open(node);
                    focus(node);
                    clickDate(node, '12/24/2017');
                    expect(node.value).to.equal('12/24/2017');

                    focus(node);
                    clickDate(node, '12/26/2017');
                    expect(node.value).to.equal('12/26/2017');

                    focus(node);
                    clickDate(node, '12/27/2017');
                    expect(node.value).to.equal('12/26/2017');

                    focus(node);
                    clickDate(node, '12/23/2017');
                    expect(node.value).to.equal('12/26/2017');
                    done();
                });
            });

            test('should handle big dates', function (done) {
                const node = dom(
                    'date-input',
                    {
                        label: 'big dates',
                        value: '12/31/2099',
                        // min: '12/24/2017',
                        // max: '12/26/2017'
                    },
                    body,
                );

                ready(node, function () {
                    // focus(node);
                    // clickDate(node, '12/24/2017');
                    // expect(node.value).to.equal('12/24/2017');

                    // focus(node);
                    // clickDate(node, '12/26/2017');
                    // expect(node.value).to.equal('12/26/2017');

                    // focus(node);
                    // clickDate(node, '12/27/2017');
                    // expect(node.value).to.equal('12/26/2017');

                    // focus(node);
                    // clickDate(node, '12/23/2017');
                    // expect(node.value).to.equal('12/26/2017');
                    done();
                });
            });

            test('should open to the top left', function () {
                const node = dom('date-input', { label: 'open to top left', class: 'BR' }, body);
                expect(dom.isNode(node)).to.equal(true);
            });

            test.skip('should submit in a form (MANUAL)', function (done) {
                // click submit, view result in URL

                const form = dom('form', { method: 'GET' }, body);
                dom('input', { type: 'text', value: 'Mike', name: 'name' }, form);
                const node = dom('date-input', { name: 'date', label: 'Date of Event' }, form);
                const btn = dom('button', { html: 'Submit' }, form);
                on.once(form, 'submit', function (e) {
                    console.log('SUBMIT', e);
                    // e.preventDefault();
                    // return false;
                });
                ready(node, function () {
                    btn.focus();
                    on.emit(btn, 'click');
                    expect(dom.isNode(node)).to.equal(true);
                    done();
                });
            });

            test.skip('should select dates and not lose focus (NOT WORKING)', function (done) {
                // problems with focus
                const node = dom(
                    'date-input',
                    {
                        label: 'Date',
                        value: '12/25/2017',
                    },
                    body,
                );
                ready(node, function () {
                    // const time = 1000;
                    // focus(node);
                    // clickDate(node, '12/01/2017');
                    // setTimeout(function () {
                    // 	clickDate(node, '12/03/2017');
                    // 	setTimeout(function () {
                    // 		clickDate(node, '12/05/2017');
                    // 		setTimeout(function () {
                    // 			clickDate(node, '12/07/2017');
                    // 		}, time);
                    // 	}, time);
                    // }, time);
                    done();
                });
            });
        });

        suite('time input', function () {
            test('should handle clearing the input and re-typing', function (done) {
                const node = dom('time-input', { label: 'clear retype', step: 15 }, body);
                ready(node, function () {
                    let emitted;
                    const events = [];
                    node.on('change', function (e) {
                        // console.log('change', e.value);
                        events.push(1);
                        emitted = events.join(',');
                    });
                    node.focus();
                    key(node, 1, 1);
                    key(node, 1, 2);
                    key(node, 1, 3);
                    key(node, 1, 4);
                    node.blur();
                    expect(node.valid).to.equal(true);
                    expect(emitted).to.equal('1');
                    expect(node.value).to.equal('11:11 pm');
                    node.focus();

                    backspace(node);
                    // key(node, 'Backspace', 0)
                    done();
                });
            });
            test('should handle valid and invalid from blank', function (done) {
                const node = dom('time-input', { label: 'valid and invalid from blank', step: 15 }, body);
                ready(node, function () {
                    let emitted;
                    const events = [];
                    node.on('change', function (e) {
                        // console.log('change', e.value);
                        events.push(1);
                        emitted = events.join(',');
                    });
                    node.focus();
                    key(node, 1, 0);
                    node.blur();
                    expect(node.valid).to.equal(false);
                    node.focus();
                    key(node, 2, 1);
                    key(node, 3, 2);
                    key(node, 4, 3);
                    node.blur();
                    expect(node.valid).to.equal(true);
                    expect(emitted).to.equal('1');
                    expect(node.value).to.equal('12:34 pm');
                    done();
                });
            });

            test('should handle valid and invalid from value', function (done) {
                const node = dom(
                    'time-input',
                    { label: 'valid and invalid from value', value: '12:34am', step: 15, required: true },
                    body,
                );
                ready(node, function () {
                    let emitted = '';
                    const events = [];
                    node.on('change', function (e) {
                        events.push(1);
                        emitted = events.join(',');
                    });
                    expect(node.valid).to.equal(true);
                    expect(emitted).to.equal('');
                    expect(node.value).to.equal('12:34 am');
                    node.focus();

                    // test required
                    clear(node);
                    node.blur();
                    expect(node.valid).to.equal(false);
                    done();
                });
            });

            test('should handle arrow keys', function (done) {
                const node = dom(
                    'time-input',
                    { label: 'handle arrow keys - time', value: '12:34am', step: 15, required: true },
                    body,
                );
                ready(node, function () {
                    expect(node.value).to.equal('12:34 am');

                    arrow(node, 2, 1);
                    expect(node.value).to.equal('01:34 am');

                    arrow(node, 4, 1);
                    expect(node.value).to.equal('01:45 am');

                    arrow(node, 6, 1);
                    expect(node.value).to.equal('01:45 pm');

                    done();
                });
            });

            test('should handle min and max', function (done) {
                const time = '02:00 am';
                const node = dom(
                    'time-input',
                    { label: 'min and max time', value: time, step: 15, min: '01:30 am', max: '02:30 am' },
                    body,
                );
                ready(node, function () {
                    let err;
                    node.on('validation', function (e) {
                        //console.log('val:::', e.detail.message);
                    });
                    expect(node.valid).to.equal(true);
                    node.value = '01:00 am';
                    expect(node.valid).to.equal(false);

                    node.value = '02:00 am';
                    expect(node.valid).to.equal(true);

                    node.value = '03:00 am';
                    expect(node.valid).to.equal(false);

                    node.value = '02:00 am';
                    expect(node.valid).to.equal(true);

                    done();
                });
            });
        });

        suite.skip('date time input', function () {
            test('should persist open with no value', function (done) {
                const node = dom(
                    'date-time-input',
                    {
                        label: 'Date and Time',
                        //value: '03/27/2018 10:00 am',
                        min: 'now',
                        static: true,
                    },
                    body,
                );
                ready(node, function () {
                    node.on('validation', function (e) {
                        console.log('val:::', e.detail.message);
                    });
                    node.on('change', function (e) {
                        console.log('change:::', e.value);
                    });

                    expect(showing(node)).to.equal(true);

                    // for some reason, onClick is occasionally async
                    setTimeout(function () {
                        done();
                    }, 1);
                });
            });

            test('should persist open (and stay open)', function (done) {
                const node = dom(
                    'date-time-input',
                    {
                        label: 'Date and Time',
                        value: '03/27/2018 10:00 am',
                        static: true,
                    },
                    body,
                );
                ready(node, function () {
                    expect(showing(node)).to.equal(true);
                    clickDate(node, '03/30/2018');

                    // for some reason, onClick is occasionally async
                    setTimeout(function () {
                        expect(showing(node)).to.equal(true);
                        expect(node.value).to.equal('03/30/2018 10:00 am');

                        arrow(node, 3, -1);
                        on.emit(node.input, 'keyup', { key: 'Enter' });
                        expect(node.value).to.equal('03/29/2018 10:00 am');
                        expect(showing(node)).to.equal(true);

                        arrow(node, 3, -1);
                        on.emit(node.input, 'keyup', { key: 'Enter' });
                        expect(node.value).to.equal('03/28/2018 10:00 am');
                        expect(showing(node)).to.equal(true);

                        done();
                    }, 1);
                });
            });

            test('should add a time to the picker and handle keys, min/max', function (done) {
                const dateStr = '12/12/2017 02:20 am';
                const max = '12/26/2017 12:00 am';
                const node = dom(
                    'date-time-input',
                    { label: 'Enter Date and Time', value: dateStr, min: dateStr, max: max },
                    body,
                );
                ready(node, function () {
                    let err;
                    node.on('validation', function (e) {
                        //console.log('val:::', e.detail.message);
                    });

                    expect(node.value).to.equal(dateStr);

                    // check time arrow keys
                    arrow(node, 12, 1);
                    expect(node.value).to.equal('12/12/2017 03:20 am');

                    arrow(node, 14, 1);
                    expect(node.value).to.equal('12/12/2017 03:30 am');

                    arrow(node, 17, 1);
                    expect(node.value).to.equal('12/12/2017 03:30 pm');

                    arrow(node, 12, -1);
                    arrow(node, 12, -1);
                    arrow(node, 14, -1);
                    on.emit(node.input, 'keyup', { key: 'Enter' });
                    expect(node.value).to.equal('12/12/2017 01:15 pm');

                    done();
                });
            });

            test('should handle complex focus', function (done) {
                const dateStr = '12/12/2017 02:20 am';
                const min = '12/08/2017 02:20 am';
                const node = dom('date-time-input', { label: 'Enter Date and Time', value: dateStr, min: min }, body);
                dom('input', { class: 'BR' }, body);
                ready(node, function () {
                    done();
                });
            });
        });

        suite('date picker', function () {
            test('should render a picker (MANUAL)', function (done) {
                const wrap = dom('div', { class: 'picker-wrapper' }, body);
                const node = dom('date-picker', { label: 'manual picker', value: '11/11/2020 02:20 am' }, wrap);
                ready(node, function () {
                    done();
                });
            });

            test('should add a time to the picker', function (done) {
                const node = dom(
                    'date-picker',
                    { label: 'add a time to the picker', time: true, value: '12/12/2017 02:20 am' },
                    body,
                );
                ready(node, function () {
                    let emitted;
                    const events = [];
                    node.on('change', function (e) {
                        // console.log('change', e);
                        events.push(1);
                        emitted = events.join(',');
                    });

                    node.timeInput.focus();
                    clear(node.timeInput);
                    node.timeInput.blur();
                    done();
                });
            });

            test('should allow `now` as a min', function (done) {
                const date = new Date();
                const dateStr = dates.format(date, 'MM/dd/yyyy');
                const node = dom('date-picker', { label: 'now as a min', min: 'now', value: dateStr }, body);
                ready(node, function () {
                    const todayLabel = util.toDateAriaLabel(date);
                    const todayNode = dom.query(node, `[aria-label="${todayLabel}"]`);
                    expect(todayNode.classList.contains('disabled')).to.equal(false);

                    date.setDate(date.getDate() - 1);
                    const yesterdayLabel = util.toDateAriaLabel(date);
                    const yesterdayNode = dom.query(node, `[aria-label="${yesterdayLabel}"]`);
                    expect(yesterdayNode.classList.contains('disabled')).to.equal(true);
                    done();
                });
            });

            test('should allow `now` as a max', function (done) {
                const date = new Date();
                const dateStr = dates.format(date, 'MM/dd/yyyy');
                const node = dom('date-picker', { label: 'now as a max', max: 'now', value: dateStr }, body);
                ready(node, function () {
                    const todayLabel = util.toDateAriaLabel(date);
                    const todayNode = dom.query(node, `[aria-label="${todayLabel}"]`);
                    expect(todayNode.classList.contains('disabled')).to.equal(false);

                    date.setDate(date.getDate() + 1);
                    const tomorrowLabel = util.toDateAriaLabel(date);
                    const tomorrowNode = dom.query(node, `[aria-label="${tomorrowLabel}"]`);
                    expect(tomorrowNode.classList.contains('disabled')).to.equal(true);
                    done();
                });
            });

            test('should not allow selection before min or after max', function () {
                const node = dom(
                    'date-picker',
                    { label: 'block selection', min: '07/05/2017', max: '07/19/2017', value: '07/01/2017' },
                    body,
                );
                expect(dom.isNode(node)).to.equal(true);
            });

            test('should handle min and max with time', function (done) {
                const value = '12/12/2017 04:30 am';
                const min = '12/12/2017 05:30 am';
                const max = '12/13/2017 07:30 am';
                const LESS = 'Value is less than the minimum, ' + min;
                const MAX = 'Value is greater than the maximum, ' + max;
                const node = dom(
                    'date-picker',
                    { label: 'time min max', time: true, value: value, min: min, max: max },
                    body,
                );
                ready(node, function () {
                    let error = node.timeInput.validationError;
                    node.on('validation', function (e) {
                        //console.log(' --- validation', e.detail.message);
                        error = e.detail.message;
                    });
                    node.timeInput.validate();

                    expect(error).to.equal(LESS);
                    node.value = max;
                    expect(error).to.equal(null);
                    node.timeInput.value = '08:00 am';
                    expect(error).to.equal(MAX);
                    node.timeInput.value = '08:30 am';
                    expect(error).to.equal(MAX);
                    done();
                });
            });
        });

        suite('date range inputs', function () {
            test('should load a date range input', function (done) {
                const node = dom(
                    'date-range-input',
                    { label: 'load date range input', 'independent-pickers': true, value: '01/10/2017 - 02/14/2017' },
                    body,
                );
                // expect(dom.isNode(node)).to.equal(true);
                // console.log('node', node);
                ready(node, function () {
                    done();
                });
            });

            test('should load date range inputs', function (done) {
                const node = dom(
                    'date-range-inputs',
                    { 'left-label': 'Start Date', 'right-label': 'End Date', value: '01/10/2017 - 02/14/2017' },
                    body,
                );
                expect(dom.isNode(node)).to.equal(true);

                ready(node, function () {
                    expect(node.value).to.equal('01/10/2017 - 02/14/2017');

                    expect(node.leftInput.value).to.equal('01/10/2017');
                    expect(node.rightInput.value).to.equal('02/14/2017');

                    node.value = '02/10/2017 - 03/17/2017';
                    expect(node.leftInput.value).to.equal('02/10/2017');
                    expect(node.rightInput.value).to.equal('03/17/2017');
                    done();
                });
            });

            test('should load date range inputs with no value', function (done) {
                const node = dom(
                    'date-range-inputs',
                    { 'left-label': 'Start Date', 'right-label': 'End Date', required: true, placeholder: 'Date here' },
                    body,
                );
                expect(dom.isNode(node)).to.equal(true);

                node.on('change', function (e) {
                    // console.log('change.value', node.value);
                    // console.log('change.target', e.target);
                });

                ready(node, function () {
                    expect(node.value).to.equal(null);

                    node.value = '02/10/2017 - 03/17/2017';
                    expect(node.value).to.equal('02/10/2017 - 03/17/2017');
                    done();
                });
            });
        });

        suite('date range', function () {
            test('should load a range calendar', function () {
                const node = dom('date-picker', { 'range-picker': true }, body);
                expect(dom.isNode(node)).to.equal(true);
            });

            test('should load a date range picker - MANUAL', function () {
                const node = dom('date-range-picker', { value: '02/20/2017 - 03/05/2017' }, body);
                expect(dom.isNode(node)).to.equal(true);
            });

            test('should load a date range picker with independent pickers - MANUAL', function () {
                const node = dom(
                    'date-range-picker',
                    { value: '02/20/2017 - 04/05/2017', 'independent-pickers': true },
                    body,
                );
                expect(dom.isNode(node)).to.equal(true);
            });

            test('should open the other picker if range is (auto-set) the same - MANUAL TEST', function (done) {
                const node = dom(
                    'date-range-inputs',
                    { 'left-label': 'Start Date', 'right-label': 'End Date', value: '02/10/2017 - 02/14/2017' },
                    body,
                );
                const b1 = dom('button', { html: 'clear' }, body);
                const b2 = dom('button', { html: 'value.set' }, body);
                const b3 = dom('button', { html: 'setValue' }, body);
                expect(dom.isNode(node)).to.equal(true);

                on(b1, 'click', function () {
                    node.clear();
                });
                on(b2, 'click', function () {
                    node.value = '02/10/2017 - 02/14/2017';
                });
                on(b3, 'click', function () {
                    node.setValue('02/10/2017 - 02/14/2017', true);
                });

                node.on('change', function (e) {
                    // console.log('change.value', node.value);
                    // console.log('change.target', e.target);
                });

                onDomReady(node, function () {
                    //node.leftInput.value = '02/15/2017';
                    //node.value = '02/10/2017 - 03/17/2017';
                    //expect(node.value).to.equal('02/10/2017 - 03/17/2017');
                    done();
                });
            });

            test('should open the other picker if range is (auto-set) the same (no initial value) - MANUAL TEST', function (done) {
                const node = dom('date-range-inputs', { 'left-label': 'Start Date', 'right-label': 'End Date' }, body);

                expect(dom.isNode(node)).to.equal(true);
                node.on('change', function (e) {
                    console.log('\nEMIT');
                    console.log('change.value', node.value);
                    console.log('change.target', e.target);
                });

                onDomReady(node, function () {
                    //node.leftInput.value = '02/15/2017';
                    //node.value = '02/10/2017 - 03/17/2017';
                    //expect(node.value).to.equal('02/10/2017 - 03/17/2017');
                    done();
                });
            });
        });

        suite('calendar and events', () => {
            test('should render a calendar', () => {
                const wrap = dom('div', { class: 'picker-wrapper-abs' }, body);
                const node = dom(
                    'date-picker',
                    { label: 'Calendar', 'is-calendar': true, value: '11/11/2020 02:20 am' },
                    wrap,
                );
                // ready(node, function () {
                //     done();
                // });
            });
        });
    });
});

window.mocha.run();
