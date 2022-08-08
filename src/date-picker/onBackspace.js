const util = require('./util');

const LOG = 0;

function onBackspace(e, type) {
    function setSelection(pos) {
        // if (value.charAt(pos) === '/') {
        //     pos -= 1;
        // }
        e.target.selectionEnd = pos;
    }

    let value = this.input.value;
    const beg = e.beg;
    const end = e.end;
    const char = value.charAt(beg - 1);
    let sel = Math.max(0, beg - 1);
    LOG && console.log('onBackspace', char, beg, end, value);

    let temp;
    if (beg === end) {
        LOG && console.log('bk', `"${char}"`);
        if (beg === 0) {
            // do nothing
            return;
        }

        if (char == '/') {
            LOG && console.log('sel /', sel);
            setSelection(sel);
            return;
        }
        if (char === ' ' || char === '-') {
            LOG && console.log('set -');
            // Trying to delete range delimiter
            // back up to end of first date
            setSelection(10);
            return;
        }
        temp = util.insertCharAtPos(value, 'X', beg);
    } else {
        LOG && console.log('repl', `"${char}"`);
        temp = util.replaceText(value, 'X', beg, end, 'X');
        sel += 1;
    }
    this.setValue(temp);

    setSelection(sel);
}

module.exports = onBackspace;
