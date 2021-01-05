const BaseComponent = require('@clubajax/base-component');
const dom = require('@clubajax/dom');
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
        this.setValue(this._value);
    }

    get value() {
        const children = this.children;
        return Object.keys(children).reduce((acc, key) => { 
            acc[key] = children[key].value;
            return acc;
        }, {})
    }

    get children() {
        if (!this._children || !this._children.length) {
            this._children = dom.queryAll(this, '[name]').reduce((acc, node) => {
                const name = dom.attr(node, 'name');
                acc[name] = node;
                return acc;
            }, {});
        }
        return this._children;
    }

    clear() { 
        const children = this.children;
        return Object.keys(children).forEach((key) => { 
            children[key].value = '';
        }, {})
    }

    setValue(value) {
        Object.keys(value).forEach((key) => {
            if (this.children[key]) {
                this.children[key].value = value[key];
            }
        });
    }

    emitEvent(e) {
        e.stopPropagation();
        this._value = this.input.value;
        emitEvent(this, this._value);
    }

    connected() {
        this.connect();
        this.connected = () => {};
    }

    connect() {
        // console.log('connect form');
    }

    disconnected() {
        this.destroy();
    }

    destroy() {
        super.destroy();
    }
}

function isNull(value) {
    return value === null || value === undefined;
}

module.exports = BaseComponent.define('ui-form', UiForm, {
    props: [],
    bools: [],
    attrs: ['value'],
});
