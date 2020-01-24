const dom = require('@clubajax/dom');
const on = require('@clubajax/on');
const PopupList = require('./popup-list');

const DEFAULT_PLACEHOLDER = 'Select One...';

class DropDown extends PopupList {

    constructor() {
        super();
    }

    connected() {
        this.setAttribute('role', 'select');
        // important that the container has focus, because nothing can't lose focus
        // while selecting, or the blur will trigger a change event in React
        this.setAttribute('tabindex', '0');

        this.button = dom('div', {class: 'drop-btn'}, this);
        super.connected();

        if (this.label) {
            this.labelNode = dom('label', {html: this.label});
            this.insertBefore(this.labelNode, this.button);
        }
        this.connected = () => {};
    }

    update() {
        // console.log('update', this.value, this.__value);
        if (this.button) {
            let html;
            const placeholder = this.placeholder || DEFAULT_PLACEHOLDER;

            if (this.lazyDataFN) {
                const data = this.lazyDataFN();
                const item = data.find(m => this.value !== null ? m.value === this.value : m.selected);
                if (!item) {
                    html = placeholder;
                } else {
                    this.__value = item.value;
                    html = item.alias ? item.alias : item.label;
                }
            } else if (!this.selectedNode) {
                html = placeholder;
            } else {
                const item = this.getItem(dom.normalize(this.selectedNode.getAttribute('value')));
                html = item.alias ? item.alias : item.label;
            }

            if (typeof html === 'string') {
                this.button.innerHTML = html;
            } else {
                this.button.innerHTML = '';
                this.button.appendChild(html);
            }
            dom.classList.toggle(this.button, 'has-placeholder', html === placeholder);
        }
    }

    destroy() {
        super.destroy();
    }
}

customElements.define('drop-down', DropDown);

module.exports = DropDown;
