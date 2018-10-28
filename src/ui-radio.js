const BaseComponent = require('@clubajax/base-component');
const dom = require('@clubajax/dom');
const on = require('@clubajax/on');
const emitEvent = require('./lib/emitEvent');
require('./ui-icon');
const FormElement = require('./FormElement');

const EVENT_NAME = 'change';

// CHECKED NOTE:!
//	widget.checked *is* a getter/setter
// the visual keys off of the attribute
//
// https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/checkbox

// TODO:
// ADA - for:label
//
// if standards=true
// checked is on or off
// value should corespond to name:
// set value=foo
// set name=bar
// get value={bar:foo}
// set checked
//
// if standards=false
// value is boolean
// checked is boolean
// value===checked

class CheckBox extends FormElement {

    get value() {
        if (this['is-radio']) {
            return dom.normalize(this.getAttribute('value'));
        }
        return !!this.checked;
    }

    set value(value) {
        if (this['is-radio']) {
            // this.setAttribute('value', value);
            // this.__value = value;
        } else {
            this.checked = value;
        }
    }

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
        this.labelNode = dom('span', {});
        dom('label', {
            html: [
                this['is-radio'] ? dom('div', { class: 'radio-button' }) : dom('ca-icon', { type: 'check' }),
                this.labelNode
            ]
        }, this);

        if (!this.readonly && !this.disabled) {
            this.setAttribute('tabindex', '0');
        }
    }
}

module.exports = BaseComponent.define('ui-radio', CheckBox, {
    props: [],
    bools: ['checked', 'standards'],
    attrs: []
});