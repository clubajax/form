const BaseComponent = require('@clubajax/base-component');
const dom = require('@clubajax/dom');
const FormElement = require('./FormElement');

class Radio extends FormElement {

    // get value() {
    //     // return dom.normalize(this.getAttribute('value'));
    //     return !!this.checked;
    // }

    // set value(value) {
    //     if (this['is-radio']) {
    //         // this.setAttribute('value', value);
    //         // this.__value = value;
    //     } else {
    //         this.checked = value;
    //     }
    // }

    get event() {
        return {
            value: this.value,
            checked: this.checked,
            name: this.name
        }
    }

    setValue(value, silent) {
        this.value = value;
        if (!silent && this.canEmit()) {
            this.emitEvent();
        }
    }

    toggle() {
        this.checked = !this.checked;
        if (this.canEmit()) {
            this.emitEvent();
        } else {
            this.fire('toggle', { value: this.value });
        }
    }

    connected() {
        this.render();
        this.on('keyup', (e) => {
            if (!this.canEmit()) {
                return;
            }
            if (e.key === 'Enter' || e.key === 'Spacebar' || e.key === ' ') {
                this.toggle();
            }
        });
        this.on('click', (e) => {
            if (!this.canEmit()) {
                return;
            }
            this.toggle();
        });
        this.connected = () => { };
    }

    render() {
        const html = this.label || '';
        if (this['check-after']) {
            this.labelNode = dom('label', { html }, this);
            this.icon = dom('div', { class: 'radio-button' }, this);
        } else {
            this.icon = dom('div', { class: 'radio-button' }, this);
            this.labelNode = dom('label', { html }, this);
        }

        if (!this.readonly && !this.disabled) {
            this.setAttribute('tabindex', '0');
        }
    }
}

module.exports = BaseComponent.define('ui-radio', Radio, {
    props: [],
    bools: ['checked', 'check-after'],
    attrs: []
});