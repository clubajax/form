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

    size() {

    }
}


module.exports = BaseComponent.define('ui-minipop', UiMiniPop, {
    props: ['align'],
    bools: ['open'],
});
