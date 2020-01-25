const BaseComponent = require('@clubajax/base-component');
const dom = require('@clubajax/dom');
const uid = require('./lib/uid');
require('./ui-popup');
require('./ui-list');
require('./ui-icon');

const DEFAULT_PLACEHOLDER = 'Select One...';

class UiDropdown extends BaseComponent {

    set value(value) {
        this.onDomReady(() => {
            this.list.value = value;
            this.setDisplay();
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

    setDisplay() {
        this.button.innerHTML = '';
        const item = this.list ? this.list.getItem(this.value) : {};
        dom('span', {html: isNull(this.value) ? this.placeholder || DEFAULT_PLACEHOLDER : item.label}, this.button);
        dom('ui-icon', {type: 'caretDown'}, this.button);

        if (this.popup) {
            dom.style(this.popup, {
                'min-width': dom.box(this.button).w
            });
        }
    }

    connected() {
        this.render();
        this.connectEvents();
        this.connected = () => {};
    }

    connectEvents() {
        this.list.on('list-change', (e) => {
            console.log('list change', e.detail.value);
            this.setDisplay();
            setTimeout(() => {
                this.popup.hide();
            }, 300);
        });
        this.on(this.button, 'keyup', (e) => {
            console.log('up');
        });
    }

    renderButton(buttonid) {
        this.button = dom('button', {id: buttonid, class: 'drop-input'}, this);
        this.setDisplay();
    }

    render() {
        console.log('render!!');
        const buttonid = uid('drop-button');
        this.renderButton(buttonid);
        this.list = dom('ui-list', {
            'event-name': 'list-change'
        });
        this.popup = dom('ui-popup', {
            buttonid,
            html: this.list
        }, document.body);
        this.setDisplay();
    }
}

function isNull(value) {
    return value === null || value === undefined;
}

module.exports = BaseComponent.define('ui-dropdown', UiDropdown, {
    props: ['placeholder', 'label', 'limit', 'name', 'event-name', 'align', 'btn-class'],
    bools: ['disabled', 'open-when-blank', 'allow-new', 'required', 'case-sensitive', 'autofocus', 'busy'],
    attrs: ['value']
});
