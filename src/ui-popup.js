const BaseComponent = require('@clubajax/base-component');
const dom = require('@clubajax/dom');

class UiPopup extends BaseComponent {
    constructor() {
        super();
        this.handleMediaQuery = this.handleMediaQuery.bind(this);
    }

    domReady() {
        this.component = this.children[0] || {};
        this.button = dom.byId(this.buttonid);
        if (this.label) {
            this.labelNode = dom('label', {class: 'ui-label', html: this.label});
            dom.place(this, this.labelNode, 0);
        }
        dom('div', {
            class: 'ui-button-row',
            html: [
                dom('button', {html: 'Close', class: 'ui-button tertiary'}),
                dom('button', {html: 'Done', class: 'ui-button tertiary'})
            ]
        }, this);
        this.connectEvents();
        if (!this.parentNode) {
            document.body.appendChild(this);
        }

        this.mq = window.matchMedia('(max-width: 415px)');
        this.mq.addListener(this.handleMediaQuery);
        this.handleMediaQuery(this.mq);
    }

    connectEvents() {
        if (this.button) {
            if (this['use-hover']) {
                this.on(this.button, 'mouseenter', this.show.bind(this));
                this.on('mouseleave', this.hidden.bind(this));
            } else {
                this.removeClickOff = this.on(this, 'clickoff', () => {
                    this.hide();
                });
                this.on(this.button, 'click', () => {
                    this.removeClickOff.resume();
                    this.show();
                });
            }
        }
        dom.queryAll('.ui-button-row .ui-button').forEach((button, i) => {
            this.on(button, 'click', () => {
                if (i === 1) {
                    if (this.component.emitEvent) {
                        this.component.blockEvent = false;
                        this.component.emitEvent();
                        this.component.blockEvent = true;
                    }
                } else if (this.component.reset){
                    this.component.reset();
                }
                this.hide();
            });
        });
    }

    handleMediaQuery(event) {
        if (event.matches) {
            this.component.blockEvent = true;
            this.isMobile = true;
            clearPosition(this);
            this.classList.add('is-mobile');
        } else {
            this.component.blockEvent = false;
            this.isMobile = false;
            this.classList.remove('is-mobile');
            position(this, this.button);
        }
    }

    show() {
        this.classList.add('open');
        if (!this.isMobile) {
            position(this, this.button);
        }
    }

    hide() {
        this.classList.remove('open');
        if (this.removeClickOff) {
            this.removeClickOff.pause();
        }
    }

    destroy() {
        this.removeClickOff.remove();
        this.mq.removeListener(this.handleMediaQuery);
        super.destroy();
    }
}


function clearPosition(popup) {
    dom.style(popup, {
        left: '',
        right: '',
        top: '',
        bottom: '',
        height: '',
        overflow: ''
    });
}
function position(popup, button) {
    clearPosition(popup);
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
    
    if (this.align === 'right' || (leftAligned > win.w && rightAligned > 0)) {
        // right
        style.top = btn.y + btn.h;
        style.right = win.w - (btn.x + btn.w);
    } else if (leftAligned < win.w) {
        // left
        style.top = btn.y + btn.h;
        style.left = btn.x;
    }

    if (pop.h > topSpace && pop.h > botSpace) {
        if (botSpace < MIN_BOT_SPACE || topSpace > botSpace * 1.5 ) {
            // force top
            style.height = topSpace - (GAP * 2);
            style.bottom = (win.h - btn.y);
            style.top = '';
            style.overflow = 'auto';
        } else {
            // force bottom
            style.height = botSpace - (GAP * 2);
            style.overflow = 'auto';
        }
    } else if (botSpace < pop.h) {
        // bottom
        style.top = '';
        style.bottom = (win.h - btn.y);
    }

    dom.style(popup, style);
}

module.exports = BaseComponent.define('ui-popup', UiPopup, {
    props: ['buttonid', 'label', 'button-selector', 'event-name', 'align', 'use-hover']
});
