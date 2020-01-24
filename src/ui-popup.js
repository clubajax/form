const BaseComponent = require('@clubajax/base-component');
const dom = require('@clubajax/dom');
const on = require('@clubajax/on');
const keys = require('@clubajax/key-nav');
const emitEvent = require('./lib/emitEvent');
const uid = require('./lib/uid');

class UiPopup extends BaseComponent {
    constructor() {
        super();
        this.open = false;
    }

    attributeChanged(prop, value) {
        if (prop === 'open') {
            // this.value = value;
        }
    }
}

function position(popup, button) {
    popup.classList.remove('right-aligned');
    popup.classList.remove('top-aligned');
    popup.classList.remove('center-aligned');
    dom.style(popup, {
        height: '',
        left: '',
        width: ''
    });
    const win = {
        w: window.innerWidth,
        h: window.innerHeight
    };
    const pop = dom.box(popup);
    const btn = dom.box(button);

    const leftAligned = btn.x + pop.w;
    const rightAligned = btn.x + btn.w - pop.w;

    const topSpace = btn.top;
    const botSpace = win.h - (btn.top + btn.h);

    if (this.align === 'right' || leftAligned > win.w && rightAligned > 0) {
        popup.classList.add('right-aligned');
    } else if (leftAligned < win.w) {
        popup.classList.remove('right-aligned');
    } else {
        popup.classList.add('center-aligned');
        const pad = dom.style(document.body, 'padding');
        let left, wpad;
        // FIXME
        // works for smart-ar - but what about right-aligned buttons?
        if (pad) {
            left = btn.x * -1 + pad;
            wpad = pad * 2;
        } else {
            left = btn.x * -1 + 10;
            wpad = 20;
        }
        dom.style(popup, {
            left,
            width: win.w - wpad
        });
    }

    if (pop.h > botSpace && pop.h < topSpace) {
        popup.classList.add('top-aligned');

    } else if (pop.h < botSpace) {
        popup.classList.remove('top-aligned');

    } else if (botSpace > topSpace) {
        // bottom, and scroll
        popup.classList.remove('top-aligned');
        dom.style(popup, 'height', botSpace - 100);
    } else {
        // top and scroll
        popup.classList.add('top-aligned');
        dom.style(popup, 'height', topSpace - 20);
    }
}

module.exports = BaseComponent.define('ui-popup', UiPopup, {
    props: ['placeholder', 'label', 'limit', 'name', 'event-name', 'align', 'btn-class'],
    bools: ['disabled', 'open-when-blank', 'allow-new', 'required', 'case-sensitive', 'autofocus', 'busy'],
    attrs: ['value']
});
