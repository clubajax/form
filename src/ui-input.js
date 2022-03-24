const BaseComponent = require('@clubajax/base-component');
const dom = require('@clubajax/dom');
const emitEvent = require('./lib/emitEvent');
require('./ui-icon');

const DEFAULT_PLACEHOLDER = 'Enter text...';

class UiInput extends BaseComponent {
    constructor() {
        super();
        this.readonly = false;
        this.disabled = false;
        this.placeholder = null;
        this.icon = null;
        // this.label = null;

        this.destroyOnDisconnect = !this.noselfdestroy;
    }

    attributeChanged(prop, value) {
        if (prop === 'value') {
            this.value = value;
        }
    }

    set value(value) {
        this._value = isNull(value) ? '' : value;
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
        if (this.iconNode && type) {
            this.iconNode.type = type;
        } else if (type) {
            if (this.icon) {
                this.iconNode = dom('ui-icon', { type }, this);
                this.classList.add('has-icon');
            }
        }
    }

    onLabel() {
        if (this.label) {
            this.labelNode.innerHTML = this.label;
        }
    }

    onDisabled(value) {
        if (this.input) {
            this.input.disabled = value;
        }
    }

    onReadonly(value) {
        if (this.input) {
            this.input.readonly = value;
            dom.attr(this.input, 'tabindex', value ? '-1' : false);
        }
    }

    onPlaceholder(value) {
        this.setPlaceholder(value);
    }

    setPlaceholder(value) {
        if (value) {
            dom.classList.toggle(this, 'has-placeholder');
            if (this.input) {
                this.input.placeholder = value;
            }
        }
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
        this.on(
            this.input,
            'blur',
            () => {
                this.focused = false;
                this.emit('blur');
                this.classList.remove('focus');
            },
            null,
        );
        this.on(
            this.input,
            'focus',
            () => {
                this.focused = true;
                this.emit('focus');
                this.classList.add('focus');
                if (this.autoselect) {
                    this.input.select();
                }
            },
            null,
        );
        this.on(this.input, 'change', this.emitEvent.bind(this), null);

        this.on('click', (e) => {
            if (e.target.localName === 'ui-icon' && (this.iconNode || {}).type === 'close') {
                e.preventDefault();
                e.stopImmediatePropagation();
                this.value = '';
                this.fire('clear');
                this.iconNode.type = 'search';
            }
            this.focus();
            this.input.select();
        });
    }

    focus() {
        this.input.focus();
    }

    render() {
        if (this.label) {
            this.labelNode = dom('label', { html: this.label }, this);
        }
        let pNode = this;
        if (!this['no-border']) {
            pNode = dom('div', { class: 'input-border' }, this);
        }
        this.input = dom(
            'input',
            {
                value: isNull(this._value) ? '' : this._value,
                readonly: this.readonly,
                disabled: this.disabled,
                placeholder: this.placeholder || DEFAULT_PLACEHOLDER,
            },
            pNode,
        );
        if (this.icon) {
            this.iconNode = dom('ui-icon', { type: this.icon }, pNode);
            this.classList.add('has-icon');
        }
        this.setPlaceholder();

        this.connect();

    }

    disconnected() {
        if (!this.noselfdestroy) {
            setTimeout(() => {
                if (this.DOMSTATE !== 'domready') {
                    this.destroy();
                }
            }, 500);
        }
    }

    destroy() {
        super.destroy();
    }
}

function isNull(value) {
    return value === null || value === undefined;
}

module.exports = BaseComponent.define('ui-input', UiInput, {
    props: ['placeholder', 'label', 'limit', 'name', 'event-name', 'align', 'icon'],
    bools: ['disabled', 'ready', 'required', 'autofocus', 'autoselect', 'readonly', 'no-border', 'noselfdestroy'],
    attrs: ['value'],
});
