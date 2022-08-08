const onKey = require('./onKey');
const onBackspace = require('./onBackspace');
const util = require('./util');

function connectInput() {
    let isMeta;
    let isPaste;
    let beg;
    let end;
    this.on(this.input, 'keypress', util.stopEvent, null);
    this.on(
        this.input,
        'keyup',
        (e) => {
            e.beg = beg;
            e.end = end;
            if (e.key === 'Meta') {
                isMeta = false;
            }
            if (isPaste) {
                isPaste = false;
                this.setValue(this.input.value);
            } else if (e.key === 'Backspace') {
                onBackspace.call(this, e, this.dateType);
            } else {
                onKey.call(this, e, this.dateType);
            }
        },
        null,
    );
    this.on(
        this.input,
        'keydown',
        (e) => {
            beg = e.target.selectionStart;
            end = e.target.selectionEnd;
            const k = e.key;

            if (e.key === 'Backspace') {
                return util.stopEvent(e);
            }
            if (e.key === 'Meta') {
                isMeta = true;
            }
            if (!e.key || (e.key.toLowerCase() === 'v' && isMeta)) {
                // no key means native autocomplete
                isPaste = true;
            }
        },
        null,
    );
}

module.exports = connectInput;
