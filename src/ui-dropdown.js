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
        this.onDomReady(() => {
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
        this.__value = item ? item.value : this.__value;
        dom('span', {html: isNull(this.value) ? this.placeholder || DEFAULT_PLACEHOLDER : item.label}, this.button);
        dom('ui-icon', {type: 'caretDown'}, this.button);

        if (this.popup) {
            dom.style(this.popup, {
                'min-width': dom.box(this.button).w
            });
        }
    }

    reset() {
        this.list.reset();
    }

    connected() {
        this.render();
        this.connectEvents();
        this.connected = () => {};
    }

    connectEvents() {
        this.list.on('list-change', (e) => {
            this.setDisplay();
            setTimeout(() => {
                this.popup.hide();
            }, 300);
        });
    }

    reset() {
        // this.list.value = 
    }

    renderButton(buttonid) {
        this.button = dom('button', {id: buttonid, class: 'ui-button drop-input'}, this);
        this.setDisplay();
    }

    render() {
        this.labelNode = dom('label', {html: this.label, class: 'ui-label'}, this);
        const buttonid = uid('drop-button');
        this.renderButton(buttonid);
        this.list = dom('ui-list', {
            'event-name': 'list-change'
        });
        this.popup = dom('ui-popup', {
            buttonid,
            label: this.label,
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
