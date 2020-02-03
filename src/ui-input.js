const BaseComponent = require('@clubajax/base-component');
const dom = require('@clubajax/dom');
const emitEvent = require('./lib/emitEvent');
require('./ui-icon');

const DEFAULT_PLACEHOLDER = 'Enter text...';

class UiInput extends BaseComponent {
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

    emitEvent(e) {
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
        this.on(this.input, 'change', this.emitEvent.bind(this));
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
