const BaseComponent = require('@clubajax/base-component');
const dom = require('@clubajax/dom');
const on = require('@clubajax/on');

class UiMiniPop extends BaseComponent {
    constructor() {
        super();
        this.showing = true; 
    }

    show() {
        if (this.showing || this.readonly) {
            return;
        }
        this.showing = true;
        this.size();

        setTimeout(() => {
            this.classList.add('open');
        }, 1);
        this.fire('popup-open', null, true);
    }

    hide() {
        if (!this.showing || window.keepPopupsOpen) {
            return;
        }
        this.classList.remove('open');
        this.showing = false;
        this.fire('popup-close', null, true);
    }

    connected() {
        this.renderApply();
    }

    renderApply() {
        const applyButton = dom('button', { class: 'ui-button', html: 'Done' });
        dom(
            'div',
            {
                class: 'apply-container',
                html: applyButton,
            },
            this
        );
        this.on(applyButton, 'click', () => {
            this.hide();
        });
    }

    size() {
        const w = dom.box(this.parentNode).w;
        dom.style(this, 'width', w);
    }
}


module.exports = BaseComponent.define('ui-minipop', UiMiniPop, {
    props: ['align'],
    bools: ['open'],
});
