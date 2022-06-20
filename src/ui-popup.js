const BaseComponent = require('@clubajax/base-component');
const dom = require('@clubajax/dom');
const on = require('@clubajax/on');

// detach popup from body when not showing
// - unless keepPopupsAttached
class UiPopup extends BaseComponent {
    constructor() {
        super();
        this.destroyOnDisconnect = false;
        this.showing = false;
        this.handleMediaQuery = this.handleMediaQuery.bind(this);
        this.align;
        this.buttonid;
        this.label;

        this.noHideOnBlur = true;
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

    get width() {
        const w = dom.box(this).w;
        return w || 100;
    }

    domReady() {
        this.component = this.children[0] || {};
        this.button = dom.byId(this.buttonid);
        const h = this['max-height'];
        this.maxHeight = h === 'none' || !h ? 0 : h;

        dom.attr(this, 'data-no-clickoff', true);
        this.connectEvents();
        if (!this.parentNode) {
            document.body.appendChild(this);
        }

        this.mq = window.matchMedia('(max-width: 415px)');
        this.mq.addEventListener('change', this.handleMediaQuery);
        this.handleMediaQuery(this.mq);

        this.parent = this.parentNode;
        if (this.lazy) {
            this.parent.removeChild(this);
        }
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
            this,
        );
        dom.queryAll(this, '.ui-button-row .ui-button').forEach((button, i) => {
            this.mobileEvents = this.on(
                button,
                'click',
                () => {
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
                },
                null,
            );
        });
    }

    removeMobileButtons() {
        dom.queryAll(this, '.ui-button-row .ui-button').forEach((button) => {
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
                        // if (!e.target.hasAttribute('data-no-clickoff') && !e.target.closest('[data-no-clickoff]')) {
                        if (!e.target.hasAttribute('data-no-clickoff') && !this.button.contains(e.target)) {
                            this.hide();
                        }
                    }),
                    onScroll(this.hide.bind(this), this),
                ]);
                this.on(
                    this.button,
                    'click',
                    (e) => {
                        this.show();
                    },
                    null,
                );
                if (!this.noHideOnBlur) {
                    this.on(
                        this.button,
                        'blur',
                        (e) => {
                            this.hide();
                        },
                        null,
                    );
                }
                this.on(
                    this.button,
                    'keydown',
                    (e) => {
                        if (e.key === 'Enter' && !this.showing) {
                            // prevent key-nav from detecting Enter when not open
                            e.preventDefault();
                            this.show();
                        }
                    },
                    null,
                );
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
        const hide = (immediate) => {
            if (immediate === true) {
                this.hide();
                return;
            }
            timer = setTimeout(() => {
                this.hide();
            }, HIDE_TIMEOUT);
        };
        if (this.button) {
            this.on(this.button, 'mouseenter', show, null);
            this.on(this.button, 'mouseleave', hide, null);
        }
        this.on('mouseenter', show, null, null);
        this.on('mouseleave', hide, null, null);
        this.clickOff = onScroll(hide);
        this.clickOff.resume();
    }

    connectWindowEvents(enable) {
        if (this.winResize) {
            this.winResize.remove();
        }
        if (enable) {
            this.winResize = this.on(window, 'resize', () => {
                this.hide();
            });
        }
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
            if (this.button) {
                // no align options for mobile (?)
                position(this, this.button);
            }
            this.removeMobileButtons();
        }
    }

    show(resize) {
        if (this.showing) {
            if (resize) {
                this.position(true);
            }
            return;
        }
        this.children[0].disabled = false;
        this.showing = true;
        if (this.lazy) {
            this.parent.appendChild(this);
        }

        if (!this.isMobile) {
            const isSet = position(this, this.button, this.align, {
                xPos: this['x-pos'] || 0,
                yPos: this['y-pos'] || 0,
                shift: this.shift,
            });
            if (!isSet) {
                this.showing = false;
                return;
            }
        }

        if (this.clickoff) {
            this.clickoff.resume();
        }

        setTimeout(() => {
            this.classList.add('open');
        }, 1);
        this.isOpening = true;
        setTimeout(() => {
            this.isOpening = false;
        }, 500);
        this.fire('popup-open');
        this.connectWindowEvents(true);
    }

    hide() {
        if (!this.showing || window.keepPopupsOpen || this.isOpening) {
            return;
        }
        if (this.children && this.children[0]) {
            this.children[0].disabled = true;
        }
        this.showing = false;
        this.classList.remove('open');
        if (this.clickoff) {
            this.clickoff.pause();
        }
        this.fire('popup-close');
        setTimeout(() => {
            if (this.lazy && this.parentNode) {
                this.parentNode.removeChild(this);
            }
        }, 500);
        this.connectWindowEvents();
    }

    position(resize) {
        if (resize) {
            clearPosition(this);
            setTimeout(() => {
                position(this, this.button, this.align);
            }, 100);
        }
        position(this, this.button, this.align);
    }

    destroy() {
        if (this.clickoff) {
            this.clickoff.remove();
        }
        if (this.mq) {
            this.mq.removeEventListener('change', this.handleMediaQuery);
        }
        this.destroyed = true;
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
        'max-height': '',
        width: '',
        overflow: '',
    });
}

