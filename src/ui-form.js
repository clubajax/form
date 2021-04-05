const BaseComponent = require('@clubajax/base-component');
const dom = require('@clubajax/dom');
const dates = require('@clubajax/dates');
const emitEvent = require('./lib/emitEvent');

class UiForm extends BaseComponent {
    constructor() {
        super();
    }

    attributeChanged(prop, value) {
        if (prop === 'value') {
            this.value = value;
        }
    }

    set value(value) {
        this._value = isNull(value) ? {} : value;
        this.blockEvent = true;
        setTimeout(() => {
            this.blockEvent = false;
        }, 30);
        this.setValue(this._value);
    }

    get value() {
        const children = this.children;
        return Object.keys(children).reduce((acc, key) => {
            // acc[key] = toTimestamp(children[key].value);
            acc[key] = children[key].value;
            // console.log('    get', key, acc[key]);
            return acc;
        }, {});
    }

    get children() {
        if (!this._children || !this._children.length) {
            this._children = dom.queryAll(this, '[name]').reduce((acc, node) => {
                const name = dom.attr(node, 'name');
                acc[name] = node;
                node['event-name'] = 'input-change';
                return acc;
            }, {});
        }
        return this._children;
    }

    clear() {
        const children = this.children;
        return Object.keys(children).forEach((key) => {
            children[key].value = '';
            if (children[key].reset) {
                children[key].reset();
            }
        }, {});
    }

    setValue(value) {
        Object.keys(value).forEach((key) => {
            if (this.children[key]) {
                // this.children[key].value = fromTimestamp(value[key]);
                this.children[key].value = value[key];
            }
        });
    }

    emitEvent(e) {
        if (this.blockEvent) {
            return;
        }
        e.stopPropagation();
        emitEvent(this, { value: this.value });
    }

    connected() {
        this.connect();
        this.connected = () => {};
    }

    connect() {
        this.on('input-change', (e) => {
            if (e.target === this) {
                e.stopPropagation();
                return;
            }
            this.emitEvent(e);
        });
    }

    disconnected() {
        this.destroy();
    }

    destroy() {
        super.destroy();
    }
}

function toTimestamp(value) {
    if (dates.isDate(value)) {
        return dates.toTimestamp(dates.toDate(value));
    }
    return value;
}

function fromTimestamp(value) {
    if (dates.isTimestamp(value)) {
        return dates.format(dates.fromTimestamp(value), 'MM/dd/yyyy');
    }
    return value;
}

function isNull(value) {
    return value === null || value === undefined;
}

module.exports = BaseComponent.define('ui-form', UiForm, {
    props: [],
    bools: [],
    attrs: ['value'],
});
