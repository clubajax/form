const BaseComponent = require('@clubajax/base-component');
const dom = require('@clubajax/dom');
const uid = require('./lib/uid');
require('./ui-popup');
require('./ui-list');

const DEFAULT_PLACEHOLDER = 'Select One...';

class UiDropdown extends BaseComponent {

    set value(value) {
        this.onDomReady(() => {
            this.list.value = value;
        });
        this.__value = value;
    }

    get value() {
        if (!this.list) {
            return this.__value || this.getAttribute('value');
        }
        return this.list.value;
    }

    set data(data) {
        console.log('data...');
        this.onDomReady(() => {
            console.log('domready...', this.list);
            console.log('on dom ready');
            this.list.data = data;
        });
        this.__data = data;
    }

    get data() {
        return this.list ? this.list.items : this.__data;
    }

    connected() {
        this.render();
    }

    // domReady() {
    //     console.log('lifcycle');
    // }

    render() {
        console.log('render!!');
        const buttonid = uid('drop-button');
        this.button = dom('input', {id: buttonid, class: 'drop-input'}, this);
        this.list = dom('ui-list', {});
        this.popup = dom('ui-popup', {
            buttonid,
            html: this.list
        }, document.body);
    }
}

module.exports = BaseComponent.define('ui-dropdown', UiDropdown, {
    props: ['placeholder', 'label', 'limit', 'name', 'event-name', 'align', 'btn-class'],
    bools: ['disabled', 'open-when-blank', 'allow-new', 'required', 'case-sensitive', 'autofocus', 'busy'],
    attrs: ['value']
});
