const BaseComponent = require('@clubajax/base-component');
const dom = require('@clubajax/dom');

class UiPopup extends BaseComponent {
    constructor() {
        super();
        this.handleMediaQuery = this.handleMediaQuery.bind(this);
    }

    onOpen(value) {
        this.onDomReady(() => {
            if (value) {
                this.show();
            } else {
                this.hide();
            }
        });
    }

    domReady() {
        this.component = this.children[0] || {};
        this.button = dom.byId(this.buttonid);
        if (!this.button) {
            throw new Error(
                'ui-tooltip must be associated with a parent via the parnetid'
            );
        }
        // mobile label for dropdowns
        if (this.label) {
            this.labelNode = dom('label', {
                class: 'ui-label',
                html: this.label,
            });
            dom.place(this, this.labelNode, 0);
        }
        // mobile button for dropdowns
        dom(
            'div',
            {
                class: 'ui-button-row',
                html: [
                    dom('button', {
                        html: 'Close',
                        class: 'ui-button tertiary',
                    }),
                    dom('button', {
                        html: 'Done',
                        class: 'ui-button tertiary',
                    }),
                ],
            },
            this
        );
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
                this.connectHoverEvents();
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
        dom.queryAll(this, '.ui-button-row .ui-button').forEach((button, i) => {
            this.on(button, 'click', () => {
                if (i === 1) {
                    if (this.component.emitEvent) {
                        this.component.blockEvent = false;
                        this.component.emitEvent();
                        this.component.blockEvent = true;
                    }
                } else if (this.component.reset) {
                    this.component.reset();
                }
                this.hide();
            });
        });
    }

    connectHoverEvents() {
        const HIDE_TIMEOUT = this['hide-timer'] || 500;
        let timer;
        const show = () => {
            clearTimeout(timer);
            this.show();
        };
        const hide = () => {
            timer = setTimeout(() => {
                this.hide();
            }, HIDE_TIMEOUT);
        };
        this.on(this.button, 'mouseenter', show);
        this.on(this.button, 'mouseleave', hide);
        this.on('mouseenter', show);
        this.on('mouseleave', hide);
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
            console.log('ALIGN', this.align);
            position(this, this.button, this.align);
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
        overflow: '',
    });
}

function positionTooltip(popup, button, align) {
    clearPosition(popup);
    const win = {
        w: window.innerWidth,
        h: window.innerHeight,
    };
    const pop = dom.box(popup);
    const btn = dom.box(button);
    const GAP = 15;
    const style = {};

    function midY() {
        if (btn.h > pop.h) {
            return btn.y + ((btn.h - pop.h) / 2);
        }
        return btn.y - ((pop.h - btn.h) / 2);
    }
    function midX() {
        if (btn.w > pop.w) {
            return btn.x + ((btn.w - pop.w) / 2);
        }
        return btn.x - ((pop.w - btn.w) / 2);
    }
    function right() {
        style.top = midY();
        style.left = btn.x + btn.w + GAP;

    }
    function left() {
        style.top = midY();
        style.right = win.w - btn.x + GAP;
    }
    function bottom() {
        style.left = midX();
        style.top = btn.y + btn.h + GAP;
    }
    function top() {
        style.left = midX();
        style.top = btn.y - pop.h - GAP;
    }

    switch (align) {
        case 'R':
            if (btn.x + btn.w + pop.w + GAP > win.w) {
                left();
            } else {
                right();
            }
            break;
        case 'L':
            if (btn.x - pop.w - GAP < 0) {
                right();
            } else {
                left();
            }
            break;
        case 'T':
            if (btn.y - pop.h - GAP < 0) {
                bottom();
            } else {
                top();
            }
            break;
        default:
            if (btn.y + btn.h + pop.h + GAP > win.h) {
                top();
            } else {
                bottom();
            }
    }

    dom.style(popup, style);
}

function position(popup, button, align) {
    if (align && align.length === 1) {
        positionTooltip(popup, button, align);
        return;
    }
    clearPosition(popup);
    const win = {
        w: window.innerWidth,
        h: window.innerHeight,
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

    if (align === 'right' || (leftAligned > win.w && rightAligned > 0)) {
        // right
        style.top = btn.y + btn.h;
        style.right = win.w - (btn.x + btn.w);
    } else if (leftAligned < win.w) {
        // left
        style.top = btn.y + btn.h;
        style.left = btn.x;
    }

    if (pop.h > topSpace && pop.h > botSpace) {
        if (botSpace < MIN_BOT_SPACE || topSpace > botSpace * 1.5) {
            // force top
            style.height = topSpace - GAP * 2;
            style.bottom = win.h - btn.y;
            style.top = '';
            style.overflow = 'auto';
        } else {
            // force bottom
            style.height = botSpace - GAP * 2;
            style.overflow = 'auto';
        }
    } else if (botSpace < pop.h) {
        // bottom
        style.top = '';
        style.bottom = win.h - btn.y;
    }

    dom.style(popup, style);
}

module.exports = BaseComponent.define('ui-popup', UiPopup, {
    props: ['buttonid', 'label', 'align', 'use-hover'],
    bools: ['open'],
});
