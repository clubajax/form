const BaseComponent = require('@clubajax/base-component');
const dom = require('@clubajax/dom');
const FormElement = require('./lib/BaseField');
const uid = require('./lib/uid');
require('./ui-icon');

// CHECKED NOTE:!
// widget.checked *is* a getter/setter
// the visual keys off of the attribute
//
// https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/checkbox

class CheckBox extends FormElement {
    get value() {
        return this.intermediate ? null : Boolean(this.checked);
    }

    set value(value) {
        this.checked = value;
    }

    get event() {
        return {
            value: this.value,
            checked: this.checked,
            name: this.name,
        };
    }

    onChecked(value) {
        if (this.intermediate) {
            this.intermediate = false;
            this.input.type = 'check';
        }
        dom.attr(this.input, 'aria-checked', `${value}`);
    }

    onIntermediate(value) {
        if (value) {
            this.input.type = 'minus';
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
        this.connectEvents();
        this.connected = () => {};
    }

    connectEvents() {
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

        this.connected = () => {};
    }

    render() {
        const type = this.intermediate ? 'minus' : 'check';
        const html = this.label || '';
        const chkId = this.label ? this.id || uid('checkbox') : null;
        const lblId = this.label ? this.id || uid('label') : null;
        this.setAttribute('tabindex', '0');
        this.input = dom('ui-icon', {
            type,
            id: chkId,
            role: 'checkbox',
            'aria-labelledby': lblId,
            'aria-checked': false,
        });
        this.labelNode = dom('span', {html: html, class: 'ui-label', for: chkId, id: lblId});
        
        if (!this['check-after']) {
            this.appendChild(this.input);
            if (this.label) {
                this.appendChild(this.labelNode);
            }
        } else {
            if (this.label) {
                this.appendChild(this.labelNode);
            }
            this.appendChild(this.input);
        }

        if (this.label) {
            this.classList.add('has-label');
        }

        // RTK FIX
        // dom.attr(this, 'label', false);
    }

    disconnected() {
        this.destroy();
    }

    destroy() {
        super.destroy();
    }
}

module.exports = BaseComponent.define('ui-checkbox', CheckBox, {
    bools: ['checked', 'check-after', 'intermediate'],
    props: ['label']
    // attrs: ['value']
});
