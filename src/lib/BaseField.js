const BaseComponent = require('@clubajax/base-component');
const dom = require('@clubajax/dom');
const emitEvent = require('./emitEvent');

class FormElement extends BaseComponent {

    onReadonly(value) {
        dom.attr(this, 'tabindex', value ? false : '0');
    }

    onDisabled(value) {
        dom.attr(this, 'tabindex', value ? false : '0');
    }

    onLabel(value) {
        if (this.labelNode) {
            this.labelNode.innerHTML = value;
        }
    }

    canEmit() {
        return !this['no-event'] && !this.readonly && !this.disabled;
    }

    emitEvent() {
        const event = this.event || {
            value: this.value,
            name: this.name
        };
        emitEvent(this, event);
    }

}

module.exports = BaseComponent.define('ui-form-element', FormElement, {
    props: ['label', 'name', 'event-name', 'placeholder'],
    bools: ['no-event', 'disabled', 'readonly', 'autofocus', 'required'],
    attrs: ['value']
});
