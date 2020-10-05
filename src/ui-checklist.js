const BaseComponent = require('@clubajax/base-component');
const dom = require('@clubajax/dom');
const arrowKeys = require('./lib/arrowKeys');
require('./ui-minipop');
require('./ui-input');
require('./ui-checkbox');

// search-type:
//      word(default) match start of all words
//      contains: match any point in string
//      line: match start of line

const ALL_NAME = 'select-all-toggle';

class UiCheckList extends BaseComponent {
    attributeChanged(prop, value) {
        if (prop === 'value') {
            this.value = value;
        }
    }

    set value(value) {
        this._value = isNull(value) ? [] : Array.isArray(value) ? value : [value];
        this.setValue(this._value);
    }

    get value() {
        return this._value || [];
    }

    set data(data) {
        this.items = data || [];
        this.onConnected(() => {
            this.renderList(this.items);
            this.setValue(this.value);
        });
    }

    get data() {
        return this.items;
    }

    setValue(value) {
        const inputs = dom.queryAll(this, 'ui-checkbox');
        if (!value) {
            inputs.forEach((inp) => {
                inp.checked = false;
            });
            this._value = [];
            return;
        }
        inputs.forEach((inp) => {
            inp.checked = value.includes(inp.name);
        });
        this._value = value;
    }

    getRegExp() {
        const value = this.input.value;
        const searchType = this['search-type'] || 'word';
        switch (searchType) {
            case 'line':
                return new RegExp(`^${value}`, 'i');
            case 'contains':
                return new RegExp(value, 'i');
            case 'word':
            default:
                return new RegExp(`\\b${value}`, 'i');
        }
    }

    filterList() {
        if (!this.input.value) {
            this.renderList(this.items);
            return;
        }
        const regexp = this.getRegExp();
        const items = this.items.filter((item) => {
            return regexp.test(item.label);
        });
        this.renderList(items);
        this.popup.show();
    }

    connected() {
        this.render();
        this.connected = () => {};
    }

    connectEvents() {
        this.arrowHandle = arrowKeys(this.input.input, this.popup);

        this.on(this.input, 'click', (e) => {
            if (e.target.localName === 'ui-icon') {
                e.stopImmediatePropagation();
                return;
            }
            this.popup.show();
        });

        this.on(this.input.input, 'keyup', (e) => {
            this.filterList();
            this.input.iconNode.type = this.input.value ? 'close' : 'search';
        });

        this.on('check-all-change', () => {
            this.toggleAll();
        });

        this.on('check-change', (e) => {
            this.onChange();
        });
    }

    toggleAll() {
        const value = this.value;
        const data = this.items;
        const inputs = dom.queryAll(this, 'ui-checkbox');
        if (value.length === data.length) {
            // check none
            inputs.forEach(inp => inp.checked = false);
        } else {
            // check all
            inputs.forEach(inp => inp.checked = true);
        }
        this.onChange();
    }

    updateValues() {
        const inputs = dom.queryAll(this, 'ui-checkbox');
        this._value = inputs.filter((inp) => inp.checked && inp.name !== ALL_NAME).map((inp) => inp.name);
    }

    onChange() {
        this.updateValues();
        this.emit('change', {value: this._value});
        
        if (this.allCheck) {
            const data = this.items;
            this.allCheck.label = this._value.length === data.length ? 'Select None' : 'Select All';
        }
    }

    renderInput() {
        if (this.input) {
            return;
        }
        this.input = dom(
            'ui-input',
            {
                icon: 'search',
                placeholder: 'Filter List...',
                'event-name': 'input-change',
            },
            this
        );

        if (this.popup && this.open) {
            setTimeout(() => {
                this.popup.show();
            }, 30);
        }
    }

    renderList(items) {
        dom.clean(this.list);
        if (!items) {
            return;
        }
        if (this.all) {
            this.allCheck = dom('ui-checkbox', {
                name: ALL_NAME,
                label: 'Select All',
                'event-name': 'check-all-change',
            });
            dom(
                'li',
                {
                    class: ALL_NAME,
                    html: this.allCheck,
                },
                this.list
            );
        }
        const values = this._value || [];
        items.forEach((item) => {
            dom(
                'li',
                {
                    html: dom('ui-checkbox', {
                        name: item.value,
                        label: item.label,
                        'event-name': 'check-change',
                        checked: values.includes(item.value)
                    }),
                },
                this.list
            );
        });
    }

    renderPopup() {
        const data = typeof this.data === 'function' ? this.data() : this.data;

        this.list = dom('ul', {
            class: 'list',
        });

        this.renderList(this.items);

        const listWrap = dom('div', {
            class: 'ui-list',
            html: this.list,
        });

        this.popup = dom(
            'ui-minipop',
            {
                html: listWrap,
                class: 'open',
            },
            this
        );

        const clickoff = this.on('clickoff', (e) => {
            this.popup.hide();
        });

        this.popup.on('popup-open', () => {
            clickoff.resume();
        });

        this.popup.on('popup-close', () => {
            clickoff.pause();
        });

        this.popup.hide();
    }

    render() {
        this.renderInput();
        this.renderPopup();
        this.setValue(this.value);
        this.connectEvents();
    }

    destroy() {
        this.arrowHandle.remove();
    }
}

function isNull(value) {
    return value === null || value === undefined;
}

module.exports = BaseComponent.define('ui-checklist', UiCheckList, {
    bools: ['readonly', 'open', 'all'],
    props: ['search-type'],
});
