const BaseComponent = require('@clubajax/base-component');
const UiDropdown = require('./ui-dropdown');
const dom = require('@clubajax/dom');
require('./ui-icon');


class UiMiniTags extends UiDropdown {
    
    constructor() {
        super();
        this.popupClass = 'minitags';
        this.persistMultiple = true;
    }

    renderTag(id, label) {
        dom('div', {
            class: 'ui-tag',
            'data-id': id,
            html: [
                dom('span', {html: label}),
                dom('ui-icon', {type: 'close'})
        ]}, this.button);
    }

    getNodeId(node) {
        return dom.attr(node, 'data-id');    
    }

    getDisplayIds() {
        return dom.queryAll(this, '.ui-tag').map(n => this.getNodeId(n))
    }

    setDisplay() {
        const ids = this.getDisplayIds();

        console.log('this.value', this.value);
        (this.value || []).forEach((val) => {
            console.log('VAL', val);
            if (!ids.includes(val)) {
                this.renderTag(val, this.data.find(d => d.value === val).label);
            }
        })
    }

    renderButton() {
        this.button = dom('button', {id: this.buttonid, class: 'ui-button drop-input', type: 'button'}, this);
        this.on(this.button, 'click', (e) => {
            console.log('VALUE', this.value);
            if (e.target.localName === 'ui-icon') {
                e.stopImmediatePropagation();
            }
            const id = this.getNodeId(e.target);
        });
        if (typeof this.data === 'function') {
            this.once(
                this.button,
                'click',
                () => {
                    this.setLazyData();
                },
                null
            );
            this.once(
                this.button,
                'keydown',
                (e) => {
                    if (e.key === 'Enter') {
                        this.setLazyData();
                    }
                },
                null
            );
        }
        this.setDisplay();
    }
}

module.exports = BaseComponent.define('ui-minitags', UiMiniTags, {
    props: ['icon']
});