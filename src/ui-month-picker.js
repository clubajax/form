const BaseComponent = require('@clubajax/base-component');
const dom = require('@clubajax/dom');
const dates = require('@clubajax/dates');
const { isEmpty, isNull, loop } = require('@clubajax/no-dash');
const emitEvent = require('./lib/emitEvent');
const { pad } = require('./date-picker/util');
require('./ui-dropdown');

class UiMonthPicker extends BaseComponent {
    constructor() {
        super();
    }

    attributeChanged(prop, value) {
        if (prop === 'value') {
            this.value = value;
        }
    }

    onMin(min) {
        console.log('picker.min', min);
        this.minDate = getMonthYear(min);
        this.setMinMax();
    }
    onMax(max) {
        console.log('picker.max', max);
        this.maxDate = getMonthYear(max);
        this.setMinMax();
    }

    set value(value) {
        this._value = isNull(value) ? defaultValue : value;
        this.setValue();
    }

    get value() {
        return this._value;
    }

    setValue(month = this.getMonth(), year = this.getYear()) {
        this._value = `${pad(month)}/${year}`;
        if (!this.rendered) {
            return;
        }
        if (this.yearsDrop) {
            this.yearsDrop.value = year;
        } else {
            this.yearLabel.innerHTML = year;
        }

        this.lastYear = year;
        this.buttonDates = [];
        this.buttons.forEach((b) => {
            const value = parseInt(dom.attr(b, 'value'), 10);
            if (value === month) {
                b.classList.add('selected');
            } else {
                b.classList.remove('selected');
            }
            b.innerHTML = `${pad(value)}/${year}`;
            this.buttonDates.push([value, year]);
        });
    }

    setMinMax() {
        if (!this.min && !this.max) {
            return;
        }
        clearTimeout(this.minMaxTimer);
        const min = this.minDate;
        const max = this.maxDate;
        console.log('min', min);
        console.log('max', max);
        this.minMaxTimer = setTimeout(() => {
            this.buttons.forEach((b, i) => {
                const dt = this.buttonDates[i];
                b.disabled = !inRange(dt, min, max);
            });

            if (min) {
                this.leftNav.disabled = this.getYear() <= min[1];
            }
            if (max) {
                this.rightNav.disabled = this.getYear() >= max[1];
            }
        }, 100);
    }

    getMonth() {
        return parseInt(this._value.split('/')[0], 10);
    }

    getYear() {
        return parseInt(this._value.split('/')[1], 10);
    }

    getYearsData() {
        // TODO: Does not handle min/max
        if (!this.yearsData) {
            const curr = this.getYear();
            const prev = this['years-prev'] || 5;
            const next = this['years-next'] || 5;
            this.yearsData = [];
            const beg = curr - prev;
            for (let i = beg; i <= curr + next; i++) {
                const d = {
                    label: i,
                    value: i,
                };
                if (i === curr) {
                    d.selected = true;
                }
                this.yearsData.push(d);
            }
        }
        return this.yearsData;
    }

    emitEvent() {
        const value = {
            value: this.value,
            month: this.getMonth(),
            year: this.getYear(),
        };
        emitEvent(this, value);
    }

    connected() {
        this.render();
        this.connected = () => {};
        this.rendered = true;
        this.setMinMax();
    }

    renderYearNav() {
        this.leftNav = dom('button', {
            class: 'left-nav nav',
            html: dom('ui-icon', { type: 'angleLeft' }),
        });
        this.rightNav = dom('button', {
            class: 'right-nav nav',
            html: dom('ui-icon', { type: 'angleRight' }),
        });
        this.yearLabel = dom('span', { class: 'year-label', html: this.getYear() });

        dom('div', { class: 'month-picker-header', html: [this.leftNav, this.yearLabel, this.rightNav] }, this);
        dom('hr', {}, this);
    }

    render() {
        if (this['use-select']) {
            this.yearsDrop = dom('ui-dropdown', { data: this.getYearsData(), 'event-name': 'drop-change' }, this);
        } else {
            this.renderYearNav();
        }
        const year = this.getYear();
        const month = this.getMonth();

        this.buttonDates = [];
        this.buttons = [];
        loop(12, (i) => {
            const value = i + 1;
            const sel = value === month ? ' selected' : '';
            const cls = `list-btn${sel}`;
            this.buttons.push(dom('button', { class: cls, html: `${pad(value)}/${year}`, value }));
            this.buttonDates.push([value, year]);
        });

        this.list = dom('div', { class: 'list', html: this.buttons }, this);

        this.lastYear = year;

        this.connect();
    }

    connect() {
        this.on(this.list, 'click', (e) => {
            this.setValue(parseInt(e.target.value, 10), this.getYear());
            this.emitEvent();
        });

        if (this.yearsDrop) {
            this.on(this.yearsDrop, 'drop-change', (e) => {
                this.setValue(this.getMonth(), parseInt(e.detail.value, 10));
                this.emitEvent();
            });
        } else {
            this.on(this.leftNav, 'click', () => {
                this.setValue(this.getMonth(), this.getYear() - 1);
                this.setMinMax();
                this.emitEvent();
            });
            this.on(this.rightNav, 'click', () => {
                this.setValue(this.getMonth(), this.getYear() + 1);
                this.setMinMax();
                this.emitEvent();
            });
        }
    }
}

const inRange = (value, low, high) => {
    return !isLessThan(value, low) && !isGreaterThan(value, high);
};

const isLessThan = (d1, d2) => {
    if (!d1 || !d2) {
        return false;
    }
    if (d1[1] === d2[1]) {
        return d1[0] < d2[0];
    }
    return d1[1] < d1[1];
};

const isGreaterThan = (d1, d2) => {
    if (!d1 || !d2) {
        return false;
    }
    if (d1[1] === d2[1]) {
        return d1[0] > d2[0];
    }
    return d1[1] > d1[1];
};

const getMonthYear = (value) => {
    if (!value) {
        return [];
    }
    if (dates.isDate(value)) {
        const d = dates.toDate(value);
        return [d.getMonth() + 1, d.getFullYear()];
    }
    return [parseInt(value.split('/')[0], 10), parseInt(value.split('/')[1], 10)];
};
const d = new Date();
const defaultValue = `${d.getMonth() + 1}/${d.getFullYear()}`;

module.exports = BaseComponent.define('ui-month-picker', UiMonthPicker, {
    props: ['align', 'data', 'years-prev', 'years-next', 'use-select', 'event-name', 'min', 'max'],
    bools: [],
    attrs: ['value'],
});