function positionTooltip(popup, button, align, options) {
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
        console.log('align:', align, '\nbutton:', button, '\npopup:', popup, '\nwin', win, '\npop', pop, '\nbtn', btn);

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
        addClass('R');
        style.left = btn.x + btn.w + GAP;
        if (btn.y < pop.h / 2) {
            style.top = btn.y + btn.h / 2 - 50;
            addClass('side50');
        } else {
            style.top = midY();
        }
    }
    function left() {
        addClass('L');
        style.right = win.w - btn.x + GAP;
        if (btn.y < pop.h / 2) {
            style.top = btn.y + btn.h / 2 - 50;
            addClass('side50');
        } else {
            style.top = midY();
        }
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
    function forceFit() {
        style.left = midX();
        style.top = win.h - pop.h;
        addClass('I');
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
                console.warn('Button is too tall to fit a tooltip above or below it');
                forceFit();
            }
            break;
        default:
            if (fitB()) {
                bottom();
            } else if (fitT()) {
                top();
            } else {
                console.warn('Button is too tall to fit a tooltip above or below it');
                forceFit();
            }
    }

    style.top += options.yPos;
    style.left += options.xPos;

    if (options.shift) {
        if (style.left < pop.w) {
            style.left += pop.w * 0.25;
            tooltip.classList.add('shift-right');
        } else {
            style.left -= pop.w * 0.25;
            tooltip.classList.add('shift-left');
        }
    }

    dom.style(popup, style);
}

function position(popup, button, align, options) {
    if (align && align.length === 1) {
        // TODO: may want to use TRBL for dropdowns
        // consider checking for a tooltip node instead
        positionTooltip(popup, button, align, options);
        return true;
    }
    clearPosition(popup);
    const LOG = window.debugPopups;
    LOG && console.log('position...');
    const GAP = 5;
    const MIN_BOT_SPACE = 200;
    const MAX = popup.maxHeight || Infinity;

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

    if (pop.h < 10) {
        return false;
    }

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
    const popH = MAX < pop.h ? MAX : pop.h;
    if (popH > topSpace && popH > botSpace) {
        // not enough room for the top or bottom
        // if (botSpace < MIN_BOT_SPACE || topSpace > botSpace * 1.5) {
        if (botSpace < topSpace) {
            // force top
            const h = topSpace - GAP * 2;
            style.maxHeight = MAX < h ? MAX : h;
            style.bottom = win.h - btn.y;
            style.top = 'auto';
            style.overflow = 'auto';
            LOG && console.log('force.top', style);
        } else {
            // force bottom
            const h = botSpace - GAP * 2;
            style.maxHeight = MAX < h ? MAX : h;
            style.overflow = 'auto';
            LOG && console.log('force.bottom', style);
        }
    } else if (botSpace < popH) {
        // top
        style.top = 'auto';
        style.bottom = win.h - btn.y;
        if (MAX <= pop.h) {
            style.maxHeight = popH;
            // style.height = popH;
            style.overflow = 'auto';
        }
        LOG && console.log('top', style);
    } else {
        if (MAX <= popH) {
            style.overflow = 'auto';
            style.maxHeight = popH;
        }
        LOG && console.log('bottom', style);
    }

    dom.style(popup, style);
    return true;
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
                true,
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
    props: ['buttonid', 'label', 'align', 'use-hover', 'max-height', 'x-pos', 'y-pos'],
    bools: ['open', 'lazy', 'shift'],
});
