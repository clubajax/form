const BaseComponent = require('@clubajax/base-component');
const dom = require('@clubajax/dom');
const UiDropdown = require('./ui-dropdown');
const emitEvent = require('./lib/emitEvent');
require('./ui-icon');

class UiMiniTags extends UiDropdown {
    constructor() {
        super();
        this.popupClass = 'minitags';
        this.persistMultiple = true;
    }

    renderTag(id, label) {
        dom(
            'div',
            {
                class: 'ui-tag',
                'data-id': id,
                html: [dom('span', { html: label }), dom('ui-icon', { type: 'close' })],
            },
            this.button
        );
    }

    removeTag(id) {
        const node = dom.query(this, `[data-id="${id}"]`);
        if (!node) {
            return;
        }
        dom.destroy(node);
        const value = this.value;
        const index = value.findIndex((v) => v === id);
        value.splice(index, 1);
        this.value = value;
        this.checkHeight();
        emitEvent(this);
    }

    getNodeId(node) {
        return dom.attr(node, 'data-id');
    }

    getDisplayIds() {
        return dom.queryAll(this, '.ui-tag').map((n) => this.getNodeId(n));
    }

    setDisplay() {
        const ids = this.getDisplayIds();
        (this.value || []).forEach((val) => {
            if (!ids.includes(val)) {
                this.renderTag(val, this.data.find((d) => d.value === val).label);
            }
        });
        this.checkHeight();
    }

    renderButton() {
        this.button = dom('button', { id: this.buttonid, class: 'ui-button minitag-button', type: 'button' }, this);
        dom('ui-icon', {type: 'caretDown'}, this);
        this.on(this.button, 'click', (e) => {
            if (e.target.localName === 'ui-icon') {
                e.stopImmediatePropagation();
                const id = this.getNodeId(e.target.parentNode);
                this.removeTag(id);
            }
        });
        this.lazyListener();
        this.currentHeight = dom.box(this).h;
        this.setDisplay();
    }

    renderPopup() {
        super.renderPopup();
        const applyButton = dom('button', {class: 'ui-button', html: 'Done'});
        dom('div', {
            class: 'minitag-apply-container',
            html: applyButton
        }, this.popup);
        this.on(applyButton, 'click', () => {
            this.popup.hide();
        })
    }

    checkHeight() {
        const h = dom.box(this).h;
        if (h !== this.currentHeight) {
            this.currentHeight = h;
            if (this.popup) {
                this.popup.position();
            }
        }
    }
}

module.exports = BaseComponent.define('ui-minitags', UiMiniTags, {
    props: ['icon'],
});
