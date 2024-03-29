const BaseComponent = require('@clubajax/base-component');
const dates = require('@clubajax/dates');
const dom = require('@clubajax/dom');
require('./date-picker');

const EVENT_NAME = 'change';

class DateRangePicker extends BaseComponent {
    onValue(value) {
        // might need attributeChanged
        this.strDate = dates.isDate(value) ? value : '';
        onDomReady(this, () => {
            this.setValue(this.strDate, true);
        });
    }

    constructor() {
        super();
    }

    setValue(value, noEmit) {
        if (!value) {
            this.valueDate = '';
            this.clearRange();
        } else if (typeof value === 'string') {
            var dateStrings = split(value);
            this.valueDate = dates.toDate(value);
            this.firstRange = dates.toDate(dateStrings[0]);
            this.secondRange = dates.toDate(dateStrings[1]);
            this.setDisplay();
            this.setRange(noEmit);
        }
    }

    domReady() {
        this.eventName = this['event-name'] || EVENT_NAME;
        this.emitType = this.eventName === EVENT_NAME ? 'emit' : 'fire';
        const sync = !this['independent-pickers'];
        this.leftCal = dom('date-picker', { 'range-left': true, 'no-right-nav': sync }, this);
        this.rightCal = dom('date-picker', { 'range-right': true, 'no-left-nav': sync }, this);
        this.rangeExpands = this['range-expands'];

        this.connectEvents();
    }

    setDisplay() {
        const first = this.firstRange ? new Date(this.firstRange.getTime()) : new Date(),
            second = new Date(first.getTime());

        if (this['independent-pickers'] && this.secondRange) {
            second.setMonth(this.secondRange.getMonth());
        } else {
            second.setMonth(second.getMonth() + 1);
        }
        this.leftCal.setDisplay(first);
        this.rightCal.setDisplay(second);
    }

    setRange(noEmit) {
        this.leftCal.setRange(this.firstRange, this.secondRange);
        this.rightCal.setRange(this.firstRange, this.secondRange);
        if (!noEmit && this.firstRange && this.secondRange) {
            const beg = dates.format(this.firstRange, 'MM/dd/yyyy'),
                end = dates.format(this.secondRange, 'MM/dd/yyyy');

            const event = {
                firstRange: this.firstRange,
                secondRange: this.secondRange,
                begin: beg,
                end: end,
                value: beg + DELIMITER + end,
            };

            this[this.emitType](this.eventName, event, true);
        }
    }

    clearRange() {
        this.leftCal.clearRange();
        this.rightCal.clearRange();
    }

    calculateRange(e, which) {
        e = e.detail || e;

        if (e.first === this.leftCal.firstRange) {
            if (!e.second) {
                this.rightCal.clearRange();
                this.rightCal.setRange(this.leftCal.firstRange, null);
            } else {
                this.rightCal.setRange(this.leftCal.firstRange, this.leftCal.secondRange);
            }
        }
    }

    onShow() {
        // do nothing?
    }

    onHide() {
        // do nothing?
    }

    connectEvents() {
        if (!this['independent-pickers']) {
            this.leftCal.on(
                'display-change',
                function (e) {
                    let m = e.detail.month,
                        y = e.detail.year;
                    if (m + 1 > 11) {
                        m = 0;
                        y++;
                    } else {
                        m++;
                    }
                    this.rightCal.setDisplay(y, m);
                }.bind(this),
            );

            this.rightCal.on(
                'display-change',
                function (e) {
                    let m = e.detail.month,
                        y = e.detail.year;
                    if (m - 1 < 0) {
                        m = 11;
                        y--;
                    } else {
                        m--;
                    }
                    this.leftCal.setDisplay(y, m);
                }.bind(this),
            );
        }

        this.leftCal.on(
            'change',
            function (e) {
                e.preventDefault();
                e.stopImmediatePropagation();
                return false;
            }.bind(this),
        );

        this.rightCal.on(
            'change',
            function (e) {
                e.preventDefault();
                e.stopImmediatePropagation();
                return false;
            }.bind(this),
        );

        if (!this.rangeExpands) {
            this.rightCal.on(
                'reset-range',
                function (e) {
                    this.leftCal.clearRange();
                }.bind(this),
            );

            this.leftCal.on(
                'reset-range',
                function (e) {
                    this.rightCal.clearRange();
                }.bind(this),
            );
        }

        this.leftCal.on(
            'select-range',
            function (e) {
                this.calculateRange(e, 'left');
                e = e.detail;
                if (this.rangeExpands && e.first && e.second) {
                    if (isDateCloserToLeft(e.current, e.first, e.second)) {
                        this.firstRange = e.current;
                    } else {
                        this.secondRange = e.current;
                    }
                    this.setRange();
                } else if (e.first && e.second) {
                    // new range
                    this.clearRange();
                    this.firstRange = e.current;
                    this.secondRange = null;
                    this.setRange();
                } else if (e.first && !e.second) {
                    this.secondRange = e.current;
                    this.setRange();
                } else {
                    this.firstRange = e.current;
                    this.setRange();
                }
            }.bind(this),
        );

        this.rightCal.on(
            'select-range',
            function (e) {
                this.calculateRange(e, 'right');

                e = e.detail;
                if (this.rangeExpands && e.first && e.second) {
                    if (isDateCloserToLeft(e.current, e.first, e.second)) {
                        this.firstRange = e.current;
                    } else {
                        this.secondRange = e.current;
                    }
                    this.setRange();
                } else if (e.first && e.second) {
                    // new range
                    this.clearRange();
                    this.firstRange = e.current;
                    this.secondRange = null;
                    this.setRange();
                } else if (e.first && !e.second) {
                    this.secondRange = e.current;
                    this.setRange();
                } else {
                    this.firstRange = e.current;
                    this.setRange();
                }
            }.bind(this),
        );

        this.on(
            this.rightCal,
            'mouseover',
            function () {
                this.leftCal.displayRangeToEnd();
            }.bind(this),
        );
    }

    destroy() {
        this.rightCal.destroy();
        this.leftCal.destroy();
    }
}

const DELIMITER = ' - ';

function split(value) {
    if (value.indexOf(',') > -1) {
        return value.split(/\s*,\s*/);
    }
    return value.split(/\s*-\s*/);
}

function isDateCloserToLeft(date, left, right) {
    const diff1 = dates.diff(date, left),
        diff2 = dates.diff(date, right);
    return diff1 <= diff2;
}

module.exports = BaseComponent.define('date-range-picker', DateRangePicker, {
    bools: ['range-expands', 'independent-pickers'],
    props: ['value', 'event-name'],
});
