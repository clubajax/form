(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
window.dom = require('@clubajax/dom');
window.on = require('@clubajax/on');
window.nodash = require('@clubajax/no-dash');
const BaseComponent = require('@clubajax/base-component');
BaseComponent.destroyOnDisconnect = true;

require('../index');

},{"../index":2,"@clubajax/base-component":"@clubajax/base-component","@clubajax/dom":"@clubajax/dom","@clubajax/no-dash":"@clubajax/no-dash","@clubajax/on":"@clubajax/on"}],2:[function(require,module,exports){
require('./src/ui-input');
// require('./src/ui-checkbox');
// require('./src/ui-radio');
// require('./src/ui-radio-buttons');
require('./src/ui-list');
require('./src/ui-popup');
require('./src/ui-dropdown');
require('./src/ui-search');
require('./src/ui-tooltip');
// require('./src/ui-paginator');

require('./src/date-picker/date-picker');
require('./src/date-picker/date-input');
// require('./src/date-picker/time-input');
// require('./src/date-picker/date-range-picker');
// require('./src/date-picker/date-range-input');
// require('./src/date-picker/date-range-inputs');
// require('./src/date-picker/date-time-input');
},{"./src/date-picker/date-input":3,"./src/date-picker/date-picker":4,"./src/ui-dropdown":13,"./src/ui-input":15,"./src/ui-list":16,"./src/ui-popup":17,"./src/ui-search":18,"./src/ui-tooltip":19}],3:[function(require,module,exports){
require('./date-picker');
const BaseComponent = require('@clubajax/base-component');
const dom = require('@clubajax/dom');
const dates = require('@clubajax/dates');
const util = require('./util');
const onKey = require('./onKey');
const isValid = require('./isValid');
// const focusManager = require('./focusManager');
const uid = require('../lib/uid');
require('./icon-calendar');
require('../ui-popup');

const defaultPlaceholder = 'MM/DD/YYYY';
const defaultMask = 'XX/XX/XXXX';

const FLASH_TIME = 1000;

// BIG TODO:
// create a separate DIST for calendar
//
// TODO: 
//      disabled, read only
//      clean up unused properties
//      now for value (not just min & max)
// change 'static' property name
// mask throws errors
// min disables wrong dates: 
//  value="02/24/2020"
//  min="02/04/2020"
//  max="03/17/2020"


class DateInput extends BaseComponent {
    // static;
    labelNode;
    errorNode;
    input;
    hasTime;
    name;
    label;
    placeholder;

	constructor () {
		super();
		this.dateType = 'date';
        this.showing = false;
        this.fireOwnDomready = true;
	}

	attributeChanged (name, value) {
		// need to manage value manually
        if (name === 'value') {
            console.log('SET VALUE');
			this.value = value;
		}
	}

	set value (value) {
		if (value === this.strDate) {
			return;
		}
		const isInit = !this.strDate;
		value = dates.padded(value);

		this.strDate = dates.isValid(value) ? value : '';
		this.onDomReady(() => {
			this.setValue(this.strDate, isInit);
		});
	}

	get value () {
		return this.strDate;
	}

	get valid () {
		return this.isValid();
	}

	onLabel (value) {
		this.labelNode.innerHTML = value;
	}

    onMin(value) {
        this.onDomReady(() => {
            this.minDate = util.getMinDate(value === 'now' ? new Date() : dates.toDate(value));
            this.picker.min = value;
        });
	}

    onMax(value) {
        this.onDomReady(() => {
            this.maxDate = util.getMaxDate(value === 'now' ? new Date() : dates.toDate(value));
            this.picker.max = value;
        });
    }
    
    onValidation (e) {
        this.errorNode.innerHTML = e.detail.message || '';
    }

    get templateString() {
        this.buttonId = uid('button'); 
		return `
<label>
	<span ref="labelNode"></span>
	<div class="date-input-wrapper">
		<input ref="input" class="empty" />
        <button class="icon-button" id=${this.buttonId} ref="icon" aria-expanded="false" aria-label="Date Picker">
            <icon-calendar aria-hidden="true" />
        </button>
    </div>
    <div class="input-error" ref="errorNode"></div>
</label>`;
	}

	setValue (value, silent) {
		if (value === this.typedValue) {
			return;
		}
		if (this.dateType === 'datetime' && value.length === 10 && this.typedValue.length > 16) { // 19 total
			value = util.mergeTime(value, this.typedValue);
		}
		value = this.format(value);
		this.typedValue = value;
		this.input.value = value;
        const valid = this.validate();
		if (valid) {
			this.strDate = value;
			this.picker.value = value;
			if (!silent) {
				this.emitEvent();
			}
		}

		if (!silent && valid) {
			setTimeout(this.hide.bind(this), 300);
		}
		return value;
	}

	emitEvent () {
		const value = this.value;
		if (value === this.lastValue || !this.isValid(value)) {
			return;
		}
		this.lastValue = value;
		this.emit('change', { value });
	}

	format (value) {
		return  util.formatDate(value, this.mask);
	}

	isValid (value = this.input.value) {
		return isValid.call(this, value, this.dateType);
	}

	validate () {
		if (this.isValid()) {
			this.classList.remove('invalid');
			return true;
		}
		this.classList.add('invalid');
		return false;
	}

	flash (addFocus) {
		this.classList.add('warning');
		setTimeout(() => {
			this.classList.remove('warning');
		}, FLASH_TIME);

		if(addFocus){
			this.focus();
		}
	}

	show () {
		if (this.showing) {
			return;
        }
        this.popup.show();
		this.showing = true;
		this.picker.onShow();
        this.picker.classList.add('show');
        this.picker.focus();
	}

	hide () {
        if (this.static || !this.showing || window.keepPopupsOpen) {
			return;
        }
        this.popup.hide();
		this.showing = false;
		// dom.classList.remove(this.picker, 'right-align bottom-align show');
		// dom.classList.toggle(this, 'invalid', !this.isValid());
		this.picker.onHide();
	}

	focus () {
		this.onDomReady(() => {
			this.input.focus();
		});
	}

	blur () {
		if (this.input) {
			this.input.blur();
		}
	}

	onBlur () {
		const valid = this.validate();
		if (valid) {
			this.emitEvent();
		} else {
			this.reset();
		}
	}

	reset () {
		this.typedValue = '';
		this.setValue(this.strDate || '', true);
	}

    domReady() {
		this.time = this.time || this.hasTime;
		this.mask = this.mask || defaultMask;
		this.input.setAttribute('type', 'text');
		this.input.setAttribute('placeholder', this.placeholder || defaultPlaceholder);
		if (this.name) {
			this.input.setAttribute('name', this.name);
		}
		if (this.label) {
			this.labelNode.innerHTML = this.label;
		}
		this.connectKeys();

        this.popup = dom('ui-popup', {buttonid: this.buttonId, class: 'ui-date-input'}, document.body);
        this.picker = dom('date-picker', {time: this.time, tabindex: '0', 'event-name': 'date-change'}, this.popup);
        
        this.picker.onDomReady(() => {
			this.picker.on('date-change', (e) => {
                this.setValue(e.detail.value, e.detail.silent);
                this.hide();
            });
            this.popup.on('popup-open', () => {
                this.show();
            });
        });
        
        window.onDomReady([this.picker, this.popup], () => {
            if (this.static) {
                this.show();
            }
            this.fire('domready');
        })
	}

	connectKeys () {
		this.on(this.input, 'keypress', util.stopEvent);
		this.on(this.input, 'keyup', (e) => {
			onKey.call(this, e, this.dateType);
		});
        this.on(this.input, 'blur', this.onBlur.bind(this));
        this.on(this, 'validation', this.onValidation.bind(this));
	}

	destroy () {
		if (this.focusHandle) {
			this.focusHandle.remove();
		}
	}
}

module.exports = BaseComponent.define('date-input', DateInput, {
	bools: ['required', 'time', 'static'],
	props: ['label', 'name', 'placeholder', 'mask', 'min', 'max', 'time', 'validation'],
	attrs: ['value']
});

},{"../lib/uid":12,"../ui-popup":17,"./date-picker":4,"./icon-calendar":5,"./isValid":6,"./onKey":7,"./util":9,"@clubajax/base-component":"@clubajax/base-component","@clubajax/dates":"@clubajax/dates","@clubajax/dom":"@clubajax/dom"}],4:[function(require,module,exports){
const BaseComponent = require('@clubajax/base-component');
const dates = require('@clubajax/dates');
const dom = require('@clubajax/dom');
const util = require('./util');
const isValid = require('./isValid');
require('./time-input');

// ref:
// https://axesslab.com/accessible-datepickers/
// http://whatsock.com/tsg/Coding%20Arena/ARIA%20Date%20Pickers/ARIA%20Date%20Picker%20(Basic)/demo.htm

const EVENT_NAME = 'change';

class DatePicker extends BaseComponent {

    container;
    time;
    monthNode;
    footerLink;
    calFooter;
    lftMoNode;
    rgtMoNode;
    lftYrNode;
    rgtYrNode;
    get templateString() {
        return `
<div class="calendar" ref="calNode">
<div class="cal-header" ref="headerNode">
	<button class="cal-yr-lft" ref="lftYrNode" tabindex="0" aria-label="Previous Year"></button>
	<button class="cal-lft" ref="lftMoNode" tabindex="0" aria-label="Previous Month"></button>
	<label class="cal-month" ref="monthNode"></label>	
	<button class="cal-rgt" ref="rgtMoNode" tabindex="0"  aria-label="Next Month"></button>
	<button class="cal-yr-rgt" ref="rgtYrNode" tabindex="0" aria-label="Next Year"></button>
</div>
<div class="cal-container" ref="container"></div>
<div class="cal-footer" ref="calFooter">
	<button ref="footerLink" class="today-button" aria-label="Set Date to Today"></button>
</div>
</div>
<input class="focus-loop" aria-hidden="true"/>
`;
    }

    set value(value) {
        this.setValue(dates.isDate(value) ? dates.toDate(value) : today);
    }

    get value() {
        if (!this.valueDate) {
            const value = this.getAttribute('value') || today;
            this.valueDate = dates.toDate(value);
        }
        return this.valueDate;
    }

    onMin(value) {
        this.onDomReady(() => {
            this.minDate = util.getMinDate(value);
            this.minDate.setDate(this.minDate.getDate() - 1);
            if (this.timeInput) {
                this.timeInput.min = value;
            }
            this.render();
        });
        
    }

    onMax(value) {
        this.onDomReady(() => {
            this.maxDate = util.getMaxDate(value);
            if (this.timeInput) {
                this.timeInput.max = value;
            }
            this.render();
        });
    }

    constructor() {
        super();
        this.dateType = 'date';
        this.current = new Date();
        this.previous = {};
    }

    setDisplay(...args) {
        // used by date-range-picker
        if (args.length === 2) {
            this.current.setFullYear(args[0]);
            this.current.setMonth(args[1]);
        } else if (typeof args[0] === 'object') {
            this.current.setFullYear(args[0].getFullYear());
            this.current.setMonth(args[0].getMonth());
        } else if (args[0] > 12) {
            this.current.setFullYear(args[0]);
        } else {
            this.current.setMonth(args[0]);
        }
        this.valueDate = dates.copy(this.current);
        this.noEvents = true;
        this.render();
    }

    getFormattedValue() {
        let str = this.valueDate === today ? '' : !!this.valueDate ? dates.format(this.valueDate) : '';
        if (this.time) {
            str += ` ${this.timeInput.value}`;
        }
        return str;
    }

    setAriaLabel() {
        const ariaLabel = this.valueDate ?
            this.timeInput ?
                util.toDateTimeAriaLabel(this.valueDate) :
                util.toDateAriaLabel(this.valueDate) :
            'not set';
        this.setAttribute('aria-label', `Date Picker, current date: ${ariaLabel}`);
    }

    setAriaMonthYearAlert(enabled) {
        if (enabled) {
            this.monthNode.setAttribute('role', 'alert');
        } else {
            this.monthNode.removeAttribute('role', 'alert');
        }
    }

    emitEvent(silent) {
        const date = this.valueDate;
        if (this.time) {
            if (!this.timeInput.valid) {
                this.timeInput.validate();
                return;
            }
            util.addTimeToDate(this.timeInput.value, date);
        }
        const event = {
            value: this.getFormattedValue(),
            silent,
            date
        };
        if (this['range-picker']) {
            event.first = this.firstRange;
            event.second = this.secondRange;
        }
        this[this.emitType](this.eventName, event, true);

        this.setAriaLabel();
    }

    emitDisplayEvents() {
        const month = this.current.getMonth(),
            year = this.current.getFullYear();

        if (!this.noEvents && (month !== this.previous.month || year !== this.previous.year)) {
            this.fire('display-change', {month: month, year: year});
        }

        this.noEvents = false;
        this.previous = {
            month: month,
            year: year
        };
    }

    onHide() {
        // not an attribute; called by owner
    }

    onShow() {
        this.current = dates.copy(this.valueDate);
        this.render();
        setTimeout(this.focus.bind(this), 100);
    }

    setValue(valueObject) {
        this.hasTime = !!this.timeInput;
        const strDate = dates.format(valueObject, this.timeInput ? 'MM/dd/yyyy h:m a' : 'MM/dd/yyyy');
        if (isValid.call(this, strDate, this.dateType)) {
            this.valueDate = valueObject;
            this.current = dates.copy(this.valueDate);
            this.onDomReady(() => {
                this.render();
                this.setAriaLabel();
            });
        }
    }

    onClickDay(node, silent) {
        const
            day = +node.textContent,
            isFuture = node.classList.contains('future'),
            isPast = node.classList.contains('past'),
            isDisabled = node.classList.contains('disabled');

        if (isDisabled) {
            if (this.focusNode) {
                this.focusNode.focus();
            }
            return;
        }

        this.current.setDate(day);
        if (isFuture) {
            this.current.setMonth(this.current.getMonth() + 1);
        }
        if (isPast) {
            this.current.setMonth(this.current.getMonth() - 1);
        }

        this.valueDate = dates.copy(this.current);

        if (this.timeInput) {
            this.timeInput.setDate(this.valueDate);
        }

        this.emitEvent(silent);

        if (this['range-picker']) {
            this.clickSelectRange();
        }

        if (isFuture || isPast) {
            this.render();
        } else {
            this.selectDay();
        }
    }

    selectDay() {
        if (this['range-picker']) {
            return;
        }
        const now = this.querySelector('.selected');
        const node = this.dayMap[this.current.getDate()];
        if (now) {
            now.classList.remove('selected');
        }
        node.classList.add('selected');
    }

    focusDay() {
        const node = this.container.querySelector('div.highlighted[tabindex="0"]') ||
            this.container.querySelector('div.selected[tabindex="0"]');
        if (node) {
            node.focus();
        }
    }

    highlightDay(date) {
        let node;
        if (this.isValidDate(date)) {
            node = this.container.querySelector('div[tabindex="0"]');
            if (node) {
                node.setAttribute('tabindex', '-1');
            }

            const shouldRerender = date.getMonth() !== this.current || date.getFullYear() !== this.current.getFullYear();

            this.current = date;
            if (shouldRerender) {
                this.render();
            } else {
                const dateSelector = util.toAriaLabel(this.current);
                node = this.container.querySelector(`div[aria-label="${dateSelector}"]`);
                node.setAttribute('tabindex', '0');
            }
            this.focusDay();
        }
    }

    isValidDate(date) {
        // used by arrow keys
        date = dates.zeroTime(date);
        if (this.minDate) {
            if (dates.is(date).less(this.minDate)) {
                return false;
            }
        }
        if (this.maxDate) {
            if (dates.is(date).greater(this.maxDate)) {
                return false;
            }
        }
        return true;
    }

    onClickMonth(direction) {
        this.current.setMonth(this.current.getMonth() + direction);
        this.render();
    }

    onClickYear(direction) {
        this.current.setFullYear(this.current.getFullYear() + direction);
        this.render();
    }

    clearRange() {
        this.hoverDate = 0;
        this.setRange(null, null);
    }

    setRange(firstRange, secondRange) {
        this.firstRange = firstRange;
        this.secondRange = secondRange;
        this.displayRange();
        this.setRangeEndPoints();
    }

    clickSelectRange() {
        const
            prevFirst = !!this.firstRange,
            prevSecond = !!this.secondRange,
            rangeDate = dates.copy(this.current);

        if (this.isOwned) {
            this.fire('select-range', {
                first: this.firstRange,
                second: this.secondRange,
                current: rangeDate
            });
            return;
        }
        if (this.secondRange) {
            this.fire('reset-range');
            this.firstRange = null;
            this.secondRange = null;
        }
        if (this.firstRange && this.isValidRange(rangeDate)) {
            this.secondRange = rangeDate;
            this.hoverDate = 0;
            this.setRange(this.firstRange, this.secondRange);
        } else {
            this.firstRange = null;
        }
        if (!this.firstRange) {
            this.hoverDate = 0;
            this.setRange(rangeDate, null);
        }
        this.fire('select-range', {
            first: this.firstRange,
            second: this.secondRange,
            prevFirst: prevFirst,
            prevSecond: prevSecond
        });
    }

    hoverSelectRange(e) {
        if (this.firstRange && !this.secondRange && e.target.classList.contains('on')) {
            this.hoverDate = e.target._date;
            this.displayRange();
        }
    }

    displayRangeToEnd() {
        if (this.firstRange) {
            this.hoverDate = dates.copy(this.current);
            this.hoverDate.setMonth(this.hoverDate.getMonth() + 1);
            this.displayRange();
        }
    }

    displayRange() {
        let beg = this.firstRange;
        let end = this.secondRange ? this.secondRange.getTime() : this.hoverDate;
        const map = this.dayMap;
        if (!beg || !end) {
            Object.keys(map).forEach(function (key, i) {
                map[key].classList.remove('range');
            });
        } else {
            beg = beg.getTime();
            Object.keys(map).forEach(function (key, i) {
                if (inRange(map[key]._date, beg, end)) {
                    map[key].classList.add('range');
                } else {
                    map[key].classList.remove('range');
                }
            });
        }
    }

    hasRange() {
        return !!this.firstRange && !!this.secondRange;
    }

    isValidRange(date) {
        if (!this.firstRange) {
            return true;
        }
        return date.getTime() > this.firstRange.getTime();
    }

    setRangeEndPoints() {
        this.clearEndPoints();
        if (this.firstRange) {
            if (this.firstRange.getMonth() === this.current.getMonth()) {
                this.dayMap[this.firstRange.getDate()].classList.add('range-first');
            }
            if (this.secondRange && this.secondRange.getMonth() === this.current.getMonth()) {
                this.dayMap[this.secondRange.getDate()].classList.add('range-second');
            }
        }
    }

    clearEndPoints() {
        const first = this.querySelector('.range-first'),
            second = this.querySelector('.range-second');
        if (first) {
            first.classList.remove('range-first');
        }
        if (second) {
            second.classList.remove('range-second');
        }
    }

    domReady() {
        this.eventName = this['event-name'] || EVENT_NAME;
        this.emitType = this.eventName === EVENT_NAME ? 'emit' : 'fire';
        this.setAttribute('tabindex', '0');

        if (this['range-left']) {
            this.classList.add('left-range');
            this['range-picker'] = true;
            this.isOwned = true;
        }
        if (this['range-right']) {
            this.classList.add('right-range');
            this['range-picker'] = true;
            this.isOwned = true;
        }
        if (this.isOwned) {
            this.classList.add('minimal');
        }
        this.current = dates.copy(this.value);
        this.render();
        this.connect();
        this.setAriaLabel();
    }

    render() {

        const focused = getFocusedDay();
        // dateNum increments, starting with the first Sunday
        // showing on the monthly calendar. This is usually the
        // previous month, so dateNum will start as a negative number
        destroy(this.bodyNode);

        this.dayMap = {};

        let
            node = dom('div', {class: 'cal-body'}),
            i, tx, isThisMonth, day, css, isSelected, isToday, hasSelected, defaultDateSelector, minmax, isHighlighted,
            nextMonth = 0,
            isRange = this['range-picker'],
            d = this.current,
            incDate = dates.copy(d),
            daysInPrevMonth = dates.getDaysInPrevMonth(d),
            daysInMonth = dates.getDaysInMonth(d),
            dateNum = dates.getFirstSunday(d),
            dateToday = getSelectedDate(today, d),
            dateSelected = getSelectedDate(this.valueDate, d),
            highlighted = d.getDate(),
            dateObj = dates.add(new Date(d.getFullYear(), d.getMonth(), 1), dateNum);

        this.monthNode.innerHTML = dates.getMonthName(d) + ' ' + d.getFullYear();

        for (i = 0; i < 7; i++) {
            dom("div", {html: dates.days.abbr[i], class: 'day-of-week'}, node);
        }

        for (i = 0; i < 42; i++) {

            minmax = dates.isLess(dateObj, this.minDate) || dates.isGreater(dateObj, this.maxDate);

            tx = dateNum + 1 > 0 && dateNum + 1 <= daysInMonth ? dateNum + 1 : "&nbsp;";

            isThisMonth = false;
            isSelected = false;
            isHighlighted = false;
            isToday = false;

            if (dateNum + 1 > 0 && dateNum + 1 <= daysInMonth) {
                // current month
                tx = dateNum + 1;
                isThisMonth = true;
                css = 'day on';
                if (dateToday === tx) {
                    isToday = true;
                    css += ' today';
                }
                if (dateSelected === tx && !isRange) {
                    isSelected = true;
                    hasSelected = true;
                    css += ' selected';
                } else if (tx === highlighted) {
                    css += ' highlighted';
                    isHighlighted = true;
                }

                // if (tx === defaultDate) {
                // 	defaultDateSelector = util.toAriaLabel(dateObj);
                // }
            } else if (dateNum < 0) {
                // previous month
                tx = daysInPrevMonth + dateNum + 1;
                css = 'day off past';
            } else {
                // next month
                tx = ++nextMonth;
                css = 'day off future';
            }

            if (minmax) {
                css = 'day disabled';
                if (isSelected) {
                    css += ' selected';
                }
                if (isToday) {
                    css += ' today';
                }
            }

            const ariaLabel = util.toDateAriaLabel(dateObj);
            day = dom("div", {
                html: dom('span', {html: tx, 'data-no-clickoff': true}),
                class: css,
                'aria-label': ariaLabel,
                tabindex: isSelected || isHighlighted ? 0 : -1
            }, node);

            dateNum++;
            dateObj.setDate(dateObj.getDate() + 1);
            if (isThisMonth) {
                // Keep a map of all the days
                // use it for adding and removing selection/hover classes
                incDate.setDate(tx);
                day._date = incDate.getTime();
                this.dayMap[tx] = day;
            }
        }

        this.container.appendChild(node);
        this.bodyNode = node;
        this.setFooter();
        this.displayRange();
        this.setRangeEndPoints();

        this.emitDisplayEvents();

        if (this.timeInput) {
            this.timeInput.setDate(this.current);
        }

        if (focused) {
            this.focusNode = dom.query(this.bodyNode, `[aria-label="${focused}"]`);
            if (this.focusNode) {
                this.focusNode.focus();
            }
        }
    }

    setFooter() {
        if (this.timeInput) {
            if (this.current) {
                this.timeInput.value = this.valueDate;
            }
            return;
        }
        if (this.time) {
            this.timeInput = dom('time-input', {
                label: 'Time:',
                required: true,
                value: this.value,
                min: this.minDate,
                max: this.maxDate,
                'event-name': 'time-change'
            }, this.calFooter);
            this.timeInput.setDate(this.current);
            this.timeInput.on('time-change', (e) => {
                this.emitEvent(e.detail.silent);
            });
            destroy(this.footerLink);
        } else {
            const d = new Date();
            this.footerLink.innerHTML = dates.format(d, 'E MMMM dd, yyyy');
        }
    }

    connect() {
        this.on(this.container, 'click', (e) => {
            this.fire('pre-click', e, true);
            const node = e.target.closest('.day');
            if (node) {
                this.onClickDay(node);
            }
        });

        this.on(this.container, 'keydown', (e) => {
            let num;
            switch (e.key) {
                case 'ArrowLeft':
                    num = -1;
                    break;
                case 'ArrowRight':
                    num = 1;
                    break;
                case 'ArrowUp':
                    num = -7;
                    break;
                case 'ArrowDown':
                    num = 7;
                    break;
                case 'Enter':
                    this.onClickDay(e.target);
                    break;
                case ' ':
                    this.onClickDay(e.target, true);
                    this.focusDay();
                    return util.stopEvent(e);
            }

            if (num) {
                this.highlightDay(dates.add(this.current, num));
                e.preventDefault();
                e.stopImmediatePropagation();
                return false;
            }
        });

        this.on(document, 'keydown', (e) => {
            if (e.key === ' ' && isControl(e.target, this)) {
                this.emit(e.target, 'click');
                return util.stopEvent(e);
            }
        });

        this.on(this.lftMoNode, 'click', () => {
            this.onClickMonth(-1);
        });

        this.on(this.rgtMoNode, 'click', () => {
            this.onClickMonth(1);
        });

        this.on(this.lftYrNode, 'click', () => {
            this.onClickYear(-1);
        });

        this.on(this.rgtYrNode, 'click', () => {
            this.onClickYear(1);
        });

        this.on(this.footerLink, 'click', () => {
            this.setValue(new Date());
            this.emitEvent();
        });

        [this.lftMoNode, this.rgtMoNode, this.lftYrNode, this.rgtYrNode].forEach((node) => {
            this.on(node, 'blur', () => {
                this.setAriaMonthYearAlert(false);
            });
            this.on(node, 'focus', () => {
                setTimeout(() => {
                    this.setAriaMonthYearAlert(true);
                }, 30);
            });
        });

        if (this['range-picker']) {
            this.on(this.container, 'mouseover', this.hoverSelectRange.bind(this));
        }
    }
}

const today = new Date();

function isControl(node, picker) {
    return node === picker.lftMoNode || node === picker.rgtMoNode || node === picker.lftYrNode || node === picker.rgtYrNode || node === picker.footerLink;
}

function getSelectedDate(date, current) {
    if (date.getMonth() === current.getMonth() && date.getFullYear() === current.getFullYear()) {
        return date.getDate();
    }
    return -999; // index must be out of range, and -1 is the last day of the previous month
}

function destroy(node) {
    if (node) {
        dom.destroy(node);
    }
}

function inRange(dateTime, begTime, endTime) {
    return dateTime >= begTime && dateTime <= endTime;
}

function getFocusedDay() {
    const node = document.activeElement;
    if (!node || !dom.classList.contains(node, 'day')) {
        return null;
    }
    return node.getAttribute('aria-label');
}

// range-left/range-right mean that this is one side of a date-range-picker
module.exports = BaseComponent.define('date-picker', DatePicker, {
    bools: ['range-picker', 'range-left', 'range-right', 'time'],
    props: ['min', 'max', 'event-name']
});

},{"./isValid":6,"./time-input":8,"./util":9,"@clubajax/base-component":"@clubajax/base-component","@clubajax/dates":"@clubajax/dates","@clubajax/dom":"@clubajax/dom"}],5:[function(require,module,exports){
const BaseComponent = require('@clubajax/base-component');

class Icon extends BaseComponent {
	get templateString () {
		return `
<?xml version="1.0" ?>
<svg viewBox="0 0 12 13" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
    <defs></defs>
    <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
        <g id="mvp-projectdb-web" transform="translate(-544.000000, -84.000000)" fill="#0A0B09">
            <g id="Header" transform="translate(0.000000, 70.000000)">
                <g id="Calender-&amp;-Date" transform="translate(544.000000, 14.000000)">
                    <g id="fa-calendar">
                        <path d="M0.284719899,11.8128991 C0.452589453,11.9813033 0.656812922,12.0652381 0.884559514,12.0652381 L10.3162623,12.0652381 C10.5445435,12.0652381 10.7482323,11.9813033 10.9166365,11.8128991 C11.0845061,11.6450296 11.1684408,11.4408061 11.1684408,11.2130595 L11.1684408,2.63300073 C11.1684408,2.40525413 11.0845061,2.20103066 10.9166365,2.03316111 C10.7482323,1.86529156 10.5445435,1.78135678 10.3162623,1.78135678 L9.45232214,1.78135678 L9.45232214,1.13340169 C9.45232214,0.845243441 9.34432963,0.593439111 9.14064078,0.37745408 C8.92465575,0.173230611 8.6723168,0.0652380952 8.38469317,0.0652380952 L7.95272311,0.0652380952 C7.66456486,0.0652380952 7.41276053,0.173230611 7.1967755,0.37745408 C6.99255203,0.593439111 6.88455951,0.845243441 6.88455951,1.13340169 L6.88455951,1.78135678 L4.31679688,1.78135678 L4.31679688,1.13340169 C4.31679688,0.845243441 4.20880437,0.593439111 4.0045809,0.37745408 C3.78859587,0.173230611 3.53679154,0.0652380952 3.24863329,0.0652380952 L2.81666323,0.0652380952 C2.52850498,0.0652380952 2.27670065,0.173230611 2.06071562,0.37745408 C1.85649215,0.593439111 1.74849964,0.845243441 1.74849964,1.13340169 L1.74849964,1.78135678 L0.896855692,1.78135678 C0.656812922,1.78135678 0.452589453,1.86529156 0.284719899,2.03316111 C0.116850346,2.20103066 0.0323809524,2.40525413 0.0323809524,2.63300073 L0.0323809524,11.2130595 C0.0323809524,11.4408061 0.116850346,11.6450296 0.284719899,11.8128991 L0.284719899,11.8128991 Z M0.884559514,9.28095582 L2.81666323,9.28095582 L2.81666323,11.2130595 L0.884559514,11.2130595 L0.884559514,9.28095582 Z M0.884559514,6.70089701 L2.81666323,6.70089701 L2.81666323,8.84898576 L0.884559514,8.84898576 L0.884559514,6.70089701 Z M0.884559514,4.34911941 L2.81666323,4.34911941 L2.81666323,6.26892695 L0.884559514,6.26892695 L0.884559514,4.34911941 Z M2.6006782,1.13340169 C2.6006782,1.07299003 2.62473594,1.02540917 2.66055524,0.977293695 C2.70867071,0.941474396 2.75678619,0.917416657 2.81666323,0.917416657 L3.24863329,0.917416657 C3.30851033,0.917416657 3.35662581,0.941474396 3.40474128,0.977293695 C3.44056058,1.02540917 3.46461832,1.07299003 3.46461832,1.13340169 L3.46461832,3.06497079 C3.46461832,3.12538244 3.44056058,3.1729633 3.40474128,3.22107878 C3.35662581,3.2574327 3.30851033,3.28095582 3.24863329,3.28095582 L2.81666323,3.28095582 C2.75678619,3.28095582 2.70867071,3.2574327 2.66055524,3.22107878 C2.62473594,3.1729633 2.6006782,3.12538244 2.6006782,3.06497079 L2.6006782,1.13340169 L2.6006782,1.13340169 Z M3.24863329,9.28095582 L5.38442586,9.28095582 L5.38442586,11.2130595 L3.24863329,11.2130595 L3.24863329,9.28095582 Z M3.24863329,6.70089701 L5.38442586,6.70089701 L5.38442586,8.84898576 L3.24863329,8.84898576 L3.24863329,6.70089701 Z M3.24863329,4.34911941 L5.38442586,4.34911941 L5.38442586,6.26892695 L3.24863329,6.26892695 L3.24863329,4.34911941 Z M5.81639592,9.28095582 L7.96448467,9.28095582 L7.96448467,11.2130595 L5.81639592,11.2130595 L5.81639592,9.28095582 Z M5.81639592,6.70089701 L7.96448467,6.70089701 L7.96448467,8.84898576 L5.81639592,8.84898576 L5.81639592,6.70089701 Z M5.81639592,4.34911941 L7.96448467,4.34911941 L7.96448467,6.26892695 L5.81639592,6.26892695 L5.81639592,4.34911941 Z M7.73673808,1.13340169 C7.73673808,1.07299003 7.7602612,1.02540917 7.79661511,0.977293695 C7.84473059,0.941474396 7.89231145,0.917416657 7.95272311,0.917416657 L8.38469317,0.917416657 C8.44457021,0.917416657 8.49268568,0.941474396 8.54026654,0.977293695 C8.57662046,1.02540917 8.6006782,1.07299003 8.6006782,1.13340169 L8.6006782,3.06497079 C8.6006782,3.12538244 8.57662046,3.1729633 8.54026654,3.22107878 C8.49268568,3.2574327 8.44457021,3.28095582 8.38469317,3.28095582 L7.95272311,3.28095582 C7.89231145,3.28095582 7.84473059,3.2574327 7.79661511,3.22107878 C7.7602612,3.1729633 7.73673808,3.12538244 7.73673808,3.06497079 L7.73673808,1.13340169 L7.73673808,1.13340169 Z M8.39645473,9.28095582 L10.3162623,9.28095582 L10.3162623,11.2130595 L8.39645473,11.2130595 L8.39645473,9.28095582 Z M8.39645473,6.70089701 L10.3162623,6.70089701 L10.3162623,8.84898576 L8.39645473,8.84898576 L8.39645473,6.70089701 Z M8.39645473,4.34911941 L10.3162623,4.34911941 L10.3162623,6.26892695 L8.39645473,6.26892695 L8.39645473,4.34911941 Z"></path>
                    </g>
                </g>
            </g>
        </g>
    </g>
</svg>

`;
	}
}


customElements.define('icon-calendar', Icon);

module.exports = Icon;

},{"@clubajax/base-component":"@clubajax/base-component"}],6:[function(require,module,exports){
const util = require('./util');
const dates = require('@clubajax/dates');

function isValid (value = this.input.value, type) {
	if (!value && this.required) {
		this.emitError('This field is required');
		return false;
	} else if (!value) {
		return true;
	}

	if (value.length > 19) {
		emitError.call(this, 'Not a valid date and time');
		return false;
	}
	if (type !== 'time' && type !== 'date' && type !== 'datetime') {
		// incomplete string
		emitError.call(this, 'Not a valid date and time');
		return false;
	}

	if (type === 'time' && !util.isTimeValid(value)) {
		emitError.call(this, 'Not a valid time');
		return false;
    }
    
    if (type === 'date' && !util.isDateValid(value)) {
        emitError.call(this, 'Not a valid date');
        return false;
    }

	if (type === 'datetime' && !util.isDateTimeValid(value)) {
		emitError.call(this, 'Not a valid date and time');
		return false;
	}
	let msg;
	const strValue = value;
	value = dates.toDate(value);

	if (this.minDate) {
		if (dates.is(value).less(this.minDate)) {
			emitError.call(this, getMinMsg(this.min));
			return false;
		}
	}

	if (this.maxDate) {
		if (dates.is(value).greater(this.maxDate)) {
			emitError.call(this, getMaxMsg(this.max));
			return false;
		}
	}

	// if (type === 'datetime' && this.minDate && dates.is(value).equalDate(this.minDate)) {
	// 	console.log('CHECK TIME', value, this.minDate);
	// }

	if (/time/.test(type) && !util.isTimeValid(strValue)) {
		return false;
	}

	emitError.call(this, null);

	return true;
}


function getMinMsg (min) {
	return min === 'now' ? 'Value must be in the future' : `Value is less than the minimum, ${min}`
}

function getMaxMsg (max) {
	return max === 'now' ? 'Value must be in the past' : `Value is greater than the maximum, ${max}`
}

function emitError (msg) {
	if (msg === this.validationError) {
		return;
	}
    this.validationError = msg;
	this.fire('validation', { message: msg }, true);
}

module.exports = isValid;

},{"./util":9,"@clubajax/dates":"@clubajax/dates"}],7:[function(require,module,exports){
const util = require('./util');

function onKey (e, type) {
	let str = this.typedValue || '';
	const beg = e.target.selectionStart;
	const end = e.target.selectionEnd;
    const k = e.key;

	if (k === 'Enter') {
		const valid = this.validate();
		if (valid) {
			if (this.hide) {
				this.hide();
			}
			this.emit('change', { value: this.value });
		}
	}

	if (k === 'Escape') {
		this.blur();
    }

    // if (k === 'Backspace') {
    //     // this.blur();
    //     return true;
    // }
    
    

    if (util.isControl(e)) {
		util.stopEvent(e);
		return;
	}

	function setSelection (pos) {
		e.target.selectionEnd = pos;
	}

    if (!util.isNum(k)) {
		let value = this.input.value;

		// handle paste, backspace
		if (type === 'datetime' && k === ' ' && util.charCount(value, ' ') !== 2) {
			// insert missing space
			this.typedValue = '';
			value = value.replace(' ', '');
			this.setValue(`${value.substring(0, 10)} ${value.substring(10, 15)} ${value.substring(15)}`, true);
			setSelection(11);
			util.stopEvent(e);
			return;

		} else if (value !== this.typedValue) {
			// console.log('not typed');
			this.setValue(value, true);
		}

		if (util.isArrowKey[k]) {
			// FIXME: test is not adding picker time
			// 12/12/2017 06:30 am'
			const inc = k === 'ArrowUp' ? 1 : -1;
			if (/time/.test(type)) {
				const HR = type === 'time' ? [0,2] : [11,13];
				const MN = type === 'time' ? [3,5] : [14,16];
				if (end >= HR[0] && end <= HR[1]) {
					this.setValue(util.incHours(value, inc), true);
				} else if (end >= MN[0] && end <= MN[1]) {
					this.setValue(util.incMinutes(value, inc, 15), true);
				} else if (type === 'time' || beg > 16) {
					this.setValue(value.replace(/([ap]m)/i, str => /a/i.test(str) ? 'pm' : 'am' ), true);
				}
			}

			if (/date/.test(type)) {
				if (end <= 2 ) {
					this.setValue(util.incMonth(value, inc), true);
				} else if (end < 5) {
					this.setValue(util.incDate(value, inc), true);
				} else if (end < 11) {
					this.setValue(util.incYear(value, inc), true);
				}
			}

		} else if (/[ap]/i.test(k) && /time/.test(type)) {
			this.setValue(this.setAMPM(value, k === 'a' ? 'am' : 'pm'), true);
		} else {
			//console.log('CHAR IS', k);
		}

		setSelection(beg);
		util.stopEvent(e);
		return;
	}

    if (str.length !== end && beg === end) {
		// handle selection or middle-string edit
		let temp = this.typedValue.substring(0, beg) + k + this.typedValue.substring(end + 1);
		const nextCharPos = util.nextNumPos(beg + 1, temp);
		const value = this.setValue(temp, true);
		const nextChar = str.charAt(beg + 1);

		setSelection(/[\s\/:]/.test(nextChar) ? beg + 2 : beg + 1);
		util.stopEvent(e);
		return;

    } else if (end !== beg) {
		// selection replace
		let temp = util.replaceText(this.typedValue, k, beg, end, 'X');
		const value = this.setValue(temp, true);

		setSelection(beg + 1);
		util.stopEvent(e);
		return;
	}


	this.setValue(str + k, true);
}

module.exports = onKey;

},{"./util":9}],8:[function(require,module,exports){
const BaseComponent = require('@clubajax/base-component');
const dom = require('@clubajax/dom');
const on = require('@clubajax/on');
const dates = require('@clubajax/dates');
const util = require('./util');
const onKey = require('./onKey');
const isValid = require('./isValid');

const defaultPlaceholder = 'HH:MM am/pm';
const defaultMask = 'XX:XX';
const EVENT_NAME = 'change';


class TimeInput extends BaseComponent {

	attributeChanged (name, value) {
		// need to manage value manually
		if (name === 'value') {
			this.value = value;
		}
	}

	set value (value) {
		if (dates.isValidObject(value)) {
			// this.orgDate = value;
			// this.setDate(value);
			value = dates.format(value, 'h:m a');
			this.setAMPM(value);
		}
		this.strDate = util.stripDate(value);
		onDomReady(this, () => {
			this.setValue(this.strDate);
		});
	}

	get value () {
		return this.strDate;
	}

	get valid () {
		return this.isValid();
	}

	onLabel (value) {
		this.labelNode.innerHTML = value;
	}

	onMin (value) {
		// this.minTime = dates.format(util.getMinTime(value), 'h:m a');
		this.minDate = util.getMinDate(value);
		this.validate();
	}

	onMax (value) {
		// this.maxTime = dates.format(util.getMaxTime(value), 'h:m a');
		this.maxDate = util.getMaxDate(value);
		this.validate();
	}

	get templateString () {
		return `
<label>
	<span ref="labelNode"></span>
	<input ref="input" class="empty" />
</label>`;
	}

	constructor () {
		super();
		this.dateType = 'time';
		this.typedValue = '';
	}

    setValue(value, silent, ampm) {
		let valid = this.validate(value);
		const isReady = /[ap]m/i.test(value) || value.replace(/(?!X)\D/g, '').length >= 4;
		if (isReady) {
			this.setAMPM(value, getAMPM(value, ampm));
			value = util.formatTime(value);
			if (value.length === 5) {
				value = this.setAMPM(value);
			}
		}

		this.typedValue = value;
		this.input.value = value;
		valid = this.validate();

		if (valid) {
			this.strDate = value;
			if (!silent) {
				this.emitEvent();
			}
		}
		return value;
	}

	setDate (value) {
		// sets the current date, but not the time
		// used when inside a date picker for min/max
		this.date = value;
		this.validate();
	}

	isValid (value = this.input.value) {
		if (this.date) {
			if (/X/.test(value)) {
				return false;
			}
			value = dates.format(util.addTimeToDate(value, this.date), 'MM/dd/yyyy h:m a');
		}
		return isValid.call(this, value, this.dateType);
	}

	validate () {
		if (this.isValid()) {
			this.classList.remove('invalid');
			this.emitError(null);
			return true;
		}
		this.classList.add('invalid');
		return false;
	}

	onChange (e) {
		if (this.date && this.isValid(e.target.value)) {
			this.setValue(e.target.value, true);
			this.emitEvent(true);
		}
	}

	setAMPM (value, ampm) {
		let isAM;
		if (ampm) {
			isAM = /a/i.test(ampm);
		} else if (/[ap]/.test(value)) {
			isAM = /a/i.test(value);
		} else {
			isAM = this.isAM;
		}
		value = value.replace(/\s*[ap]m/i, '') + (isAM ? ' am' : ' pm');
		this.isAM = isAM;
		this.isPM = !isAM;
		return value;
	}

	focus () {
		this.onDomReady(() => {
			this.input.focus();
		});
	}

	blur () {
		this.onDomReady(() => {
			this.input.blur();
			this.validate();
			this.emitEvent();
		})
	}

	domReady () {
		this.mask = this.mask || defaultMask;
		this.maskLength = this.mask.match(/X/g).join('').length;
		this.input.setAttribute('type', 'text');
		this.input.setAttribute('placeholder', this.placeholder || defaultPlaceholder);
		if (this.name) {
			this.input.setAttribute('name', this.name);
		}
		if (this.label) {
			this.labelNode.innerHTML = this.label;
		}
		this.eventName = this['event-name'] || EVENT_NAME;
		this.emitType = this.eventName === EVENT_NAME ? 'emit' : 'fire';
		this.connectKeys();
	}

	emitEvent (silent) {
		const value = this.value;
		if (value === this.lastValue || !this.isValid(value)) {
			return;
		}
		this.lastValue = value;
		this[this.emitType](this.eventName, { value, silent }, true);
	}

	emitError (msg) {
		if (msg === this.validationError) {
			return;
		}
		this.validationError = msg;
		this.fire('validation', { message: msg }, true);
	}

	connectKeys () {
		this.on(this.input, 'keypress', util.stopEvent);
		this.on(this.input, 'keyup', (e) => {
			onKey.call(this, e, this.dateType);
			this.onChange(e);
		});
        this.on(this.input, 'blur', () => this.blur.bind(this));
		this.on(this.input, 'input', (e) => this.onChange.bind(this));
	}
}

function getAMPM (value, ampm) {
	if (ampm) {
		return ampm;
	}
	if (/a/i.test(value)) {
		return 'am';
	}
	if (/p/i.test(value)) {
		return 'pm';
	}
	return '';
}

module.exports = BaseComponent.define('time-input', TimeInput, {
	bools: ['required', 'range-expands'],
	props: ['label', 'name', 'placeholder', 'mask', 'event-name', 'min', 'max'],
	attrs: ['value']
});

},{"./isValid":6,"./onKey":7,"./util":9,"@clubajax/base-component":"@clubajax/base-component","@clubajax/dates":"@clubajax/dates","@clubajax/dom":"@clubajax/dom","@clubajax/on":"@clubajax/on"}],9:[function(require,module,exports){
const dates = require('@clubajax/dates');

function round (n, r, down) {
	return (Math.ceil(n / r) * r) - (down ? r : 0);
}

function incMinutes (value, inc, mult = 1) {

	const type = is(value).type();
	const MN = type === 'time' ? [3,5] : [14,16];

	let mn = parseInt(value.substring(MN[0], MN[1]));
	const org = mn;

	mn = round(mn, mult, inc === -1);

	if (mn === org) {
		mn += (inc * mult);
	}

	if (mn > 59) {
		mn = 0;
	}
	if (mn < 0) {
		mn = 45;
	}

	return `${value.substring(0, MN[0])}${pad(mn)}${value.substring(MN[1])}`;
}

function incHours (value, inc) {
	const type = is(value).type();
	const HR = type === 'time' ? [0,2] : [11,13];
	let hr = parseInt(value.substring(HR[0], HR[1]));
	hr += inc;
	if (hr < 1) {
		hr = 12;
	} else if (hr > 12) {
		hr = 1;
	}
	return `${value.substring(0, HR[0])}${pad(hr)}${value.substring(HR[1])}`;
}

function incMonth (value, inc) {
	let mo = parseInt(value.substring(0,2));
	mo += inc;
	if (mo > 12) {
		mo = 1;
	} else if (mo <= 0) {
		mo = 12;
	}
	return `${pad(mo)}${value.substring(2)}`;
}

function incDate (value, inc) {
	const date = dates.toDate(value);
	const max = dates.getDaysInMonth(date);
	let dt = parseInt(value.substring(3,5));
	dt += inc;
	if (dt <= 0) {
		dt = max;
	} else if (dt > max) {
		dt = 1;
	}
	return `${value.substring(0,2)}${pad(dt)}${value.substring(6)}`;
}

function incYear (value, inc) {
	let yr = parseInt(value.substring(6,10));
	yr += inc;
	return `${value.substring(0,5)}/${pad(yr)} ${value.substring(11)}`;
}

function pad (num) {
	if (num < 10) {
		return '0' + num;
	}
	return '' + num;
}

function toDateTime (value) {
	// FIXME: toTime() or to strTime() or DELETE - only used in util
	if (typeof value === 'object') {
		value = dates.format(value, 'h:m a');
	} else {
		value = stripDate(value);
	}
	const hr = getHours(value);
	const mn = getMinutes(value);
	const sc = getSeconds(value);
	if (isNaN(hr) || isNaN(mn)) {
		throw new Error('Invalid time ' + time);
	}
	const date = new Date();
	date.setHours(hr);
	date.setMinutes(mn);
	date.setSeconds(sc);
	return date;
}

function isTimeValid (value) {
	// 12:34 am
	if (value.length < 8) {
		return false;
	}
	const hr = getHours(value);
	const mn = getMinutes(value);
	if (isNaN(hr) || isNaN(mn)) {
		return false;
	}
	if (!/[ap]m/i.test(value)) {
		return false;
	}
	if (hr < 0 || hr > 12) {
		return false;
	}
	if (mn < 0 || mn > 59) {
		return false;
	}
	return true;
}

function isDateTimeValid (value) {
	// 04/10/2018 19:11 am
	if (value.length !== 19) {
		return false;
	}
	if (charCount(value, ' ') !== 2) {
		return false;
	}
	if (charCount(value, ':') !== 1) {
		return false;
	}
	if (charCount(value, '/') !== 2) {
		return false;
	}
	const date = value.substring(0, 10);
	const time = value.substring(11);
	return dates.is(date).valid() && isTimeValid(time);
}

function isDateValid(value) {
    return dates.isValid(value);
}

function charCount (str, char) {
	str = str.trim();
	let count = 0;
	for (let i = 0; i < str.length; i++) {
		if (str.charAt(i) === char) {
			count++;
		}
	}
	return count;
}

function timeIsInRange (time, min, max, date) {
	if (!min && !max) {
		return true;
	}

	if (date) {
		// first check date range, before time range
		// console.log('date.range', date, '/', min, '/', max);
		return true;
	}


	// console.log('time.range', time, '/', min, '/', max);
	const d = toDateTime(time);
	// isGreater: 1st > 2nd
	if (min && !dates.is(d).greater(toDateTime(min))) {
		return false;
	}
	if (max && !dates.is(d).less(toDateTime(max))) {
		return false;
	}

	return true;
}

function addTimeToDate (time, date) {
	if (!isTimeValid(time)) {
		//console.warn('time is not valid', time);
		return date;
	}
	let hr = getHours(time);
	const mn = getMinutes(time);
	if (/pm/i.test(time) && hr !== 12) {
		hr += 12;
	}
	date.setHours(hr);
	date.setMinutes(mn);
	return date;
}

function nextNumPos (beg, s) {
	let char, i, found = false;
	for (i = 0; i < s.length; i++) {
		if (i < beg) {
			continue;
		}
		char = s.charAt(i);
		if (!isNaN(parseInt(char))) {
			char = parseInt(char);
		}
		if (typeof char === 'number') {
			found = true;
			break;
		}
	}

	return found ? i : -1;
}

const numReg = /[0-9]/;

function isNum (k) {
	return numReg.test(k);
}

const control = {
	'Shift': 1,
	'Enter': 1,
	// 'Backspace': 1,
	'Delete': 1,
	'ArrowLeft': 1,
	'ArrowRight': 1,
	'Escape': 1,
	'Command': 1,
	'Tab': 1,
	'Meta': 1,
	'Alt': 1
};

const isArrowKey = {
	'ArrowUp': 1,
	'ArrowDown': 1
};

function isControl (e) {
	return control[e.key];
}

function timeToSeconds (value) {
	const isAM = /am/i.test(value);
	let hr = getHours(value);
	if (isAM && hr === 12) {
		hr = 0;
	} else if (!isAM && hr !== 12) {
		hr += 12;
	}
	let mn = getMinutes(value);
	const sc = getSeconds(value);
	if (isNaN(hr) || isNaN(mn)) {
		throw new Error('Invalid time ' + time);
	}
	mn *= 60;
	hr *= 3600;
	return hr + mn + sc;
}

function getHours (value) {
	return parseInt(value.substring(0, 2));
}

function getMinutes (value) {
	return parseInt(value.substring(3, 5));
}

function getSeconds (value) {
	if (value.split(':').length === 3) {
		return parseInt(value.substring(6, 8));
	}
	return 0;
}

function stripDate (str) {
	return str.replace(/\d+[\/-]\d+[\/-]\d+\s*/, '');
}

function stopEvent (e) {
	if (e.metaKey || control[e.key]) {
		return;
	}
	e.preventDefault();
	e.stopImmediatePropagation();
	return false;
}

function removeCharAtPos (str, pos) {
	return str.substring(0, pos) + str.substring(pos + 1);
}

function replaceText (str, chars, beg, end, xChars) {
	chars = chars.padEnd(end - beg, xChars);
	return str.substring(0, beg) + chars + str.substring(end);
}

function formatDate (s, mask) {
	function sub (pos) {
		let subStr = '';
		for (let i = pos; i < mask.length; i++) {
			if (mask[i] === 'X') {
				break;
			}
			subStr += mask[i];
		}
		return subStr;
	}

	s = s.replace(/(?!X)\D/g, '');
	const maskLength = mask.match(/X/g).join('').length;
	let f = '';
	const len = Math.min(s.length, maskLength);
	for (let i = 0; i < len; i++) {
		if (mask[f.length] !== 'X') {
			f += sub(f.length);
		}
		f += s[i];
	}
	return f;
}

function formatTime (s) {
	s = s.replace(/(?!X)\D/g, '');
	s = s.substring(0, 4);
	if (s.length < 4) {
		s = `0${s}`;
	}
	if (s.length >= 2) {
		s = s.split('');
		s.splice(2, 0, ':');
		s = s.join('');
	}
	return s;
}

function getAMPM (value) {
	const result = /[ap]m/.exec(value);
	return result ? result[0] : null;
}

function getMinDate (value) {
	if (value === 'now') {
		value = new Date();
	} else {
		value = dates.toDate(value);
	}
	value.setMinutes(value.getMinutes() - 2);
	return value;
}

function getMaxDate (value) {
	if (value === 'now') {
		value = new Date();
	} else {
		value = dates.toDate(value);
	}
	value.setMinutes(value.getMinutes() + 2);
	return value;
}

function getMinTime (value) {
	if (value === 'now') {
		value = new Date();
	} else {
		value = dates.toDate(value);
	}
	value.setSeconds(value.getSeconds() - 2);
	return value;
}

function getMaxTime (value) {
	if (value === 'now') {
		value = new Date();
	} else {
		value = dates.toDate(value);
	}
	value.setSeconds(value.getSeconds() + 2);
	return value;
}

function mergeTime (date, datetime) {
	return `${date.trim()} ${datetime.substring(11)}`;
}

function toDateAriaLabel(date) {
    date = dates.toDate(date);
    return dates.format(date, 'd, E MMMM yyyy');
}

function toDateTimeAriaLabel(date) {
    date = dates.toDate(date);
    return dates.format(date, 'd, E MMMM yyyy');
}

function is (value) {
	return {
		less (time) {
			return timeToSeconds(value) < timeToSeconds(time);
		},
		greater (time) {
			return timeToSeconds(value) > timeToSeconds(time);
		},
		dateAndTime () {
			return dates.is(value).date() && dates.is(value).time();
		},
		time () {
			return dates.is(value).time();
		},
		date () {
			return dates.is(value).date();
		},
		type () {
			if (this.dateAndTime()) {
				return 'datetime';
			}
			if (this.time()) {
				return 'time';
			}
			if (this.date()) {
				return 'date';
			}
			return '';
		}
	}
}

const util = {
	is,
	addTimeToDate,
	isTimeValid,
    isDateTimeValid,
    isDateValid,
	incMinutes,
	incHours,
	incMonth,
	incDate,
	incYear,
	round,
	pad,
	isNum,
	control,
	isArrowKey,
	isControl,
	stopEvent,
	nextNumPos,
	removeCharAtPos,
	replaceText,
	formatDate,
	formatTime,
	getAMPM,
	getMinDate,
	getMaxDate,
    toDateAriaLabel,
    toDateTimeAriaLabel,
	getMinTime,
	getMaxTime,
	timeIsInRange,
	toDateTime,
	timeToSeconds,
	stripDate,
	charCount,
	mergeTime
};

window.getDatePickerUtil = () => {
    return util;
}
module.exports = util;
},{"@clubajax/dates":"@clubajax/dates"}],10:[function(require,module,exports){
const dom = require('@clubajax/dom');

const EVENT_NAME = 'change';
module.exports = function (instance, value) {
    if (instance.blockEvent) {
        return;
    }
    value = value === undefined ? instance.value : value;
    value = typeof value === 'object' ? value : {value};
    if (value) {
        value.value = dom.normalize(value.value);
    }
    const eventName = instance['event-name'] || EVENT_NAME;
    const emitType = eventName === EVENT_NAME ? 'emit' : 'fire';
    instance[emitType](eventName, value, true);
    instance.__value = value !== null ? value.value : null;
};

},{"@clubajax/dom":"@clubajax/dom"}],11:[function(require,module,exports){
// https://fontawesome.com/icons?d=gallery&c=interfaces&m=free
const map = {
    check: 'fas fa-check',
    minus: 'fas fa-minus',
    plus: 'fas fa-plus',
    books: 'fas fa-book-reader',
    chess: 'fas fa-chess-rook',
    error: 'fas fa-exclamation-circle',
    warning: 'fas fa-exclamation-triangle',
    caretDown: 'fas fa-caret-down',
    angleLeft: 'fas fa-angle-left',
    angleRight: 'fas fa-angle-right',
    search: 'fas fa-search',
    spinner: 'fas fa-sync-alt',

    'folder': 'far fa-folder',
    'file': 'far fa-file-alt',
    'file-archive': 'far fa-file-archive',
    'file-audio': 'far far fa-file-audio',
    'file-code': 'far far fa-file-code',
    'file-image': 'far far fa-file-image',
    'file-pdf': 'far far fa-file-pdf',
    'file-video': 'far far fa-file-video',
    'file-excel': 'far far fa-file-excel',
    'file-powerpoint': 'far far fa-file-powerpoint',
    'file-word': 'far far fa-file-word'
};


module.exports = map;

},{}],12:[function(require,module,exports){
const uidMap = {};
function uid (prefix = 'uid') {
	uidMap[prefix] = uidMap[prefix] || 0;
	uidMap[prefix]++;
	return `${prefix}-${uidMap[prefix]}`;
}

module.exports = uid;
},{}],13:[function(require,module,exports){
const BaseComponent = require('@clubajax/base-component');
const dom = require('@clubajax/dom');
const uid = require('./lib/uid');
const emitEvent = require('./lib/emitEvent');
require('./ui-popup');
require('./ui-list');
require('./ui-icon');

// ref
// https://blog.mobiscroll.com/how-to-do-multiple-selection-on-mobile/


// TODO remove and append popup
//  disconnected is faster than destroy
//  kill popup
//  update ReactWebComponent
//

const DEFAULT_PLACEHOLDER = 'Select One...';

class UiDropdown extends BaseComponent {
    sortdesc
    sortasc;
    label;
    placeholder;
    lastValue = null;
    
    set value(value) {
        this.lastValue = value;
        if (this.list) {
            this.list.value = value;
        } else {
            this.onDomReady(() => {
                this.list.value = value;
            });
        }
        this.__value = value;
    }

    get value() {
        if (!this.list) {
            return this.__value || this.getAttribute('value');
        }
        return this.list.value;
    }

    set data(data) {
        this.onDomReady(() => {
            const value = getValueFromList(data);
            if (value) {
                this.value = value;
            }
            this.list.data = data;
            if (this['size-to-popup']) {
                this.sizeToPopup();
            }
        });
        this.__data = data;
    }

    get data() {
        return this.list ? this.list.items : this.__data;
    }

    setDisplay() {
        this.button.innerHTML = '';
        
        const item = this.list ? this.list.getItem(this.value) : {};
        this.__value = item ? item.value : this.__value;
        dom('span', {html: isNull(this.value) ? this.placeholder || DEFAULT_PLACEHOLDER : (item.alias || item.label)}, this.button);
        if (!this['no-arrow']) {
            dom('ui-icon', {type: 'caretDown'}, this.button);
        }
        setTimeout(() => {
            // don't resize the popup right away - wait until it closes, or it jumps
            if (this.popup) {
                dom.style(this.popup, {
                    'min-width': dom.box(this.button).w
                });
            }
        }, 500);
    }

    sizeToPopup() {
        dom.style(this.button, {
            width: dom.box(this.popup).w + 20 // allow for dropdown arrow
        });
    }

    reset() {
        this.list.reset();
    }

    connected() {
        this.render();
        this.connectEvents();
        this.connected = () => {};
    }

    connectEvents() {
        this.list.on('list-change', (e) => {
            // set display, regardless of elligible event
            this.setDisplay();
            // ensure value is not the same,
            // do not emit events for initialization and 
            // externally setting the value
            if (this.lastValue + '' !== this.value + '') {
                emitEvent(this);
                this.lastValue = this.value;
            }
            setTimeout(() => {
                this.popup.hide();
            }, 300);
        });
        this.popup.on('popup-open', () => {
            this.list.controller.scrollTo();
            this.fire('open');
        });
        this.popup.on('popup-close', () => {
            this.list.controller.scrollTo();
            this.fire('close');
        });
    }

    renderButton(buttonid) {
        this.button = dom('button', {id: buttonid, class: 'ui-button drop-input'}, this);
        this.setDisplay();
    }

    render() {
        this.labelNode = dom('label', {html: this.label, class: 'ui-label'}, this);
        const buttonid = uid('drop-button');
        this.renderButton(buttonid);
        this.list = dom('ui-list', {
            buttonid,
            'event-name': 'list-change',
            sortdesc: this.sortdesc,
            sortasc: this.sortasc
        });
        this.popup = dom('ui-popup', {
            buttonid,
            label: this.label,
            html: this.list,
            class: 'dropdown'
        }, document.body);
        this.setDisplay();
    }

    disconnected() {
        this.popup.destroy();
    }
}

function isNull(value) {
    return value === null || value === undefined;
}

function getValueFromList(data) {
    const item = data.find(m => m.selected);
    return item ? item.value : null;
}

module.exports = BaseComponent.define('ui-dropdown', UiDropdown, {
    props: ['placeholder', 'label', 'limit', 'name', 'event-name', 'align', 'btn-class', 'sortdesc', 'sortasc'],
    bools: ['disabled', 'open-when-blank', 'allow-new', 'required', 'case-sensitive', 'autofocus', 'busy', 'no-arrow', 'size-to-popup'],
    attrs: ['value']
});

},{"./lib/emitEvent":10,"./lib/uid":12,"./ui-icon":14,"./ui-list":16,"./ui-popup":17,"@clubajax/base-component":"@clubajax/base-component","@clubajax/dom":"@clubajax/dom"}],14:[function(require,module,exports){
const BaseComponent = require('@clubajax/base-component');
const dom = require('@clubajax/dom');
const iconMap = require('./lib/icon-map');

class UiIcon extends BaseComponent {
    onType(type) { 
        // if (!iconMap[type]) console.warn('icon type missing:', type);
        if (!missingStylesheet()) {
            console.warn('Icon stylesheet missing');
        }
        this.className = iconMap[type] || type;
    }
    onColor(value) {
        // why doesn't this work?
        console.log('COLOR', value);
    }

    connected() {
        if (this.color) {
            this.style.color = this.color;
        }
    }
}

let missing;
function missingStylesheet() {
    missing = missing !== undefined ? missing : Boolean(dom.queryAll('link').find(link => /fontawesome/.test(link.href)));
    return missing;
}

module.exports = BaseComponent.define('ui-icon', UiIcon, {
    props: ['type', 'color']
});

},{"./lib/icon-map":11,"@clubajax/base-component":"@clubajax/base-component","@clubajax/dom":"@clubajax/dom"}],15:[function(require,module,exports){
const BaseComponent = require('@clubajax/base-component');
const dom = require('@clubajax/dom');
const emitEvent = require('./lib/emitEvent');
require('./ui-icon');

const DEFAULT_PLACEHOLDER = 'Enter text...';

class UiInput extends BaseComponent {
    readonly;
    disabled;
    placeholder;
    icon;
    label;
    attributeChanged(prop, value) {
        if (prop === 'value') {
            this.value = value;
        }
    }

    set value(value) {
        this._value = value === undefined || value === null ? '' : value;
        this.setValue(this._value);
    }

    get value() {
        return this.input.value || null;
    }

    setValue(value) {
        if (this.input) {
            this.input.value = value;
            this.setPlaceholder();
        }
    }

    onIcon(type) {
        this.iconNode.type = type;
    }
    
    onLabel() {
        this.labelNode.innerHTML = this.label;
    }

    onDisabled(value) {
        if (this.input) {
            this.input.disabled = value;
        }
    }

    onReadonly(value) {
        if (this.input) {
            this.input.readonly = value;
        }
    }

    setPlaceholder() {
        // dom.classList.toggle(this, 'has-placeholder')
    }

    emitEvent = (e) => {
        e.stopPropagation();
        this._value = this.input.value;
        emitEvent(this, this._value);
    }

    connected() {
        this.render();
        this.connected = () => {};
    }

    connect() {
        this.on(this.input, 'blur', () => {
            this.focused = false;
            this.emit('blur');
        });
        this.on(this.input, 'focus', () => {
            this.focused = true;
            this.emit('focus');
        });
        this.on(this.input, 'change', this.emitEvent);
    }
    
    render() {
        this.labelNode = dom('label', {}, this);
        this.input = dom('input', {
            value: this._value || '',
            readonly: this.readonly,
            disabled: this.disabled,
            placeholder: this.placeholder || DEFAULT_PLACEHOLDER
        }, this);
        if (this.icon) {
            this.iconNode = dom('ui-icon', {type: this.icon}, this);
            this.classList.add('has-icon');
        }
        this.setPlaceholder();
        this.connect();
    }
}

function isNull(value) {
    return value === null || value === undefined;
}

module.exports = BaseComponent.define('ui-input', UiInput, {
    props: ['placeholder', 'label', 'limit', 'name', 'event-name', 'align', 'icon'],
    bools: ['disabled', 'ready', 'required', 'autofocus'],
    attrs: ['value']
});

},{"./lib/emitEvent":10,"./ui-icon":14,"@clubajax/base-component":"@clubajax/base-component","@clubajax/dom":"@clubajax/dom"}],16:[function(require,module,exports){
const BaseComponent = require('@clubajax/base-component');
const dom = require('@clubajax/dom');
const on = require('@clubajax/on');
const keys = require('@clubajax/key-nav');
const emitEvent = require('./lib/emitEvent');

const ATTR = {
    LABEL: 'aria-label',
    ALIAS: 'alias',
    DISPLAY: 'display',
    SELECTED: 'aria-selected',
    DISABLED: 'disabled',
    TABINDEX: 'tabindex',
    VALUE: 'value',
};

// TODO!!!!
// a11y


class UIList extends BaseComponent {
    sortdesc;
    sortasc;
    multiple;
    readonly;
    buttonid;
    label;
    lastValue = null;
    attributeChanged(prop, value) {
        if (prop === 'value') {
            this.value = value;
        }
    }

    set value(value) {
        this.lastValue = value;
        this.onDomReady(() => {
            this.setControllerValue(value);
        });
        this.__value = value;
    }

    get value() {
        if (!this.controller) {
            return this.__value || this.getAttribute('value');
        }
        if (this.multiple) {
            return this.controller
                .getSelected()
                .map(node => node.getAttribute('value'));
        }
        const node = this.controller.getSelected();
        if (node) {
            return node.getAttribute('value');
        }
        return this.__value || null;
    }

    set data(data) {
        // if (noValues(data)) {
        //     throw new Error('data does not contain any values');
        // }
        if (typeof data === 'function') {
            this.lazyDataFN = data;
            this.onConnected(() => {
                this.render();
                this.connect();
            });
            return;
        }
        this.setData(data);
    }

    get data() {
        return this.items;
    }

    onDisabled() {
        if (this.items || this.lazyDataFN) {
            this.connectEvents();
        }
        this.onDomReady(() => {
            this.setTabIndicies();
        });
    }

    onReadonly() {
        this.connectEvents();
    }
    
    setLazyValue(value) {
        // emits a value, in spite of the list not yet being rendered
        const data = this.lazyDataFN();
        const item = data.find(m => m.value === value);
        if (!item) {
            return;
        }
        this.emitEvent();
    }

    setLazyData() {
        // to be called externally, for example, by a dropdown
        this.setData(this.lazyDataFN());
        this.lazyDataFN = null;
        // I think this should be next:
        this.connectEvents();
        this.fire('dom-update');
    }

    setData(data) {
        if (isEqual(this.orgData, data)) {
            return;
        }
        data = toArray(data);
        if (data.length && typeof data[0] !== 'object') {
            data = data.map(item => ({ label: item, data: item }));
        }
        if (!this.lazyDataFN) {
            this.__value = undefined;
        }
        this.selectedNode = null;
        this.orgData = data;
        this.items = sort([...data], this.sortdesc, this.sortasc);
        this.update();
        this.onConnected(() => {
            this.setItemsFromData();
        });
    }

    addData(data) {
        data = toArray(data);
        this.items = [...(this.items || []), ...data];
        this.setItemsFromData();
    }

    removeData(values) {
        values = toArray(values);
        values.forEach(value => {
            const index = this.items.findIndex(item => item.value === value);
            if (index === -1) {
                console.warn('remove value, not found', value);
            }
            this.items.splice(index, 1);
        });
        this.setItemsFromData();
    }

    setItemsFromData() {
        // uses an array of objects as the list items
        this.render();
        this.list.innerHTML = '';
        if (this.lazyDataFN && !this.items) {
            this.items = [];
        }
        if (dom.isNode(this.items[0])) {
            this.setDomData();
            return;
        }
        const parentValue = this.value;
        const list = this.list;
        let node;
        this.items.forEach(function (item) {
            if (item.type === 'divider') {
                dom('li', {class: 'divider'}, list);
                return;
            }
            if (item.type === 'label') {
                dom('li', {class: 'label', html: item.label}, list);
                return;
            }
            const label = item.alias
                ? `${item.alias}: ${item.label}`
                : item.label;
            // if (item.value === undefined && label === undefined) {
            //     throw new Error(
            //         '[ERROR] each items must have a value or a label'
            //     );
            // }
            if (item.value === undefined) {
                node = dom('div', { class: 'label', html: label }, list);
                node.unselectable = true;
                return;
            }
            const options = { html: label, value: item.value };
            const isSelected = item.selected || item.value === parentValue;
            if (isSelected) {
                options['aria-selected'] = true;
            }
            if (item.class) {
                options.class = item.class;
            }
            if (item.disabled) {
                options.disabled = true;
            }
            node = dom('li', options, list);
        });
        this.appendChild(this.list);
        this.update();
        this.connect();
    }

    initDomData() {
        // used only for the children of ui-list as the items
        let postValue;
        const parentValue = this.value;
        this.render();
        this.items = [];
        while (this.children.length) {
            const child = this.children[0];
            if (child.localName !== 'li') {
                console.warn("ui-list children should use LI's");
            }
            this.items.push({
                label: child.textContent,
                value: child.getAttribute(ATTR.VALUE),
            });
            if (
                child.hasAttribute(ATTR.SELECTED) ||
                child.getAttribute(ATTR.VALUE) === parentValue
            ) {
                this.selectedNode = child;
                this.orgSelected = child;
                this.items[this.items.length - 1].selected = true;
                if (!parentValue) {
                    postValue = child.getAttribute(ATTR.VALUE);
                }
            }
            this.list.appendChild(child);
        }

        this.update();
        this.appendChild(this.list);
        this.connect();

        this.disabled = this.hasAttribute(ATTR.DISABLED);

        if (postValue || parentValue) {
            this.select(postValue || parentValue);
        }
    }

    setDomData() {
        // uses array of dom nodes, or document fragment
        // TODO: Do nodes need to be cloned?
        const list = this.list;
        if (this.items[0] && this.items[0].nodeType === 11) {
            // document fragment
            list.appendChild(this.items[0]);
        } else {
            this.items.forEach(node => {
                if (node.localName !== 'li') {
                    throw new Error('list children should be of type "li"');
                }
                if (!node.getAttribute('value')) {
                    node.setAttribute('value', valueify(node.textContent));
                }
                list.appendChild(node);
            });
        }
        this.appendChild(list);
        this.setItemsFromDom();
        this.update();
        this.connect();
    }

    setItemsFromDom() {
        // derives items list from dom 
        this.items = [];
        [...this.list.children].forEach(child => {
            if (child.localName !== 'li') {
                console.warn("ui-list children should use LI's");
            }
            this.items.push({
                label: child.getAttribute(ATTR.LABEL) || child.textContent,
                value: child.getAttribute(ATTR.VALUE),
                alias: child.getAttribute(ATTR.ALIAS),
                display: child.getAttribute(ATTR.DISPLAY),
            });
        });
    }

    setControllerValue(value) {
        if (this.controller) {
            if (Array.isArray(value)) {
                if (!this.multiple) {
                    throw new Error(
                        'Trying to set multiple values without the `multiple` attribute'
                    );
                }
                const selector = value.map(getSelector).join(',');
                this.controller.setSelected(dom.queryAll(this, selector));
            } else {
                this.controller.setSelected(
                    dom.query(this, getSelector(value))
                );
            }
        } else {
            console.warn('UIList.setControllerValue: No controller');
        }
    }

    getItem(value) {
        return this.items
            ? this.items.find(item => item.value === value || `${item.value}` === `${value}`)
            : null;
    }

    connected() {
        if (this.lazyDataFN) {
            this.update();
        }
        if (this.items) {
            this.initDomData = () => {};
            // this.setItemsFromData();
        }
    }

    domReady() {
        if (!this.disabled && !this.readonly) {
            this.onDisabled();
        }
        if (this.items || this.lazyDataFN) {
            return;
        }
        this.initDomData();
    }

    emitEvent() {
        // emits a "change" event
        emitEvent(this, this.value);
    }

    update() {
        // override me
        // called after items insertion, before list insertion
    }

    setTabIndicies() {
        if (!this.list) {
            return;
        }
        if (!this.disabled) {
            this.setAttribute(ATTR.TABINDEX, '-1');
            this.list.setAttribute(ATTR.TABINDEX, '0');
        } else {
            this.removeAttribute(ATTR.TABINDEX);
            this.list.removeAttribute(ATTR.TABINDEX);
        }
    }

    connect() {
        // called after data is set
        this.connectController();
        this.connectEvents();
        this.connect = function() {};
    }

    connectController() {
        const options = {
            canSelectNone: this.getAttribute('can-select-none'),
            multiple: this.multiple,
            searchTime: this.getAttribute('search-time'),
            externalSearch: this['external-search'],
            buttonId: this.buttonid,
            value: this.value
        };
        this.connectHandles = on.makeMultiHandle([
            this.on('click', () => {
                this.list.focus();
            }),
            this.on('focus', () => {
                this.list.focus();
            }),
            this.on('key-select', () => {
                this.lastValue = this.value;
                this.emitEvent();
            }),
        ]);

        this.controller = keys(this.list, options);
    }

    connectEvents() {
        if (this.lazyDataFN) {
            return;
        }
        const enabled = !this.readonly && !this.disabled;
        this.setTabIndicies();
        if (!enabled && !this.controller) {
            return;
        }
        if (!enabled && this.controller) {
            this.controller.pause();
            this.connectHandles.pause();
        } else if (enabled && this.controller) {
            this.controller.resume();
            this.connectHandles.resume();
        }
    }

    reset() {
        this.value = this.__value;
    }

    render() {
        if (!this.labelNode && this.label) {
            // TODO: a11y?
            this.labelNode = dom('label', { html: this.label }, this);
        }
        if (!this.list) {
            this.list = dom('ul', {});
        }
    }

    destroy() {
        super.destroy();
    }
}

function toArray(data) {
    return Array.isArray(data) ? data : [data];
}

function getSelector(val) {
    return `[value="${val}"]`;
}

function valueify(text) {
    return text.replace(/\s/g, '-').toLowerCase();
}

function sort(items, desc, asc) {
    if (desc) {
        items.sort((a, b) => a[desc] > b[desc] ? 1 : -1);
    }
    if (asc) {
        items.sort((a, b) => a[asc] < b[asc] ? 1 : -1);
    }
    return items;
}

function isEqual(a, b) {
    if (a === b) {
        return true;
    }
    if (!a || !b || !Array.isArray(a) || !Array.isArray(b)) {
        return false;
    }
    return a.map(m => m.value).join(',') === b.map(m => m.value).join(',')
}

function noValues(data) {
    // no data is okay
    if (!data.length) {
        return false;
    }
    if (dom.isNode(data[0])) {
        return false;
    }
    // custom app expects IDs
    return !data.find(d => !!d.value || !!d.id); 
}

module.exports = BaseComponent.define('ui-list', UIList, {
    props: [
        'label',
        'limit',
        'name',
        'event-name',
        'align',
        'buttonid',
        'external-search',
        'sortdesc',
        'sortasc'
    ],
    bools: ['disabled', 'readonly', 'multiple'],
    attrs: ['value'],
});

},{"./lib/emitEvent":10,"@clubajax/base-component":"@clubajax/base-component","@clubajax/dom":"@clubajax/dom","@clubajax/key-nav":"@clubajax/key-nav","@clubajax/on":"@clubajax/on"}],17:[function(require,module,exports){
const BaseComponent = require('@clubajax/base-component');
const dom = require('@clubajax/dom');
const on = require('@clubajax/on');

// detach popup from body when not showing
// - unless keepPopupsAttached
class UiPopup extends BaseComponent {
    align;
    buttonid;
    label;
    constructor() {
        super();
        this.showing = false;
        this.handleMediaQuery = this.handleMediaQuery.bind(this);
    }

    onOpen(value) {
        this.onDomReady(() => {
            if (value) {
                this.show();
            } else {
                this.hide();
            }
        });
    }

    domReady() {
        this.component = this.children[0] || {};
        this.button = dom.byId(this.buttonid);
        if (!this.button) {
            throw new Error(
                'ui-tooltip must be associated with a parent via the parentid'
            );
        }

        this.connectEvents();
        if (!this.parentNode) {
            document.body.appendChild(this);
        }

        this.mq = window.matchMedia('(max-width: 415px)');
        this.mq.addListener(this.handleMediaQuery);
        this.handleMediaQuery(this.mq);
    }

    renderMobileButtons() {
        if (this['use-hover']) {
            // this is a tooltip, not a dropdown
            return;
        }
        // mobile label for dropdowns
        if (this.label) {
            this.labelNode = dom('label', {
                class: 'ui-label',
                html: this.label,
            });
            dom.place(this, this.labelNode, 0);
        }
        // mobile button for dropdowns
        dom(
            'div',
            {
                class: 'ui-button-row',
                html: [
                    dom('button', {
                        html: 'Close',
                        class: 'ui-button tertiary',
                    }),
                    dom('button', {
                        html: 'Done',
                        class: 'ui-button tertiary',
                    }),
                ],
            },
            this
        );
        dom.queryAll(this, '.ui-button-row .ui-button').forEach((button, i) => {
            this.mobileEvents = this.on(button, 'click', () => {
                if (i === 1) {
                    if (this.component.emitEvent) {
                        this.component.blockEvent = false;
                        this.component.emitEvent();
                        this.component.blockEvent = true;
                    }
                } else if (this.component.reset) {
                    this.component.reset();
                }
                this.hide();
            });
        });
    }

    removeMobileButtons() {
        dom.queryAll(this, '.ui-button-row .ui-button').forEach(button => {
            dom.destroy(button);
        });
        dom.destroy(this.labelNode);
        if (this.mobileEvents) {
            this.mobileEvents.remove();
        }
    }

    connectEvents() {
        if (this.button) {
            if (this['use-hover']) {
                this.connectHoverEvents();
            } else {
                this.clickoff = on.makeMultiHandle([
                    on(this, 'clickoff', (e) => {
                        if (!e.target.hasAttribute('data-no-clickoff')) {
                            this.hide();
                        }
                    }),
                    onScroll(this.hide.bind(this), this),
                ]);
                this.on(this.button, 'click', e => {
                    this.show();
                });
                this.on(this.button, 'keydown', e => {
                    if (e.key === 'Enter' && !this.showing) {
                        // prevent key-nav from detecting Enter when not open
                        e.preventDefault();
                        this.show();
                    }
                });
            }
        }
    }

    connectHoverEvents() {
        const HIDE_TIMEOUT = this['hide-timer'] || 500;
        let timer;
        const show = () => {
            clearTimeout(timer);
            this.show();
        };
        const hide = immediate => {
            if (immediate === true) {
                this.hide();
                return;
            }
            timer = setTimeout(() => {
                this.hide();
            }, HIDE_TIMEOUT);
        };
        this.on(this.button, 'mouseenter', show);
        this.on(this.button, 'mouseleave', hide);
        this.on('mouseenter', show);
        this.on('mouseleave', hide);
        this.clickOff = onScroll(hide);
        this.clickOff.resume();
    }

    handleMediaQuery(event) {
        if (event.matches) {
            this.component.blockEvent = true;
            this.isMobile = true;
            clearPosition(this);
            this.classList.add('is-mobile');
            this.renderMobileButtons();
        } else {
            this.component.blockEvent = false;
            this.isMobile = false;
            this.classList.remove('is-mobile');
            position(this, this.button);
            this.removeMobileButtons();
        }
    }

    show() {
        if (this.showing) {
            return;
        }
        this.showing = true;
        this.classList.add('open');
        if (this.clickoff) {
            this.clickoff.resume();
        }
        if (!this.isMobile) {
            position(this, this.button, this.align);
        }
        this.fire('popup-open');
    }

    hide() {
        if (!this.showing || window.keepPopupsOpen) {
            return;
        }
        this.showing = false;
        this.classList.remove('open');
        if (this.clickoff) {
            this.clickoff.pause();
        }
        this.fire('popup-close');
    }

    destroy() {
        if (this.clickoff) {
            this.clickoff.remove();
        }
        if (this.mq) {
            this.mq.removeListener(this.handleMediaQuery);
        }
        super.destroy();
    }
}

function clearPosition(popup, tooltip) {
    if (tooltip) {
        dom.classList.remove(tooltip, 'T R B L');
    }
    dom.style(popup, {
        left: '',
        right: '',
        top: '',
        bottom: '',
        height: '',
        width: '',
        overflow: '',
    });
}

function positionTooltip(popup, button, align) {
    const LOG = window.debugPopups;
    const tooltip = dom.query(popup, '.ui-tooltip');
    clearPosition(popup, tooltip);
    const win = {
        w: window.innerWidth,
        h: window.innerHeight,
    };
    const pop = dom.box(popup);
    const btn = dom.box(button);
    const GAP = 15;
    const style = {};

    LOG &&
        console.log(
            'align:',
            align,
            '\nbutton:',
            button,
            '\npopup:',
            popup,
            '\nwin',
            win,
            '\npop',
            pop,
            '\nbtn',
            btn
        );

    function addClass(cls) {
        if (tooltip) {
            tooltip.classList.add(cls);
        }
    }

    function midY() {
        if (btn.h > pop.h) {
            return btn.y + (btn.h - pop.h) / 2;
        }
        return btn.y - (pop.h - btn.h) / 2;
    }
    function midX() {
        if (btn.w > pop.w) {
            return btn.x + (btn.w - pop.w) / 2;
        }
        return btn.x - (pop.w - btn.w) / 2;
    }
    function right() {
        style.top = midY();
        style.left = btn.x + btn.w + GAP;
        addClass('R');
    }
    function left() {
        style.top = midY();
        style.right = win.w - btn.x + GAP;
        addClass('L');
    }
    function bottom() {
        style.left = midX();
        style.top = btn.y + btn.h + GAP;
        addClass('B');
    }
    function top() {
        style.left = midX();
        style.top = btn.y - pop.h - GAP;
        addClass('T');
    }

    const fitR = () => btn.x + btn.w + pop.w + GAP < win.w;
    const fitL = () => btn.x - pop.w - GAP > 0;
    const fitT = () => btn.y - pop.h - GAP > 0;
    const fitB = () => btn.y + btn.h + pop.h + GAP < win.h;

    switch (align) {
        case 'R':
            if (fitR()) {
                right();
            } else if (fitL()) {
                left();
            } else {
                console.warn('Button is too wide to fit a tooltip next to it');
            }
            break;
        case 'L':
            if (fitL()) {
                left();
            } else if (fitR()) {
                right();
            } else {
                console.warn('Button is too wide to fit a tooltip next to it');
            }
            break;
        case 'T':
            if (fitT()) {
                top();
            } else if (fitB()) {
                bottom();
            } else {
                console.warn(
                    'Button is too tall to fit a tooltip above or below it'
                );
            }
            break;
        default:
            if (fitB()) {
                bottom();
            } else if (fitT()) {
                top();
            } else {
                console.warn(
                    'Button is too tall to fit a tooltip above or below it'
                );
            }
    }

    dom.style(popup, style);
}

function position(popup, button, align) {
    if (align && align.length === 1) {
        // TODO: may want to use TRBL for dropdowns
        // consider checking for a tooltip node instead
        positionTooltip(popup, button, align);
        return;
    }
    clearPosition(popup);
    const LOG = window.debugPopups;

    const GAP = 5;
    const MIN_BOT_SPACE = 200;

    const style = {};
    const bodyPad = dom.style(document.body, 'padding-left');
    const win = {
        w: window.innerWidth,
        h: window.innerHeight,
    };
    const btn = dom.box(button);
    const pop = dom.box(popup);
    const topSpace = btn.top;
    const botSpace = win.h - (btn.top + btn.h + GAP);
    const rightSpace = win.w - btn.x;
    const leftSpace = btn.x + btn.w;

    LOG &&
        console.log(
            '\nbutton:',
            button,
            '\npopup:',
            popup,
            '\nwin',
            win,
            '\npop',
            pop,
            '\nbtn',
            btn,
            '\ntopSpace',
            topSpace,
            '\nbotSpace',
            botSpace,
            '\nleftSpace',
            leftSpace,
            '\nrightSpace',
            rightSpace
        );

    // position left/right & width
    if (align === 'right' || (leftSpace > pop.w && leftSpace > rightSpace)) {
        // left-side
        style.top = btn.y + btn.h;
        style.right = win.w - (btn.x + btn.w);
    } else if (rightSpace > pop.w) {
        // right-side
        style.top = btn.y + btn.h;
        style.left = btn.x;
    } else if (rightSpace > leftSpace) {
        // right-side, resize popup
        style.top = btn.y + btn.h;
        style.left = btn.x;
        style.width = rightSpace - bodyPad;
    } else {
        // left-side, resize popup
        style.top = btn.y + btn.h;
        style.right = win.w - (btn.x + btn.w);
        style.width = leftSpace - bodyPad;
    }

    // position top/bottom & height
    if (pop.h > topSpace && pop.h > botSpace) {
        if (botSpace < MIN_BOT_SPACE || topSpace > botSpace * 1.5) {
            // force top
            style.height = topSpace - GAP * 2;
            style.bottom = win.h - btn.y;
            style.top = '';
            style.overflow = 'auto';
        } else {
            // force bottom
            style.height = botSpace - GAP * 2;
            style.overflow = 'auto';
        }
    } else if (botSpace < pop.h) {
        // top
        style.top = '';
        style.bottom = win.h - btn.y;
    }

    dom.style(popup, style);
}

function onScroll(hide, popup) {
    return {
        resume: () => {
            window.addEventListener(
                'scroll',
                (e) => {
                    if (e.target.closest && e.target.closest('ui-popup')) {
                        return;
                    }
                    hide(true);
                },
                true
            );
        },
        pause: () => {
            window.removeEventListener('scroll', hide);
        },
        remove: () => {
            window.removeEventListener('scroll', hide);
        },
    };
}
module.exports = BaseComponent.define('ui-popup', UiPopup, {
    props: ['buttonid', 'label', 'align', 'use-hover'],
    bools: ['open'],
});

},{"@clubajax/base-component":"@clubajax/base-component","@clubajax/dom":"@clubajax/dom","@clubajax/on":"@clubajax/on"}],18:[function(require,module,exports){
const BaseComponent = require('@clubajax/base-component');
const dom = require('@clubajax/dom');
const uid = require('./lib/uid');
require('./ui-popup');
require('./ui-list');
require('./ui-icon');
require('./ui-input');

// https://blog.mobiscroll.com/how-to-do-multiple-selection-on-mobile/
// https://adamsilver.io/articles/building-an-accessible-autocomplete-control/
// data-alt

const DEFAULT_PLACEHOLDER = 'Begin typing...';

class UiSearch extends BaseComponent {
    placeholder;
    busy;
    label;
    set value(value) {
        this.onDomReady(() => {
            this.list.value = value;
            this.setDisplay();
        });
        this.__value = value;
    }

    get value() {
        if (!this.list) {
            return this.__value || this.getAttribute('value');
        }
        return this.list.value;
    }

    set data(data) {
        this.onDomReady(() => {
            this.list.data = data;
            if (this.input.focused) {
                this.popup.show();
            }
        });
        this.__data = data;
    }

    get data() {
        return this.list ? this.list.items : this.__data;
    }

    onBusy(value) {
        this.input.icon = value ? 'spinner' : 'search';
    }

    setDisplay() {
        const item = this.list ? this.list.getItem(this.value) : {};
        this.__value = item ? item.value : this.__value;

        this.input.value = isNull(this.value) ? '' : item.display || item.alias || item.label;

        if (this.popup) {
            dom.style(this.popup, {
                'min-width': dom.box(this.input).w,
            });
        }
    }

    reset() {
        this.list.reset();
    }

    connected() {
        this.render();
        this.connectEvents();
        this.connected = () => {};
    }

    connectEvents() {
        this.list.on('list-change', () => {
            this.setDisplay();
            this.emit('change', {value: this.value});
            setTimeout(() => {
                this.popup.hide();
            }, 300);
        });

        this.input.on('key-search', e => {
            this.fire('search', { value: e.detail.value });
        });

        this.input.on('focus', () => {
            this.classList.add('is-focused');
        });
        
        this.input.on('focus', () => {
            this.classList.remove('is-focused');
        });
    }

    renderButton(buttonid) {
        this.input = dom(
            'ui-input',
            {
                id: buttonid,
                'event-name': 'input-change',
                class: 'search-input',
                placeholder: this.placeholder || DEFAULT_PLACEHOLDER,
                icon: this.busy ? 'spinner' : 'search',
            },
            this
        );
        this.setDisplay();
    }

    render() {
        this.labelNode = dom(
            'label',
            { html: this.label, class: 'ui-label' },
            this
        );
        const buttonid = uid('drop-button');
        this.renderButton(buttonid);
        this.list = dom('ui-list', {
            'event-name': 'list-change',
            'external-search': true,
            buttonid,
        });
        this.popup = dom(
            'ui-popup',
            {
                buttonid,
                label: this.label,
                html: this.list,
            },
            document.body
        );
        this.setDisplay();
    }
}

function isNull(value) {
    return value === null || value === undefined;
}

module.exports = BaseComponent.define('ui-search', UiSearch, {
    props: [
        'placeholder',
        'label',
        'limit',
        'name',
        'event-name',
        'align',
        'btn-class',
    ],
    bools: [
        'disabled',
        'open-when-blank',
        'allow-new',
        'required',
        'case-sensitive',
        'autofocus',
        'busy',
    ],
    attrs: ['value'],
});

},{"./lib/uid":12,"./ui-icon":14,"./ui-input":15,"./ui-list":16,"./ui-popup":17,"@clubajax/base-component":"@clubajax/base-component","@clubajax/dom":"@clubajax/dom"}],19:[function(require,module,exports){
const BaseComponent = require('@clubajax/base-component');
const dom = require('@clubajax/dom');
const popup = require('./ui-popup');

class UiTooltip extends BaseComponent {
    open;
    domReady() {
        if (!this.value && this.innerHTML.length) {
            this.value = this.innerHTML;
            this.innerHTML = '';
        }
        this.render();
    }

    render() {
        const align = this.align || 'R';
        this.popup = dom('ui-popup', {
            html: dom('div', {
                class: `ui-tooltip ${this.className}`,
                html: this.value
            }),
            buttonid: this.parentNode,
            'use-hover': true,
            align,
            'hide-timer': this['hide-timer'],
            open: this.open
        }, document.body);
    }

    destroy() {
        super.destroy();
        this.popup.destroy();
    }
}

module.exports = BaseComponent.define('ui-tooltip', UiTooltip, {
    props: ['align', 'hide-timer'],
    attrs: ['value', 'open']
});


},{"./ui-popup":17,"@clubajax/base-component":"@clubajax/base-component","@clubajax/dom":"@clubajax/dom"}]},{},[1]);
