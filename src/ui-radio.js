const BaseComponent = require('@clubajax/base-component');
const dom = require('@clubajax/dom');
const FormElement = require('./FormElement');
const uid = require('./lib/uid');

class Radio extends FormElement {
    get event() {
        return {
            value: this.value,
            checked: this.checked,
            name: this.name
        }
    }

    onChecked(value) {
        dom.attr(this.input, 'aria-checked', `${value}`);
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
        const chkId = this.label ? (this.id || uid('radio')) : null;
        const lblId = this.label ? (this.id || uid('label')) : null;

        this.labelNode = dom('span', { html, class: 'ui-label', 'for': chkId, id: lblId });
        this.input = dom('div', { class: 'radio-button', id: chkId, role: 'radio', 'aria-labelledby': lblId, 'aria-checked': false, tabindex: '0' });
        
        if (this['check-after']) {
            this.appendChild(this.labelNode);
            this.appendChild(this.input);
        } else {
            this.appendChild(this.input);
            this.appendChild(this.labelNode);
        }

        dom.attr(this, 'label', false);
    }
}

module.exports = BaseComponent.define('ui-radio', Radio, {
    props: [],
    bools: ['checked', 'check-after'],
    attrs: []
});