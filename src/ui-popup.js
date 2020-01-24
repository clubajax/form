const BaseComponent = require('@clubajax/base-component');
const dom = require('@clubajax/dom');
const on = require('@clubajax/on');
const keys = require('@clubajax/key-nav');
const emitEvent = require('./lib/emitEvent');
const uid = require('./lib/uid');

// TODO
// allow for a variable size list

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

    connected() {
        
    }

    domReady() {
        this.button = dom.byId(this.buttonid);
        this.connectEvents();
    }

    connectEvents() {
        if (this.button) {
            if (this['use-hover']) {
                this.on(this.button, 'mouseenter', this.show.bind(this));
                this.on('mouseleave', this.hidden.bind(this));
            } else {
                this.removeClickOff = this.on(this, 'clickoff', (e) => {
                    this.hide();
                });
                this.on(this.button, 'click', () => {
                    this.removeClickOff.resume();
                    this.show();
                });
            }
        }
    }

    show() {
        this.classList.add('open');
        position(this, this.button);
    }

    hide() {
        this.classList.remove('open');
        if (this.removeClickOff) {
            this.removeClickOff.pause();
        }
    }

    destroy() {
        this.removeClickOff.remove();
        super.destroy();
    }
}


function position(popup, button) {
    dom.style(popup, {
        left: '',
        right: '',
        top: '',
        bottom: '',
        height: '',
        overflow: ''
    });
    const win = {
        w: window.innerWidth,
        h: window.innerHeight
    };
    const pop = dom.box(popup);
    const btn = dom.box(button);
    const GAP = 5;
    const MIN_BOT_SPACE = 200;
    const style = {};
    const leftAligned = btn.x + pop.w;
    const rightAligned = btn.x + btn.w - pop.w;

    const topSpace = btn.top;
    const botSpace = win.h - (btn.top + btn.h + GAP);
    
    console.log('win', win.h);
    console.log('SPC', topSpace, botSpace);

    if (this.align === 'right' || (leftAligned > win.w && rightAligned > 0)) {
        // right
        style.top = btn.y + btn.h + GAP;
        style.right = win.w - (btn.x + btn.w);
    } else if (leftAligned < win.w) {
        // left
        style.top = btn.y + btn.h + GAP;
        style.left = btn.x;
    }

    if (pop.h > topSpace && pop.h > botSpace) {
        if (botSpace < MIN_BOT_SPACE || topSpace > botSpace * 1.5 ) {
            // force top
            console.log('TOP');
            style.height = topSpace - (GAP * 2);
            style.bottom = (win.h - btn.y) + GAP;
            style.top = '';
            style.overflow = 'auto';
        } else {
            // force bottom
            console.log('BOTTOM');
            style.height = botSpace - (GAP * 2);
            // style.bottom = (win.h - btn.y) + GAP;
            style.overflow = 'auto';
        }
    } else if (botSpace < pop.h) {
        // bottom
        style.top = '';
        style.bottom = (win.h - btn.y) + GAP;
    }

    dom.style(popup, style);
}

module.exports = BaseComponent.define('ui-popup', UiPopup, {
    props: ['buttonid', 'button-selector', 'event-name', 'align', 'use-hover']
});
