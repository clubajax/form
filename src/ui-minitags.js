const BaseComponent = require('@clubajax/base-component');
const UiDropdown = require('./ui-dropdown');
const dom = require('@clubajax/dom');
require('./ui-icon');


class UiMiniTags extends UiDropdown {
    
    constructor() {
        super();
        this.popupClass = 'actionbutton';
    }

    setDisplay() {
        dom('div', {
            class: 'ui-tag',
            html: [
                dom('span', {html: 'Mike Wilcox'}),
                dom('ui-icon', {type: 'close'})
        ]}, this.button);
    }

    renderButton() {
        this.button = dom('button', {id: this.buttonid, class: 'ui-button drop-input', type: 'button'}, this);
        this.on(this.button, 'click', (e) => {
            console.log('E', e.target.localName);
            if (e.target.localName === 'ui-icon') {
                // e.preventDefault();
                // e.stopPropagation();
                e.stopImmediatePropagation();
            }
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