const BaseComponent = require('@clubajax/base-component');
const dom = require('@clubajax/dom');
const popup = require('./ui-popup');

class UiTooltip extends BaseComponent {
    constructor() {
        super();
        this.open;
    }
    domReady() {
        if (!this.value && this.innerHTML.length) {
            this.value = this.innerHTML;
            this.innerHTML = '';
        }
        this.render();
        this.connect();
    }

    render() {
        const align = this.align || 'R';
        this.popup = dom('ui-popup', {
            html: dom('div', {
                class: `ui-tooltip ${this.className}`,
                html: this.value
            }),
            buttonid: this['is-button'] ? this.parentNode.parentNode : this.parentNode,
            'use-hover': this['use-click'] ? false : true,
            align,
            'hide-timer': this['hide-timer'],
            open: this.open
        }, document.body);
    }

    connect() { 
        this.on('tooltip-close', () => { 
            this.popup.hide();    
        })
    }

    close() { 
        this.popup.hide();
    }

    destroy() {
        super.destroy();
        this.popup.destroy();
    }
}

module.exports = BaseComponent.define('ui-tooltip', UiTooltip, {
    props: ['align', 'hide-timer'],
    attrs: ['value', 'open'],
    bools: ['use-click', 'is-button']
});

