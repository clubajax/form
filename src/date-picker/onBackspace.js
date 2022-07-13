const util = require('./util');

function onBackspace(e, type) {
    function setSelection(pos) {
        if (value.charAt(pos) === '/') {
            pos += 1;
        }
        e.target.selectionEnd = pos;
    }

    let value = this.input.value;
    const beg = e.beg;
    const end = e.end;

    let temp;
    if (beg === end) {
        temp = util.insertCharAtPos(value, 'X', beg);
    } else {
        temp = util.replaceText(value, 'X', beg, end, 'X');
    }
    this.setValue(temp);

    setSelection(beg - 1);
}

module.exports = onBackspace;
