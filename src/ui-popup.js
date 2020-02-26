const BaseComponent = require('@clubajax/base-component');
const dom = require('@clubajax/dom');
const on = require('@clubajax/on');

// detach popup from body when not showing
// - unless keepPopupsAttached
class UiPopup extends BaseComponent {
    constructor() {
        super();
        this.showing = false;
        this.handleMediaQuery = this.handleMediaQuery.bind(this);
        this.align;
        this.buttonid;
        this.label;
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
                'ui-tooltip must be associated with a parent via the parentid'
            );
        }

        this.connectEvents();
        if (!this.parentNode) {
            document.body.appendChild(this);
        }

        this.mq = window.matchMedia('(max-width: 415px)');
        this.mq.addListener(this.handleMediaQuery);
        this.handleMediaQuery(this.mq);
    }

    renderMobileButtons() {
        if (this['use-hover']) {
            // this is a tooltip, not a dropdown
            return;
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
        dom.queryAll(this, '.ui-button-row .ui-button').forEach((button, i) => {
            this.mobileEvents = this.on(button, 'click', () => {
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

    removeMobileButtons() {
        dom.queryAll(this, '.ui-button-row .ui-button').forEach(button => {
            dom.destroy(button);
        });
        dom.destroy(this.labelNode);
        if (this.mobileEvents) {
            this.mobileEvents.remove();
        }
    }

    connectEvents() {
        if (this.button) {
            if (this['use-hover']) {
                this.connectHoverEvents();
            } else {
                this.clickoff = on.makeMultiHandle([
                    on(this, 'clickoff', (e) => {
                        if (!e.target.hasAttribute('data-no-clickoff')) {
                            this.hide();
                        }
                    }),
                    onScroll(this.hide.bind(this), this),
                ]);
                this.on(this.button, 'click', e => {
                    this.show();
                });
                this.on(this.button, 'keydown', e => {
                    if (e.key === 'Enter' && !this.showing) {
                        // prevent key-nav from detecting Enter when not open
                        e.preventDefault();
                        this.show();
                    }
                });
            }
        }
    }

    connectHoverEvents() {
        const HIDE_TIMEOUT = this['hide-timer'] || 500;
        let timer;
        const show = () => {
            clearTimeout(timer);
            this.show();
        };
        const hide = immediate => {
            if (immediate === true) {
                this.hide();
                return;
            }
            timer = setTimeout(() => {
                this.hide();
            }, HIDE_TIMEOUT);
        };
        this.on(this.button, 'mouseenter', show);
        this.on(this.button, 'mouseleave', hide);
        this.on('mouseenter', show);
        this.on('mouseleave', hide);
        this.clickOff = onScroll(hide);
        this.clickOff.resume();
    }

    handleMediaQuery(event) {
        if (event.matches) {
            this.component.blockEvent = true;
            this.isMobile = true;
            clearPosition(this);
            this.classList.add('is-mobile');
            this.renderMobileButtons();
        } else {
            this.component.blockEvent = false;
            this.isMobile = false;
            this.classList.remove('is-mobile');
            position(this, this.button);
            this.removeMobileButtons();
        }
    }

    show() {
        if (this.showing) {
            return;
        }
        this.showing = true;
        this.classList.add('open');
        if (this.clickoff) {
            this.clickoff.resume();
        }
        if (!this.isMobile) {
            position(this, this.button, this.align);
        }
        this.fire('popup-open');
    }

    hide() {
        if (!this.showing || window.keepPopupsOpen) {
            return;
        }
        this.showing = false;
        this.classList.remove('open');
        if (this.clickoff) {
            this.clickoff.pause();
        }
        this.fire('popup-close');
    }

    destroy() {
        if (this.clickoff) {
            this.clickoff.remove();
        }
        if (this.mq) {
            this.mq.removeListener(this.handleMediaQuery);
        }
        super.destroy();
    }
}

function clearPosition(popup, tooltip) {
    if (tooltip) {
        dom.classList.remove(tooltip, 'T R B L');
    }
    dom.style(popup, {
        left: '',
        right: '',
        top: '',
        bottom: '',
        height: '',
        width: '',
        overflow: '',
    });
}

function positionTooltip(popup, button, align) {
    const LOG = window.debugPopups;
    const tooltip = dom.query(popup, '.ui-tooltip');
    clearPosition(popup, tooltip);
    const win = {
        w: window.innerWidth,
        h: window.innerHeight,
    };
    const pop = dom.box(popup);
    const btn = dom.box(button);
    const GAP = 15;
    const style = {};

    LOG &&
        console.log(
            'align:',
            align,
            '\nbutton:',
            button,
            '\npopup:',
            popup,
            '\nwin',
            win,
            '\npop',
            pop,
            '\nbtn',
            btn
        );

    function addClass(cls) {
        if (tooltip) {
            tooltip.classList.add(cls);
        }
    }

    function midY() {
        if (btn.h > pop.h) {
            return btn.y + (btn.h - pop.h) / 2;
        }
        return btn.y - (pop.h - btn.h) / 2;
    }
    function midX() {
        if (btn.w > pop.w) {
            return btn.x + (btn.w - pop.w) / 2;
        }
        return btn.x - (pop.w - btn.w) / 2;
    }
    function right() {
        style.top = midY();
        style.left = btn.x + btn.w + GAP;
        addClass('R');
    }
    function left() {
        style.top = midY();
        style.right = win.w - btn.x + GAP;
        addClass('L');
    }
    function bottom() {
        style.left = midX();
        style.top = btn.y + btn.h + GAP;
        addClass('B');
    }
    function top() {
        style.left = midX();
        style.top = btn.y - pop.h - GAP;
        addClass('T');
    }

    const fitR = () => btn.x + btn.w + pop.w + GAP < win.w;
    const fitL = () => btn.x - pop.w - GAP > 0;
    const fitT = () => btn.y - pop.h - GAP > 0;
    const fitB = () => btn.y + btn.h + pop.h + GAP < win.h;

    switch (align) {
        case 'R':
            if (fitR()) {
                right();
            } else if (fitL()) {
                left();
            } else {
                console.warn('Button is too wide to fit a tooltip next to it');
            }
            break;
        case 'L':
            if (fitL()) {
                left();
            } else if (fitR()) {
                right();
            } else {
                console.warn('Button is too wide to fit a tooltip next to it');
            }
            break;
        case 'T':
            if (fitT()) {
                top();
            } else if (fitB()) {
                bottom();
            } else {
                console.warn(
                    'Button is too tall to fit a tooltip above or below it'
                );
            }
            break;
        default:
            if (fitB()) {
                bottom();
            } else if (fitT()) {
                top();
            } else {
                console.warn(
                    'Button is too tall to fit a tooltip above or below it'
                );
            }
    }

    dom.style(popup, style);
}

function position(popup, button, align) {
    if (align && align.length === 1) {
        // TODO: may want to use TRBL for dropdowns
        // consider checking for a tooltip node instead
        positionTooltip(popup, button, align);
        return;
    }
    clearPosition(popup);
    const LOG = window.debugPopups;

    const GAP = 5;
    const MIN_BOT_SPACE = 200;

    const style = {};
    const bodyPad = dom.style(document.body, 'padding-left');
    const win = {
        w: window.innerWidth,
        h: window.innerHeight,
    };
    const btn = dom.box(button);
    const pop = dom.box(popup);
    const topSpace = btn.top;
    const botSpace = win.h - (btn.top + btn.h + GAP);
    const rightSpace = win.w - btn.x;
    const leftSpace = btn.x + btn.w;

    LOG &&
        console.log(
            '\nbutton:',
            button,
            '\npopup:',
            popup,
            '\nwin',
            win,
            '\npop',
            pop,
            '\nbtn',
            btn,
            '\ntopSpace',
            topSpace,
            '\nbotSpace',
            botSpace,
            '\nleftSpace',
            leftSpace,
            '\nrightSpace',
            rightSpace
        );

    // position left/right & width
    if (align === 'right' || (leftSpace > pop.w && leftSpace > rightSpace)) {
        // left-side
        style.top = btn.y + btn.h;
        style.right = win.w - (btn.x + btn.w);
    } else if (rightSpace > pop.w) {
        // right-side
        style.top = btn.y + btn.h;
        style.left = btn.x;
    } else if (rightSpace > leftSpace) {
        // right-side, resize popup
        style.top = btn.y + btn.h;
        style.left = btn.x;
        style.width = rightSpace - bodyPad;
    } else {
        // left-side, resize popup
        style.top = btn.y + btn.h;
        style.right = win.w - (btn.x + btn.w);
        style.width = leftSpace - bodyPad;
    }

    // position top/bottom & height
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
        // top
        style.top = '';
        style.bottom = win.h - btn.y;
    }

    dom.style(popup, style);
}

function onScroll(hide, popup) {
    return {
        resume: () => {
            window.addEventListener(
                'scroll',
                (e) => {
                    if (e.target.closest && e.target.closest('ui-popup')) {
                        return;
                    }
                    hide(true);
                },
                true
            );
        },
        pause: () => {
            window.removeEventListener('scroll', hide);
        },
        remove: () => {
            window.removeEventListener('scroll', hide);
        },
    };
}
module.exports = BaseComponent.define('ui-popup', UiPopup, {
    props: ['buttonid', 'label', 'align', 'use-hover'],
    bools: ['open'],
});
