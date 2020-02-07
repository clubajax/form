const BaseComponent = require('@clubajax/base-component');
const dom = require('@clubajax/dom');
const popup = require('./ui-popup');

class UiTooltip extends BaseComponent {
    domReady() {
        if (!this.value && this.innerHTML.length) {
            this.value = this.innerHTML;
            this.innerHTML = '';
        }
        this.render();
    }

    render() {
        const align = this.align || 'R';
        dom('ui-popup', {
            html: dom('div', {
                class: `ui-tooltip ${this.className}`,
                html: this.value
            }),
            buttonid: this.parentNode,
            'use-hover': true,
            align,
            'hide-timer': this['hide-timer'],
            open: this.open
        }, document.body);
    }
}

module.exports = BaseComponent.define('ui-tooltip', UiTooltip, {
    props: ['align', 'hide-timer'],
    attrs: ['value', 'open']
});
